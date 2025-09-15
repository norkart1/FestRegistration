import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, Download, GraduationCap, User, MapPin, Phone, Book, Users, LogIn, UserPlus } from "lucide-react";
import { PublicRegistration } from "@shared/schema";
import { generatePublicRegistrationPDF, downloadPDF } from "@/lib/pdf-generator";
import { useToast } from "@/hooks/use-toast";

interface Suggestion {
  id: string;
  fullName: string;
  place: string;
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<PublicRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Debounced search for suggestions
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchTerm.trim().length >= 2) {
        try {
          const response = await fetch(`/api/public/suggestions?name=${encodeURIComponent(searchTerm)}`);
          if (response.ok) {
            const suggestionsData = await response.json();
            setSuggestions(suggestionsData);
            setShowSuggestions(true);
            setSelectedSuggestionIndex(-1);
          }
        } catch (error) {
          console.error("Suggestions fetch error:", error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Hide suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === "Enter") {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > -1 ? prev - 1 : -1);
        break;
      case "Enter":
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          selectSuggestion(suggestions[selectedSuggestionIndex]);
        } else {
          handleSearch();
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  const selectSuggestion = (suggestion: Suggestion) => {
    setSearchTerm(suggestion.fullName);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    // Trigger search with the selected name
    setTimeout(() => handleSearch(), 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Clear search results if input is cleared
    if (!value.trim()) {
      setSearchResults([]);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

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
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/registration">
                <Button variant="outline" size="sm" data-testid="button-register">
                  <UserPlus className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Register</span>
                  <span className="sm:hidden">Join</span>
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="default" size="sm" data-testid="button-admin-login">
                  <LogIn className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Admin Login</span>
                  <span className="sm:hidden">Login</span>
                </Button>
              </Link>
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
                <div className="flex-1 relative" ref={suggestionsRef}>
                  <Input
                    ref={inputRef}
                    placeholder="Enter student name to search..."
                    value={searchTerm}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setShowSuggestions(suggestions.length > 0)}
                    data-testid="input-search"
                    className="w-full"
                  />
                  
                  {/* Suggestions Dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={suggestion.id}
                          className={`px-4 py-2 cursor-pointer transition-colors ${
                            index === selectedSuggestionIndex
                              ? "bg-accent text-accent-foreground"
                              : "hover:bg-muted"
                          }`}
                          onClick={() => selectSuggestion(suggestion)}
                          data-testid={`suggestion-${index}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{suggestion.fullName}</span>
                            <span className="text-sm text-muted-foreground">{suggestion.place}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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