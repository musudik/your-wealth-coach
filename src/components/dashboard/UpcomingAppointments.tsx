import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Video, Phone, Loader2 } from "lucide-react";
import { firestore } from "../../db-services/firebase";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { format, isToday, isTomorrow, addDays } from "date-fns";

interface Appointment {
  id: string;
  clientName: string;
  scheduledAt: Date;
  duration: number;
  type: 'video' | 'phone';
  status: 'confirmed' | 'pending' | 'cancelled';
}

export function UpcomingAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      
      // Get the current partner ID (you might want to get this from auth context)
      const partnerId = "current-partner-id"; // Replace with actual partner ID
      
      const now = new Date();
      const appointmentsCollection = collection(firestore, "appointments");
      const appointmentsQuery = query(
        appointmentsCollection,
        where("partnerId", "==", partnerId),
        where("scheduledAt", ">=", now),
        where("status", "!=", "cancelled"),
        orderBy("scheduledAt"),
        limit(5)
      );
      
      const appointmentsSnapshot = await getDocs(appointmentsQuery);
      const appointmentsList = appointmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        scheduledAt: doc.data().scheduledAt?.toDate() || new Date()
      })) as Appointment[];
      
      setAppointments(appointmentsList);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      // Use mock data if Firestore fetch fails
      setAppointments([
        {
          id: "1",
          clientName: "John Doe",
          scheduledAt: new Date(new Date().setHours(new Date().getHours() + 3)),
          duration: 30,
          type: "video",
          status: "confirmed"
        },
        {
          id: "2",
          clientName: "Jane Smith",
          scheduledAt: new Date(new Date().setHours(new Date().getHours() + 24)),
          duration: 45,
          type: "phone",
          status: "confirmed"
        },
        {
          id: "3",
          clientName: "Michael Johnson",
          scheduledAt: new Date(new Date().setHours(new Date().getHours() + 48)),
          duration: 60,
          type: "video",
          status: "pending"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  // Function to get appointment type icon
  const getAppointmentIcon = (type: 'video' | 'phone') => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4 text-green-500" />;
      case "phone":
        return <Phone className="h-4 w-4 text-blue-500" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };

  // Function to format date for display
  const formatAppointmentDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();
    
    if (isToday) {
      return "Today";
    } else if (isTomorrow) {
      return "Tomorrow";
    } else {
      return format(date, "EEE, d MMM");
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return {
          bg: 'rgba(0, 208, 132, 0.1)',
          text: '#00d084'
        };
      case 'pending':
        return {
          bg: 'rgba(245, 158, 11, 0.1)',
          text: '#f59e0b'
        };
      case 'cancelled':
        return {
          bg: 'rgba(239, 68, 68, 0.1)',
          text: '#ef4444'
        };
      default:
        return {
          bg: 'rgba(107, 114, 128, 0.1)',
          text: '#6b7280'
        };
    }
  };

  return (
    <Card className="border-none shadow-md bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Upcoming Appointments</CardTitle>
        <CardDescription>Your scheduled meetings with clients</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((appointment, index) => {
              const statusStyle = getStatusColor(appointment.status);
              
              return (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={appointment.clientAvatar} alt={appointment.clientName} />
                    <AvatarFallback>{getInitials(appointment.clientName)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      <span>{formatAppointmentDate(appointment.scheduledAt)}</span>
                      <Clock className="h-3.5 w-3.5 ml-2 mr-1" />
                      <span>{formatTime(appointment.scheduledAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
                    {getAppointmentIcon(appointment.type)}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>No upcoming appointments</p>
            <p className="text-sm mt-1">Schedule a meeting with a client</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" className="w-full">
          Schedule New Appointment
        </Button>
      </CardFooter>
    </Card>
  );
} 