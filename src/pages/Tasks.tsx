
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MapPin, Clock, ArrowRight, ArrowLeft } from "lucide-react";

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
  const [attendanceStatus, setAttendanceStatus] = useState<Record<number, string>>({});

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
      setLoading(true);
      console.log("Loading events for operator ID:", user?.id);
      
      // Check for test/demo data
      if (user?.email === "operator@example.com") {
        // Provide some demo events for the test operator
        const today = new Date();
        const endTime = new Date(today);
        endTime.setHours(today.getHours() + 4);
        
        setEvents([
          {
            id: 999,
            title: "Demo Event for Testing",
            start_date: today.toISOString(),
            end_date: endTime.toISOString(),
            location: "Demo Location",
            status: "upcoming"
          }
        ]);
        
        // Set a default attendance status for the demo event
        setAttendanceStatus({ 999: 'check-out' }); // Starting with check-out so the button shows check-in
        
        setLoading(false);
        return;
      }

      // Query assigned events for the operator
      const { data: eventOperators, error } = await supabase
        .from('event_operators')
        .select(`
          event_id,
          events (
            id,
            title,
            start_date,
            end_date,
            location,
            status
          )
        `)
        .eq('operator_id', user?.id);

      if (error) {
        console.error("Error fetching events:", error);
        toast.error("Errore nel caricamento degli eventi");
        setLoading(false);
        return;
      }

      console.log("Raw events data:", eventOperators);

      if (!eventOperators || eventOperators.length === 0) {
        console.log("No events found for operator");
        setEvents([]);
        setLoading(false);
        return;
      }

      // Format the events
      const formattedEvents = eventOperators
        .filter(eo => eo.events) // Filter out any entries with null events
        .map(eo => ({
          id: eo.events.id,
          title: eo.events.title,
          start_date: eo.events.start_date,
          end_date: eo.events.end_date,
          location: eo.events.location || "",
          status: eo.events.status || "upcoming"
        }));
      
      console.log("Formatted events:", formattedEvents);
      
      setEvents(formattedEvents);

      // Load attendance status for each event
      for (const event of formattedEvents) {
        await loadAttendanceStatus(event.id);
      }
      
    } catch (error) {
      console.error('Error loading events:', error);
      toast.error("Errore nel caricamento degli eventi");
    } finally {
      setLoading(false);
    }
  };

  const loadAttendanceStatus = async (eventId: number) => {
    if (!user?.id) return;

    try {
      // Get the latest attendance record for this event
      const { data: lastAttendance, error } = await supabase
        .from('attendance')
        .select('status')
        .eq('event_id', eventId)
        .eq('operator_id', user.id)
        .order('timestamp', { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error loading attendance status:", error);
        return;
      }

      if (lastAttendance && lastAttendance.length > 0) {
        setAttendanceStatus(prev => ({ 
          ...prev, 
          [eventId]: lastAttendance[0].status 
        }));
        console.log(`Attendance status for event ${eventId}:`, lastAttendance[0].status);
      } else {
        // If no attendance record exists, default to check-out so the first button is check-in
        setAttendanceStatus(prev => ({ 
          ...prev, 
          [eventId]: 'check-out' 
        }));
      }
    } catch (error) {
      console.error("Error loading attendance:", error);
    }
  };

  const handleCheckInOut = async (eventId: number) => {
    if (!user?.id) {
      toast.error("Utente non autenticato");
      return;
    }

    setCheckingStatus(prev => ({ ...prev, [eventId]: true }));

    try {
      console.log("Starting check-in/out process for event:", eventId);
      
      // Get the current status to determine if this is a check-in or check-out
      const currentStatus = attendanceStatus[eventId] || 'check-out';
      const isCheckIn = currentStatus === 'check-out' || 
                       currentStatus === 'absent' ||
                       !currentStatus;
      
      let position: GeolocationPosition;
      
      try {
        // Request position with a timeout of 10 seconds
        position = await new Promise((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error("Geolocalizzazione non supportata"));
            return;
          }

          const timeoutId = setTimeout(() => {
            reject(new Error("Timeout durante la richiesta della posizione"));
          }, 10000);

          navigator.geolocation.getCurrentPosition(
            (pos) => {
              clearTimeout(timeoutId);
              resolve(pos);
            },
            (error) => {
              clearTimeout(timeoutId);
              reject(error);
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0
            }
          );
        });
        
        console.log("Got position:", position.coords);
      } catch (error: any) {
        console.error("Error getting position:", error);
        toast.error(`Errore nella geolocalizzazione: ${error.message}`);
        // Continue without position data
        position = {
          coords: {
            latitude: null,
            longitude: null
          }
        } as GeolocationPosition;
      }
      
      const newStatus = isCheckIn ? 'check-in' : 'check-out';
      
      console.log("Inserting attendance record with status:", newStatus);
      
      // Insert new attendance record
      const { error: insertError } = await supabase
        .from('attendance')
        .insert({
          operator_id: parseInt(user.id),
          event_id: eventId,
          status: newStatus,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: new Date().toISOString()
        });

      if (insertError) {
        console.error("Error inserting attendance record:", insertError);
        throw insertError;
      }

      console.log("Successfully inserted attendance record");

      // Update local state
      setAttendanceStatus(prev => ({ ...prev, [eventId]: newStatus }));
      toast.success(`${isCheckIn ? 'Check-in' : 'Check-out'} effettuato con successo`);
      
    } catch (error: any) {
      console.error('Error during check-in/out:', error);
      toast.error(`Errore durante il check-in/out: ${error.message}`);
    } finally {
      setCheckingStatus(prev => ({ ...prev, [eventId]: false }));
    }
  };

  const getButtonLabel = (eventId: number) => {
    const status = attendanceStatus[eventId];
    if (status === 'check-in') return 'Check-out';
    return 'Check-in';
  };

  const getButtonIcon = (eventId: number) => {
    const status = attendanceStatus[eventId];
    if (status === 'check-in') return <ArrowLeft className="h-4 w-4 mr-2" />;
    return <ArrowRight className="h-4 w-4 mr-2" />;
  };

  const getButtonColor = (eventId: number) => {
    const status = attendanceStatus[eventId];
    if (status === 'check-in') {
      return 'bg-amber-500 hover:bg-amber-600';
    }
    return 'bg-green-500 hover:bg-green-600';
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
        <h1 className="text-2xl font-bold mb-6">I miei turni</h1>
        {events.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">Nessun turno assegnato</p>
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
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">Periodo:</span>{" "}
                      {format(new Date(event.start_date), "dd/MM/yyyy")} -{" "}
                      {format(new Date(event.end_date), "dd/MM/yyyy")}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">Orario:</span>{" "}
                      {format(new Date(event.start_date), "HH:mm")} -{" "}
                      {format(new Date(event.end_date), "HH:mm")}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">Luogo:</span> {event.location}
                    </div>
                    {attendanceStatus[event.id] && (
                      <div>
                        <span className="font-medium">Stato attuale:</span>{" "}
                        <span className={`px-2 py-1 text-sm rounded-full ${
                          attendanceStatus[event.id] === 'check-in' 
                            ? 'bg-green-100 text-green-800'
                            : attendanceStatus[event.id] === 'check-out'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {attendanceStatus[event.id] === 'check-in' ? 'Presente' : 
                           attendanceStatus[event.id] === 'check-out' ? 'Assente/Non registrato' : 
                           attendanceStatus[event.id]}
                        </span>
                      </div>
                    )}
                  </div>
                  <Button
                    className={`w-full ${getButtonColor(event.id)}`}
                    onClick={() => handleCheckInOut(event.id)}
                    disabled={checkingStatus[event.id]}
                  >
                    {checkingStatus[event.id] ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      getButtonIcon(event.id)
                    )}
                    {getButtonLabel(event.id)}
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
