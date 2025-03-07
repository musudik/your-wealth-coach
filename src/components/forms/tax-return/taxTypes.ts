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
  }
  
  export interface TaxCredits {
    childrenAllowance: number;
    homeOfficeDeduction: number;
    donationsCharity: number;
  }
  
  export interface TaxFormData {
    id?: string;
    createdAt?: string;
    updatedAt?: string;
    status?: 'draft' | 'submitted';
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
      hasPrivateInsurance: false
    },
    taxCredits: {
      childrenAllowance: 0,
      homeOfficeDeduction: 0,
      donationsCharity: 0
    }
  };