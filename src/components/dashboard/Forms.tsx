import { useState } from "react";
import { FileText, FileCheck, FilePlus } from "lucide-react";
import { FormTypes } from "../../types/types"; // Import FormTypes from types.ts

export default function Forms() {
  // Use FormTypes from types.ts to create form categories
  const [formCategories, setFormCategories] = useState(
    FormTypes.map(formType => ({
      id: formType.toLowerCase().replace(/\s+/g, '-'),
      title: formType,
      description: `${formType} forms and documentation`,
      count: Math.floor(Math.random() * 5), // Random count for demo
      icon: "form"
    })).concat([
      {
        id: "new",
        title: "Create New Form",
        description: "Start a new form for a client",
        count: 0,
        icon: "new"
      }
    ])
  );
  
  const getIcon = (icon) => {
    switch (icon) {
      case "form":
        return <FileText size={20} />;
      case "completed":
        return <FileCheck size={20} />;
      case "new":
        return <FilePlus size={20} />;
      default:
        return <FileText size={20} />;
    }
  };
  
  const getIconStyles = (icon) => {
    switch (icon) {
      case "form":
        return {
          bg: "#dbeafe",
          color: "#2563eb"
        };
      case "completed":
        return {
          bg: "#dcfce7",
          color: "#16a34a"
        };
      case "new":
        return {
          bg: "#e0e7ff",
          color: "#4f46e5"
        };
      default:
        return {
          bg: "#f1f5f9",
          color: "#64748b"
        };
    }
  };
  
  return (
    <div>
      <h2 style={{ 
        fontSize: '1.25rem', 
        fontWeight: '600', 
        color: '#1e293b',
        marginBottom: '1.5rem'
      }}>
        Form Categories
      </h2>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem'
      }}>
        {formCategories.map(category => {
          const iconStyles = getIconStyles(category.icon);
          
          return (
            <div 
              key={category.id}
              style={{
                padding: '1.25rem',
                borderRadius: '0.5rem',
                backgroundColor: '#f8fafc',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                position: 'relative'
              }}
              className="hover:shadow-md hover:-translate-y-1"
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
                  backgroundColor: iconStyles.bg,
                  color: iconStyles.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {getIcon(category.icon)}
                </div>
                
                {category.count > 0 && (
                  <div style={{ 
                    backgroundColor: '#dbeafe',
                    color: '#2563eb',
                    borderRadius: '9999px',
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {category.count}
                  </div>
                )}
              </div>
              
              <h3 style={{ 
                fontSize: '1rem',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '0.5rem'
              }}>
                {category.title}
              </h3>
              
              <p style={{ 
                fontSize: '0.875rem',
                color: '#64748b'
              }}>
                {category.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
} 