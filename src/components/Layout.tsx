
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Briefcase, Building2, LogOut, User } from "lucide-react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to={user?.auth_type === 'operator' ? "/tasks" : "/dashboard"} className="text-2xl font-bold">
            Security Management
          </Link>
          <div className="flex gap-4">
            {user?.auth_type === 'operator' ? (
              // Operator navigation
              <>
                <Link to="/tasks">
                  <Button variant={location.pathname === '/tasks' ? "default" : "outline"}>
                    <Calendar className="mr-2 h-4 w-4" />
                    I Miei Turni
                  </Button>
                </Link>
                <Link to={`/operator-profile/${user.id}`}>
                  <Button variant={location.pathname.includes('/operator-profile') ? "default" : "outline"}>
                    <User className="mr-2 h-4 w-4" />
                    Il Mio Profilo
                  </Button>
                </Link>
              </>
            ) : (
              // Admin navigation
              <>
                <Link to="/operators">
                  <Button variant={location.pathname === '/operators' ? "default" : "outline"}>
                    <Users className="mr-2 h-4 w-4" />
                    Operatori
                  </Button>
                </Link>
                <Link to="/clients">
                  <Button variant={location.pathname === '/clients' ? "default" : "outline"}>
                    <Building2 className="mr-2 h-4 w-4" />
                    Clienti
                  </Button>
                </Link>
                <Link to="/events">
                  <Button variant={location.pathname === '/events' ? "default" : "outline"}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Eventi
                  </Button>
                </Link>
                <Link to="/calendar">
                  <Button variant={location.pathname === '/calendar' ? "default" : "outline"}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Calendario
                  </Button>
                </Link>
              </>
            )}
            <Button variant="outline" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
};

export default Layout;
