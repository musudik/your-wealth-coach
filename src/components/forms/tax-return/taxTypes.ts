export interface Address {
    street: string;
    houseNumber: string;
    postalCode: string;
    city: string;
  }
  
  export interface PersonalInfo {
    firstName: string;
    lastName: string;
    taxId: string;
    dateOfBirth: string;
    maritalStatus: string;
    email?: string;
    phone?: string;
    address: Address;
    hasForeignResidence?: boolean;
    foreignResidenceCountry?: string;
    otherForeignResidenceCountry?: string;
    hasSpouse?: boolean;
    spouseFirstName?: string;
    spouseLastName?: string;
    spouseDateOfBirth?: string;
    spouseTaxId?: string;
    spouseHasIncome?: boolean;
    spouseIncomeType?: string;
    jointTaxation?: boolean;
    hasChildren?: boolean;
    childrenCount?: number;
  }
  
  export interface IncomeInfo {
    selfEmploymentIncome: number;
    capitalGains: number;
    rentalIncome: number;
    otherIncome: number;
    isEmployed?: boolean;
    employer?: string;
    employmentIncome?: number;
    grossAnnualSalary?: number;
    hasTaxCertificate?: boolean;
    taxCertificateFile?: string;
    hasTravelSubsidy?: boolean;
    isBusinessOwner?: boolean;
    businessType?: string;
    businessEarnings?: number;
    businessExpenses?: number;
    hasStockIncome?: boolean;
    dividendEarnings?: number;
    hasBankCertificate?: boolean;
    bankCertificateFile?: string;
    hasStockSales?: boolean;
    stockSalesCertificateFile?: string;
    stockProfitLoss?: number;
    hasForeignStocks?: boolean;
    foreignTaxPaid?: number;
    foreignTaxCertificateFile?: string;
    hasRentalProperty?: boolean;
    rentalCosts?: number;
    rentalPropertyAddress?: Address;
    hasForeignIncome?: boolean;
    foreignIncomeCountry?: string;
    foreignIncomeType?: string;
    foreignIncomeAmount?: number;
    foreignIncomeTaxPaid?: number;
    foreignIncomeTaxCertificateFile?: string;
  }
  
  export interface Deductions {
    workRelatedExpenses: number;
    specialExpenses: number;
    extraordinaryExpenses: number;
    insurancePremiums: number;
    
    // Craftsmen services
    hasCraftsmenPayments: boolean;
    craftsmenAmount?: number;
    craftsmenInvoiceFile?: string;
    
    // Maintenance payments
    hasMaintenancePayments: boolean;
    maintenanceRecipient?: string;
    maintenanceAmount?: number;
    recipientsAbroad?: boolean;
    
    // Detailed special expenses
    hasSpecialExpensesDetailed: boolean;
    specialExpensesType?: string;
    specialExpensesAmount?: number;
    
    // Private insurance
    hasPrivateInsurance: boolean;
    insuranceTypes?: string;
    insuranceContributions?: number;
    
    // Add new fields
    commutingExpenses: number;
    businessTripsCosts: number;
    workEquipment: number;
    homeOfficeAllowance: number;
    membershipFees: number;
    applicationCosts: number;
    doubleHouseholdCosts: number;
    churchTax: number;
    donationsAndFees: number;
    childcareCosts: number;
    supportPayments: number;
    privateSchoolFees: number;
    retirementProvisions: number;
    otherInsuranceExpenses: number;
    professionalTrainingCosts: number;
    medicalExpenses: number;
    rehabilitationCosts: number;
    careCosts: number;
    disabilityExpenses: number;
    funeralCosts: number;
    relativesSupportCosts: number;
    divorceCosts: number;
    statutoryHealthInsurance: number;
    privateHealthInsurance: number;
    statutoryPensionInsurance: number;
    privatePensionInsurance: number;
    unemploymentInsurance: number;
    accidentLiabilityInsurance: number;
    disabilityInsurance: number;
    termLifeInsurance: number;
    householdServices: number;
    craftsmenServices: number;
    gardeningServices: number;
    cleaningServices: number;
    caretakerServices: number;
    householdCareCosts: number;
    householdSupportServices: number;
    chimneySweepFees: number;
    emergencySystemCosts: number;
    documents_rentalContracts?: string[];
    documents_annualStatements?: string[];
    documents_operatingCosts?: string[];
    documents_propertyTax?: string[];
    documents_loanContracts?: string[];
    documents_repairBills?: string[];
    documents_craftsmenBills?: string[];
    documents_renovationProof?: string[];
    documents_insurancePremiums?: string[];
    documents_brokerFees?: string[];
    documents_rentalIncome?: string[];
    documents_vacancyProof?: string[];
    documents_managementCosts?: string[];
    documents_depreciationProof?: string[];
  }
  
  export interface TaxCredits {
    childrenAllowance: number;
    homeOfficeDeduction: number;
    donationsCharity: number;
  }
  
  interface SignatureData {
    place: string;
    date: string;
    time: string;
    signature: string;
  }
  
  export interface TaxFormData {
    id?: string;
    clientId?: string;
    partnerId?: string;
    type?: string;
    status?: 'draft' | 'submitted';
    createdAt?: string;
    updatedAt?: string;
    personalInfo: PersonalInfo;
    children?: Array<{
      id: string;
      firstName: string;
      lastName: string;
      dateOfBirth: string;
      taxId: string;
    }>;
    incomeInfo: IncomeInfo;
    deductions: Deductions;
    taxCredits: TaxCredits;
    signature?: SignatureData;
    [key: string]: any;
  }
  
  // Initial form data with empty values
  export const initialTaxFormData: TaxFormData = {
    status: 'draft',
    personalInfo: {
      firstName: '',
      lastName: '',
      taxId: '',
      dateOfBirth: '',
      maritalStatus: '',
      email: '',
      phone: '',
      address: {
        street: '',
        houseNumber: '',
        postalCode: '',
        city: ''
      },
      hasForeignResidence: false,
      foreignResidenceCountry: '',
      hasSpouse: false,
      spouseFirstName: '',
      spouseLastName: '',
      spouseDateOfBirth: '',
      spouseTaxId: '',
      spouseHasIncome: false,
      spouseIncomeType: '',
      jointTaxation: false,
      hasChildren: false,
      childrenCount: 0
    },
    children: [],
    incomeInfo: {
      employmentIncome: 0,
      selfEmploymentIncome: 0,
      capitalGains: 0,
      rentalIncome: 0,
      otherIncome: 0,
      isEmployed: undefined,
      employer: '',
      grossAnnualSalary: 0,
      hasTaxCertificate: false,
      taxCertificateFile: '',
      hasTravelSubsidy: false,
      isBusinessOwner: undefined,
      businessType: '',
      businessEarnings: 0,
      businessExpenses: 0,
      hasStockIncome: undefined,
      dividendEarnings: 0,
      hasBankCertificate: false,
      bankCertificateFile: '',
      hasStockSales: false,
      stockSalesCertificateFile: '',
      stockProfitLoss: 0,
      hasForeignStocks: false,
      foreignTaxPaid: 0,
      foreignTaxCertificateFile: '',
      hasRentalProperty: undefined,
      rentalCosts: 0,
      rentalPropertyAddress: {
        street: '',
        houseNumber: '',
        postalCode: '',
        city: ''
      },
      hasForeignIncome: undefined,
      foreignIncomeCountry: '',
      foreignIncomeType: '',
      foreignIncomeAmount: 0,
      foreignIncomeTaxPaid: 0,
      foreignIncomeTaxCertificateFile: ''
    },
    deductions: {
      workRelatedExpenses: 0,
      specialExpenses: 0,
      extraordinaryExpenses: 0,
      insurancePremiums: 0,
      hasCraftsmenPayments: false,
      craftsmenAmount: 0,
      craftsmenInvoiceFile: '',
      hasMaintenancePayments: false,
      hasSpecialExpensesDetailed: false,
      hasPrivateInsurance: false,
      commutingExpenses: 0,
      businessTripsCosts: 0,
      workEquipment: 0,
      homeOfficeAllowance: 0,
      membershipFees: 0,
      applicationCosts: 0,
      doubleHouseholdCosts: 0,
      churchTax: 0,
      donationsAndFees: 0,
      childcareCosts: 0,
      supportPayments: 0,
      privateSchoolFees: 0,
      retirementProvisions: 0,
      otherInsuranceExpenses: 0,
      professionalTrainingCosts: 0,
      medicalExpenses: 0,
      rehabilitationCosts: 0,
      careCosts: 0,
      disabilityExpenses: 0,
      funeralCosts: 0,
      relativesSupportCosts: 0,
      divorceCosts: 0,
      statutoryHealthInsurance: 0,
      privateHealthInsurance: 0,
      statutoryPensionInsurance: 0,
      privatePensionInsurance: 0,
      unemploymentInsurance: 0,
      accidentLiabilityInsurance: 0,
      disabilityInsurance: 0,
      termLifeInsurance: 0,
      householdServices: 0,
      craftsmenServices: 0,
      gardeningServices: 0,
      cleaningServices: 0,
      caretakerServices: 0,
      householdCareCosts: 0,
      householdSupportServices: 0,
      chimneySweepFees: 0,
      emergencySystemCosts: 0
    },
    taxCredits: {
      childrenAllowance: 0,
      homeOfficeDeduction: 0,
      donationsCharity: 0
    },
    signature: {
      place: '',
      date: '',
      time: '',
      signature: ''
    }
  };