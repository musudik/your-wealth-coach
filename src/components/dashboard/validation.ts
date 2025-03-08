import { PersonDetails, ClientDetails } from "./types";

// Helper validation functions
export const isValidEmail = (email: string): boolean => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  if (!phone) return false;
  // Accepts formats: +49123456789, 0123456789, +49 123 456 789, etc.
  const phoneRegex = /^(\+?\d{1,3}[\s-]?)?\d{3,}[\s-]?\d{3,}[\s-]?\d{3,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const isValidDate = (date: string): boolean => {
  if (!date) return false;
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
};

export const isValidYear = (year: string): boolean => {
  if (!year) return false;
  const currentYear = new Date().getFullYear();
  const yearNum = parseInt(year);
  return !isNaN(yearNum) && yearNum >= 1900 && yearNum <= currentYear;
};

// Main validation function for client details
export const validateClientDetails = (clientDetails: any, hasSpouse: boolean): Record<string, boolean> => {
  const errors: Record<string, boolean> = {};
  
  // Required fields for main client
  const requiredFields = [
    'firstName',
    'lastName',
    'address',
    'telephone',
    'email',
    'dateOfBirth',
    'placeOfBirth',
    'nationality',
    'maritalStatus',
    'occupation'
  ];
  
  // Validate main client fields
  requiredFields.forEach(field => {
    if (field === 'email') {
      errors[field] = !isValidEmail(clientDetails[field]);
    } else if (field === 'telephone') {
      errors[field] = !isValidPhone(clientDetails[field]);
    } else if (field === 'dateOfBirth') {
      errors[field] = !isValidDate(clientDetails[field]);
    } else if (field === 'occupationSince') {
      errors[field] = clientDetails[field] ? !isValidDate(clientDetails[field]) : false;
    } else {
      errors[field] = !clientDetails[field];
    }
  });
  
  // Validate spouse fields if hasSpouse is true
  if (hasSpouse) {
    const spouseDetails = clientDetails.spouseDetails || {};
    
    // Same required fields for spouse
    requiredFields.forEach(field => {
      const spouseFieldKey = `spouse_${field}`;
      if (field === 'email') {
        errors[spouseFieldKey] = !isValidEmail(spouseDetails[field] || '');
      } else if (field === 'telephone') {
        errors[spouseFieldKey] = !isValidPhone(spouseDetails[field] || '');
      } else if (field === 'dateOfBirth') {
        errors[spouseFieldKey] = !isValidDate(spouseDetails[field] || '');
      } else if (field === 'occupationSince') {
        errors[spouseFieldKey] = spouseDetails[field] ? !isValidDate(spouseDetails[field]) : false;
      } else {
        errors[spouseFieldKey] = !spouseDetails[field];
      }
    });
  }
  
  return errors;
};

// Check if there are any validation errors
export const hasValidationErrors = (errors: Record<string, boolean>): boolean => {
  return Object.values(errors).some(error => error);
}; 