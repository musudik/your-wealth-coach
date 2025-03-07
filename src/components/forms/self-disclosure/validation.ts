import { FormData } from "@/types/form";
import { isValidEmail, isValidPhone, isValidDate, isValidYear } from "@/components/forms/self-disclosure/validation";

export const validatePersonalInfo = (data: FormData["personalInfo"], isSingleApplicant = false) => {
  const errors = {
    applicantA: {} as Record<string, boolean>,
    applicantB: {} as Record<string, boolean>,
  };

  const validateChild = (child: { name: string; birthDate: string; placeOfBirth: string }) => {
    return {
      name: !child.name.trim(),
      birthDate: !isValidDate(child.birthDate),
      placeOfBirth: !child.placeOfBirth.trim(),
    };
  };

  // Helper function to validate a single applicant
  const validateApplicant = (applicant: 'applicantA' | 'applicantB', data: any) => {
    Object.entries(data).forEach(([key, value]) => {
      if (key === "birthName") {
        // Birth name is optional
        errors[applicant][key] = false;
      } else if (key === "email") {
        errors[applicant][key] = !isValidEmail(value as string);
      } else if (key === "telephone") {
        errors[applicant][key] = !isValidPhone(value as string);
      } else if (key === "birthDate") {
        errors[applicant][key] = !isValidDate(value as string);
      } else if (key === "hasChildren") {
        // hasChildren is a boolean, no validation needed
        errors[applicant][key] = false;
      } else if (key === "children") {
        if (data.hasChildren) {
          errors[applicant][key] = (value as Array<{ name: string; birthDate: string; placeOfBirth: string;}>).some(
            child => {
              const childErrors = validateChild(child);
              return childErrors.name || childErrors.birthDate || childErrors.placeOfBirth;
            }
          );
        } else {
          errors[applicant][key] = false;
        }
      } else if (key === "occupationSince") {
        errors[applicant][key] = !isValidYear(value as string);
      } else if (key === "otherNationality" || key === "otherNationalityB") {
        // Only validate otherNationality if nationality is "other"
        const nationalityField = applicant === 'applicantA' ? 'nationality' : 'nationality';
        errors[applicant][key] = data[nationalityField] === "other" ? !value?.trim() : false;
      } else if (key === "otherOccupation" || key === "otherOccupationB") {
        // Only validate otherOccupation if occupation is "other"
        const occupationField = applicant === 'applicantA' ? 'occupation' : 'occupation';
        errors[applicant][key] = data[occupationField] === "other" ? !value?.trim() : false;
      } else if (key === "actualNationality" || key === "actualOccupation") {
        // These are derived fields, no validation needed
        errors[applicant][key] = false;
      } else if (typeof value === 'string') {
        // For all other string fields, check if they're not empty
        errors[applicant][key] = !value.trim();
      } else if (value === null || value === undefined) {
        // Handle null/undefined values
        errors[applicant][key] = true;
      } else {
        // For any other type of value, consider it valid
        errors[applicant][key] = false;
      }
    });
  };

  // Validate Applicant A (always required)
  //if (!data.applicantA.name) errors['applicantA.name'] = 'Name is required';
  validateApplicant('applicantA', data.applicantA);

  // Only validate Applicant B if not single applicant
  if (!isSingleApplicant) {
    //if (!data.applicantB.name) errors['applicantB.name'] = 'Name is required';
    validateApplicant('applicantB', data.applicantB);
  }

  console.log("data.applicantA: "+JSON.stringify(errors.applicantA));
  console.log("data.applicantB: "+JSON.stringify(errors.applicantB));

  const hasErrors = Object.values(errors.applicantA).some(error => error) || 
                   (!isSingleApplicant && Object.values(errors.applicantB).some(error => error));
  console.log("hasErrors: "+hasErrors);
  
  return hasErrors ? errors : null;
};

