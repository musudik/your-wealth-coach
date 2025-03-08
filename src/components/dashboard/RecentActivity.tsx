import { useState, useEffect } from "react";
import { firestore } from "../../db-services/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { FileText, UserCheck, Calendar, Clock } from "lucide-react";

interface Activity {
  id: string;
  type: 'form_submitted' | 'client_added' | 'appointment_scheduled' | 'form_reviewed';
  clientName: string;
  timestamp: Date;
  details?: string;
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetchActivities();
    
    return () => {
      isMounted = false;
    };
    
    async function fetchActivities() {
      try {
        if (!isMounted) return;
        setLoading(true);
        
        // Get the current partner ID (you might want to get this from auth context)
        const partnerId = "current-partner-id"; // Replace with actual partner ID
        
        const activitiesCollection = collection(firestore, "activities");
        const activitiesQuery = query(
          activitiesCollection,
          orderBy("timestamp", "desc"),
          limit(10)
        );
        
        const activitiesSnapshot = await getDocs(activitiesQuery);
        const activitiesList = activitiesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date()
        })) as Activity[];
        
        if (isMounted) {
          setActivities(activitiesList);
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
        // Use mock data if Firestore fetch fails
        setActivities([
          {
            id: "1",
            type: "form_submitted",
            clientName: "John Doe",
            timestamp: new Date(2023, 9, 15, 14, 30),
            details: "Tax Return Form"
          },
          {
            id: "2",
            type: "appointment_scheduled",
            clientName: "Jane Smith",
            timestamp: new Date(2023, 9, 14, 10, 15),
            details: "Financial Review Meeting"
          },
          {
            id: "3",
            type: "client_added",
            clientName: "Michael Johnson",
            timestamp: new Date(2023, 9, 13, 9, 45)
          },
          {
            id: "4",
            type: "form_reviewed",
            clientName: "Sarah Williams",
            timestamp: new Date(2023, 9, 12, 16, 20),
            details: "Insurance Application"
          },
          {
            id: "5",
            type: "form_submitted",
            clientName: "Robert Brown",
            timestamp: new Date(2023, 9, 11, 11, 5),
            details: "Real Estate Assessment"
          }
        ]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
  }, []);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return new Intl.DateTimeFormat('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }).format(date);
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      hour: 'numeric', 
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'form_submitted':
      case 'form_reviewed':
        return <FileText size={16} />;
      case 'client_added':
        return <UserCheck size={16} />;
      case 'appointment_scheduled':
        return <Calendar size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'form_submitted':
        return {
          bg: 'rgba(0, 208, 132, 0.1)',
          text: '#00d084',
          icon: '#00d084'
        };
      case 'client_added':
        return {
          bg: 'rgba(0, 51, 102, 0.1)',
          text: '#003366',
          icon: '#003366'
        };
      case 'appointment_scheduled':
        return {
          bg: 'rgba(79, 70, 229, 0.1)',
          text: '#4f46e5',
          icon: '#4f46e5'
        };
      case 'form_reviewed':
        return {
          bg: 'rgba(245, 158, 11, 0.1)',
          text: '#f59e0b',
          icon: '#f59e0b'
        };
      default:
        return {
          bg: 'rgba(107, 114, 128, 0.1)',
          text: '#6b7280',
          icon: '#6b7280'
        };
    }
  };

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case 'form_submitted':
        return `${activity.clientName} submitted a ${activity.details}`;
      case 'client_added':
        return `${activity.clientName} was added as a new client`;
      case 'appointment_scheduled':
        return `Appointment scheduled with ${activity.clientName}`;
      case 'form_reviewed':
        return `You reviewed ${activity.clientName}'s ${activity.details}`;
      default:
        return `Activity with ${activity.clientName}`;
    }
  };

  return (
    <div>
      <h3 style={{ 
        fontSize: '1rem', 
        fontWeight: '600', 
        color: '#111827',
        marginBottom: '1rem'
      }}>
        Recent Activity
      </h3>

      {loading ? (
        <div style={{ padding: '2rem 0', textAlign: 'center' }}>
          <div style={{ 
            display: 'inline-block',
            width: '2rem',
            height: '2rem',
            border: '3px solid #e5e7eb',
            borderTopColor: '#003366',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : activities.length === 0 ? (
        <div style={{ 
          padding: '3rem 0',
          textAlign: 'center',
          color: '#6b7280'
        }}>
          <p>No recent activities found.</p>
        </div>
      ) : (
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {activities.map(activity => {
            const activityStyle = getActivityColor(activity.type);
            
            return (
              <div 
                key={activity.id} 
                style={{ 
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  backgroundColor: 'white',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                className="hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                <div style={{ 
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '0.5rem',
                  backgroundColor: activityStyle.bg,
                  color: activityStyle.icon,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {getActivityIcon(activity.type)}
                </div>
                <div style={{ flex: '1' }}>
                  <p style={{ 
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#111827',
                    marginBottom: '0.25rem'
                  }}>
                    {getActivityText(activity)}
                  </p>
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.75rem',
                    color: '#6b7280'
                  }}>
                    <span>{formatDate(activity.timestamp)}</span>
                    <span>•</span>
                    <span>{formatTime(activity.timestamp)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 