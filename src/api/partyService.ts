// --- TYPE DEFINITION ---
export interface Party {
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
  description?: string;
}

// --- ADD THIS INTERFACE --- 👇
export interface NewPartyData {
    companyName: string; // Match the 'Party' interface field name
    ownerName: string;
    dateJoined: string; // Or dateCreated? If it's a field for the creation form
    address: string;
    latitude?: number | null; // Allow null
    longitude?: number | null; // Allow null
    email?: string;
    phone?: string;
    panVat?: string; // Add if collected in the form
    description?: string;
}
// --- END OF ADDITION --- 👆


// --- MOCK DATA ---
export const mockPartyData: Party[] = [
    {
      id: 'new-traders',
      companyName: 'New Traders Pvt. Ltd.',
      ownerName: 'Patrick Padilla',
      address: 'Thamel, Kathmandu, Nepal',
      latitude: 27.7172,
      longitude: 85.3240,
      dateCreated: '2023-03-15T08:30:00Z',
      phone: '9841234567',
      panVat: '123456789',
      email: 'octavia.nienow@gleichner.net',
      description:''
    },
    // ... (rest of mockPartyData remains the same) ...
    {
      id: 'patrick-padilla',
      companyName: 'Padilla Media Group',
      ownerName: 'Patrick Padilla',
      address: 'Bouddha, Kathmandu, Nepal',
      latitude: 27.7211,
      longitude: 85.3618,
      dateCreated: '2022-02-14T09:30:00Z',
      phone: '9811789012',
      panVat: '486753159',
      email: 'octavia.nienow@gleichner.net',
      description:'sdxsdsvjdxhdjvjdvjweispklpokvoisovkskvskvksovisokv;aslcv;sklcvkaslkv ls,cvslcvlkascvkcvls;lcla'
    },
    {
      id: 'new-traders',
      companyName: 'New Traders Pvt. Ltd.',
      ownerName: 'Patrick Padilla',
      address: 'Thamel, Kathmandu, Nepal',
      latitude: 27.7172,
      longitude: 85.3240,
      dateCreated: '2023-03-15T08:30:00Z',
      phone: '9841234567',
      panVat: '123456789',
      email: 'octavia.nienow@gleichner.net',
      description:''
    },
    // ... (rest of mockPartyData remains the same) ...
    {
      id: 'patrick-padilla',
      companyName: 'Padilla Media Group',
      ownerName: 'Patrick Padilla',
      address: 'Bouddha, Kathmandu, Nepal',
      latitude: 27.7211,
      longitude: 85.3618,
      dateCreated: '2022-02-14T09:30:00Z',
      phone: '9811789012',
      panVat: '486753159',
      email: 'octavia.nienow@gleichner.net',
      description:'sdxsdsvjdxhdjvjdvjweispklpokvoisovkskvskvksovisokv;aslcv;sklcvkaslkv ls,cvslcvlkascvkcvls;lcla'
    },
    {
      id: 'new-traders',
      companyName: 'New Traders Pvt. Ltd.',
      ownerName: 'Patrick Padilla',
      address: 'Thamel, Kathmandu, Nepal',
      latitude: 27.7172,
      longitude: 85.3240,
      dateCreated: '2023-03-15T08:30:00Z',
      phone: '9841234567',
      panVat: '123456789',
      email: 'octavia.nienow@gleichner.net',
      description:''
    },
    // ... (rest of mockPartyData remains the same) ...
    {
      id: 'patrick-padilla',
      companyName: 'Padilla Media Group',
      ownerName: 'Patrick Padilla',
      address: 'Bouddha, Kathmandu, Nepal',
      latitude: 27.7211,
      longitude: 85.3618,
      dateCreated: '2022-02-14T09:30:00Z',
      phone: '9811789012',
      panVat: '486753159',
      email: 'octavia.nienow@gleichner.net',
      description:'sdxsdsvjdxhdjvjdvjweispklpokvoisovkskvskvksovisokv;aslcv;sklcvkaslkv ls,cvslcvlkascvkcvls;lcla'
    },
    {
      id: 'new-traders',
      companyName: 'New Traders Pvt. Ltd.',
      ownerName: 'Patrick Padilla',
      address: 'Thamel, Kathmandu, Nepal',
      latitude: 27.7172,
      longitude: 85.3240,
      dateCreated: '2023-03-15T08:30:00Z',
      phone: '9841234567',
      panVat: '123456789',
      email: 'octavia.nienow@gleichner.net',
      description:''
    },
    // ... (rest of mockPartyData remains the same) ...
    {
      id: 'patrick-padilla',
      companyName: 'Padilla Media Group',
      ownerName: 'Patrick Padilla',
      address: 'Bouddha, Kathmandu, Nepal',
      latitude: 27.7211,
      longitude: 85.3618,
      dateCreated: '2022-02-14T09:30:00Z',
      phone: '9811789012',
      panVat: '486753159',
      email: 'octavia.nienow@gleichner.net',
      description:'sdxsdsvjdxhdjvjdvjweispklpokvoisovkskvskvksovisokv;aslcv;sklcvkaslkv ls,cvslcvlkascvkcvls;lcla'
    },
{
      id: 'new-traders',
      companyName: 'New Traders Pvt. Ltd.',
      ownerName: 'Patrick Padilla',
      address: 'Thamel, Kathmandu, Nepal',
      latitude: 27.7172,
      longitude: 85.3240,
      dateCreated: '2023-03-15T08:30:00Z',
      phone: '9841234567',
      panVat: '123456789',
      email: 'octavia.nienow@gleichner.net',
      description:''
    },
    // ... (rest of mockPartyData remains the same) ...
    {
      id: 'patrick-padilla',
      companyName: 'Padilla Media Group',
      ownerName: 'Patrick Padilla',
      address: 'Bouddha, Kathmandu, Nepal',
      latitude: 27.7211,
      longitude: 85.3618,
      dateCreated: '2022-02-14T09:30:00Z',
      phone: '9811789012',
      panVat: '486753159',
      email: 'octavia.nienow@gleichner.net',
      description:'sdxsdsvjdxhdjvjdvjweispklpokvoisovkskvskvksovisokv;aslcv;sklcvkaslkv ls,cvslcvlkascvkcvls;lcla'
    },
    {
      id: 'new-traders',
      companyName: 'New Traders Pvt. Ltd.',
      ownerName: 'Patrick Padilla',
      address: 'Thamel, Kathmandu, Nepal',
      latitude: 27.7172,
      longitude: 85.3240,
      dateCreated: '2023-03-15T08:30:00Z',
      phone: '9841234567',
      panVat: '123456789',
      email: 'octavia.nienow@gleichner.net',
      description:''
    },
    // ... (rest of mockPartyData remains the same) ...
    {
      id: 'patrick-padilla',
      companyName: 'Padilla Media Group',
      ownerName: 'Patrick Padilla',
      address: 'Bouddha, Kathmandu, Nepal',
      latitude: 27.7211,
      longitude: 85.3618,
      dateCreated: '2022-02-14T09:30:00Z',
      phone: '9811789012',
      panVat: '486753159',
      email: 'octavia.nienow@gleichner.net',
      description:'sdxsdsvjdxhdjvjdvjweispklpokvoisovkskvskvksovisokv;aslcv;sklcvkaslkv ls,cvslcvlkascvkcvls;lcla'
    },
    {
      id: 'new-traders',
      companyName: 'New Traders Pvt. Ltd.',
      ownerName: 'Patrick Padilla',
      address: 'Thamel, Kathmandu, Nepal',
      latitude: 27.7172,
      longitude: 85.3240,
      dateCreated: '2023-03-15T08:30:00Z',
      phone: '9841234567',
      panVat: '123456789',
      email: 'octavia.nienow@gleichner.net',
      description:''
    },
    // ... (rest of mockPartyData remains the same) ...
    {
      id: 'patrick-padilla',
      companyName: 'Padilla Media Group',
      ownerName: 'Patrick Padilla',
      address: 'Bouddha, Kathmandu, Nepal',
      latitude: 27.7211,
      longitude: 85.3618,
      dateCreated: '2022-02-14T09:30:00Z',
      phone: '9811789012',
      panVat: '486753159',
      email: 'octavia.nienow@gleichner.net',
      description:'sdxsdsvjdxhdjvjdvjweispklpokvoisovkskvskvksovisokv;aslcv;sklcvkaslkv ls,cvslcvlkascvkcvls;lcla'
    },

    {
      id: 'new-traders',
      companyName: 'New Traders Pvt. Ltd.',
      ownerName: 'Patrick Padilla',
      address: 'Thamel, Kathmandu, Nepal',
      latitude: 27.7172,
      longitude: 85.3240,
      dateCreated: '2023-03-15T08:30:00Z',
      phone: '9841234567',
      panVat: '123456789',
      email: 'octavia.nienow@gleichner.net',
      description:''
    },
    // ... (rest of mockPartyData remains the same) ...
    {
      id: 'patrick-padilla',
      companyName: 'Padilla Media Group',
      ownerName: 'Patrick Padilla',
      address: 'Bouddha, Kathmandu, Nepal',
      latitude: 27.7211,
      longitude: 85.3618,
      dateCreated: '2022-02-14T09:30:00Z',
      phone: '9811789012',
      panVat: '486753159',
      email: 'octavia.nienow@gleichner.net',
      description:'sdxsdsvjdxhdjvjdvjweispklpokvoisovkskvskvksovisokv;aslcv;sklcvkaslkv ls,cvslcvlkascvkcvls;lcla'
    },
    {
      id: 'new-traders',
      companyName: 'New Traders Pvt. Ltd.',
      ownerName: 'Patrick Padilla',
      address: 'Thamel, Kathmandu, Nepal',
      latitude: 27.7172,
      longitude: 85.3240,
      dateCreated: '2023-03-15T08:30:00Z',
      phone: '9841234567',
      panVat: '123456789',
      email: 'octavia.nienow@gleichner.net',
      description:''
    },
    // ... (rest of mockPartyData remains the same) ...
    {
      id: 'patrick-padilla',
      companyName: 'Padilla Media Group',
      ownerName: 'Patrick Padilla',
      address: 'Bouddha, Kathmandu, Nepal',
      latitude: 27.7211,
      longitude: 85.3618,
      dateCreated: '2022-02-14T09:30:00Z',
      phone: '9811789012',
      panVat: '486753159',
      email: 'octavia.nienow@gleichner.net',
      description:'sdxsdsvjdxhdjvjdvjweispklpokvoisovkskvskvksovisokv;aslcv;sklcvkaslkv ls,cvslcvlkascvkcvls;lcla'
    },
];

