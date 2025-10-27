// Import the single source of truth and the enhanced Party type
import { mockPartyData, type Party } from './partyService'; // Use the enhanced Party type directly


// --- TYPE DEFINITIONS ---
export interface Order {
  id: string;
  partyName: string;
  address: string;
  date: string;
  panVat: string; // Used to link orders to parties in mock data
  status: 'Completed' | 'Rejected' | 'In Transit';
  statusColor: 'green' | 'red' | 'yellow';
}

// PartyDetails can now likely just be an alias for the enhanced Party type
export type PartyDetails = Party;

export interface FullPartyDetailsData {
  party: PartyDetails;
  orders: Order[];
}

// --- MOCK ORDERS (Keep this separate) ---
// Ensure panVat values match those added to mockPartyData in partyService.ts
export const allOrdersData: Order[] = [
    { id: '00001', partyName: 'New Traders Pvt. Ltd.', address: 'Thamel, Kathmandu', date: '2023-10-20T10:00:00Z', panVat: '1000000000', status: 'Completed', statusColor: 'green' }, // Matches panVat for 'new-traders'
    { id: '00002', partyName: 'Taylor Design Studio', address: 'Durbar Marg, Kathmandu', date: '2023-10-21T11:00:00Z', panVat: '1111111111', status: 'Completed', statusColor: 'green' }, // Matches panVat for 'michael-taylor'
    { id: '00003', partyName: 'New Traders Pvt. Ltd.', address: 'Thamel, Kathmandu', date: '2023-10-22T01:00:00Z', panVat: '1000000000', status: 'Rejected', statusColor: 'red' }, // Matches 'new-traders' again
    { id: '00004', partyName: 'Anderson Enterprises', address: 'Lakeside, Pokhara', date: '2023-10-23T09:00:00Z', panVat: '1222222222', status: 'In Transit', statusColor: 'yellow' }, // Matches 'barbara-anderson'
    { id: '00005', partyName: 'Taylor Design Studio', address: 'Durbar Marg, Kathmandu', date: '2023-10-24T02:00:00Z', panVat: '1111111111', status: 'Completed', statusColor: 'green' }, // Matches 'michael-taylor' again
    // Add more orders linked by panVat if needed
];

// --- REMOVED allPartiesData array ---

// --- SYNCHRONOUS MOCK FUNCTION (for potentially synchronous fetching needs) ---
export const getMockPartyDetails = (partyId: string): FullPartyDetailsData | null => {
  // Use shared mockPartyData directly
  const party = mockPartyData.find(p => p.id === partyId);

  if (!party) {
    console.warn(`Party with ID ${partyId} not found in getMockPartyDetails.`);
    return null;
  }
  // Filter orders based on the found party's panVat
  const orders = allOrdersData.filter(order => order.panVat === party.panVat);

  return { party: party as PartyDetails, orders }; // Assert type if needed
};

// --- ASYNC API FETCH FUNCTION (Preferred) ---
export const getPartyDetails = async (partyId: string): Promise<FullPartyDetailsData> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  // Use shared mockPartyData directly
  const party = mockPartyData.find(p => p.id === partyId);

  if (!party) {
     console.error(`Party with ID ${partyId} not found in getPartyDetails.`);
    throw new Error("Party not found");
  }
  const orders = allOrdersData.filter(order => order.panVat === party.panVat);

  console.log(`Fetched details for party ${partyId}`, { party, orders });
  return { party: party as PartyDetails, orders }; // Assert type if needed
};

// --- DELETE FUNCTION (Operates on shared mockPartyData) ---
export const deletePartyDetails = async (partyId: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const partyIndex = mockPartyData.findIndex(p => p.id === partyId);

  if (partyIndex === -1) {
    console.error(`Party with ID ${partyId} not found for deletion.`);
    throw new Error("Party not found");
  }
  mockPartyData.splice(partyIndex, 1);
  console.log('Party deleted via partyDetailsService:', partyId);
  return true;
};

// --- UPDATE FUNCTION (Operates on shared mockPartyData) ---
export const updatePartyDetails = async (partyId: string, updatedData: Partial<PartyDetails>): Promise<PartyDetails> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const partyIndex = mockPartyData.findIndex(p => p.id === partyId);

  if (partyIndex === -1) {
     console.error(`Party with ID ${partyId} not found for update.`);
    throw new Error("Party not found");
  }

  // Make sure not to overwrite the ID or dateCreated unintentionally if they are in updatedData
  const currentParty = mockPartyData[partyIndex];
  mockPartyData[partyIndex] = {
    ...currentParty,
    ...updatedData,
    id: currentParty.id, // Ensure ID is preserved
    dateCreated: currentParty.dateCreated, // Ensure dateCreated is preserved
  };

  console.log('Party updated via partyDetailsService:', mockPartyData[partyIndex]);
  return mockPartyData[partyIndex] as PartyDetails; // Assert type if needed
};

// --- REMOVED addPartyDetails function ---
// Use addParty from partyService.ts instead
