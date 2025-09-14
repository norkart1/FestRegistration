import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { GraduationCap, UserPlus, BarChart3, LogOut, Menu, Settings } from "lucide-react";
import Login from "@/pages/login";
import Registration from "@/pages/registration";
import Dashboard from "@/pages/dashboard";
import Reports from "@/pages/reports";
import ProgramManagement from "@/pages/program-management";
import NotFound from "@/pages/not-found";
import { authApi } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

function Navigation({ currentPath }: { currentPath: string }) {
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await authApi.logout();
      window.location.reload();
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const navItems = [
    { path: "/registration", label: "Registration", icon: UserPlus },
    { path: "/", label: "Dashboard", icon: BarChart3 },
    { path: "/reports", label: "Reports", icon: BarChart3 },
    { path: "/admin/programs", label: "Programs", icon: Settings },
  ];

  return (
    <header className="bg-card border-b border-border shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-card-foreground">Registration Management System</h1>
          </div>
          
          <nav className="flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className="flex items-center space-x-2"
                    data-testid={`nav-${item.label.toLowerCase()}`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-destructive hover:text-destructive/80"
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}

function AuthenticatedApp() {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPath={location} />
      <main className="py-6">
        <Switch>
          <Route path="/registration" component={Registration} />
          <Route path="/reports" component={Reports} />
          <Route path="/admin/programs" component={ProgramManagement} />
          <Route path="/" component={Dashboard} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function Router() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const { data: authStatus } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      const response = await fetch("/api/auth/me", { credentials: "include" });
      return response.json();
    },
    retry: false,
  });

  useEffect(() => {
    if (authStatus !== undefined) {
      setIsAuthenticated(authStatus.authenticated);
    }
  }, [authStatus]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <GraduationCap className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return <AuthenticatedApp />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
