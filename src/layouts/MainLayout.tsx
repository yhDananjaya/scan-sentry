
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, Search, Settings, LogOut, Menu, X, Shield, Activity, Box } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
      path: "/dashboard",
    },
    {
      name: "Docker Scanner",
      icon: <Box className="mr-2 h-4 w-4" />,
      path: "/docker-scanner",
    },
    {
      name: "Scan Results",
      icon: <Shield className="mr-2 h-4 w-4" />,
      path: "/scan-results",
    },
    {
      name: "Settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
      path: "/settings",
    },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-0 z-40 h-screen transition-all duration-300",
          isSidebarOpen ? "w-64" : "w-20",
          "bg-sidebar border-r border-sidebar-border"
        )}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              {isSidebarOpen && (
                <span className="font-bold text-xl">ScanSentry</span>
              )}
            </Link>
          </div>
          
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-md",
                  location.pathname === item.path
                    ? "bg-primary/10 text-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                {item.icon}
                {isSidebarOpen && <span>{item.name}</span>}
              </Link>
            ))}
          </nav>
          
          <div className="p-4 mt-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="ml-auto"
            >
              {isSidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300",
        isSidebarOpen ? "ml-64" : "ml-20"
      )}>
        {/* Header */}
        <header className="h-16 border-b bg-card flex items-center justify-between px-4 sm:px-6">
          <div>
            <h1 className="text-lg font-semibold">
              {navItems.find(item => item.path === location.pathname)?.name || "Scan Sentry"}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search */}
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Activity className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-primary text-white">
                3
              </Badge>
            </Button>
            
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                    <AvatarFallback>{user?.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-background p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
