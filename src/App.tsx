import { Switch, Route, Redirect } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useEffect, useState, ReactNode } from 'react';
import { getUserDetails } from './db-services/authService';

// Main components
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import CTA from './components/CTA';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';

// Auth components
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';

// Dashboard components
import Dashboard from './components/Dashboard';
import PartnerDashboard from './components/dashboard/Dashboard';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string | null;
}

// Protected route component
const ProtectedRoute = ({ children, requiredRole = null }: ProtectedRouteProps) => {
  const { currentUser } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (currentUser) {
        const userDetails = await getUserDetails(currentUser.uid);
        setUserRole(userDetails?.role || null);
      }
      setLoading(false);
    };

    fetchUserRole();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Redirect to="/login" />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Redirect to="/dashboard" />;
  }

  return <>{children}</>;
};

// Home page component
const HomePage = () => (
  <div className="min-h-screen bg-light">
    <Header />
    <main>
      <Hero />
      <Features />
      <CTA />
    </main>
    <Footer />
    <ChatBot />
  </div>
);

function App() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" exact component={HomePage} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      
      {/* Protected routes - need to use render prop for these */}
      <Route 
        path="/dashboard" 
        render={() => (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )} 
      />
      
      {/* Partner dashboard routes */}
      <Route 
        path="/partner-dashboard" 
        render={() => (
          <ProtectedRoute requiredRole="partner">
            <PartnerDashboard />
          </ProtectedRoute>
        )} 
      />
      
      {/* Client routes */}
      <Route 
        path="/forms/:formType" 
        render={() => (
          <ProtectedRoute requiredRole="client">
            <div>Form Page</div>
          </ProtectedRoute>
        )} 
      />
      
      {/* Redirect for unknown routes */}
      <Route path="*" render={() => <Redirect to="/" />} />
    </Switch>
  );
}

export default App;