export const validateHouseholdBudget = (data: FormData["householdBudget"], isSingleApplicant = false) => {
  const errors = {
    applicantA: {} as Record<string, boolean>,
    applicantB: {} as Record<string, boolean>,
  };
  
  // Required fields for Applicant A
  const requiredFieldsA = [
    'monthlyNetIncome',
    'rent',
    'livingExpenses',
    'savingsPlans',
    'personalLoans',
    'propertyLoans',
    'otherExpenses',
  ];

  // Required fields for Applicant B
  const requiredFieldsB = [
    'monthlyNetIncomeB',
    'rentB',
    'livingExpensesB',
    'savingsPlansB',
    'personalLoansB',
    'propertyLoansB',
    'otherExpensesB',
  ];

  
  // Validate Applicant A
  Object.entries(data.applicantA).forEach(([key, value]) => {
    console.log("applicantA: " + key, value);
    if(!requiredFieldsA.includes(key)) {
      errors.applicantA[key] = false;
    } else {
      errors.applicantA[key] = !value?.trim();
    }
  });

  // Validate Applicant B
  if (!isSingleApplicant) {
    Object.entries(data.applicantB).forEach(([key, value]) => {
      console.log("applicantB: " + key, value);
      if(!requiredFieldsB.includes(key)) {
        errors.applicantB[key] = false;
      } else {
        errors.applicantB[key] = !value?.trim();
      }
    });
  }

  console.log("errors.applicantA: "+JSON.stringify(errors.applicantA));
  console.log("errors.applicantB: "+JSON.stringify(errors.applicantB));
  // Check if there are any errors
  const hasErrors = Object.values(errors.applicantA).some(error => error) || 
                   Object.values(errors.applicantB).some(error => error);
  console.log(hasErrors);
  return hasErrors ? errors : null;
};

export const validateAssets = (data: FormData["assets"], isSingleApplicant = false) => {
  const errors = {} as Record<string, boolean>;
  
  // Check if at least one value is filled in each array
  /* Object.entries(data).forEach(([key, value]) => {
    errors[key] = Array.isArray(value) && !value.some(item => item);
  }); */

  return errors;
};

export const validateSignature = (data: FormData["signature"], isSingleApplicant = false) => {
  const errors = {} as Record<string, boolean>;
  
  // Required fields
  const requiredFields = [
    'place',
    'date',
    'signatureA',
    'consentDataTransmission',
    'consentNoProceedings',
    'consentSchufa',
    'consentBankruptcy',
    'consentAffidavit',
    'consentTruthful'
  ];

  // Add signatureB to required fields only if not single applicant
  if (!isSingleApplicant) {
    requiredFields.push('signatureB');
  }

  Object.entries(data).forEach(([key, value]) => {
    if(!requiredFields.includes(key)) {
      errors[key] = false;
    } else {
      errors[key] = !value; 
    }
  });

  const hasErrors = Object.values(errors).some(error => error);
  console.log('Signature validation errors:', errors);
  console.log('Has errors:', hasErrors);

  return hasErrors ? errors : null;
};

const validateCurrentStep = () => {
  let errors = null;
  
  switch (currentStep) {
    case "personal":
      errors = validatePersonalInfo(formData.personalInfo);
      break;
    case "household":
      errors = validateHouseholdBudget(formData.householdBudget);
      break;
    /* case "assets":
      errors = validateAssets(formData.assets);
      break; */
    case "signature":
      errors = validateSignature(formData.signature);
      break;
    default:
      return true;
  }

  setValidationErrors(errors || {});
  
  // Return true if there are no errors (errors is null)
  return errors === null;
};

const handleNext = () => {
  if (!validateCurrentStep()) {
    toast({
      title: "Validation Error",
      description: "Please fill in all required fields",
      variant: "destructive",
    });
    return;
  }

  const steps = ["personal", "household", "assets", "review", "signature"];
  const currentIndex = steps.indexOf(currentStep);
  if (currentIndex < steps.length - 1) {
    setCurrentStep(steps[currentIndex + 1] as FormStep);
    setValidationErrors({}); // Clear validation errors when moving to next step
  }
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  // Accepts formats: +49123456789, 0123456789, +49 123 456 789, etc.
  const phoneRegex = /^(\+?\d{1,3}[\s-]?)?\d{3,}[\s-]?\d{3,}[\s-]?\d{3,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const isValidDate = (date: string): boolean => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
};

export const isValidYear = (year: string): boolean => {
  const currentYear = new Date().getFullYear();
  const yearNum = parseInt(year);
  return !isNaN(yearNum) && yearNum >= 1900 && yearNum <= currentYear;
};

// Update the validation function to handle the new children structure
const validateChildren = (children: Array<{ id: string; birthDate: string }>) => {
  if (!children.length) return false;
  return children.some(child => !isValidDate(child.birthDate));
};
