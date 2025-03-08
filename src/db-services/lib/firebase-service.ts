import { ref, set, get, child, push, update, remove } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from "./firebase";
import type { Form, InsertForm } from "@shared/schema";
import { createUserWithEmailAndPassword } from "firebase/auth";


export class FirebaseService {
  async uploadPDF(pdfBlob: Blob, formId: string, clientId?: string, partnerId?: string): Promise<string> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
      // Include client and partner IDs in the path if available
      const fileName = `forms/${partnerId || 'unassigned'}/${clientId || 'general'}/${formId}/${timestamp}_self_disclosure.pdf`;
      const fileRef = storageRef(storage, fileName);

      // Upload PDF to Firebase Storage
      await uploadBytes(fileRef, pdfBlob);

      // Get the download URL
      const downloadURL = await getDownloadURL(fileRef);

      // Update the form record with the PDF URL
      const formRef = ref(db, `partners/${partnerId}/clients/${clientId}/formdata/${formId}`);
      await set(formRef, {
        pdfUrl: downloadURL,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      return downloadURL;
    } catch (error: any) {
      console.error("Error uploading PDF:", error);
      throw new Error(`Failed to upload PDF: ${error.message}`);
    }
  }

  async createForm(form: InsertForm, formId: string | null, clientId?: string | null, partnerId?: string | null): Promise<Form> {
    try {
      console.log("Creating form with:", { form, clientId, partnerId });
      const timestamp = new Date().toISOString();

      console.log("partnerId::::", partnerId);
      let formRef;
      let newFormRef;
      if (!clientId || !partnerId) {
        formRef = ref(db, `/forms/${form.type}`);
        newFormRef = push(formRef);
        if (formId === null) {
          formId = newFormRef.key;
        }
      } else {
        formRef = ref(db, `partners/${partnerId}/clients/${clientId}/forms/${form.type}`);
        newFormRef = push(formRef);
        if (formId === null) {
          formId = newFormRef.key;
        }
      }

      console.log("Form data:", formId);
      // Create the new form object with all required fields
      const newForm: Form = {
        id: formId,
        type: form.type || 'self-disclosure',
        data: form.data,
        files: form.files || [],
        createdAt: timestamp,
        updatedAt: timestamp,
        clientId: clientId,
        partnerId: partnerId,
        progress: form.progress || 0,
        signature: form.signature || null,
        signatureB: form.signatureB || null,
        referredBy: form.referredBy || null,
        formStatus: "Submitted",
      };

      // Save the form data
      await set(newFormRef, newForm);

      console.log("Form created successfully:", newForm);
      return newForm;
    } catch (error: any) {
      console.error("Error creating form:", error);
      throw new Error(`Failed to create form: ${error.message}`);
    }
  }

  async getForm(id: string, clientId?: string, partnerId?: string): Promise<Form | undefined> {
    try {
      let formRef;
      let newFormRef;
      if (!clientId || !partnerId) {
        formRef = ref(db, `/forms`);
        newFormRef = push(formRef);
      } else {
        formRef = ref(db, `partners/${partnerId}/clients/${clientId}/formdata/${id}`);
        newFormRef = push(formRef);
      }
      const snapshot = await get(formRef);

      if (snapshot.exists()) {
        return snapshot.val() as Form;
      }
      return undefined;
    } catch (error: any) {
      console.error("Error fetching form:", error);
      throw new Error(`Failed to fetch form: ${error.message}`);
    }
  }

  async getForms(type?: string, clientId?: string, partnerId?: string): Promise<Form[]> {
    try {
      let formRef;
      let newFormRef;
      if (!clientId || !partnerId) {
        formRef = ref(db, `/forms/${type}`);
      } else {
        formRef = ref(db, `partners/${partnerId}/clients/${clientId}/formdata`);
      }
      const snapshot = await get(formRef);
      if (!snapshot.exists()) {
        console.log("No forms found");
        return [];
      }

      const formsData = snapshot.val();
      const forms = Object.values(formsData) as Form[];
      console.log("Forms:", forms, type);
      return forms;
      // Filter by type if provided
      //return type ? forms.filter(form => form.type === type) : forms;
    } catch (error: any) {
      console.error("Error fetching forms:", error);
      throw new Error(`Failed to fetch forms: ${error.message}`);
    }
  }

