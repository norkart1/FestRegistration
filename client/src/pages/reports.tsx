import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, GraduationCap, Download, FileText } from "lucide-react";
import { generateCategoryReport, downloadPDF } from "@/lib/pdf-generator";
import { Registration, Statistics } from "@shared/schema";
import { useState } from "react";

export default function Reports() {
  const [customCategory, setCustomCategory] = useState("");
  const [customProgramType, setCustomProgramType] = useState("");
  const [customDateRange, setCustomDateRange] = useState("");

  const { data: allRegistrations } = useQuery<Registration[]>({
    queryKey: ["/api/registrations"],
  });

  const { data: stats } = useQuery<Statistics>({
    queryKey: ["/api/statistics"],
  });

  const juniorRegistrations = allRegistrations?.filter(r => r.category === 'junior') || [];
  const seniorRegistrations = allRegistrations?.filter(r => r.category === 'senior') || [];

  const generateReport = async (category: 'junior' | 'senior') => {
    const registrations = category === 'junior' ? juniorRegistrations : seniorRegistrations;
    
    if (registrations.length === 0) {
      alert(`No ${category} registrations found to generate report.`);
      return;
    }

    const doc = generateCategoryReport(registrations, category);
    downloadPDF(doc, `${category}-student-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const generateCustomReport = () => {
    let filteredRegistrations = allRegistrations || [];

    // Apply category filter
    if (customCategory && customCategory !== "all") {
      filteredRegistrations = filteredRegistrations.filter(r => r.category === customCategory);
    }

    // Apply program type filter
    if (customProgramType && customProgramType !== "all") {
      filteredRegistrations = filteredRegistrations.filter(r => {
        const hasStagePrograms = r.programs.some(p => 
          p.includes('hamd') || p.includes('nasheed') || p.includes('speech') || 
          p.includes('debate') || p.includes('oration') || p.includes('elocution')
        );
        const hasNonStagePrograms = r.programs.some(p => 
          p.includes('recitation') || p.includes('hadith') || p.includes('essay') ||
          p.includes('research') || p.includes('translation') || p.includes('calligraphy')
        );

        if (customProgramType === 'stage') return hasStagePrograms;
        if (customProgramType === 'non-stage') return hasNonStagePrograms;
        return true;
      });
    }

    // Apply date range filter
    if (customDateRange && customDateRange !== "all") {
      const now = new Date();
      let filterDate = new Date();

      switch (customDateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filteredRegistrations = filteredRegistrations.filter(r => {
            const regDate = new Date(r.createdAt);
            regDate.setHours(0, 0, 0, 0);
            return regDate.getTime() === filterDate.getTime();
          });
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filteredRegistrations = filteredRegistrations.filter(r => 
            new Date(r.createdAt) >= filterDate
          );
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filteredRegistrations = filteredRegistrations.filter(r => 
            new Date(r.createdAt) >= filterDate
          );
          break;
      }
    }

    if (filteredRegistrations.length === 0) {
      alert('No registrations found matching the selected criteria.');
      return;
    }

    const reportCategory = customCategory || 'custom';
    const doc = generateCategoryReport(filteredRegistrations, reportCategory as 'junior' | 'senior');
    downloadPDF(doc, `custom-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const getStageParticipants = (category: 'junior' | 'senior') => {
    const registrations = category === 'junior' ? juniorRegistrations : seniorRegistrations;
    return registrations.filter(r => {
      return r.programs.some(p => 
        p.includes('hamd') || p.includes('nasheed') || p.includes('speech') || 
        p.includes('debate') || p.includes('oration') || p.includes('elocution')
      );
    }).length;
  };

  const getNonStageParticipants = (category: 'junior' | 'senior') => {
    const registrations = category === 'junior' ? juniorRegistrations : seniorRegistrations;
    return registrations.filter(r => {
      return r.programs.some(p => 
        p.includes('recitation') || p.includes('hadith') || p.includes('essay') ||
        p.includes('research') || p.includes('translation') || p.includes('calligraphy')
      );
    }).length;
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-card-foreground mb-2">Reports & Analytics</h2>
        <p className="text-muted-foreground">Generate and download registration reports</p>
      </div>

      {/* Report Generation Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Users className="h-8 w-8 text-primary mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-card-foreground">Junior Student Report</h3>
                <p className="text-sm text-muted-foreground">Generate comprehensive report for junior category</p>
              </div>
            </div>
            <div className="space-y-3 mb-4">
              <div className="text-sm text-muted-foreground">
                Total Junior Students: <span className="font-medium text-card-foreground" data-testid="text-junior-total">{stats?.junior || 0}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Stage Programs: <span className="font-medium text-card-foreground" data-testid="text-junior-stage">{getStageParticipants('junior')}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Non-Stage Programs: <span className="font-medium text-card-foreground" data-testid="text-junior-nonstage">{getNonStageParticipants('junior')}</span>
              </div>
            </div>
            <Button 
              onClick={() => generateReport('junior')} 
              className="w-full"
              data-testid="button-download-junior"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Junior Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <GraduationCap className="h-8 w-8 text-secondary mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-card-foreground">Senior Student Report</h3>
                <p className="text-sm text-muted-foreground">Generate comprehensive report for senior category</p>
              </div>
            </div>
            <div className="space-y-3 mb-4">
              <div className="text-sm text-muted-foreground">
                Total Senior Students: <span className="font-medium text-card-foreground" data-testid="text-senior-total">{stats?.senior || 0}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Stage Programs: <span className="font-medium text-card-foreground" data-testid="text-senior-stage">{getStageParticipants('senior')}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Non-Stage Programs: <span className="font-medium text-card-foreground" data-testid="text-senior-nonstage">{getNonStageParticipants('senior')}</span>
              </div>
            </div>
            <Button 
              onClick={() => generateReport('senior')} 
              className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
              data-testid="button-download-senior"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Senior Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Program-wise Statistics */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Program-wise Registration Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium text-card-foreground mb-4">Junior Programs</h4>
              <div className="space-y-3">
                {['Hamd', 'Nasheed', 'Speech', 'Quran Recitation', 'Hadith', 'Essay Writing'].map((program) => {
                  const count = juniorRegistrations.filter(r => 
                    r.programs.some(p => p.toLowerCase().includes(program.toLowerCase().replace(/\s+/g, '-')))
                  ).length;
                  return (
                    <div key={program} className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{program}</span>
                      <span className="text-sm font-medium text-card-foreground">{count} students</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-card-foreground mb-4">Senior Programs</h4>
              <div className="space-y-3">
                {['Debate', 'Oration', 'Elocution', 'Research Paper', 'Translation', 'Calligraphy'].map((program) => {
                  const count = seniorRegistrations.filter(r => 
                    r.programs.some(p => p.toLowerCase().includes(program.toLowerCase().replace(/\s+/g, '-')))
                  ).length;
                  return (
                    <div key={program} className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{program}</span>
                      <span className="text-sm font-medium text-card-foreground">{count} students</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Report Generation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">Category</label>
              <Select value={customCategory} onValueChange={setCustomCategory}>
                <SelectTrigger data-testid="select-custom-category">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="junior">Junior Only</SelectItem>
                  <SelectItem value="senior">Senior Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">Program Type</label>
              <Select value={customProgramType} onValueChange={setCustomProgramType}>
                <SelectTrigger data-testid="select-custom-program">
                  <SelectValue placeholder="All Programs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Programs</SelectItem>
                  <SelectItem value="stage">Stage Programs</SelectItem>
                  <SelectItem value="non-stage">Non-Stage Programs</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">Date Range</label>
              <Select value={customDateRange} onValueChange={setCustomDateRange}>
                <SelectTrigger data-testid="select-custom-date">
                  <SelectValue placeholder="All Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            onClick={generateCustomReport} 
            variant="outline"
            data-testid="button-generate-custom"
          >
            <FileText className="mr-2 h-4 w-4" />
            Generate Custom Report
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
