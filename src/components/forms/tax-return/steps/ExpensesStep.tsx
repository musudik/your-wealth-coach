import React from 'react';
import { Label } from '@/components/ui/label';
import { FormSection } from "@/components/ui/form-section";
import { TaxFormData } from '../taxTypes';
import languageData from '../i18n/language.json';

interface ExpensesStepProps {
  formData: TaxFormData;
  handleChange: (section: keyof TaxFormData, field: string, value: any) => void;
  validationErrors: Record<string, any> | null;
  hasError: (section: string, field: string) => boolean;
}

const ExpensesStep: React.FC<ExpensesStepProps> = ({
  formData,
  handleChange,
  validationErrors,
  hasError
}) => {
  return (
    <FormSection title={`${languageData.de.deductions.title} / ${languageData.en.deductions.title}`}>
      <div className="space-y-6">
        {/* Work-related expenses */}
        <div>
          <Label className="block space-y-1">
            <span>Werbungskosten</span>
            <span className="text-sm text-gray-600 block">Work-related expenses</span>
          </Label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.deductions.workRelatedExpenses || 0}
            onChange={(e) => handleChange('deductions', 'workRelatedExpenses', parseFloat(e.target.value) || 0)}
            className={validationErrors?.deductions?.workRelatedExpenses ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            required
          />
          {hasError('deductions', 'workRelatedExpenses') && (
            <p className="mt-1 text-sm text-red-600">
              {languageData.de.validation.positiveNumber} / {languageData.en.validation.positiveNumber}
            </p>
          )}
        </div>
        
        {/* Special expenses */}
        <div>
          <Label className="block space-y-1">
            <span>Sonderausgaben</span>
            <span className="text-sm text-gray-600 block">Special expenses</span>
          </Label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.deductions.specialExpenses || 0}
            onChange={(e) => handleChange('deductions', 'specialExpenses', parseFloat(e.target.value) || 0)}
            className={validationErrors?.deductions?.specialExpenses ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            required
          />
          {hasError('deductions', 'specialExpenses') && (
            <p className="mt-1 text-sm text-red-600">
              {languageData.de.validation.positiveNumber} / {languageData.en.validation.positiveNumber}
            </p>
          )}
        </div>
        
        {/* Extraordinary expenses */}
        <div>
          <Label className="block space-y-1">
            <span>Außergewöhnliche Belastungen</span>
            <span className="text-sm text-gray-600 block">Extraordinary expenses</span>
          </Label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.deductions.extraordinaryExpenses || 0}
            onChange={(e) => handleChange('deductions', 'extraordinaryExpenses', parseFloat(e.target.value) || 0)}
            className={validationErrors?.deductions?.extraordinaryExpenses ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            required
          />
          {hasError('deductions', 'extraordinaryExpenses') && (
            <p className="mt-1 text-sm text-red-600">
              {languageData.de.validation.positiveNumber} / {languageData.en.validation.positiveNumber}
            </p>
          )}
        </div>
        
        {/* Insurance premiums */}
        <div>
          <Label className="block space-y-1">
            <span>Versicherungsbeiträge</span>
            <span className="text-sm text-gray-600 block">Insurance premiums</span>
          </Label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.deductions.insurancePremiums || 0}
            onChange={(e) => handleChange('deductions', 'insurancePremiums', parseFloat(e.target.value) || 0)}
            className={validationErrors?.deductions?.insurancePremiums ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            required
          />
          {hasError('deductions', 'insurancePremiums') && (
            <p className="mt-1 text-sm text-red-600">
              {languageData.de.validation.positiveNumber} / {languageData.en.validation.positiveNumber}
            </p>
          )}
        </div>
        
        {/* Craftsmen services */}
        <div>
          <Label className="block space-y-1">
            <span>Haben Sie Handwerkerleistungen in Anspruch genommen?</span>
            <span className="text-sm text-gray-600 block">Did you use craftsmen services?</span>
          </Label>
          <div className="flex space-x-4 mt-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="craftsmenNo"
                name="craftsmen"
                checked={formData.deductions.hasCraftsmenPayments === false}
                onChange={() => handleChange('deductions', 'hasCraftsmenPayments', false)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                required
              />
              <label htmlFor="craftsmenNo" className="ml-2">Nein / No</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="craftsmenYes"
                name="craftsmen"
                checked={formData.deductions.hasCraftsmenPayments === true}
                onChange={() => handleChange('deductions', 'hasCraftsmenPayments', true)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                required
              />
              <label htmlFor="craftsmenYes" className="ml-2">Ja / Yes</label>
            </div>
          </div>
          {hasError('deductions', 'hasCraftsmenPayments') && (
            <p className="mt-1 text-sm text-red-600">
              {languageData.de.validation.required} / {languageData.en.validation.required}
            </p>
          )}
          
          {/* Conditional fields for craftsmen services */}
          {formData.deductions.hasCraftsmenPayments && (
            <div className="space-y-4 mt-3 ml-6">
              <div>
                <Label className="block space-y-1">
                  <span>Wie hoch waren die Kosten für Handwerkerleistungen?</span>
                  <span className="text-sm text-gray-600 block">How much did you pay for craftsmen services?</span>
                </Label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.deductions.craftsmenAmount || 0}
                  onChange={(e) => handleChange('deductions', 'craftsmenAmount', parseFloat(e.target.value) || 0)}
                  className={validationErrors?.deductions?.craftsmenAmount ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                  required
                />
                {hasError('deductions', 'craftsmenAmount') && (
                  <p className="mt-1 text-sm text-red-600">
                    {languageData.de.validation.positiveNumber} / {languageData.en.validation.positiveNumber}
                  </p>
                )}
              </div>
              
              <div>
                <Label className="block space-y-1">
                  <span>Bitte laden Sie die Rechnung für die Handwerkerleistungen hoch:</span>
                  <span className="text-sm text-gray-600 block">Please upload the invoice for craftsmen services:</span>
                </Label>
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleChange('deductions', 'craftsmenInvoiceFile', e.target.files[0].name);
                    }
                  }}
                  className="mt-1 block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100"
                  required
                />
                {hasError('deductions', 'craftsmenInvoiceFile') && (
                  <p className="mt-1 text-sm text-red-600">
                    {languageData.de.validation.required} / {languageData.en.validation.required}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Maintenance payments */}
        <div>
          <Label className="block space-y-1">
            <span>Haben Sie Unterhaltszahlungen geleistet?</span>
            <span className="text-sm text-gray-600 block">Did you make maintenance payments?</span>
          </Label>
          <div className="flex space-x-4 mt-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="maintenanceNo"
                name="maintenance"
                checked={formData.deductions.hasMaintenancePayments === false}
                onChange={() => handleChange('deductions', 'hasMaintenancePayments', false)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                required
              />
              <label htmlFor="maintenanceNo" className="ml-2">Nein / No</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="maintenanceYes"
                name="maintenance"
                checked={formData.deductions.hasMaintenancePayments === true}
                onChange={() => handleChange('deductions', 'hasMaintenancePayments', true)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                required
              />
              <label htmlFor="maintenanceYes" className="ml-2">Ja / Yes</label>
            </div>
          </div>
          {hasError('deductions', 'hasMaintenancePayments') && (
            <p className="mt-1 text-sm text-red-600">
              {languageData.de.validation.required} / {languageData.en.validation.required}
            </p>
          )}
          
          {/* Conditional fields for maintenance payments */}
          {formData.deductions.hasMaintenancePayments && (
            <div className="space-y-4 mt-3 ml-6">
              <div>
                <Label className="block space-y-1">
                  <span>Empfänger der Unterhaltszahlungen</span>
                  <span className="text-sm text-gray-600 block">Recipient of maintenance payments</span>
                </Label>
                <input
                  type="text"
                  value={formData.deductions.maintenanceRecipient || ''}
                  onChange={(e) => handleChange('deductions', 'maintenanceRecipient', e.target.value)}
                  className={validationErrors?.deductions?.maintenanceRecipient ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                  required
                />
                {hasError('deductions', 'maintenanceRecipient') && (
                  <p className="mt-1 text-sm text-red-600">
                    {languageData.de.validation.required} / {languageData.en.validation.required}
                  </p>
                )}
              </div>
              
              <div>
                <Label className="block space-y-1">
                  <span>Höhe der Unterhaltszahlungen</span>
                  <span className="text-sm text-gray-600 block">Amount of maintenance payments</span>
                </Label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.deductions.maintenanceAmount || 0}
                  onChange={(e) => handleChange('deductions', 'maintenanceAmount', parseFloat(e.target.value) || 0)}
                  className={validationErrors?.deductions?.maintenanceAmount ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                  required
                />
                {hasError('deductions', 'maintenanceAmount') && (
                  <p className="mt-1 text-sm text-red-600">
                    {languageData.de.validation.positiveNumber} / {languageData.en.validation.positiveNumber}
                  </p>
                )}
              </div>
              
              <div>
                <Label className="block space-y-1">
                  <span>Befindet sich der Empfänger im Ausland?</span>
                  <span className="text-sm text-gray-600 block">Is the recipient abroad?</span>
                </Label>
                <div className="flex space-x-4 mt-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="recipientsAbroadNo"
                      name="recipientsAbroad"
                      checked={formData.deductions.recipientsAbroad === false}
                      onChange={() => handleChange('deductions', 'recipientsAbroad', false)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      required
                    />
                    <label htmlFor="recipientsAbroadNo" className="ml-2">Nein / No</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="recipientsAbroadYes"
                      name="recipientsAbroad"
                      checked={formData.deductions.recipientsAbroad === true}
                      onChange={() => handleChange('deductions', 'recipientsAbroad', true)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      required
                    />
                    <label htmlFor="recipientsAbroadYes" className="ml-2">Ja / Yes</label>
                  </div>
                </div>
                {hasError('deductions', 'recipientsAbroad') && (
                  <p className="mt-1 text-sm text-red-600">
                    {languageData.de.validation.required} / {languageData.en.validation.required}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Special expenses detailed */}
        <div>
          <Label className="block space-y-1">
            <span>Haben Sie detaillierte Sonderausgaben?</span>
            <span className="text-sm text-gray-600 block">Do you have detailed special expenses?</span>
          </Label>
          <div className="flex space-x-4 mt-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="specialExpensesDetailedNo"
                name="specialExpensesDetailed"
                checked={formData.deductions.hasSpecialExpensesDetailed === false}
                onChange={() => handleChange('deductions', 'hasSpecialExpensesDetailed', false)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                required
              />
              <label htmlFor="specialExpensesDetailedNo" className="ml-2">Nein / No</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="specialExpensesDetailedYes"
                name="specialExpensesDetailed"
                checked={formData.deductions.hasSpecialExpensesDetailed === true}
                onChange={() => handleChange('deductions', 'hasSpecialExpensesDetailed', true)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                required
              />
              <label htmlFor="specialExpensesDetailedYes" className="ml-2">Ja / Yes</label>
            </div>
          </div>
          {hasError('deductions', 'hasSpecialExpensesDetailed') && (
            <p className="mt-1 text-sm text-red-600">
              {languageData.de.validation.required} / {languageData.en.validation.required}
            </p>
          )}
          
          {/* Conditional fields for special expenses detailed */}
          {formData.deductions.hasSpecialExpensesDetailed && (
            <div className="space-y-4 mt-3 ml-6">
              <div>
                <Label className="block space-y-1">
                  <span>Art der Sonderausgaben</span>
                  <span className="text-sm text-gray-600 block">Type of special expenses</span>
                </Label>
                <input
                  type="text"
                  value={formData.deductions.specialExpensesType || ''}
                  onChange={(e) => handleChange('deductions', 'specialExpensesType', e.target.value)}
                  className={validationErrors?.deductions?.specialExpensesType ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                  required
                />
                {hasError('deductions', 'specialExpensesType') && (
                  <p className="mt-1 text-sm text-red-600">
                    {languageData.de.validation.required} / {languageData.en.validation.required}
                  </p>
                )}
              </div>
              
              <div>
                <Label className="block space-y-1">
                  <span>Höhe der Sonderausgaben</span>
                  <span className="text-sm text-gray-600 block">Amount of special expenses</span>
                </Label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.deductions.specialExpensesAmount || 0}
                  onChange={(e) => handleChange('deductions', 'specialExpensesAmount', parseFloat(e.target.value) || 0)}
                  className={validationErrors?.deductions?.specialExpensesAmount ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                  required
                />
                {hasError('deductions', 'specialExpensesAmount') && (
                  <p className="mt-1 text-sm text-red-600">
                    {languageData.de.validation.positiveNumber} / {languageData.en.validation.positiveNumber}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Private insurance */}
        <div>
          <Label className="block space-y-1">
            <span>Haben Sie private Versicherungen?</span>
            <span className="text-sm text-gray-600 block">Do you have private insurance?</span>
          </Label>
          <div className="flex space-x-4 mt-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="privateInsuranceNo"
                name="privateInsurance"
                checked={formData.deductions.hasPrivateInsurance === false}
                onChange={() => handleChange('deductions', 'hasPrivateInsurance', false)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                required
              />
              <label htmlFor="privateInsuranceNo" className="ml-2">Nein / No</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="privateInsuranceYes"
                name="privateInsurance"
                checked={formData.deductions.hasPrivateInsurance === true}
                onChange={() => handleChange('deductions', 'hasPrivateInsurance', true)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                required
              />
              <label htmlFor="privateInsuranceYes" className="ml-2">Ja / Yes</label>
            </div>
          </div>
          {hasError('deductions', 'hasPrivateInsurance') && (
            <p className="mt-1 text-sm text-red-600">
              {languageData.de.validation.required} / {languageData.en.validation.required}
            </p>
          )}
          
          {/* Conditional fields for private insurance */}
          {formData.deductions.hasPrivateInsurance && (
            <div className="space-y-4 mt-3 ml-6">
              <div>
                <Label className="block space-y-1">
                  <span>Arten der Versicherungen</span>
                  <span className="text-sm text-gray-600 block">Types of insurance</span>
                </Label>
                <input
                  type="text"
                  value={formData.deductions.insuranceTypes || ''}
                  onChange={(e) => handleChange('deductions', 'insuranceTypes', e.target.value)}
                  className={validationErrors?.deductions?.insuranceTypes ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                  required
                />
                {hasError('deductions', 'insuranceTypes') && (
                  <p className="mt-1 text-sm text-red-600">
                    {languageData.de.validation.required} / {languageData.en.validation.required}
                  </p>
                )}
              </div>
              
              <div>
                <Label className="block space-y-1">
                  <span>Höhe der Versicherungsbeiträge</span>
                  <span className="text-sm text-gray-600 block">Amount of insurance contributions</span>
                </Label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.deductions.insuranceContributions || 0}
                  onChange={(e) => handleChange('deductions', 'insuranceContributions', parseFloat(e.target.value) || 0)}
                  className={validationErrors?.deductions?.insuranceContributions ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                  required
                />
                {hasError('deductions', 'insuranceContributions') && (
                  <p className="mt-1 text-sm text-red-600">
                    {languageData.de.validation.positiveNumber} / {languageData.en.validation.positiveNumber}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </FormSection>
  );
};

export default ExpensesStep; 