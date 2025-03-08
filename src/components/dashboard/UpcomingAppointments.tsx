import { useState } from "react";
import { Calendar, Clock, Video, Phone } from "lucide-react";

export default function UpcomingAppointments() {
  const [appointments, setAppointments] = useState([
    {
      id: "1",
      clientName: "Markus Schneider",
      initials: "MS",
      date: "Today",
      time: "14:30",
      type: "video"
    },
    {
      id: "2",
      clientName: "Julia Wagner",
      initials: "JW",
      date: "Tomorrow",
      time: "10:00",
      type: "video"
    },
    {
      id: "3",
      clientName: "Robert Hoffmann",
      initials: "RH",
      date: "Wed, 15 Jun",
      time: "15:45",
      type: "phone"
    }
  ]);
  
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      width: '50%'
    }}>
      <div style={{ padding: '1.5rem' }}>
        <h2 style={{ 
          fontSize: '1.25rem', 
          fontWeight: '600', 
          color: '#1e293b',
          marginBottom: '0.25rem'
        }}>
          Upcoming Appointments
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
          Your scheduled meetings with clients
        </p>
      </div>
      
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        padding: '0 1.5rem'
      }}>
        {appointments.map(appointment => (
          <div 
            key={appointment.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              backgroundColor: '#f8fafc'
            }}
          >
            <div style={{ 
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '9999px',
              backgroundColor: '#e0e7ff',
              color: '#4f46e5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '600',
              fontSize: '0.875rem'
            }}>
              {appointment.initials}
            </div>
            
            <div style={{ flex: 1 }}>
              <h3 style={{ 
                fontSize: '0.875rem', 
                fontWeight: '600', 
                color: '#1e293b',
                marginBottom: '0.25rem'
              }}>
                {appointment.clientName}
              </h3>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                fontSize: '0.75rem',
                color: '#64748b'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Calendar size={14} />
                  <span>{appointment.date}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={14} />
                  <span>{appointment.time}</span>
                </div>
              </div>
            </div>
            
            <div style={{ 
              width: '2rem',
              height: '2rem',
              borderRadius: '9999px',
              backgroundColor: appointment.type === 'video' ? '#dcfce7' : '#dbeafe',
              color: appointment.type === 'video' ? '#16a34a' : '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {appointment.type === 'video' ? <Video size={14} /> : <Phone size={14} />}
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ 
        marginTop: 'auto', 
        padding: '1.5rem',
        borderTop: '1px solid #e2e8f0'
      }}>
        <button style={{ 
          width: '50%',
          padding: '0.75rem',
          borderRadius: '0.5rem',
          backgroundColor: '#3b82f6',
          color: 'white',
          fontWeight: '500',
          border: '1px solid #e2e8f0',
          cursor: 'pointer',
          textAlign: 'center'
        }}>
          Schedule New Appointment
        </button>
      </div>
    </div>
  );
} 