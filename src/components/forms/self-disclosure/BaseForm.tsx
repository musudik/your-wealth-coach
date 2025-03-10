import { AssetsForm } from "@/components/forms/self-disclosure/AssetsForm";
import { HouseholdBudgetForm } from "@/components/forms/self-disclosure/HouseholdBudgetForm";
import { PersonalInfoForm } from "@/components/forms/self-disclosure/PersonalInfoForm";
import { ReviewForm } from "@/components/forms/self-disclosure/ReviewForm";
import { SignatureForm } from "@/components/forms/self-disclosure/SignatureForm";
import {
  validateAssets,
  validateHouseholdBudget,
  validatePersonalInfo,
  validateSignature
} from "@/components/forms/self-disclosure/validation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormTemplate } from "@/components/ui/form-template";
import { toast } from "@/hooks/use-toast";
import '@/styles/forms.css';
import { FormData, FormStep } from "@/types/form";
import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { firebaseService } from "../../../db-services/lib/firebase-service";
import { pdfGenerator } from "../../../db-services/lib/pdf-generator";
// ... other imports

export function SelfDisclosureForm() {
  // ... existing state and handlers ...
  const [, params] = useRoute<{ type: string }>('/form/:type');
  const [location] = useLocation();
  
  // Fix URL parameter extraction
  const searchParams = new URLSearchParams(window.location.search);
  const formId = searchParams.get('form') !== null ? searchParams.get('form') : searchParams.get('formId');
  const clientId = searchParams.get('client');
  const partnerId = searchParams.get('partner');

  console.log('URL Parameters:', {
    location: window.location.href,
    formId,
    clientId,
    partnerId
  });

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    personalInfo: {
      applicantA: {
        name: "",
        birthName: "",
        address: "",
        telephone: "",
        email: "",
        birthDate: "",
        placeOfBirth: "",
        nationality: "",
        maritalStatus: "",
        children: [],
        occupation: "",
        occupationSince: "",
        bankDetails: "",
        hasChildren: false,
      },
      applicantB: {
        name: "",
        birthName: "",
        address: "",
        telephone: "",
        email: "",
        birthDate: "",
        placeOfBirth: "",
        nationality: "",
        maritalStatus: "",
        children: [],
        occupation: "",
        occupationSince: "",
        bankDetails: "",
        hasChildren: false,
      },
    },
    householdBudget: {
      // Applicant A
      applicantA: { 
        monthlyNetIncome: "",
        otherIncome: "0",
        familyIncome: "0",
        totalIncome: "",
        rent: "0",
        livingExpenses: "0",
        savingsPlans: "0",
        personalLoans: "0",
        propertyLoans: "0",
        otherExpenses: "0",
        totalExpenses: "",
        totalAvailableCapital: "",
        additionalMonthlyIncome: "0",
      },
      // Applicant B
      applicantB: {
        monthlyNetIncomeB: "",
        otherIncomeB: "0",
        familyIncomeB: "0",
        totalIncomeB: "",
        rentB: "0",
        livingExpensesB: "0",
        savingsPlansB: "0",
        personalLoansB: "0",
        propertyLoansB: "0",
        otherExpensesB: "0",
        totalExpensesB: "",
        totalAvailableCapitalB: "",
        additionalMonthlyIncomeB: "0",
      }
    },
    assets: {
      bankAccountsA: ["", "", ""],
      buildingSocietyA: ["", "", ""],
      lifeInsuranceA: ["", "", ""],
      propertyA: ["", "", ""],
      otherAssetsA: ["", "", ""],
      liabilitiesA: ["", "", ""],
      bankAccountsB: ["", "", ""],
      buildingSocietyB: ["", "", ""],
      lifeInsuranceB: ["", "", ""],
      propertyB: ["", "", ""],
      otherAssetsB: ["", "", ""],
      liabilitiesB: ["", "", ""],
    },
    signature: {
      place: "",
      date: "",
      consentDataTransmission: false,
      consentNoProceedings: false,
      signatureA: null,
      signatureB: null,
      consentSchufa: false,
      consentBankruptcy: false,
      consentAffidavit: false,
      consentTruthful: false,
      referredBy: "",
    },
  });
  const steps = ["personal", "household", "assets", "review", "signature"];
  const [currentStep, setCurrentStep] = useState<FormStep>("personal");
  const [files, setFiles] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, any>>({});
  const [isSingleApplicant, setIsSingleApplicant] = useState(false);
  
  const calculateProgress = () => {
    const currentIndex = steps.indexOf(currentStep);
    //return `${(currentIndex + 1)}`+"/"+`${steps.length}`;
    return ((currentIndex + 1) / steps.length) * 100;
  };

  const handleSingleApplicantChange = (checked: boolean) => {
    setIsSingleApplicant(checked);
    if (checked) {
      // Clear all Applicant B data when switching to single applicant
      setFormData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          applicantB: {
            name: "",
            birthName: "",
            address: "",
            telephone: "",
            email: "",
            birthDate: "",
            placeOfBirth: "",
            nationality: "",
            maritalStatus: "",
            children: [],
            occupation: "",
            occupationSince: "",
            bankDetails: "",
            hasChildren: false,
          }
        },
        householdBudget: {
          ...prev.householdBudget,
          applicantB: {
            monthlyNetIncomeB: "",
            otherIncomeB: "0",
            familyIncomeB: "0",
            totalIncomeB: "",
            rentB: "0",
            livingExpensesB: "0",
            savingsPlansB: "0",
            personalLoansB: "0",
            propertyLoansB: "0",
            otherExpensesB: "0",
            totalExpensesB: "",
            totalAvailableCapitalB: "",
            additionalMonthlyIncomeB: "0",
          }
        },
        assets: {
          ...prev.assets,
          bankAccountsB: ["", "", ""],
          buildingSocietyB: ["", "", ""],
          lifeInsuranceB: ["", "", ""],
          propertyB: ["", "", ""],
          otherAssetsB: ["", "", ""],
          liabilitiesB: ["", "", ""],
        },
        signature: {
          ...prev.signature,
          signatureB: null,
        }
      }));
    }
  };

  const validateCurrentStep = () => {
    let errors = {};
    
    switch (currentStep) {
      case "personal":
        errors = validatePersonalInfo(formData.personalInfo, isSingleApplicant) || {};
        break;
      case "household":
        errors = validateHouseholdBudget(formData.householdBudget, isSingleApplicant) || {};
        break;
      case "assets":
        errors = validateAssets(formData.assets, isSingleApplicant) || {};
        break;
      case "signature":
        errors = validateSignature(formData.signature, isSingleApplicant) || {};
        break;
      default:
        return true;
    }

    setValidationErrors(errors);
    
    // Check if there are any validation errors by checking if the errors object is empty
    return Object.keys(errors).length === 0;
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

  const handleBack = () => {
    console.log("formId: "+formId);
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleFileUpload = (url: string) => {
    setFiles((prev) => [...prev, url]);
  };

  const handleSignatureA = (signatureData: string) => {
    setFormData({
      ...formData,
      signature: {
        ...formData.signature,
        signatureA: signatureData,
      },
    });
  };

  const handleSignatureB = (signatureData: string) => {
    setFormData({
      ...formData,
      signature: {
        ...formData.signature,
        signatureB: signatureData,
      },
    });
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitted(true);

      /* if (!clientId || !partnerId) {
        throw new Error('Client ID and Partner ID are required');
      } */

      const formToSubmit = {
        type: params?.type,
        data: {
          personalInfo: formData.personalInfo,
          householdBudget: formData.householdBudget,
          assets: formData.assets,
          signature: {
            place: formData.signature.place,
            date: formData.signature.date,
            consentDataTransmission: formData.signature.consentDataTransmission,
            consentNoProceedings: formData.signature.consentNoProceedings,
            signatureA: formData.signature.signatureA,
            signatureB: formData.signature.signatureB,
            referredBy: formData.signature.referredBy || '',
          },
        },
        files,
        progress: calculateProgress(),
        createdAt: formId ? undefined : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Check if we're in edit mode
      const searchParams = new URLSearchParams(window.location.search);
      const isEditMode = searchParams.get('edit') === 'true';
      const currentFormId = searchParams.get('formId');

      console.log('Submitting form with:', {
        formId,
        clientId,
        partnerId,
        formData: formToSubmit
      });

      if (isEditMode && currentFormId) {
        console.log("Updating form:", currentFormId);
        // Update existing form
        await firebaseService.updateForm(currentFormId, formToSubmit, clientId, partnerId);
        toast({
          title: 'Form updated successfully',
          description: 'Your changes have been saved.',
        });
      } else {
        console.log("Creating new form");
        console.log('Submitting form with:', {
          formId,
          clientId,
          partnerId,
          formData: formToSubmit
        });
        // Create new form only if not in edit mode
        formToSubmit.createdAt = new Date().toISOString(); // Add createdAt only for new forms
        await firebaseService.createForm(formToSubmit, formId, clientId, partnerId);
        toast({
          title: 'Form submitted successfully',
          description: 'Your form has been saved.',
        });
      }

      // Generate PDF if needed
      if (currentStep === "signature") {
        generatePDF();
      }

      // Clear the localStorage data after successful submission
      if (isEditMode && currentFormId) {
        localStorage.removeItem(`editFormData_${currentFormId}`);
      }

      // Optionally, redirect back to the client page or close the window
      if (isEditMode) {
        window.close(); // Close the edit window
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Error submitting form',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const generatePDF = async () => {
    try {
      /* if (!formId) {
        throw new Error('Form ID is required to generate PDF');
      } */
      await pdfGenerator.generatePDFFromFormData(formData, !formId ? params?.type : formId);
      console.log('Generating PDF...');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'Error generating PDF',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Load existing form data
  useEffect(() => {
    async function loadForm() {
      if (formId) {
        try {
          setLoading(true);
          
          const searchParams = new URLSearchParams(window.location.search);
          const isEditMode = searchParams.get('edit') === 'true';
          
          if (isEditMode) {
            const storageKey = `editFormData_${formId}`;
            const storedData = localStorage.getItem(storageKey);
            
            if (storedData) {
              const parsedData = JSON.parse(storedData);
              console.log('Loading stored form data:', parsedData);

              // Get the form data ID from the nested structure
              const formDataId = Object.keys(parsedData.data)[0]; // Gets the first key like "-OJ-lqQdicaxeQRbtpBd"
              const actualFormData = parsedData.data[formDataId].data;

              console.log('Actual form data:', actualFormData);

              // Now set the form data with the correct nesting
              setFormData({
                personalInfo: {
                  applicantA: {
                    ...formData.personalInfo.applicantA,
                    ...actualFormData.personalInfo?.applicantA,
                    address: actualFormData.personalInfo?.applicantA?.address || '',
                    bankDetails: actualFormData.personalInfo?.applicantA?.bankDetails || '',
                    birthDate: actualFormData.personalInfo?.applicantA?.birthDate || '',
                    birthName: actualFormData.personalInfo?.applicantA?.birthName || '',
                    email: actualFormData.personalInfo?.applicantA?.email || '',
                    name: actualFormData.personalInfo?.applicantA?.name || '',
                  },
                  applicantB: {
                    ...formData.personalInfo.applicantB,
                    ...actualFormData.personalInfo?.applicantB,
                    address: actualFormData.personalInfo?.applicantB?.address || '',
                    bankDetails: actualFormData.personalInfo?.applicantB?.bankDetails || '',
                    birthDate: actualFormData.personalInfo?.applicantB?.birthDate || '',
                    birthName: actualFormData.personalInfo?.applicantB?.birthName || '',
                    email: actualFormData.personalInfo?.applicantB?.email || '',
                    name: actualFormData.personalInfo?.applicantB?.name || '',
                  },
                },
                householdBudget: {
                  applicantA: {
                    ...formData.householdBudget.applicantA,
                    ...actualFormData.householdBudget?.applicantA,
                  },
                  applicantB: {
                    ...formData.householdBudget.applicantB,
                    ...actualFormData.householdBudget?.applicantB,
                  },
                },
                assets: {
                  ...formData.assets,
                  ...actualFormData.assets,
                  bankAccountsA: actualFormData.assets?.bankAccountsA || ['', '', ''],
                  bankAccountsB: actualFormData.assets?.bankAccountsB || ['', '', ''],
                  buildingSocietyA: actualFormData.assets?.buildingSocietyA || ['', '', ''],
                  buildingSocietyB: actualFormData.assets?.buildingSocietyB || ['', '', ''],
                  lifeInsuranceA: actualFormData.assets?.lifeInsuranceA || ['', '', ''],
                  lifeInsuranceB: actualFormData.assets?.lifeInsuranceB || ['', '', ''],
                  propertyA: actualFormData.assets?.propertyA || ['', '', ''],
                  propertyB: actualFormData.assets?.propertyB || ['', '', ''],
                  otherAssetsA: actualFormData.assets?.otherAssetsA || ['', '', ''],
                  otherAssetsB: actualFormData.assets?.otherAssetsB || ['', '', ''],
                  liabilitiesA: actualFormData.assets?.liabilitiesA || ['', '', ''],
                  liabilitiesB: actualFormData.assets?.liabilitiesB || ['', '', ''],
                },
                signature: {
                  ...formData.signature,
                  ...actualFormData.signature,
                  place: actualFormData.signature?.place || '',
                  date: actualFormData.signature?.date || '',
                  signatureA: actualFormData.signature?.signatureA || null,
                  signatureB: actualFormData.signature?.signatureB || null,
                  consentDataTransmission: actualFormData.signature?.consentDataTransmission || false,
                  consentNoProceedings: actualFormData.signature?.consentNoProceedings || false,
                  consentSchufa: actualFormData.signature?.consentSchufa || false,
                  consentBankruptcy: actualFormData.signature?.consentBankruptcy || false,
                  consentAffidavit: actualFormData.signature?.consentAffidavit || false,
                  consentTruthful: actualFormData.signature?.consentTruthful || false,
                  referredBy: actualFormData.signature?.referredBy || '',
                },
              });

              setLoading(false);
              return;
            }
          }

          // If no localStorage data or not in edit mode, fetch from Firebase
          const form = await firebaseService.getForm(formId, clientId || undefined, partnerId || undefined);
          if (form) {
            console.log('Loading Firebase form data:', form);
            setFormData({
              personalInfo: form.data.personalInfo || formData.personalInfo,
              householdBudget: form.data.householdBudget || formData.householdBudget,
              assets: form.data.assets || formData.assets,
              signature: {
                ...formData.signature,
                ...form.data.signature,
              },
            });
            setFiles(form.files || []);
          }
        } catch (error) {
          console.error('Error loading form:', error);
          toast({
            title: 'Error loading form',
            description: 'Please try again.',
            variant: 'destructive',
          });
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }

    loadForm();
  }, [formId, clientId, partnerId]);

  const renderStepContent = () => {
    switch (currentStep) {
      case "personal":
        return (
          <PersonalInfoForm 
            formData={formData} 
            setFormData={setFormData} 
            errors={validationErrors}
            isSingleApplicant={isSingleApplicant}
          />
        );
      case "household":
        return (
          <HouseholdBudgetForm 
            formData={formData} 
            setFormData={setFormData} 
            errors={validationErrors}
            isSingleApplicant={isSingleApplicant}
          />
        );
      case "assets":
        return (
          <AssetsForm 
            formData={formData} 
            setFormData={setFormData} 
            errors={validationErrors}
            isSingleApplicant={isSingleApplicant}
          />
        );
      case "review":
        return <ReviewForm formData={formData} isSingleApplicant={isSingleApplicant} />;
      case "signature":
        return (
          <SignatureForm
            formData={formData}
            setFormData={setFormData}
            handleSignatureA={handleSignatureA}
            handleSignatureB={handleSignatureB}
            errors={validationErrors}
            formId={formId || ""}
            isSingleApplicant={isSingleApplicant}
          />
        );
      default:
        return null;
    }
  };

  // Define steps array for the template
  const formSteps = [
    { title: "Personal Information", component: PersonalInfoForm },
    { title: "Household Budget", component: HouseholdBudgetForm },
    { title: "Assets", component: AssetsForm },
    { title: "Review", component: ReviewForm },
    { title: "Signature", component: SignatureForm }
  ];

  // Custom success message component
  const renderSuccessMessage = () => (
    <div className="text-center">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="mt-3 text-lg font-medium text-gray-900">Form Submitted Successfully</h2>
      <div className="mt-5 flex justify-center space-x-4">
        <Button
          onClick={generatePDF}
          className="py-2 bg-green-600 hover:bg-green-700"
        >
          Export PDF
        </Button>
        <Button
          onClick={() => window.location.href = '/'}
          className="py-2 bg-blue-600 hover:bg-blue-700"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );

  // Custom actions component
  const renderCustomActions = () => (
    <div className="flex justify-between w-full">
      {currentStep !== "personal" && (
        <Button onClick={handleBack} variant="outline">
          Back
        </Button>
      )}
      <div className="flex gap-2">
        {isSubmitted && (
          <Button
            onClick={generatePDF}
            className="bg-green-600 hover:bg-green-700"
          >
            Export PDF
          </Button>
        )}
        {currentStep === "signature" ? (
          <Button
            onClick={handleSubmit}
            disabled={
              !formData.signature.signatureA || 
              (!isSingleApplicant && !formData.signature.signatureB) ||
              !formData.signature.place || 
              !formData.signature.date
            }
            className="bg-primary"
          >
            {formId ? 'Update' : 'Submit'} Form
          </Button>
        ) : (
          <Button onClick={handleNext}>Next</Button>
        )}
      </div>
    </div>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <FormTemplate
      title={`${formId ? 'Edit' : 'New'} ${params?.type?.replace(/-/g, " ")} Form`}
      currentStep={steps.indexOf(currentStep)}
      totalSteps={steps.length}
      steps={formSteps}
      isSubmitting={loading}
      isSubmitted={isSubmitted}
      showProgress={true}
      onPrevious={handleBack}
      onNext={handleNext}
      onSubmit={handleSubmit}
      renderSuccessMessage={renderSuccessMessage}
      customActions={renderCustomActions()}
    >
      <div className="flex items-center justify-end mb-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="single-applicant"
            checked={isSingleApplicant}
            onCheckedChange={handleSingleApplicantChange}
          />
          <label
            htmlFor="single-applicant"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Single Applicant
          </label>
        </div>
      </div>

      {renderStepContent()}
    </FormTemplate>
  );
} 