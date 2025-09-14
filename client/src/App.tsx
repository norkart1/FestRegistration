import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { GraduationCap, UserPlus, BarChart3, LogOut, Menu, Settings, X } from "lucide-react";
import Login from "@/pages/login";
import Registration from "@/pages/registration";
import Dashboard from "@/pages/dashboard";
import Reports from "@/pages/reports";
import ProgramManagement from "@/pages/program-management";
import NotFound from "@/pages/not-found";
import { authApi } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "wouter";

function Navigation({ currentPath }: { currentPath: string }) {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const NavItems = ({ mobile = false }) => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPath === item.path;
        return (
          <Link key={item.path} href={item.path}>
            <Button
              variant={isActive ? "default" : "ghost"}
              className={`flex items-center space-x-2 ${mobile ? "w-full justify-start" : ""}`}
              data-testid={`nav-${item.label.toLowerCase()}`}
              onClick={() => mobile && setMobileMenuOpen(false)}
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
        className={`text-destructive hover:text-destructive/80 ${mobile ? "w-full justify-start" : ""}`}
        data-testid="button-logout"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    </>
  );

  return (
    <header className="bg-card border-b border-border shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <h1 className="text-sm sm:text-xl font-bold text-card-foreground">
              <span className="hidden sm:inline">Registration Management System</span>
              <span className="sm:hidden">RMS</span>
            </h1>
          </div>
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="flex items-center space-x-6">
              <NavItems />
            </nav>
          )}

          {/* Mobile Navigation */}
          {isMobile && (
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <div className="flex flex-col space-y-4 mt-6">
                  <NavItems mobile />
                </div>
              </SheetContent>
            </Sheet>
          )}
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
