import React from 'react';
import MatrixBackground from './MatrixBackground';

const Hero = () => {
  return (
    <>
      <style>
        {`
          @media (min-width: 768px) {
            .hero-grid {
              grid-template-columns: 1fr 1fr !important;
            }
          }
        `}
      </style>
      <section style={{ 
        position: 'relative',
        padding: '5rem 0',
        color: 'white',
        overflow: 'hidden',
        backgroundColor: 'rgba(0, 20, 40, 0.9)',
        minHeight: '80vh'
      }}>
        {/* Matrix Background */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <MatrixBackground />
        </div>
        
        {/* Content overlay */}
        <div style={{
          position: 'relative',
          zIndex: 10
        }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '3rem',
              alignItems: 'center'
            }} className="hero-grid">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h1 style={{ 
                  fontSize: 'clamp(2rem, 5vw, 3.75rem)',
                  fontWeight: 'bold',
                  lineHeight: '1.2',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                }}>
                  Your Path to Financial Freedom
                </h1>
                <p style={{ 
                  fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                  opacity: '0.9',
                  maxWidth: '32rem',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                }}>
                  Expert financial coaching to help you build wealth, secure your future, and achieve your financial goals.
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
                    Start Your Journey
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
                    Book a Consultation
                  </a>
                </div>
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  paddingTop: '1rem'
                }}>
                  <div style={{ display: 'flex' }}>
                    {[1, 2, 3, 4].map((i) => (
                      <div 
                        key={i} 
                        style={{ 
                          width: '2.5rem',
                          height: '2.5rem',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(0, 208, 132, 0.2)',
                          border: '2px solid #00d084',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          marginLeft: i > 1 ? '-0.5rem' : '0'
                        }}
                      >
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600' }}>Trusted by 5,000+ clients</div>
                    <div style={{ fontSize: '0.875rem', opacity: '0.8' }}>Rated 4.9/5 from 2,000+ reviews</div>
                  </div>
                </div>
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '0.5rem',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
                  padding: '2rem',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <h3 style={{ 
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    marginBottom: '1.5rem',
                    textAlign: 'center'
                  }}>Why Choose Your Wealth Coach?</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                      <div style={{ 
                        minWidth: '2.5rem', 
                        height: '2.5rem', 
                        backgroundColor: 'rgba(0, 208, 132, 0.2)', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: '#00d084',
                        fontWeight: 'bold'
                      }}>1</div>
                      <div>
                        <h4 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Personalized Strategy</h4>
                        <p style={{ fontSize: '0.9rem', opacity: '0.9' }}>Custom financial plans tailored to your unique goals and circumstances.</p>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                      <div style={{ 
                        minWidth: '2.5rem', 
                        height: '2.5rem', 
                        backgroundColor: 'rgba(0, 208, 132, 0.2)', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: '#00d084',
                        fontWeight: 'bold'
                      }}>2</div>
                      <div>
                        <h4 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Expert Guidance</h4>
                        <p style={{ fontSize: '0.9rem', opacity: '0.9' }}>Certified financial coaches with decades of industry experience.</p>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                      <div style={{ 
                        minWidth: '2.5rem', 
                        height: '2.5rem', 
                        backgroundColor: 'rgba(0, 208, 132, 0.2)', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: '#00d084',
                        fontWeight: 'bold'
                      }}>3</div>
                      <div>
                        <h4 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Holistic Approach</h4>
                        <p style={{ fontSize: '0.9rem', opacity: '0.9' }}>We address all aspects of your financial life: savings, investments, taxes, and more.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero; 