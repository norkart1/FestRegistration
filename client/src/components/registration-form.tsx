import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertRegistrationSchema, type InsertRegistration, type Program } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Save, RotateCcw } from "lucide-react";

export function RegistrationForm() {
  const [selectedCategory, setSelectedCategory] = useState<"junior" | "senior" | "">("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertRegistration>({
    resolver: zodResolver(insertRegistrationSchema),
    defaultValues: {
      fullName: "",
      aadharNumber: "",
      place: "",
      phoneNumber: "",
      darsName: "",
      darsPlace: "",
      usthaadName: "",
      category: "junior",
      programs: [],
    },
  });

  const registrationMutation = useMutation({
    mutationFn: async (data: InsertRegistration) => {
      const response = await apiRequest("POST", "/api/registrations", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful",
        description: "Student has been registered successfully!",
      });
      form.reset();
      setSelectedCategory("");
      queryClient.invalidateQueries({ queryKey: ["/api/registrations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/statistics"] });
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register student. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertRegistration) => {
    registrationMutation.mutate(data);
  };

  const resetForm = () => {
    form.reset();
    setSelectedCategory("");
  };

  const watchedCategory = form.watch("category");
  const watchedPrograms = form.watch("programs");

  // Fetch programs from API
  const { data: allPrograms = [], isLoading: programsLoading } = useQuery<Program[]>({
    queryKey: ["/api/programs"],
  });

  // Filter programs by category and group by type
  const availablePrograms = {
    stage: allPrograms.filter(p => p.category === watchedCategory && p.type === 'stage' && p.isActive),
    nonStage: allPrograms.filter(p => p.category === watchedCategory && p.type === 'non-stage' && p.isActive)
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="form-registration">
        {/* Basic Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter full name" data-testid="input-fullName" />
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
                  <Input {...field} placeholder="Enter 12-digit Aadhar number" maxLength={12} data-testid="input-aadharNumber" />
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
                  <Input {...field} placeholder="Enter your place" data-testid="input-place" />
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
                <FormLabel>Instructor Phone Number *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter instructor's 10-digit phone number" maxLength={10} data-testid="input-phoneNumber" />
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
                      <Input {...field} placeholder="Enter Dars name" data-testid="input-darsName" />
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
                      <Input {...field} placeholder="Enter Dars place" data-testid="input-darsPlace" />
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
                    <Input {...field} placeholder="Enter Usthaad name" data-testid="input-usthaadName" />
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
                        setSelectedCategory(value as "junior" | "senior");
                        form.setValue("programs", []); // Reset programs when category changes
                      }}
                      value={field.value}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="junior" id="junior" data-testid="radio-junior" />
                        <Label htmlFor="junior" className="font-medium cursor-pointer">Junior</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="senior" id="senior" data-testid="radio-senior" />
                        <Label htmlFor="senior" className="font-medium cursor-pointer">Senior</Label>
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
        {watchedCategory && (
          <Card className="border">
            <CardHeader>
              <CardTitle>Program Selection</CardTitle>
            </CardHeader>
            <CardContent>
              {programsLoading ? (
                <div className="text-center py-8">
                  <div className="text-muted-foreground">Loading programs...</div>
                </div>
              ) : (
              <FormField
                control={form.control}
                name="programs"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-muted-foreground">Stage Programs</h5>
                        {availablePrograms.stage.map((program) => (
                          <div key={program.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={program.programId}
                              checked={watchedPrograms.includes(program.programId)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...watchedPrograms, program.programId]);
                                } else {
                                  field.onChange(watchedPrograms.filter(p => p !== program.programId));
                                }
                              }}
                              data-testid={`checkbox-${program.programId}`}
                            />
                            <Label htmlFor={program.programId} className="text-sm cursor-pointer">
                              {program.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                      
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-muted-foreground">Non-Stage Programs</h5>
                        {availablePrograms.nonStage.map((program) => (
                          <div key={program.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={program.programId}
                              checked={watchedPrograms.includes(program.programId)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...watchedPrograms, program.programId]);
                                } else {
                                  field.onChange(watchedPrograms.filter(p => p !== program.programId));
                                }
                              }}
                              data-testid={`checkbox-${program.programId}`}
                            />
                            <Label htmlFor={program.programId} className="text-sm cursor-pointer">
                              {program.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              )}
            </CardContent>
          </Card>
        )}

        {/* Submit Buttons */}
        <div className="flex space-x-4 pt-6">
          <Button 
            type="submit" 
            className="flex-1" 
            disabled={registrationMutation.isPending}
            data-testid="button-submit"
          >
            <Save className="mr-2 h-4 w-4" />
            {registrationMutation.isPending ? "Submitting..." : "Submit Registration"}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={resetForm}
            data-testid="button-reset"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
}
