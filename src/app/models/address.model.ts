export interface Address {
    id: string;                     // Unique ID for each address
    nickname: string;               // Address label (e.g., "Home", "Office")
    fullName: string;               // Name of the recipient
    phoneNumber: string;            // Contact number
    addressLine1: string;           // House/Flat number, Street
    addressLine2?: string;          // Landmark (optional)
    city: string;                   // City
    state: string;                  // State
    postalCode: string;             // ZIP/Postal code
    country: string;                // Country
    type: 'Home' | 'Work' | 'Other'; // Address type
    isDefault: boolean;             // Default flag
    isEditing?: boolean;            // Flag to toggle between view/edit mode
}
