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

  const InfoField: React.FC<{ label: string; value: any }> = ({ label, value }) => (
    <div className="p-3 bg-gray-50 rounded-md">
      <h3 className="text-sm font-medium text-gray-700">{label}</h3>
      <p className="mt-1 text-sm text-gray-900">{safeRender(value)}</p>
    </div>
  );

  const ChildrenSection: React.FC<{ children: any[] }> = ({ children }) => (
  <div className="mt-4 space-y-4">
    <h3 className="font-medium">Children / Kinder</h3>
    <div className="grid grid-cols-1 gap-4">
      {children.map((child, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded-md">
          <h4 className="font-medium mb-2">Child {index + 1}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoField 
              label="First Name / Vorname" 
              value={child.firstName} 
            />
            <InfoField 
              label="Last Name / Nachname" 
              value={child.lastName} 
            />
            <InfoField 
              label="Date of Birth / Geburtsdatum" 
              value={child.dateOfBirth} 
            />
            <InfoField 
              label="Tax ID / Steuer-ID" 
              value={child.taxId} 
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

  return (
    <div className="space-y-8">
      {/* Personal Information */}
      <FormSection title="Personal Information / Persönliche Informationen">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField 
            label="First Name / Vorname" 
            value={formData.personalInfo.firstName} 
          />
          <InfoField 
            label="Last Name / Nachname" 
            value={formData.personalInfo.lastName} 
          />
          <InfoField 
            label="Date of Birth / Geburtsdatum" 
            value={formData.personalInfo.dateOfBirth} 
          />
          <InfoField 
            label="Tax ID / Steuer-ID" 
            value={formData.personalInfo.taxId} 
          />
          <InfoField 
            label="Marital Status / Familienstand" 
            value={formData.personalInfo.maritalStatus} 
          />
          <InfoField 
            label="Email / E-Mail" 
            value={formData.personalInfo.email} 
          />
          <InfoField 
            label="Phone / Telefon" 
            value={formData.personalInfo.phone} 
          />
          <InfoField 
            label="Has Children / Hat Kinder" 
            value={formatBoolean(formData.personalInfo.hasChildren)} 
          />
        </div>

        {/* Children Information - if applicable */}
        {formData.personalInfo.hasChildren && (
          <ChildrenSection children={formData.children} />
        )}
      </FormSection>

      {/* Employment Income */}
      <FormSection title="Employment Income / Einkünfte aus Anstellung">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField 
            label="Employed / Angestellt" 
            value={formatBoolean(formData.incomeInfo.isEmployed)} 
          />
          {formData.incomeInfo.isEmployed && (
            <>
              <InfoField 
                label="Employer / Arbeitgeber" 
                value={formData.incomeInfo.employer} 
              />
              <InfoField 
                label="Gross Annual Salary / Bruttojahresgehalt" 
                value={formatCurrency(formData.incomeInfo.grossAnnualSalary)} 
              />
              <InfoField 
                label="Tax Certificate / Lohnsteuerbescheinigung" 
                value={formatBoolean(formData.incomeInfo.hasTaxCertificate)} 
              />
              <InfoField 
                label="Travel Subsidy / Fahrtkostenzuschuss" 
                value={formatBoolean(formData.incomeInfo.hasTravelSubsidy)} 
              />
            </>
          )}
        </div>
      </FormSection>

      {/* Expenses & Deductions */}
      <FormSection title="Expenses & Deductions / Ausgaben & Abzüge">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField 
            label="Commuting Expenses / Wege zwischen Wohnung und Tätigkeitsstätte" 
            value={formatCurrency(formData.deductions.commutingExpenses)} 
          />
          <InfoField 
            label="Business Trips & Training / Dienstreisen und Fortbildungskosten" 
            value={formatCurrency(formData.deductions.businessTripsCosts)} 
          />
          <InfoField 
            label="Work Equipment / Arbeitsmittel" 
            value={formatCurrency(formData.deductions.workEquipment)} 
          />
          <InfoField 
            label="Home Office Allowance / Homeoffice-Pauschale" 
            value={formatCurrency(formData.deductions.homeOfficeAllowance)} 
          />
          <InfoField 
            label="Membership Fees & Insurance / Mitgliedsbeiträge & Versicherungen" 
            value={formatCurrency(formData.deductions.membershipFees)} 
          />
          <InfoField 
            label="Application Costs / Bewerbungskosten" 
            value={formatCurrency(formData.deductions.applicationCosts)} 
          />
          <InfoField 
            label="Double Household / Doppelte Haushaltsführung" 
            value={formatCurrency(formData.deductions.doubleHouseholdCosts)} 
          />
          <InfoField 
            label="Special Expenses / Sonderausgaben" 
            value={formatCurrency(formData.deductions.specialExpenses)} 
          />
          <InfoField 
            label="Insurance Premiums / Versicherungsbeiträge" 
            value={formatCurrency(formData.deductions.insurancePremiums)} 
          />
        </div>
      </FormSection>

      {/* Special Expenses */}
      <FormSection title="Special Expenses / Sonderausgaben">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField 
            label="Church Tax / Kirchensteuer" 
            value={formatCurrency(formData.deductions.churchTax)} 
          />
          <InfoField 
            label="Donations and Membership Fees / Spenden und Mitgliedsbeiträge" 
            value={formatCurrency(formData.deductions.donationsAndFees)} 
          />
          <InfoField 
            label="Childcare Costs / Kinderbetreuungskosten" 
            value={formatCurrency(formData.deductions.childcareCosts)} 
          />
          <InfoField 
            label="Support Payments / Unterhaltsleistungen" 
            value={formatCurrency(formData.deductions.supportPayments)} 
          />
          <InfoField 
            label="Private School Fees / Schulgeld für Privatschulen" 
            value={formatCurrency(formData.deductions.privateSchoolFees)} 
          />
          <InfoField 
            label="Retirement Provisions / Altersvorsorgeaufwendungen" 
            value={formatCurrency(formData.deductions.retirementProvisions)} 
          />
          <InfoField 
            label="Other Insurance Expenses / Sonstige Vorsorgeaufwendungen" 
            value={formatCurrency(formData.deductions.otherInsuranceExpenses)} 
          />
          <InfoField 
            label="Professional Training Costs / Berufsausbildungskosten" 
            value={formatCurrency(formData.deductions.professionalTrainingCosts)} 
          />
        </div>
      </FormSection>

      {/* Extraordinary Expenses */}
      <FormSection title="Extraordinary Expenses / Außergewöhnliche Belastungen">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField 
            label="Medical Expenses / Krankheitskosten" 
            value={formatCurrency(formData.deductions.medicalExpenses)} 
          />
          <InfoField 
            label="Rehabilitation Costs / Kur- und Rehabilitationskosten" 
            value={formatCurrency(formData.deductions.rehabilitationCosts)} 
          />
          <InfoField 
            label="Care Costs / Pflegekosten" 
            value={formatCurrency(formData.deductions.careCosts)} 
          />
          <InfoField 
            label="Disability Expenses / Behinderungsbedingte Aufwendungen" 
            value={formatCurrency(formData.deductions.disabilityExpenses)} 
          />
          <InfoField 
            label="Funeral Costs / Bestattungskosten" 
            value={formatCurrency(formData.deductions.funeralCosts)} 
          />
          <InfoField 
            label="Support for Relatives / Unterstützung Angehöriger" 
            value={formatCurrency(formData.deductions.relativesSupportCosts)} 
          />
          <InfoField 
            label="Divorce Costs / Scheidungskosten" 
            value={formatCurrency(formData.deductions.divorceCosts)} 
          />
        </div>
      </FormSection>

      {/* Insurance Premiums */}
      <FormSection title="Insurance Premiums / Versicherungsbeiträge">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField 
            label="Statutory Health Insurance / Gesetzliche Krankenversicherung" 
            value={formatCurrency(formData.deductions.statutoryHealthInsurance)} 
          />
          <InfoField 
            label="Private Health Insurance / Private Krankenversicherung" 
            value={formatCurrency(formData.deductions.privateHealthInsurance)} 
          />
          <InfoField 
            label="Statutory Pension Insurance / Gesetzliche Rentenversicherung" 
            value={formatCurrency(formData.deductions.statutoryPensionInsurance)} 
          />
          <InfoField 
            label="Private Pension Insurance / Private Rentenversicherung" 
            value={formatCurrency(formData.deductions.privatePensionInsurance)} 
          />
          <InfoField 
            label="Unemployment Insurance / Arbeitslosenversicherung" 
            value={formatCurrency(formData.deductions.unemploymentInsurance)} 
          />
          <InfoField 
            label="Accident and Liability Insurance / Unfall- und Haftpflichtversicherung" 
            value={formatCurrency(formData.deductions.accidentLiabilityInsurance)} 
          />
          <InfoField 
            label="Disability Insurance / Berufsunfähigkeitsversicherung" 
            value={formatCurrency(formData.deductions.disabilityInsurance)} 
          />
          <InfoField 
            label="Term Life Insurance / Risikolebensversicherung" 
            value={formatCurrency(formData.deductions.termLifeInsurance)} 
          />
        </div>
      </FormSection>

      {/* Household Services */}
      <FormSection title="Household Services / Haushaltsnahe Dienstleistungen">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField 
            label="Household Services / Haushaltsnahe Dienstleistungen" 
            value={formatCurrency(formData.deductions.householdServices)} 
          />
          <InfoField 
            label="Craftsmen Services / Handwerkerleistungen" 
            value={formatCurrency(formData.deductions.craftsmenServices)} 
          />
          <InfoField 
            label="Gardening Services / Gartenpflege und Winterdienst" 
            value={formatCurrency(formData.deductions.gardeningServices)} 
          />
          <InfoField 
            label="Cleaning Services / Reinigung der Wohnung und Fenster" 
            value={formatCurrency(formData.deductions.cleaningServices)} 
          />
          <InfoField 
            label="Caretaker Services / Hausmeister- und Hausreinigungsdienste" 
            value={formatCurrency(formData.deductions.caretakerServices)} 
          />
          <InfoField 
            label="Care Costs / Betreuungskosten" 
            value={formatCurrency(formData.deductions.householdCareCosts)} 
          />
          <InfoField 
            label="Support Services / Pflege- und Betreuungsleistungen" 
            value={formatCurrency(formData.deductions.householdSupportServices)} 
          />
          <InfoField 
            label="Chimney Sweep Fees / Schornsteinfegergebühren" 
            value={formatCurrency(formData.deductions.chimneySweepFees)} 
          />
          <InfoField 
            label="Emergency Systems / Notrufsysteme" 
            value={formatCurrency(formData.deductions.emergencySystemCosts)} 
          />
        </div>
      </FormSection>

      {/* Business Income */}
      <FormSection title="Business Income / Geschäftseinkünfte">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField 
            label="Business Owner / Unternehmer" 
            value={formatBoolean(formData.incomeInfo.isBusinessOwner)} 
          />
          {formData.incomeInfo.isBusinessOwner && (
            <>
              <InfoField 
                label="Business Type / Unternehmensart" 
                value={formData.incomeInfo.businessType} 
              />
              <InfoField 
                label="Business Earnings / Einnahmen" 
                value={formatCurrency(formData.incomeInfo.businessEarnings)} 
              />
              <InfoField 
                label="Business Expenses / Ausgaben" 
                value={formatCurrency(formData.incomeInfo.businessExpenses)} 
              />
            </>
          )}
        </div>
      </FormSection>

      {/* Investments */}
      <FormSection title="Investments / Kapitalanlagen">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField 
            label="Stock Income / Aktieneinkünfte" 
            value={formatBoolean(formData.incomeInfo.hasStockIncome)} 
          />
          {formData.incomeInfo.hasStockIncome && (
            <>
              <InfoField 
                label="Dividend Earnings / Dividendenerträge" 
                value={formatCurrency(formData.incomeInfo.dividendEarnings)} 
              />
              <InfoField 
                label="Stock Sales / Aktienverkäufe" 
                value={formatBoolean(formData.incomeInfo.hasStockSales)} 
              />
              {!formData.incomeInfo.hasStockSales && (
                <InfoField 
                  label="Profit/Loss per Stock / Gewinn/Verlust pro Aktie" 
                  value={formatCurrency(formData.incomeInfo.stockProfitLoss)} 
                />
              )}
              <InfoField 
                label="Foreign Stocks / Ausländische Aktien" 
                value={formatBoolean(formData.incomeInfo.hasForeignStocks)} 
              />
              {formData.incomeInfo.hasForeignStocks && (
                <InfoField 
                  label="Foreign Tax Paid / Gezahlte ausländische Steuer" 
                  value={formatCurrency(formData.incomeInfo.foreignTaxPaid)} 
                />
              )}
            </>
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