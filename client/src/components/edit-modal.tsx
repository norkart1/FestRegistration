import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertRegistrationSchema, type InsertRegistration, type Registration } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Save, X } from "lucide-react";
import { useState } from "react";

const JUNIOR_PROGRAMS = {
  stage: ["junior-hamd", "junior-nasheed", "junior-speech"],
  nonStage: ["junior-quran-recitation", "junior-hadith", "junior-essay"]
};

const SENIOR_PROGRAMS = {
  stage: ["senior-debate", "senior-oration", "senior-elocution"],
  nonStage: ["senior-research", "senior-translation", "senior-calligraphy"]
};

const PROGRAM_LABELS = {
  "junior-hamd": "Hamd",
  "junior-nasheed": "Nasheed",
  "junior-speech": "Speech",
  "junior-quran-recitation": "Quran Recitation",
  "junior-hadith": "Hadith",
  "junior-essay": "Essay Writing",
  "senior-debate": "Debate",
  "senior-oration": "Oration",
  "senior-elocution": "Elocution",
  "senior-research": "Research Paper",
  "senior-translation": "Translation",
  "senior-calligraphy": "Calligraphy"
};

interface EditModalProps {
  registration: Registration;
  onClose: () => void;
}

export function EditModal({ registration, onClose }: EditModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertRegistration>({
    resolver: zodResolver(insertRegistrationSchema),
    defaultValues: {
      fullName: registration.fullName,
      aadharNumber: registration.aadharNumber,
      place: registration.place,
      phoneNumber: registration.phoneNumber,
      darsName: registration.darsName,
      darsPlace: registration.darsPlace,
      usthaadName: registration.usthaadName,
      category: registration.category as "junior" | "senior",
      programs: registration.programs,
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: InsertRegistration) => {
      const response = await apiRequest("PUT", `/api/registrations/${registration.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Registration Updated",
        description: "Registration has been updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/registrations"] });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update registration. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertRegistration) => {
    updateMutation.mutate(data);
  };

  const watchedCategory = form.watch("category");
  const watchedPrograms = form.watch("programs");

  const availablePrograms = watchedCategory === "junior" ? JUNIOR_PROGRAMS : SENIOR_PROGRAMS;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" data-testid="modal-edit">
        <DialogHeader>
          <DialogTitle>Edit Registration</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="form-edit">
            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter full name" data-testid="input-edit-fullName" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="aadharNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aadhar Number *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter 12-digit Aadhar number" maxLength={12} data-testid="input-edit-aadhar" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="place"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Place *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your place" data-testid="input-edit-place" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter 10-digit phone number" maxLength={10} data-testid="input-edit-phone" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Dars Information */}
            <Card className="bg-muted">
              <CardHeader>
                <CardTitle>Dars Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="darsName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dars Name *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter Dars name" data-testid="input-edit-darsName" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="darsPlace"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dars Place *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter Dars place" data-testid="input-edit-darsPlace" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="usthaadName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Usthaad Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter Usthaad name" data-testid="input-edit-usthaad" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Category Selection */}
            <Card className="bg-accent">
              <CardHeader>
                <CardTitle>Category Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => {
                            field.onChange(value);
                            form.setValue("programs", []); // Reset programs when category changes
                          }}
                          value={field.value}
                          className="space-y-3"
                        >
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="junior" id="edit-junior" data-testid="radio-edit-junior" />
                            <Label htmlFor="edit-junior" className="font-medium cursor-pointer">Junior</Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="senior" id="edit-senior" data-testid="radio-edit-senior" />
                            <Label htmlFor="edit-senior" className="font-medium cursor-pointer">Senior</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Program Selection */}
            <Card className="border">
              <CardHeader>
                <CardTitle>Program Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="programs"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-muted-foreground">Stage Programs</h5>
                          {availablePrograms.stage.map((program) => (
                            <div key={program} className="flex items-center space-x-2">
                              <Checkbox
                                id={`edit-${program}`}
                                checked={watchedPrograms.includes(program)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...watchedPrograms, program]);
                                  } else {
                                    field.onChange(watchedPrograms.filter(p => p !== program));
                                  }
                                }}
                                data-testid={`checkbox-edit-${program}`}
                              />
                              <Label htmlFor={`edit-${program}`} className="text-sm cursor-pointer">
                                {PROGRAM_LABELS[program as keyof typeof PROGRAM_LABELS]}
                              </Label>
                            </div>
                          ))}
                        </div>
                        
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-muted-foreground">Non-Stage Programs</h5>
                          {availablePrograms.nonStage.map((program) => (
                            <div key={program} className="flex items-center space-x-2">
                              <Checkbox
                                id={`edit-${program}`}
                                checked={watchedPrograms.includes(program)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...watchedPrograms, program]);
                                  } else {
                                    field.onChange(watchedPrograms.filter(p => p !== program));
                                  }
                                }}
                                data-testid={`checkbox-edit-${program}`}
                              />
                              <Label htmlFor={`edit-${program}`} className="text-sm cursor-pointer">
                                {PROGRAM_LABELS[program as keyof typeof PROGRAM_LABELS]}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-6">
              <Button 
                type="submit" 
                className="flex-1" 
                disabled={updateMutation.isPending}
                data-testid="button-save-edit"
              >
                <Save className="mr-2 h-4 w-4" />
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                data-testid="button-cancel-edit"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
