import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { 
  SelfDisclosureForm,
  TaxReturnForm,
  RealEstateForm,
  ElectricityForm 
} from './';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../db-services/firebase';

export function FormRouter() {
  const history = useHistory();
  const location = useLocation();
  const [isValidAccess, setIsValidAccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [formParams, setFormParams] = useState<{
    type: string;
    clientId?: string;
    partnerId?: string;
    formId?: string;
  } | null>(null);

  useEffect(() => {
    // Parse URL parameters
    const path = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    
    if (path.startsWith('/form/')) {
      setFormParams({
        type: path.split('/form/')[1],
        clientId: searchParams.get('client') || undefined,
        partnerId: searchParams.get('partner') || undefined,
        formId: searchParams.get('form') || undefined
      });
    }
  }, [location]);

  useEffect(() => {
    if (formParams) {
      validateAccess();
    }
  }, [formParams]);

  const validateAccess = async () => {
    if (!formParams) return;
    
    try {
      // Validate form type
      const validTypes = ['self-disclosure', 'tax-return', 'real-estate', 'electricity'];
      if (!validTypes.includes(formParams.type)) {
        console.error('Invalid form type:', formParams.type);
        history.push('/');
        return;
      }

      // Validate client and partner IDs
      if (formParams.clientId && formParams.partnerId) {
        const clientDoc = await getDoc(doc(firestore, 'clients', formParams.clientId));
        if (!clientDoc.exists() || clientDoc.data()?.partnerId !== formParams.partnerId) {
          console.error('Invalid client or partner ID');
          history.push('/');
          return;
        }
      }

      setIsValidAccess(true);
    } catch (error) {
      console.error('Error validating form access:', error);
      history.push('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isValidAccess || !formParams) {
    return null;
  }

  // Return the appropriate form component based on type
  switch (formParams.type) {
    case 'self-disclosure':
      return <SelfDisclosureForm clientId={formParams.clientId} formId={formParams.formId} />;
    case 'tax-return':
      return <TaxReturnForm clientId={formParams.clientId} formId={formParams.formId} />;
    case 'real-estate':
      return <RealEstateForm clientId={formParams.clientId} formId={formParams.formId} />;
    case 'electricity':
      return <ElectricityForm clientId={formParams.clientId} formId={formParams.formId} />;
    default:
      return null;
  }
} 