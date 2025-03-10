import React from 'react';
import { Label } from '@/components/ui/label';
import { FormSection } from "@/components/ui/form-section";
import { TaxFormData } from '../taxTypes';
import languageData from '../i18n/language.json';

interface PersonalInfoStepProps {
  formData: TaxFormData;
  handleChange: (section: keyof TaxFormData, field: string, value: any) => void;
  handleAddressChange: (field: string, value: string) => void;
  validationErrors: Record<string, any> | null;
  hasError: (section: string, field: string) => boolean;
  setFormData: React.Dispatch<React.SetStateAction<TaxFormData>>;
  onFormDataChange: (updatedFormData: TaxFormData) => void;
  showValidationErrors: boolean;
  getInputClass?: (section: string, field: string) => string;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  formData,
  handleChange,
  handleAddressChange,
  validationErrors,
  hasError,
  setFormData,
  onFormDataChange,
  showValidationErrors
}) => {
  // List of countries for the dropdown
  const countries = [
    { value: 'germany', label: { de: languageData.de.countries.germany, en: languageData.en.countries.germany } },
    { value: 'austria', label: { de: languageData.de.countries.austria, en: languageData.en.countries.austria } },
    { value: 'switzerland', label: { de: languageData.de.countries.switzerland, en: languageData.en.countries.switzerland } },
    { value: 'france', label: { de: languageData.de.countries.france, en: languageData.en.countries.france } },
    { value: 'italy', label: { de: languageData.de.countries.italy, en: languageData.en.countries.italy } },
    { value: 'spain', label: { de: languageData.de.countries.spain, en: languageData.en.countries.spain } },
    { value: 'netherlands', label: { de: languageData.de.countries.netherlands, en: languageData.en.countries.netherlands } },
    { value: 'belgium', label: { de: languageData.de.countries.belgium, en: languageData.en.countries.belgium } },
    { value: 'luxembourg', label: { de: languageData.de.countries.luxembourg, en: languageData.en.countries.luxembourg } },
    { value: 'uk', label: { de: languageData.de.countries.uk, en: languageData.en.countries.uk } },
    { value: 'usa', label: { de: languageData.de.countries.usa, en: languageData.en.countries.usa } },
    { value: 'canada', label: { de: languageData.de.countries.canada, en: languageData.en.countries.canada } },
    { value: 'other', label: { de: languageData.de.countries.other, en: languageData.en.countries.other } }
  ];

  // Helper function to handle address changes
  const handleAddressChangeHelper = (field: string, value: string) => {
    handleChange('personalInfo', `address.${field}`, value);
  };

  return (
    <FormSection title={`${languageData.de.personalInfo.title} / ${languageData.en.personalInfo.title}`}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="block space-y-1">
              <span>{languageData.de.personalInfo.firstName}</span>
              <span className="text-sm text-gray-600 block">{languageData.en.personalInfo.firstName}</span>
            </Label>
            <input
              type="text"
              value={formData.personalInfo.firstName}
              onChange={(e) => handleChange('personalInfo', 'firstName', e.target.value)}
              className={validationErrors?.personalInfo?.firstName ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
              required
            />
            {hasError('personalInfo', 'firstName') && (
              <p className="mt-1 text-sm text-red-600">This field is required</p>
            )}
          </div>
          
          <div>
            <Label className="block space-y-1">
              <span>{languageData.de.personalInfo.lastName}</span>
              <span className="text-sm text-gray-600 block">{languageData.en.personalInfo.lastName}</span>
            </Label>
            <input
              type="text"
              value={formData.personalInfo.lastName}
              onChange={(e) => handleChange('personalInfo', 'lastName', e.target.value)}
              className={validationErrors?.personalInfo?.lastName ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
              required
            />
            {hasError('personalInfo', 'lastName') && (
              <p className="mt-1 text-sm text-red-600">This field is required</p>
            )}
          </div>
          
          <div>
            <Label className="block space-y-1">
              <span>{languageData.de.personalInfo.taxId}</span>
              <span className="text-sm text-gray-600 block">{languageData.en.personalInfo.taxId}</span>
            </Label>
            <input
              type="text"
              value={formData.personalInfo.taxId}
              onChange={(e) => handleChange('personalInfo', 'taxId', e.target.value)}
              className={validationErrors?.personalInfo?.taxId ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
              required
            />
            {hasError('personalInfo', 'taxId') && (
              <p className="mt-1 text-sm text-red-600">This field is required</p>
            )}
          </div>
          
          <div>
            <Label className="block space-y-1">
              <span>{languageData.de.personalInfo.dateOfBirth}</span>
              <span className="text-sm text-gray-600 block">{languageData.en.personalInfo.dateOfBirth}</span>
            </Label>
            <input
              type="date"
              value={formData.personalInfo.dateOfBirth}
              onChange={(e) => handleChange('personalInfo', 'dateOfBirth', e.target.value)}
              className={validationErrors?.personalInfo?.dateOfBirth ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
              required
            />
            {hasError('personalInfo', 'dateOfBirth') && (
              <p className="mt-1 text-sm text-red-600">This field is required</p>
            )}
          </div>
          
          <div>
            <Label className="block space-y-1">
              <span>{languageData.de.personalInfo.maritalStatus}</span>
              <span className="text-sm text-gray-600 block">{languageData.en.personalInfo.maritalStatus}</span>
            </Label>
            <select
              value={formData.personalInfo.maritalStatus}
              onChange={(e) => handleChange('personalInfo', 'maritalStatus', e.target.value)}
              className={validationErrors?.personalInfo?.maritalStatus ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
              required
            >
              <option value="">Select / Auswählen</option>
              <option value="single">Single / Ledig</option>
              <option value="married">Married / Verheiratet</option>
              <option value="divorced">Divorced / Geschieden</option>
              <option value="widowed">Widowed / Verwitwet</option>
            </select>
            {hasError('personalInfo', 'maritalStatus') && (
              <p className="mt-1 text-sm text-red-600">This field is required</p>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">{languageData.de.personalInfo.address.title} / {languageData.en.personalInfo.address.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.personalInfo.address.street}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.personalInfo.address.street}</span>
              </Label>
              <input
                type="text"
                value={formData.personalInfo.address.street}
                onChange={(e) => handleAddressChangeHelper('street', e.target.value)}
                className={validationErrors?.personalInfo?.address?.street ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                required
              />
              {validationErrors?.personalInfo?.address?.street && (
                <p className="mt-1 text-sm text-red-600">This field is required</p>
              )}
            </div>
            
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.personalInfo.address.houseNumber}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.personalInfo.address.houseNumber}</span>
              </Label>
              <input
                type="text"
                value={formData.personalInfo.address.houseNumber}
                onChange={(e) => handleAddressChangeHelper('houseNumber', e.target.value)}
                className={validationErrors?.personalInfo?.address?.houseNumber ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                required
              />
              {validationErrors?.personalInfo?.address?.houseNumber && (
                <p className="mt-1 text-sm text-red-600">This field is required</p>
              )}
            </div>
            
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.personalInfo.address.postalCode}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.personalInfo.address.postalCode}</span>
              </Label>
              <input
                type="text"
                value={formData.personalInfo.address.postalCode}
                onChange={(e) => handleAddressChangeHelper('postalCode', e.target.value)}
                className={validationErrors?.personalInfo?.address?.postalCode ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                required
              />
              {validationErrors?.personalInfo?.address?.postalCode && (
                <p className="mt-1 text-sm text-red-600">This field is required</p>
              )}
            </div>
            
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.personalInfo.address.city}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.personalInfo.address.city}</span>
              </Label>
              <input
                type="text"
                value={formData.personalInfo.address.city}
                onChange={(e) => handleAddressChangeHelper('city', e.target.value)}
                className={validationErrors?.personalInfo?.address?.city ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                required
              />
              {validationErrors?.personalInfo?.address?.city && (
                <p className="mt-1 text-sm text-red-600">This field is required</p>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="hasForeignResidence"
              checked={formData.personalInfo.hasForeignResidence || false}
              onChange={(e) => handleChange('personalInfo', 'hasForeignResidence', e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="hasForeignResidence" className="ml-2 block">
              <span>{languageData.de.personalInfo.foreignResidence.hasResidence}</span>
              <span className="text-sm text-gray-600 block">{languageData.en.personalInfo.foreignResidence.hasResidence}</span>
            </label>
          </div>
          
          {formData.personalInfo.hasForeignResidence && (
            <div className="ml-6 space-y-4">
              <div>
                <Label className="block space-y-1">
                  <span>{languageData.de.personalInfo.foreignResidence.country}</span>
                  <span className="text-sm text-gray-600 block">{languageData.en.personalInfo.foreignResidence.country}</span>
                </Label>
                <select
                  value={formData.personalInfo.foreignResidenceCountry || ''}
                  onChange={(e) => handleChange('personalInfo', 'foreignResidenceCountry', e.target.value)}
                  className={validationErrors?.personalInfo?.foreignResidenceCountry ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                >
                  <option value="">{languageData.de.common.select} / {languageData.en.common.select}</option>
                  {countries.map(country => (
                    <option key={country.value} value={country.value}>
                      {country.label.de} / {country.label.en}
                    </option>
                  ))}
                </select>
                {validationErrors?.personalInfo?.foreignResidenceCountry && (
                  <p className="mt-1 text-sm text-red-600">This field is required</p>
                )}
              </div>
              
              {formData.personalInfo.foreignResidenceCountry === 'other' && (
                <div>
                  <Label className="block space-y-1">
                    <span>{languageData.de.personalInfo.foreignResidence.otherCountry}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.personalInfo.foreignResidence.otherCountry}</span>
                  </Label>
                  <input
                    type="text"
                    value={formData.personalInfo.otherForeignResidenceCountry || ''}
                    onChange={(e) => handleChange('personalInfo', 'otherForeignResidenceCountry', e.target.value)}
                    className={validationErrors?.personalInfo?.otherForeignResidenceCountry ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                  />
                  {validationErrors?.personalInfo?.otherForeignResidenceCountry && (
                    <p className="mt-1 text-sm text-red-600">This field is required</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="hasSpouse"
              checked={formData.personalInfo.hasSpouse || false}
              onChange={(e) => handleChange('personalInfo', 'hasSpouse', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="hasSpouse" className="ml-2">
              <span>Angaben zum Ehepartner hinzufügen</span>
              <span className="text-sm text-gray-600 block">Add spouse details</span>
            </label>
          </div>
          
          {formData.personalInfo.hasSpouse && (
            <div className="ml-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="block space-y-1">
                    <span>Vorname des Ehepartners</span>
                    <span className="text-sm text-gray-600 block">Spouse's first name</span>
                  </Label>
                  <input
                    type="text"
                    value={formData.personalInfo.spouseFirstName || ''}
                    onChange={(e) => handleChange('personalInfo', 'spouseFirstName', e.target.value)}
                    className={validationErrors?.personalInfo?.spouseFirstName ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                  />
                  {hasError('personalInfo', 'spouseFirstName') && (
                    <p className="mt-1 text-sm text-red-600">This field is required</p>
                  )}
                </div>
                
                <div>
                  <Label className="block space-y-1">
                    <span>Nachname des Ehepartners</span>
                    <span className="text-sm text-gray-600 block">Spouse's last name</span>
                  </Label>
                  <input
                    type="text"
                    value={formData.personalInfo.spouseLastName || ''}
                    onChange={(e) => handleChange('personalInfo', 'spouseLastName', e.target.value)}
                    className={validationErrors?.personalInfo?.spouseLastName ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                  />
                  {hasError('personalInfo', 'spouseLastName') && (
                    <p className="mt-1 text-sm text-red-600">This field is required</p>
                  )}
                </div>
              </div>
              
              <div>
                <Label className="block space-y-1">
                  <span>Geburtsdatum des Ehepartners</span>
                  <span className="text-sm text-gray-600 block">Spouse's date of birth</span>
                </Label>
                <input
                  type="date"
                  value={formData.personalInfo.spouseDateOfBirth || ''}
                  onChange={(e) => handleChange('personalInfo', 'spouseDateOfBirth', e.target.value)}
                  className={validationErrors?.personalInfo?.spouseDateOfBirth ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                />
                {hasError('personalInfo', 'spouseDateOfBirth') && (
                  <p className="mt-1 text-sm text-red-600">This field is required</p>
                )}
              </div>
              
              <div>
                <Label className="block space-y-1">
                  <span>Steuer-ID des Ehepartners</span>
                  <span className="text-sm text-gray-600 block">Spouse's tax ID</span>
                </Label>
                <input
                  type="text"
                  value={formData.personalInfo.spouseTaxId || ''}
                  onChange={(e) => handleChange('personalInfo', 'spouseTaxId', e.target.value)}
                  className={validationErrors?.personalInfo?.spouseTaxId ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                />
                {hasError('personalInfo', 'spouseTaxId') && (
                  <p className="mt-1 text-sm text-red-600">This field is required</p>
                )}
              </div>
              
              <div>
                <Label className="block space-y-1">
                  <span>Hat Ihr Ehepartner ein eigenes Einkommen?</span>
                  <span className="text-sm text-gray-600 block">Does your spouse have their own income?</span>
                </Label>
                <div className="flex space-x-4 mt-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="spouseIncomeNo"
                      name="spouseHasIncome"
                      checked={formData.personalInfo.spouseHasIncome === false}
                      onChange={() => handleChange('personalInfo', 'spouseHasIncome', false)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="spouseIncomeNo" className="ml-2">Nein / No</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="spouseIncomeYes"
                      name="spouseHasIncome"
                      checked={formData.personalInfo.spouseHasIncome === true}
                      onChange={() => handleChange('personalInfo', 'spouseHasIncome', true)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="spouseIncomeYes" className="ml-2">Ja / Yes</label>
                  </div>
                </div>
              </div>
              
              {formData.personalInfo.spouseHasIncome && (
                <div>
                  <Label className="block space-y-1">
                    <span>Welche Art von Einkommen hat Ihr Ehepartner?</span>
                    <span className="text-sm text-gray-600 block">If yes, what type of income does your spouse have?</span>
                  </Label>
                  <input
                    type="text"
                    value={formData.personalInfo.spouseIncomeType || ''}
                    onChange={(e) => handleChange('personalInfo', 'spouseIncomeType', e.target.value)}
                    className={validationErrors?.personalInfo?.spouseIncomeType ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                  />
                  {hasError('personalInfo', 'spouseIncomeType') && (
                    <p className="mt-1 text-sm text-red-600">This field is required</p>
                  )}
                </div>
              )}
              
              <div>
                <Label className="block space-y-1">
                  <span>Werden Sie und Ihr Ehepartner gemeinsam besteuert (Zusammenveranlagung)?</span>
                  <span className="text-sm text-gray-600 block">Are you and your spouse taxed together (joint taxation)?</span>
                </Label>
                <div className="flex space-x-4 mt-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="jointTaxationNo"
                      name="jointTaxation"
                      checked={formData.personalInfo.jointTaxation === false}
                      onChange={() => handleChange('personalInfo', 'jointTaxation', false)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="jointTaxationNo" className="ml-2">Nein / No</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="jointTaxationYes"
                      name="jointTaxation"
                      checked={formData.personalInfo.jointTaxation === true}
                      onChange={() => handleChange('personalInfo', 'jointTaxation', true)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="jointTaxationYes" className="ml-2">Ja / Yes</label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="hasChildren"
              checked={formData.personalInfo.hasChildren || false}
              onChange={(e) => {
                handleChange('personalInfo', 'hasChildren', e.target.checked);
                
                if (e.target.checked) {
                  const newChild = { 
                    id: `child-${Date.now()}`, 
                    firstName: '', 
                    lastName: '', 
                    dateOfBirth: '', 
                    taxId: '' 
                  };
                  
                  if (typeof window !== 'undefined') {
                    setTimeout(() => {
                      try {
                        const parentFormData = formData;
                        
                        parentFormData.children = [newChild];
                        
                        handleChange('personalInfo', 'lastUpdated', Date.now());
                        
                        console.log('Initialized children array directly:', parentFormData.children);
                      } catch (error) {
                        console.error('Failed to initialize children array directly:', error);
                      }
                    }, 0);
                  }
                }
              }}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="hasChildren" className="ml-2">
              <span>Haben Sie Kinder?</span>
              <span className="text-sm text-gray-600 block">Do you have children?</span>
            </label>
          </div>
          
          {formData.personalInfo.hasChildren && (
            <div className="ml-6 space-y-4">
              <div className="text-xs text-gray-500">
                Children count: {Array.isArray(formData.children) ? formData.children.length : 0}
                <button 
                  onClick={() => console.log('Current formData:', formData)} 
                  className="ml-2 text-blue-500 underline"
                >
                  Log formData
                </button>
              </div>
              
              {Array.isArray(formData.children) && formData.children.length > 0 ? (
                <div className="space-y-4">
                  {formData.children.map((child, index) => (
                    <div key={child.id || index} className="border p-4 rounded-md">
                      <h4 className="font-medium mb-2">Child {index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="block space-y-1">
                            <span>{languageData.de.children.firstName}</span>
                            <span className="text-sm text-gray-600 block">{languageData.en.children.firstName}</span>
                          </Label>
                          <input
                            type="text"
                            value={child.firstName || ''}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              if (typeof window !== 'undefined') {
                                setTimeout(() => {
                                  try {
                                    // Create a deep copy of the children array
                                    const currentChildren = JSON.parse(JSON.stringify(formData.children || []));
                                    
                                    // Update the specific child's property
                                    currentChildren[index] = {
                                      ...currentChildren[index],
                                      firstName: newValue
                                    };
                                    
                                    // Update the entire children array
                                    formData.children = currentChildren;
                                    
                                    // Force a re-render
                                    handleChange('personalInfo', 'lastUpdated', Date.now());
                                    
                                    console.log(`Updated child ${index} firstName to "${newValue}"`, currentChildren);
                                  } catch (error) {
                                    console.error('Failed to update child firstName:', error);
                                  }
                                }, 0);
                              }
                            }}
                            className={`w-full p-2 border rounded-md ${
                              validationErrors?.children?.[index]?.firstName ? 'border-red-500' : ''
                            }`}
                          />
                          {validationErrors?.children?.[index]?.firstName && (
                            <p className="mt-1 text-sm text-red-600">{languageData.en.validation.required}</p>
                          )}
                        </div>
                        <div>
                          <Label className="block space-y-1">
                            <span>{languageData.de.children.lastName}</span>
                            <span className="text-sm text-gray-600 block">{languageData.en.children.lastName}</span>
                          </Label>
                          <input
                            type="text"
                            value={child.lastName || ''}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              if (typeof window !== 'undefined') {
                                setTimeout(() => {
                                  try {
                                    // Create a deep copy of the children array
                                    const currentChildren = JSON.parse(JSON.stringify(formData.children || []));
                                    
                                    // Update the specific child's property
                                    currentChildren[index] = {
                                      ...currentChildren[index],
                                      lastName: newValue
                                    };
                                    
                                    // Update the entire children array
                                    formData.children = currentChildren;
                                    
                                    // Force a re-render
                                    handleChange('personalInfo', 'lastUpdated', Date.now());
                                    
                                    console.log(`Updated child ${index} lastName to "${newValue}"`, currentChildren);
                                  } catch (error) {
                                    console.error('Failed to update child lastName:', error);
                                  }
                                }, 0);
                              }
                            }}
                            className={`w-full p-2 border rounded-md ${
                              validationErrors?.children?.[index]?.lastName ? 'border-red-500' : ''
                            }`}
                          />
                          {validationErrors?.children?.[index]?.lastName && (
                            <p className="mt-1 text-sm text-red-600">{languageData.en.validation.required}</p>
                          )}
                        </div>
                        <div>
                          <Label className="block space-y-1">
                            <span>{languageData.de.children.dateOfBirth}</span>
                            <span className="text-sm text-gray-600 block">{languageData.en.children.dateOfBirth}</span>
                          </Label>
                          <input
                            type="date"
                            value={child.dateOfBirth || ''}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              if (typeof window !== 'undefined') {
                                setTimeout(() => {
                                  try {
                                    // Create a deep copy of the children array
                                    const currentChildren = JSON.parse(JSON.stringify(formData.children || []));
                                    
                                    // Update the specific child's property
                                    currentChildren[index] = {
                                      ...currentChildren[index],
                                      dateOfBirth: newValue
                                    };
                                    
                                    // Update the entire children array
                                    formData.children = currentChildren;
                                    
                                    // Force a re-render
                                    handleChange('personalInfo', 'lastUpdated', Date.now());
                                    
                                    console.log(`Updated child ${index} dateOfBirth to "${newValue}"`, currentChildren);
                                  } catch (error) {
                                    console.error('Failed to update child dateOfBirth:', error);
                                  }
                                }, 0);
                              }
                            }}
                            className={`w-full p-2 border rounded-md ${
                              validationErrors?.children?.[index]?.dateOfBirth ? 'border-red-500' : ''
                            }`}
                          />
                          {validationErrors?.children?.[index]?.dateOfBirth && (
                            <p className="mt-1 text-sm text-red-600">{languageData.en.validation.required}</p>
                          )}
                        </div>
                        <div>
                          <Label className="block space-y-1">
                            <span>{languageData.de.children.taxId}</span>
                            <span className="text-sm text-gray-600 block">{languageData.en.children.taxId}</span>
                          </Label>
                          <input
                            type="text"
                            value={child.taxId || ''}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              if (typeof window !== 'undefined') {
                                setTimeout(() => {
                                  try {
                                    // Create a deep copy of the children array
                                    const currentChildren = JSON.parse(JSON.stringify(formData.children || []));
                                    
                                    // Update the specific child's property
                                    currentChildren[index] = {
                                      ...currentChildren[index],
                                      taxId: newValue
                                    };
                                    
                                    // Update the entire children array
                                    formData.children = currentChildren;
                                    
                                    // Force a re-render
                                    handleChange('personalInfo', 'lastUpdated', Date.now());
                                    
                                    console.log(`Updated child ${index} taxId to "${newValue}"`, currentChildren);
                                  } catch (error) {
                                    console.error('Failed to update child taxId:', error);
                                  }
                                }, 0);
                              }
                            }}
                            className={`w-full p-2 border rounded-md ${
                              validationErrors?.children?.[index]?.taxId ? 'border-red-500' : ''
                            }`}
                          />
                          {validationErrors?.children?.[index]?.taxId && (
                            <p className="mt-1 text-sm text-red-600">{languageData.en.validation.required}</p>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (typeof window !== 'undefined') {
                            setTimeout(() => {
                              try {
                                // Create a deep copy of the children array
                                const currentChildren = JSON.parse(JSON.stringify(formData.children || []));
                                
                                // Remove the specific child
                                currentChildren.splice(index, 1);
                                
                                // Update the entire children array
                                formData.children = currentChildren;
                                
                                // Force a re-render
                                handleChange('personalInfo', 'lastUpdated', Date.now());
                                
                                console.log(`Removed child ${index}`, currentChildren);
                              } catch (error) {
                                console.error('Failed to remove child:', error);
                              }
                            }, 0);
                          }
                        }}
                        className="mt-3 text-red-600 hover:text-red-800 text-sm"
                      >
                        {languageData.de.children.remove} / {languageData.en.children.remove}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-600">
                  No children added yet. Click the button below to add a child.
                </div>
              )}
              
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    setTimeout(() => {
                      try {
                        const newChild = { 
                          id: `child-${Date.now()}`, 
                          firstName: '', 
                          lastName: '', 
                          dateOfBirth: '', 
                          taxId: '' 
                        };
                        
                        const currentChildren = Array.isArray(formData.children) ? formData.children : [];
                        
                        currentChildren.push(newChild);
                        
                        formData.children = currentChildren;
                        
                        handleChange('personalInfo', 'lastUpdated', Date.now());
                        
                        console.log('Added child directly, updated children array:', formData.children);
                        console.log('Current children count:', formData.children.length);
                      } catch (error) {
                        console.error('Failed to add child directly:', error);
                      }
                    }, 0);
                  }
                }}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
              >
                {languageData.de.children.add} / {languageData.en.children.add}
              </button>
            </div>
          )}
        </div>
      </div>
      {formData.personalInfo.hasChildren && Array.isArray(formData.children) && formData.children.length === 0 && showValidationErrors && (
        <p className="mt-1 text-sm text-red-600">
          {languageData.de.validation.addAtLeastOneChild} / {languageData.en.validation.addAtLeastOneChild}
        </p>
      )}
    </FormSection>
  );
};

export default PersonalInfoStep;