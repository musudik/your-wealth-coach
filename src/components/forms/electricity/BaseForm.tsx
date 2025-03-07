import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { firebaseService } from "@/lib/firebase-service";
import languageData from "./i18n/language.json";
import { z } from "zod";
import { SignaturePad } from "@/components/signature-pad";
import { pdfGenerator } from "@/lib/pdf-generator";
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
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-orange-600">
            {languageData.de.title}
            <br />
            <span className="text-sm text-gray-600 block">{languageData.en.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="block space-y-1">
                  <span>{languageData.de.firstName}</span>
                  <span className="text-sm text-gray-600 block">{languageData.en.firstName}</span>
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className={errors.firstName ? 'border-red-500' : ''}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">{errors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="block space-y-1">
                  <span>{languageData.de.lastName}</span>
                  <span className="text-sm text-gray-600 block">{languageData.en.lastName}</span>
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className={errors.lastName ? 'border-red-500' : ''}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="block space-y-1">
                <span>{languageData.de.email}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.email}</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="block space-y-1">
                <span>{languageData.de.mobile}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.mobile}</span>
              </Label>
              <Input
                id="mobile"
                value={formData.mobile}
                onChange={(e) => handleChange('mobile', e.target.value)}
                className={errors.mobile ? 'border-red-500' : ''}
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm">{errors.mobile}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="block space-y-1">
                <span>{languageData.de.address}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.address}</span>
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className={errors.address ? 'border-red-500' : ''}
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="block space-y-1">
                <span>{languageData.de.currentContract}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.currentContract}</span>
              </Label>
              <Textarea
                id="currentContract"
                value={formData.currentContract}
                onChange={(e) => handleChange('currentContract', e.target.value)}
                placeholder={languageData.de.currentContractPlaceholder}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="block space-y-1">
                  <span>{languageData.de.numberOfPersons}</span>
                  <span className="text-sm text-gray-600 block">{languageData.en.numberOfPersons}</span>
                </Label>
                <Input
                  id="numberOfPersons"
                  type="number"
                  min="1"
                  value={formData.numberOfPersons}
                  onChange={(e) => handleChange('numberOfPersons', e.target.value)}
                  className={errors.numberOfPersons ? 'border-red-500' : ''}
                />
                {errors.numberOfPersons && (
                  <p className="text-red-500 text-sm">{errors.numberOfPersons}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="block space-y-1">
                  <span>{languageData.de.consumption}</span>
                  <span className="text-sm text-gray-600 block">{languageData.en.consumption}</span>
                </Label>
                <Input
                  id="consumption"
                  type="number"
                  min="0"
                  value={formData.consumption}
                  onChange={(e) => handleChange('consumption', e.target.value)}
                  className={errors.consumption ? 'border-red-500' : ''}
                />
                {errors.consumption && (
                  <p className="text-red-500 text-sm">{errors.consumption}</p>
                )}
              </div>
            </div>

            {/* Declaration Section */}
            <div className="space-y-6 mt-8 border-t pt-6">
              <div className="space-y-4 border rounded-md p-4 bg-gray-50">
                <h3 className="font-medium mb-4">
                  {languageData.de.declaration}
                  <span className="text-sm text-gray-600 block">{languageData.en.declaration}</span>
                </h3>
                <div className="space-y-3">
                  <p className="text-sm text-gray-700">{languageData.de.declaration_text1}</p>
                  <p className="text-sm text-gray-700 mt-2">{languageData.de.declaration_text2}</p>
                  <br />
                  <p className="text-sm text-gray-600">{languageData.en.declaration_text1}</p>
                  <p className="text-sm text-gray-600">{languageData.en.declaration_text2}</p>
                </div>
              </div>

              {/* Place and Date */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="block space-y-1">
                    <span>{languageData.de.place}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.place}</span>
                  </Label>
                  <Input
                    value={formData.signature.place}
                    onChange={(e) => handleSignatureFieldChange('place', e.target.value)}
                    className={errors.signature?.place ? 'border-red-500' : ''}
                  />
                  {errors.signature?.place && (
                    <p className="text-red-500 text-sm">{errors.signature.place}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="block space-y-1">
                    <span>{languageData.de.date}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.date}</span>
                  </Label>
                  <Input
                    type="date"
                    value={formData.signature.date}
                    onChange={(e) => handleSignatureFieldChange('date', e.target.value)}
                    className={errors.signature?.date ? 'border-red-500' : ''}
                    // Set default value to today's date
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                  {errors.signature?.date && (
                    <p className="text-red-500 text-sm">{errors.signature.date}</p>
                  )}
                </div>
              </div>

              {/* Signature */}
              <div>
                <Label className="block space-y-1">
                  <span>{languageData.de.signature}</span>
                  <span className="text-sm text-gray-600 block">{languageData.en.signature}</span>
                </Label>
                <SignaturePad
                  onSave={handleSignature}
                  initialValue={formData.signature.signatureData}
                />
              </div>

              {/* Referred By */}
              <div className="mt-6">
                <Label className="block space-y-1">
                  <span>{languageData.de.referred_by}</span>
                  <span className="text-sm text-gray-600 block">{languageData.en.referred_by}</span>
                </Label>
                <Input
                  placeholder={languageData.de.referred_by_placeholder}
                  value={formData.signature.referredBy}
                  onChange={(e) => handleSignatureFieldChange('referredBy', e.target.value)}
                  className="max-w-md"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !isSignatureConfirmed}
              className="w-full mt-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              {isSubmitting ? "Submitting..." : languageData.de.submit}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 