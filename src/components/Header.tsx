import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const history = useHistory();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <style>
        {`
          @media (min-width: 768px) {
            .desktop-nav {
              display: block !important;
            }
            .mobile-menu-button {
              display: none !important;
            }
          }
          .nav-link:hover {
            color: #00d084 !important;
            border-bottom-color: #00d084 !important;
          }
        `}
      </style>
      <header style={{ 
        backgroundColor: 'white', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', 
        position: 'sticky', 
        top: 0, 
        zIndex: 50,
        padding: '1rem 0'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <div style={{ 
              width: '2.5rem', 
              height: '2.5rem', 
              backgroundColor: '#003366', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#00d084',
              fontWeight: 'bold',
              fontSize: '1.25rem'
            }}>
              YW
            </div>
            <span style={{ 
              marginLeft: '0.75rem', 
              fontSize: '1.25rem', 
              fontWeight: '600',
              color: '#003366'
            }}>
              Your Wealth Coach
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav style={{ 
            display: 'none'
          }} className="desktop-nav">
            <ul style={{ 
              display: 'flex', 
              gap: '2rem', 
              alignItems: 'center',
              margin: 0,
              padding: 0,
              listStyle: 'none'
            }}>
              <li>
                <Link to="/" style={{ 
                  color: '#1a202c', 
                  textDecoration: 'none',
                  fontWeight: '500',
                  padding: '0.5rem 0',
                  borderBottom: '2px solid transparent',
                  transition: 'all 0.3s ease'
                }} className="nav-link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/insurances" style={{ 
                  color: '#1a202c', 
                  textDecoration: 'none',
                  fontWeight: '500',
                  padding: '0.5rem 0',
                  borderBottom: '2px solid transparent',
                  transition: 'all 0.3s ease'
                }} className="nav-link">
                  Insurances
                </Link>
              </li>
              <li>
                <Link to="/loans" style={{ 
                  color: '#1a202c', 
                  textDecoration: 'none',
                  fontWeight: '500',
                  padding: '0.5rem 0',
                  borderBottom: '2px solid transparent',
                  transition: 'all 0.3s ease'
                }} className="nav-link">
                  Loans
                </Link>
              </li>
              <li>
                <Link to="/real-estate" style={{ 
                  color: '#1a202c', 
                  textDecoration: 'none',
                  fontWeight: '500',
                  padding: '0.5rem 0',
                  borderBottom: '2px solid transparent',
                  transition: 'all 0.3s ease'
                }} className="nav-link">
                  Real Estate
                </Link>
              </li>
              <li>
                <Link to="/tax-returns" style={{ 
                  color: '#1a202c', 
                  textDecoration: 'none',
                  fontWeight: '500',
                  padding: '0.5rem 0',
                  borderBottom: '2px solid transparent',
                  transition: 'all 0.3s ease'
                }} className="nav-link">
                  Tax Returns
                </Link>
              </li>
              <li>
                <Link to="/about-us" style={{ 
                  color: '#1a202c', 
                  textDecoration: 'none',
                  fontWeight: '500',
                  padding: '0.5rem 0',
                  borderBottom: '2px solid transparent',
                  transition: 'all 0.3s ease'
                }} className="nav-link">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/login" style={{ 
                  backgroundColor: '#00d084',
                  color: '#003366',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '0.375rem',
                  fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                  Login
                </Link>
              </li>
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMenu}
            style={{ 
              display: 'block',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem'
            }}
            className="mobile-menu-button"
            aria-label="Toggle menu"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path 
                  d="M6 18L18 6M6 6L18 18" 
                  stroke="#003366" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              ) : (
                <path 
                  d="M4 6H20M4 12H20M4 18H20" 
                  stroke="#003366" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div style={{ 
            padding: '1rem',
            backgroundColor: 'white',
            borderTop: '1px solid #e2e8f0'
          }}>
            <nav>
              <ul style={{ 
                margin: 0,
                padding: 0,
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <li>
                  <Link to="/" style={{ 
                    color: '#1a202c', 
                    textDecoration: 'none',
                    fontWeight: '500',
                    display: 'block',
                    padding: '0.5rem 0'
                  }}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/insurances" style={{ 
                    color: '#1a202c', 
                    textDecoration: 'none',
                    fontWeight: '500',
                    display: 'block',
                    padding: '0.5rem 0'
                  }}>
                    Insurances
                  </Link>
                </li>
                <li>
                  <Link to="/loans" style={{ 
                    color: '#1a202c', 
                    textDecoration: 'none',
                    fontWeight: '500',
                    display: 'block',
                    padding: '0.5rem 0'
                  }}>
                    Loans
                  </Link>
                </li>
                <li>
                  <Link to="/real-estate" style={{ 
                    color: '#1a202c', 
                    textDecoration: 'none',
                    fontWeight: '500',
                    display: 'block',
                    padding: '0.5rem 0'
                  }}>
                    Real Estate
                  </Link>
                </li>
                <li>
                  <Link to="/tax-returns" style={{ 
                    color: '#1a202c', 
                    textDecoration: 'none',
                    fontWeight: '500',
                    display: 'block',
                    padding: '0.5rem 0'
                  }}>
                    Tax Returns
                  </Link>
                </li>
                <li>
                  <Link to="/about-us" style={{ 
                    color: '#1a202c', 
                    textDecoration: 'none',
                    fontWeight: '500',
                    display: 'block',
                    padding: '0.5rem 0'
                  }}>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/login" style={{ 
                    color: '#003366', 
                    textDecoration: 'none',
                    fontWeight: '600',
                    display: 'block',
                    padding: '0.5rem 0'
                  }}>
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/signup" style={{ 
                    backgroundColor: '#00d084',
                    color: '#003366',
                    textDecoration: 'none',
                    fontWeight: '600',
                    display: 'block',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem',
                    textAlign: 'center'
                  }}>
                    Sign Up
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default Header; 