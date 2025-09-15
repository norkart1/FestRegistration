import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProgramSchema, type InsertProgram, type Program } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit2, Trash2, Users, Trophy, BookOpen } from "lucide-react";

export default function ProgramManagement() {
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: programs = [], isLoading } = useQuery<Program[]>({
    queryKey: ["/api/admin/programs"],
  });

  const form = useForm<InsertProgram>({
    resolver: zodResolver(insertProgramSchema),
    defaultValues: {
      programId: "",
      name: "",
      category: "junior",
      type: "stage",
      isActive: true,
      displayOrder: 0,
    },
    mode: "onChange",
    reValidateMode: "onChange"
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertProgram) => {
      const response = await apiRequest("POST", "/api/admin/programs", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Program Created",
        description: "New program has been created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/programs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/programs"] });
      setIsAddDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create program. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: InsertProgram) => {
      if (!editingProgram) return;
      const response = await apiRequest("PUT", `/api/admin/programs/${editingProgram.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Program Updated",
        description: "Program has been updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/programs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/programs"] });
      setIsEditDialogOpen(false);
      setEditingProgram(null);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update program. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (programId: string) => {
      const response = await apiRequest("DELETE", `/api/admin/programs/${programId}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Program Deleted",
        description: "Program has been deleted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/programs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/programs"] });
    },
    onError: (error: any) => {
      toast({
        title: "Deletion Failed",
        description: error.message || "Failed to delete program. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertProgram) => {
    if (editingProgram) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (program: Program) => {
    setEditingProgram(program);
    form.reset({
      programId: program.programId,
      name: program.name,
      category: program.category as "junior" | "senior",
      type: program.type as "stage" | "non-stage",
      isActive: program.isActive,
      displayOrder: program.displayOrder,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (programId: string) => {
    deleteMutation.mutate(programId);
  };

  const juniorPrograms = programs.filter(p => p.category === 'junior');
  const seniorPrograms = programs.filter(p => p.category === 'senior');

  const ProgramTable = ({ programs, title }: { programs: Program[], title: string }) => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {title === "Junior Programs" ? <Users className="h-5 w-5" /> : <Trophy className="h-5 w-5" />}
          {title} ({programs.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full" data-testid={`table-${title.toLowerCase().replace(' ', '-')}`}>
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Program ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Order
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {programs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No programs found
                  </td>
                </tr>
              ) : (
                programs.map((program) => (
                  <tr key={program.id} data-testid={`row-program-${program.id}`}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <code className="text-sm bg-muted px-2 py-1 rounded">{program.programId}</code>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-card-foreground">{program.name}</div>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={program.type === 'stage' ? 'default' : 'secondary'}>
                        {program.type}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={program.isActive ? 'default' : 'destructive'}>
                        {program.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      {program.displayOrder}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(program)}
                          data-testid={`button-edit-${program.id}`}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              data-testid={`button-delete-${program.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Program</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{program.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(program.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
  );

  const ProgramForm = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-testid="form-program">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="programId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Program ID *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="e.g., junior-qiraat" 
                    data-testid="input-program-id"
                    autoComplete="off"
                    spellCheck="false"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Program Name *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="e.g., ഖിറാഅത്ത്" 
                    data-testid="input-program-name"
                    autoComplete="off"
                    spellCheck="false"
                    lang="ml"
                    inputMode="text"
                    dir="auto"
                    className="font-malayalam"
                    onFocus={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    style={{ 
                      fontFamily: "'Noto Sans Malayalam', 'Noto Sans', system-ui, Arial, sans-serif",
                      unicodeBidi: "isolate",
                      textAlign: "start"
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="junior">Junior</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="stage">Stage</SelectItem>
                    <SelectItem value="non-stage">Non-Stage</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="displayOrder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Order</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  data-testid="input-display-order"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsAddDialogOpen(false);
              setIsEditDialogOpen(false);
              setEditingProgram(null);
              form.reset();
            }}
            data-testid="button-cancel"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
            data-testid="button-save"
          >
            {editingProgram ? "Update" : "Create"} Program
          </Button>
        </div>
      </form>
    </Form>
  );

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">Loading programs...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2" data-testid="title-program-management">
            <BookOpen className="h-8 w-8" />
            Program Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage competition programs for junior and senior categories
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 px-3 text-xs"
              data-testid="button-add-program"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Program
            </Button>
          </DialogTrigger>
          <DialogContent 
            className="max-w-md overflow-hidden" 
            data-testid="dialog-add-program"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>Add New Program</DialogTitle>
              <DialogDescription>
                Create a new program for the registration system. Fill in the required information below.
              </DialogDescription>
            </DialogHeader>
            <ProgramForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Programs</p>
                <p className="text-2xl font-bold" data-testid="stat-total-programs">{programs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Junior Programs</p>
                <p className="text-2xl font-bold" data-testid="stat-junior-programs">{juniorPrograms.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Trophy className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Senior Programs</p>
                <p className="text-2xl font-bold" data-testid="stat-senior-programs">{seniorPrograms.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <ProgramTable programs={juniorPrograms} title="Junior Programs" />
      <ProgramTable programs={seniorPrograms} title="Senior Programs" />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent 
          className="max-w-md overflow-hidden" 
          data-testid="dialog-edit-program"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Edit Program</DialogTitle>
            <DialogDescription>
              Modify the program details below. Changes will be saved automatically.
            </DialogDescription>
          </DialogHeader>
          <ProgramForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}