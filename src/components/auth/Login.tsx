import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { loginUser, getUserDetails, isUserPartner } from "../../db-services/authService";
import "./auth.css";
import { THEME } from "../../config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Use the loginUser function from authService
      const user = await loginUser(email, password);
      
      // Check if user is a partner
      const isPartner = await isUserPartner(user.uid);
      
      // Redirect based on user role
      if (isPartner) {
        history.push("/partner-dashboard");
      } else {
        history.push("/dashboard");
      }
      
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Handle different error codes
      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
            setError("No account found with this email.");
            break;
          case 'auth/wrong-password':
            setError("Incorrect password.");
            break;
          case 'auth/too-many-requests':
            setError("Too many failed attempts. Please try again later.");
            break;
          case 'auth/invalid-credential':
            setError("Invalid email or password.");
            break;
          default:
            setError("Failed to login. Please try again.");
        }
      } else {
        setError(error.message || "Failed to login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ backgroundColor: '#f9fafb' }}>
      <div style={{ 
        maxWidth: '400px',
        margin: '2rem auto',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}>
        <div style={{ 
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '1.5rem'
        }}>
          <div style={{ 
            width: '3rem', 
            height: '3rem', 
            backgroundColor: THEME.PRIMARY, 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: THEME.SECONDARY,
            fontWeight: 'bold',
            fontSize: '1.5rem'
          }}>
            YW
          </div>
        </div>
        
        <h2 className="auth-title" style={{ color: THEME.PRIMARY }}>Login to Your Account</h2>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleLogin} className="auth-form">
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="email" style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              color: THEME.TEXT_DARK,
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              required
              disabled={loading}
              style={{ 
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                border: '1px solid #d1d5db',
                fontSize: '1rem'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '0.5rem'
            }}>
              <label htmlFor="password" style={{ 
                color: THEME.TEXT_DARK,
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>
                Password
              </label>
              <a href="#" style={{ 
                fontSize: '0.875rem',
                color: THEME.SECONDARY,
                textDecoration: 'none'
              }}>
                Forgot password?
              </a>
            </div>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              required
              disabled={loading}
              style={{ 
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                border: '1px solid #d1d5db',
                fontSize: '1rem'
              }}
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button" 
            disabled={loading}
            style={{ 
              backgroundColor: THEME.PRIMARY,
              color: 'white',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              border: 'none',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              width: '100%',
              transition: 'background-color 0.3s ease'
            }}
          >
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg className="animate-spin" style={{ 
                  animation: 'spin 1s linear infinite',
                  marginRight: '0.5rem',
                  height: '1.25rem',
                  width: '1.25rem'
                }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </div>
            ) : "Login"}
          </button>
        </form>
        
        <div className="auth-footer" style={{ 
          textAlign: 'center',
          marginTop: '1.5rem',
          color: THEME.TEXT_MUTED,
          fontSize: '0.875rem'
        }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ 
            color: THEME.SECONDARY,
            fontWeight: '500',
            textDecoration: 'none'
          }}>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
