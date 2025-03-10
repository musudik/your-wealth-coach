import { firestore } from '../firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where,
  Timestamp 
} from 'firebase/firestore';
import { TaxFormData } from '../../components/forms/tax-return/taxTypes';
import { getAuth } from 'firebase/auth';

export const saveTaxReturnForm = async (formData: TaxFormData, partnerId: string): Promise<string> => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error('No authenticated user found');
  }

  if (!partnerId) {
    throw new Error('Partner ID is required');
  }

  if (!formData.clientId) {
    throw new Error('Client ID is required');
  }

  try {
    // Clean the formData to remove any undefined values
    const cleanFormData = Object.entries(formData).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);

    const formDataWithMetadata = {
      ...cleanFormData,
      type: 'taxReturn',
      clientId: formData.clientId,
      partnerId: partnerId,
      status: formData.status || 'draft',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    const formsCollectionRef = collection(firestore, 'forms');
    const docRef = await addDoc(formsCollectionRef, formDataWithMetadata);
    
    return docRef.id;
  } catch (error) {
    console.error('Error saving tax return form:', error);
    throw error;
  }
};

export const updateTaxReturnForm = async (formId: string, formData: Partial<TaxFormData>): Promise<void> => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error('No authenticated user found');
  }

  try {
    const formRef = doc(firestore, 'forms', formId);
    const formDoc = await getDoc(formRef);

    if (!formDoc.exists()) {
      throw new Error('Form not found');
    }

    const existingForm = formDoc.data();
    if (existingForm.clientId !== user.uid && existingForm.partnerId !== user.uid) {
      throw new Error('Permission denied');
    }

    const updatedData = {
      ...formData,
      updatedAt: Timestamp.now()
    };

    await updateDoc(formRef, updatedData);
  } catch (error) {
    console.error('Error updating tax return form:', error);
    throw error;
  }
};

export const getTaxReturnForm = async (formId: string): Promise<TaxFormData | null> => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error('No authenticated user found');
  }

  try {
    const formRef = doc(firestore, 'forms', formId);
    const formDoc = await getDoc(formRef);
    
    if (!formDoc.exists()) {
      return null;
    }

    const formData = formDoc.data();
    
    if (formData.clientId !== user.uid && formData.partnerId !== user.uid) {
      throw new Error('Permission denied');
    }

    return { id: formDoc.id, ...formData } as TaxFormData;
  } catch (error) {
    console.error('Error getting tax return form:', error);
    throw error;
  }
};

export const getAllTaxReturnForms = async (partnerId?: string): Promise<TaxFormData[]> => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error('No authenticated user found');
  }

  try {
    const formsCollectionRef = collection(firestore, 'forms');
    let q;

    if (partnerId) {
      q = query(
        formsCollectionRef, 
        where('type', '==', 'taxReturn'),
        where('partnerId', '==', partnerId)
      );
    } else {
      q = query(
        formsCollectionRef,
        where('type', '==', 'taxReturn'),
        where('clientId', '==', user.uid)
      );
    }

    const querySnapshot = await getDocs(q);
    const forms: TaxFormData[] = [];
    
    querySnapshot.forEach((doc) => {
      forms.push({
        id: doc.id,
        ...doc.data()
      } as TaxFormData);
    });

    return forms;
  } catch (error) {
    console.error('Error getting all tax return forms:', error);
    throw error;
  }
};