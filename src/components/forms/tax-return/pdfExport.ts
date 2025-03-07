// Add expenses information
doc.addPage();
doc.setFontSize(16);
doc.setFont('helvetica', 'bold');
doc.text(`${languageData.de.deductions.title} / ${languageData.en.deductions.title}`, 20, 20);

doc.setFontSize(12);
doc.setFont('helvetica', 'normal');
let expensesY = 40;

// Work-related expenses
doc.setFont('helvetica', 'bold');
doc.text(`${languageData.de.deductions.workRelatedExpenses} / ${languageData.en.deductions.workRelatedExpenses}:`, 20, expensesY);
doc.setFont('helvetica', 'normal');
doc.text(`${formData.deductions.workRelatedExpenses} €`, 200, expensesY);
expensesY += 15;

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

// Craftsmen services
if (formData.deductions.hasCraftsmenPayments) {
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.deductions.hasCraftsmenServices} / ${languageData.en.deductions.hasCraftsmenServices}:`, 20, expensesY);
  doc.setFont('helvetica', 'normal');
  doc.text('Ja / Yes', 200, expensesY);
  expensesY += 15;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Craftsmen Amount:', 20, expensesY);
  doc.setFont('helvetica', 'normal');
  doc.text(`${formData.deductions.craftsmenAmount} €`, 200, expensesY);
  expensesY += 15;
}

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