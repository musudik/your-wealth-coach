import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { 
  SelfDisclosureForm,
  TaxReturnForm,
  RealEstateForm,
  ElectricityForm 
} from '@/components/forms';

interface FormRouterProps {
  type: string;
  clientId?: string;
  formId?: string;
}

export function FormRouter({ type, clientId, formId }: FormRouterProps) {
  const [_, setLocation] = useLocation();

  useEffect(() => {
    // Validate form type
    const validTypes = ['self-disclosure', 'tax-return', 'real-estate', 'electricity'];
    if (!validTypes.includes(type)) {
      setLocation('/forms');
      return;
    }
  }, [type]);

  // Return the appropriate form component based on type
  switch (type) {
    case 'self-disclosure':
      return <SelfDisclosureForm clientId={clientId} formId={formId} />;
    case 'tax-return':
      return <TaxReturnForm clientId={clientId} formId={formId} />;
    case 'real-estate':
      return <RealEstateForm clientId={clientId} formId={formId} />;
    case 'electricity':
      return <ElectricityForm clientId={clientId} formId={formId} />;
    default:
      return null;
  }
} 