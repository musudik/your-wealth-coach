import { jsPDF } from 'jspdf';
import { TaxFormData } from '../taxTypes';
import languageData from '../i18n/language.json';

export const exportTaxReturnToPdf = (formData: TaxFormData) => {
  const doc = new jsPDF();
  let y = 20;
  const margin = 20;
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Helper functions
  const textAt = (text: string, x: number, y: number, options?: any) => {
    const xStr = x.toFixed(2);
    const yStr = y.toFixed(2);
    return doc.text(text, xStr, yStr, options);
  };

  const addTitle = (text: string) => {
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    
    doc.setDrawColor(0);
    doc.setLineWidth(0.1);
    doc.rect(margin, y - 10, pageWidth - margin * 2, 15);

    textAt(text, pageWidth / 2, y, { align: "center" });
    y += 15;
  };

  const addSectionTitle = (text: string) => {
    // Check if we need a new page
    if (y > pageHeight - 40) {
      doc.addPage();
      y = 20;
    }
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    textAt(text, margin, y);
    doc.setLineWidth(0.1);
    doc.line(margin, y + 1, pageWidth - margin, y + 1);
    y += 8;
  };

  // New function for bilingual labels with German on top (black) and English below (gray)
  const addBilingualField = (germanLabel: string, englishLabel: string, value: any, isCurrency = false) => {
    // Check if we need a new page
    if (y > pageHeight - 25) {
      doc.addPage();
      y = 20;
    }
    
    const formattedValue = isCurrency 
      ? formatCurrency(value) 
      : (typeof value === 'boolean' 
          ? formatBoolean(value) 
          : (value || '-'));
    
    // German label in black
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    textAt(germanLabel, margin, y);
    
    // English label in gray below
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    textAt(englishLabel, margin, y + 4);
    
    // Value
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    textAt(formattedValue, margin + 120, y);
    
    y += 10; // Increased spacing for the stacked labels
  };

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined || value === null) return '€0,00';
    return `€${value.toFixed(2)}`.replace('.', ',');
  };

  const formatBoolean = (value: boolean | undefined) => {
    if (value === undefined || value === null) return '-';
    return value ? 'Ja / Yes' : 'Nein / No';
  };

  const addPageNumbers = () => {
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128);
      textAt(
        `Page ${i.toString()} of ${totalPages.toString()}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );
    }
  };

  // Start PDF Generation
  addTitle("Steuererklärung / Tax Return");
  
  // Add metadata
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  textAt(`Form ID: ${formData.id || 'Draft'}`, margin, y);
  textAt(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 60, y);
  y += 15;

  // 1. Personal Information
  addSectionTitle(`1. ${languageData.de.personalInfo.title} / ${languageData.en.personalInfo.title}`);
  
  // Personal info fields
  addBilingualField(
    languageData.de.personalInfo.firstName, 
    languageData.en.personalInfo.firstName, 
    formData.personalInfo.firstName
  );
  
  addBilingualField(
    languageData.de.personalInfo.lastName, 
    languageData.en.personalInfo.lastName, 
    formData.personalInfo.lastName
  );
  
  addBilingualField(
    languageData.de.personalInfo.dateOfBirth, 
    languageData.en.personalInfo.dateOfBirth, 
    formData.personalInfo.dateOfBirth
  );
  
  addBilingualField(
    languageData.de.personalInfo.taxId, 
    languageData.en.personalInfo.taxId, 
    formData.personalInfo.taxId
  );
  
  addBilingualField(
    languageData.de.personalInfo.email, 
    languageData.en.personalInfo.email, 
    formData.personalInfo.email
  );
  
  addBilingualField(
    languageData.de.personalInfo.phone, 
    languageData.en.personalInfo.phone, 
    formData.personalInfo.phone
  );
  
  addBilingualField(
    languageData.de.personalInfo.maritalStatus, 
    languageData.en.personalInfo.maritalStatus, 
    formData.personalInfo.maritalStatus
  );
  
  addBilingualField(
    languageData.de.questions.hasChildren, 
    languageData.en.questions.hasChildren, 
    formData.personalInfo.hasChildren
  );

  if (formData.personalInfo.hasChildren && formData.children && formData.children.length > 0) {
    y += 5;
    addSectionTitle(`${languageData.de.children.title} / ${languageData.en.children.title}`);
    
    formData.children.forEach((child, index) => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      textAt(`${languageData.de.children.title} ${index + 1}`, margin, y);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      textAt(`${languageData.en.children.title} ${index + 1}`, margin, y + 4);
      y += 10;
      
      addBilingualField(
        `  ${languageData.de.personalInfo.firstName}`, 
        `  ${languageData.en.personalInfo.firstName}`, 
        child.firstName
      );
      
      addBilingualField(
        `  ${languageData.de.personalInfo.lastName}`, 
        `  ${languageData.en.personalInfo.lastName}`, 
        child.lastName
      );
      
      addBilingualField(
        `  ${languageData.de.personalInfo.dateOfBirth}`, 
        `  ${languageData.en.personalInfo.dateOfBirth}`, 
        child.dateOfBirth
      );
      
      addBilingualField(
        `  ${languageData.de.personalInfo.taxId}`, 
        `  ${languageData.en.personalInfo.taxId}`, 
        child.taxId
      );
      
      y += 3;
    });
  }

  // 2. Employment Income
  doc.addPage();
  y = 20;
  addSectionTitle(`2. ${languageData.de.incomeInfo.title} / ${languageData.en.incomeInfo.title}`);
  
  addBilingualField(
    languageData.de.incomeInfo.isEmployed, 
    languageData.en.incomeInfo.isEmployed, 
    formData.incomeInfo.isEmployed
  );
  
  if (formData.incomeInfo.isEmployed) {
    addBilingualField(
      languageData.de.incomeInfo.employer, 
      languageData.en.incomeInfo.employer, 
      formData.incomeInfo.employer
    );
    
    addBilingualField(
      languageData.de.incomeInfo.employmentIncome, 
      languageData.en.incomeInfo.employmentIncome, 
      formData.incomeInfo.grossAnnualSalary, 
      true
    );
    
    addBilingualField(
      languageData.de.incomeInfo.hasTaxCertificate, 
      languageData.en.incomeInfo.hasTaxCertificate, 
      formData.incomeInfo.hasTaxCertificate
    );
    
    addBilingualField(
      languageData.de.incomeInfo.hasTravelSubsidy, 
      languageData.en.incomeInfo.hasTravelSubsidy, 
      formData.incomeInfo.hasTravelSubsidy
    );
  }

  // 3. Business Income
  addSectionTitle(`3. ${languageData.de.incomeInfo.businessTitle} / ${languageData.en.incomeInfo.businessTitle}`);
  
  addBilingualField(
    languageData.de.incomeInfo.isBusinessOwner, 
    languageData.en.incomeInfo.isBusinessOwner, 
    formData.incomeInfo.isBusinessOwner
  );
  
  if (formData.incomeInfo.isBusinessOwner) {
    addBilingualField(
      languageData.de.incomeInfo.businessType, 
      languageData.en.incomeInfo.businessType, 
      formData.incomeInfo.businessType
    );
    
    addBilingualField(
      languageData.de.incomeInfo.businessEarnings, 
      languageData.en.incomeInfo.businessEarnings, 
      formData.incomeInfo.businessEarnings, 
      true
    );
    
    addBilingualField(
      languageData.de.incomeInfo.businessExpenses, 
      languageData.en.incomeInfo.businessExpenses, 
      formData.incomeInfo.businessExpenses, 
      true
    );
  }

  // 4. Investments
  addSectionTitle(`4. ${languageData.de.incomeInfo.investmentsTitle} / ${languageData.en.incomeInfo.investmentsTitle}`);
  
  addBilingualField(
    languageData.de.incomeInfo.hasStockIncome, 
    languageData.en.incomeInfo.hasStockIncome, 
    formData.incomeInfo.hasStockIncome
  );
  
  if (formData.incomeInfo.hasStockIncome) {
    addBilingualField(
      languageData.de.incomeInfo.dividendEarnings, 
      languageData.en.incomeInfo.dividendEarnings, 
      formData.incomeInfo.dividendEarnings, 
      true
    );
    
    addBilingualField(
      languageData.de.incomeInfo.hasStockSales, 
      languageData.en.incomeInfo.hasStockSales, 
      formData.incomeInfo.hasStockSales
    );
    
    if (formData.incomeInfo.hasStockSales) {
      addBilingualField(
        languageData.de.incomeInfo.stockProfitLoss, 
        languageData.en.incomeInfo.stockProfitLoss, 
        formData.incomeInfo.stockProfitLoss, 
        true
      );
    }
    
    addBilingualField(
      languageData.de.incomeInfo.hasForeignStocks, 
      languageData.en.incomeInfo.hasForeignStocks, 
      formData.incomeInfo.hasForeignStocks
    );
    
    if (formData.incomeInfo.hasForeignStocks) {
      addBilingualField(
        languageData.de.incomeInfo.foreignTaxPaid, 
        languageData.en.incomeInfo.foreignTaxPaid, 
        formData.incomeInfo.foreignTaxPaid, 
        true
      );
    }
  }

  // 5. Expenses & Deductions
  doc.addPage();
  y = 20;
  addSectionTitle(`5. ${languageData.de.deductions.title} / ${languageData.en.deductions.title}`);
  
  // Work-related expenses
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  textAt(languageData.de.deductions.workRelatedExpenses, margin, y);
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  textAt(languageData.en.deductions.workRelatedExpenses, margin, y + 4);
  y += 10;
  
  const workExpenses = [
    { key: 'commutingExpenses', de: languageData.de.deductions.commutingExpenses, en: languageData.en.deductions.commutingExpenses },
    { key: 'businessTripsCosts', de: languageData.de.deductions.businessTripsCosts, en: languageData.en.deductions.businessTripsCosts },
    { key: 'workEquipment', de: languageData.de.deductions.workEquipment, en: languageData.en.deductions.workEquipment },
    { key: 'homeOfficeAllowance', de: languageData.de.deductions.homeOfficeAllowance, en: languageData.en.deductions.homeOfficeAllowance },
    { key: 'membershipFees', de: languageData.de.deductions.membershipFees, en: languageData.en.deductions.membershipFees },
    { key: 'applicationCosts', de: languageData.de.deductions.applicationCosts, en: languageData.en.deductions.applicationCosts }
  ];
  
  workExpenses.forEach(expense => {
    addBilingualField(expense.de, expense.en, formData.deductions[expense.key], true);
  });
  
  y += 5;
  
  // Special expenses
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  textAt(languageData.de.deductions.specialExpenses, margin, y);
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  textAt(languageData.en.deductions.specialExpenses, margin, y + 4);
  y += 10;
  
  const specialExpenses = [
    { key: 'churchTax', de: languageData.de.deductions.churchTax, en: languageData.en.deductions.churchTax },
    { key: 'donationsAndFees', de: languageData.de.deductions.donationsAndFees, en: languageData.en.deductions.donationsAndFees },
    { key: 'insurancePremiums', de: languageData.de.deductions.insurancePremiums, en: languageData.en.deductions.insurancePremiums }
  ];
  
  specialExpenses.forEach(expense => {
    addBilingualField(expense.de, expense.en, formData.deductions[expense.key], true);
  });

  // 6. Rental Income
  addSectionTitle(`6. ${languageData.de.incomeInfo.rentalTitle} / ${languageData.en.incomeInfo.rentalTitle}`);
  
  addBilingualField(
    languageData.de.incomeInfo.hasRentalProperty, 
    languageData.en.incomeInfo.hasRentalProperty, 
    formData.incomeInfo.hasRentalProperty
  );
  
  if (formData.incomeInfo.hasRentalProperty) {
    addBilingualField(
      languageData.de.incomeInfo.rentalIncome, 
      languageData.en.incomeInfo.rentalIncome, 
      formData.incomeInfo.rentalIncome, 
      true
    );
    
    addBilingualField(
      languageData.de.incomeInfo.rentalCosts, 
      languageData.en.incomeInfo.rentalCosts, 
      formData.incomeInfo.rentalCosts, 
      true
    );
  }

  // 7. Foreign Income
  addSectionTitle(`7. ${languageData.de.incomeInfo.foreignTitle} / ${languageData.en.incomeInfo.foreignTitle}`);
  
  addBilingualField(
    languageData.de.incomeInfo.hasForeignIncome, 
    languageData.en.incomeInfo.hasForeignIncome, 
    formData.incomeInfo.hasForeignIncome
  );
  
  if (formData.incomeInfo.hasForeignIncome) {
    addBilingualField(
      languageData.de.incomeInfo.foreignIncomeCountry, 
      languageData.en.incomeInfo.foreignIncomeCountry, 
      formData.incomeInfo.foreignIncomeCountry
    );
    
    addBilingualField(
      languageData.de.incomeInfo.foreignIncomeType, 
      languageData.en.incomeInfo.foreignIncomeType, 
      formData.incomeInfo.foreignIncomeType
    );
    
    addBilingualField(
      languageData.de.incomeInfo.foreignIncomeAmount, 
      languageData.en.incomeInfo.foreignIncomeAmount, 
      formData.incomeInfo.foreignIncomeAmount, 
      true
    );
  }

  // 8. Declaration and Signature
  doc.addPage();
  y = 20;
  addTitle(`${languageData.de.signature.title} / ${languageData.en.signature.title}`);
  
  // Add declaration text
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  
  const declarationText = {
    de: "Ich versichere, dass ich die Angaben in dieser Steuererklärung wahrheitsgemäß nach bestem Wissen und Gewissen gemacht habe. Die beigefügten Unterlagen und Belege sind vollständig und authentisch.",
    en: "I declare that the information provided in this tax return is true and correct to the best of my knowledge and belief. All attached documents and receipts are complete and authentic."
  };

  textAt(declarationText.de, margin, y, { maxWidth: pageWidth - (margin * 2), align: "justify" });
  y += 25;
  
  doc.setTextColor(100, 100, 100);
  textAt(declarationText.en, margin, y, { maxWidth: pageWidth - (margin * 2), align: "justify" });
  y += 25;

  // Signature details
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  textAt(languageData.de.signature.place, margin, y);
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  textAt(languageData.en.signature.place, margin, y + 4);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  textAt(formData.signature?.place || '', margin + 50, y);
  y += 12;
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  textAt(languageData.de.signature.date, margin, y);
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  textAt(languageData.en.signature.date, margin, y + 4);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  textAt(formData.signature?.date || '', margin + 50, y);
  y += 12;
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  textAt(languageData.de.signature.time, margin, y);
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  textAt(languageData.en.signature.time, margin, y + 4);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  textAt(formData.signature?.time || '', margin + 50, y);
  y += 20;

  // Add signature image if available
  if (formData.signature?.signature) {
    try {
      doc.addImage(
        formData.signature.signature,
        'PNG',
        margin,
        y,
        80,
        40
      );
      
      // Add signature line
      y += 45;
      doc.line(margin, y, margin + 80, y);
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      textAt(languageData.de.signature.signature, margin, y + 5);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      textAt(languageData.en.signature.signature, margin, y + 9);
    } catch (error) {
      console.warn('Failed to add signature to PDF:', error);
    }
  } else {
    // Just add a signature line if no image
    doc.line(margin, y + 40, margin + 80, y + 40);
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    textAt(languageData.de.signature.signature, margin, y + 45);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    textAt(languageData.en.signature.signature, margin, y + 49);
  }

  // Add page numbers
  addPageNumbers();

  // Save the PDF
  doc.save(`tax-return-${formData.id || 'draft'}.pdf`);
}; 