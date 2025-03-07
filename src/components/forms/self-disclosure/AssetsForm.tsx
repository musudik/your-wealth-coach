import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import languageData from "@/components/forms/self-disclosure/i18n/language.json";
import { FormData } from "@/types/form";

interface AssetsFormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  errors: Record<string, any>;
  isSingleApplicant: boolean;
}

export function AssetsForm({ formData, setFormData, errors, isSingleApplicant }: AssetsFormProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Applicant A */}
        <div>
          <h4 className="text-md font-medium mb-4">
            {languageData.de.credit_applicant_a}
            <br />
            <span className="text-sm text-gray-600">{languageData.en.credit_applicant_a}</span>
          </h4>
          <div className="space-y-4">
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.bank_savings}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.bank_savings}</span>
              </Label>
              {[0, 1, 2].map((i) => (
                <Input
                  key={`bank-a-${i}`}
                  className="mt-2"
                  type="number"
                  value={formData.assets.bankAccountsA[i]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      assets: {
                        ...formData.assets,
                        bankAccountsA: formData.assets.bankAccountsA.map((item, index) =>
                          index === i ? e.target.value : item
                        ),
                      },
                    })
                  }
                />
              ))}
            </div>

            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.bausparguthaben}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.bausparguthaben}</span>
              </Label>
              {[0, 1, 2].map((i) => (
                <Input
                  key={`building-a-${i}`}
                  className="mt-2"
                  type="number"
                  value={formData.assets.buildingSocietyA[i]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      assets: {
                        ...formData.assets,
                        buildingSocietyA: formData.assets.buildingSocietyA.map((item, index) =>
                          index === i ? e.target.value : item
                        ),
                      },
                    })
                  }
                />
              ))}
            </div>

            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.life_insurance}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.life_insurance}</span>
              </Label>
              {[0, 1, 2].map((i) => (
                <Input
                  key={`life-a-${i}`}
                  className="mt-2"
                  type="number"
                  value={formData.assets.lifeInsuranceA[i]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      assets: {
                        ...formData.assets,
                        lifeInsuranceA: formData.assets.lifeInsuranceA.map((item, index) =>
                          index === i ? e.target.value : item
                        ),
                      },
                    })
                  }
                />
              ))}
            </div>

            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.real_estate}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.real_estate}</span>
              </Label>
              {[0, 1, 2].map((i) => (
                <Input
                  key={`property-a-${i}`}
                  className="mt-2"
                  type="number"
                  value={formData.assets.propertyA[i]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      assets: {
                        ...formData.assets,
                        propertyA: formData.assets.propertyA.map((item, index) =>
                          index === i ? e.target.value : item
                        ),
                      },
                    })
                  }
                />
              ))}
            </div>

            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.other_assets}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.other_assets}</span>
              </Label>
              {[0, 1, 2].map((i) => (
                <Input
                  key={`other-a-${i}`}
                  className="mt-2"
                  type="number"
                  value={formData.assets.otherAssetsA[i]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      assets: {
                        ...formData.assets,
                        otherAssetsA: formData.assets.otherAssetsA.map((item, index) =>
                          index === i ? e.target.value : item
                        ),
                      },
                    })
                  }
                />
              ))}
            </div>

            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.liabilities}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.liabilities}</span>
              </Label>
              {[0, 1, 2].map((i) => (
                <Input
                  key={`liabilities-a-${i}`}
                  className="mt-2"
                  type="number"
                  value={formData.assets.liabilitiesA[i]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      assets: {
                        ...formData.assets,
                        liabilitiesA: formData.assets.liabilitiesA.map((item, index) =>
                          index === i ? e.target.value : item
                        ),
                      },
                    })
                  }
                />
              ))}
            </div>
          </div>
        </div>

        {/* Applicant B */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            {languageData.de.credit_applicant_b}
            <br />
            <span className="text-sm text-gray-600">{languageData.en.credit_applicant_b}</span>
          </h3>
          <div className="space-y-6">
            {/* Bank Accounts */}
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.bank_savings}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.bank_savings}</span>
              </Label>
              <div className="space-y-2">
                {formData.assets.bankAccountsB.map((account, index) => (
                  <Input
                    key={index}
                    value={account}
                    onChange={(e) => setFormData({
                      ...formData,
                      assets: {
                        ...formData.assets,
                        bankAccountsB: formData.assets.bankAccountsB.map((item, index) =>
                          index === i ? e.target.value : item
                        ),
                      },
                    })}
                    className={errors?.bankAccountsB?.[index] ? "border-red-500" : ""}
                    disabled={isSingleApplicant}
                  />
                ))}
              </div>
            </div>
            
            {/* Building Society */}
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.bausparguthaben}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.bausparguthaben}</span>
              </Label>
              <div className="space-y-2">
                {formData.assets.buildingSocietyB.map((account, index) => (
                  <Input
                    key={index}
                    value={account}
                    onChange={(e) => setFormData({
                      ...formData,
                      assets: {
                        ...formData.assets,
                        buildingSocietyB: formData.assets.buildingSocietyB.map((item, index) =>
                          index === i ? e.target.value : item
                        ),
                      },
                    })}
                    className={errors?.buildingSocietyB?.[index] ? "border-red-500" : ""}
                    disabled={isSingleApplicant}
                  />
                ))}
              </div>
            </div>
            
            {/* Life Insurance */}
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.life_insurance}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.life_insurance}</span>
              </Label>
              <div className="space-y-2">
                {formData.assets.lifeInsuranceB.map((insurance, index) => (
                  <Input
                    key={index}
                    value={insurance}
                    onChange={(e) => setFormData({
                      ...formData,
                      assets: {
                        ...formData.assets,
                        lifeInsuranceB: formData.assets.lifeInsuranceB.map((item, index) =>
                          index === i ? e.target.value : item
                        ),
                      },
                    })}
                    className={errors?.lifeInsuranceB?.[index] ? "border-red-500" : ""}
                    disabled={isSingleApplicant}
                  />
                ))}
              </div>
            </div>
            
            {/* Property */}
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.real_estate}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.real_estate}</span>
              </Label>
              <div className="space-y-2">
                {formData.assets.propertyB.map((property, index) => (
                  <Input
                    key={index}
                    value={property}
                    onChange={(e) => setFormData({
                      ...formData,
                      assets: {
                        ...formData.assets,
                        propertyB: formData.assets.propertyB.map((item, index) =>
                          index === i ? e.target.value : item
                        ),
                      },
                    })}
                    className={errors?.propertyB?.[index] ? "border-red-500" : ""}
                    disabled={isSingleApplicant}
                  />
                ))}
              </div>
            </div>
            
            {/* Other Assets */}
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.other_assets}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.other_assets}</span>
              </Label>
              <div className="space-y-2">
                {formData.assets.otherAssetsB.map((asset, index) => (
                  <Input
                    key={index}
                    value={asset}
                    onChange={(e) => setFormData({
                      ...formData,
                      assets: {
                        ...formData.assets,
                        otherAssetsB: formData.assets.otherAssetsB.map((item, index) =>
                          index === i ? e.target.value : item
                        ),
                      },
                    })}
                    className={errors?.otherAssetsB?.[index] ? "border-red-500" : ""}
                    disabled={isSingleApplicant}
                  />
                ))}
              </div>
            </div>
            
            {/* Liabilities */}
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.liabilities}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.liabilities}</span>
              </Label>
              <div className="space-y-2">
                {formData.assets.liabilitiesB.map((liability, index) => (
                  <Input
                    key={index}
                    value={liability}
                    onChange={(e) => setFormData({
                      ...formData,
                      assets: {
                        ...formData.assets,
                        liabilitiesB: formData.assets.liabilitiesB.map((item, index) =>
                          index === i ? e.target.value : item
                        ),
                      },
                    })}
                    className={errors?.liabilitiesB?.[index] ? "border-red-500" : ""}
                    disabled={isSingleApplicant}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 