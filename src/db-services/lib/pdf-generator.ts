import { jsPDF } from 'jspdf';
import { type Form } from '@shared/schema';
import { FormData } from '@/types/form';
import languageData from "@/components/forms/self-disclosure/i18n/language.json";
import { firebaseService } from './firebase-service';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

type TextOptions = {
  align?: 'left' | 'center' | 'right' | 'justify';
  maxWidth?: number;
};

export class PDFGenerator {
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;
  private colWidth: number;
  private labelWidth: number;
  private valueWidth: number;
  private y: number;

  // Initialize a new PDF document
  private initializeNewDocument() {
    this.doc = new jsPDF();
    this.pageWidth = this.doc.internal.pageSize.width;
    this.pageHeight = this.doc.internal.pageSize.height;
    this.margin = 20;
    this.colWidth = (this.pageWidth - this.margin * 2) / 2;
    this.labelWidth = this.colWidth * 0.6;
    this.valueWidth = this.colWidth * 0.7;
    this.y = this.margin;
  }

  constructor() {
    this.initializeNewDocument();
  }

  private textAt(text: string, x: number, y: number, options?: TextOptions) {
    const xStr = x.toFixed(2);
    const yStr = y.toFixed(2);
    return (this.doc as any).text(text, xStr, yStr, options);
  }

  private addTitle(text: string) {
    this.doc.setFontSize(16);
    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor(0);
    
    this.doc.setDrawColor(0);
    this.doc.setLineWidth(0.1);
    this.doc.rect(this.margin, this.y - 10, this.pageWidth - this.margin * 2, 15);

    this.textAt(text, this.pageWidth / 2, this.y, { align: "center" });
    this.y += 15;
  }

  private addSectionTitle(text: string) {
    this.doc.setFontSize(14);
    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor(0, 0, 0);
    this.textAt(text, this.margin, this.y);
    this.doc.setLineWidth(0.1);
    this.doc.line(this.margin, this.y + 1, this.pageWidth - this.margin, this.y + 1);
    this.y += 8;
  }

  private addColumnHeaders(header: string) {
    const labelWidth = this.colWidth * 0.6;
    const valueWidth = this.colWidth * 0.7;
    
    this.doc.setFillColor(220, 220, 220);
    this.doc.rect(this.margin, this.y - 6, labelWidth, 8, "F");
    this.doc.rect(this.margin + labelWidth, this.y - 6, valueWidth, 8, "F");
    this.doc.rect(this.margin + labelWidth + valueWidth, this.y - 6, valueWidth, 8, "F");

    this.doc.setDrawColor(0);
    this.doc.setLineWidth(0.1);
    this.doc.rect(this.margin, this.y - 6, labelWidth, 8);
    this.doc.rect(this.margin + labelWidth, this.y - 6, valueWidth, 8);
    this.doc.rect(this.margin + labelWidth + valueWidth, this.y - 6, valueWidth, 8);

    this.doc.setFontSize(11);
    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor(0);
    this.textAt(header, this.margin + 2, this.y);
    this.textAt("Credit Applicant (A)", this.margin + labelWidth + 2, this.y);
    this.textAt("Credit Applicant (B)", this.margin + labelWidth + valueWidth + 2, this.y);
    this.y += 8;
  }

