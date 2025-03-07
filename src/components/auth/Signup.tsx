import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../db-services/authService";
import "./auth.css";
import { THEME } from "../../config";

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"client" | "partner">("client");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    
    // Validate password match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    // Validate password strength
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    
    setLoading(true);

    try {
      // Use the registerUser function from authService
      await registerUser(email, password, name, role);
      
      // Show success message
      setSuccessMessage("Account created successfully!");
      
      // Clear form
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setName("");
      
      // Redirect to login after a delay
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (error: any) {
      console.error("Signup error:", error);
      
      // Handle different error codes
      if (error.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            setError("Email is already in use. Please use a different email or login.");
            break;
          case 'auth/invalid-email':
            setError("Invalid email address.");
            break;
          case 'auth/weak-password':
            setError("Password is too weak. Please use a stronger password.");
            break;
          default:
            setError("Failed to create account. Please try again.");
        }
      } else {
        setError(error.message || "Failed to create account");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ backgroundColor: '#f9fafb' }}>
      <div style={{ 
        maxWidth: '500px',
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
        
        <h2 className="auth-title" style={{ color: THEME.PRIMARY }}>Create Your Account</h2>
        
        {error && <div className="auth-error">{error}</div>}
        {successMessage && <div className="auth-success">{successMessage}</div>}
        
        <div style={{ 
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <button 
            type="button"
            onClick={() => setRole("client")}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: '1px solid',
              borderColor: role === "client" ? THEME.SECONDARY : '#d1d5db',
              backgroundColor: role === "client" ? `${THEME.SECONDARY}20` : 'white',
              color: role === "client" ? THEME.PRIMARY : THEME.TEXT_DARK,
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Client
          </button>
          <button 
            type="button"
            onClick={() => setRole("partner")}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: '1px solid',
              borderColor: role === "partner" ? THEME.SECONDARY : '#d1d5db',
              backgroundColor: role === "partner" ? `${THEME.SECONDARY}20` : 'white',
              color: role === "partner" ? THEME.PRIMARY : THEME.TEXT_DARK,
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Partner
          </button>
        </div>
        
        <form onSubmit={handleSignup} className="auth-form">
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="name" style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              color: THEME.TEXT_DARK,
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
          
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="password" style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              color: THEME.TEXT_DARK,
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              required
              disabled={loading}
              minLength={6}
              style={{ 
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                border: '1px solid #d1d5db',
                fontSize: '1rem'
              }}
            />
            <p style={{ 
              fontSize: '0.75rem',
              color: THEME.TEXT_MUTED,
              marginTop: '0.25rem'
            }}>
              Password must be at least 6 characters long
            </p>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="confirmPassword" style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              color: THEME.TEXT_DARK,
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
                Creating Account...
              </div>
            ) : `Sign up as ${role === 'client' ? 'Client' : 'Partner'}`}
          </button>
        </form>
        
        <div className="auth-footer" style={{ 
          textAlign: 'center',
          marginTop: '1.5rem',
          color: THEME.TEXT_MUTED,
          fontSize: '0.875rem'
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{ 
            color: THEME.SECONDARY,
            fontWeight: '500',
            textDecoration: 'none'
          }}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
