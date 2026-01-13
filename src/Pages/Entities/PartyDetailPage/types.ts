export interface Party {
    _id?: string; // API might return _id or id
    id?: string;  // Handle both for compatibility
    companyName: string;
    ownerName: string;
    address: string;
    phone: string;
    email?: string;
    dateCreated?: string;
    panVat?: string;
    description?: string;
    partyType?: string;
    latitude?: number | null;
    longitude?: number | null;
    image?: string | null;
    // Add other fields as necessary from the API response
}

export interface Order {
    _id: string;
    id: string;
    invoiceNumber: string;
    expectedDeliveryDate: string;
    totalAmount: number;
    status: string;
    statusColor?: string; // Optional if we derived it on UI
    partyName?: string; // For display
    createdBy?: {
        _id: string;
        id?: string;
        name: string;
    };
    // Add other order fields
}

export interface PartyStats {
    summary: {
        totalOrders: number;
        totalCollections?: number;
        // Add other summary fields
    };
    allOrders: Order[];
    // Add collections or other stats data
}

export interface PartyDetailsResponse {
    party: Party;
    statsData?: PartyStats;
}

// Hook Return Types
export interface PartyDetailsHookReturn {
    data: PartyDetailsResponse | undefined | null;
    isLoading: boolean;
    error: any;
    partyTypes: string[];
    mutations: {
        update: (payload: any) => Promise<any>; // Refine payload type later if possible
        delete: () => Promise<any>;
        uploadImage: (file: File) => Promise<any>;
        deleteImage: () => Promise<any>;
        isUploading: boolean;
        isDeleting: boolean;
    };
}

// Tab Permissions
export interface TabConfigItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    path: string;
    permission?: {
        module: string;
        action: string;
    } | {
        customCheck: (hasPermission: (mod: string, act: string) => boolean) => boolean;
    };
}
