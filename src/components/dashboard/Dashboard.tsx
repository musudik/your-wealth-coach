import { useState } from "react";
import { useHistory } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import StatsCards from "./StatsCards";
import ClientDirectory from "./ClientDirectory";
import UpcomingAppointments from "./UpcomingAppointments";
import { Bell, Plus } from "lucide-react";
import { FormTypes } from "../../types/types";

// Tab components
import RecentActivity from "./RecentActivity";
import Forms from "./Forms";
import Performance from "./Performance";

export default function Dashboard() {
  const history = useHistory();
  const [activeTab, setActiveTab] = useState("clients");
  
  const handleAddClient = () => {
    history.push('/partner-dashboard/clients/new');
  };
  
  return (
    <DashboardLayout>
      <div style={{
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        maxWidth: '100%',
        overflow: 'hidden'
      }}>
        {/* Header Section */}
        <div style={{ 
          display: 'flex', 
          flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
          justifyContent: 'space-between', 
          alignItems: window.innerWidth <= 768 ? 'flex-start' : 'center',
          gap: window.innerWidth <= 768 ? '16px' : '0'
        }}>
          {/* Header Text */}
          <div>
            <h1 style={{ 
              fontSize: window.innerWidth <= 768 ? '24px' : '30px', 
              fontWeight: '700', 
              color: '#1e293b',
              marginBottom: '8px'
            }}>
              Dashboard
            </h1>
            <p style={{ 
              color: '#64748b',
              fontSize: window.innerWidth <= 768 ? '14px' : '16px'
            }}>
              Welcome back to your partner portal
            </p>
          </div>
          
          {/* Header Actions */}
          <div style={{ 
            display: 'flex', 
            gap: '12px',
            width: window.innerWidth <= 768 ? '100%' : 'auto'
          }}>
            <button style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: window.innerWidth <= 768 ? '48px' : '40px',
              height: window.innerWidth <= 768 ? '48px' : '40px',
              borderRadius: '8px',
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              color: '#64748b',
              cursor: 'pointer',
              flexShrink: 0
            }}>
              <Bell size={window.innerWidth <= 768 ? 24 : 20} />
            </button>
            
            <button style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '0 20px',
              height: window.innerWidth <= 768 ? '48px' : '40px',
              borderRadius: '8px',
              backgroundColor: '#3b82f6',
              color: 'white',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer',
              flex: window.innerWidth <= 768 ? '1' : 'none',
              whiteSpace: 'nowrap'
            }}>
              <Plus size={window.innerWidth <= 768 ? 24 : 18} />
              New Form
            </button>
          </div>
        </div>
        
        {/* Stats Cards Section */}
        <div style={{
          width: '100%',
          overflowX: 'auto',
          overflowY: 'hidden',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          <StatsCards />
        </div>
        
        {/* Main Content Section - now full width */}
        <div style={{ 
          width: '100%'
        }}>
          {/* Tabs and Content */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            width: '100%'
          }}>
            {/* Tabs Container */}
            <div style={{ 
              width: '100%',
              overflowX: 'auto',
              overflowY: 'hidden',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}>
              {/* Tabs */}
              <div style={{ 
                display: 'flex', 
                borderBottom: '1px solid #e2e8f0',
                padding: '0 16px',
                minWidth: 'max-content'
              }}>
                {[
                  'Your Clients', 
                  'Recent Activity', 
                  'Forms', 
                  'Performance',
                  'Upcoming Appointments'
                ].map((tab, index) => {
                  const tabValue = tab.toLowerCase().replace(/\s+/g, '-');
                  const isActive = activeTab === (index === 0 ? 'clients' : tabValue);
                  
                  return (
                    <button
                      key={tabValue}
                      onClick={() => setActiveTab(index === 0 ? 'clients' : tabValue)}
                      style={{
                        padding: '16px 20px',
                        fontWeight: isActive ? '600' : '500',
                        color: isActive ? '#3b82f6' : '#64748b',
                        borderBottom: isActive ? '2px solid #3b82f6' : '2px solid transparent',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap',
                        fontSize: window.innerWidth <= 768 ? '14px' : '16px'
                      }}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Tab Content */}
            <div style={{ 
              padding: window.innerWidth <= 768 ? '16px' : '24px',
              overflow: 'auto'
            }}>
              {activeTab === 'clients' && <ClientDirectory />}
              {activeTab === 'recent-activity' && <RecentActivity />}
              {activeTab === 'forms' && <Forms />}
              {activeTab === 'performance' && <Performance />}
              {activeTab === 'upcoming-appointments' && <UpcomingAppointments />}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Hide scrollbars but keep functionality */
        div::-webkit-scrollbar {
          display: none;
        }
        
        @media (max-width: 768px) {
          .tab-content {
            padding: 16px;
          }
        }
      `}</style>
    </DashboardLayout>
  );
}

export const formTypes = [
  'self-disclosure',
  'tax-return',
  'real-estate',
  'electricity'
];