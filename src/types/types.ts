// ✅ Person Type
export interface Person {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    whatsappNumber: string;
    createdAt: Date;
    updatedAt: Date;
    status: "Active" | "Inactive" | "Suspended";
    address?: Address;
    officeAddress?: Address;
    dateOfBirth?: string;      // YYYY-MM-DD
    placeOfBirth?: string;
    nationality?: string;
    maritalStatus?: string;
    // Optional Fields
    profilePic?: string;
    preferredLanguage?: string;
    occupation?: string;
    occupationSince?: string;
    companyName?: string;
    notes?: string;
}

// ✅ Partner Type
export interface Partner {
    partnerId: string;          // Firebase UID - generated by Firebase Auth
    personalInformation: Person;
    role: "Partner";
    hierarchyId?: string | null; // Parent partner (null if top-level)
    activationStatus: "Pending" | "Activated" | "Rejected";
    approvalStatus: "Pending" | "Approved" | "Rejected";
    submittedAt: Date;
    activatedAt?: Date;
    approvedAt?: Date;
    rejectionReason?: string;
}

// ✅ Client Type
export interface Client {
    clientId: string;          // Firebase UID
    personalInformation: Person;
    role: "Client";
    partnerId: string;         // Assigned partner
    // Optional Fields
    incomeRange?: "<50K" | "50K-100K" | "100K+";
    riskTolerance?: "Low" | "Medium" | "High";
    forms?: Form[];
    formLinks?: string[];
}

// ✅ Address Type
export interface Address {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

// ✅ Form Types
export const FormTypes = ["Self Disclosure", "Tax Returns", "Strom & Gas", "Real Estate"] as const

// ✅ Form Type
export interface Form {
    formId: string;
    clientId: string;
    partnerId: string;
    formType: typeof FormTypes[number];
    submittedAt: Date;
    status: "Pending Review" | "Approved" | "Rejected";

    // Optional Fields
    comments?: string;
    updatedAt?: Date;
}

// ✅ Document Type
export interface Document {
    documentId: string;
    clientId: string;
    partnerId: string;
    fileURL: string;
    uploadedAt: Date;

    // Optional Fields
    documentType?: "Tax Return" | "ID Proof" | "Bank Statement" | "Other";
    status?: "Pending Review" | "Verified" | "Rejected";
    notes?: string;
}

// ✅ Chat Type
export interface Chat {
    chatId: string;
    participants: string[]; // Array of Partner & Client IDs
    lastMessage: string;
    lastUpdated: Date;
}

// ✅ Message Type (Subcollection under `chats/{chatId}/messages/`)
export interface Message {
    messageId: string;
    senderId: string;
    text: string;
    timestamp: Date;
}

// ✅ Call Type
export interface Call {
    callId: string;
    partnerId: string;
    clientId: string;
    scheduledAt: Date;
    status: "Scheduled" | "Completed" | "Cancelled";
}

// ✅ Authentication Response Type
export interface AuthUser {
    uid: string;
    email: string;
    displayName?: string;
    photoURL?: string;
}
