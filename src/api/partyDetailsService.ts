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
  name: string;
  location: string; // We can use designation here
  imageUrl: string;
  ownerName: string;
  phone: string;
  panVat: string;
  contact: {
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
// This list now includes the original companies AND Michael Taylor
const allPartiesData: PartyDetails[] = [
    {
        id: 'amar-hardware',
        name: 'Amar Hardware',
        location: 'Birtamod',
        imageUrl: 'https://placehold.co/100x100/E2E8F0/4A5568?text=Logo',
        ownerName: 'Bikram Agrawal',
        phone: '9800000000',
        panVat: '0000000000', // This party has orders
        contact: {
            email: 'naomi.king@mail.com',
            phone: '9800000000',
            address: 'Shanti Chowk, Biratnagar, Nepal'
        }
    },
    {
        id: 'new-traders',
        name: 'New Traders Inc.',
        location: 'Kathmandu',
        imageUrl: 'https://placehold.co/100x100/E2E8F0/4A5568?text=NT',
        ownerName: 'Sunita Sharma',
        phone: '9811111111',
        panVat: '9999999999', // This party has no orders
        contact: {
            email: 'info@newtraders.com',
            phone: '9811111111',
            address: 'Thamel, Kathmandu, Nepal'
        }
    },
    // --- NEWLY ADDED PARTY ---
    // This matches the data from your new partyService.ts
    // and fixes the error from your screenshot
    {
        id: 'michael-taylor', // This must match the ID in the URL
        name: 'Michael Taylor',
        location: 'Designer', // Using 'designation' for 'location'
        imageUrl: 'https://i.pravatar.cc/150?u=michael',
        ownerName: 'Michael Taylor', // Using name for ownerName
        phone: '9812345678', // Mocked phone
        panVat: '0000000000', // Linking to existing orders for the demo
        contact: {
            email: 'michael.taylor@example.com',
            phone: '9812345678',
            address: 'Some Office, Bangalore, India' // Mocked address
        }
    },
];

// This is your master list of all orders from all parties
const allOrdersData: Order[] = [
    { id: '00001', partyName: 'Christine Brooks', address: '089 Kutch Green Apt. 448', date: '2019-09-04T10:00:00Z', panVat: '0000000000', status: 'Completed', statusColor: 'green' },
    { id: '00002', partyName: 'Rosie Pearson', address: '979 Immanuel Ferry Suite 526', date: '2019-05-28T11:00:00Z', panVat: '1111111111', status: 'Completed', statusColor: 'green' },
    { id: '00003', partyName: 'Darrell Caldwell', address: '8587 Frida Ports', date: '2019-11-23T01:00:00Z', panVat: '0000000000', status: 'Rejected', statusColor: 'red' },
    { id: '00004', partyName: 'Gilbert Johnston', address: '768 Destiny Lake Suite 600', date: '2019-02-05T09:00:00Z', panVat: '0000000000', status: 'In Transit', statusColor: 'yellow' },
    { id: '00005', partyName: 'Alan Cain', address: '042 Mylene Throughway', date: '2019-07-29T02:00:00Z', panVat: '2222222222', status: 'Completed', statusColor: 'green' },
];


// --- API FETCH FUNCTION ---
export const getPartyDetails = async (partyId: string): Promise<FullPartyDetailsData> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    // Find the specific party from your database
    const party = allPartiesData.find(p => p.id === partyId);

    if (!party) {
        // This will no longer throw an error if partyId is 'michael-taylor'
        throw new Error("Party not found");
    }
    
    // Filter the master order list to get only the orders for this party
    // This will correctly return an empty array if no orders match
    const orders = allOrdersData.filter(order => order.panVat === party.panVat);

    return { party, orders };
};