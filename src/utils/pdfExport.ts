import { PDFGenerator } from '../db-services/lib/pdf-generator';
import { TaxFormData } from '../components/forms/tax-return/taxTypes';

export const exportTaxReturnToPdf = (formData: TaxFormData): void => {
  // Create a new instance of PDFGenerator to avoid interfering with other PDF operations
  const pdfGen = new PDFGenerator();
  
  // Initialize a new document
  pdfGen['initializeNewDocument']();
  
  // Set smaller font size (50% reduction)
  const defaultFontSize = pdfGen['doc'].getFontSize();
  pdfGen['doc'].setFontSize(defaultFontSize * 0.5);
  
  // Set column widths for a two-column layout
  const labelWidth = 120;
  const valueWidth = pdfGen['pageWidth'] - pdfGen['margin'] * 2 - labelWidth;
  
  // Add title with normal font size
  pdfGen['doc'].setFontSize(defaultFontSize);
  pdfGen['addTitle']("Tax Return Form / Steuererklärung");
  pdfGen['doc'].setFontSize(defaultFontSize * 0.5);
  
  // Helper functions
  const formatCurrency = (value: number | undefined) => {
    if (value === undefined || value === null) return '€0.00';
    return `€${value.toFixed(2)}`;
  };

  const formatBoolean = (value: boolean | undefined) => {
    if (value === undefined || value === null) return '-';
    return value ? 'Ja / Yes' : 'Nein / No';
  };

  const safeRender = (value: any): string => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'boolean') return formatBoolean(value);
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      try {
        // For address objects
        if (value.street !== undefined || value.city !== undefined) {
          const street = value.street || '';
          const houseNumber = value.houseNumber || '';
          const postalCode = value.postalCode || '';
          const city = value.city || '';
          return `${street} ${houseNumber}, ${postalCode} ${city}`.trim();
        }
        // For other objects
        return JSON.stringify(value);
      } catch (e) {
        console.error("Error rendering object:", e);
        return "Error rendering value";
      }
    }
    return String(value);
  };
  
  // Custom field rendering function with borders
  const addFieldWithBorder = (label: string, value: string, indent: string = '') => {
    const rowHeight = 6; // Reduced row height for smaller font
    const y = pdfGen['y'];
    const x = pdfGen['margin'];
    const fullWidth = pdfGen['pageWidth'] - pdfGen['margin'] * 2;
    
    // Draw borders
    pdfGen['doc'].setDrawColor(0);
    pdfGen['doc'].setLineWidth(0.1);
    
    // Draw label cell
    pdfGen['doc'].rect(x, y, labelWidth, rowHeight);
    
    // Draw value cell
    pdfGen['doc'].rect(x + labelWidth, y, valueWidth, rowHeight);
    
    // Draw label text
    pdfGen['doc'].setFont("helvetica", "bold");
    pdfGen['textAt'](indent + label, x + 2, y + rowHeight/2 + 1);
    
    // Draw value text
    pdfGen['doc'].setFont("helvetica", "normal");
    pdfGen['textAt'](value, x + labelWidth + 2, y + rowHeight/2 + 1);
    
    pdfGen['y'] += rowHeight;
  };
  
  // Add section title with border
  const addSectionTitleWithBorder = (title: string) => {
    // Temporarily increase font size for section titles
    pdfGen['doc'].setFontSize(defaultFontSize * 0.6);
    
    const rowHeight = 8;
    const y = pdfGen['y'];
    const x = pdfGen['margin'];
    const fullWidth = pdfGen['pageWidth'] - pdfGen['margin'] * 2;
    
    // Draw border
    pdfGen['doc'].setDrawColor(0);
    pdfGen['doc'].setLineWidth(0.1);
    pdfGen['doc'].rect(x, y, fullWidth, rowHeight);
    
    // Fill with light gray
    pdfGen['doc'].setFillColor(240, 240, 240);
    pdfGen['doc'].rect(x, y, fullWidth, rowHeight, 'F');
    
    // Draw title text
    pdfGen['doc'].setFont("helvetica", "bold");
    pdfGen['doc'].setTextColor(0, 0, 0);
    pdfGen['textAt'](title, x + 2, y + rowHeight/2 + 1);
    
    pdfGen['y'] += rowHeight + 2;
    
    // Reset font size
    pdfGen['doc'].setFontSize(defaultFontSize * 0.5);
  };
  
  // Add personal information section
  addSectionTitleWithBorder("Personal Information / Persönliche Informationen");
  
  // Add personal information fields
  const personalInfoFields = [
    ["First Name / Vorname", safeRender(formData.personalInfo.firstName)],
    ["Last Name / Nachname", safeRender(formData.personalInfo.lastName)],
    ["Date of Birth / Geburtsdatum", safeRender(formData.personalInfo.dateOfBirth)],
    ["Tax ID / Steuer-ID", safeRender(formData.personalInfo.taxId)],
    ["Marital Status / Familienstand", safeRender(formData.personalInfo.maritalStatus)],
    ["Email / E-Mail", safeRender(formData.personalInfo.email)],
    ["Phone / Telefon", safeRender(formData.personalInfo.phone)],
    ["Address / Adresse", safeRender(formData.personalInfo.address)],
    ["Has Children / Hat Kinder", formatBoolean(formData.personalInfo.hasChildren)]
  ];
  
  personalInfoFields.forEach(([label, value]) => {
    addFieldWithBorder(label, value);
  });
  
  // Add children information if available
  if (formData.personalInfo.hasChildren && Array.isArray(formData.children) && formData.children.length > 0) {
    addSectionTitleWithBorder("Children / Kinder");
    
    formData.children.forEach((child, index) => {
      // Add child header
      const childHeader = `Child ${index + 1} / Kind ${index + 1}`;
      pdfGen['doc'].setFontSize(defaultFontSize * 0.55);
      pdfGen['doc'].setFont("helvetica", "bold");
      pdfGen['textAt'](childHeader, pdfGen['margin'], pdfGen['y']);
      pdfGen['y'] += 4;
      pdfGen['doc'].setFontSize(defaultFontSize * 0.5);
      
      const childFields = [
        ["First Name / Vorname", safeRender(child.firstName)],
        ["Last Name / Nachname", safeRender(child.lastName)],
        ["Date of Birth / Geburtsdatum", safeRender(child.dateOfBirth)],
        ["Tax ID / Steuer-ID", safeRender(child.taxId)]
      ];
      
      childFields.forEach(([label, value]) => {
        addFieldWithBorder(label, value);
      });
      
      pdfGen['y'] += 2;
    });
  }
  
  // Add employment information section
  addSectionTitleWithBorder("Employment Income / Einkünfte aus Anstellung");
  
  addFieldWithBorder("Are you employed? / Sind Sie angestellt?", formatBoolean(formData.incomeInfo.isEmployed));
  
  if (formData.incomeInfo.isEmployed) {
    const employmentFields = [
      ["Employer / Arbeitgeber", safeRender(formData.incomeInfo.employer)],
      ["Gross Annual Salary / Bruttojahresgehalt", formatCurrency(formData.incomeInfo.grossAnnualSalary)],
      ["Tax Certificate / Lohnsteuerbescheinigung", formatBoolean(formData.incomeInfo.hasTaxCertificate)],
      ["Travel Subsidy / Fahrtkostenzuschuss", formatBoolean(formData.incomeInfo.hasTravelSubsidy)]
    ];
    
    employmentFields.forEach(([label, value]) => {
      addFieldWithBorder(label, value);
    });
  }
  
  // Add business information section
  addSectionTitleWithBorder("Self-Employment Income / Einkünfte aus Selbständigkeit");
  
  addFieldWithBorder("Do you own a business? / Besitzen Sie ein Unternehmen?", formatBoolean(formData.incomeInfo.isBusinessOwner));
  
  if (formData.incomeInfo.isBusinessOwner) {
    const businessFields = [
      ["Business Type / Art des Unternehmens", safeRender(formData.incomeInfo.businessType)],
      ["Business Earnings / Unternehmenseinnahmen", formatCurrency(formData.incomeInfo.businessEarnings)],
      ["Business Expenses / Unternehmensausgaben", formatCurrency(formData.incomeInfo.businessExpenses)]
    ];
    
    businessFields.forEach(([label, value]) => {
      addFieldWithBorder(label, value);
    });
  }
  
  // Add investments information section
  addSectionTitleWithBorder("Stocks & Investments / Aktien & Investitionen");
  
  addFieldWithBorder("Income from stocks? / Einkünfte aus Aktien?", formatBoolean(formData.incomeInfo.hasStockIncome));
  
  if (formData.incomeInfo.hasStockIncome) {
    const investmentFields = [
      ["Dividend Earnings / Dividendenerträge", formatCurrency(formData.incomeInfo.dividendEarnings)],
      ["Bank Certificate / Bankbescheinigung", formatBoolean(formData.incomeInfo.hasBankCertificate)]
    ];
    
    investmentFields.forEach(([label, value]) => {
      addFieldWithBorder(label, value);
    });
    
    addFieldWithBorder("Stock Sales / Aktienverkäufe", formatBoolean(formData.incomeInfo.hasStockSales));
    
    if (!formData.incomeInfo.hasStockSales) {
      addFieldWithBorder("Profit/Loss per Stock / Gewinn/Verlust pro Aktie", formatCurrency(formData.incomeInfo.stockProfitLoss));
    }
    
    addFieldWithBorder("Foreign Stocks / Ausländische Aktien", formatBoolean(formData.incomeInfo.hasForeignStocks));
    
    if (formData.incomeInfo.hasForeignStocks) {
      addFieldWithBorder("Foreign Tax Paid / Gezahlte ausländische Steuer", formatCurrency(formData.incomeInfo.foreignTaxPaid));
    }
  }
  
  // Add rental information section
  addSectionTitleWithBorder("Rental Income / Mieteinnahmen");
  
  addFieldWithBorder("Rental Property / Vermietete Immobilie", formatBoolean(formData.incomeInfo.hasRentalProperty));
  
  if (formData.incomeInfo.hasRentalProperty) {
    const rentalFields = [
      ["Rental Income / Mieteinnahmen", formatCurrency(formData.incomeInfo.rentalIncome)],
      ["Rental Costs / Mietkosten", formatCurrency(formData.incomeInfo.rentalCosts)]
    ];
    
    rentalFields.forEach(([label, value]) => {
      addFieldWithBorder(label, value);
    });
  }
  
  // Add foreign income information section
  addSectionTitleWithBorder("Other Income / Sonstige Einkünfte");
  
  addFieldWithBorder("Foreign Income / Ausländische Einkünfte", formatBoolean(formData.incomeInfo.hasForeignIncome));
  
  if (formData.incomeInfo.hasForeignIncome) {
    const foreignIncomeFields = [
      ["Country / Land", safeRender(formData.incomeInfo.foreignIncomeCountry)],
      ["Income Type / Einkommensart", safeRender(formData.incomeInfo.foreignIncomeType)],
      ["Income Amount / Einkommensbetrag", formatCurrency(formData.incomeInfo.foreignIncomeAmount)]
    ];
    
    foreignIncomeFields.forEach(([label, value]) => {
      addFieldWithBorder(label, value);
    });
  }
  
  // Add expenses information section
  addSectionTitleWithBorder("Expenses & Deductions / Ausgaben & Abzüge");
  
  const expensesFields = [
    ["Work-Related Expenses / Werbungskosten", formatCurrency(formData.deductions.workRelatedExpenses)],
    ["Special Expenses / Sonderausgaben", formatCurrency(formData.deductions.specialExpenses)],
    ["Extraordinary Expenses / Außergewöhnliche Belastungen", formatCurrency(formData.deductions.extraordinaryExpenses)],
    ["Insurance Premiums / Versicherungsbeiträge", formatCurrency(formData.deductions.insurancePremiums)]
  ];
  
  expensesFields.forEach(([label, value]) => {
    addFieldWithBorder(label, value);
  });
  
  // Add craftsmen services
  addFieldWithBorder("Craftsmen Services / Handwerkerleistungen", formatBoolean(formData.deductions.hasCraftsmenPayments));
  
  if (formData.deductions.hasCraftsmenPayments) {
    addFieldWithBorder("Amount / Betrag", formatCurrency(formData.deductions.craftsmenAmount), "  ");
    if (formData.deductions.craftsmenInvoiceFile) {
      addFieldWithBorder("Invoice / Rechnung", safeRender(formData.deductions.craftsmenInvoiceFile), "  ");
    }
  }
  
  // Add maintenance payments
  addFieldWithBorder("Maintenance Payments / Unterhaltszahlungen", formatBoolean(formData.deductions.hasMaintenancePayments));
  
  if (formData.deductions.hasMaintenancePayments) {
    addFieldWithBorder("Recipient / Empfänger", safeRender(formData.deductions.maintenanceRecipient), "  ");
    addFieldWithBorder("Amount / Betrag", formatCurrency(formData.deductions.maintenanceAmount), "  ");
    addFieldWithBorder("Recipients Abroad / Empfänger im Ausland", formatBoolean(formData.deductions.recipientsAbroad), "  ");
  }
  
  // Add detailed special expenses
  addFieldWithBorder("Detailed Special Expenses / Detaillierte Sonderausgaben", formatBoolean(formData.deductions.hasSpecialExpensesDetailed));
  
  if (formData.deductions.hasSpecialExpensesDetailed) {
    addFieldWithBorder("Type / Art", safeRender(formData.deductions.specialExpensesType), "  ");
    addFieldWithBorder("Amount / Betrag", formatCurrency(formData.deductions.specialExpensesAmount), "  ");
  }
  
  // Add private insurance
  addFieldWithBorder("Private Insurance / Private Versicherung", formatBoolean(formData.deductions.hasPrivateInsurance));
  
  if (formData.deductions.hasPrivateInsurance) {
    addFieldWithBorder("Insurance Types / Versicherungsarten", safeRender(formData.deductions.insuranceTypes), "  ");
    addFieldWithBorder("Contributions / Beiträge", formatCurrency(formData.deductions.insuranceContributions), "  ");
  }
  
  // Add tax credits section
  addSectionTitleWithBorder("Tax Credits / Steuergutschriften");
  
  const taxCreditsFields = [
    ["Children Allowance / Kinderfreibetrag", formatCurrency(formData.taxCredits.childrenAllowance)],
    ["Home Office Deduction / Homeoffice-Pauschale", formatCurrency(formData.taxCredits.homeOfficeDeduction)],
    ["Donations / Spenden", formatCurrency(formData.taxCredits.donationsCharity)]
  ];
  
  taxCreditsFields.forEach(([label, value]) => {
    addFieldWithBorder(label, value);
  });
  
  // Add page numbers
  pdfGen['addPageNumbers']();
  
  // Save the PDF
  const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
  pdfGen['doc'].save(`tax-return-${formData.personalInfo.lastName}-${timestamp}.pdf`);
}; 