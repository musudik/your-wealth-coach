import { auth, firestore } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

// 🔹 Register User (Client or Partner)
export const registerUser = async (email: string, password: string, name: string, role: string, parentId: string | null = null) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store user info in Firestore
    await setDoc(doc(firestore, "users", user.uid), {
      uid: user.uid,
      name,
      email,
      role, // "partner" or "client"
      parentId: parentId, // If client, assign partner ID
      hierarchyPath: parentId ? [parentId] : [],
      createdAt: new Date(),
    });

    // If the user is a partner, also create a record in the partners collection
    if (role === "partner") {
      await setDoc(doc(firestore, "partners", user.uid), {
        uid: user.uid,
        name,
        email,
        approvalStatus: "pending", // Partners need approval
        activationStatus: "active", // But they can start using the system
        createdAt: new Date(),
      });
    }

    return user;
  } catch (error: any) {
    console.error("Registration Error:", error.message);
    throw error;
  }
};

// 🔹 Login User
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error("Login Error:", error.message);
    throw error;
  }
};

// 🔹 Logout User
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error("Logout Error:", error.message);
  }
};

// 🔹 Get User Details
export const getUserDetails = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(firestore, "users", userId));
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error: any) {
    console.error("Error getting user details:", error.message);
    return null;
  }
};

// 🔹 Check if user is a partner
export const isUserPartner = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(firestore, "users", userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.role === "partner";
    }
    return false;
  } catch (error: any) {
    console.error("Error checking if user is partner:", error.message);
    return false;
  }
};
