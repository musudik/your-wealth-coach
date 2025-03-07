import React, { useState } from 'react';
import languageData from './i18n/language.json';
import { Label } from '@/components/ui/label';

interface TaxQuestionsProps {
  onAnswersChange: (answers: Record<string, boolean | string>) => void;
}

const TaxQuestions: React.FC<TaxQuestionsProps> = ({ onAnswersChange }) => {
  const [answers, setAnswers] = useState<Record<string, boolean | string>>({
    hasChildren: false,
    isHomeowner: false,
    hasHealthInsurance: false,
    hasForeignIncome: false,
    hasInvestments: false,
    hasDonations: false,
    workFromHome: false,
    workFromHomeDays: '0',
  });

  const handleChange = (question: string, value: boolean | string) => {
    const updatedAnswers = {
      ...answers,
      [question]: value,
    };
    setAnswers(updatedAnswers);
    onAnswersChange(updatedAnswers);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {languageData.de.questions.title}
        <span className="text-sm font-medium block mt-1 text-gray-600">{languageData.en.questions.title}</span>
      </h2>
      
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="hasChildren"
            checked={answers.hasChildren as boolean}
            onChange={(e) => handleChange('hasChildren', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <Label htmlFor="hasChildren" className="ml-2 block space-y-1">
            <span>{languageData.de.questions.hasChildren}</span>
            <span className="text-sm text-gray-600 block">{languageData.en.questions.hasChildren}</span>
          </Label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isHomeowner"
            checked={answers.isHomeowner as boolean}
            onChange={(e) => handleChange('isHomeowner', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <Label htmlFor="isHomeowner" className="ml-2 block space-y-1">
            <span>{languageData.de.questions.isHomeowner}</span>
            <span className="text-sm text-gray-600 block">{languageData.en.questions.isHomeowner}</span>
          </Label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="hasHealthInsurance"
            checked={answers.hasHealthInsurance as boolean}
            onChange={(e) => handleChange('hasHealthInsurance', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <Label htmlFor="hasHealthInsurance" className="ml-2 block space-y-1">
            <span>{languageData.de.questions.hasHealthInsurance}</span>
            <span className="text-sm text-gray-600 block">{languageData.en.questions.hasHealthInsurance}</span>
          </Label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="hasForeignIncome"
            checked={answers.hasForeignIncome as boolean}
            onChange={(e) => handleChange('hasForeignIncome', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <Label htmlFor="hasForeignIncome" className="ml-2 block space-y-1">
            <span>{languageData.de.questions.hasForeignIncome}</span>
            <span className="text-sm text-gray-600 block">{languageData.en.questions.hasForeignIncome}</span>
          </Label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="hasInvestments"
            checked={answers.hasInvestments as boolean}
            onChange={(e) => handleChange('hasInvestments', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <Label htmlFor="hasInvestments" className="ml-2 block space-y-1">
            <span>{languageData.de.questions.hasInvestments}</span>
            <span className="text-sm text-gray-600 block">{languageData.en.questions.hasInvestments}</span>
          </Label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="hasDonations"
            checked={answers.hasDonations as boolean}
            onChange={(e) => handleChange('hasDonations', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <Label htmlFor="hasDonations" className="ml-2 block space-y-1">
            <span>{languageData.de.questions.hasDonations}</span>
            <span className="text-sm text-gray-600 block">{languageData.en.questions.hasDonations}</span>
          </Label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="workFromHome"
            checked={answers.workFromHome as boolean}
            onChange={(e) => handleChange('workFromHome', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <Label htmlFor="workFromHome" className="ml-2 block space-y-1">
            <span>{languageData.de.questions.workFromHome}</span>
            <span className="text-sm text-gray-600 block">{languageData.en.questions.workFromHome}</span>
          </Label>
        </div>

        {answers.workFromHome && (
          <div className="ml-6 mt-2">
            <Label htmlFor="workFromHomeDays" className="block space-y-1 mb-1">
              <span>{languageData.de.questions.workFromHomeDays}</span>
              <span className="text-sm text-gray-600 block">{languageData.en.questions.workFromHomeDays}</span>
            </Label>
            <input
              type="number"
              id="workFromHomeDays"
              value={answers.workFromHomeDays as string}
              onChange={(e) => handleChange('workFromHomeDays', e.target.value)}
              min="0"
              max="365"
              className="w-24 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TaxQuestions;
