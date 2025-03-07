import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import languageData from "@/components/forms/self-disclosure/i18n/language.json";
import { FormData } from "@/types/form";

interface HouseholdBudgetFormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  errors: Record<string, any>;
  isSingleApplicant: boolean;
}

export function HouseholdBudgetForm({ formData, setFormData, errors, isSingleApplicant }: HouseholdBudgetFormProps) {
  useEffect(() => {
    // Calculate totals for Applicant A
    const totalIncomeA = (
      parseFloat(formData.householdBudget.applicantA.monthlyNetIncome || "0") +
      parseFloat(formData.householdBudget.applicantA.otherIncome || "0") +
      parseFloat(formData.householdBudget.applicantA.familyIncome || "0")
    ).toFixed(2);

    const totalExpensesA = (
      parseFloat(formData.householdBudget.applicantA.rent || "0") +
      parseFloat(formData.householdBudget.applicantA.livingExpenses || "0") +
      parseFloat(formData.householdBudget.applicantA.savingsPlans || "0") +
      parseFloat(formData.householdBudget.applicantA.personalLoans || "0") +
      parseFloat(formData.householdBudget.applicantA.propertyLoans || "0") +
      parseFloat(formData.householdBudget.applicantA.otherExpenses || "0")
    ).toFixed(2);

    const totalAvailableCapitalA = (
      parseFloat(totalIncomeA) - parseFloat(totalExpensesA)
    ).toFixed(2);

    // Calculate totals for Applicant B
    const totalIncomeB = (
      parseFloat(formData.householdBudget.applicantB.monthlyNetIncomeB || "0") +
      parseFloat(formData.householdBudget.applicantB.otherIncomeB || "0") +
      parseFloat(formData.householdBudget.applicantB.familyIncomeB || "0")
    ).toFixed(2);

    const totalExpensesB = (
      parseFloat(formData.householdBudget.applicantB.rentB || "0") +
      parseFloat(formData.householdBudget.applicantB.livingExpensesB || "0") +
      parseFloat(formData.householdBudget.applicantB.savingsPlansB || "0") +
      parseFloat(formData.householdBudget.applicantB.personalLoansB || "0") +
      parseFloat(formData.householdBudget.applicantB.propertyLoansB || "0") +
      parseFloat(formData.householdBudget.applicantB.otherExpensesB || "0")
    ).toFixed(2);

    const totalAvailableCapitalB = (
      parseFloat(totalIncomeB) - parseFloat(totalExpensesB)
    ).toFixed(2);

    
    // Update form data with calculated values
    setFormData((prev: FormData) => ({
      ...prev,
      householdBudget: {
        ...prev.householdBudget,
        applicantA: {
          ...prev.householdBudget.applicantA,
          totalIncome: totalIncomeA,
          totalExpenses: totalExpensesA,
          totalAvailableCapital: totalAvailableCapitalA,
        },
        applicantB: {
          ...prev.householdBudget.applicantB,
          totalIncomeB: totalIncomeB,
          totalExpensesB: totalExpensesB,
          totalAvailableCapitalB: totalAvailableCapitalB,
        },
      },
    }));
  }, [
    formData.householdBudget.applicantA.monthlyNetIncome,
    formData.householdBudget.applicantA.otherIncome,
    formData.householdBudget.applicantA.familyIncome,
    formData.householdBudget.applicantA.rent,
    formData.householdBudget.applicantA.livingExpenses,
    formData.householdBudget.applicantA.savingsPlans,
    formData.householdBudget.applicantA.personalLoans,
    formData.householdBudget.applicantA.propertyLoans,
    formData.householdBudget.applicantA.otherExpenses,
    formData.householdBudget.applicantB.monthlyNetIncomeB,
    formData.householdBudget.applicantB.otherIncomeB,
    formData.householdBudget.applicantB.familyIncomeB,
    formData.householdBudget.applicantB.rentB,
    formData.householdBudget.applicantB.livingExpensesB,
    formData.householdBudget.applicantB.savingsPlansB,
    formData.householdBudget.applicantB.personalLoansB,
    formData.householdBudget.applicantB.propertyLoansB,
    formData.householdBudget.applicantB.otherExpensesB,
  ]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Applicant A */}
        <div>
          <h4 className="text-md font-medium mb-4">
            {languageData.de.credit_applicant_a}
            <br />
            <span className="text-sm text-gray-600">{languageData.en.credit_applicant_a}</span>
          </h4>
          <div className="space-y-4">
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.monthly_net_income}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.monthly_net_income}</span>
              </Label>
              <Input
                type="number"
                value={formData.householdBudget.applicantA.monthlyNetIncome}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    householdBudget: {
                      ...formData.householdBudget,
                      applicantA: {
                        ...formData.householdBudget.applicantA,
                        monthlyNetIncome: e.target.value,
                      },
                    },
                  })
                } 
                className={errors?.applicantA?.monthlyNetIncome ? "border-red-500" : ""}
              />
            </div>
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.monthly_income_others}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.monthly_income_others}</span>
              </Label>
              <Input
                type="number"
                value={formData.householdBudget.applicantA.otherIncome}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    householdBudget: {
                      ...formData.householdBudget,
                      applicantA: {
                        ...formData.householdBudget.applicantA,
                        otherIncome: e.target.value,
                      },
                    },
                  })
                } 
                className={errors?.applicantA?.otherIncome ? "border-red-500" : ""}
              />
            </div>
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.other_family_income}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.other_family_income}</span>
              </Label>
              <Input
                type="number"
                value={formData.householdBudget.applicantA.familyIncome}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    householdBudget: {
                      ...formData.householdBudget,
                      applicantA: {
                        ...formData.householdBudget.applicantA,
                        familyIncome: e.target.value,
                      },
                    },
                  })
                }   
                className={errors?.applicantA?.familyIncome ? "border-red-500" : ""}
              />
            </div>
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.total_income}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.total_income}</span>
              </Label>
              <Input
                type="number"
                value={formData.householdBudget.applicantA.totalIncome}
                disabled
                className="font-semibold bg-gray-100"
              />    
            </div>

            {/* Expenses Section */}
            <div className="mt-4">
              <Label className="block space-y-1">
                <span>{languageData.de.household_expenses}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.household_expenses}</span>
              </Label>
            </div>

            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.rent}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.rent}</span>
              </Label>
              <Input
                type="number"
                value={formData.householdBudget.applicantA.rent}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    householdBudget: {
                      ...formData.householdBudget,
                      applicantA: {
                        ...formData.householdBudget.applicantA,
                        rent: e.target.value,
                      },
                    },
                  })
                }   
                className={errors?.applicantA?.rent ? "border-red-500" : ""}
              />
            </div>

            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.living_expenses}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.living_expenses}</span>
              </Label>
              <Input
                type="number"
                value={formData.householdBudget.applicantA.livingExpenses}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    householdBudget: {
                      ...formData.householdBudget,
                      applicantA: {
                        ...formData.householdBudget.applicantA,
                        livingExpenses: e.target.value,
                      },
                    },
                  })
                }
                className={errors?.applicantA?.livingExpenses ? "border-red-500" : ""}
              />
            </div>
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.savings_plans}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.savings_plans}</span>
              </Label>
              <Input
                type="number"
                value={formData.householdBudget.applicantA.savingsPlans}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    householdBudget: {
                      ...formData.householdBudget,
                      applicantA: {
                        ...formData.householdBudget.applicantA,
                        savingsPlans: e.target.value,
                      },
                    },
                  })
                }
                className={errors?.applicantA?.savingsPlans ? "border-red-500" : ""}
              />
            </div>
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.emi_personal_loans}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.emi_personal_loans}</span>
              </Label>
              <Input
                type="number"
                value={formData.householdBudget.applicantA.personalLoans}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    householdBudget: {
                      ...formData.householdBudget,
                      applicantA: {
                        ...formData.householdBudget.applicantA,
                        personalLoans: e.target.value,
                      },
                    },
                  })
                }
                className={errors?.applicantA?.personalLoans ? "border-red-500" : ""}
              />
            </div>
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.emi_property_loans}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.emi_property_loans}</span>
              </Label>
              <Input
                type="number"
                value={formData.householdBudget.applicantA.propertyLoans}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    householdBudget: {
                      ...formData.householdBudget,
                      applicantA: {
                        ...formData.householdBudget.applicantA,
                        propertyLoans: e.target.value,
                      },
                    },
                  })
                } 
                className={errors?.applicantA?.propertyLoans ? "border-red-500" : ""}
              />
            </div>
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.other_regular_expenses}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.other_regular_expenses}</span>
              </Label>
              <Input
                type="number"
                value={formData.householdBudget.applicantA.otherExpenses}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    householdBudget: {
                      ...formData.householdBudget,
                      applicantA: {
                        ...formData.householdBudget.applicantA,
                        otherExpenses: e.target.value,
                      },
                    },
                  })
                } 
                className={errors?.applicantA?.otherExpenses ? "border-red-500" : ""}
              />
            </div>
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.total_expenses}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.total_expenses}</span>
              </Label>
              <Input
                type="number"
                value={formData.householdBudget.applicantA.totalExpenses}
                disabled
                className="font-semibold bg-gray-100"
              />
            </div>

            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.total_available_capital}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.total_available_capital}</span>
              </Label>
              <Input
                type="number"
                value={formData.householdBudget.applicantA.totalAvailableCapital}
                disabled
                className="font-semibold bg-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Applicant B */}
        <div>
          <h4 className="text-md font-medium mb-4">
            {languageData.de.credit_applicant_b}
            <br />
            <span className="text-sm text-gray-600">{languageData.en.credit_applicant_a}</span>
          </h4>
          <div className="space-y-4">
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.monthly_net_income}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.monthly_net_income}</span>
              </Label>
              <Input
                type="number"
                value={formData.householdBudget.applicantB.monthlyNetIncomeB}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    householdBudget: {
                      ...formData.householdBudget,
                      applicantB: {
                        ...formData.householdBudget.applicantB,
                        monthlyNetIncomeB: e.target.value,
                      },
                    },
                  })
                }
                className={errors?.applicantB?.monthlyNetIncomeB ? "border-red-500" : ""}
                disabled={isSingleApplicant}
              />
            </div>
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.monthly_income_others}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.monthly_income_others}</span>
              </Label>
              <Input
                type="number"
                value={formData.householdBudget.applicantB.otherIncomeB}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    householdBudget: {
                      ...formData.householdBudget,
                      applicantB: {
                        ...formData.householdBudget.applicantB,
                        otherIncomeB: e.target.value,
                      },
                    },
                  })
                }
                className={errors?.applicantB?.otherIncomeB ? "border-red-500" : ""}
                disabled={isSingleApplicant}
              />
            </div>
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.other_family_income}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.other_family_income}</span>
              </Label>
              <Input
                type="number"
                value={formData.householdBudget.applicantB.familyIncomeB}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    householdBudget: {
                      ...formData.householdBudget,
                      applicantB: {
                        ...formData.householdBudget.applicantB,
                        familyIncomeB: e.target.value,
                      },
                    },
                  })
                }
                className={errors?.applicantB?.familyIncomeB ? "border-red-500" : ""}
                disabled={isSingleApplicant}
              />
            </div>
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.total_income}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.total_income}</span>
              </Label>
              <Input
                type="number"
                value={formData.householdBudget.applicantB.totalIncomeB}
                disabled
                className="font-semibold bg-gray-100"
              />
            </div>
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.rent}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.rent}</span>
              </Label>
              <Input
                type="number"
                value={formData.householdBudget.applicantB.rentB}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    householdBudget: {
                      ...formData.householdBudget,
                      applicantB: {
                        ...formData.householdBudget.applicantB,
                        rentB: e.target.value,
                      },
                    },
                  })
                }
                className={errors?.applicantB?.rentB ? "border-red-500" : ""}
                disabled={isSingleApplicant}
              />
            </div>
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.living_expenses}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.living_expenses}</span>
              </Label>
              <Input
                type="number"
                value={formData.householdBudget.applicantB.livingExpensesB}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    householdBudget: {
                      ...formData.householdBudget,
                      applicantB: {
                        ...formData.householdBudget.applicantB,
                        livingExpensesB: e.target.value,
                      },
                    },
                  })
                }
                className={errors?.applicantB?.livingExpensesB ? "border-red-500" : ""}
                disabled={isSingleApplicant}
              />
            </div>
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.savings_plans}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.savings_plans}</span>
              </Label>
              <Input
                type="number"
                value={formData.householdBudget.applicantB.savingsPlansB}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    householdBudget: {
                      ...formData.householdBudget,
                      applicantB: {
                        ...formData.householdBudget.applicantB,
                        savingsPlansB: e.target.value,
                      },
                    },
                  })
                }
                className={errors?.applicantB?.savingsPlansB ? "border-red-500" : ""}
                disabled={isSingleApplicant}
              />
            </div>
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.emi_personal_loans}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.emi_personal_loans}</span>
              </Label>
              <Input
                type="number"
                value={formData.householdBudget.applicantB.personalLoansB}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    householdBudget: {
                      ...formData.householdBudget,
                      applicantB: {
                        ...formData.householdBudget.applicantB,
                        personalLoansB: e.target.value,
                      },
                    },
                  })
                }
                className={errors?.applicantB?.personalLoansB ? "border-red-500" : ""}
                disabled={isSingleApplicant}
              />
            </div>
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.emi_property_loans}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.emi_property_loans}</span>
              </Label>
              <Input
                type="number"
                value={formData.householdBudget.applicantB.propertyLoansB}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    householdBudget: {
                      ...formData.householdBudget,
                      applicantB: {
                        ...formData.householdBudget.applicantB,
                        propertyLoansB: e.target.value,
                      },
                    },
                  })
                }
                className={errors?.applicantB?.propertyLoansB ? "border-red-500" : ""}
                disabled={isSingleApplicant}
              />
            </div>
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.other_regular_expenses}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.other_regular_expenses}</span>
              </Label>
              <Input
                type="number"
                value={formData.householdBudget.applicantB.otherExpensesB}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    householdBudget: {
                      ...formData.householdBudget,
                      applicantB: {
                        ...formData.householdBudget.applicantB,
                        otherExpensesB: e.target.value,
                      },
                    },
                  })
                }
                className={errors?.applicantB?.otherExpensesB ? "border-red-500" : ""}
                disabled={isSingleApplicant}
              />
            </div>
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.total_expenses}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.total_expenses}</span>
              </Label>
              <Input
                type="number"
                value={formData.householdBudget.applicantB.totalExpensesB}
                disabled
                className="font-semibold bg-gray-100"
              />
            </div>
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.total_available_capital}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.total_available_capital}</span>
              </Label>
              <Input
                type="number"
                value={formData.householdBudget.applicantB.totalAvailableCapitalB}
                disabled
                className="font-semibold bg-gray-100"
              />
            </div>
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.additional_monthly_income}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.additional_monthly_income}</span>
              </Label>
              <Input
                type="number"
                value={formData.householdBudget.applicantB.additionalMonthlyIncomeB}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    householdBudget: {
                      ...formData.householdBudget,
                      applicantB: {
                        ...formData.householdBudget.applicantB,
                        additionalMonthlyIncomeB: e.target.value,
                      },
                    },
                  })
                }
                className={errors?.applicantB?.additionalMonthlyIncomeB ? "border-red-500" : ""}
                disabled={isSingleApplicant}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 