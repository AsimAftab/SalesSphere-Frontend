// --- TYPE DEFINITION ---
export interface Party {
  id: string;
  companyName: string;
  ownerName: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  dateCreated: string; // ISO date string
  email: string;
  // Legacy fields (kept for backward compatibility if needed)
  designation?: string;
}

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
      email: 'octavia.nienow@gleichner.net',
      designation: 'Social Media'
    },
    {
      id: 'michael-taylor',
      companyName: 'Taylor Design Studio',
      ownerName: 'Michael Taylor',
      address: 'Durbar Marg, Kathmandu 44600, Nepal',
      latitude: 27.7056,
      longitude: 85.3164,
      dateCreated: '2022-08-22T10:15:00Z',
      email: 'michael.taylor@example.com',
      designation: 'Designer'
    },
    {
      id: 'barbara-anderson',
      companyName: 'Anderson Enterprises',
      ownerName: 'Barbara Anderson',
      address: 'Lakeside, Pokhara 33700, Nepal',
      latitude: 28.2096,
      longitude: 83.9588,
      dateCreated: '2021-11-10T14:20:00Z',
      email: 'barbara.anderson@example.com',
      designation: 'Manager'
    },
    {
      id: 'william-thomas',
      companyName: 'Thomas Tech Solutions',
      ownerName: 'William Thomas',
      address: 'Pulchowk, Lalitpur 44700, Nepal',
      latitude: 27.6784,
      longitude: 85.3168,
      dateCreated: '2023-01-05T09:45:00Z',
      email: 'william.thomas@example.com',
      designation: 'Developer'
    },
    {
      id: 'elizabeth-jackson',
      companyName: 'Jackson Creative Agency',
      ownerName: 'Elizabeth Jackson',
      address: 'Jhamsikhel, Lalitpur, Nepal',
      latitude: 27.6698,
      longitude: 85.3102,
      dateCreated: '2022-05-18T11:30:00Z',
      email: 'elizabeth.jackson@example.com',
      designation: 'Designer'
    },
    {
      id: 'richard-white',
      companyName: 'White & Associates',
      ownerName: 'Richard White',
      address: 'Biratnagar 56613, Nepal',
      latitude: 26.4525,
      longitude: 87.2718,
      dateCreated: '2020-09-12T07:00:00Z',
      email: 'richard.white@example.com',
      designation: 'Manager'
    },
    {
      id: 'jennifer-harris',
      companyName: 'Harris Software House',
      ownerName: 'Jennifer Harris',
      address: 'Battisputali, Kathmandu, Nepal',
      latitude: 27.6993,
      longitude: 85.3346,
      dateCreated: '2023-02-28T13:15:00Z',
      email: 'jennifer.harris@example.com',
      designation: 'Developer'
    },
    {
      id: 'charles-martin',
      companyName: 'Martin Graphics Ltd.',
      ownerName: 'Charles Martin',
      address: 'New Road, Kathmandu, Nepal',
      latitude: 27.7025,
      longitude: 85.3077,
      dateCreated: '2022-07-04T16:00:00Z',
      email: 'charles.martin@example.com',
      designation: 'Designer'
    },
    {
      id: 'sarah-thompson',
      companyName: 'Thompson Business Consulting',
      ownerName: 'Sarah Thompson',
      address: 'Baneshwor, Kathmandu 44600, Nepal',
      latitude: 27.6934,
      longitude: 85.3381,
      dateCreated: '2021-04-20T08:45:00Z',
      email: 'sarah.thompson@example.com',
      designation: 'Manager'
    },
    {
      id: 'joseph-garcia',
      companyName: 'Garcia Digital Solutions',
      ownerName: 'Joseph Garcia',
      address: 'Bhaktapur Durbar Square, Bhaktapur 44800, Nepal',
      latitude: 27.6722,
      longitude: 85.4298,
      dateCreated: '2023-06-10T10:30:00Z',
      email: 'joseph.garcia@example.com',
      designation: 'Developer'
    },
    {
      id: 'karen-martinez',
      companyName: 'Martinez Design House',
      ownerName: 'Karen Martinez',
      address: 'Dharan 56700, Nepal',
      latitude: 26.8149,
      longitude: 87.2847,
      dateCreated: '2022-10-15T12:00:00Z',
      email: 'karen.martinez@example.com',
      designation: 'Designer'
    },
    {
      id: 'thomas-robinson',
      companyName: 'Robinson Management Group',
      ownerName: 'Thomas Robinson',
      address: 'Butwal 32907, Nepal',
      latitude: 27.7000,
      longitude: 83.4486,
      dateCreated: '2021-12-01T09:00:00Z',
      email: 'thomas.robinson@example.com',
      designation: 'Manager'
    },
    {
      id: 'nancy-clark',
      companyName: 'Clark Tech Innovations',
      ownerName: 'Nancy Clark',
      address: 'Koteshwor, Kathmandu, Nepal',
      latitude: 27.6774,
      longitude: 85.3476,
      dateCreated: '2023-04-08T15:20:00Z',
      email: 'nancy.clark@example.com',
      designation: 'Developer'
    },
    {
      id: 'daniel-rodriguez',
      companyName: 'Rodriguez Creative Studio',
      ownerName: 'Daniel Rodriguez',
      address: 'Sanepa, Lalitpur, Nepal',
      latitude: 27.6885,
      longitude: 85.3029,
      dateCreated: '2022-03-25T11:45:00Z',
      email: 'daniel.rodriguez@example.com',
      designation: 'Designer'
    },
    {
      id: 'jason-price',
      companyName: 'Price Holdings Ltd.',
      ownerName: 'Jason Price',
      address: 'Hetauda 44107, Nepal',
      latitude: 27.4280,
      longitude: 85.0324,
      dateCreated: '2020-06-30T07:30:00Z',
      email: 'janick_parisian@yahoo.com',
      designation: 'Admin'
    },
    {
      id: 'jukkoe-sisao',
      companyName: 'Sisao International Trading',
      ownerName: 'Jukkoe Sisao',
      address: 'Birtamod 57204, Nepal',
      latitude: 26.6714,
      longitude: 87.9766,
      dateCreated: '2019-08-14T06:00:00Z',
      email: 'sibyl_koey@hotmail.com',
      designation: 'CEO'
    },
    {
      id: 'harriet-king',
      companyName: 'King Technology Services',
      ownerName: 'Harriet King',
      address: 'Kupondole, Lalitpur, Nepal',
      latitude: 27.6894,
      longitude: 85.3125,
      dateCreated: '2021-02-17T10:00:00Z',
      email: 'nadia_block@hotmail.com',
      designation: 'CTO'
    },
    {
      id: 'lenora-benson',
      companyName: 'Benson Logistics Pvt. Ltd.',
      ownerName: 'Lenora Benson',
      address: 'Nepalgunj 21900, Nepal',
      latitude: 28.0504,
      longitude: 81.6171,
      dateCreated: '2022-11-22T14:30:00Z',
      email: 'feil.wallace@kunde.us',
      designation: 'Lead'
    },
    {
      id: 'olivia-reese',
      companyName: 'Reese Marketing Solutions',
      ownerName: 'Olivia Reese',
      address: 'Chabahil, Kathmandu, Nepal',
      latitude: 27.7217,
      longitude: 85.3578,
      dateCreated: '2023-05-03T09:15:00Z',
      email: 'kemmer.hattie@cremin.us',
      designation: 'Strategist'
    },
    {
      id: 'bertha-valdez',
      companyName: 'Valdez Digital Marketing',
      ownerName: 'Bertha Valdez',
      address: 'Damak 57217, Nepal',
      latitude: 26.6629,
      longitude: 87.7013,
      dateCreated: '2022-09-08T13:00:00Z',
      email: 'loraine.koelpin@tromp.io',
      designation: 'Digital Marketer'
    },
    {
      id: 'harriett-payne',
      companyName: 'Payne Corporation',
      ownerName: 'Harriett Payne',
      address: 'Janakpur 45600, Nepal',
      latitude: 26.7288,
      longitude: 85.9244,
      dateCreated: '2020-01-12T08:00:00Z',
      email: 'nunnie_west@estrella.tv',
      designation: 'CEO'
    },
    {
      id: 'george-bryant',
      companyName: 'Bryant Social Media Agency',
      ownerName: 'George Bryant',
      address: 'Lazimpat, Kathmandu, Nepal',
      latitude: 27.7243,
      longitude: 85.3244,
      dateCreated: '2023-07-19T11:00:00Z',
      email: 'delmer.kling@gmail.com',
      designation: 'Social Media'
    },
    {
      id: 'lily-french',
      companyName: 'French Strategy Consultants',
      ownerName: 'Lily French',
      address: 'Itahari 56705, Nepal',
      latitude: 26.6714,
      longitude: 87.2757,
      dateCreated: '2022-04-11T10:45:00Z',
      email: 'lucienne.herman@hotmail.com',
      designation: 'Strategist'
    },
    {
      id: 'howard-adkins',
      companyName: 'Adkins Enterprises',
      ownerName: 'Howard Adkins',
      address: 'Birgunj 44300, Nepal',
      latitude: 27.0104,
      longitude: 84.8808,
      dateCreated: '2019-11-25T07:15:00Z',
      email: 'wiegand.leonor@herman.us',
      designation: 'CEO'
    },
    {
      id: 'earl-bowman',
      companyName: 'Bowman Digital Agency',
      ownerName: 'Earl Bowman',
      address: 'Dillibazar, Kathmandu, Nepal',
      latitude: 27.7086,
      longitude: 85.3252,
      dateCreated: '2023-08-30T12:30:00Z',
      email: 'waino_ankeny@nicolette.tv',
      designation: 'Digital Marketer'
    },
    {
      id: 'patrick-padilla',
      companyName: 'Padilla Media Group',
      ownerName: 'Patrick Padilla',
      address: 'Bouddha, Kathmandu, Nepal',
      latitude: 27.7211,
      longitude: 85.3618,
      dateCreated: '2022-02-14T09:30:00Z',
      email: 'octavia.nienow@gleichner.net',
      designation: 'Social Media'
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
export const addParty = async (partyData: Omit<Party, 'id'>): Promise<Party> => {
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Create new party with generated ID
  const newParty: Party = {
    id: `party-${Date.now()}`,
    ...partyData,
  };

  // In a real application, this would make an API call to add the party to the database
  // For now, we'll just add it to our mock data
  mockPartyData.push(newParty);

  console.log('Party added to mock data:', newParty);

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

  console.log('Party deleted from mock data:', partyId);

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

  console.log('Party updated in mock data:', mockPartyData[partyIndex]);

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
  organizationId: string,
  parties: Omit<Party, 'id' | 'dateCreated'>[]
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

      // Validate email format if provided
      if (partyData.email && !partyData.email.includes('@')) {
        result.failed++;
        result.errors.push(`Row ${i + 2}: Invalid email format`);
        continue;
      }

      // Create new party with generated ID and current date
      const newParty: Party = {
        id: `party-${Date.now()}-${i}`,
        companyName: partyData.companyName,
        ownerName: partyData.ownerName,
        address: partyData.address,
        email: partyData.email || '',
        latitude: partyData.latitude,
        longitude: partyData.longitude,
        dateCreated: new Date().toISOString(),
        designation: partyData.designation
      };

      // Add to mock data
      mockPartyData.push(newParty);
      result.success++;

    } catch (error) {
      result.failed++;
      result.errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  console.log(`Bulk upload complete for organization ${organizationId}:`, result);

  return result;
};