// --- MOCK API FETCH FUNCTION ---
export const getParties = async (): Promise<Party[]> => {
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // To test the error state, you can uncomment this line:
  // if (Math.random() > 0.8) throw new Error("Failed to fetch parties from the server.");

  return mockPartyData;
};

// --- ADD PARTY FUNCTION ---
// --- UPDATED to use NewPartyData --- 👇
export const addParty = async (partyData: NewPartyData): Promise<Party> => {
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Create new party with generated ID and current date for dateCreated
  const newParty: Party = {
    id: `party-${Date.now()}`,
    companyName: partyData.companyName,
    ownerName: partyData.ownerName,
    address: partyData.address,
    latitude: partyData.latitude ?? null, // Default to null if undefined
    longitude: partyData.longitude ?? null, // Default to null if undefined
    dateCreated: new Date().toISOString(), // Generate creation date here
    phone: partyData.phone ?? '', // Default to empty string
    panVat: partyData.panVat ?? '', // Default to empty string
    email: partyData.email ?? '', // Default to empty string
    description: partyData.description ?? '',
  };

  // In a real application, this would make an API call to add the party to the database
  // For now, we'll just add it to our mock data
  mockPartyData.push(newParty);

  return newParty;
};

// --- DELETE PARTY FUNCTION ---
export const deleteParty = async (partyId: string): Promise<boolean> => {
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Find the index of the party to delete
  const partyIndex = mockPartyData.findIndex(p => p.id === partyId);

  if (partyIndex === -1) {
    throw new Error(`Party with ID ${partyId} not found`);
  }

  // In a real application, this would make an API call to delete the party from the database
  // For now, we'll just remove it from our mock data
  mockPartyData.splice(partyIndex, 1);

  return true;
};

