import { TaxFormData, Address } from './taxTypes';

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
  if (!date) return false;
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
};

export const isValidTaxId = (taxId: string): boolean => {
  // German tax ID is typically 11 digits
  const taxIdRegex = /^\d{11}$/;
  return taxIdRegex.test(taxId.replace(/\s/g, ''));
};

export const isValidPostalCode = (postalCode: string): boolean => {
  // German postal code is 5 digits
  const postalCodeRegex = /^\d{5}$/;
  return postalCodeRegex.test(postalCode.replace(/\s/g, ''));
};

export const validatePersonalInfo = (personalInfo: TaxFormData['personalInfo']) => {
  const errors: Record<string, boolean | Record<string, boolean>> = {};
  
  // Required fields
  errors.firstName = !personalInfo.firstName?.trim();
  errors.lastName = !personalInfo.lastName?.trim();
  errors.taxId = !isValidTaxId(personalInfo.taxId || '');
  errors.dateOfBirth = !isValidDate(personalInfo.dateOfBirth || '');
  errors.maritalStatus = !personalInfo.maritalStatus?.trim();
  
  // Address validation
  errors.address = {
    street: !personalInfo.address?.street?.trim(),
    houseNumber: !personalInfo.address?.houseNumber?.trim(),
    postalCode: !isValidPostalCode(personalInfo.address?.postalCode || ''),
    city: !personalInfo.address?.city?.trim()
  };
  
  // Foreign residence validation (if checked)
  if (personalInfo.hasForeignResidence) {
    errors.foreignResidenceCountry = !personalInfo.foreignResidenceCountry;
    
    // If "other" is selected, validate the other country field
    if (personalInfo.foreignResidenceCountry === 'other') {
      errors.otherForeignResidenceCountry = !personalInfo.otherForeignResidenceCountry?.trim();
    }
  }
  
  // Spouse validation (if checked)
  if (personalInfo.hasSpouse) {
    errors.spouseFirstName = !personalInfo.spouseFirstName?.trim();
    errors.spouseLastName = !personalInfo.spouseLastName?.trim();
    errors.spouseDateOfBirth = !isValidDate(personalInfo.spouseDateOfBirth || '');
    errors.spouseTaxId = !isValidTaxId(personalInfo.spouseTaxId || '');
    
    // If spouse has income, validate income type
    if (personalInfo.spouseHasIncome) {
      errors.spouseIncomeType = !personalInfo.spouseIncomeType?.trim();
    }
    
    // Joint taxation is a boolean, so no validation needed
  }
  
  console.log('Personal Info Validation Errors:', errors);
  return errors;
};

export const validateAddress = (address: Address): Record<string, boolean> | null => {
  const errors: Record<string, boolean> = {};
  
  // Required fields
  errors.street = !address?.street?.trim();
  errors.houseNumber = !address?.houseNumber?.trim();
  errors.postalCode = !isValidPostalCode(address?.postalCode || '');
  errors.city = !address?.city?.trim();
  
  // Check if there are any errors
  const hasErrors = Object.values(errors).some(error => error);
  
  return hasErrors ? errors : null;
};

