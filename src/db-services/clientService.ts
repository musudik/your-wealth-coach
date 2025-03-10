import {firestore } from './firebase';
import { Client } from '../types/types';
import { 
    collection, 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    deleteDoc,
    query,
    where,
    getDocs
} from 'firebase/firestore';

export class ClientService {
    private readonly CLIENTS_PATH = 'clients';

    // Create a new client
    async createClient(client: Client): Promise<void> {
        try {
            await setDoc(
                doc(firestore, this.CLIENTS_PATH, client.clientId),
                client
            );
        } catch (error) {
            throw new Error(`Failed to create client: ${error}`);
        }
    }

    // Get client by ID
    async getClientById(clientId: string): Promise<Client | null> {
        try {
            const clientDoc = await getDoc(
                doc(firestore, this.CLIENTS_PATH, clientId)
            );
            return clientDoc.exists() ? clientDoc.data() as Client : null;
        } catch (error) {
            throw new Error(`Failed to get client: ${error}`);
        }
    }

    // Update client information
    async updateClient(clientId: string, updates: Partial<Client>): Promise<void> {
        try {
            // Make sure clientId is a string
            if (!clientId || typeof clientId !== 'string') {
                throw new Error('Invalid client ID');
            }
            
            // Make sure updates is an object
            if (!updates || typeof updates !== 'object') {
                throw new Error('Invalid updates object');
            }
            
            // Get a reference to the document
            const clientDocRef = doc(firestore, this.CLIENTS_PATH, clientId);
            
            // Update the document
            await updateDoc(clientDocRef, updates);
        } catch (error) {
            console.error("Error in updateClient:", error);
            throw new Error(`Failed to update client: ${error}`);
        }
    }

    // Delete client
    async deleteClient(clientId: string, partnerId: string): Promise<void> {
        try {
            // Reference to the client document
            const clientRef = doc(firestore, this.CLIENTS_PATH, clientId);
            
            // Get the client data first to verify ownership
            const clientSnap = await getDoc(clientRef);
            
            if (!clientSnap.exists()) {
                throw new Error("Client not found");
            }
            
            const clientData = clientSnap.data();
            
            // Verify that this client belongs to the partner
            if (clientData.partnerId !== partnerId) {
                throw new Error("Unauthorized to delete this client");
            }
            
            // Delete the client document
            await deleteDoc(clientRef);
            
            // Optionally, delete related documents (forms, etc.)
            const formsQuery = query(
                collection(firestore, "forms"),
                where("clientId", "==", clientId)
            );
            
            const formsSnapshot = await getDocs(formsQuery);
            
            // Delete all related forms
            const deleteForms = formsSnapshot.docs.map(doc => 
                deleteDoc(doc.ref)
            );
            
            await Promise.all(deleteForms);
            
        } catch (error) {
            console.error("Error in deleteClient:", error);
            throw new Error("Failed to delete client: " + error.message);
        }
    }

    // Get all clients for a partner
    async getClientsByPartnerId(partnerId: string): Promise<Client[]> {
        try {
            const q = query(
                collection(firestore, this.CLIENTS_PATH),
                where("partnerId", "==", partnerId)
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => doc.data() as Client);
        } catch (error) {
            throw new Error(`Failed to get clients by partner: ${error}`);
        }
    }

    // Get all clients
    async getAllClients(): Promise<Client[]> {
        try {
            const querySnapshot = await getDocs(collection(firestore, this.CLIENTS_PATH));
            return querySnapshot.docs.map(doc => doc.data() as Client);
        } catch (error) {
            throw new Error(`Failed to get all clients: ${error}`);
        }
    }

    // Update client status (can be used for approval/rejection)
    async updateClientStatus(clientId: string, status: "Active" | "Inactive" | "Suspended"): Promise<void> {
        try {
            await updateDoc(
                doc(firestore, this.CLIENTS_PATH, clientId),
                {
                    "personalInformation.status": status
                }
            );
        } catch (error) {
            throw new Error(`Failed to update client status: ${error}`);
        }
    }
}
