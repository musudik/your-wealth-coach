import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { logoutUser, getUserDetails, isUserPartner } from '../db-services/authService';
import { auth } from '../db-services/firebase';
import { THEME } from '../config';

const Dashboard = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          history.push('/login');
          return;
        }

        const userDetails = await getUserDetails(user.uid);
        setUserData(userDetails);
        
        // Redirect to partner dashboard if user is a partner
        const isPartner = await isUserPartner(user.uid);
        if (isPartner) {
          history.push('/partner-dashboard');
          return;
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [history]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      history.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <svg className="animate-spin" style={{ 
            animation: 'spin 1s linear infinite',
            height: '3rem',
            width: '3rem',
            color: THEME.PRIMARY
          }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p style={{ color: THEME.TEXT_DARK, fontSize: '1.125rem' }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '600', color: THEME.PRIMARY, margin: 0 }}>
            Welcome to Your Dashboard
          </h1>
          <button 
            onClick={handleLogout}
            style={{
              backgroundColor: THEME.PRIMARY,
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              padding: '0.5rem 1rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>

        {userData ? (
          <div>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2rem',
              marginBottom: '2rem'
            }}>
              <div style={{ 
                backgroundColor: '#f9fafb',
                borderRadius: '0.375rem',
                padding: '1.5rem',
                border: '1px solid #e5e7eb'
              }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: THEME.PRIMARY, marginTop: 0, marginBottom: '1rem' }}>
                  Account Information
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.5rem' }}>
                  <div style={{ fontWeight: '500', color: THEME.TEXT_MUTED }}>Name:</div>
                  <div>{userData.name}</div>
                  
                  <div style={{ fontWeight: '500', color: THEME.TEXT_MUTED }}>Email:</div>
                  <div>{userData.email}</div>
                  
                  <div style={{ fontWeight: '500', color: THEME.TEXT_MUTED }}>Role:</div>
                  <div style={{ 
                    textTransform: 'capitalize',
                    backgroundColor: userData.role === 'partner' ? '#e6f7ff' : '#f0fdf4',
                    color: userData.role === 'partner' ? '#0077b6' : '#059669',
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>
                    {userData.role}
                  </div>
                </div>
              </div>

              <div style={{ 
                backgroundColor: '#f9fafb',
                borderRadius: '0.375rem',
                padding: '1.5rem',
                border: '1px solid #e5e7eb'
              }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: THEME.PRIMARY, marginTop: 0, marginBottom: '1rem' }}>
                  Quick Actions
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button style={{ 
                    backgroundColor: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    padding: '0.75rem 1rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5V19M5 12H19" stroke={THEME.PRIMARY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Create New {userData.role === 'partner' ? 'Client' : 'Request'}
                  </button>
                  <button style={{ 
                    backgroundColor: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    padding: '0.75rem 1rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5" stroke={THEME.PRIMARY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    View Documents
                  </button>
                  <button style={{ 
                    backgroundColor: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    padding: '0.75rem 1rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.3246 4.31731C10.751 2.5609 13.249 2.5609 13.6754 4.31731C13.9508 5.45193 15.2507 5.99038 16.2478 5.38285C17.7913 4.44239 19.5576 6.2087 18.6172 7.75218C18.0096 8.74925 18.5481 10.0492 19.6827 10.3246C21.4391 10.751 21.4391 13.249 19.6827 13.6754C18.5481 13.9508 18.0096 15.2507 18.6172 16.2478C19.5576 17.7913 17.7913 19.5576 16.2478 18.6172C15.2507 18.0096 13.9508 18.5481 13.6754 19.6827C13.249 21.4391 10.751 21.4391 10.3246 19.6827C10.0492 18.5481 8.74926 18.0096 7.75219 18.6172C6.2087 19.5576 4.44239 17.7913 5.38285 16.2478C5.99038 15.2507 5.45193 13.9508 4.31731 13.6754C2.5609 13.249 2.5609 10.751 4.31731 10.3246C5.45193 10.0492 5.99037 8.74926 5.38285 7.75218C4.44239 6.2087 6.2087 4.44239 7.75219 5.38285C8.74926 5.99037 10.0492 5.45193 10.3246 4.31731Z" stroke={THEME.PRIMARY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke={THEME.PRIMARY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Account Settings
                  </button>
                </div>
              </div>
            </div>

            <div style={{ 
              backgroundColor: '#f9fafb',
              borderRadius: '0.375rem',
              padding: '1.5rem',
              border: '1px solid #e5e7eb'
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: THEME.PRIMARY, marginTop: 0, marginBottom: '1rem' }}>
                Recent Activity
              </h2>
              <div style={{ color: THEME.TEXT_MUTED, textAlign: 'center', padding: '2rem 0' }}>
                No recent activity to display.
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: THEME.TEXT_MUTED }}>
            No user data available. Please log out and log in again.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 