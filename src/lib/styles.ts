// Central styles configuration
export const styles = {
  // Layout
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  formContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem 1rem',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  
  // Typography
  heading: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '1.5rem',
  },
  subheading: {
    fontSize: '1.25rem',
    fontWeight: '500',
    color: '#334155',
    marginBottom: '1rem',
  },
  text: {
    fontSize: '1rem',
    color: '#475569',
  },
  
  // Form elements
  formField: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: '0.5rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '0.375rem',
    border: '1px solid #e2e8f0',
    fontSize: '1rem',
    color: '#1e293b',
    backgroundColor: '#ffffff',
  },
  select: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '0.375rem',
    border: '1px solid #e2e8f0',
    fontSize: '1rem',
    color: '#1e293b',
    backgroundColor: '#ffffff',
  },
  
  // Buttons
  button: {
    base: {
      padding: '0.75rem 1.5rem',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      border: 'none',
      transition: 'background-color 0.2s',
    },
    primary: {
      backgroundColor: '#3b82f6',
      color: '#ffffff',
    },
    secondary: {
      backgroundColor: '#e2e8f0',
      color: '#1e293b',
    },
    danger: {
      backgroundColor: '#ef4444',
      color: '#ffffff',
    },
  },
  
  // Grid layouts
  grid: {
    display: 'grid',
    gap: '1.5rem',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  },
  
  // Flexbox layouts
  flex: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  
  // Error states
  error: {
    color: '#ef4444',
    fontSize: '0.875rem',
    marginTop: '0.5rem',
  },
  
  // Card styles
  card: {
    padding: '1.5rem',
    backgroundColor: '#ffffff',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  }
}; 