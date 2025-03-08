import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { StatsOverview } from "./StatsOverview";
import { ClientDirectory } from "./ClientDirectory";
import { RecentActivity } from "./RecentActivity";
import { FormCategories } from "./FormCategories";
import { PerformanceMetrics } from "./PerformanceMetrics";
import { UpcomingAppointments } from "./UpcomingAppointments";
import { Plus, Bell } from "lucide-react";
import { Button } from "../ui/button";
import DashboardLayout from "./DashboardLayout";

// Form types
export const formTypes = [
  'self-disclosure',
  'tax-return',
  'real-estate',
  'electricity'
];

export default function Dashboard() {
  const history = useHistory();
  
  const handleNewClient = () => {
    history.push('/clients/new/edit');
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 style={{ 
              fontSize: '1.875rem', 
              fontWeight: '700', 
              color: '#003366',
              marginBottom: '0.5rem'
            }}>
              Partner Dashboard
            </h1>
            <p style={{ color: '#4b5563' }}>
              Welcome back to your partner portal
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <button style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: '1px solid #e5e7eb',
              backgroundColor: 'white',
              color: '#4b5563',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              <Bell size={16} />
              Notifications
            </button>
            <button style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              backgroundColor: '#00d084',
              color: '#003366',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
            }}>
              <Plus size={16} />
              New Form
            </button>
          </div>
        </div>
        
        {/* Stats Overview */}
        <StatsOverview />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden'
            }}>
              <Tabs defaultValue="clients" className="w-full">
                <div style={{ borderBottom: '1px solid #e5e7eb', padding: '1rem 1.5rem' }}>
                  <TabsList style={{ 
                    display: 'flex',
                    backgroundColor: 'transparent',
                    padding: 0,
                    margin: 0
                  }}>
                    <TabsTrigger value="clients" style={{ 
                      padding: '0.5rem 1rem',
                      borderBottom: '2px solid transparent',
                      color: '#4b5563',
                      fontWeight: '500',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      marginRight: '1rem'
                    }} className="data-[state=active]:border-[#00d084] data-[state=active]:text-[#003366] data-[state=active]:font-semibold">
                      Your Clients
                    </TabsTrigger>
                    <TabsTrigger value="activity" style={{ 
                      padding: '0.5rem 1rem',
                      borderBottom: '2px solid transparent',
                      color: '#4b5563',
                      fontWeight: '500',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      marginRight: '1rem'
                    }} className="data-[state=active]:border-[#00d084] data-[state=active]:text-[#003366] data-[state=active]:font-semibold">
                      Recent Activity
                    </TabsTrigger>
                    <TabsTrigger value="forms" style={{ 
                      padding: '0.5rem 1rem',
                      borderBottom: '2px solid transparent',
                      color: '#4b5563',
                      fontWeight: '500',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      marginRight: '1rem'
                    }} className="data-[state=active]:border-[#00d084] data-[state=active]:text-[#003366] data-[state=active]:font-semibold">
                      Forms
                    </TabsTrigger>
                    <TabsTrigger value="performance" style={{ 
                      padding: '0.5rem 1rem',
                      borderBottom: '2px solid transparent',
                      color: '#4b5563',
                      fontWeight: '500',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }} className="data-[state=active]:border-[#00d084] data-[state=active]:text-[#003366] data-[state=active]:font-semibold">
                      Performance
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <div style={{ padding: '1.5rem' }}>
                  <TabsContent value="clients">
                    <ClientDirectory />
                  </TabsContent>
                  
                  <TabsContent value="activity">
                    <RecentActivity />
                  </TabsContent>
                  
                  <TabsContent value="forms">
                    <FormCategories />
                  </TabsContent>
                  
                  <TabsContent value="performance">
                    <PerformanceMetrics />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
          
          <div className="space-y-6">
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              padding: '1.5rem'
            }}>
              <UpcomingAppointments />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 