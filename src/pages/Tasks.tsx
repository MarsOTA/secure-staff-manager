
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface TaskEvent {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  location: string;
  status: string;
}

const Tasks = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<TaskEvent[]>([]);
  const [checkingStatus, setCheckingStatus] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    if (user.auth_type !== 'operator') {
      navigate("/dashboard");
      return;
    }

    loadTodayEvents();
  }, [user, navigate]);

  const loadTodayEvents = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: eventOperators, error } = await supabase
        .from('event_operators')
        .select(`
          event_id,
          events (
            id,
            title,
            start_date,
            end_date,
            location
          )
        `)
        .eq('operator_id', user?.id)
        .gte('events.start_date', today.toISOString())
        .lt('events.end_date', new Date(today.setDate(today.getDate() + 1)).toISOString());

      if (error) throw error;

      const formattedEvents = eventOperators.map(eo => ({
        id: eo.events.id,
        title: eo.events.title,
        start_date: eo.events.start_date,
        end_date: eo.events.end_date,
        location: eo.events.location,
        status: 'upcoming'
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error loading events:', error);
      toast.error("Errore nel caricamento degli eventi");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckInOut = async (eventId: number) => {
    if (!user) return;

    setCheckingStatus(prev => ({ ...prev, [eventId]: true }));

    try {
      // Get current position
      const position = await getCurrentPosition();
      
      // Get the latest attendance record for this event
      const { data: lastAttendance } = await supabase
        .from('attendance')
        .select('status')
        .eq('event_id', eventId)
        .eq('operator_id', user.id)
        .order('timestamp', { ascending: false })
        .limit(1);

      const isCheckIn = !lastAttendance || lastAttendance[0]?.status === 'check-out';
      
      const { error } = await supabase
        .from('attendance')
        .insert({
          operator_id: user.id,
          event_id: eventId,
          status: isCheckIn ? 'check-in' : 'check-out',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });

      if (error) throw error;

      toast.success(`${isCheckIn ? 'Check-in' : 'Check-out'} effettuato con successo`);
      loadTodayEvents();
    } catch (error) {
      console.error('Error during check-in/out:', error);
      toast.error("Errore durante il check-in/out");
    } finally {
      setCheckingStatus(prev => ({ ...prev, [eventId]: false }));
    }
  };

  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocalizzazione non supportata"));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">I miei turni di oggi</h1>
        {events.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">Nessun turno programmato per oggi</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {events.map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <div>
                      <span className="font-medium">Periodo:</span>{" "}
                      {format(new Date(event.start_date), "dd/MM/yyyy")} -{" "}
                      {format(new Date(event.end_date), "dd/MM/yyyy")}
                    </div>
                    <div>
                      <span className="font-medium">Orario:</span>{" "}
                      {format(new Date(event.start_date), "HH:mm")} -{" "}
                      {format(new Date(event.end_date), "HH:mm")}
                    </div>
                    <div>
                      <span className="font-medium">Luogo:</span> {event.location}
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => handleCheckInOut(event.id)}
                    disabled={checkingStatus[event.id]}
                  >
                    {checkingStatus[event.id] ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}
                    Check-in/out
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Tasks;
