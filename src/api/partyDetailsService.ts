// Import party data from partyService to keep data in sync
import { mockPartyData } from './partyService';

// --- TYPE DEFINITIONS ---
export interface Order {
  id: string;
  partyName: string;
  address: string;
  date: string;
  panVat: string;
  status: 'Completed' | 'Rejected' | 'In Transit';
  statusColor: 'green' | 'red' | 'yellow';
}

export interface PartyDetails {
  id: string;
  companyName: string;
  ownerName: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  dateCreated: string; // ISO date string
  phone: string;
  panVat: string;
  email: string;
  // Legacy fields (kept for backward compatibility)
  name?: string;
  location?: string;
  contact?: {
    email: string;
    phone: string;
    address: string;
  };
}

export interface FullPartyDetailsData {
  party: PartyDetails;
  orders: Order[];
}


// --- MOCK DATABASE ---
// Convert Party type to PartyDetails type and add missing fields
export const allPartiesData: PartyDetails[] = mockPartyData.map((party, index) => ({
    id: party.id,
    companyName: party.companyName,
    ownerName: party.ownerName,
    address: party.address,
    latitude: party.latitude,
    longitude: party.longitude,
    dateCreated: party.dateCreated,
    phone: `98${String(index).padStart(8, '0')}`, // Generate mock phone numbers
    panVat: `${String(index).padStart(10, '0')}`, // Generate mock PAN/VAT numbers
    email: party.email,
    // Legacy fields
    name: party.companyName,
    location: party.address,
    contact: {
        email: party.email,
        phone: `98${String(index).padStart(8, '0')}`,
        address: party.address
    }
}));

// This is your master list of all orders from all parties
export const allOrdersData: Order[] = [
    { id: '00001', partyName: 'Christine Brooks', address: '089 Kutch Green Apt. 448', date: '2019-09-04T10:00:00Z', panVat: '0000000000', status: 'Completed', statusColor: 'green' },
    { id: '00002', partyName: 'Rosie Pearson', address: '979 Immanuel Ferry Suite 526', date: '2019-05-28T11:00:00Z', panVat: '1111111111', status: 'Completed', statusColor: 'green' },
    { id: '00003', partyName: 'Darrell Caldwell', address: '8587 Frida Ports', date: '2019-11-23T01:00:00Z', panVat: '0000000000', status: 'Rejected', statusColor: 'red' },
    { id: '00004', partyName: 'Gilbert Johnston', address: '768 Destiny Lake Suite 600', date: '2019-02-05T09:00:00Z', panVat: '0000000000', status: 'In Transit', statusColor: 'yellow' },
    { id: '00005', partyName: 'Alan Cain', address: '042 Mylene Throughway', date: '2019-07-29T02:00:00Z', panVat: '2222222222', status: 'Completed', statusColor: 'green' },
];


// --- SYNCHRONOUS MOCK FUNCTION (FOR DEVELOPMENT) ---
export const getMockPartyDetails = (partyId: string): FullPartyDetailsData | null => {
    // Find the specific party from your database
    const party = allPartiesData.find(p => p.id === partyId);

    if (!party) {
        return null;
    }

    // Filter the master order list to get only the orders for this party
    const orders = allOrdersData.filter(order => order.panVat === party.panVat);

    return { party, orders };
};

// --- API FETCH FUNCTION ---
export const getPartyDetails = async (partyId: string): Promise<FullPartyDetailsData> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    // Find the specific party from your database
    const party = allPartiesData.find(p => p.id === partyId);

    if (!party) {
        throw new Error("Party not found");
    }

    // Filter the master order list to get only the orders for this party
    const orders = allOrdersData.filter(order => order.panVat === party.panVat);

    return { party, orders };
};

// --- DELETE PARTY FUNCTION ---
export const deletePartyDetails = async (partyId: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    // Find the index of the party to delete
    const partyIndex = allPartiesData.findIndex(p => p.id === partyId);

    if (partyIndex === -1) {
        throw new Error("Party not found");
    }

    // In a real application, this would make an API call to delete the party
    // For now, we'll just remove it from our mock data
    allPartiesData.splice(partyIndex, 1);

    console.log('Party deleted from party details data:', partyId);

    return true;
};

// --- ADD PARTY FUNCTION ---
export const addPartyDetails = async (partyData: Omit<PartyDetails, 'id'>): Promise<PartyDetails> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    // Create new party with generated ID using crypto.randomUUID() for security
    const newParty: PartyDetails = {
        id: `party-${crypto.randomUUID()}`,
        ...partyData,
    };

    // In a real application, this would make an API call to add the party
    // For now, we'll just add it to our mock data
    allPartiesData.push(newParty);

    return newParty;
};

// --- UPDATE PARTY FUNCTION ---
export const updatePartyDetails = async (partyId: string, updatedData: Partial<PartyDetails>): Promise<PartyDetails> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    // Find the party to update
    const partyIndex = allPartiesData.findIndex(p => p.id === partyId);

    if (partyIndex === -1) {
        throw new Error("Party not found");
    }

    // Update the party in mock data
    allPartiesData[partyIndex] = {
        ...allPartiesData[partyIndex],
        ...updatedData,
    };

    console.log('Party updated in party details data:', allPartiesData[partyIndex]);

    return allPartiesData[partyIndex];
};
