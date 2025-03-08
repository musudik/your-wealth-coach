import { useState, useEffect } from "react";
import { Users, FileCheck, Clock, TrendingUp } from "lucide-react";

export default function StatsCards() {
  const [stats, setStats] = useState({
    totalClients: 1,
    formsCompleted: 1,
    pendingForms: 0,
    successRate: 100
  });
  
  const [changes, setChanges] = useState({
    totalClients: 12,
    formsCompleted: 24,
    pendingForms: -5,
    successRate: 2
  });
  
  // In a real app, you would fetch this data from your backend
  useEffect(() => {
    // Simulating API call
    const fetchStats = async () => {
      // In a real app, fetch data from your API
      // For now, we'll use the initial state values
    };
    
    fetchStats();
  }, []);
  
  const cards = [
    {
      title: "Total Clients",
      value: stats.totalClients,
      change: changes.totalClients,
      icon: <Users size={20} />,
      iconBg: "#e0e7ff",
      iconColor: "#4f46e5"
    },
    {
      title: "Forms Completed",
      value: stats.formsCompleted,
      change: changes.formsCompleted,
      icon: <FileCheck size={20} />,
      iconBg: "#dcfce7",
      iconColor: "#16a34a"
    },
    {
      title: "Pending Forms",
      value: stats.pendingForms,
      change: changes.pendingForms,
      icon: <Clock size={20} />,
      iconBg: "#ffedd5",
      iconColor: "#ea580c"
    },
    {
      title: "Success Rate",
      value: `${stats.successRate}%`,
      change: changes.successRate,
      icon: <TrendingUp size={20} />,
      iconBg: "#dbeafe",
      iconColor: "#2563eb"
    }
  ];
  
  return (
    <div style={{ 
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '1rem'
    }}>
      {cards.map((card, index) => (
        <div 
          key={index}
          style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            padding: '1.25rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start'
          }}>
            <div>
              <h3 style={{ 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#64748b',
                marginBottom: '0.5rem'
              }}>
                {card.title}
              </h3>
              <p style={{ 
                fontSize: '1.875rem', 
                fontWeight: '700', 
                color: '#1e293b'
              }}>
                {card.value}
              </p>
            </div>
            <div style={{ 
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '0.5rem',
              backgroundColor: card.iconBg,
              color: card.iconColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {card.icon}
            </div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.25rem',
            fontSize: '0.875rem',
            color: card.change >= 0 ? '#16a34a' : '#dc2626'
          }}>
            {card.change >= 0 ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 19V5M5 12L12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M19 12L12 19L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            <span style={{ fontWeight: '500' }}>
              {Math.abs(card.change)}%
            </span>
            <span style={{ color: '#64748b' }}>
              vs last month
            </span>
          </div>
        </div>
      ))}
    </div>
  );
} 