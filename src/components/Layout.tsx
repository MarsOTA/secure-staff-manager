
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Briefcase, Building2, LogOut } from "lucide-react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/dashboard" className="text-2xl font-bold">
            Security Management
          </Link>
          <div className="flex gap-4">
            <Link to="/operators">
              <Button variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Operatori
              </Button>
            </Link>
            <Link to="/clients">
              <Button variant="outline">
                <Building2 className="mr-2 h-4 w-4" />
                Clienti
              </Button>
            </Link>
            <Link to="/events">
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Eventi
              </Button>
            </Link>
            <Link to="/calendar">
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Calendario
              </Button>
            </Link>
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
