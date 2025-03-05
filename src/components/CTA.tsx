import React from 'react';

const CTA = () => {
  return (
    <>
      <style>
        {`
          @media (min-width: 992px) {
            .cta-grid {
              grid-template-columns: 1fr 1fr !important;
              gap: 3rem !important;
            }
          }
        `}
      </style>
      <section style={{ 
        padding: '5rem 0', 
        background: 'linear-gradient(135deg, #003366, #006633)', 
        color: 'white'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 1rem'
        }}>
          <div className="cta-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr', 
            gap: '3rem', 
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h2 style={{ 
                fontSize: 'clamp(1.875rem, 3vw, 2.25rem)', 
                fontWeight: 'bold', 
                lineHeight: '1.2'
              }}>
                Ready to Transform Your Financial Future?
              </h2>
              <p style={{ 
                fontSize: '1.125rem', 
                opacity: '0.9', 
                maxWidth: '32rem'
              }}>
                Join thousands of clients who have achieved financial freedom with Your Wealth Coach. Book a consultation today and start your journey to building lasting wealth.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <a href="#" style={{ 
                  backgroundColor: '#00d084', 
                  color: '#003366', 
                  padding: '0.75rem 1.5rem', 
                  borderRadius: '0.375rem', 
                  fontWeight: '600', 
                  textDecoration: 'none', 
                  display: 'inline-block', 
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}>
                  Book a Consultation
                </a>
                <a href="#" style={{ 
                  backgroundColor: 'transparent', 
                  border: '1px solid #00d084', 
                  color: '#00d084', 
                  padding: '0.75rem 1.5rem', 
                  borderRadius: '0.375rem', 
                  fontWeight: '500', 
                  textDecoration: 'none', 
                  display: 'inline-block', 
                  transition: 'all 0.3s ease'
                }}>
                  Learn More
                </a>
              </div>
            </div>
            
            <div style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.1)', 
              backdropFilter: 'blur(8px)', 
              borderRadius: '0.5rem', 
              padding: '2rem', 
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              border: '1px solid rgba(0, 208, 132, 0.3)'
            }}>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: 'bold', 
                marginBottom: '1.5rem'
              }}>
                Schedule Your Free Consultation
              </h3>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    marginBottom: '0.25rem'
                  }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem 1rem', 
                      backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                      border: '1px solid rgba(255, 255, 255, 0.3)', 
                      borderRadius: '0.375rem', 
                      color: 'white'
                    }}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    marginBottom: '0.25rem'
                  }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem 1rem', 
                      backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                      border: '1px solid rgba(255, 255, 255, 0.3)', 
                      borderRadius: '0.375rem', 
                      color: 'white'
                    }}
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    marginBottom: '0.25rem'
                  }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem 1rem', 
                      backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                      border: '1px solid rgba(255, 255, 255, 0.3)', 
                      borderRadius: '0.375rem', 
                      color: 'white'
                    }}
                    placeholder="(123) 456-7890"
                  />
                </div>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    marginBottom: '0.25rem'
                  }}>
                    What are your financial goals?
                  </label>
                  <select style={{ 
                    width: '100%', 
                    padding: '0.75rem 1rem', 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                    border: '1px solid rgba(255, 255, 255, 0.3)', 
                    borderRadius: '0.375rem', 
                    color: 'white'
                  }}>
                    <option style={{ color: '#1a1a1a' }}>Building wealth</option>
                    <option style={{ color: '#1a1a1a' }}>Retirement planning</option>
                    <option style={{ color: '#1a1a1a' }}>Tax optimization</option>
                    <option style={{ color: '#1a1a1a' }}>Real estate investment</option>
                    <option style={{ color: '#1a1a1a' }}>Other financial goals</option>
                  </select>
                </div>
                <div style={{ paddingTop: '0.5rem' }}>
                  <button
                    type="button"
                    style={{ 
                      width: '100%', 
                      backgroundColor: '#00d084', 
                      color: '#003366', 
                      padding: '0.75rem 0', 
                      borderRadius: '0.375rem', 
                      fontWeight: '600', 
                      border: 'none', 
                      cursor: 'pointer', 
                      transition: 'background-color 0.3s',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    Book My Consultation
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CTA; 