// Add expenses information
doc.addPage();
doc.setFontSize(16);
doc.setFont('helvetica', 'bold');
doc.text(`${languageData.de.deductions.title} / ${languageData.en.deductions.title}`, 20, 20);

doc.setFontSize(12);
doc.setFont('helvetica', 'normal');
let expensesY = 40;

// Work-related expenses breakdown
const workRelatedExpenses = [
  { key: 'commutingExpenses', label: 'Commuting expenses' },
  { key: 'businessTripsCosts', label: 'Business trips and training' },
  { key: 'workEquipment', label: 'Work equipment' },
  { key: 'homeOfficeAllowance', label: 'Home office allowance' },
  { key: 'membershipFees', label: 'Membership fees & insurance' },
  { key: 'applicationCosts', label: 'Application costs' },
  { key: 'doubleHouseholdCosts', label: 'Double household management' }
];

workRelatedExpenses.forEach(expense => {
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.deductions[expense.key]} / ${languageData.en.deductions[expense.key]}:`, 20, expensesY);
  doc.setFont('helvetica', 'normal');
  doc.text(`${formData.deductions[expense.key]} €`, 200, expensesY);
  expensesY += 15;
});

// Special expenses
doc.setFont('helvetica', 'bold');
doc.text(`${languageData.de.deductions.specialExpenses} / ${languageData.en.deductions.specialExpenses}:`, 20, expensesY);
doc.setFont('helvetica', 'normal');
doc.text(`${formData.deductions.specialExpenses} €`, 200, expensesY);
expensesY += 15;

// Extraordinary expenses
doc.setFont('helvetica', 'bold');
doc.text(`${languageData.de.deductions.extraordinaryExpenses} / ${languageData.en.deductions.extraordinaryExpenses}:`, 20, expensesY);
doc.setFont('helvetica', 'normal');
doc.text(`${formData.deductions.extraordinaryExpenses} €`, 200, expensesY);
expensesY += 15;

// Insurance premiums
doc.setFont('helvetica', 'bold');
doc.text(`${languageData.de.deductions.insurancePremiums} / ${languageData.en.deductions.insurancePremiums}:`, 20, expensesY);
doc.setFont('helvetica', 'normal');
doc.text(`${formData.deductions.insurancePremiums} €`, 200, expensesY);
expensesY += 15;

// Maintenance payments
if (formData.deductions.hasMaintenancePayments) {
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.deductions.hasMaintenancePayments} / ${languageData.en.deductions.hasMaintenancePayments}:`, 20, expensesY);
  doc.setFont('helvetica', 'normal');
  doc.text('Ja / Yes', 200, expensesY);
  expensesY += 15;
  
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.deductions.maintenanceRecipient} / ${languageData.en.deductions.maintenanceRecipient}:`, 20, expensesY);
  doc.setFont('helvetica', 'normal');
  doc.text(formData.deductions.maintenanceRecipient || '', 200, expensesY);
  expensesY += 15;
  
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.deductions.maintenanceAmount} / ${languageData.en.deductions.maintenanceAmount}:`, 20, expensesY);
  doc.setFont('helvetica', 'normal');
  doc.text(`${formData.deductions.maintenanceAmount} €`, 200, expensesY);
  expensesY += 15;
  
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.deductions.recipientsAbroad} / ${languageData.en.deductions.recipientsAbroad}:`, 20, expensesY);
  doc.setFont('helvetica', 'normal');
  doc.text(formData.deductions.recipientsAbroad ? 'Ja / Yes' : 'Nein / No', 200, expensesY);
  expensesY += 15;
}

// Special expenses detailed
if (formData.deductions.hasSpecialExpensesDetailed) {
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.deductions.hasSpecialExpensesDetailed} / ${languageData.en.deductions.hasSpecialExpensesDetailed}:`, 20, expensesY);
  doc.setFont('helvetica', 'normal');
  doc.text('Ja / Yes', 200, expensesY);
  expensesY += 15;
  
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.deductions.specialExpensesType} / ${languageData.en.deductions.specialExpensesType}:`, 20, expensesY);
  doc.setFont('helvetica', 'normal');
  doc.text(formData.deductions.specialExpensesType || '', 200, expensesY);
  expensesY += 15;
  
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.deductions.specialExpensesAmount} / ${languageData.en.deductions.specialExpensesAmount}:`, 20, expensesY);
  doc.setFont('helvetica', 'normal');
  doc.text(`${formData.deductions.specialExpensesAmount} €`, 200, expensesY);
  expensesY += 15;
}

