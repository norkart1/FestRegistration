import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, GraduationCap, Calendar } from "lucide-react";
import { RegistrationTable } from "@/components/registration-table";
import { Statistics } from "@shared/schema";
import { useState } from "react";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  
  const { data: stats, isLoading: statsLoading } = useQuery<Statistics>({
    queryKey: ["/api/statistics"],
  });

  const { data: registrations, isLoading: registrationsLoading } = useQuery({
    queryKey: ["/api/registrations", categoryFilter, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (categoryFilter && categoryFilter !== "all") params.append("category", categoryFilter);
      if (searchQuery) params.append("search", searchQuery);
      
      const response = await fetch(`/api/registrations?${params}`, {
        credentials: "include"
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch registrations");
      }
      
      return response.json();
    },
  });

  const handleSearch = () => {
    // The query will automatically refetch due to the dependency on searchQuery
  };

  if (statsLoading) {
    return <div className="flex items-center justify-center h-64">Loading statistics...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6">
      {/* Dashboard Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-card-foreground mb-2">Registration Dashboard</h2>
        <p className="text-muted-foreground text-sm sm:text-base">Manage and monitor all student registrations</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Total Registrations</p>
                <p className="text-lg sm:text-2xl font-bold text-card-foreground" data-testid="stat-total">
                  {stats?.total || 0}
                </p>
              </div>
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Junior Students</p>
                <p className="text-lg sm:text-2xl font-bold text-card-foreground" data-testid="stat-junior">
                  {stats?.junior || 0}
                </p>
              </div>
              <UserCheck className="h-6 w-6 sm:h-8 sm:w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Senior Students</p>
                <p className="text-lg sm:text-2xl font-bold text-card-foreground" data-testid="stat-senior">
                  {stats?.senior || 0}
                </p>
              </div>
              <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Today's Registrations</p>
                <p className="text-lg sm:text-2xl font-bold text-card-foreground" data-testid="stat-today">
                  {stats?.today || 0}
                </p>
              </div>
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search by name, Aadhar, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search"
              />
            </div>
            <div className="flex gap-3 sm:gap-4">
              <div className="flex-1 sm:flex-initial">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-48" data-testid="select-category">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="junior">Junior</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSearch} data-testid="button-filter" className="flex-shrink-0">
                Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registration Table */}
      <RegistrationTable 
        registrations={registrations || []} 
        isLoading={registrationsLoading}
      />
    </div>
  );
}
