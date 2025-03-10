import React from 'react';
import { TaxFormData } from '../taxTypes';
import { FormSection } from "@/components/ui/form-section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignaturePad } from "@/components/signature-pad";

interface SignatureStepProps {
  formData: TaxFormData;
  handleChange: (section: keyof TaxFormData, field: string, value: any) => void;
  validationErrors?: Record<string, any> | null;
  showValidationErrors?: boolean;
}

const SignatureStep: React.FC<SignatureStepProps> = ({
  formData,
  handleChange,
  validationErrors,
  showValidationErrors,
}) => {
  const hasError = (field: string) => {
    return showValidationErrors && validationErrors?.signature?.[field];
  };

  return (
    <div className="space-y-6">
      {/* Declaration Section */}
      <FormSection title="Declaration / Erklärung">
        <div className="space-y-4 border rounded-md p-4 bg-gray-50">
          {/* German Declaration */}
          <h3 className="font-medium mb-4">Erklärung</h3>
          <div className="space-y-3">
            <p className="text-sm text-gray-700">
              Ich versichere, dass ich die Angaben in dieser Steuererklärung wahrheitsgemäß nach bestem Wissen und Gewissen gemacht habe. Die beigefügten Unterlagen und Belege sind vollständig und authentisch. Mir ist bekannt, dass ich für falsche oder unterlassene Angaben strafrechtlich zur Verantwortung gezogen werden kann.
            </p>
            <p className="text-sm text-gray-700">
              Ich stimme zu, dass meine Daten zum Zweck der Steuererklärung verarbeitet und gespeichert werden. Die Verarbeitung erfolgt unter Beachtung der geltenden Datenschutzbestimmungen.
            </p>
          </div>

          {/* English Declaration */}
          <h3 className="font-medium mb-4 mt-6">Declaration</h3>
          <div className="space-y-3 text-sm text-gray-700">
            <p>
              I declare that the information provided in this tax return is true and correct to the best of my knowledge and belief. All attached documents and receipts are complete and authentic. I understand that I may be held criminally liable for false or omitted information.
            </p>
            <p>
              I consent to my data being processed and stored for the purpose of tax return preparation. The processing will be carried out in compliance with applicable data protection regulations.
            </p>
          </div>
        </div>
      </FormSection>

      {/* Place and Date */}
      <FormSection title="Place and Date / Ort und Datum">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label>
              Ort
              <span className="text-sm block">Place</span>
            </Label>
            <Input
              value={formData.signature?.place || ''}
              onChange={(e) => handleChange('signature', 'place', e.target.value)}
              className={hasError('place') ? 'border-red-500' : ''}
            />
            {hasError('place') && (
              <p className="text-red-500 text-sm mt-1">This field is required</p>
            )}
          </div>
          <div>
            <Label>
              Datum
              <span className="text-sm block">Date</span>
            </Label>
            <Input
              type="date"
              value={formData.signature?.date || ''}
              onChange={(e) => handleChange('signature', 'date', e.target.value)}
              className={hasError('date') ? 'border-red-500' : ''}
            />
            {hasError('date') && (
              <p className="text-red-500 text-sm mt-1">This field is required</p>
            )}
          </div>
          <div>
            <Label>
              Uhrzeit
              <span className="text-sm block">Time</span>
            </Label>
            <Input
              type="time"
              value={formData.signature?.time || ''}
              onChange={(e) => handleChange('signature', 'time', e.target.value)}
              className={hasError('time') ? 'border-red-500' : ''}
            />
            {hasError('time') && (
              <p className="text-red-500 text-sm mt-1">This field is required</p>
            )}
          </div>
        </div>
      </FormSection>

      {/* Signature */}
      <FormSection title="Signature / Unterschrift">
        <div className="space-y-4">
          <Label className="block space-y-1">
            <span>Unterschrift</span>
            <span className="text-sm block">Signature</span>
          </Label>
          <SignaturePad
            onSave={(signatureData) => handleChange('signature', 'signature', signatureData)}
            initialValue={formData.signature?.signature || ''}
          />
          {hasError('signature') && (
            <p className="text-red-500 text-sm">Signature is required</p>
          )}
        </div>
      </FormSection>
    </div>
  );
};

export default SignatureStep; 