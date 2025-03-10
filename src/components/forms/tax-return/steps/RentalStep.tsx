import React from 'react';
import { Label } from '@/components/ui/label';
import { FormSection } from "@/components/ui/form-section";
import { TaxFormData } from '../taxTypes';
import languageData from '../i18n/language.json';

interface RentalStepProps {
  formData: TaxFormData;
  handleChange: (section: keyof TaxFormData, field: string, value: any) => void;
  validationErrors: Record<string, any> | null;
  hasError: (section: string, field: string) => boolean;
}

const RentalStep: React.FC<RentalStepProps> = ({
  formData,
  handleChange,
  validationErrors,
  hasError
}) => {
  return (
    <FormSection title={`${languageData.de.steps.rental} / ${languageData.en.steps.rental}`}>
      <div className="space-y-6">
        {/* Rental property status */}
        <div>
          <Label className="block space-y-1">
            <span>Vermieten Sie eine Immobilie oder einen Teil einer Immobilie?</span>
            <span className="text-sm text-gray-600 block">Do you rent out a property or part of a property?</span>
          </Label>
          <div className="flex space-x-4 mt-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="rentalPropertyNo"
                name="rentalProperty"
                checked={formData.incomeInfo.hasRentalProperty === false}
                onChange={() => handleChange('incomeInfo', 'hasRentalProperty', false)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                required
              />
              <label htmlFor="rentalPropertyNo" className="ml-2">Nein / No</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="rentalPropertyYes"
                name="rentalProperty"
                checked={formData.incomeInfo.hasRentalProperty === true}
                onChange={() => handleChange('incomeInfo', 'hasRentalProperty', true)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                required
              />
              <label htmlFor="rentalPropertyYes" className="ml-2">Ja / Yes</label>
            </div>
          </div>
          {hasError('incomeInfo', 'hasRentalProperty') && (
            <p className="mt-1 text-sm text-red-600">
              {languageData.de.validation.required} / {languageData.en.validation.required}
            </p>
          )}
        </div>
        
        {/* Conditional fields when has rental property */}
        {formData.incomeInfo.hasRentalProperty && (
          <div className="space-y-4 ml-6">
            {/* Rental income */}
            <div>
              <Label className="block space-y-1">
                <span>Wenn ja, wie hoch waren Ihre Mieteinnahmen im letzten Jahr?</span>
                <span className="text-sm text-gray-600 block">If yes, what was your rental income last year?</span>
              </Label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.incomeInfo.rentalIncome || 0}
                onChange={(e) => handleChange('incomeInfo', 'rentalIncome', parseFloat(e.target.value) || 0)}
                className={validationErrors?.incomeInfo?.rentalIncome ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                required
              />
              {hasError('incomeInfo', 'rentalIncome') && (
                <p className="mt-1 text-sm text-red-600">
                  {languageData.de.validation.positiveNumber} / {languageData.en.validation.positiveNumber}
                </p>
              )}
            </div>
            
            {/* Rental costs */}
            <div>
              <Label className="block space-y-1">
                <span>Welche Kosten sind Ihnen für die Vermietung entstanden (z.B. Reparaturen, Versicherungen)?</span>
                <span className="text-sm text-gray-600 block">What costs did you incur for the rental (e.g., repairs, insurance)?</span>
              </Label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.incomeInfo.rentalCosts || 0}
                onChange={(e) => handleChange('incomeInfo', 'rentalCosts', parseFloat(e.target.value) || 0)}
                className={validationErrors?.incomeInfo?.rentalCosts ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                required
              />
              {hasError('incomeInfo', 'rentalCosts') && (
                <p className="mt-1 text-sm text-red-600">
                  {languageData.de.validation.positiveNumber} / {languageData.en.validation.positiveNumber}
                </p>
              )}
            </div>
            
            {/* Property address */}
            <div>
              <Label className="block space-y-1">
                <span>Adresse der vermieteten Immobilie</span>
                <span className="text-sm text-gray-600 block">Address of the rented property</span>
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <Label className="block mb-1 text-sm">Straße / Street</Label>
                  <input
                    type="text"
                    value={formData.incomeInfo.rentalPropertyAddress?.street || ''}
                    onChange={(e) => handleChange('incomeInfo', 'rentalPropertyAddress', {
                      ...formData.incomeInfo.rentalPropertyAddress,
                      street: e.target.value
                    })}
                    className={validationErrors?.incomeInfo?.rentalPropertyAddress?.street ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                    required
                  />
                  {hasError('incomeInfo', 'rentalPropertyAddress.street') && (
                    <p className="mt-1 text-sm text-red-600">
                      {languageData.de.validation.required} / {languageData.en.validation.required}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="block mb-1 text-sm">Hausnummer / House number</Label>
                  <input
                    type="text"
                    value={formData.incomeInfo.rentalPropertyAddress?.houseNumber || ''}
                    onChange={(e) => handleChange('incomeInfo', 'rentalPropertyAddress', {
                      ...formData.incomeInfo.rentalPropertyAddress,
                      houseNumber: e.target.value
                    })}
                    className={validationErrors?.incomeInfo?.rentalPropertyAddress?.houseNumber ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                    required
                  />
                  {hasError('incomeInfo', 'rentalPropertyAddress.houseNumber') && (
                    <p className="mt-1 text-sm text-red-600">
                      {languageData.de.validation.required} / {languageData.en.validation.required}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="block mb-1 text-sm">PLZ / Postal code</Label>
                  <input
                    type="text"
                    value={formData.incomeInfo.rentalPropertyAddress?.postalCode || ''}
                    onChange={(e) => handleChange('incomeInfo', 'rentalPropertyAddress', {
                      ...formData.incomeInfo.rentalPropertyAddress,
                      postalCode: e.target.value
                    })}
                    className={validationErrors?.incomeInfo?.rentalPropertyAddress?.postalCode ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                    required
                  />
                  {hasError('incomeInfo', 'rentalPropertyAddress.postalCode') && (
                    <p className="mt-1 text-sm text-red-600">
                      {languageData.de.validation.required} / {languageData.en.validation.required}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="block mb-1 text-sm">Stadt / City</Label>
                  <input
                    type="text"
                    value={formData.incomeInfo.rentalPropertyAddress?.city || ''}
                    onChange={(e) => handleChange('incomeInfo', 'rentalPropertyAddress', {
                      ...formData.incomeInfo.rentalPropertyAddress,
                      city: e.target.value
                    })}
                    className={validationErrors?.incomeInfo?.rentalPropertyAddress?.city ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                    required
                  />
                  {hasError('incomeInfo', 'rentalPropertyAddress.city') && (
                    <p className="mt-1 text-sm text-red-600">
                      {languageData.de.validation.required} / {languageData.en.validation.required}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </FormSection>
  );
};

export default RentalStep; 