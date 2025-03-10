import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from "lucide-react";
import { FormSection } from "@/components/ui/form-section";

export function RealEstateForm() {
  const { t } = useTranslation('realEstate');
  
  return (
    <div className="form-container">
      <div className="form-header">
        <button 
          onClick={() => history.goBack()} 
          className="form-back-button"
        >
          <ArrowLeft size={16} />
          <span style={{ marginLeft: '5px' }}>Back</span>
        </button>
        <h2 className="form-title">
          {t('title')}
        </h2>
      </div>

      <form>
        <FormSection 
          title={t('propertyDetails.title')}
          subtitle={t('propertyDetails.subtitle')}
        >
          <div className="form-grid">
            {/* Property details fields */}
          </div>
        </FormSection>

        <FormSection 
          title={t('financialDetails.title')}
          subtitle={t('financialDetails.subtitle')}
        >
          <div className="form-grid">
            {/* Financial details fields */}
          </div>
        </FormSection>

        <div className="form-actions">
          {/* Form actions */}
        </div>
      </form>
    </div>
  );
} 