// Private insurance
if (formData.deductions.hasPrivateInsurance) {
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.deductions.hasPrivateInsurance} / ${languageData.en.deductions.hasPrivateInsurance}:`, 20, expensesY);
  doc.setFont('helvetica', 'normal');
  doc.text('Ja / Yes', 200, expensesY);
  expensesY += 15;
  
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.deductions.insuranceTypes} / ${languageData.en.deductions.insuranceTypes}:`, 20, expensesY);
  doc.setFont('helvetica', 'normal');
  doc.text(formData.deductions.insuranceTypes || '', 200, expensesY);
  expensesY += 15;
  
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.deductions.insuranceContributions} / ${languageData.en.deductions.insuranceContributions}:`, 20, expensesY);
  doc.setFont('helvetica', 'normal');
  doc.text(`${formData.deductions.insuranceContributions} €`, 200, expensesY);
  expensesY += 15;
}

// Inside the expenses section
const specialExpenses = [
  { key: 'churchTax', label: 'Church Tax' },
  { key: 'donationsAndFees', label: 'Donations and Membership Fees' },
  { key: 'childcareCosts', label: 'Childcare Costs' },
  { key: 'supportPayments', label: 'Support Payments' },
  { key: 'privateSchoolFees', label: 'Private School Fees' },
  { key: 'retirementProvisions', label: 'Retirement Provisions' },
  { key: 'otherInsuranceExpenses', label: 'Other Insurance Expenses' },
  { key: 'professionalTrainingCosts', label: 'Professional Training Costs' }
];

specialExpenses.forEach(expense => {
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.deductions[expense.key]} / ${languageData.en.deductions[expense.key]}:`, 20, expensesY);
  doc.setFont('helvetica', 'normal');
  doc.text(`${formData.deductions[expense.key]} €`, 200, expensesY);
  expensesY += 15;
});

// Extraordinary expenses
const extraordinaryExpenses = [
  { key: 'medicalExpenses', label: 'Medical Expenses' },
  { key: 'rehabilitationCosts', label: 'Rehabilitation Costs' },
  { key: 'careCosts', label: 'Care Costs' },
  { key: 'disabilityExpenses', label: 'Disability Expenses' },
  { key: 'funeralCosts', label: 'Funeral Costs' },
  { key: 'relativesSupportCosts', label: 'Support for Relatives' },
  { key: 'divorceCosts', label: 'Divorce Costs' }
];

extraordinaryExpenses.forEach(expense => {
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.deductions[expense.key]} / ${languageData.en.deductions[expense.key]}:`, 20, expensesY);
  doc.setFont('helvetica', 'normal');
  doc.text(`${formData.deductions[expense.key]} €`, 200, expensesY);
  expensesY += 15;
});

const insurancePremiums = [
  { key: 'statutoryHealthInsurance', label: 'Statutory Health Insurance' },
  { key: 'privateHealthInsurance', label: 'Private Health Insurance' },
  { key: 'statutoryPensionInsurance', label: 'Statutory Pension Insurance' },
  { key: 'privatePensionInsurance', label: 'Private Pension Insurance' },
  { key: 'unemploymentInsurance', label: 'Unemployment Insurance' },
  { key: 'accidentLiabilityInsurance', label: 'Accident and Liability Insurance' },
  { key: 'disabilityInsurance', label: 'Disability Insurance' },
  { key: 'termLifeInsurance', label: 'Term Life Insurance' }
];

insurancePremiums.forEach(insurance => {
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.deductions[insurance.key]} / ${languageData.en.deductions[insurance.key]}:`, 20, expensesY);
  doc.setFont('helvetica', 'normal');
  doc.text(`${formData.deductions[insurance.key]} €`, 200, expensesY);
  expensesY += 15;
});

const householdServices = [
  { key: 'householdServices', label: 'Household Services' },
  { key: 'craftsmenServices', label: 'Craftsmen Services' },
  { key: 'gardeningServices', label: 'Gardening Services' },
  { key: 'cleaningServices', label: 'Cleaning Services' },
  { key: 'caretakerServices', label: 'Caretaker Services' },
  { key: 'householdCareCosts', label: 'Care Costs' },
  { key: 'householdSupportServices', label: 'Support Services' },
  { key: 'chimneySweepFees', label: 'Chimney Sweep Fees' },
  { key: 'emergencySystemCosts', label: 'Emergency Systems' }
];

householdServices.forEach(service => {
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.deductions[service.key]} / ${languageData.en.deductions[service.key]}:`, 20, expensesY);
  doc.setFont('helvetica', 'normal');
  doc.text(`${formData.deductions[service.key]} €`, 200, expensesY);
  expensesY += 15;
}); 