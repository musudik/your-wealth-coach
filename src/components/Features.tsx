import { useState } from 'react';
import './features-icons.css';

const Features = () => {
  const features = [
    {
      icon: (
        <svg style={{ width: '2.5rem', height: '2.5rem', color: '#00d084' }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path>
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"></path>
        </svg>
      ),
      title: 'WEALTH BUILDING',
      subtitle: 'Strategic Growth',
      description: 'Our wealth building strategies are designed to help you grow your assets systematically over time. We focus on sustainable growth methods that align with your risk tolerance and financial goals.',
      image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      hoverIcon: 'icon-money'
    },
    {
      icon: (
        <svg style={{ width: '2.5rem', height: '2.5rem', color: '#00d084' }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"></path>
          <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"></path>
        </svg>
      ),
      title: 'RETIREMENT PLANNING',
      subtitle: 'Secure Future',
      description: 'Our comprehensive retirement planning ensures you can enjoy your golden years without financial stress. We create personalized strategies that account for inflation, healthcare costs, and your desired lifestyle.',
      image: 'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      hoverIcon: 'icon-calendar'
    },
    {
      icon: (
        <svg style={{ width: '2.5rem', height: '2.5rem', color: '#00d084' }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
        </svg>
      ),
      title: 'TAX OPTIMIZATION',
      subtitle: 'Maximize Returns',
      description: 'Our tax optimization services help you legally minimize your tax burden while maximizing your wealth. We implement strategic tax planning that takes advantage of available deductions, credits, and investment structures.',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      hoverIcon: 'icon-doc'
    },
    {
      icon: (
        <svg style={{ width: '2.5rem', height: '2.5rem', color: '#00d084' }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
        </svg>
      ),
      title: 'FAMILY PLANNING',
      subtitle: 'Generational Wealth',
      description: "Our family financial planning services help you build and preserve wealth across generations. We address education funding, estate planning, and wealth transfer strategies to secure your family's financial future.",
      image: 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      hoverIcon: 'icon-users'
    },
    {
      icon: (
        <svg style={{ width: '2.5rem', height: '2.5rem', color: '#00d084' }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"></path>
        </svg>
      ),
      title: 'REAL ESTATE',
      subtitle: 'Property Investment',
      description: 'Our real estate investment services provide expert guidance on building wealth through property. We analyze market trends, identify opportunities, and help you develop a diversified real estate portfolio that generates passive income.',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      hoverIcon: 'icon-home'
    },
    {
      icon: (
        <svg style={{ width: '2.5rem', height: '2.5rem', color: '#00d084' }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"></path>
        </svg>
      ),
      title: 'INSURANCE ANALYSIS',
      subtitle: 'Protection Planning',
      description: 'Our comprehensive insurance analysis ensures you have the right coverage at the best rates. We review your existing policies, identify gaps, and recommend adjustments to protect your assets and loved ones without overpaying.',
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      hoverIcon: 'icon-shield'
    },
  ];

  return (
    <section style={{ 
      padding: '5rem 0', 
      backgroundColor: '#f9fafb'
    }}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          .feature-box {
            position: relative;
            overflow: hidden;
            height: 320px;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            transition: all 0.3s ease;
          }
          
          .feature-box:hover {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          }
          
          .feature-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 1;
          }
          
          .feature-content {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            padding: 1.5rem;
            background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
            color: white;
            z-index: 2;
            transition: all 0.3s ease;
          }
          
          .feature-box:hover .feature-content {
            opacity: 0;
          }
          
          .feature-hover {
            position: absolute;
            top: 0;
            left: 0;
            width: 90%;
            height: 100%;
            background-color: rgba(0, 51, 102, 0.9);
            color: white;
            padding: 2rem;
            z-index: 3;
            opacity: 0;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            justify-content: center;
            animation: fadeIn 0.3s ease forwards;
          }
          
          .feature-box:hover .feature-hover {
            opacity: 1;
          }
          
          .feature-icon {
            font-size: 2rem;
            margin-bottom: 1rem;
            color: #00d084;
          }
        `}
      </style>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 1rem'
      }}>
        <div style={{ 
          textAlign: 'center', 
          maxWidth: '48rem', 
          margin: '0 auto', 
          marginBottom: '4rem'
        }}>
          <h2 style={{ 
            fontSize: 'clamp(1.875rem, 3vw, 2.25rem)', 
            fontWeight: 'bold', 
            marginBottom: '1rem',
            color: '#1a1a1a'
          }}>
            Financial Coaching Services
          </h2>
          <p style={{ 
            fontSize: '1.125rem', 
            color: '#4b5563'
          }}>
            Comprehensive financial coaching services designed to help you build wealth and secure your financial future.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '2rem'
        }}>
          {features.map((feature, index) => {
            const [isHovered, setIsHovered] = useState(false);
            
            return (
              <div
                key={index}
                className="feature-box"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <img 
                  src={feature.image} 
                  alt={feature.title} 
                  className="feature-image"
                />
                
                <div className="feature-content">
                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: '700', 
                    marginBottom: '0.25rem',
                  }}>
                    {feature.title}
                  </h3>
                  <p>{feature.subtitle}</p>
                  <i className={feature.hoverIcon} style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}></i>
                </div>
                
                {isHovered && (
                  <div className="feature-hover">
                    <h3 style={{ 
                      fontSize: '1.2rem', 
                      fontWeight: '700', 
                      marginBottom: '1rem',
                      color: '#00d084'
                    }}>
                      {feature.title}
                    </h3>
                    <p style={{ lineHeight: '1.6' }}>{feature.description}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features; 