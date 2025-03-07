import { useState } from "react";
import { TrendingUp, Users, FileText, Calendar } from "lucide-react";

interface MetricData {
  month: string;
  clients: number;
  forms: number;
  appointments: number;
}

export function PerformanceMetrics() {
  const [metrics] = useState<MetricData[]>([
    { month: "Jan", clients: 5, forms: 12, appointments: 8 },
    { month: "Feb", clients: 7, forms: 15, appointments: 10 },
    { month: "Mar", clients: 10, forms: 18, appointments: 12 },
    { month: "Apr", clients: 8, forms: 20, appointments: 15 },
    { month: "May", clients: 12, forms: 25, appointments: 18 },
    { month: "Jun", clients: 15, forms: 30, appointments: 22 }
  ]);

  const [selectedMetric, setSelectedMetric] = useState<'clients' | 'forms' | 'appointments'>('clients');

  const getMaxValue = () => {
    return Math.max(...metrics.map(m => m[selectedMetric])) * 1.2;
  };

  const getMetricColor = (metric: 'clients' | 'forms' | 'appointments') => {
    switch (metric) {
      case 'clients':
        return '#003366';
      case 'forms':
        return '#00d084';
      case 'appointments':
        return '#4f46e5';
      default:
        return '#6b7280';
    }
  };

  const getMetricIcon = (metric: 'clients' | 'forms' | 'appointments') => {
    switch (metric) {
      case 'clients':
        return <Users size={16} />;
      case 'forms':
        return <FileText size={16} />;
      case 'appointments':
        return <Calendar size={16} />;
      default:
        return <TrendingUp size={16} />;
    }
  };

  return (
    <div>
      <h3 style={{ 
        fontSize: '1rem', 
        fontWeight: '600', 
        color: '#111827',
        marginBottom: '1rem'
      }}>
        Performance Metrics
      </h3>

      <div style={{ 
        display: 'flex',
        gap: '0.75rem',
        marginBottom: '1.5rem'
      }}>
        {(['clients', 'forms', 'appointments'] as const).map(metric => (
          <button
            key={metric}
            onClick={() => setSelectedMetric(metric)}
            style={{ 
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              backgroundColor: selectedMetric === metric 
                ? getMetricColor(metric) 
                : 'white',
              color: selectedMetric === metric 
                ? 'white' 
                : '#6b7280',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}
          >
            {getMetricIcon(metric)}
            <span style={{ textTransform: 'capitalize' }}>
              {metric}
            </span>
          </button>
        ))}
      </div>

      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        padding: '1.5rem'
      }}>
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <h4 style={{ 
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#111827'
          }}>
            Monthly {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}
          </h4>
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.75rem',
            color: '#6b7280'
          }}>
            <div style={{ 
              width: '0.75rem',
              height: '0.75rem',
              backgroundColor: getMetricColor(selectedMetric),
              borderRadius: '50%'
            }}></div>
            <span style={{ textTransform: 'capitalize' }}>
              {selectedMetric}
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
                borderTop: ratio > 0 ? '1px dashed #e5e7eb' : 'none',
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
                  backgroundColor: getMetricColor(selectedMetric),
                  borderRadius: '0.25rem 0.25rem 0 0',
                  transition: 'height 0.3s ease'
                }}
              />
              <div style={{ 
                marginTop: '0.5rem',
                fontSize: '0.75rem',
                color: '#6b7280'
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
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              Total
            </div>
            <div style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: '#111827'
            }}>
              {metrics.reduce((sum, data) => sum + data[selectedMetric], 0)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              Average
            </div>
            <div style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: '#111827'
            }}>
              {Math.round(metrics.reduce((sum, data) => sum + data[selectedMetric], 0) / metrics.length)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              Growth
            </div>
            <div style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: '#00d084',
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