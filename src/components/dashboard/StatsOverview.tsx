import { useState, useEffect } from "react";
import { Users, FileText, Calendar, TrendingUp } from "lucide-react";
import { firestore } from "../../db-services/firebase";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";

export function StatsOverview() {
  const [stats, setStats] = useState({
    totalClients: 0,
    pendingForms: 0,
    upcomingAppointments: 0,
    monthlyGrowth: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Get the current partner ID (you might want to get this from auth context)
      const partnerId = "current-partner-id"; // Replace with actual partner ID
      
      // Count total clients
      const clientsCollection = collection(firestore, "clients");
      const clientsQuery = query(
        clientsCollection,
        where("partnerId", "==", partnerId)
      );
      const clientsSnapshot = await getDocs(clientsQuery);
      const totalClients = clientsSnapshot.size;
      
      // Count pending forms
      const formsCollection = collection(firestore, "forms");
      const pendingFormsQuery = query(
        formsCollection,
        where("partnerId", "==", partnerId),
        where("status", "==", "pending")
      );
      const pendingFormsSnapshot = await getDocs(pendingFormsQuery);
      const pendingForms = pendingFormsSnapshot.size;
      
      // Count upcoming appointments
      const now = new Date();
      const appointmentsCollection = collection(firestore, "appointments");
      const appointmentsQuery = query(
        appointmentsCollection,
        where("partnerId", "==", partnerId),
        where("scheduledAt", ">=", now),
        orderBy("scheduledAt"),
        limit(10)
      );
      const appointmentsSnapshot = await getDocs(appointmentsQuery);
      const upcomingAppointments = appointmentsSnapshot.size;
      
      // Calculate monthly growth (this is a placeholder - implement your own logic)
      // For example, you might compare the number of clients this month vs last month
      const monthlyGrowth = 12; // Placeholder value
      
      setStats({
        totalClients,
        pendingForms,
        upcomingAppointments,
        monthlyGrowth
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    padding: '1.5rem',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer'
  };

  const cardHoverStyle = {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  };

  const iconContainerStyle = {
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(1, 1fr)',
      gap: '1rem',
      marginBottom: '2rem'
    }} className="md:grid-cols-2 lg:grid-cols-4">
      <div 
        style={cardStyle} 
        className="hover:shadow-md hover:-translate-y-1 transition-all duration-200"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', marginBottom: '0.25rem' }}>
              Total Clients
            </h3>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#003366' }}>
              {loading ? (
                <div style={{ height: '2rem', width: '4rem', backgroundColor: '#e5e7eb', borderRadius: '0.25rem' }}></div>
              ) : (
                stats.totalClients
              )}
            </div>
          </div>
          <div style={{ ...iconContainerStyle, backgroundColor: 'rgba(0, 51, 102, 0.1)' }}>
            <Users size={18} color="#003366" />
          </div>
        </div>
        <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Active client relationships</p>
      </div>
      
      <div 
        style={cardStyle} 
        className="hover:shadow-md hover:-translate-y-1 transition-all duration-200"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', marginBottom: '0.25rem' }}>
              Pending Forms
            </h3>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#003366' }}>
              {loading ? (
                <div style={{ height: '2rem', width: '4rem', backgroundColor: '#e5e7eb', borderRadius: '0.25rem' }}></div>
              ) : (
                stats.pendingForms
              )}
            </div>
          </div>
          <div style={{ ...iconContainerStyle, backgroundColor: 'rgba(0, 208, 132, 0.1)' }}>
            <FileText size={18} color="#00d084" />
          </div>
        </div>
        <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Forms awaiting your review</p>
      </div>
      
      <div 
        style={cardStyle} 
        className="hover:shadow-md hover:-translate-y-1 transition-all duration-200"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', marginBottom: '0.25rem' }}>
              Upcoming Appointments
            </h3>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#003366' }}>
              {loading ? (
                <div style={{ height: '2rem', width: '4rem', backgroundColor: '#e5e7eb', borderRadius: '0.25rem' }}></div>
              ) : (
                stats.upcomingAppointments
              )}
            </div>
          </div>
          <div style={{ ...iconContainerStyle, backgroundColor: 'rgba(0, 51, 102, 0.1)' }}>
            <Calendar size={18} color="#003366" />
          </div>
        </div>
        <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Scheduled in the next 7 days</p>
      </div>
      
      <div 
        style={cardStyle} 
        className="hover:shadow-md hover:-translate-y-1 transition-all duration-200"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', marginBottom: '0.25rem' }}>
              Monthly Growth
            </h3>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#003366' }}>
              {loading ? (
                <div style={{ height: '2rem', width: '4rem', backgroundColor: '#e5e7eb', borderRadius: '0.25rem' }}></div>
              ) : (
                `${stats.monthlyGrowth}%`
              )}
            </div>
          </div>
          <div style={{ ...iconContainerStyle, backgroundColor: 'rgba(0, 208, 132, 0.1)' }}>
            <TrendingUp size={18} color="#00d084" />
          </div>
        </div>
        <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Increase in client base</p>
      </div>
    </div>
  );
} 