  async updateForm(formId: string, updates: Partial<Form>, clientId?: string, partnerId?: string): Promise<Form> {
    try {
      let formRef;
      if (!clientId || !partnerId) {
        formRef = ref(db, `/forms/${updates.type}`);
      } else {
        formRef = ref(db, `partners/${partnerId}/clients/${clientId}/formdata/${formId}`);
      }

      const snapshot = await get(formRef);
      
      if (!snapshot.exists()) {
        await this.createForm(updates as InsertForm, formId, clientId, partnerId);
        return updates as Form;
      }

      const currentForm = snapshot.val();
      const updatedForm = {
        ...currentForm,
        ...updates,
        updatedAt: new Date().toISOString(),
        clientId,
        partnerId
      };

      await set(formRef, updatedForm);
      return updatedForm;
    } catch (error: any) {
      console.error("Error updating form:", error);
      throw new Error(`Failed to update form: ${error.message}`);
    }
  }

  async createPartner(partner: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    try {
      // Create user with authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        partner.email,
        partner.password
      );
      
      // Store additional data in Realtime Database
      const partnerRef = ref(db, `partners/${userCredential.user.uid}`);
      await set(partnerRef, {
        firstName: partner.firstName,
        lastName: partner.lastName,
        email: partner.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      return userCredential.user;
    } catch (error) {
      console.error('Error creating partner:', error);
      throw error;
    }
  }

  async getPartnerByEmail(email: string) {
    try {
      const dbRef = ref(db);
      const snapshot = await get(child(dbRef, 'partners'));
      
      if (snapshot.exists()) {
        const partners = snapshot.val();
        return Object.values(partners).find((partner: any) => partner.email === email);
      }
      
      return undefined;
    } catch (error) {
      console.error('Error getting partner by email:', error);
      throw error;
    }
  }

  async getPartnerById(id: string) {
    try {
      const partnerRef = ref(db, `partners/${id}`);
      const snapshot = await get(partnerRef);
      
      if (snapshot.exists()) {
        return snapshot.val();
      }
      
      return undefined;
    } catch (error) {
      console.error('Error getting partner by ID:', error);
      throw error;
    }
  }

  async updatePartner(id: string, updates: any) {
    try {
      const partnerRef = ref(db, `partners/${id}`);
      const snapshot = await get(partnerRef);
      
      if (!snapshot.exists()) {
        throw new Error('Partner not found');
      }

      const updatedData = {
        ...snapshot.val(),
        ...updates,
        updatedAt: new Date().toISOString()
      };

      await set(partnerRef, updatedData);
      return updatedData;
    } catch (error) {
      console.error('Error updating partner:', error);
      throw error;
    }
  }

  async createElectricityForm(formData: {
    type: string;
    data: {
      firstName: string;
      lastName: string;
      email: string;
      mobile: string;
      address: string;
      currentContract?: string;
      numberOfPersons: string;
      consumption: string;
    };
    createdAt: string;
  }) {
    try {
      const user = auth.currentUser;
      //if (!user) throw new Error("No authenticated user");

      const formsRef = ref(db, `forms/electricity`);
      const newFormRef = push(formsRef);

      const formToSave = {
        type: formData.type,
        data: formData.data,
        createdAt: formData.createdAt,
        updatedAt: new Date().toISOString(),
        partnerId: user?.uid || '',
      };

      await set(newFormRef, formToSave);

      return {
        id: newFormRef.key,
        ...formToSave
      };
    } catch (error) {
      console.error('Error creating electricity form:', error);
      throw error;
    }
  }

  async getElectricityForms() {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");

      const formsRef = ref(db, `forms/electricity`);
      const snapshot = await get(formsRef);

      if (!snapshot.exists()) {
        return [];
      }

      const forms = [];
      snapshot.forEach((childSnapshot) => {
        const form = childSnapshot.val();
        if (form.partnerId === user.uid) {
          forms.push({
            id: childSnapshot.key,
            ...form
          });
        }
      });

      return forms;
    } catch (error) {
      console.error('Error fetching electricity forms:', error);
      throw error;
    }
  }

  async updateElectricityForm(formId: string, formData: any) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");

      const formRef = ref(db, `forms/electricity/${formId}`);

      const formToUpdate = {
        ...formData,
        updatedAt: new Date().toISOString(),
      };

      await update(formRef, formToUpdate);

      return {
        id: formId,
        ...formToUpdate
      };
    } catch (error) {
      console.error('Error updating electricity form:', error);
      throw error;
    }
  }

  async deleteElectricityForm(formId: string) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");

      const formRef = ref(db, `forms/electricity/${formId}`);
      await remove(formRef);
    } catch (error) {
      console.error('Error deleting electricity form:', error);
      throw error;
    }
  }
}
export const firebaseService = new FirebaseService();