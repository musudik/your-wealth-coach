import { useState } from "react";
import { TrendingUp } from "lucide-react";

export default function Performance() {
  const [metrics, setMetrics] = useState([
    { month: "Jan", clients: 5, forms: 12 },
    { month: "Feb", clients: 7, forms: 15 },
    { month: "Mar", clients: 10, forms: 18 },
    { month: "Apr", clients: 8, forms: 20 },
    { month: "May", clients: 12, forms: 25 },
    { month: "Jun", clients: 15, forms: 30 }
  ]);
  
  const [selectedMetric, setSelectedMetric] = useState("clients");
  
  const getMaxValue = () => {
    return Math.max(...metrics.map(m => m[selectedMetric])) * 1.2;
  };
  
  return (
    <div>
      <h2 style={{ 
        fontSize: '1.25rem', 
        fontWeight: '600', 
        color: '#1e293b',
        marginBottom: '1.5rem'
      }}>
        Performance Metrics
      </h2>
      
      <div style={{ 
        display: 'flex',
        gap: '0.75rem',
        marginBottom: '1.5rem'
      }}>
        {["clients", "forms"].map(metric => (
          <button
            key={metric}
            onClick={() => setSelectedMetric(metric)}
            style={{ 
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              backgroundColor: selectedMetric === metric ? '#3b82f6' : '#f8fafc',
              color: selectedMetric === metric ? 'white' : '#64748b',
              fontWeight: '500',
              border: selectedMetric === metric ? 'none' : '1px solid #e2e8f0',
              cursor: 'pointer'
            }}
          >
            {metric.charAt(0).toUpperCase() + metric.slice(1)}
          </button>
        ))}
      </div>
      
      <div style={{ 
        backgroundColor: '#f8fafc',
        borderRadius: '0.5rem',
        padding: '1.5rem'
      }}>
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <h3 style={{ 
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#1e293b'
          }}>
            Monthly {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}
          </h3>
          
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.75rem',
            color: '#64748b'
          }}>
            <div style={{ 
              width: '0.75rem',
              height: '0.75rem',
              backgroundColor: '#3b82f6',
              borderRadius: '50%'
            }}></div>
            <span>
              {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}
            </span>
          </div>
        </div>
        
        <div style={{ 
          height: '200px',
          display: 'flex',
          alignItems: 'flex-end',
          gap: '0.5rem',
          position: 'relative',
          padding: '0 0.5rem'
        }}>
          {/* Y-axis grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map(ratio => (
            <div 
              key={ratio}
              style={{ 
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: `${ratio * 100}%`,
                borderTop: ratio > 0 ? '1px dashed #e2e8f0' : 'none',
                zIndex: 0
              }}
            />
          ))}
          
          {/* Bars */}
          {metrics.map((data, index) => (
            <div 
              key={index}
              style={{ 
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
                position: 'relative',
                zIndex: 1
              }}
            >
              <div 
                style={{ 
                  width: '100%',
                  maxWidth: '2rem',
                  height: `${(data[selectedMetric] / getMaxValue()) * 100}%`,
                  backgroundColor: '#3b82f6',
                  borderRadius: '0.25rem 0.25rem 0 0',
                  transition: 'height 0.3s ease'
                }}
              />
              <div style={{ 
                marginTop: '0.5rem',
                fontSize: '0.75rem',
                color: '#64748b'
              }}>
                {data.month}
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '1.5rem',
          padding: '0 0.5rem'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Total
            </div>
            <div style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: '#1e293b'
            }}>
              {metrics.reduce((sum, data) => sum + data[selectedMetric], 0)}
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Average
            </div>
            <div style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: '#1e293b'
            }}>
              {Math.round(metrics.reduce((sum, data) => sum + data[selectedMetric], 0) / metrics.length)}
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Growth
            </div>
            <div style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <TrendingUp size={16} />
              {Math.round(((metrics[metrics.length - 1][selectedMetric] - metrics[0][selectedMetric]) / metrics[0][selectedMetric]) * 100)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 