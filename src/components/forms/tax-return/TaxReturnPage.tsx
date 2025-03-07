import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseForm from './BaseForm';
import { TaxFormData } from './taxTypes';

const TaxReturnPage: React.FC = () => {
  const { t } = useTranslation('taxReturn');
  
  const handleSubmit = (data: TaxFormData) => {
    console.log('Form submitted:', data);
    // Here you would typically send the data to your backend
    // For example: axios.post('/api/tax-returns', data)
  };
  
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            {t('title')}
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            {t('common.formDescription')}
          </p>
        </div>
        
        <BaseForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default TaxReturnPage;
