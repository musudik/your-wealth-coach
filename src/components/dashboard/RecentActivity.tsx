import { useState } from "react";
import { FileText, UserPlus, Calendar } from "lucide-react";

export default function RecentActivity() {
  const [activities, setActivities] = useState([
    {
      id: "1",
      type: "form",
      description: "Tax return form submitted by John Doe",
      time: "2 hours ago"
    },
    {
      id: "2",
      type: "client",
      description: "New client Sarah Johnson added",
      time: "Yesterday"
    },
    {
      id: "3",
      type: "appointment",
      description: "Meeting scheduled with Michael Brown",
      time: "2 days ago"
    }
  ]);
  
  const getIcon = (type) => {
    switch (type) {
      case "form":
        return <FileText size={16} />;
      case "client":
        return <UserPlus size={16} />;
      case "appointment":
        return <Calendar size={16} />;
      default:
        return <FileText size={16} />;
    }
  };
  
  const getIconStyles = (type) => {
    switch (type) {
      case "form":
        return {
          bg: "#dcfce7",
          color: "#16a34a"
        };
      case "client":
        return {
          bg: "#e0e7ff",
          color: "#4f46e5"
        };
      case "appointment":
        return {
          bg: "#dbeafe",
          color: "#2563eb"
        };
      default:
        return {
          bg: "#f1f5f9",
          color: "#64748b"
        };
    }
  };
  
  return (
    <div>
      <h2 style={{ 
        fontSize: '1.25rem', 
        fontWeight: '600', 
        color: '#1e293b',
        marginBottom: '1.5rem'
      }}>
        Recent Activity
      </h2>
      
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {activities.map(activity => {
          const iconStyles = getIconStyles(activity.type);
          
          return (
            <div 
              key={activity.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                padding: '1rem',
                borderRadius: '0.5rem',
                backgroundColor: '#f8fafc'
              }}
            >
              <div style={{ 
                width: '2rem',
                height: '2rem',
                borderRadius: '0.5rem',
                backgroundColor: iconStyles.bg,
                color: iconStyles.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {getIcon(activity.type)}
              </div>
              
              <div style={{ flex: 1 }}>
                <p style={{ 
                  fontSize: '0.875rem', 
                  color: '#1e293b',
                  marginBottom: '0.25rem'
                }}>
                  {activity.description}
                </p>
                <span style={{ 
                  fontSize: '0.75rem',
                  color: '#64748b'
                }}>
                  {activity.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 