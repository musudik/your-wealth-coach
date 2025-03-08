export type FormStep = "personal" | "household" | "assets" | "review" | "signature";

export interface FormData {
  personalInfo: {
    applicantA: {
      name: string;
      birthName: string;
      address: string;
      telephone: string;
      email: string;
      birthDate: string;
      placeOfBirth: string;
      nationality: string;
      maritalStatus: string;
      occupation: string;
      occupationSince: string;
      bankDetails: string;
      hasChildren: boolean;
      children: Array<{
        id: string;
        name: string;
        birthDate: string;
        placeOfBirth: string;
      }>;
    };
    applicantB: {
      name: string;
      birthName: string;
      address: string;
      telephone: string;
      email: string;
      birthDate: string;
      placeOfBirth: string;
      nationality: string;
      maritalStatus: string;
      occupation: string;
      occupationSince: string;
      bankDetails: string;
      hasChildren: boolean;
      children: Array<{
        id: string;
        name: string;
        birthDate: string;
        placeOfBirth: string;
      }>;
    };
  };
  householdBudget: {
    applicantA: {
      monthlyNetIncome: string;
      otherIncome: string;
      familyIncome: string;
      rent: string;
      livingExpenses: string;
      savingsPlans: string;
      personalLoans: string;
      propertyLoans: string;
      otherExpenses: string;
      totalIncome: string;
      totalExpenses: string;
      totalAvailableCapital: string;
      additionalMonthlyIncome: string;
    };
    applicantB: {
      monthlyNetIncomeB: string;
      otherIncomeB: string;
      familyIncomeB: string;
      rentB: string;
      livingExpensesB: string;
      savingsPlansB: string;
      personalLoansB: string;
      propertyLoansB: string;
      otherExpensesB: string;
      totalIncomeB: string;
      totalExpensesB: string;
      totalAvailableCapitalB: string;
      additionalMonthlyIncomeB: string;
    };
  };
  assets: {
    // Applicant A
    bankAccountsA: [string, string, string];
    buildingSocietyA: [string, string, string];
    lifeInsuranceA: [string, string, string];
    propertyA: [string, string, string];
    otherAssetsA: [string, string, string];
    liabilitiesA: [string, string, string];
    // Applicant B
    bankAccountsB: [string, string, string];
    buildingSocietyB: [string, string, string];
    lifeInsuranceB: [string, string, string];
    propertyB: [string, string, string];
    otherAssetsB: [string, string, string];
    liabilitiesB: [string, string, string];
  };
  signature: {
    place: string;
    date: string;
    consentDataTransmission: boolean;
    consentNoProceedings: boolean;
    signatureA: string | null;
    signatureB: string | null;
    consentSchufa: boolean;
    consentBankruptcy: boolean;
    consentAffidavit: boolean;
    consentTruthful: boolean;
    referredBy?: string;
  };
} 