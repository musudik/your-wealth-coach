import { Redirect } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole = null }: ProtectedRouteProps) => {
  if (!currentUser) {
    return <Redirect to="/login" />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Redirect to="/dashboard" />;
  }
  
  return children;
}

export default ProtectedRoute; 