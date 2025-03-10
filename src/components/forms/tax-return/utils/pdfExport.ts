import { jsPDF } from 'jspdf';
import { TaxFormData } from '../taxTypes';
import languageData from '../i18n/language.json';

export const exportTaxReturnToPdf = (formData: TaxFormData) => {
  const doc = new jsPDF();
  let yPosition = 20;
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const contentWidth = pageWidth - (2 * margin);

  // Helper functions
  const addTitle = (text: string) => {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(text, margin, yPosition);
    yPosition += 10;
  };

  const addSubtitle = (text: string) => {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(text, margin, yPosition);
    yPosition += 8;
  };

  const addField = (label: string, value: any) => {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`${label}:`, margin, yPosition);
    doc.text(String(value || '-'), margin + 100, yPosition);
    yPosition += 7;
  };

  const addSectionBreak = () => {
    yPosition += 10;
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
  };

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined || value === null) return '€0,00';
    return `€${value.toFixed(2)}`.replace('.', ',');
  };

  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('STEUERERKLÄRUNG / TAX RETURN', margin, yPosition);
  yPosition += 15;

  // Add form metadata
  addField('Form ID', formData.id || '-');
  addField('Status', formData.status || 'draft');
  addField('Date', new Date().toLocaleDateString());
  addSectionBreak();

  // 1. Personal Information Section
  addTitle('1. Personal Information / Persönliche Informationen');
  addField('First Name / Vorname', formData.personalInfo.firstName);
  addField('Last Name / Nachname', formData.personalInfo.lastName);
  addField('Date of Birth / Geburtsdatum', formData.personalInfo.dateOfBirth);
  addField('Tax ID / Steuer-ID', formData.personalInfo.taxId);
  addField('Email / E-Mail', formData.personalInfo.email);
  addField('Phone / Telefon', formData.personalInfo.phone);
  addField('Marital Status / Familienstand', formData.personalInfo.maritalStatus);

  if (formData.personalInfo.hasChildren) {
    addSectionBreak();
    addSubtitle('Children / Kinder');
    formData.children?.forEach((child, index) => {
      addField(`Child ${index + 1} Name`, `${child.firstName} ${child.lastName}`);
      addField(`Child ${index + 1} Date of Birth`, child.dateOfBirth);
      addField(`Child ${index + 1} Tax ID`, child.taxId);
    });
  }
  addSectionBreak();

  // 2. Employment Income Section
  doc.addPage();
  yPosition = 20;
  addTitle('2. Employment Income / Einkünfte aus Anstellung');
  if (formData.incomeInfo.isEmployed) {
    addField('Employer / Arbeitgeber', formData.incomeInfo.employer);
    addField('Gross Annual Salary', formatCurrency(formData.incomeInfo.grossAnnualSalary));
    addField('Tax Certificate Available', formData.incomeInfo.hasTaxCertificate ? 'Yes / Ja' : 'No / Nein');
  } else {
    addField('Employment Status', 'Not Employed / Nicht angestellt');
  }
  addSectionBreak();

  // 3. Expenses & Deductions Section
  addTitle('3. Expenses & Deductions / Ausgaben & Abzüge');
  const deductionCategories = [
    { title: 'Work-Related Expenses / Werbungskosten', items: [
      { key: 'commutingExpenses', label: 'Commuting Expenses / Fahrtkosten' },
      { key: 'workEquipment', label: 'Work Equipment / Arbeitsmittel' },
      { key: 'homeOfficeAllowance', label: 'Home Office / Homeoffice-Pauschale' }
    ]},
    { title: 'Special Expenses / Sonderausgaben', items: [
      { key: 'insurancePremiums', label: 'Insurance Premiums / Versicherungsbeiträge' },
      { key: 'retirementProvisions', label: 'Retirement Provisions / Altersvorsorge' },
      { key: 'donationsAndFees', label: 'Donations / Spenden' }
    ]}
  ];

  deductionCategories.forEach(category => {
    addSubtitle(category.title);
    category.items.forEach(item => {
      addField(item.label, formatCurrency(formData.deductions[item.key]));
    });
    addSectionBreak();
  });

  // 4. Signature Section
  doc.addPage();
  yPosition = 20;
  addTitle('4. Declaration and Signature / Erklärung und Unterschrift');
  
  // Add declaration text
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  const declarationText = {
    de: "Ich versichere, dass ich die Angaben in dieser Steuererklärung wahrheitsgemäß nach bestem Wissen und Gewissen gemacht habe.",
    en: "I declare that the information provided in this tax return is true and correct to the best of my knowledge and belief."
  };

  doc.text(declarationText.de, margin, yPosition, { maxWidth: contentWidth });
  yPosition += 20;
  doc.text(declarationText.en, margin, yPosition, { maxWidth: contentWidth });
  yPosition += 30;

  // Add signature details
  addField('Place / Ort', formData.signature?.place || '');
  addField('Date / Datum', formData.signature?.date || '');
  addField('Time / Uhrzeit', formData.signature?.time || '');

  // Add signature image if available
  if (formData.signature?.signature) {
    yPosition += 10;
    doc.addImage(
      formData.signature.signature,
      'PNG',
      margin,
      yPosition,
      100,
      40
    );
  }

  // Save the PDF
  doc.save(`tax-return-${formData.id || 'draft'}.pdf`);
}; 