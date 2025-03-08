import { ReactNode, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, 
  Users, 
  FileText, 
  Calendar, 
  BarChart2, 
  Settings, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  const handleLogout = async () => {
    try {
      await logout();
      history.push('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };
  
  const navItems = [
    { icon: <Home size={20} />, label: 'Dashboard', path: '/partner-dashboard' },
    { icon: <Users size={20} />, label: 'Clients', path: '/partner-dashboard/clients' },
    { icon: <FileText size={20} />, label: 'Forms', path: '/partner-dashboard/forms' },
    { icon: <Calendar size={20} />, label: 'Calendar', path: '/partner-dashboard/calendar' },
    { icon: <BarChart2 size={20} />, label: 'Analytics', path: '/partner-dashboard/analytics' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/partner-dashboard/settings' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header style={{ 
        backgroundColor: 'white', 
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', 
        position: 'sticky', 
        top: 0, 
        zIndex: 50,
        padding: '0.75rem 0'
      }}>
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          padding: '0 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo and menu toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{ 
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b',
                padding: '0.5rem'
              }}
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            
            <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <div style={{ 
                width: '2.25rem', 
                height: '2.25rem', 
                background: 'linear-gradient(135deg, #003366 0%, #004080 100%)', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00d084',
                fontWeight: 'bold',
                fontSize: '1.125rem',
                boxShadow: '0 2px 4px rgba(0, 51, 102, 0.2)'
              }}>
                YW
              </div>
              <span style={{ 
                marginLeft: '0.75rem', 
                fontSize: '1.125rem', 
                fontWeight: '600',
                background: 'linear-gradient(to right, #003366, #004d99)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Your Wealth Coach
              </span>
            </Link>
          </div>

          {/* User profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem',
              padding: '0.5rem 0.75rem',
              borderRadius: '0.5rem',
              backgroundColor: '#f8fafc'
            }}>
              <div style={{ 
                width: '2rem', 
                height: '2rem', 
                backgroundColor: '#003366', 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '600',
                fontSize: '0.875rem'
              }}>
                {currentUser?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span style={{ color: '#1e293b', fontWeight: '500' }}>
                {currentUser?.email?.split('@')[0] || 'User'}
              </span>
            </div>
            
            <button 
              onClick={handleLogout}
              style={{ 
                backgroundColor: 'transparent',
                color: '#64748b',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.5rem'
              }}
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div style={{ 
        display: 'flex', 
        flex: '1'
      }}>
        {/* Sidebar */}
        <aside style={{ 
          width: isSidebarOpen ? '240px' : '0',
          backgroundColor: '#003366',
          transition: 'width 0.3s ease',
          position: 'sticky',
          top: '64px',
          height: 'calc(100vh - 64px)',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}>
          <nav style={{ 
            padding: '1.5rem 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            {navItems.map((item, index) => (
              <Link 
                key={index}
                to={item.path}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem',
                  padding: '0.75rem 1.5rem',
                  color: 'white',
                  textDecoration: 'none',
                  transition: 'background-color 0.2s',
                  backgroundColor: window.location.pathname === item.path ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
                }}
                className="hover:bg-white/10"
              >
                {item.icon}
                <span style={{ 
                  fontSize: '0.875rem',
                  fontWeight: window.location.pathname === item.path ? '600' : '500'
                }}>
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Content area */}
        <main style={{ 
          flex: '1',
          padding: '1.5rem',
          maxWidth: '100%'
        }}>
          {children}
        </main>
      </div>
    </div>
  );
} 