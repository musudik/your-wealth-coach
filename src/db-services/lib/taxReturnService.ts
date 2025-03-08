import { db } from '../lib/firebase';
import { ref, set, get } from 'firebase/database';
import { TaxFormData } from '../components/forms/tax-return/taxTypes';

export const saveTaxReturnForm = async (
  formData: TaxFormData, 
  partnerId?: string, 
  clientId?: string
): Promise<string> => {
  try {
    const formId = formData.id || `tax-return-${Date.now()}`;
    const updatedFormData = { ...formData, id: formId, updatedAt: new Date().toISOString() };
    
    let path = 'forms/tax-return';
    
    // If both partner and client IDs are provided, save under that path
    if (partnerId && clientId) {
      path = `partners/${partnerId}/clients/${clientId}/forms/tax-return`;
    }
    
    await set(ref(db, `${path}/${formId}`), updatedFormData);
    return formId;
  } catch (error) {
    console.error('Error saving tax return form:', error);
    throw error;
  }
};

export const getTaxReturnForm = async (
  formId: string,
  partnerId?: string,
  clientId?: string
): Promise<TaxFormData | null> => {
  try {
    let path = 'forms/tax-return';
    
    if (partnerId && clientId) {
      path = `partners/${partnerId}/clients/${clientId}/forms/tax-return`;
    }
    
    const snapshot = await get(ref(db, `${path}/${formId}`));
    
    if (snapshot.exists()) {
      return snapshot.val() as TaxFormData;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting tax return form:', error);
    throw error;
  }
};