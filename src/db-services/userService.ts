import { firestore } from "./firebase";
import { doc, setDoc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";

/**
 * 🔹 Create a new Client or Partner
 * If client, it links to a parent partner
 */
export const createUser = async (uid: string, name: string, email: string, role: string, parentId: string | null = null) => {
  try {
    const userRef = doc(firestore, "users", uid);

    // Build hierarchy path
    let hierarchyPath: string[] = [];
    if (parentId) {
      const parentDoc = await getDoc(doc(firestore, "users", parentId));
      if (parentDoc.exists()) {
        hierarchyPath = [...parentDoc.data().hierarchyPath, parentId];
      }
    }

    const userData = {
      uid,
      name,
      email,
      role,
      parentId,
      hierarchyPath,
      createdAt: new Date(),
    };

    await setDoc(userRef, userData);
    return userData;
  } catch (error: any) {
    console.error("Error creating user:", error.message);
    throw error;
  }
};

/**
 * 🔹 Get User Details by ID
 */
export const getUserById = async (uid: string) => {
  try {
    const userDoc = await getDoc(doc(firestore, "users", uid));
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error: any) {
    console.error("Error fetching user:", error.message);
    throw error;
  }
};

/**
 * 🔹 Get Clients of a Partner (Direct & Hierarchical)
 */
export const getClientsByPartner = async (partnerId: string) => {
  try {
    const clientsQuery = query(collection(firestore, "users"), where("hierarchyPath", "array-contains", partnerId));
    const clientsSnapshot = await getDocs(clientsQuery);
    return clientsSnapshot.docs.map((doc) => doc.data());
  } catch (error: any) {
    console.error("Error fetching clients:", error.message);
    throw error;
  }
};

/**
 * 🔹 Update User Details
 */
export const updateUser = async (uid: string, updatedData: any) => {
  try {
    const userRef = doc(firestore, "users", uid);
    await updateDoc(userRef, updatedData);
    return true;
  } catch (error: any) {
    console.error("Error updating user:", error.message);
    throw error;
  }
};

/**
 * 🔹 Delete a User (Client or Partner)
 */
export const deleteUser = async (uid: string) => {
  try {
    await deleteDoc(doc(firestore, "users", uid));
    return true;
  } catch (error: any) {
    console.error("Error deleting user:", error.message);
    throw error;
  }
};
