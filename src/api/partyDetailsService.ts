// --- TYPE DEFINITIONS ---
// This defines the shape of a single order object
export interface Order {
  id: string;
  partyName: string;
  address: string;
  date: string;
  panVat: string; // The key used for filtering
  status: 'Completed' | 'Rejected' | 'In Transit';
  statusColor: 'green' | 'red' | 'yellow';
}

// This defines the shape of the party's details
export interface PartyDetails {
  id: string;
  name: string;
  location: string;
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

// This is the combined data object that the page will use
export interface FullPartyDetailsData {
    party: PartyDetails;
    orders: Order[];
}


// --- MOCK DATA (This would be replaced by API calls) ---
const partyDetailsData: PartyDetails = {
    id: 'amar-hardware',
    name: 'Amar Hardware',
    location: 'Birtamod',
    imageUrl: 'https://placehold.co/100x100/E2E8F0/4A5568?text=Logo',
    ownerName: 'Bikram Agrawal',
    phone: '9800000000',
    panVat: '0000000000',
    contact: {
        email: 'naomi.king@mail.com',
        phone: '9800000000',
        address: 'Shanti Chowk, Biratnagar, Nepal'
    }
};

const allOrdersData: Order[] = [
    { id: '00001', partyName: 'Christine Brooks', address: '089 Kutch Green Apt. 448', date: '2019-09-04T10:00:00Z', panVat: '0000000000', status: 'Completed', statusColor: 'green' },
    { id: '00002', partyName: 'Rosie Pearson', address: '979 Immanuel Ferry Suite 526', date: '2019-05-28T11:00:00Z', panVat: '1111111111', status: 'Completed', statusColor: 'green' },
    { id: '00003', partyName: 'Darrell Caldwell', address: '8587 Frida Ports', date: '2019-11-23T01:00:00Z', panVat: '0000000000', status: 'Rejected', statusColor: 'red' },
    { id: '00004', partyName: 'Gilbert Johnston', address: '05 Feb 2019 & 09:00', date: '2019-02-05T09:00:00Z', panVat: '0000000000', status: 'In Transit', statusColor: 'yellow' },
    { id: '00005', partyName: 'Alan Cain', address: '042 Mylene Throughway', date: '2019-07-29T02:00:00Z', panVat: '2222222222', status: 'Completed', statusColor: 'green' },
];


// --- API FETCH FUNCTION ---
// This function simulates fetching all data and then filtering it.
export const getPartyDetails = async (partyId: string): Promise<FullPartyDetailsData> => {
    console.log(`Fetching details for party ID: ${partyId}`); // For debugging
    
    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // In a real application, you would make an API call here:
    // const response = await api.get(`/parties/${partyId}`);
    // const partyData = response.data.party;
    // const orderData = response.data.orders;
    
    // For now, we filter the mock data
    const party = partyDetailsData; // Assume we "fetched" the correct party
    const orders = allOrdersData.filter(order => order.panVat === party.panVat);

    return { party, orders };
};
