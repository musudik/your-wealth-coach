import { Button } from '@/components/ui/button';
import { FormTemplate } from '@/components/ui/form-template';
import React, { useState, useEffect } from 'react';
import { saveTaxReturnForm } from '../../../db-services/lib/taxReturnService';
import { exportTaxReturnToPdf } from './utils/pdfExport';
import BusinessStep from './steps/BusinessStep';
import EmploymentStep from './steps/EmploymentStep';
import ExpensesStep from './steps/ExpensesStep';
import ForeignIncomeStep from './steps/ForeignIncomeStep';
import InvestmentsStep from './steps/InvestmentsStep';
import PersonalInfoStep from './steps/PersonalInfoStep';
import RentalStep from './steps/RentalStep';
import ReviewStep from './steps/ReviewStep';
import SignatureStep from './steps/SignatureStep';
import { TaxFormData, initialTaxFormData } from './taxTypes';
import { validateTaxForm } from './validation';
import { useLocation } from 'react-router-dom';

// Define language data directly in the component to avoid import issues
const languageData = {
  de: {
    title: "Steuererklärung",
    buttons: {
      previous: "Zurück",
      next: "Weiter",
      submit: "Einreichen",
      submitting: "Wird eingereicht...",
      exportPdf: "Als PDF exportieren"
    },
    validation: {
      pleaseFixErrors: "Bitte korrigieren Sie die Fehler, bevor Sie fortfahren"
    }
  },
  en: {
    title: "Tax Return",
    buttons: {
      previous: "Previous",
      next: "Next",
      submit: "Submit",
      submitting: "Submitting...",
      exportPdf: "Export as PDF"
    },
    validation: {
      pleaseFixErrors: "Please fix the errors before proceeding"
    }
  }
};