// --- UPDATE PARTY FUNCTION ---
export const updateParty = async (partyId: string, updatedData: Partial<Party>): Promise<Party> => {
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Find the party to update
  const partyIndex = mockPartyData.findIndex(p => p.id === partyId);

  if (partyIndex === -1) {
    throw new Error(`Party with ID ${partyId} not found`);
  }

  // Update the party in mock data
  mockPartyData[partyIndex] = {
    ...mockPartyData[partyIndex],
    ...updatedData,
  };

  return mockPartyData[partyIndex];
};

// --- BULK UPLOAD RESULT INTERFACE ---
export interface BulkUploadResult {
  success: number;
  failed: number;
  errors: string[];
}

// --- BULK UPLOAD PARTIES FUNCTION ---
export const bulkUploadParties = async (
  _organizationId: string,
  parties: Omit<Party, 'id' | 'dateCreated'>[] // This correctly expects data without id/dateCreated
): Promise<BulkUploadResult> => {
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const result: BulkUploadResult = {
    success: 0,
    failed: 0,
    errors: []
  };

  // Validate and add each party
  for (let i = 0; i < parties.length; i++) {
    const partyData = parties[i];

    try {
      // Validate required fields
      if (!partyData.companyName || !partyData.ownerName || !partyData.address) {
        result.failed++;
        result.errors.push(`Row ${i + 2}: Missing required fields (Company Name, Owner Name, or Address)`);
        continue;
      }

      // Validate email format
      if (!partyData.email || !partyData.email.includes('@')) {
        result.failed++;
        result.errors.push(`Row ${i + 2}: Email is required and must be valid`);
        continue;
      }

      // Validate phone number (must be 10 digits)
      if (!partyData.phone || !/^\d{10}$/.test(partyData.phone)) {
        result.failed++;
        result.errors.push(`Row ${i + 2}: Phone number is required and must be 10 digits`);
        continue;
      }

      // Create new party with generated ID and current date
      const randomSuffix = Array.from(crypto.getRandomValues(new Uint8Array(9)))
        .map(b => b.toString(36))
        .join('')
        .substr(0, 9);
      const newParty: Party = {
        id: `party-${Date.now()}-${randomSuffix}`,
        companyName: partyData.companyName,
        ownerName: partyData.ownerName,
        address: partyData.address,
        phone: partyData.phone || '',
        panVat: partyData.panVat || '',
        email: partyData.email || '',
        latitude: partyData.latitude,
        longitude: partyData.longitude,
        dateCreated: new Date().toISOString(),
        description: partyData.description ?? '',
      };

      // Add to mock data
      mockPartyData.push(newParty);
      result.success++;

    } catch (error) {
      result.failed++;
      result.errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return result;
};

// --- Note: Removed NewProspectData definition from here as it likely belongs in prospectService.ts ---