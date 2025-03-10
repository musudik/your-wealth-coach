import { FormSection } from "@/components/ui/form-section";
import { FormTemplate } from "@/components/ui/form-template";
import { useToast } from "@/components/ui/use-toast";
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { z } from "zod";
import { firebaseService } from "../../../db-services/lib/firebase-service";
import { pdfGenerator } from "../../../db-services/lib/pdf-generator";
import languageData from "./i18n/language.json";
import { electricityFormSchema, type ElectricityFormData } from "./validation";

// Update the FormData interface to use the type from validation
type FormData = ElectricityFormData;

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  address?: string;
  currentContract?: string;
  numberOfPersons?: string;
  consumption?: string;
  signature?: {
    place?: string;
    date?: string;
    signatureData?: string;
    referredBy?: string;
  };
}

export function ElectricityForm() {
  const { toast } = useToast();
  const history = useHistory();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    address: '',
    currentContract: '',
    numberOfPersons: '',
    consumption: '',
    signature: {
      place: '',
      date: '',
      signatureData: '',
      referredBy: '',
    }
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignatureConfirmed, setIsSignatureConfirmed] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (field: keyof Omit<FormData, 'signature'>, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    validateField(field, value);
  };

  const handleSignatureFieldChange = (field: keyof FormData['signature'], value: string) => {
    if (field === 'date') {
      // Ensure date is in YYYY-MM-DD format
      const formattedDate = new Date(value).toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        signature: {
          ...prev.signature,
          [field]: formattedDate
        }
      }));
      validateSignatureField(field, formattedDate);
    } else {
      setFormData(prev => ({
        ...prev,
        signature: {
          ...prev.signature,
          [field]: value
        }
      }));
      validateSignatureField(field, value);
    }
  };

  const validateSignatureField = (field: keyof FormData['signature'], value: string) => {
    try {
      electricityFormSchema.shape.signature.shape[field].parse(value);
      setErrors(prev => ({
        ...prev,
        signature: {
          ...prev.signature,
          [field]: undefined
        }
      }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({
          ...prev,
          signature: {
            ...prev.signature,
            [field]: error.errors[0].message
          }
        }));
      }
    }
  };

  const validateField = (field: keyof Omit<FormData, 'signature'>, value: string) => {
    try {
      electricityFormSchema.shape[field].parse(value);
      setErrors(prev => ({ ...prev, [field]: undefined }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({
          ...prev,
          [field]: error.errors[0].message
        }));
      }
    }
  };

  const handleSignature = (signatureData: string) => {
    handleSignatureFieldChange('signatureData', signatureData);
    setIsSignatureConfirmed(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Use the schema from validation file
      const validationResult = electricityFormSchema.safeParse(formData);
      
      if (!validationResult.success) {
        const newErrors: Partial<Record<keyof FormData, string>> = {};
        validationResult.error.errors.forEach(err => {
          const field = err.path[0] as keyof FormData;
          if (!newErrors[field]) {
            newErrors[field] = err.message;
          }
        });
        setErrors(newErrors);
        throw new Error('Validation failed');
      }

      // Save to Firebase
      const savedForm = await firebaseService.createElectricityForm({
        type: 'electricity',
        data: validationResult.data,
        createdAt: new Date().toISOString(),
      });

      // Generate PDF
      await pdfGenerator.generateElectricityPDF(validationResult.data, savedForm.id);

      toast({
        title: "Success",
        description: "Form submitted successfully and PDF generated",
      });

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        address: '',
        currentContract: '',
        numberOfPersons: '',
        consumption: '',
        signature: {
          place: '',
          date: '',
          signatureData: '',
          referredBy: '',
        }
      });
      setErrors({});
      setIsSubmitted(true);
    } catch (error) {
      console.error('Form submission error:', error);
      if (!(error instanceof Error && error.message === 'Validation failed')) {
        toast({
          title: "Error",
          description: "Failed to submit form. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormTemplate
      title={`${languageData.de.title} / ${languageData.en.title}`}
      isSubmitting={isSubmitting}
      isSubmitted={isSubmitted}
    >
      <form onSubmit={handleSubmit}>
        <FormSection 
          title={languageData.de.personalInfo}
          subtitle={languageData.en.personalInfo}
        >
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">
                <span className="form-label-text">{languageData.de.firstName}</span>
                <span className="form-label-subtext">{languageData.en.firstName}</span>
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                className={`form-input ${errors.firstName ? 'form-input-error' : ''}`}
              />
              {errors.firstName && (
                <p className="form-error-message">{errors.firstName}</p>
              )}
            </div>

            <div className="form-field">
              <label className="form-label">
                <span className="form-label-text">{languageData.de.lastName}</span>
                <span className="form-label-subtext">{languageData.en.lastName}</span>
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                className={`form-input ${errors.lastName ? 'form-input-error' : ''}`}
              />
              {errors.lastName && (
                <p className="form-error-message">{errors.lastName}</p>
              )}
            </div>

            <div className="form-field">
              <label className="form-label">
                <span className="form-label-text">{languageData.de.email}</span>
                <span className="form-label-subtext">{languageData.en.email}</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`form-input ${errors.email ? 'form-input-error' : ''}`}
              />
              {errors.email && (
                <p className="form-error-message">{errors.email}</p>
              )}
            </div>

            <div className="form-field">
              <label className="form-label">
                <span className="form-label-text">{languageData.de.mobile}</span>
                <span className="form-label-subtext">{languageData.en.mobile}</span>
              </label>
              <input
                type="tel"
                value={formData.mobile}
                onChange={(e) => handleChange('mobile', e.target.value)}
                className={`form-input ${errors.mobile ? 'form-input-error' : ''}`}
              />
              {errors.mobile && (
                <p className="form-error-message">{errors.mobile}</p>
              )}
            </div>

            <div className="form-field">
              <label className="form-label">
                <span className="form-label-text">{languageData.de.address}</span>
                <span className="form-label-subtext">{languageData.en.address}</span>
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className={`form-input ${errors.address ? 'form-input-error' : ''}`}
              />
              {errors.address && (
                <p className="form-error-message">{errors.address}</p>
              )}
            </div>
          </div>
        </FormSection>

        <FormSection 
          title={languageData.de.contractDetails}
          subtitle={languageData.en.contractDetails}
        >
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">
                <span className="form-label-text">{languageData.de.currentContract}</span>
                <span className="form-label-subtext">{languageData.en.currentContract}</span>
              </label>
              <textarea
                value={formData.currentContract}
                onChange={(e) => handleChange('currentContract', e.target.value)}
                className={`form-input ${errors.currentContract ? 'form-input-error' : ''}`}
              />
              {errors.currentContract && (
                <p className="form-error-message">{errors.currentContract}</p>
              )}
            </div>

            <div className="form-field">
              <label className="form-label">
                <span className="form-label-text">{languageData.de.numberOfPersons}</span>
                <span className="form-label-subtext">{languageData.en.numberOfPersons}</span>
              </label>
              <input
                type="text"
                value={formData.numberOfPersons}
                onChange={(e) => handleChange('numberOfPersons', e.target.value)}
                className={`form-input ${errors.numberOfPersons ? 'form-input-error' : ''}`}
              />
              {errors.numberOfPersons && (
                <p className="form-error-message">{errors.numberOfPersons}</p>
              )}
            </div>

            <div className="form-field">
              <label className="form-label">
                <span className="form-label-text">{languageData.de.consumption}</span>
                <span className="form-label-subtext">{languageData.en.consumption}</span>
              </label>
              <input
                type="text"
                value={formData.consumption}
                onChange={(e) => handleChange('consumption', e.target.value)}
                className={`form-input ${errors.consumption ? 'form-input-error' : ''}`}
              />
              {errors.consumption && (
                <p className="form-error-message">{errors.consumption}</p>
              )}
            </div>
          </div>
        </FormSection>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => history.goBack()}
            className="btn btn-cancel"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </FormTemplate>
  );
} 