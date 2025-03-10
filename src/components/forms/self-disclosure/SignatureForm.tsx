import languageData from "@/components/forms/self-disclosure/i18n/language.json";
import { SignaturePad } from "@/components/signature-pad";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { FormData } from "@/types/form";
import { useState } from 'react';
import { pdfGenerator } from "../../../db-services/lib/pdf-generator";

interface SignatureFormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  handleSignatureA: (signatureData: string) => void;
  handleSignatureB: (signatureData: string) => void;
  errors: Record<string, any>;
  formId: string;
  isSingleApplicant: boolean;
}

export function SignatureForm({
  formData,
  setFormData,
  handleSignatureA,
  handleSignatureB,
  errors,
  formId,
  isSingleApplicant,
}: SignatureFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const pdfUrl = await pdfGenerator.generatePDFFromFormData(formData, formId);
      
      toast({
        title: "Success",
        description: "Form submitted and PDF saved successfully",
      });

      console.log('PDF saved:', pdfUrl);
    } catch (error) {
      console.error('Error saving PDF:', error);
      toast({
        title: "Error",
        description: "Failed to save PDF",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Declaration Section */}
      <div className="space-y-4 border rounded-md p-4 bg-gray-50">
        <h3 className="font-medium mb-4">{languageData.de.declaration}</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <label htmlFor="consent-schufa" className="text-sm text-gray-700">
              {languageData.de.declaration_text1}
            </label>
          </div>

          <div className="flex items-start space-x-2">
            <label htmlFor="consent-bankruptcy" className="text-sm text-gray-700">
              {languageData.de.declaration_text2}
            </label>
          </div>
        </div>

        {/* English Translations */}
        <h3 className="font-medium mb-4 mt-6">{languageData.en.declaration}</h3>
        <div className="space-y-3 text-sm ">
          <p>{languageData.en.declaration_text1}</p>
          <p>{languageData.en.declaration_text2}</p>
        </div>
      </div>

      {/* Place and Date */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label>
            {languageData.de.place}
            <span className="text-sm  block">{languageData.en.place}</span>
          </Label>
          <Input
            value={formData.signature.place}
            onChange={(e) =>
              setFormData({
                ...formData,
                signature: {
                  ...formData.signature,
                  place: e.target.value,
                },
              })
            }
          />
        </div>
        <div>
          <Label>
            {languageData.de.date}
            <span className="text-sm  block">{languageData.en.date}</span>
          </Label>
          <Input
            type="date"
            value={formData.signature.date}
            onChange={(e) =>
              setFormData({
                ...formData,
                signature: {
                  ...formData.signature,
                  date: e.target.value,
                },
              })
            }
          />
        </div>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-2 gap-6">
        {/* Applicant A Signature */}
        <div>
          <div className="space-y-4">
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.signature_a}</span>
                <span className="text-sm  block">{languageData.en.signature_a}</span>
              </Label>
              <SignaturePad
                onSave={handleSignatureA}
                initialValue={formData.signature.signatureA || ""}
              />
              {errors.signatureA && (
                <p className="text-red-500 text-sm">{errors.signatureA}</p>
              )}
            </div>
          </div>
        </div>

        {/* Applicant B Signature */}
        <div>
          <div className="space-y-4">
            <div style={{ display: isSingleApplicant ? "none" : "block" }}>
              <Label className="block space-y-1">
                <span>{languageData.de.signature_b}</span>
                <span className="text-sm  block">{languageData.en.signature_b}</span>
              </Label>
              <SignaturePad
                onSave={handleSignatureB}
                initialValue={formData.signature.signatureB || ""}
              />
              {errors.signatureB && (
                <p className="text-red-500 text-sm">{errors.signatureB}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Referred By field after signatures */}
      <div className="mt-8 border-t pt-6">
        <div className="space-y-4">
          <Label className="block space-y-1">
            <span>{languageData.de.referred_by}</span>
            <span className="text-sm  block">
              {languageData.en.referred_by}
            </span>
          </Label>
          <Input
            placeholder={languageData.de.referred_by_placeholder}
            value={formData.signature.referredBy || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                signature: {
                  ...formData.signature,
                  referredBy: e.target.value,
                },
              })
            }
            className="max-w-md"
          />
        </div>
      </div>
    </div>
  );
} 