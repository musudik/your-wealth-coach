import React from 'react';
import { Label } from '@/components/ui/label';
import { FormSection } from "@/components/ui/form-section";
import { TaxFormData } from '../taxTypes';
import languageData from '../i18n/language.json';

interface BusinessStepProps {
  formData: TaxFormData;
  handleChange: (section: keyof TaxFormData, field: string, value: any) => void;
  validationErrors: Record<string, any> | null;
  hasError: (section: string, field: string) => boolean;
}

const BusinessStep: React.FC<BusinessStepProps> = ({
  formData,
  handleChange,
  validationErrors,
  hasError
}) => {
  return (
    <FormSection title="Self-Employment Income / Einkünfte aus Selbständigkeit">
      <div className="space-y-6">
        {/* Business owner status */}
        <div>
          <Label className="block space-y-1">
            <span>Sind Sie selbständig oder besitzen Sie ein Unternehmen?</span>
            <span className="text-sm text-gray-600 block">Are you self-employed or do you own a business?</span>
          </Label>
          <div className="flex space-x-4 mt-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="businessOwnerNo"
                name="businessOwner"
                checked={formData.incomeInfo.isBusinessOwner === false}
                onChange={() => handleChange('incomeInfo', 'isBusinessOwner', false)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                required
              />
              <label htmlFor="businessOwnerNo" className="ml-2">Nein / No</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="businessOwnerYes"
                name="businessOwner"
                checked={formData.incomeInfo.isBusinessOwner === true}
                onChange={() => handleChange('incomeInfo', 'isBusinessOwner', true)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                required
              />
              <label htmlFor="businessOwnerYes" className="ml-2">Ja / Yes</label>
            </div>
          </div>
          {hasError('incomeInfo', 'isBusinessOwner') && (
            <p className="mt-1 text-sm text-red-600">
              {languageData.de.validation.required} / {languageData.en.validation.required}
            </p>
          )}
        </div>
        
        {/* Conditional fields when business owner */}
        {formData.incomeInfo.isBusinessOwner && (
          <div className="space-y-4 ml-6">
            {/* Business type */}
            <div>
              <Label className="block space-y-1">
                <span>Welche Art von Geschäft betreiben Sie?</span>
                <span className="text-sm text-gray-600 block">What type of business do you operate?</span>
              </Label>
              <input
                type="text"
                value={formData.incomeInfo.businessType || ''}
                onChange={(e) => handleChange('incomeInfo', 'businessType', e.target.value)}
                className={validationErrors?.incomeInfo?.businessType ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                required
              />
              {hasError('incomeInfo', 'businessType') && (
                <p className="mt-1 text-sm text-red-600">
                  {languageData.de.validation.required} / {languageData.en.validation.required}
                </p>
              )}
            </div>
            
            {/* Business earnings */}
            <div>
              <Label className="block space-y-1">
                <span>Wie hoch waren Ihre Geschäftseinnahmen im letzten Jahr?</span>
                <span className="text-sm text-gray-600 block">What were your business earnings last year?</span>
              </Label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.incomeInfo.businessEarnings || 0}
                onChange={(e) => handleChange('incomeInfo', 'businessEarnings', parseFloat(e.target.value) || 0)}
                className={validationErrors?.incomeInfo?.businessEarnings ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                required
              />
              {hasError('incomeInfo', 'businessEarnings') && (
                <p className="mt-1 text-sm text-red-600">
                  {languageData.de.validation.positiveNumber} / {languageData.en.validation.positiveNumber}
                </p>
              )}
            </div>
            
            {/* Business expenses */}
            <div>
              <Label className="block space-y-1">
                <span>Wie hoch waren Ihre Geschäftsausgaben im letzten Jahr?</span>
                <span className="text-sm text-gray-600 block">What were your business expenses last year?</span>
              </Label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.incomeInfo.businessExpenses || 0}
                onChange={(e) => handleChange('incomeInfo', 'businessExpenses', parseFloat(e.target.value) || 0)}
                className={validationErrors?.incomeInfo?.businessExpenses ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                required
              />
              {hasError('incomeInfo', 'businessExpenses') && (
                <p className="mt-1 text-sm text-red-600">
                  {languageData.de.validation.positiveNumber} / {languageData.en.validation.positiveNumber}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </FormSection>
  );
};

export default BusinessStep; 