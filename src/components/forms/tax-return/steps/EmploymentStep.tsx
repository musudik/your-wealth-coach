import React from 'react';
import { Label } from '@/components/ui/label';
import FormSection from '../FormSection';
import { TaxFormData } from '../taxTypes';
import languageData from '../i18n/language.json';

interface EmploymentStepProps {
  formData: TaxFormData;
  handleChange: (section: keyof TaxFormData, field: string, value: any) => void;
  validationErrors: Record<string, any> | null;
  hasError: (section: string, field: string) => boolean;
}

const EmploymentStep: React.FC<EmploymentStepProps> = ({
  formData,
  handleChange,
  validationErrors,
  hasError
}) => {
  return (
    <FormSection title={`${languageData.de.incomeInfo.employmentIncome} / ${languageData.en.incomeInfo.employmentIncome}`}>
      <div className="space-y-6">
        {/* Employment status */}
        <div>
          <Label className="block space-y-1">
            <span>Sind Sie angestellt?</span>
            <span className="text-sm text-gray-600 block">Are you employed?</span>
          </Label>
          <div className="flex space-x-4 mt-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="employedNo"
                name="employed"
                checked={formData.incomeInfo.isEmployed === false}
                onChange={() => handleChange('incomeInfo', 'isEmployed', false)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                required
              />
              <label htmlFor="employedNo" className="ml-2">Nein / No</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="employedYes"
                name="employed"
                checked={formData.incomeInfo.isEmployed === true}
                onChange={() => handleChange('incomeInfo', 'isEmployed', true)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                required
              />
              <label htmlFor="employedYes" className="ml-2">Ja / Yes</label>
            </div>
          </div>
          {hasError('incomeInfo', 'isEmployed') && (
            <p className="mt-1 text-sm text-red-600">
              {languageData.de.validation.required} / {languageData.en.validation.required}
            </p>
          )}
        </div>
        
        {/* Conditional fields when employed */}
        {formData.incomeInfo.isEmployed && (
          <div className="space-y-4 ml-6">
            {/* Employer */}
            <div>
              <Label className="block space-y-1">
                <span>Bei welchem Unternehmen sind Sie angestellt?</span>
                <span className="text-sm text-gray-600 block">If yes, at which company are you employed?</span>
              </Label>
              <input
                type="text"
                value={formData.incomeInfo.employer || ''}
                onChange={(e) => handleChange('incomeInfo', 'employer', e.target.value)}
                className={validationErrors?.incomeInfo?.employer ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                required
              />
              {hasError('incomeInfo', 'employer') && (
                <p className="mt-1 text-sm text-red-600">
                  {languageData.de.validation.required} / {languageData.en.validation.required}
                </p>
              )}
            </div>
            
            {/* Gross annual salary */}
            <div>
              <Label className="block space-y-1">
                <span>Wie hoch war Ihr Bruttojahresgehalt im letzten Jahr?</span>
                <span className="text-sm text-gray-600 block">What was your gross annual salary last year?</span>
              </Label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.incomeInfo.grossAnnualSalary || 0}
                onChange={(e) => handleChange('incomeInfo', 'grossAnnualSalary', parseFloat(e.target.value) || 0)}
                className={validationErrors?.incomeInfo?.grossAnnualSalary ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                required
              />
              {hasError('incomeInfo', 'grossAnnualSalary') && (
                <p className="mt-1 text-sm text-red-600">
                  {languageData.de.validation.positiveNumber} / {languageData.en.validation.positiveNumber}
                </p>
              )}
            </div>
            
            {/* Income tax certificate */}
            <div>
              <Label className="block space-y-1">
                <span>Haben Sie Ihre Lohnsteuerbescheinigung?</span>
                <span className="text-sm text-gray-600 block">Do you have your income tax certificate (Lohnsteuerbescheinigung)?</span>
              </Label>
              <div className="flex space-x-4 mt-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="taxCertificateNo"
                    name="taxCertificate"
                    checked={formData.incomeInfo.hasTaxCertificate === false}
                    onChange={() => handleChange('incomeInfo', 'hasTaxCertificate', false)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    required
                  />
                  <label htmlFor="taxCertificateNo" className="ml-2">Nein / No</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="taxCertificateYes"
                    name="taxCertificate"
                    checked={formData.incomeInfo.hasTaxCertificate === true}
                    onChange={() => handleChange('incomeInfo', 'hasTaxCertificate', true)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    required
                  />
                  <label htmlFor="taxCertificateYes" className="ml-2">Ja / Yes</label>
                </div>
              </div>
              {hasError('incomeInfo', 'hasTaxCertificate') && (
                <p className="mt-1 text-sm text-red-600">
                  {languageData.de.validation.required} / {languageData.en.validation.required}
                </p>
              )}
              
              {/* File upload for tax certificate */}
              {formData.incomeInfo.hasTaxCertificate && (
                <div className="mt-3">
                  <Label className="block space-y-1">
                    <span>Wenn ja, laden Sie bitte Ihre Lohnsteuerbescheinigung hoch:</span>
                    <span className="text-sm text-gray-600 block">If yes, please upload your income tax certificate:</span>
                  </Label>
                  <input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        // Here you would typically handle the file upload
                        // For now, we'll just store the file name
                        handleChange('incomeInfo', 'taxCertificateFile', e.target.files[0].name);
                      }
                    }}
                    className="mt-1 block w-full text-sm text-gray-500
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-md file:border-0
                              file:text-sm file:font-semibold
                              file:bg-blue-50 file:text-blue-700
                              hover:file:bg-blue-100"
                    required={formData.incomeInfo.hasTaxCertificate}
                  />
                  {hasError('incomeInfo', 'taxCertificateFile') && (
                    <p className="mt-1 text-sm text-red-600">
                      {languageData.de.validation.required} / {languageData.en.validation.required}
                    </p>
                  )}
                </div>
              )}
            </div>
            
            {/* Travel expense subsidy */}
            <div>
              <Label className="block space-y-1">
                <span>Erhalten Sie einen Fahrtkostenzuschuss von Ihrem Arbeitgeber?</span>
                <span className="text-sm text-gray-600 block">Do you receive a travel expense subsidy from your employer?</span>
              </Label>
              <div className="flex space-x-4 mt-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="travelSubsidyNo"
                    name="travelSubsidy"
                    checked={formData.incomeInfo.hasTravelSubsidy === false}
                    onChange={() => handleChange('incomeInfo', 'hasTravelSubsidy', false)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    required
                  />
                  <label htmlFor="travelSubsidyNo" className="ml-2">Nein / No</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="travelSubsidyYes"
                    name="travelSubsidy"
                    checked={formData.incomeInfo.hasTravelSubsidy === true}
                    onChange={() => handleChange('incomeInfo', 'hasTravelSubsidy', true)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    required
                  />
                  <label htmlFor="travelSubsidyYes" className="ml-2">Ja / Yes</label>
                </div>
              </div>
              {hasError('incomeInfo', 'hasTravelSubsidy') && (
                <p className="mt-1 text-sm text-red-600">
                  {languageData.de.validation.required} / {languageData.en.validation.required}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </FormSection>
  );
};

export default EmploymentStep; 