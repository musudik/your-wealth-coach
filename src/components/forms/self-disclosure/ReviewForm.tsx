import { Label } from "@/components/ui/label";
import languageData from "@/components/forms/self-disclosure/i18n/language.json";
import { FormData } from "@/types/form";

interface ReviewFormProps {
  formData: FormData;
}

export function ReviewForm({ formData }: ReviewFormProps) {
  // Helper function to render array values
  const renderArrayValues = (arr: string[]) => {
    return arr.filter(value => value).join(", ") || "None";
  };

  const renderChildren = (children: Array<{ id: string; name: string; birthDate: string; placeOfBirth: string }>) => {
    if (!children || children.length === 0) return "None";
    return children.map((child, index) => (
      <div key={child.id} className="ml-4">
        <p className="text-gray-700">
          {index + 1}. {child.name} - {child.birthDate} - {child.placeOfBirth}
        </p>
      </div>
    ));
  };

  // Helper function to display the actual nationality value
  const displayNationality = (applicant: 'applicantA' | 'applicantB') => {
    const nationality = formData.personalInfo[applicant].nationality;
    const actualNationality = formData.personalInfo[applicant].actualNationality;
    
    // If nationality is "other" and we have an actual value, show that instead
    if (nationality === "other" && actualNationality) {
      return actualNationality;
    }
    
    return nationality;
  };

  // Helper function to display the actual occupation value
  const displayOccupation = (applicant: 'applicantA' | 'applicantB') => {
    const occupation = formData.personalInfo[applicant].occupation;
    const actualOccupation = formData.personalInfo[applicant].actualOccupation;
    
    // If occupation is "other" and we have an actual value, show that instead
    if (occupation === "other" && actualOccupation) {
      return actualOccupation;
    }
    
    return occupation;
  };

  return (
    <div className="space-y-6">
      {/* Personal Information Section */}
      <div className="border-b pb-6">
        <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
        <div className="grid grid-cols-2 gap-6">
          {/* Applicant A */}
          <div>
            <h4 className="text-lg font-medium mb-4">
              {languageData.de.credit_applicant_a}
              <br />
              <span className="text-sm text-gray-600">{languageData.en.credit_applicant_a}</span>
            </h4>
            <div className="space-y-4">
              <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.first_last_name}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.first_last_name}</span>
                </Label>
                <p className="text-gray-700">{formData.personalInfo.applicantA.name}</p>
              </div>
              <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.address}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.address}</span>
                </Label>
                <p className="text-gray-700">{formData.personalInfo.applicantA.address}</p>
              </div>
              <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.telephone_number}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.telephone_number}</span>
                </Label>
                <p className="text-gray-700">{formData.personalInfo.applicantA.telephone}</p>
              </div>
              <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.email_id}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.email_id}</span>
                </Label>
                <p className="text-gray-700">{formData.personalInfo.applicantA.email}</p>
              </div>
              <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.date_of_birth}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.date_of_birth}</span>
                </Label>
                <p className="text-gray-700">{formData.personalInfo.applicantA.birthDate}</p>
              </div>
              <div>
              <Label className="block space-y-1">
                    <span>{languageData.de.nationality}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.nationality}</span>
                </Label>
                <p className="text-gray-700">{displayNationality('applicantA')}</p>
              </div>
              <div>
              <Label className="block space-y-1">
                    <span>{languageData.de.marital_status}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.marital_status}</span>
                </Label>
                <p className="text-gray-700">{formData.personalInfo.applicantA.maritalStatus}</p>
              </div>
              <div>
                <Label className="block space-y-1">
                  <span>{languageData.de.children_dob}</span>
                  <span className="text-sm text-gray-600 block">{languageData.en.children_dob}</span>
                </Label>
                {formData.personalInfo.applicantA.hasChildren ? (
                  renderChildren(formData.personalInfo.applicantA.children)
                ) : (
                  <p className="text-gray-700">No children</p>
                )}
              </div>
              <div>
              <Label className="block space-y-1">
                    <span>{languageData.de.occupation}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.occupation}</span>
                </Label>
                <p className="text-gray-700">{displayOccupation('applicantA')}</p>
              </div>
              <div>
              <Label className="block space-y-1">
                    <span>{languageData.de.bank_details_iban}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.bank_details_iban}</span>
                </Label>
                <p className="text-gray-700">{formData.personalInfo.applicantA.bankDetails}</p>
              </div>
            </div>
          </div>

          {/* Applicant B */}
          <div>
            <h4 className="text-lg font-medium mb-4">
              {languageData.de.credit_applicant_b}
              <br />
              <span className="text-sm text-gray-600">{languageData.en.credit_applicant_b}</span>
            </h4>
            <div className="space-y-4">
            <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.first_last_name}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.first_last_name}</span>
                </Label>
                <p className="text-gray-700">{formData.personalInfo.applicantB.name}</p>
              </div>
              <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.address}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.address}</span>
                </Label>
                <p className="text-gray-700">{formData.personalInfo.applicantB.address}</p>
              </div>
              <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.telephone_number}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.telephone_number}</span>
                </Label>
                <p className="text-gray-700">{formData.personalInfo.applicantB.telephone}</p>
              </div>
              <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.email_id}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.email_id}</span>
                </Label>
                <p className="text-gray-700">{formData.personalInfo.applicantB.email}</p>
              </div>
              <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.date_of_birth}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.date_of_birth}</span>
                </Label>
                <p className="text-gray-700">{formData.personalInfo.applicantB.birthDate}</p>
              </div>
              <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.nationality}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.nationality}</span>
                </Label>
                <p className="text-gray-700">{displayNationality('applicantB')}</p>
              </div>
              <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.marital_status}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.marital_status}</span>
                </Label>
                <p className="text-gray-700">{formData.personalInfo.applicantB.maritalStatus}</p>
              </div>
              <div>
                <Label className="block space-y-1">
                  <span>{languageData.de.children_dob}</span>
                  <span className="text-sm text-gray-600 block">{languageData.en.children_dob}</span>
                </Label>
                {formData.personalInfo.applicantB.hasChildren ? (
                  renderChildren(formData.personalInfo.applicantB.children)
                ) : (
                  <p className="text-gray-700">No children</p>
                )}
              </div>
              <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.occupation}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.occupation}</span>
                </Label>
                <p className="text-gray-700">{displayOccupation('applicantB')}</p>
              </div>
              <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.bank_details_iban}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.bank_details_iban}</span>
                </Label>
                <p className="text-gray-700">{formData.personalInfo.applicantB.bankDetails}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add children section for Applicant A */}
        

        {/* Add children section for Applicant B */}
        
      </div>

      {/* Household Budget Section */}
      <div className="border-b pb-6">
        <h3 className="text-xl font-semibold mb-4">Household Budget</h3>
        <div className="grid grid-cols-2 gap-6">
          {/* Applicant A Budget */}
          <div>
            <h4 className="text-lg font-medium mb-4">Applicant A</h4>
            <div className="space-y-4">
              <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.monthly_net_income}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.monthly_net_income}</span>
                </Label>
                <p className="text-gray-700">{formData.householdBudget.applicantA.monthlyNetIncome}</p>
              </div>
              <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.monthly_income_others}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.monthly_income_others}</span>
                </Label>
                <p className="text-gray-700">{formData.householdBudget.applicantA.otherIncome}</p>
              </div>
              <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.other_family_income}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.other_family_income}</span>
                </Label>
                <p className="text-gray-700">{formData.householdBudget.applicantA.familyIncome}</p>
              </div>
              <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.total_income}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.total_income}</span>
                </Label>
                <p className="text-gray-700">{formData.householdBudget.applicantA.totalIncome}</p>
              </div>
              <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.rent}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.rent}</span>
                </Label>
                <p className="text-gray-700">{formData.householdBudget.applicantA.rent}</p>
              </div>
              <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.living_expenses}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.living_expenses}</span>
                </Label>
                <p className="text-gray-700">{formData.householdBudget.applicantA.livingExpenses}</p>
              </div>
              <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.emi_personal_loans}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.emi_personal_loans}</span>
                </Label>
                <p className="text-gray-700">{formData.householdBudget.applicantA.personalLoans}</p>
              </div>
              <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.emi_property_loans}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.emi_property_loans}</span>
                </Label>
                <p className="text-gray-700">{formData.householdBudget.applicantA.propertyLoans}</p>
              </div>
              <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.other_regular_expenses}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.other_regular_expenses}</span>
                </Label>
                <p className="text-gray-700">{formData.householdBudget.applicantA.otherExpenses}</p>
              </div>
              <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.total_expenses}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.total_expenses}</span>
                </Label>
                <p className="text-gray-700">{formData.householdBudget.applicantA.totalExpenses}</p>
              </div>
              <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.total_available_capital}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.total_available_capital}</span>
                </Label>
                <p className="text-gray-700">{formData.householdBudget.applicantA.totalAvailableCapital}</p>
              </div>
            </div>
          </div>

          {/* Applicant B Budget */}
          <div>
            <h4 className="text-lg font-medium mb-4">Applicant B</h4>
            <div className="space-y-4">
            <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.monthly_net_income}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.monthly_net_income}</span>
                </Label>
                <p className="text-gray-700">{formData.householdBudget.applicantB.monthlyNetIncomeB}</p>
              </div>
              <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.monthly_income_others}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.monthly_income_others}</span>
                </Label>
                <p className="text-gray-700">{formData.householdBudget.applicantB.otherIncomeB}</p>
              </div>
              <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.other_family_income}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.other_family_income}</span>
                </Label>
                <p className="text-gray-700">{formData.householdBudget.applicantB.familyIncomeB}</p>
              </div>
              <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.total_income}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.total_income}</span>
                </Label>
                <p className="text-gray-700">{formData.householdBudget.applicantB.totalIncomeB}</p>
              </div>
              <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.rent}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.rent}</span>
                </Label>
                <p className="text-gray-700">{formData.householdBudget.applicantB.rentB}</p>
              </div>
              <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.living_expenses}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.living_expenses}</span>
                </Label>
                <p className="text-gray-700">{formData.householdBudget.applicantB.livingExpensesB}</p>
              </div>
              <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.emi_personal_loans}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.emi_personal_loans}</span>
                </Label>
                <p className="text-gray-700">{formData.householdBudget.applicantB.personalLoansB}</p>
              </div>
              <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.emi_property_loans}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.emi_property_loans}</span>
                </Label>
                <p className="text-gray-700">{formData.householdBudget.applicantB.propertyLoansB}</p>
              </div>
              <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.other_regular_expenses}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.other_regular_expenses}</span>
                </Label>
                <p className="text-gray-700">{formData.householdBudget.applicantB.otherExpensesB}</p>
              </div>
              <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.total_expenses}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.total_expenses}</span>
                </Label>
                <p className="text-gray-700">{formData.householdBudget.applicantB.totalExpensesB}</p>
              </div>
              <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.total_available_capital}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.total_available_capital}</span>
                </Label>
                <p className="text-gray-700">{formData.householdBudget.applicantB.totalAvailableCapitalB}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assets Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Assets</h3>
        <div className="grid grid-cols-2 gap-6">
          {/* Applicant A Assets */}
          <div>
            <h4 className="text-lg font-medium mb-4">Applicant A</h4>
            <div className="space-y-4">
              <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.bank_savings}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.bank_savings}</span>
                </Label>
                <p className="text-gray-700">{renderArrayValues(formData.assets.bankAccountsA)}</p>
              </div>
              <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.bausparguthaben}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.bausparguthaben}</span>
                </Label>
                <p className="text-gray-700">{renderArrayValues(formData.assets.buildingSocietyA)}</p>
              </div>
              <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.life_insurance}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.life_insurance}</span>
                </Label>
                <p className="text-gray-700">{renderArrayValues(formData.assets.lifeInsuranceA)}</p>
              </div>
              <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.real_estate}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.real_estate}</span>
                </Label>
                <p className="text-gray-700">{renderArrayValues(formData.assets.propertyA)}</p>
              </div>
              <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.other_assets}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.other_assets}</span>
                </Label>
                <p className="text-gray-700">{renderArrayValues(formData.assets.otherAssetsA)}</p>
              </div>
              <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.liabilities}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.liabilities}</span>
                </Label>
                <p className="text-gray-700">{renderArrayValues(formData.assets.liabilitiesA)}</p>
              </div>
            </div>
          </div>

          {/* Applicant B Assets */}
          <div>
            <h4 className="text-lg font-medium mb-4">Applicant B</h4>
            <div className="space-y-4">
            <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.bank_savings}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.bank_savings}</span>
                </Label>
                <p className="text-gray-700">{renderArrayValues(formData.assets.bankAccountsB)}</p>
              </div>
              <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.bausparguthaben}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.bausparguthaben}</span>
                </Label>
                <p className="text-gray-700">{renderArrayValues(formData.assets.buildingSocietyB)}</p>
              </div>
              <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.life_insurance}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.life_insurance}</span>
                </Label>
                <p className="text-gray-700">{renderArrayValues(formData.assets.lifeInsuranceB)}</p>
              </div>
              <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.real_estate}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.real_estate}</span>
                </Label>
                <p className="text-gray-700">{renderArrayValues(formData.assets.propertyB)}</p>
              </div>
              <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.other_assets}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.other_assets}</span>
                </Label>
                <p className="text-gray-700">{renderArrayValues(formData.assets.otherAssetsB)}</p>
              </div>
              <div>
                <Label className="block space-y-1">
                    <span>{languageData.de.liabilities}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.liabilities}</span>
                </Label>
                <p className="text-gray-700">{renderArrayValues(formData.assets.liabilitiesB)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 