  private formatCurrency(value: string | number | undefined): string {
    if (!value) return "€0.00";
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return `€${numValue.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  private addChildren(children: Array<{ name: string; birthDate: string }>, x: number, y: number) {
    if (!children || children.length === 0) {
      this.textAt("No children", x, y);
      return y + 6;
    }

    children.forEach((child, index) => {
      this.textAt(
        `${index + 1}. ${child.name} - ${child.birthDate}`,
        x,
        y + (index * 6)
      );
    });

    return y + (children.length * 6);
  }


  private addField(label: string, valueA: any, valueB: any, isCurrency = false) {
    this.doc.setFontSize(9);
    this.doc.setTextColor(0);
    
    const labelWidth = this.colWidth * 0.6;
    const valueWidth = this.colWidth * 0.7;
    
    this.doc.setFillColor(240, 240, 240);
    this.doc.rect(this.margin, this.y - 4, labelWidth, 6, "F");
    
    this.doc.setDrawColor(0);
    this.doc.setLineWidth(0.1);
    this.doc.rect(this.margin, this.y - 4, labelWidth, 6);
    this.doc.rect(this.margin + labelWidth, this.y - 4, valueWidth, 6);
    this.doc.rect(this.margin + labelWidth + valueWidth, this.y - 4, valueWidth, 6);

    this.doc.setFont("helvetica", "normal");
    this.textAt(label, this.margin + 2, this.y);

    const formattedValueA = isCurrency ? this.formatCurrency(valueA) : valueA || '';
    const formattedValueB = isCurrency ? this.formatCurrency(valueB) : valueB || '';

    const maxTextWidth = valueWidth - 4;
    
    const truncateText = (text: string, width: number) => {
      if (this.doc.getTextWidth(text) > width) {
        while (text.length > 0 && this.doc.getTextWidth(text + '...') > width) {
          text = text.slice(0, -1);
        }
        return text + '...';
      }
      return text;
    };

    this.textAt(
      truncateText(formattedValueA.toString(), maxTextWidth),
      this.margin + labelWidth + 2,
      this.y
    );
    this.textAt(
      truncateText(formattedValueB.toString(), maxTextWidth),
      this.margin + labelWidth + valueWidth + 2,
      this.y
    );

    this.y += 6;
  }

  private addPersonalInfo(personalInfo: any) {
    this.y = this.margin;
    this.addSectionTitle("");
    this.addColumnHeaders("Personal Budget");

    // Helper function to get the actual nationality value
    const getNationality = (applicant: 'applicantA' | 'applicantB') => {
      const nationality = personalInfo[applicant]?.nationality;
      const actualNationality = personalInfo[applicant]?.actualNationality;
      
      // If nationality is "other" and we have an actual value, return that instead
      if (nationality === "other" && actualNationality) {
        return actualNationality;
      }
      
      return nationality;
    };

    // Helper function to get the actual occupation value
    const getOccupation = (applicant: 'applicantA' | 'applicantB') => {
      const occupation = personalInfo[applicant]?.occupation;
      const actualOccupation = personalInfo[applicant]?.actualOccupation;
      
      // If occupation is "other" and we have an actual value, return that instead
      if (occupation === "other" && actualOccupation) {
        return actualOccupation;
      }
      
      return occupation;
    };

    const personalFields = [
      ["Name", personalInfo.applicantA?.name, personalInfo.applicantB?.name],
      ["Birth Name", personalInfo.applicantA?.birthName, personalInfo.applicantB?.birthName],
      ["Address", personalInfo.applicantA?.address, personalInfo.applicantB?.address],
      ["Telephone", personalInfo.applicantA?.telephone, personalInfo.applicantB?.telephone],
      ["Email", personalInfo.applicantA?.email, personalInfo.applicantB?.email],
      ["Birth Date", personalInfo.applicantA?.birthDate, personalInfo.applicantB?.birthDate],
      ["Place of Birth", personalInfo.applicantA?.placeOfBirth, personalInfo.applicantB?.placeOfBirth],
      ["Nationality", getNationality('applicantA'), getNationality('applicantB')],
      ["Marital Status", personalInfo.applicantA?.maritalStatus, personalInfo.applicantB?.maritalStatus],
      ["Children", 
        personalInfo.applicantA?.hasChildren ? this.formatChildrenString(personalInfo.applicantA?.children) : "No children",
        personalInfo.applicantB?.hasChildren ? this.formatChildrenString(personalInfo.applicantB?.children) : "No children"
      ],
      ["Occupation", getOccupation('applicantA'), getOccupation('applicantB')],
      ["Occupation Since", personalInfo.applicantA?.occupationSince, personalInfo.applicantB?.occupationSince],
      ["Bank Details", personalInfo.applicantA?.bankDetails, personalInfo.applicantB?.bankDetails],
    ];

    personalFields.forEach(([label, valueA, valueB]) => {
      this.addField(label, valueA, valueB);
      this.y += 3;
    });
  }

  private formatChildrenString(children: Array<{ name: string; birthDate: string; placeOfBirth: string }> | undefined): string {
    if (!children || children.length === 0) return "No children";
    return children
      .map((child, index) => `${index + 1}. ${child.name} - ${child.birthDate} - ${child.placeOfBirth}`)
      .join("; ");
  }

  private addHouseholdBudget(budget: any) {
    this.doc.addPage();
    this.y = this.margin;
    this.addColumnHeaders("Household Budget");

    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "bold");
    this.textAt("Monthly Income", this.margin, this.y);
    this.y += 6;

    const incomeFields = [
      ["Monthly Net Income", budget.applicantA.monthlyNetIncome, budget.applicantB.monthlyNetIncome],
      ["Other Income", budget.applicantA.otherIncome, budget.applicantB.otherIncome],
      ["Family Income", budget.applicantA.familyIncome, budget.applicantB.familyIncome],
      ["Total Income", budget.applicantA.totalIncome, budget.applicantB.totalIncome],
    ];

    incomeFields.forEach(([label, valueA, valueB]) => {
      this.addField(label, valueA, valueB, true);
      this.y += 3;
    });

    this.y += 5;
    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "bold");
    this.textAt("Monthly Expenses", this.margin, this.y);
    this.y += 6;

    const expenseFields = [
      ["Rent", budget.rent, budget.rentB],
      ["Living Expenses", budget.applicantA.livingExpenses, budget.applicantB.livingExpenses],
      ["Savings Plans", budget.applicantA.savingsPlans, budget.applicantB.savingsPlans],
      ["Personal Loans", budget.applicantA.personalLoans, budget.applicantB.personalLoans],
      ["Property Loans", budget.applicantA.propertyLoans, budget.applicantB.propertyLoans],
      ["Other Expenses", budget.applicantA.otherExpenses, budget.applicantB.otherExpenses],
      ["Total Expenses", budget.applicantA.totalExpenses, budget.applicantB.totalExpenses],
      ["Total Available Capital", budget.applicantA.totalAvailableCapital, budget.applicantB.totalAvailableCapital],
      ["Additional Monthly Income", budget.applicantA.additionalMonthlyIncome, budget.applicantB.additionalMonthlyIncome],
    ];

    expenseFields.forEach(([label, valueA, valueB]) => {
      this.addField(label, valueA, valueB, true);
      this.y += 3;
    });
  }

  private addAssets(assets: any) {
    this.doc.addPage();
    this.y = this.margin;
   //this.addTitle("Assets Information");
    this.addColumnHeaders("Assets Information");

    const addAssetSection = (title: string, assetsA: string[], assetsB: string[]) => {
      this.doc.setFontSize(10);
      this.doc.setFont("helvetica", "bold");
      this.textAt(title, this.margin, this.y);
      this.y += 6;

      assetsA.forEach((asset, index) => {
        this.addField(`${index + 1}.`, asset, assetsB[index], true);
      });
      this.y += 3;
    };

    addAssetSection("Bank / Savings Accounts", assets.bankAccountsA || [], assets.bankAccountsB || []);
    addAssetSection("Building Society", assets.buildingSocietyA || [], assets.buildingSocietyB || []);
    addAssetSection("Life Insurance", assets.lifeInsuranceA || [], assets.lifeInsuranceB || []);
    addAssetSection("Property", assets.propertyA || [], assets.propertyB || []);
    addAssetSection("Other Assets", assets.otherAssetsA || [], assets.otherAssetsB || []);
    addAssetSection("Liabilities", assets.liabilitiesA || [], assets.liabilitiesB || []);
  }

  private addDeclarationAndSignatures(form: Form) {
    this.doc.addPage();
    this.y = this.margin;
    this.addTitle("Declaration and Signatures");

    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "normal");
    const declarationText1 = languageData.en.declaration_text1
    this.textAt(declarationText1, this.margin, this.y, {
      maxWidth: this.pageWidth - (this.margin * 2),
      align: "justify"
    });
    this.y += 30;

    const declarationText2 = languageData.en.declaration_text2
    this.textAt(declarationText2, this.margin, this.y, {
      maxWidth: this.pageWidth - (this.margin * 2),
      align: "justify"
    });
    this.y += 20;

    this.doc.setFont("helvetica", "bold");
    this.textAt("Date and Place:", this.margin, this.y);

    if (form.signature && typeof form.signature === 'string' && form.signature.startsWith('data:image')) {
      try {
        this.doc.addImage(form.signature, 'PNG', this.margin, this.y, 50, 30);
      } catch (error) {
        console.warn('Failed to add signature to PDF:', error);
      }
    }

    if (form.signatureB && typeof form.signatureB === 'string' && form.signatureB.startsWith('data:image')) {
      try {
        this.doc.addImage(form.signatureB, 'PNG', this.margin * 2 + this.colWidth, this.y, 50, 30);
      } catch (error) {
        console.warn('Failed to add signature to PDF:', error);
      }
    }

    this.doc.setDrawColor(0);
    this.doc.line(this.margin, this.y + 30, this.margin + 60, this.y + 30);
    this.textAt("SignatureA", this.margin, this.y + 35); 
    this.doc.line(this.margin * 2 + this.colWidth, this.y + 30, this.margin * 2 + this.colWidth + 60, this.y + 30);
    this.textAt("SignatureB", this.margin * 2 + this.colWidth, this.y + 35);
  }

  private addDeclarationAndSignaturesFromFormData(form: FormData) {
    this.doc.addPage();
    this.y = this.margin;
    this.addTitle("Declaration and Signatures");

    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "normal");


    const declarationText1 = languageData.en.declaration_text1
    this.textAt(declarationText1, this.margin, this.y, {
      maxWidth: this.pageWidth - (this.margin * 2),
      align: "justify"
    });
    this.y += 30;

    const declarationText2 = languageData.en.declaration_text2
    this.textAt(declarationText2, this.margin, this.y, {
      maxWidth: this.pageWidth - (this.margin * 2),
      align: "justify"
    });
    this.y += 20;

    this.doc.setFont("helvetica", "bold");
    this.textAt("Date and Place:", this.margin, this.y);
    if (form.signature.place && form.signature.date) {
      this.doc.setFont("helvetica", "normal");
      this.textAt(`${form.signature.place}, ${form.signature.date}`, this.margin + 50, this.y);
    }
    this.y += 20;

    const signatureWidth = 50;
    const signatureHeight = 30;

    const addSignature = (signature: string | undefined, x: number, y: number) => {
      if (signature && typeof signature === 'string' && signature.startsWith('data:image')) {
        try {
          this.doc.addImage(signature, 'PNG', x, y, signatureWidth, signatureHeight);
        } catch (error) {
          console.warn('Failed to add signature to PDF:', error);
        }
      }
    };

    addSignature(form.signature.signatureA || "", this.margin, this.y);
    this.doc.line(this.margin, this.y + signatureHeight, this.margin + signatureWidth + 10, this.y + signatureHeight);
    this.textAt("Signature Applicant A", this.margin, this.y + signatureHeight + 5);

    const signatureBX = this.margin + this.colWidth + this.margin;
    addSignature(form.signature.signatureB || "", signatureBX, this.y);
    this.doc.line(
      signatureBX,
      this.y + signatureHeight,
      signatureBX + signatureWidth + 10,
      this.y + signatureHeight
    );
    this.textAt("Signature Applicant B", signatureBX, this.y + signatureHeight + 5);

    // Add referred by to the PDF
    if (form.signature.referredBy) {
      this.doc.addPage();
      this.y = this.margin;
      this.addTitle("Referrence");
      this.doc.setFontSize(10);
      this.doc.setFont("helvetica", "normal");
      this.textAt("Referred by:", this.margin, this.y);
      this.doc.setFontSize(10);
      this.textAt(form.signature.referredBy, this.margin + 50, this.y);
    }
  }

  private addPageNumbers() {
    const totalPages = this.doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      this.doc.setPage(i);
      this.doc.setFontSize(8);
      this.doc.setTextColor(128);
      this.textAt(
        `Page ${i.toString()} of ${totalPages.toString()}`,
        this.pageWidth / 2,
        this.pageHeight - 10,
        { align: "center" }
      );
    }
  }

  async generatePDFFromFormData(form: FormData, formId: string): Promise<string> {
    // Initialize a new document for each generation
    this.initializeNewDocument();

    // Generate PDF
    this.addTitle("Self Disclosure Form");

    if (form.personalInfo) {
      this.addPersonalInfo(form.personalInfo);
    }

    if (form.householdBudget) {
      this.addHouseholdBudget(form.householdBudget);
    }

    if (form.assets) {
      this.addAssets(form.assets);
    }

    this.addDeclarationAndSignaturesFromFormData(form);
    this.addPageNumbers();

    // Convert PDF to blob
    //const pdfBlob = this.doc.output('blob');

    try {
      // Upload to Firebase and get URL
      //const downloadURL = await firebaseService.uploadPDF(pdfBlob, formId);
      
      // Also save locally if needed
      const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
      this.doc.save(`${timestamp}-${formId}.pdf`);

      //return downloadURL;
    } catch (error) {
      console.error('Error saving PDF to Firebase:', error);
      throw error;
    }
  }

  generatePDF(form: Form) {
    // Initialize a new document for each generation
    this.initializeNewDocument();

    this.addTitle("Self Disclosure Form");

    if (form.data?.personalInfo) {
      this.addPersonalInfo(form.data.personalInfo);
    }

    if (form.data?.householdBudget) {
      this.addHouseholdBudget(form.data.householdBudget);
    }

    if (form.data?.assets) {
      this.addAssets(form.data.assets);
    }

    this.addDeclarationAndSignatures(form);
    this.addPageNumbers();
    
    // Save the PDF with a unique timestamp
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
    this.doc.save(`${form.type}-${form.id}-${timestamp}.pdf`);
  }

  async generateElectricityPDF(formData: FormData, formId: string): Promise<void> {
    const doc = new jsPDF();
    let y = 20;

    // Add title
    doc.setFontSize(20);
    doc.text('Electricity Contract Form', 20, y);
    y += 20;

    // Add form data
    doc.setFontSize(12);
    doc.text(`Name: ${formData.firstName} ${formData.lastName}`, 20, y);
    y += 10;
    doc.text(`Email: ${formData.email}`, 20, y);
    y += 10;
    doc.text(`Mobile: ${formData.mobile}`, 20, y);
    y += 10;
    doc.text(`Address: ${formData.address}`, 20, y);
    y += 15;

    // Add consumption details
    doc.text(`Number of Persons: ${formData.numberOfPersons}`, 20, y);
    y += 10;
    doc.text(`Consumption (kWh/year): ${formData.consumption}`, 20, y);
    y += 20;

    // Add declaration
    doc.setFontSize(14);
    doc.text('Declaration', 20, y);
    y += 10;
    doc.setFontSize(10);
    doc.text(languageData.en.declaration_text1, 20, y, { maxWidth: 170 });
    y += 20;
    doc.text(languageData.en.declaration_text2, 20, y, { maxWidth: 170 });
    y += 20;

    // Add signature
    if (formData.signature.signatureData) {
      doc.addImage(formData.signature.signatureData, 'PNG', 20, y, 50, 30);
    }
    y += 35;

    // Add place and date
    doc.text(`Place: ${formData.signature.place}`, 20, y);
    y += 10;
    doc.text(`Date: ${formData.signature.date}`, 20, y);
    y += 15;

    // Add referral if exists
    if (formData.signature.referredBy) {
      doc.text(`Referred by: ${formData.signature.referredBy}`, 20, y);
    }


    /**
    const pdfBlob = doc.output('blob');
    const storage = getStorage();
    const pdfRef = storageRef(storage, `forms/electricity/${formId}.pdf`);
    await uploadBytes(pdfRef, pdfBlob);
    
    return await getDownloadURL(pdfRef);
    */
    
    // Save locally with timestamp
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
    doc.save(`electricity-form-${formId}-${timestamp}.pdf`);
  }
}

export const pdfGenerator = new PDFGenerator();