export const validateIncomeInfo = (incomeInfo: TaxFormData['incomeInfo']) => {
  const errors: Record<string, boolean | Record<string, boolean>> = {};
  
  // Required fields for all users - these are the mandatory questions for each step
  errors.isEmployed = incomeInfo.isEmployed === undefined;
  errors.isBusinessOwner = incomeInfo.isBusinessOwner === undefined;
  errors.hasStockIncome = incomeInfo.hasStockIncome === undefined;
  errors.hasRentalProperty = incomeInfo.hasRentalProperty === undefined;
  errors.hasForeignIncome = incomeInfo.hasForeignIncome === undefined;
  
  // Employment validation
  if (incomeInfo.isEmployed) {
    errors.employer = !incomeInfo.employer?.trim();
    errors.employmentIncome = incomeInfo.employmentIncome === undefined || incomeInfo.employmentIncome < 0;
    errors.grossAnnualSalary = incomeInfo.grossAnnualSalary === undefined || incomeInfo.grossAnnualSalary < 0;
    errors.hasTaxCertificate = incomeInfo.hasTaxCertificate === undefined;
    
    if (incomeInfo.hasTaxCertificate) {
      errors.taxCertificateFile = !incomeInfo.taxCertificateFile?.trim();
    }
    
    errors.hasTravelSubsidy = incomeInfo.hasTravelSubsidy === undefined;
  }
  
  // Business validation
  if (incomeInfo.isBusinessOwner) {
    errors.businessType = !incomeInfo.businessType?.trim();
    errors.businessEarnings = incomeInfo.businessEarnings === undefined || incomeInfo.businessEarnings < 0;
    errors.businessExpenses = incomeInfo.businessExpenses === undefined || incomeInfo.businessExpenses < 0;
  }
  
  // Stock income validation
  if (incomeInfo.hasStockIncome) {
    errors.dividendEarnings = incomeInfo.dividendEarnings === undefined || incomeInfo.dividendEarnings < 0;
    errors.hasBankCertificate = incomeInfo.hasBankCertificate === undefined;
    errors.hasStockSales = incomeInfo.hasStockSales === undefined;
    
    if (incomeInfo.hasBankCertificate) {
      errors.bankCertificateFile = !incomeInfo.bankCertificateFile?.trim();
    }
    
    if (incomeInfo.hasStockSales) {
      errors.stockProfitLoss = incomeInfo.stockProfitLoss === undefined;
    }
    
    errors.hasForeignStocks = incomeInfo.hasForeignStocks === undefined;
    
    if (incomeInfo.hasForeignStocks) {
      errors.foreignTaxPaid = incomeInfo.foreignTaxPaid === undefined || incomeInfo.foreignTaxPaid < 0;
      errors.foreignTaxCertificateFile = !incomeInfo.foreignTaxCertificateFile?.trim();
    }
  }
  
  // Rental property validation
  if (incomeInfo.hasRentalProperty) {
    errors.rentalIncome = incomeInfo.rentalIncome === undefined || incomeInfo.rentalIncome < 0;
    errors.rentalCosts = incomeInfo.rentalCosts === undefined || incomeInfo.rentalCosts < 0;
    
    // Rental property address validation
    errors.rentalPropertyAddress = {
      street: !incomeInfo.rentalPropertyAddress?.street?.trim(),
      houseNumber: !incomeInfo.rentalPropertyAddress?.houseNumber?.trim(),
      postalCode: !isValidPostalCode(incomeInfo.rentalPropertyAddress?.postalCode || ''),
      city: !incomeInfo.rentalPropertyAddress?.city?.trim()
    };
  }
  
  // Foreign income validation
  if (incomeInfo.hasForeignIncome) {
    errors.foreignIncomeCountry = !incomeInfo.foreignIncomeCountry?.trim();
    errors.foreignIncomeType = !incomeInfo.foreignIncomeType?.trim();
    errors.foreignIncomeAmount = incomeInfo.foreignIncomeAmount === undefined || incomeInfo.foreignIncomeAmount < 0;
    errors.foreignIncomeTaxPaid = incomeInfo.foreignIncomeTaxPaid === undefined || incomeInfo.foreignIncomeTaxPaid < 0;
    errors.foreignIncomeTaxCertificateFile = !incomeInfo.foreignIncomeTaxCertificateFile?.trim();
  }
  
  return errors;
};

export const validateDeductions = (deductions: TaxFormData['deductions']) => {
  const errors: Record<string, boolean | Record<string, boolean>> = {};
  
  // Add new fields to numeric validation
  const numericFields = [
    'commutingExpenses',
    'businessTripsCosts',
    'workEquipment',
    'homeOfficeAllowance',
    'membershipFees',
    'applicationCosts',
    'doubleHouseholdCosts',
    'churchTax',
    'donationsAndFees',
    'childcareCosts',
    'supportPayments',
    'privateSchoolFees',
    'retirementProvisions',
    'otherInsuranceExpenses',
    'professionalTrainingCosts',
    'medicalExpenses',
    'rehabilitationCosts',
    'careCosts',
    'disabilityExpenses',
    'funeralCosts',
    'relativesSupportCosts',
    'divorceCosts',
    'statutoryHealthInsurance',
    'privateHealthInsurance',
    'statutoryPensionInsurance',
    'privatePensionInsurance',
    'unemploymentInsurance',
    'accidentLiabilityInsurance',
    'disabilityInsurance',
    'termLifeInsurance',
    'householdServices',
    'craftsmenServices',
    'gardeningServices',
    'cleaningServices',
    'caretakerServices',
    'householdCareCosts',
    'householdSupportServices',
    'chimneySweepFees',
    'emergencySystemCosts'
  ];

  numericFields.forEach(field => {
    errors[field] = deductions[field] < 0;
  });

  // Craftsmen services validation
  errors.hasCraftsmenPayments = deductions.hasCraftsmenPayments === undefined;
  
  if (deductions.hasCraftsmenPayments) {
    errors.craftsmenAmount = deductions.craftsmenAmount === undefined || deductions.craftsmenAmount < 0;
    errors.craftsmenInvoiceFile = !deductions.craftsmenInvoiceFile?.trim();
  }
  
  // Maintenance payments validation
  errors.hasMaintenancePayments = deductions.hasMaintenancePayments === undefined;
  
  if (deductions.hasMaintenancePayments) {
    errors.maintenanceRecipient = !deductions.maintenanceRecipient?.trim();
    errors.maintenanceAmount = deductions.maintenanceAmount === undefined || deductions.maintenanceAmount < 0;
    errors.recipientsAbroad = deductions.recipientsAbroad === undefined;
  }
  
  // Special expenses detailed validation
  errors.hasSpecialExpensesDetailed = deductions.hasSpecialExpensesDetailed === undefined;
  
  if (deductions.hasSpecialExpensesDetailed) {
    errors.specialExpensesType = !deductions.specialExpensesType?.trim();
    errors.specialExpensesAmount = deductions.specialExpensesAmount === undefined || deductions.specialExpensesAmount < 0;
  }
  
  // Private insurance validation
  errors.hasPrivateInsurance = deductions.hasPrivateInsurance === undefined;
  
  if (deductions.hasPrivateInsurance) {
    errors.insuranceTypes = !deductions.insuranceTypes?.trim();
    errors.insuranceContributions = deductions.insuranceContributions === undefined || deductions.insuranceContributions < 0;
  }
  
  // Required documents validation
  /* const requiredDocuments = [
    'rentalContracts',
    'annualStatements',
    'operatingCosts',
    'propertyTax',
    'insurancePremiums',
    'rentalIncome',
    'depreciationProof'
  ];

  requiredDocuments.forEach(doc => {
    const documentField = `documents_${doc}`;
    errors[documentField] = !deductions[documentField] || 
                          (Array.isArray(deductions[documentField]) && deductions[documentField].length === 0);
  });
 */
  return errors;
};

