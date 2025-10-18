// --- TYPE DEFINITIONS ---

// Defines the shape of the main prospect information
interface Prospect {
    id: string;
    name: string;
    designation: string;
    location: string;
    description: string; // <-- New field
    imageUrl: string;
    email: string; // Used as the identifier from the previous page
}

// Defines the shape of the contact card information
interface ProspectContact {
    email: string;
    phone: string;
    address: string;
}

// The complete data structure for the details page
export interface FullProspectDetailsData {
    prospect: Prospect;
    contact: ProspectContact;
}


// --- MOCK DATA ---
// In a real app, you would fetch this from your API based on an ID
const mockProspectDetails: FullProspectDetailsData = {
    prospect: {
        id: 'prospect-001',
        name: 'Mary Johnson',
        designation: 'Lead Developer',
        location: 'Biratnagar, Nepal',
        // New description field with mock text
        description: 'Mary is a highly skilled developer with over 10 years of experience in the tech industry. She has shown great interest in our new line of enterprise software and could be a key decision-maker for her company.',
        imageUrl: 'https://i.pravatar.cc/150?u=mary',
        email: 'mary.johnson@example.com',
    },
    contact: {
        email: 'mary.johnson@example.com',
        phone: '+977-9800000000',
        address: 'Shanti Chowk, Biratnagar, Nepal',
    },
};


// --- MOCK API FETCH FUNCTION ---
export const getProspectDetails = async (prospectId: string): Promise<FullProspectDetailsData> => {
    console.log(`Fetching details for prospect with ID: ${prospectId}`);
    
    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // In a real app, you would make an API call here, e.g.:
    // const response = await api.get(`/prospects/${prospectId}`);
    // return response.data;

    // For now, we return the mock data
    return mockProspectDetails;
};
