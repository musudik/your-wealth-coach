import { useState } from "react";
import { FileText, FileCheck, FilePlus } from "lucide-react";

interface FormCategory {
  id: string;
  name: string;
  description: string;
  count: number;
  icon: 'form' | 'completed' | 'new';
}

export function FormCategories() {
  const [categories] = useState<FormCategory[]>([
    {
      id: "tax-returns",
      name: "Tax Returns",
      description: "Annual tax filing forms and documentation",
      count: 12,
      icon: 'form'
    },
    {
      id: "insurance",
      name: "Insurance Forms",
      description: "Life, health, and property insurance applications",
      count: 8,
      icon: 'form'
    },
    {
      id: "real-estate",
      name: "Real Estate",
      description: "Property assessment and mortgage applications",
      count: 5,
      icon: 'form'
    },
    {
      id: "investments",
      name: "Investment Forms",
      description: "Portfolio management and investment declarations",
      count: 7,
      icon: 'form'
    },
    {
      id: "completed",
      name: "Completed Forms",
      description: "Forms that have been processed and completed",
      count: 23,
      icon: 'completed'
    },
    {
      id: "new-form",
      name: "Create New Form",
      description: "Start a new form for a client",
      count: 0,
      icon: 'new'
    }
  ]);

  const getIcon = (iconType: FormCategory['icon']) => {
    switch (iconType) {
      case 'form':
        return <FileText size={20} />;
      case 'completed':
        return <FileCheck size={20} />;
      case 'new':
        return <FilePlus size={20} />;
      default:
        return <FileText size={20} />;
    }
  };

  const getIconColor = (iconType: FormCategory['icon']) => {
    switch (iconType) {
      case 'form':
        return '#003366';
      case 'completed':
        return '#00d084';
      case 'new':
        return '#4f46e5';
      default:
        return '#6b7280';
    }
  };

  const getIconBackground = (iconType: FormCategory['icon']) => {
    switch (iconType) {
      case 'form':
        return 'rgba(0, 51, 102, 0.1)';
      case 'completed':
        return 'rgba(0, 208, 132, 0.1)';
      case 'new':
        return 'rgba(79, 70, 229, 0.1)';
      default:
        return 'rgba(107, 114, 128, 0.1)';
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
        Form Categories
      </h3>

      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(1, 1fr)',
        gap: '1rem'
      }} className="sm:grid-cols-2 lg:grid-cols-3">
        {categories.map(category => (
          <div 
            key={category.id} 
            style={{ 
              padding: '1.25rem',
              borderRadius: '0.5rem',
              backgroundColor: 'white',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            className="hover:shadow-md hover:-translate-y-1 transition-all duration-200"
          >
            <div style={{ 
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}>
              <div style={{ 
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '0.5rem',
                backgroundColor: getIconBackground(category.icon),
                color: getIconColor(category.icon),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {getIcon(category.icon)}
              </div>
              {category.count > 0 && (
                <div style={{ 
                  backgroundColor: 'rgba(0, 51, 102, 0.1)',
                  color: '#003366',
                  borderRadius: '9999px',
                  padding: '0.25rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  {category.count}
                </div>
              )}
            </div>
            <h4 style={{ 
              fontSize: '1rem',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              {category.name}
            </h4>
            <p style={{ 
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              {category.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
} 