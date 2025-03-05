import React from 'react';

const Footer = () => {
  const socialIcons = [
    {
      name: 'Facebook',
      path: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z',
    },
    {
      name: 'Twitter',
      path: 'M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84',
    },
    {
      name: 'Instagram',
      path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
    },
    {
      name: 'LinkedIn',
      path: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z',
    },
  ];

  return (
    <>
      <style>
        {`
          @media (min-width: 768px) {
            .footer-flex-container {
              flex-direction: row !important;
            }
            .footer-separator {
              display: inline !important;
            }
          }
        `}
      </style>
      <footer style={{ 
        backgroundColor: '#003366', 
        color: 'white', 
        paddingTop: '4rem', 
        paddingBottom: '2rem'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 1rem'
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '2rem', 
            marginBottom: '3rem'
          }}>
            <div style={{ gridColumn: 'span 1' }}>
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: '#00d084', 
                marginBottom: '1.5rem' 
              }}>
                Your Wealth Coach
              </h3>
              <p style={{ 
                color: '#a0aec0', 
                marginBottom: '1.5rem', 
                maxWidth: '20rem'
              }}>
                Your Wealth Coach is dedicated to helping individuals and families build lasting wealth through personalized financial coaching and strategic planning.
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {socialIcons.map((icon, index) => (
                  <a 
                    key={index} 
                    href="#" 
                    style={{ 
                      color: '#a0aec0', 
                      transition: 'color 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.color = '#00d084';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.color = '#a0aec0';
                    }}
                  >
                    <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d={icon.path}></path>
                    </svg>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                marginBottom: '1rem',
                color: '#00d084'
              }}>
                Quick Links
              </h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {['Home', 'About Us', 'Services', 'Resources', 'Contact Us'].map((item, index) => (
                  <li key={index}>
                    <a 
                      href="#" 
                      style={{ 
                        color: '#a0aec0', 
                        transition: 'color 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.color = '#00d084';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.color = '#a0aec0';
                      }}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                marginBottom: '1rem',
                color: '#00d084'
              }}>
                Financial Services
              </h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {['Wealth Building', 'Retirement Planning', 'Tax Optimization', 'Real Estate Investment', 'Insurance Analysis'].map((item, index) => (
                  <li key={index}>
                    <a 
                      href="#" 
                      style={{ 
                        color: '#a0aec0', 
                        transition: 'color 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.color = '#00d084';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.color = '#a0aec0';
                      }}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                marginBottom: '1rem',
                color: '#00d084'
              }}>
                Contact Info
              </h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <svg style={{ width: '1.25rem', height: '1.25rem', color: '#00d084', marginRight: '0.75rem', marginTop: '0.125rem' }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                  </svg>
                  <span style={{ color: '#a0aec0' }}>123 Wealth Avenue, Financial District, New York, NY 10001</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center' }}>
                  <svg style={{ width: '1.25rem', height: '1.25rem', color: '#00d084', marginRight: '0.75rem' }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                  </svg>
                  <span style={{ color: '#a0aec0' }}>+1 800 987 6543</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center' }}>
                  <svg style={{ width: '1.25rem', height: '1.25rem', color: '#00d084', marginRight: '0.75rem' }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                  </svg>
                  <span style={{ color: '#a0aec0' }}>info@yourwealthcoach.com</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div style={{ 
            borderTop: '1px solid rgba(0, 208, 132, 0.2)', 
            paddingTop: '2rem'
          }}>
            <div className="footer-flex-container" style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              gap: '1rem'
            }}>
              <p style={{ 
                color: '#a0aec0', 
                fontSize: '0.875rem'
              }}>
                &copy; {new Date().getFullYear()} Your Wealth Coach. All rights reserved.
              </p>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '1rem', 
                fontSize: '0.875rem', 
                color: '#a0aec0'
              }}>
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Accessibility'].map((item, index) => (
                  <React.Fragment key={index}>
                    <a 
                      href="#" 
                      style={{ 
                        color: '#a0aec0', 
                        transition: 'color 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.color = '#00d084';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.color = '#a0aec0';
                      }}
                    >
                      {item}
                    </a>
                    {index < 3 && (
                      <span className="footer-separator" style={{ 
                        display: 'none'
                      }}>|</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer; 