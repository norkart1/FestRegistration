import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, Download, GraduationCap, User, MapPin, Phone, Book, Users } from "lucide-react";
import { PublicRegistration } from "@shared/schema";
import { generatePublicRegistrationPDF, downloadPDF } from "@/lib/pdf-generator";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<PublicRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    // Validate minimum search length on client side
    if (searchTerm.trim().length < 3) {
      toast({
        title: "Search Term Too Short",
        description: "Please enter at least 3 characters to search.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/public/search?name=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to search registrations");
      }
      const results = await response.json();
      setSearchResults(results);
    } catch (error: any) {
      console.error("Search error:", error);
      toast({
        title: "Search Failed",
        description: error.message || "There was an error searching for students. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrintStudent = (student: PublicRegistration) => {
    try {
      const doc = generatePublicRegistrationPDF(student);
      downloadPDF(doc, `${student.fullName}_Registration.pdf`);
      toast({
        title: "PDF Generated",
        description: `Registration report for ${student.fullName} has been downloaded.`,
      });
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast({
        title: "PDF Generation Failed",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <h1 className="text-sm sm:text-xl font-bold text-card-foreground">
                <span className="hidden sm:inline">Registration Management System</span>
                <span className="sm:hidden">RMS</span>
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Public Student Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Enter student name to search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    data-testid="input-search"
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSearch} 
                    disabled={isLoading}
                    data-testid="button-search"
                    className="flex items-center gap-2"
                  >
                    <Search className="h-4 w-4" />
                    Search
                  </Button>
                  {searchResults.length > 0 && (
                    <Button 
                      variant="outline" 
                      onClick={clearSearch}
                      data-testid="button-clear-search"
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search Results */}
          {searchResults.length > 0 ? (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">
                Search Results ({searchResults.length} found)
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((student) => (
                  <Card key={student.id} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <User className="h-5 w-5" />
                          {student.fullName}
                        </CardTitle>
                        <Badge variant={student.category === 'junior' ? 'default' : 'secondary'}>
                          {student.category.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Basic Information */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Place:</span>
                          <span>{student.place}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">Student ID:</span>
                          <span>{student.id.substring(0, 8)}...</span>
                        </div>
                      </div>

                      <Separator />

                      {/* Dars Information */}
                      <div className="space-y-2">
                        <h4 className="font-medium flex items-center gap-2">
                          <Book className="h-4 w-4" />
                          Dars Information
                        </h4>
                        <div className="text-sm space-y-1">
                          <div><span className="font-medium">Dars Name:</span> {student.darsName}</div>
                          <div><span className="font-medium">Dars Place:</span> {student.darsPlace}</div>
                          <div><span className="font-medium">Usthaad:</span> {student.usthaadName}</div>
                        </div>
                      </div>

                      <Separator />

                      {/* Programs */}
                      <div className="space-y-2">
                        <h4 className="font-medium flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Programs
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {student.programs.map((program, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {program}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Actions */}
                      <div className="flex justify-between items-center pt-2">
                        <div className="text-xs text-muted-foreground">
                          Registered: {new Date(student.createdAt).toLocaleDateString()}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handlePrintStudent(student)}
                          data-testid={`button-print-${student.id}`}
                          className="flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Print A4
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : searchTerm && !isLoading ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No students found</h3>
                <p className="text-muted-foreground">
                  No students match your search term "{searchTerm}". Please try a different name.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Welcome to Student Search</h3>
                <p className="text-muted-foreground">
                  Use the search bar above to find student registration details by name.
                </p>
              </CardContent>
            </Card>
          )}

          {isLoading && (
            <Card>
              <CardContent className="py-8 text-center">
                <GraduationCap className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
                <p className="text-muted-foreground">Loading student data...</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}