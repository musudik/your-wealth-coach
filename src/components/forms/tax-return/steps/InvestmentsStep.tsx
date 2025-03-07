import React from 'react';
import { Label } from '@/components/ui/label';
import FormSection from '../FormSection';
import { TaxFormData } from '../taxTypes';
import languageData from '../i18n/language.json';

interface InvestmentsStepProps {
  formData: TaxFormData;
  handleChange: (section: keyof TaxFormData, field: string, value: any) => void;
  validationErrors: Record<string, any> | null;
  hasError: (section: string, field: string) => boolean;
}

const InvestmentsStep: React.FC<InvestmentsStepProps> = ({
  formData,
  handleChange,
  validationErrors,
  hasError
}) => {
  return (
    <FormSection title="Stocks & Investments / Aktien & Investitionen">
      <div className="space-y-6">
        {/* Stock income status */}
        <div>
          <Label className="block space-y-1">
            <span>Haben Sie Einkünfte aus Aktien oder anderen Wertpapieren?</span>
            <span className="text-sm text-gray-600 block">Do you have income from stocks or other securities?</span>
          </Label>
          <div className="flex space-x-4 mt-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="stockIncomeNo"
                name="stockIncome"
                checked={formData.incomeInfo.hasStockIncome === false}
                onChange={() => handleChange('incomeInfo', 'hasStockIncome', false)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                required
              />
              <label htmlFor="stockIncomeNo" className="ml-2">Nein / No</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="stockIncomeYes"
                name="stockIncome"
                checked={formData.incomeInfo.hasStockIncome === true}
                onChange={() => handleChange('incomeInfo', 'hasStockIncome', true)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                required
              />
              <label htmlFor="stockIncomeYes" className="ml-2">Ja / Yes</label>
            </div>
          </div>
          {hasError('incomeInfo', 'hasStockIncome') && (
            <p className="mt-1 text-sm text-red-600">
              {languageData.de.validation.required} / {languageData.en.validation.required}
            </p>
          )}
        </div>
        
        {/* Conditional fields when has stock income */}
        {formData.incomeInfo.hasStockIncome && (
          <div className="space-y-4 ml-6">
            {/* Dividend earnings */}
            <div>
              <Label className="block space-y-1">
                <span>Wenn ja, wie hoch waren Ihre Dividendenerträge im letzten Jahr?</span>
                <span className="text-sm text-gray-600 block">If yes, what were your dividend earnings last year?</span>
              </Label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.incomeInfo.dividendEarnings || 0}
                onChange={(e) => handleChange('incomeInfo', 'dividendEarnings', parseFloat(e.target.value) || 0)}
                className={validationErrors?.incomeInfo?.dividendEarnings ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                required
              />
              {hasError('incomeInfo', 'dividendEarnings') && (
                <p className="mt-1 text-sm text-red-600">
                  {languageData.de.validation.positiveNumber} / {languageData.en.validation.positiveNumber}
                </p>
              )}
            </div>
            
            {/* Bank certificate */}
            <div>
              <Label className="block space-y-1">
                <span>Haben Sie eine Bankbescheinigung für Ihre Erträge (Erträgnisaufstellung)?</span>
                <span className="text-sm text-gray-600 block">Do you have a bank certificate for your earnings (Erträgnisaufstellung)?</span>
              </Label>
              <div className="flex space-x-4 mt-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="bankCertificateNo"
                    name="bankCertificate"
                    checked={formData.incomeInfo.hasBankCertificate === false}
                    onChange={() => handleChange('incomeInfo', 'hasBankCertificate', false)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    required
                  />
                  <label htmlFor="bankCertificateNo" className="ml-2">Nein / No</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="bankCertificateYes"
                    name="bankCertificate"
                    checked={formData.incomeInfo.hasBankCertificate === true}
                    onChange={() => handleChange('incomeInfo', 'hasBankCertificate', true)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    required
                  />
                  <label htmlFor="bankCertificateYes" className="ml-2">Ja / Yes</label>
                </div>
              </div>
              {hasError('incomeInfo', 'hasBankCertificate') && (
                <p className="mt-1 text-sm text-red-600">
                  {languageData.de.validation.required} / {languageData.en.validation.required}
                </p>
              )}
              
              {/* File upload for bank certificate */}
              {formData.incomeInfo.hasBankCertificate && (
                <div className="mt-3">
                  <Label className="block space-y-1">
                    <span>Wenn ja, laden Sie bitte Ihre Bankbescheinigung hoch:</span>
                    <span className="text-sm text-gray-600 block">If yes, please upload your bank certificate:</span>
                  </Label>
                  <input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleChange('incomeInfo', 'bankCertificateFile', e.target.files[0].name);
                      }
                    }}
                    className="mt-1 block w-full text-sm text-gray-500
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-md file:border-0
                              file:text-sm file:font-semibold
                              file:bg-blue-50 file:text-blue-700
                              hover:file:bg-blue-100"
                    required={formData.incomeInfo.hasBankCertificate}
                  />
                  {hasError('incomeInfo', 'bankCertificateFile') && (
                    <p className="mt-1 text-sm text-red-600">
                      {languageData.de.validation.required} / {languageData.en.validation.required}
                    </p>
                  )}
                </div>
              )}
            </div>
            
            {/* Stock sales */}
            <div>
              <Label className="block space-y-1">
                <span>Haben Sie im letzten Jahr Aktien verkauft?</span>
                <span className="text-sm text-gray-600 block">Did you sell stocks last year?</span>
              </Label>
              <div className="flex space-x-4 mt-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="stockSalesNo"
                    name="stockSales"
                    checked={formData.incomeInfo.hasStockSales === false}
                    onChange={() => handleChange('incomeInfo', 'hasStockSales', false)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    required
                  />
                  <label htmlFor="stockSalesNo" className="ml-2">Nein / No</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="stockSalesYes"
                    name="stockSales"
                    checked={formData.incomeInfo.hasStockSales === true}
                    onChange={() => handleChange('incomeInfo', 'hasStockSales', true)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    required
                  />
                  <label htmlFor="stockSalesYes" className="ml-2">Ja / Yes</label>
                </div>
              </div>
              {hasError('incomeInfo', 'hasStockSales') && (
                <p className="mt-1 text-sm text-red-600">
                  {languageData.de.validation.required} / {languageData.en.validation.required}
                </p>
              )}
              
              {/* Profit/Loss per stock */}
              {formData.incomeInfo.hasStockSales && (
                <div className="mt-3">
                  <Label className="block space-y-1">
                    <span>Wenn ja, wie hoch war Ihr Gewinn/Verlust pro Aktie?</span>
                    <span className="text-sm text-gray-600 block">If yes, what was your profit/loss per stock?</span>
                  </Label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.incomeInfo.stockProfitLoss || 0}
                    onChange={(e) => handleChange('incomeInfo', 'stockProfitLoss', parseFloat(e.target.value) || 0)}
                    className={validationErrors?.incomeInfo?.stockProfitLoss ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                    required
                  />
                  {hasError('incomeInfo', 'stockProfitLoss') && (
                    <p className="mt-1 text-sm text-red-600">
                      {languageData.de.validation.required} / {languageData.en.validation.required}
                    </p>
                  )}
                </div>
              )}
            </div>
            
            {/* Foreign stocks */}
            <div>
              <Label className="block space-y-1">
                <span>Stammen diese Gewinne/Verluste aus ausländischen Aktien?</span>
                <span className="text-sm text-gray-600 block">Are these gains/losses from foreign stocks?</span>
              </Label>
              <div className="flex space-x-4 mt-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="foreignStocksNo"
                    name="foreignStocks"
                    checked={formData.incomeInfo.hasForeignStocks === false}
                    onChange={() => handleChange('incomeInfo', 'hasForeignStocks', false)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    required
                  />
                  <label htmlFor="foreignStocksNo" className="ml-2">Nein / No</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="foreignStocksYes"
                    name="foreignStocks"
                    checked={formData.incomeInfo.hasForeignStocks === true}
                    onChange={() => handleChange('incomeInfo', 'hasForeignStocks', true)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    required
                  />
                  <label htmlFor="foreignStocksYes" className="ml-2">Ja / Yes</label>
                </div>
              </div>
              {hasError('incomeInfo', 'hasForeignStocks') && (
                <p className="mt-1 text-sm text-red-600">
                  {languageData.de.validation.required} / {languageData.en.validation.required}
                </p>
              )}
              
              {/* Conditional fields for foreign stocks */}
              {formData.incomeInfo.hasForeignStocks && (
                <div className="space-y-4 mt-3">
                  <div>
                    <Label className="block space-y-1">
                      <span>Wenn ja, wie viel ausländische Steuer wurde gezahlt?</span>
                      <span className="text-sm text-gray-600 block">If yes, how much foreign tax was paid?</span>
                    </Label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.incomeInfo.foreignTaxPaid || 0}
                      onChange={(e) => handleChange('incomeInfo', 'foreignTaxPaid', parseFloat(e.target.value) || 0)}
                      className={validationErrors?.incomeInfo?.foreignTaxPaid ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                      required
                    />
                    {hasError('incomeInfo', 'foreignTaxPaid') && (
                      <p className="mt-1 text-sm text-red-600">
                        {languageData.de.validation.positiveNumber} / {languageData.en.validation.positiveNumber}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label className="block space-y-1">
                      <span>Bitte laden Sie die entsprechende ausländische Steuerbescheinigung hoch:</span>
                      <span className="text-sm text-gray-600 block">Please upload the corresponding foreign tax certificate:</span>
                    </Label>
                    <input
                      type="file"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleChange('incomeInfo', 'foreignTaxCertificateFile', e.target.files[0].name);
                        }
                      }}
                      className="mt-1 block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100"
                      required={formData.incomeInfo.hasForeignStocks}
                    />
                    {hasError('incomeInfo', 'foreignTaxCertificateFile') && (
                      <p className="mt-1 text-sm text-red-600">
                        {languageData.de.validation.required} / {languageData.en.validation.required}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </FormSection>
  );
};

export default InvestmentsStep; 