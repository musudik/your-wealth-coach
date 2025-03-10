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
    
      <div className="space-y-6">
        <FormSection title={`${languageData.de.deductions.workRelatedExpenses} / ${languageData.en.deductions.workRelatedExpenses}`}>
        {/* Work-related expenses */}
        <div className="space-y-4">
          
          {/* Commuting expenses */}
          <div>
            <Label className="block space-y-1">
              <span>Wege zwischen Wohnung und erster Tätigkeitsstätte</span>
              <span className="text-sm text-gray-600 block">Commuting expenses</span>
            </Label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.deductions.commutingExpenses || 0}
              onChange={(e) => handleChange('deductions', 'commutingExpenses', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.commutingExpenses ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
            {hasError('deductions', 'commutingExpenses') && (
              <p className="mt-1 text-sm text-red-600">
                {languageData.de.validation.positiveNumber} / {languageData.en.validation.positiveNumber}
              </p>
            )}
          </div>

          {/* Business trips and training costs */}
          <div>
            <Label className="block space-y-1">
              <span>Dienstreisen und Fortbildungskosten</span>
              <span className="text-sm text-gray-600 block">Business trips and training costs</span>
            </Label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.deductions.businessTripsCosts || 0}
              onChange={(e) => handleChange('deductions', 'businessTripsCosts', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.businessTripsCosts ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
          </div>

          {/* Work equipment */}
          <div>
            <Label className="block space-y-1">
              <span>Arbeitsmittel</span>
              <span className="text-sm text-gray-600 block">Work equipment</span>
            </Label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.deductions.workEquipment || 0}
              onChange={(e) => handleChange('deductions', 'workEquipment', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.workEquipment ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
          </div>

          {/* Home office allowance */}
          <div>
            <Label className="block space-y-1">
              <span>Homeoffice-Pauschale</span>
              <span className="text-sm text-gray-600 block">Home office allowance</span>
            </Label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.deductions.homeOfficeAllowance || 0}
              onChange={(e) => handleChange('deductions', 'homeOfficeAllowance', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.homeOfficeAllowance ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
          </div>

          {/* Membership fees and insurance */}
          <div>
            <Label className="block space-y-1">
              <span>Mitgliedsbeiträge & Versicherungen</span>
              <span className="text-sm text-gray-600 block">Membership fees & insurance</span>
            </Label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.deductions.membershipFees || 0}
              onChange={(e) => handleChange('deductions', 'membershipFees', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.membershipFees ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
          </div>

          {/* Application costs */}
          <div>
            <Label className="block space-y-1">
              <span>Bewerbungskosten</span>
              <span className="text-sm text-gray-600 block">Application costs</span>
            </Label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.deductions.applicationCosts || 0}
              onChange={(e) => handleChange('deductions', 'applicationCosts', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.applicationCosts ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
          </div>

          {/* Double household management */}
          <div>
            <Label className="block space-y-1">
              <span>Doppelte Haushaltsführung</span>
              <span className="text-sm text-gray-600 block">Double household management</span>
            </Label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.deductions.doubleHouseholdCosts || 0}
              onChange={(e) => handleChange('deductions', 'doubleHouseholdCosts', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.doubleHouseholdCosts ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
          </div>
        </div>
      </FormSection>      
            
      <FormSection title={`${languageData.de.deductions.specialExpenses} / ${languageData.en.deductions.specialExpenses}`}>   
        {/* Special expenses */}
        <div className="space-y-4">

          {/* Church Tax */}
          <div>
            <Label className="block space-y-1">
              <span>Kirchensteuer</span>
              <span className="text-sm text-gray-600 block">Church tax</span>
            </Label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.deductions.churchTax || 0}
              onChange={(e) => handleChange('deductions', 'churchTax', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.churchTax ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
          </div>

          {/* Donations and Membership Fees */}
          <div>
            <Label className="block space-y-1">
              <span>Spenden und Mitgliedsbeiträge</span>
              <span className="text-sm text-gray-600 block">Donations and membership fees</span>
            </Label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.deductions.donationsAndFees || 0}
              onChange={(e) => handleChange('deductions', 'donationsAndFees', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.donationsAndFees ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
          </div>

          {/* Childcare Costs */}
          <div>
            <Label className="block space-y-1">
              <span>Kinderbetreuungskosten</span>
              <span className="text-sm text-gray-600 block">Childcare costs</span>
            </Label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.deductions.childcareCosts || 0}
              onChange={(e) => handleChange('deductions', 'childcareCosts', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.childcareCosts ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
          </div>

          {/* Support Payments */}
          <div>
            <Label className="block space-y-1">
              <span>Unterhaltsleistungen an bedürftige Personen</span>
              <span className="text-sm text-gray-600 block">Support payments to needy persons</span>
            </Label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.deductions.supportPayments || 0}
              onChange={(e) => handleChange('deductions', 'supportPayments', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.supportPayments ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
          </div>

          {/* Private School Fees */}
          <div>
            <Label className="block space-y-1">
              <span>Schulgeld für Privatschulen</span>
              <span className="text-sm text-gray-600 block">Private school fees</span>
            </Label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.deductions.privateSchoolFees || 0}
              onChange={(e) => handleChange('deductions', 'privateSchoolFees', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.privateSchoolFees ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
          </div>

          {/* Retirement Provisions */}
          <div>
            <Label className="block space-y-1">
              <span>Altersvorsorgeaufwendungen</span>
              <span className="text-sm text-gray-600 block">Retirement provisions</span>
            </Label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.deductions.retirementProvisions || 0}
              onChange={(e) => handleChange('deductions', 'retirementProvisions', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.retirementProvisions ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
          </div>

          {/* Other Insurance Expenses */}
          <div>
            <Label className="block space-y-1">
              <span>Sonstige Vorsorgeaufwendungen</span>
              <span className="text-sm text-gray-600 block">Other insurance expenses</span>
            </Label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.deductions.otherInsuranceExpenses || 0}
              onChange={(e) => handleChange('deductions', 'otherInsuranceExpenses', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.otherInsuranceExpenses ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
          </div>

          {/* Professional Training Costs */}
          <div>
            <Label className="block space-y-1">
              <span>Berufsausbildungskosten</span>
              <span className="text-sm text-gray-600 block">Professional training costs</span>
            </Label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.deductions.professionalTrainingCosts || 0}
              onChange={(e) => handleChange('deductions', 'professionalTrainingCosts', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.professionalTrainingCosts ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
          </div>
        </div>
        </FormSection>      
            
        <FormSection title={`${languageData.de.deductions.extraordinaryExpenses} / ${languageData.en.deductions.extraordinaryExpenses}`}>     
        {/* Extraordinary expenses */}
        <div className="space-y-4">

          {/* Medical Expenses */}
          <div>
            <Label className="block space-y-1">
              <span>Krankheitskosten</span>
              <span className="text-sm text-gray-600 block">Medical expenses</span>
            </Label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.deductions.medicalExpenses || 0}
              onChange={(e) => handleChange('deductions', 'medicalExpenses', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.medicalExpenses ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
          </div>

          {/* Cure and Rehabilitation Costs */}
          <div>
            <Label className="block space-y-1">
              <span>Kur- und Rehabilitationskosten</span>
              <span className="text-sm text-gray-600 block">Cure and rehabilitation costs</span>
            </Label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.deductions.rehabilitationCosts || 0}
              onChange={(e) => handleChange('deductions', 'rehabilitationCosts', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.rehabilitationCosts ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
          </div>

          {/* Care Costs */}
          <div>
            <Label className="block space-y-1">
              <span>Pflegekosten</span>
              <span className="text-sm text-gray-600 block">Care costs</span>
            </Label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.deductions.careCosts || 0}
              onChange={(e) => handleChange('deductions', 'careCosts', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.careCosts ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
          </div>

          {/* Disability-related Expenses */}
          <div>
            <Label className="block space-y-1">
              <span>Behinderungsbedingte Aufwendungen</span>
              <span className="text-sm text-gray-600 block">Disability-related expenses</span>
            </Label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.deductions.disabilityExpenses || 0}
              onChange={(e) => handleChange('deductions', 'disabilityExpenses', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.disabilityExpenses ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
          </div>

          {/* Funeral Costs */}
          <div>
            <Label className="block space-y-1">
              <span>Bestattungskosten</span>
              <span className="text-sm text-gray-600 block">Funeral costs</span>
            </Label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.deductions.funeralCosts || 0}
              onChange={(e) => handleChange('deductions', 'funeralCosts', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.funeralCosts ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
          </div>

          {/* Support Costs for Needy Relatives */}
          <div>
            <Label className="block space-y-1">
              <span>Kosten für Unterstützung bedürftiger Angehöriger</span>
              <span className="text-sm text-gray-600 block">Support costs for needy relatives</span>
            </Label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.deductions.relativesSupportCosts || 0}
              onChange={(e) => handleChange('deductions', 'relativesSupportCosts', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.relativesSupportCosts ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
          </div>

          {/* Divorce Costs */}
          <div>
            <Label className="block space-y-1">
              <span>Scheidungskosten</span>
              <span className="text-sm text-gray-600 block">Divorce costs (exceptional cases only)</span>
            </Label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.deductions.divorceCosts || 0}
              onChange={(e) => handleChange('deductions', 'divorceCosts', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.divorceCosts ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
          </div>
        </div>
        </FormSection>      
            
        <FormSection title={`${languageData.de.deductions.insurancePremiums} / ${languageData.en.deductions.insurancePremiums}`}>   
        {/* Insurance premiums */}
        <div className="space-y-4">

          {/* Statutory Health and Long-term Care Insurance */}
          <div>
            <Label className="block space-y-1">
              <span>Gesetzliche Kranken- und Pflegeversicherungsbeiträge</span>
              <span className="text-sm text-gray-600 block">Statutory health and long-term care insurance</span>
            </Label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.deductions.statutoryHealthInsurance || 0}
              onChange={(e) => handleChange('deductions', 'statutoryHealthInsurance', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.statutoryHealthInsurance ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
          </div>

          {/* Private Health and Long-term Care Insurance */}
          <div>
            <Label className="block space-y-1">
              <span>Private Kranken- und Pflegeversicherungsbeiträge</span>
              <span className="text-sm text-gray-600 block">Private health and long-term care insurance</span>
            </Label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.deductions.privateHealthInsurance || 0}
              onChange={(e) => handleChange('deductions', 'privateHealthInsurance', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.privateHealthInsurance ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
          </div>

          {/* Statutory Pension Insurance */}
          <div>
            <Label className="block space-y-1">
              <span>Beiträge zur gesetzlichen Rentenversicherung</span>
              <span className="text-sm text-gray-600 block">Statutory pension insurance contributions</span>
            </Label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.deductions.statutoryPensionInsurance || 0}
              onChange={(e) => handleChange('deductions', 'statutoryPensionInsurance', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.statutoryPensionInsurance ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
          </div>

          {/* Private Pension Insurance (Rürup) */}
          <div>
            <Label className="block space-y-1">
              <span>Beiträge zu privaten Altersvorsorgeverträgen (Rürup-Rente)</span>
              <span className="text-sm text-gray-600 block">Private pension insurance contributions (Rürup pension)</span>
            </Label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.deductions.privatePensionInsurance || 0}
              onChange={(e) => handleChange('deductions', 'privatePensionInsurance', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.privatePensionInsurance ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
          </div>

          {/* Unemployment Insurance */}
          <div>
            <Label className="block space-y-1">
              <span>Beiträge zur Arbeitslosenversicherung</span>
              <span className="text-sm text-gray-600 block">Unemployment insurance contributions</span>
            </Label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.deductions.unemploymentInsurance || 0}
              onChange={(e) => handleChange('deductions', 'unemploymentInsurance', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.unemploymentInsurance ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
          </div>

          {/* Accident and Liability Insurance */}
          <div>
            <Label className="block space-y-1">
              <span>Beiträge zu Unfall- und Haftpflichtversicherungen</span>
              <span className="text-sm text-gray-600 block">Accident and liability insurance contributions</span>
            </Label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.deductions.accidentLiabilityInsurance || 0}
              onChange={(e) => handleChange('deductions', 'accidentLiabilityInsurance', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.accidentLiabilityInsurance ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
          </div>

          {/* Disability Insurance */}
          <div>
            <Label className="block space-y-1">
              <span>Beiträge zu Berufsunfähigkeitsversicherungen</span>
              <span className="text-sm text-gray-600 block">Disability insurance contributions</span>
            </Label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.deductions.disabilityInsurance || 0}
              onChange={(e) => handleChange('deductions', 'disabilityInsurance', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.disabilityInsurance ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
          </div>

          {/* Term Life Insurance */}
          <div>
            <Label className="block space-y-1">
              <span>Beiträge zu Risikolebensversicherungen</span>
              <span className="text-sm text-gray-600 block">Term life insurance contributions</span>
            </Label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.deductions.termLifeInsurance || 0}
              onChange={(e) => handleChange('deductions', 'termLifeInsurance', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.termLifeInsurance ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
          </div>
        </div>
        </FormSection>      

        <FormSection title={`${languageData.de.deductions.hasCraftsmenServices} / ${languageData.en.deductions.hasCraftsmenServices}`}>   
        {/* Craftsmen services */}
        <div>
          <Label className="block space-y-1">
            <span>{languageData.de.deductions.hasCraftsmenServices}</span>
            <span className="text-sm text-gray-600 block">{languageData.en.deductions.hasCraftsmenServices}</span>
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

              {/* Household Services */}
              <div>
                <Label className="block space-y-1">
                  <span>{languageData.de.deductions.householdServices}</span>
                  <span className="text-sm text-gray-600 block">{languageData.en.deductions.householdServices}</span>
                </Label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.deductions.householdServices || 0}
                  onChange={(e) => handleChange('deductions', 'householdServices', parseFloat(e.target.value) || 0)}
                  className={validationErrors?.deductions?.householdServices ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                />
              </div>

              {/* Craftsmen Services */}
              <div>
                <Label className="block space-y-1">
                  <span>{languageData.de.deductions.craftsmenServices}</span>
                  <span className="text-sm text-gray-600 block">{languageData.en.deductions.craftsmenServices}</span>
                </Label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.deductions.craftsmenServices || 0}
                  onChange={(e) => handleChange('deductions', 'craftsmenServices', parseFloat(e.target.value) || 0)}
                  className={validationErrors?.deductions?.craftsmenServices ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                />
              </div>

              {/* Gardening and Winter Services */}
              <div>
                <Label className="block space-y-1">
                  <span>{languageData.de.deductions.gardeningServices}</span>
                  <span className="text-sm text-gray-600 block">{languageData.en.deductions.gardeningServices}</span>
                </Label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.deductions.gardeningServices || 0}
                  onChange={(e) => handleChange('deductions', 'gardeningServices', parseFloat(e.target.value) || 0)}
                  className={validationErrors?.deductions?.gardeningServices ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                />
              </div>

              {/* Cleaning Services */}
              <div>
                <Label className="block space-y-1">
                  <span>{languageData.de.deductions.cleaningServices}</span>
                  <span className="text-sm text-gray-600 block">{languageData.en.deductions.cleaningServices}</span>
                </Label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.deductions.cleaningServices || 0}
                  onChange={(e) => handleChange('deductions', 'cleaningServices', parseFloat(e.target.value) || 0)}
                  className={validationErrors?.deductions?.cleaningServices ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                />
              </div>

              {/* Caretaker Services */}
              <div>
                <Label className="block space-y-1">
                  <span>{languageData.de.deductions.caretakerServices}</span>
                  <span className="text-sm text-gray-600 block">{languageData.en.deductions.caretakerServices}</span>
                </Label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.deductions.caretakerServices || 0}
                  onChange={(e) => handleChange('deductions', 'caretakerServices', parseFloat(e.target.value) || 0)}
                  className={validationErrors?.deductions?.caretakerServices ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                />
              </div>

              {/* Care Costs */}
              <div>
                <Label className="block space-y-1">
                  <span>{languageData.de.deductions.householdCareCosts}</span>
                  <span className="text-sm text-gray-600 block">{languageData.en.deductions.householdCareCosts}</span>
                </Label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.deductions.householdCareCosts || 0}
                  onChange={(e) => handleChange('deductions', 'householdCareCosts', parseFloat(e.target.value) || 0)}
                  className={validationErrors?.deductions?.householdCareCosts ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                />
              </div>

              {/* Care and Support Services */}
              <div>
                <Label className="block space-y-1">
                  <span>{languageData.de.deductions.householdSupportServices}</span>
                  <span className="text-sm text-gray-600 block">{languageData.en.deductions.householdSupportServices}</span>
                </Label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.deductions.householdSupportServices || 0}
                  onChange={(e) => handleChange('deductions', 'householdSupportServices', parseFloat(e.target.value) || 0)}
                  className={validationErrors?.deductions?.householdSupportServices ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                />
              </div>

              {/* Chimney Sweep Fees */}
              <div>
                <Label className="block space-y-1">
                  <span>{languageData.de.deductions.chimneySweepFees}</span>
                  <span className="text-sm text-gray-600 block">{languageData.en.deductions.chimneySweepFees}</span>
                </Label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.deductions.chimneySweepFees || 0}
                  onChange={(e) => handleChange('deductions', 'chimneySweepFees', parseFloat(e.target.value) || 0)}
                  className={validationErrors?.deductions?.chimneySweepFees ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                />
              </div>

              {/* Emergency System Costs */}
              <div>
                <Label className="block space-y-1">
                  <span>{languageData.de.deductions.emergencySystemCosts}</span>
                  <span className="text-sm text-gray-600 block">{languageData.en.deductions.emergencySystemCosts}</span>
                </Label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.deductions.emergencySystemCosts || 0}
                  onChange={(e) => handleChange('deductions', 'emergencySystemCosts', parseFloat(e.target.value) || 0)}
                  className={validationErrors?.deductions?.emergencySystemCosts ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                />
              </div>
            </div>
          )}
        </div>
        </FormSection>

        <FormSection title={`${languageData.de.deductions.documents.title} / ${languageData.en.deductions.documents.title}`}>
          <div className="space-y-4">
            {[
              { key: 'rentalContracts', required: false },
              { key: 'annualStatements', required: false },
              { key: 'operatingCosts', required: false },
              { key: 'propertyTax', required: false },
              { key: 'loanContracts', required: false },
              { key: 'repairBills', required: false },
              { key: 'craftsmenBills', required: false },
              { key: 'renovationProof', required: false },
              { key: 'insurancePremiums', required: false },
              { key: 'brokerFees', required: false },
              { key: 'rentalIncome', required: false },
              { key: 'vacancyProof', required: false },
              { key: 'managementCosts', required: false },
              { key: 'depreciationProof', required: false }
            ].map((doc) => (
              <div key={doc.key}>
                <Label className="block space-y-1">
                  <span>{languageData.de.deductions.documents[doc.key]}</span>
                  <span className="text-sm text-gray-600 block">{languageData.en.deductions.documents[doc.key]}</span>
                </Label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      const fileNames = Array.from(e.target.files).map(file => file.name);
                      handleChange('deductions', `documents_${doc.key}`, fileNames);
                    }
                  }}
                  className="mt-1 block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100"
                  required={doc.required}
                />
                {hasError('deductions', `documents_${doc.key}`) && (
                  <p className="mt-1 text-sm text-red-600">
                    {languageData.de.validation.required} / {languageData.en.validation.required}
                  </p>
                )}
              </div>
            ))}
          </div>
        </FormSection>
      </div>
    
  );
};

export default ExpensesStep; 