
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Clock, MapPin } from "lucide-react";
import { Event } from "./types";

interface AttendanceDetail {
  id: string;
  status: string;
  timestamp: string;
  latitude: number | null;
  longitude: number | null;
  location?: string;
}

interface AttendanceAccordionProps {
  event: Event;
}

const AttendanceAccordion: React.FC<AttendanceAccordionProps> = ({ event }) => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalHours, setTotalHours] = useState<number | null>(null);

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      if (!event.id) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('attendance')
          .select('*')
          .eq('event_id', event.id)
          .order('timestamp', { ascending: true });
          
        if (error) {
          console.error("Error fetching attendance records:", error);
          return;
        }
        
        console.log("Attendance records for event:", event.id, data);
        setAttendanceRecords(data || []);
        
        // Calculate total hours if we have check-in and check-out
        if (data && data.length >= 2) {
          const checkIn = data.find(r => r.status === 'check-in');
          const checkOut = data.find(r => r.status === 'check-out');
          
          if (checkIn && checkOut) {
            const checkInTime = new Date(checkIn.timestamp);
            const checkOutTime = new Date(checkOut.timestamp);
            const diffMs = checkOutTime.getTime() - checkInTime.getTime();
            const diffHours = diffMs / (1000 * 60 * 60);
            setTotalHours(parseFloat(diffHours.toFixed(2)));
          }
        }
      } catch (error) {
        console.error("Error in fetchAttendanceRecords:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAttendanceRecords();
  }, [event.id]);
  
  const formatLocationLink = (lat: number | null, lng: number | null) => {
    if (lat === null || lng === null) return null;
    return `https://www.google.com/maps?q=${lat},${lng}`;
  };

  if (loading) {
    return <div className="py-2 text-sm text-gray-500">Caricamento presenze...</div>;
  }

  if (attendanceRecords.length === 0) {
    return <div className="py-2 text-sm text-gray-500">Nessun record di presenza trovato</div>;
  }

  // Group by date
  const recordsByDate = attendanceRecords.reduce((acc, record) => {
    const date = format(new Date(record.timestamp), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(record);
    return acc;
  }, {} as Record<string, AttendanceDetail[]>);

  return (
    <div className="space-y-2">
      <Accordion type="single" collapsible className="w-full">
        {Object.entries(recordsByDate).map(([date, records]) => {
          // Find check-in and check-out for this date
          const checkIn = records.find(r => r.status === 'check-in');
          const checkOut = records.find(r => r.status === 'check-out');
          
          // Calculate hours for this day
          let dayHours = null;
          if (checkIn && checkOut) {
            const checkInTime = new Date(checkIn.timestamp);
            const checkOutTime = new Date(checkOut.timestamp);
            const diffMs = checkOutTime.getTime() - checkInTime.getTime();
            const diffHours = diffMs / (1000 * 60 * 60);
            dayHours = parseFloat(diffHours.toFixed(2));
          }
          
          const formattedDate = format(new Date(date), 'dd/MM/yyyy');
          
          return (
            <AccordionItem key={date} value={date}>
              <AccordionTrigger className="hover:no-underline py-2">
                <div className="flex items-center justify-between w-full">
                  <span>{formattedDate}</span>
                  {dayHours !== null && (
                    <span className="text-sm text-muted-foreground ml-4">
                      Totale: {dayHours} ore
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pl-2">
                  {checkIn && (
                    <div className="border-l-2 border-green-500 pl-3 py-1">
                      <div className="font-medium">Check-in</div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-1" /> 
                        {format(new Date(checkIn.timestamp), 'HH:mm')}
                      </div>
                      {checkIn.latitude && checkIn.longitude && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 mr-1" />
                          <a 
                            href={formatLocationLink(checkIn.latitude, checkIn.longitude) || "#"} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            Visualizza su mappa
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {checkOut && (
                    <div className="border-l-2 border-amber-500 pl-3 py-1">
                      <div className="font-medium">Check-out</div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-1" /> 
                        {format(new Date(checkOut.timestamp), 'HH:mm')}
                      </div>
                      {checkOut.latitude && checkOut.longitude && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 mr-1" />
                          <a 
                            href={formatLocationLink(checkOut.latitude, checkOut.longitude) || "#"} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            Visualizza su mappa
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default AttendanceAccordion;
