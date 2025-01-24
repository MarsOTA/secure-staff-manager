import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Users, Calendar as CalendarIcon, Briefcase, Building2, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { logout } = useAuth();
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
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
                <Briefcase className="mr-2 h-4 w-4" />
                Eventi
              </Button>
            </Link>
            <Button variant="outline" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="animate-slide-up">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eventi Totali</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
            </CardContent>
          </Card>

          <Card className="animate-slide-up [animation-delay:100ms]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Personale Totale
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">48</div>
            </CardContent>
          </Card>

          <Card className="animate-slide-up [animation-delay:200ms]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Contratti in Scadenza
              </CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
            </CardContent>
          </Card>

          <Card className="col-span-1 md:col-span-2 lg:col-span-1 animate-slide-up [animation-delay:300ms]">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Calendario</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;