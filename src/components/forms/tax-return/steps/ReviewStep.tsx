import React from 'react';
import { TaxFormData } from '../taxTypes';
import { FormSection } from "@/components/ui/form-section";
import languageData from '../i18n/language.json';

interface ReviewStepProps {
  formData: TaxFormData;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ formData }) => {
  // Helper function to format currency values
  const formatCurrency = (value: number | undefined) => {
    if (value === undefined || value === null) return '€0.00';
    return `€${value.toFixed(2)}`;
  };

  // Helper function to format boolean values
  const formatBoolean = (value: boolean | undefined) => {
    if (value === undefined || value === null) return '-';
    return value ? 'Ja / Yes' : 'Nein / No';
  };

  // Helper function to safely render any value
  const safeRender = (value: any): string => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'boolean') return formatBoolean(value);
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value);
      } catch (e) {
        console.error("Error rendering object:", e);
        return "Error rendering value";
      }
    }
    return String(value);
  };

  return (
    <div className="space-y-8">
      {/* Personal Information */}
      <FormSection title="Personal Information / Persönliche Informationen">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium">First Name / Vorname</h3>
            <p>{safeRender(formData.personalInfo.firstName)}</p>
          </div>
          <div>
            <h3 className="font-medium">Last Name / Nachname</h3>
            <p>{safeRender(formData.personalInfo.lastName)}</p>
          </div>
          <div>
            <h3 className="font-medium">Date of Birth / Geburtsdatum</h3>
            <p>{safeRender(formData.personalInfo.dateOfBirth)}</p>
          </div>
          <div>
            <h3 className="font-medium">Tax ID / Steuer-ID</h3>
            <p>{safeRender(formData.personalInfo.taxId)}</p>
          </div>
          <div>
            <h3 className="font-medium">Marital Status / Familienstand</h3>
            <p>{safeRender(formData.personalInfo.maritalStatus)}</p>
          </div>
          <div>
            <h3 className="font-medium">Email / E-Mail</h3>
            <p>{safeRender(formData.personalInfo.email)}</p>
          </div>
          <div>
            <h3 className="font-medium">Phone / Telefon</h3>
            <p>{safeRender(formData.personalInfo.phone)}</p>
          </div>
          <div>
            <h3 className="font-medium">Has Children / Hat Kinder</h3>
            <p>{formatBoolean(formData.personalInfo.hasChildren)}</p>
          </div>
        </div>

        {/* Children Information */}
        {formData.personalInfo.hasChildren && Array.isArray(formData.children) && formData.children.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">Children / Kinder</h3>
            {formData.children.map((child, index) => (
              <div key={index} className="border p-3 rounded-md mb-3">
                <h4 className="font-medium">Child {index + 1}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  <div>
                    <h5 className="text-sm font-medium">First Name / Vorname</h5>
                    <p>{safeRender(child.firstName)}</p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium">Last Name / Nachname</h5>
                    <p>{safeRender(child.lastName)}</p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium">Date of Birth / Geburtsdatum</h5>
                    <p>{safeRender(child.dateOfBirth)}</p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium">Tax ID / Steuer-ID</h5>
                    <p>{safeRender(child.taxId)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </FormSection>

      {/* Employment Information */}
      <FormSection title="Employment Income / Einkünfte aus Anstellung">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Are you employed? / Sind Sie angestellt?</h3>
            <p>{formatBoolean(formData.incomeInfo.isEmployed)}</p>
          </div>

          {formData.incomeInfo.isEmployed && (
            <div className="ml-6 space-y-4">
              <div>
                <h3 className="font-medium">Employer / Arbeitgeber</h3>
                <p>{safeRender(formData.incomeInfo.employer)}</p>
              </div>
              <div>
                <h3 className="font-medium">Gross Annual Salary / Bruttojahresgehalt</h3>
                <p>{formatCurrency(formData.incomeInfo.grossAnnualSalary)}</p>
              </div>
              <div>
                <h3 className="font-medium">Tax Certificate / Lohnsteuerbescheinigung</h3>
                <p>{formatBoolean(formData.incomeInfo.hasTaxCertificate)}</p>
                {formData.incomeInfo.hasTaxCertificate && formData.incomeInfo.taxCertificateFile && (
                  <p className="text-sm text-blue-600">File: {safeRender(formData.incomeInfo.taxCertificateFile)}</p>
                )}
              </div>
              <div>
                <h3 className="font-medium">Travel Subsidy / Fahrtkostenzuschuss</h3>
                <p>{formatBoolean(formData.incomeInfo.hasTravelSubsidy)}</p>
              </div>
            </div>
          )}
        </div>
      </FormSection>

      {/* Business Information */}
      <FormSection title="Self-Employment Income / Einkünfte aus Selbständigkeit">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Do you own a business? / Besitzen Sie ein Unternehmen?</h3>
            <p>{formatBoolean(formData.incomeInfo.isBusinessOwner)}</p>
          </div>

          {formData.incomeInfo.isBusinessOwner && (
            <div className="ml-6 space-y-4">
              <div>
                <h3 className="font-medium">Business Type / Art des Unternehmens</h3>
                <p>{safeRender(formData.incomeInfo.businessType)}</p>
              </div>
              <div>
                <h3 className="font-medium">Business Earnings / Unternehmenseinnahmen</h3>
                <p>{formatCurrency(formData.incomeInfo.businessEarnings)}</p>
              </div>
              <div>
                <h3 className="font-medium">Business Expenses / Unternehmensausgaben</h3>
                <p>{formatCurrency(formData.incomeInfo.businessExpenses)}</p>
              </div>
            </div>
          )}
        </div>
      </FormSection>

      {/* Investments Information */}
      <FormSection title="Stocks & Investments / Aktien & Investitionen">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Income from stocks? / Einkünfte aus Aktien?</h3>
            <p>{formatBoolean(formData.incomeInfo.hasStockIncome)}</p>
          </div>

          {formData.incomeInfo.hasStockIncome && (
            <div className="ml-6 space-y-4">
              <div>
                <h3 className="font-medium">Dividend Earnings / Dividendenerträge</h3>
                <p>{formatCurrency(formData.incomeInfo.dividendEarnings)}</p>
              </div>
              <div>
                <h3 className="font-medium">Bank Certificate / Bankbescheinigung</h3>
                <p>{formatBoolean(formData.incomeInfo.hasBankCertificate)}</p>
                {formData.incomeInfo.hasBankCertificate && formData.incomeInfo.bankCertificateFile && (
                  <p className="text-sm text-blue-600">File: {safeRender(formData.incomeInfo.bankCertificateFile)}</p>
                )}
              </div>
              <div>
                <h3 className="font-medium">Stock Sales / Aktienverkäufe</h3>
                <p>{formatBoolean(formData.incomeInfo.hasStockSales)}</p>
                {formData.incomeInfo.hasStockSales && formData.incomeInfo.stockSalesCertificateFile && (
                  <p className="text-sm text-blue-600">File: {safeRender(formData.incomeInfo.stockSalesCertificateFile)}</p>
                )}
                {!formData.incomeInfo.hasStockSales && (
                  <div>
                    <h3 className="font-medium">Profit/Loss per Stock / Gewinn/Verlust pro Aktie</h3>
                    <p>{formatCurrency(formData.incomeInfo.stockProfitLoss)}</p>
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-medium">Foreign Stocks / Ausländische Aktien</h3>
                <p>{formatBoolean(formData.incomeInfo.hasForeignStocks)}</p>
                {formData.incomeInfo.hasForeignStocks && (
                  <div className="ml-6 space-y-2">
                    <div>
                      <h3 className="font-medium">Foreign Tax Paid / Gezahlte ausländische Steuer</h3>
                      <p>{formatCurrency(formData.incomeInfo.foreignTaxPaid)}</p>
                    </div>
                    {formData.incomeInfo.foreignTaxCertificateFile && (
                      <p className="text-sm text-blue-600">File: {safeRender(formData.incomeInfo.foreignTaxCertificateFile)}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </FormSection>

      {/* Rental Information */}
      <FormSection title="Rental Income / Mieteinnahmen">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Rental Property / Vermietete Immobilie</h3>
            <p>{formatBoolean(formData.incomeInfo.hasRentalProperty)}</p>
          </div>

          {formData.incomeInfo.hasRentalProperty && (
            <div className="ml-6 space-y-4">
              <div>
                <h3 className="font-medium">Rental Income / Mieteinnahmen</h3>
                <p>{formatCurrency(formData.incomeInfo.rentalIncome)}</p>
              </div>
              <div>
                <h3 className="font-medium">Rental Costs / Mietkosten</h3>
                <p>{formatCurrency(formData.incomeInfo.rentalCosts)}</p>
              </div>
            </div>
          )}
        </div>
      </FormSection>

      {/* Foreign Income Information */}
      <FormSection title="Other Income / Sonstige Einkünfte">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Foreign Income / Ausländische Einkünfte</h3>
            <p>{formatBoolean(formData.incomeInfo.hasForeignIncome)}</p>
          </div>

          {formData.incomeInfo.hasForeignIncome && (
            <div className="ml-6 space-y-4">
              <div>
                <h3 className="font-medium">Country / Land</h3>
                <p>{safeRender(formData.incomeInfo.foreignIncomeCountry)}</p>
              </div>
              <div>
                <h3 className="font-medium">Income Type / Einkommensart</h3>
                <p>{safeRender(formData.incomeInfo.foreignIncomeType)}</p>
              </div>
              <div>
                <h3 className="font-medium">Income Amount / Einkommensbetrag</h3>
                <p>{formatCurrency(formData.incomeInfo.foreignIncomeAmount)}</p>
              </div>
            </div>
          )}
        </div>
      </FormSection>

      {/* Expenses Information */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold border-b pb-2">
          {languageData.de.deductions.title} / {languageData.en.deductions.title}
        </h3>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-medium">{languageData.de.deductions.workRelatedExpenses} / {languageData.en.deductions.workRelatedExpenses}</p>
            <p>{formatCurrency(formData.deductions.workRelatedExpenses)}</p>
          </div>
          <div>
            <p className="font-medium">{languageData.de.deductions.specialExpenses} / {languageData.en.deductions.specialExpenses}</p>
            <p>{formatCurrency(formData.deductions.specialExpenses)}</p>
          </div>
          <div>
            <p className="font-medium">{languageData.de.deductions.extraordinaryExpenses} / {languageData.en.deductions.extraordinaryExpenses}</p>
            <p>{formatCurrency(formData.deductions.extraordinaryExpenses)}</p>
          </div>
          <div>
            <p className="font-medium">{languageData.de.deductions.insurancePremiums} / {languageData.en.deductions.insurancePremiums}</p>
            <p>{formatCurrency(formData.deductions.insurancePremiums)}</p>
          </div>
          
          {formData.deductions.hasCraftsmenPayments && (
            <>
              <div>
                <p className="font-medium">{languageData.de.deductions.hasCraftsmenServices} / {languageData.en.deductions.hasCraftsmenServices}</p>
                <p>Ja / Yes</p>
              </div>
              <div>
                <p className="font-medium">Craftsmen Amount</p>
                <p>{formatCurrency(formData.deductions.craftsmenAmount)}</p>
              </div>
            </>
          )}
          
          {formData.deductions.hasMaintenancePayments && (
            <>
              <div>
                <p className="font-medium">{languageData.de.deductions.hasMaintenancePayments} / {languageData.en.deductions.hasMaintenancePayments}</p>
                <p>Ja / Yes</p>
              </div>
              <div>
                <p className="font-medium">{languageData.de.deductions.maintenanceRecipient} / {languageData.en.deductions.maintenanceRecipient}</p>
                <p>{safeRender(formData.deductions.maintenanceRecipient)}</p>
              </div>
              <div>
                <p className="font-medium">{languageData.de.deductions.maintenanceAmount} / {languageData.en.deductions.maintenanceAmount}</p>
                <p>{formatCurrency(formData.deductions.maintenanceAmount)}</p>
              </div>
              <div>
                <p className="font-medium">{languageData.de.deductions.recipientsAbroad} / {languageData.en.deductions.recipientsAbroad}</p>
                <p>{formatBoolean(formData.deductions.recipientsAbroad)}</p>
              </div>
            </>
          )}
          
          {formData.deductions.hasSpecialExpensesDetailed && (
            <>
              <div>
                <p className="font-medium">{languageData.de.deductions.specialExpensesType} / {languageData.en.deductions.specialExpensesType}</p>
                <p>{safeRender(formData.deductions.specialExpensesType)}</p>
              </div>
              <div>
                <p className="font-medium">{languageData.de.deductions.specialExpensesAmount} / {languageData.en.deductions.specialExpensesAmount}</p>
                <p>{formatCurrency(formData.deductions.specialExpensesAmount)}</p>
              </div>
            </>
          )}
          
          {formData.deductions.hasPrivateInsurance && (
            <>
              <div>
                <p className="font-medium">{languageData.de.deductions.insuranceTypes} / {languageData.en.deductions.insuranceTypes}</p>
                <p>{safeRender(formData.deductions.insuranceTypes)}</p>
              </div>
              <div>
                <p className="font-medium">{languageData.de.deductions.insuranceContributions} / {languageData.en.deductions.insuranceContributions}</p>
                <p>{formatCurrency(formData.deductions.insuranceContributions)}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tax Credits */}
      <FormSection title="Tax Credits / Steuergutschriften">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium">Children Allowance / Kinderfreibetrag</h3>
            <p>{formatCurrency(formData.taxCredits.childrenAllowance)}</p>
          </div>
          <div>
            <h3 className="font-medium">Home Office Deduction / Homeoffice-Pauschale</h3>
            <p>{formatCurrency(formData.taxCredits.homeOfficeDeduction)}</p>
          </div>
          <div>
            <h3 className="font-medium">Donations / Spenden</h3>
            <p>{formatCurrency(formData.taxCredits.donationsCharity)}</p>
          </div>
        </div>
      </FormSection>
    </div>
  );
};

export default ReviewStep; 