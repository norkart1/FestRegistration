import { Registration } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Award } from "lucide-react";
import { getProgramLabel, categorizePrograms } from "@shared/program-constants";

interface ViewModalProps {
  registration: Registration;
  onClose: () => void;
}

export function ViewModal({ registration, onClose }: ViewModalProps) {

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" data-testid="modal-view">
        <DialogHeader>
          <DialogTitle>Registration Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Full Name</label>
                  <p className="text-card-foreground" data-testid="text-view-fullName">{registration.fullName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Aadhar Number</label>
                  <p className="text-card-foreground" data-testid="text-view-aadhar">{registration.aadharNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Place</label>
                  <p className="text-card-foreground" data-testid="text-view-place">{registration.place}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dars Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dars Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Dars Name</label>
                  <p className="text-card-foreground" data-testid="text-view-darsName">{registration.darsName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Dars Place</label>
                  <p className="text-card-foreground" data-testid="text-view-darsPlace">{registration.darsPlace}</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Usthaad Name</label>
                  <p className="text-card-foreground" data-testid="text-view-usthaad">{registration.usthaadName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Usthad Number</label>
                  <p className="text-card-foreground" data-testid="text-view-phone">{registration.phoneNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category and Programs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Category and Programs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Category</label>
                <Badge variant={registration.category === 'junior' ? 'default' : 'secondary'}>
                  {registration.category.toUpperCase()}
                </Badge>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Selected Programs</label>
                {(() => {
                  const categorizedPrograms = categorizePrograms(registration.programs);
                  return (
                    <div className="space-y-3">
                      {categorizedPrograms.stage.length > 0 && (
                        <div>
                          <div className="flex items-center gap-1 mb-2">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span className="text-xs font-medium text-muted-foreground">Stage Programs</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {categorizedPrograms.stage.map((program, index) => (
                              <Badge key={index} variant="default">
                                {getProgramLabel(program)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {categorizedPrograms.nonStage.length > 0 && (
                        <div>
                          <div className="flex items-center gap-1 mb-2">
                            <Award className="h-3 w-3 text-blue-500" />
                            <span className="text-xs font-medium text-muted-foreground">Non-Stage Programs</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {categorizedPrograms.nonStage.map((program, index) => (
                              <Badge key={index} variant="secondary">
                                {getProgramLabel(program)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </CardContent>
          </Card>

          {/* Registration Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Registration Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Registration Date</label>
                  <p className="text-card-foreground">
                    {new Date(registration.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Last Updated</label>
                  <p className="text-card-foreground">
                    {new Date(registration.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