const TaxReturnForm: React.FC = () => {
  const location = useLocation();
  const [partnerId, setPartnerId] = useState<string | undefined>(undefined);
  const [clientId, setClientId] = useState<string | undefined>(undefined);
  const [formData, setFormData] = useState<TaxFormData>(initialTaxFormData);
  const [currentStep, setCurrentStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState<Record<string, any> | null>(null);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Define steps
  const steps = [
    { title: 'Personal Information', component: PersonalInfoStep },
    { title: 'Expenses & Deductions', component: ExpensesStep },
    { title: 'Employment Income', component: EmploymentStep },
    { title: 'Business Income', component: BusinessStep },
    { title: 'Investments', component: InvestmentsStep },
    { title: 'Rental Income', component: RentalStep },
    { title: 'Foreign Income', component: ForeignIncomeStep },
    { title: 'Review', component: ReviewStep },
    { title: 'Sign & Submit', component: SignatureStep }
  ];

  // Extract partnerId and clientId from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const partnerParam = params.get('partner');
    const clientParam = params.get('client');

    console.log('URL Parameters:', { partnerParam, clientParam });

    if (!partnerParam) {
      console.error('Partner ID is missing from URL');
      alert('Cannot load form: Partner ID is missing');
      return;
    }

    if (!clientParam) {
      console.error('Client ID is missing from URL');
      alert('Cannot load form: Client ID is missing');
      return;
    }

    setPartnerId(partnerParam);
    setClientId(clientParam);
  }, [location.search]);

  // Handle form field changes
  const handleChange = (section: keyof TaxFormData, field: string, value: any) => {
    setFormData(prevData => {
      const newData = { ...prevData };
      
      // Handle nested fields with dot notation (e.g., 'address.street')
      if (field.includes('.')) {
        const [parentField, childField] = field.split('.');
        newData[section] = {
          ...newData[section],
          [parentField]: {
            ...newData[section][parentField],
            [childField]: value
          }
        };
      } else {
        newData[section] = {
          ...newData[section],
          [field]: value
        };
      }
      
      return newData;
    });
  };

  // Handle next button click
  const handleNext = () => {
    // Always validate the entire form before proceeding
    const errors = validateTaxForm(formData);
    setValidationErrors(errors);
    setShowValidationErrors(true);
    
    // Special handling for children validation when hasChildren is checked
    if (currentStep === 0 && formData.personalInfo.hasChildren) {
      // Check if children array exists and has valid entries
      const hasValidChildren = Array.isArray(formData.children) && 
                              formData.children.length > 0 &&
                              formData.children.every(child => 
                                child.firstName && 
                                child.lastName && 
                                child.dateOfBirth && 
                                child.taxId);
      
      if (!hasValidChildren) {
        // Add children validation errors
        setValidationErrors(prev => ({
          ...prev,
          children: formData.children?.map(child => ({
            firstName: !child.firstName,
            lastName: !child.lastName,
            dateOfBirth: !child.dateOfBirth,
            taxId: !child.taxId
          })) || [{ firstName: true, lastName: true, dateOfBirth: true, taxId: true }]
        }));
        return; // Don't proceed if children validation fails
      }
    }
    
    // Check if current step has validation errors
    const hasErrors = hasErrorsInCurrentStep(errors);
    console.log(`Step ${currentStep} validation result:`, { hasErrors });
    
    // If there are errors, don't proceed
    if (hasErrors) {
      console.log(`Cannot proceed from step ${currentStep} due to validation errors`);
      return;
    }
    
    // If valid, proceed to next step
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setShowValidationErrors(false); // Reset validation errors display for next step
    }
  };

  // Helper function to check if current step has errors
  const hasErrorsInCurrentStep = (errors: Record<string, any> | null): boolean => {
    if (!errors) return false;
    
    switch (currentStep) {
      case 0: // Personal Info
        const personalInfoHasErrors = hasErrorsInSection(errors, 'personalInfo');
        const addressHasErrors = hasErrorsInSection(errors, 'address');
        const childrenHasErrors = formData.personalInfo.hasChildren && hasErrorsInSection(errors, 'children');
        
        console.log('Personal Info validation:', { personalInfoHasErrors, addressHasErrors, childrenHasErrors });
        return !!(personalInfoHasErrors || addressHasErrors || childrenHasErrors);
        
      case 1: // Expenses
        const deductionsHasErrors = hasErrorsInSection(errors, 'deductions');
        console.log('Deductions validation:', { deductionsHasErrors });
        return !!deductionsHasErrors;
        
      case 2: // Employment
        // Check if the mandatory question is answered
        if (formData.incomeInfo.isEmployed === undefined) {
          console.log('Employment validation: isEmployed is undefined');
          return true;
        }
        
        // If employed, check other required fields
        if (formData.incomeInfo.isEmployed) {
          const employmentFields = [
            'employer', 'employmentIncome', 'grossAnnualSalary', 'hasTaxCertificate', 'hasTravelSubsidy'
          ];
          // Add taxCertificateFile if hasTaxCertificate is true
          if (formData.incomeInfo.hasTaxCertificate) {
            employmentFields.push('taxCertificateFile');
          }
          
          const employmentHasErrors = hasErrorsInSection(errors, 'incomeInfo', employmentFields);
          console.log('Employment validation:', { employmentHasErrors });
          return !!employmentHasErrors;
        }
        
        return false;
        
      case 3: // Business
        // Check if the mandatory question is answered
        if (formData.incomeInfo.isBusinessOwner === undefined) {
          console.log('Business validation: isBusinessOwner is undefined');
          return true;
        }
        
        // If business owner, check other required fields
        if (formData.incomeInfo.isBusinessOwner) {
          const businessFields = [
            'businessType', 'businessEarnings', 'businessExpenses'
          ];
          const businessHasErrors = hasErrorsInSection(errors, 'incomeInfo', businessFields);
          console.log('Business validation:', { businessHasErrors });
          return !!businessHasErrors;
        }
        
        return false;
        
      case 4: // Investments
        // Check if the mandatory question is answered
        if (formData.incomeInfo.hasStockIncome === undefined) {
          console.log('Investments validation: hasStockIncome is undefined');
          return true;
        }
        
        // If has stock income, check other required fields
        if (formData.incomeInfo.hasStockIncome) {
          const investmentFields = [
            'dividendEarnings', 'hasBankCertificate', 'hasStockSales'
          ];
          
          // Add bankCertificateFile if hasBankCertificate is true
          if (formData.incomeInfo.hasBankCertificate) {
            investmentFields.push('bankCertificateFile');
          }
          
          // Add stockProfitLoss if hasStockSales is true
          if (formData.incomeInfo.hasStockSales) {
            investmentFields.push('stockProfitLoss');
          }
          
          // Add foreign stock fields if hasForeignStocks is true
          if (formData.incomeInfo.hasForeignStocks) {
            investmentFields.push('foreignTaxPaid', 'foreignTaxCertificateFile');
          }
          
          const investmentsHasErrors = hasErrorsInSection(errors, 'incomeInfo', investmentFields);
          console.log('Investments validation:', { investmentsHasErrors });
          return !!investmentsHasErrors;
        }
        
        return false;
        
      case 5: // Rental
        // Check if the mandatory question is answered
        if (formData.incomeInfo.hasRentalProperty === undefined) {
          console.log('Rental validation: hasRentalProperty is undefined');
          return true;
        }
        
        // If has rental property, check other required fields
        if (formData.incomeInfo.hasRentalProperty) {
          const rentalFields = [
            'rentalIncome', 'rentalCosts'
          ];
          
          // Check if rentalPropertyAddress has errors
          const rentalAddressHasErrors = errors.incomeInfo && 
                                        errors.incomeInfo.rentalPropertyAddress && 
                                        Object.values(errors.incomeInfo.rentalPropertyAddress).some(error => !!error);
          
          const rentalFieldsHaveErrors = hasErrorsInSection(errors, 'incomeInfo', rentalFields);
          
          console.log('Rental validation:', { rentalFieldsHaveErrors, rentalAddressHasErrors });
          return !!(rentalFieldsHaveErrors || rentalAddressHasErrors);
        }
        
        return false;
        
      case 6: // Foreign Income
        // Check if the mandatory question is answered
        if (formData.incomeInfo.hasForeignIncome === undefined) {
          console.log('Foreign Income validation: hasForeignIncome is undefined');
          return true;
        }
        
        // If has foreign income, check other required fields
        if (formData.incomeInfo.hasForeignIncome) {
          const foreignFields = [
            'foreignIncomeCountry', 'foreignIncomeType', 'foreignIncomeAmount', 
            'foreignIncomeTaxPaid', 'foreignIncomeTaxCertificateFile'
          ];
          const foreignHasErrors = hasErrorsInSection(errors, 'incomeInfo', foreignFields);
          console.log('Foreign Income validation:', { foreignHasErrors });
          return !!foreignHasErrors;
        }
        
        return false;
        
      case 7: // Review
        return false; // No validation needed for review step
        
      case 8: // Signature
        return false; // No validation needed for signature step
        
      default:
        return false;
    }
  };

  // Modified helper function to check if a section has errors
  const hasErrorsInSection = (errors: Record<string, any> | null, section: string, fields?: string[]): boolean => {
    if (!errors || !errors[section]) return false;
    
    const sectionErrors = errors[section];
    
    // If specific fields are provided, check only those fields
    if (fields) {
      return fields.some(field => {
        // Handle nested fields (e.g., 'rentalPropertyAddress.street')
        if (field.includes('.')) {
          const [parentField, childField] = field.split('.');
          return sectionErrors[parentField] && sectionErrors[parentField][childField];
        }
        return !!sectionErrors[field];
      });
    }
    
    // Otherwise check all fields in the section
    if (typeof sectionErrors === 'object') {
      return Object.keys(sectionErrors).some(key => {
        const error = sectionErrors[key];
        if (typeof error === 'object' && error !== null) {
          // For nested objects, check if any of their values are true
          return Object.values(error).some(nestedError => !!nestedError);
        }
        return !!error;
      });
    }
    
    return !!sectionErrors;
  };

  // Handle previous button click
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowValidationErrors(false); // Reset validation errors display for previous step
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    const errors = validateTaxForm(formData);
    setValidationErrors(errors);
    
    if (errors) {
      setShowValidationErrors(true);
      return;
    }

    if (!partnerId) {
      console.error('Partner ID is required');
      alert('Cannot submit form: Partner ID is missing');
      return;
    }

    if (!clientId) {
      console.error('Client ID is required');
      alert('Cannot submit form: Client ID is missing');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Pass both partnerId and clientId to the form data
      const formDataWithIds = {
        ...formData,
        partnerId,
        clientId
      };

      const formId = await saveTaxReturnForm(formDataWithIds, partnerId);
      
      setFormData(prev => ({
        ...prev,
        id: formId,
        status: 'submitted',
        updatedAt: new Date().toISOString()
      }));
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to get input class based on validation errors
  const hasError = (section: string, field: string, index?: number): boolean => {
    if (!showValidationErrors || !validationErrors) return false;
    
    // Special handling for children array fields
    if (section === 'children' && typeof index === 'number') {
      return !!(
        validationErrors.children && 
        validationErrors.children[index] && 
        validationErrors.children[index][field]
      );
    }
    
    if (field.includes('.')) {
      const [parentField, childField] = field.split('.');
      return !!(
        validationErrors[section] && 
        validationErrors[section][parentField] && 
        validationErrors[section][parentField][childField]
      );
    }
    
    return !!(
      validationErrors[section] && 
      validationErrors[section][field]
    );
  };

  // Handle PDF export
  const handleExportPdf = () => {
    exportTaxReturnToPdf(formData);
  };

  // Render current step
  const renderStep = () => {
    const CurrentStep = steps[currentStep].component;
    
    // Custom actions for the signature step
    const signatureStepActions = currentStep === steps.length - 1 ? (
      <div className="flex justify-between items-center mt-6 w-full">
        <Button
          onClick={handlePrevious}
          className="py-2 bg-gray-200 hover:bg-gray-300 text-gray-800"
          type="button"
        >
          {languageData.de.buttons.previous} / {languageData.en.buttons.previous}
        </Button>
        <div className="flex space-x-4">
          <Button
            onClick={handleExportPdf}
            className="py-2 bg-green-600 hover:bg-green-700"
            type="button"
          >
            {languageData.de.buttons.exportPdf} / {languageData.en.buttons.exportPdf}
          </Button>
          <Button
            onClick={handleSubmit}
            className="py-2 bg-blue-600 hover:bg-blue-700"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 
              `${languageData.de.buttons.submitting} / ${languageData.en.buttons.submitting}` : 
              `${languageData.de.buttons.submit} / ${languageData.en.buttons.submit}`
            }
          </Button>
        </div>
      </div>
    ) : null;
    
    if (CurrentStep === PersonalInfoStep) {
      return (
        <>
          <PersonalInfoStep
            formData={formData}
            handleChange={handleChange}
            validationErrors={validationErrors}
            hasError={hasError}
            setFormData={setFormData}
            onFormDataChange={(updatedData) => setFormData(updatedData)}
            showValidationErrors={showValidationErrors}
            handleAddressChange={(address) => {
              handleChange('personalInfo', 'address', address);
            }}
            getInputClass={() => "w-full p-2 border rounded-md"}
          />
          {signatureStepActions}
        </>
      );
    }
    
    return (
      <>
        <CurrentStep
          formData={formData}
          handleChange={handleChange}
          validationErrors={validationErrors}
          hasError={hasError}
          setFormData={setFormData}
          onFormDataChange={(updatedData) => setFormData(updatedData)}
          showValidationErrors={showValidationErrors}
          handleAddressChange={(address) => {
            handleChange('personalInfo', 'address', address);
          }}
        />
        {signatureStepActions}
      </>
    );
  };

  // Add loading state while parameters are being extracted
  if (!partnerId || !clientId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-xl font-semibold mb-2">Loading...</div>
          <div className="text-gray-600">Please wait while we load your form</div>
        </div>
      </div>
    );
  }

  return (
    <FormTemplate
      title={`${languageData.de.title} / ${languageData.en.title}`}
      currentStep={currentStep}
      totalSteps={steps.length}
      steps={steps} 
      isSubmitting={isSubmitting}
      isSubmitted={isSubmitted}
      showProgress={true}
      onPrevious={handlePrevious}
      onNext={handleNext}
      onSubmit={handleSubmit}
      renderSuccessMessage={() => (
        <div className="text-center">
          <div className="mt-5 flex justify-center space-x-4">
            <Button
              onClick={handleExportPdf}
              className="py-2 bg-green-600 hover:bg-green-700"
            >
              {languageData.de.buttons.exportPdf} / {languageData.en.buttons.exportPdf}
            </Button>
            <Button
              onClick={() => window.location.href = '/'}
              className="py-2 bg-blue-600 hover:bg-blue-700"
            >
              Return to Home
            </Button>
          </div>
        </div>
      )}
      hideDefaultActions={currentStep === steps.length - 1}
    >
      {renderStep()}
    </FormTemplate>
  );
};

export { TaxReturnForm };
  