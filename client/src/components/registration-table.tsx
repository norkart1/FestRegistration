import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Printer, Trash2 } from "lucide-react";
import { Registration } from "@shared/schema";
import { ViewModal } from "./view-modal.tsx";
import { EditModal } from "./edit-modal.tsx";
import { PrintView } from "./print-view.tsx";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { generateRegistrationPDF, downloadPDF } from "@/lib/pdf-generator";
import { getProgramLabel, normalizeProgramIds } from "@shared/program-constants";

interface RegistrationTableProps {
  registrations: Registration[];
  isLoading: boolean;
}

export function RegistrationTable({ registrations, isLoading }: RegistrationTableProps) {
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPrintView, setShowPrintView] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/registrations/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Registration Deleted",
        description: "Registration has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/registrations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/statistics"] });
    },
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete registration.",
        variant: "destructive",
      });
    },
  });

  const handleView = (registration: Registration) => {
    setSelectedRegistration(registration);
    setShowViewModal(true);
  };

  const handleEdit = (registration: Registration) => {
    setSelectedRegistration(registration);
    setShowEditModal(true);
  };

  const handlePrint = (registration: Registration) => {
    const doc = generateRegistrationPDF(registration);
    downloadPDF(doc, `registration-${registration.fullName.replace(/\s+/g, '-')}.pdf`);
  };

  const handleDelete = (registration: Registration) => {
    if (confirm(`Are you sure you want to delete the registration for ${registration.fullName}?`)) {
      deleteMutation.mutate(registration.id);
    }
  };

  const formatPrograms = (programs: string[]) => {
    const normalizedPrograms = normalizeProgramIds(programs);
    return normalizedPrograms.map(program => getProgramLabel(program));
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading registrations...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Registered Students</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Mobile-friendly responsive table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] md:min-w-0" data-testid="table-registrations">
              <thead className="bg-muted">
                <tr>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Student Info
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                    Category
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                    Programs
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                    Dars Info
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {registrations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                      No registrations found
                    </td>
                  </tr>
                ) : (
                  registrations.map((registration) => (
                    <tr key={registration.id} data-testid={`row-registration-${registration.id}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-card-foreground" data-testid={`text-name-${registration.id}`}>
                            {registration.fullName}
                          </div>
                          <div className="text-sm text-muted-foreground" data-testid={`text-aadhar-${registration.id}`}>
                            {registration.aadharNumber}
                          </div>
                          <div className="text-sm text-muted-foreground" data-testid={`text-phone-${registration.id}`}>
                            {registration.phoneNumber}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge 
                          variant={registration.category === 'junior' ? 'default' : 'secondary'}
                          data-testid={`badge-category-${registration.id}`}
                        >
                          {registration.category.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {formatPrograms(registration.programs).map((program, index) => (
                            <Badge key={index} variant="outline" className="mr-1 mb-1">
                              {program}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-card-foreground" data-testid={`text-dars-${registration.id}`}>
                            {registration.darsName}
                          </div>
                          <div className="text-muted-foreground" data-testid={`text-usthaad-${registration.id}`}>
                            {registration.usthaadName}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(registration)}
                            data-testid={`button-view-${registration.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(registration)}
                            data-testid={`button-edit-${registration.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePrint(registration)}
                            data-testid={`button-print-${registration.id}`}
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(registration)}
                            disabled={deleteMutation.isPending}
                            data-testid={`button-delete-${registration.id}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      {showViewModal && selectedRegistration && (
        <ViewModal
          registration={selectedRegistration}
          onClose={() => setShowViewModal(false)}
        />
      )}

      {showEditModal && selectedRegistration && (
        <EditModal
          registration={selectedRegistration}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {showPrintView && selectedRegistration && (
        <PrintView
          registration={selectedRegistration}
          onClose={() => setShowPrintView(false)}
        />
      )}
    </>
  );
}