export const validateTaxCredits = (taxCredits: TaxFormData['taxCredits']) => {
  const errors: Record<string, boolean> = {};
  
  // All tax credit fields should be numbers >= 0
  errors.childrenAllowance = isNaN(taxCredits.childrenAllowance) || taxCredits.childrenAllowance < 0;
  errors.homeOfficeDeduction = isNaN(taxCredits.homeOfficeDeduction) || taxCredits.homeOfficeDeduction < 0;
  errors.donationsCharity = isNaN(taxCredits.donationsCharity) || taxCredits.donationsCharity < 0;
  
  return errors;
};

export const validateChildren = (children: TaxFormData['children'] = []) => {
  const errors: Record<number, Record<string, boolean>> = {};
  
  children.forEach((child, index) => {
    errors[index] = {
      firstName: !child.firstName?.trim(),
      lastName: !child.lastName?.trim(),
      dateOfBirth: !isValidDate(child.dateOfBirth || ''),
      taxId: !isValidTaxId(child.taxId || '')
    };
  });
  
  return errors;
};

export const validateTaxForm = (formData: TaxFormData): Record<string, any> | null => {
  const errors: Record<string, any> = {};
  
  // Validate personal info
  const personalInfoErrors = validatePersonalInfo(formData.personalInfo);
  if (Object.values(personalInfoErrors).some(error => 
      typeof error === 'boolean' ? error : Object.values(error).some(e => e))) {
    errors.personalInfo = personalInfoErrors;
  }
  
  // Validate address
  const addressErrors = validateAddress(formData.personalInfo.address);
  if (addressErrors) {
    errors.address = addressErrors;
  }
  
  // Validate children if applicable
  if (formData.personalInfo.hasChildren) {
    const childrenErrors = validateChildren(formData.children);
    if (Object.keys(childrenErrors).length > 0 && 
        Object.values(childrenErrors).some(childError => 
          Object.values(childError).some(e => e))) {
      errors.children = childrenErrors;
    }
  }
  
  // Validate deductions
  const deductionsErrors = validateDeductions(formData.deductions);
  if (Object.values(deductionsErrors).some(error => 
      typeof error === 'boolean' ? error : Object.values(error).some(e => e))) {
    errors.deductions = deductionsErrors;
  }
  
  // Validate income info
  const incomeInfoErrors = validateIncomeInfo(formData.incomeInfo);
  if (Object.values(incomeInfoErrors).some(error => 
      typeof error === 'boolean' ? error : Object.values(error).some(e => e))) {
    errors.incomeInfo = incomeInfoErrors;
  }
  
  // Validate tax credits
  const taxCreditsErrors = validateTaxCredits(formData.taxCredits);
  if (Object.values(taxCreditsErrors).some(error => error)) {
    errors.taxCredits = taxCreditsErrors;
  }
  
  // Validate signature when on the signature step
  if (formData.signature) {
    const signatureErrors: Record<string, boolean> = {};
    
    if (!formData.signature.place) {
      signatureErrors.place = true;
    }
    if (!formData.signature.date) {
      signatureErrors.date = true;
    }
    if (!formData.signature.time) {
      signatureErrors.time = true;
    }
    if (!formData.signature.signature) {
      signatureErrors.signature = true;
    }

    if (Object.keys(signatureErrors).length > 0) {
      errors.signature = signatureErrors;
    }
  }
  
  console.log('errors:', errors);
  // Check if there are any errors
  const hasErrors = Object.keys(errors).length > 0;
  
  console.log('Form Validation Errors:', {
    hasErrors,
    errors
  });
  
  return hasErrors ? errors : null;
}; 