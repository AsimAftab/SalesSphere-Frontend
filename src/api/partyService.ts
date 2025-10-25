// --- TYPE DEFINITION (Enhanced) ---
export interface Party {
  id: string;
  companyName: string;
  ownerName: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  dateCreated: string; // ISO date string
  email: string;
  phone: string; // Added phone
  panVat: string; // Added panVat
  designation?: string;
  // Add any other fields you might need for details view
}

// --- MOCK DATA (Single Source of Truth with added fields) ---
export const mockPartyData: Party[] = [
    // Added phone and panVat to each entry
    {
      id: 'new-traders',
      companyName: 'New Traders Pvt. Ltd.',
      ownerName: 'Patrick Padilla',
      address: 'Thamel, Kathmandu, Nepal',
      latitude: 27.7172,
      longitude: 85.3240,
      dateCreated: '2023-03-15T08:30:00Z',
      email: 'octavia.nienow@gleichner.net',
      phone: '9800000000', // Example phone
      panVat: '1000000000', // Example PAN/VAT
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
      phone: '9811111111',
      panVat: '1111111111',
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
      phone: '9822222222',
      panVat: '1222222222',
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
      phone: '9833333333',
      panVat: '1333333333',
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
      phone: '9844444444',
      panVat: '1444444444',
      designation: 'Designer'
    },
    // NOTE: Ensure phone and panVat were added to ALL mock entries
     {
      id: 'richard-white',
      companyName: 'White & Associates',
      ownerName: 'Richard White',
      address: 'Biratnagar 56613, Nepal',
      latitude: 26.4525,
      longitude: 87.2718,
      dateCreated: '2020-09-12T07:00:00Z',
      email: 'richard.white@example.com',
      phone: '9855555555',
      panVat: '1555555555',
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
      phone: '9866666666',
      panVat: '1666666666',
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
      phone: '9877777777',
      panVat: '1777777777',
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
      phone: '9888888888',
      panVat: '1888888888',
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
      phone: '9899999999',
      panVat: '1999999999',
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
      phone: '9810101010',
      panVat: '1101010101',
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
      phone: '9812121212',
      panVat: '1121212121',
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
      phone: '9813131313',
      panVat: '1131313131',
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
      phone: '9814141414',
      panVat: '1141414141',
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
      phone: '9815151515',
      panVat: '1151515151',
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
      phone: '9816161616',
      panVat: '1161616161',
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
      phone: '9817171717',
      panVat: '1171717171',
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
      phone: '9818181818',
      panVat: '1181818181',
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
      phone: '9819191919',
      panVat: '1191919191',
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
      phone: '9820202020',
      panVat: '1202020202',
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
      phone: '9821212121',
      panVat: '1212121212',
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
      phone: '9822222222', // Reused phone number, ideally unique
      panVat: '1222222222', // Reused PAN/VAT, ideally unique
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
      phone: '9823232323',
      panVat: '1232323232',
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
      phone: '9824242424',
      panVat: '1242424242',
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
      phone: '9825252525', // Reused phone number
      panVat: '1252525252', // Reused PAN/VAT
      designation: 'Digital Marketer'
    },
     {
      id: 'patrick-padilla-2', // Made ID unique
      companyName: 'Padilla Media Group',
      ownerName: 'Patrick Padilla',
      address: 'Bouddha, Kathmandu, Nepal',
      latitude: 27.7211,
      longitude: 85.3618,
      dateCreated: '2022-02-14T09:30:00Z',
      email: 'octavia.nienow@gleichner.net',
      phone: '9826262626', // Made phone unique
      panVat: '1262626262', // Made PAN/VAT unique
      designation: 'Social Media'
    },
];

// --- MOCK API FETCH FUNCTION (for list) ---
export const getParties = async (): Promise<Party[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockPartyData;
};

// --- ADD PARTY FUNCTION (operates on mockPartyData) ---
export const addParty = async (partyData: Omit<Party, 'id' | 'dateCreated'>): Promise<Party> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  // Construct the new party object, spreading partyData first
  const newParty: Party = {
    // Spread incoming data
    ...partyData,
    // Add required fields with defaults ONLY if they weren't in partyData
    // (but they should be, based on the Omit type)
    phone: partyData.phone, // Required, should be present
    panVat: partyData.panVat, // Required, should be present
    latitude: partyData.latitude ?? null, // Default to null if not provided
    longitude: partyData.longitude ?? null, // Default to null if not provided
    // Generate ID and set dateCreated
    id: `party-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    dateCreated: new Date().toISOString(),
  };

  mockPartyData.push(newParty);
  console.log('Party added to mockPartyData:', newParty);
  return newParty;
};


// --- DELETE PARTY FUNCTION (operates on mockPartyData) ---
export const deleteParty = async (partyId: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const partyIndex = mockPartyData.findIndex(p => p.id === partyId);
  if (partyIndex === -1) {
    throw new Error(`Party with ID ${partyId} not found in mockPartyData`);
  }
  mockPartyData.splice(partyIndex, 1);
  console.log('Party deleted from mockPartyData:', partyId);
  return true;
};

// --- UPDATE PARTY FUNCTION (operates on mockPartyData) ---
export const updateParty = async (partyId: string, updatedData: Partial<Party>): Promise<Party> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const partyIndex = mockPartyData.findIndex(p => p.id === partyId);
  if (partyIndex === -1) {
    throw new Error(`Party with ID ${partyId} not found in mockPartyData`);
  }
  // Ensure ID and dateCreated are not overwritten
  const currentParty = mockPartyData[partyIndex];
  mockPartyData[partyIndex] = {
    ...currentParty,
    ...updatedData,
    id: currentParty.id,
    dateCreated: currentParty.dateCreated,
  };
  console.log('Party updated in mockPartyData:', mockPartyData[partyIndex]);
  return mockPartyData[partyIndex];
};

// --- GET PARTY BY ID FUNCTION (operates on mockPartyData) ---
export const getPartyById = async (partyId: string): Promise<Party | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate delay
    const party = mockPartyData.find(p => p.id === partyId);
    if (!party) {
        console.warn(`Party with ID ${partyId} not found in getPartyById.`);
    }
    return party;
};


// --- BULK UPLOAD (operates on mockPartyData) ---
export interface BulkUploadResult {
  success: number;
  failed: number;
  errors: string[];
}
export const bulkUploadParties = async (
  _organizationId: string,
  // Ensure incoming parties match the enhanced Party type structure (minus id/dateCreated)
  parties: Omit<Party, 'id' | 'dateCreated'>[]
): Promise<BulkUploadResult> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  const result: BulkUploadResult = { success: 0, failed: 0, errors: [] };

  for (let i = 0; i < parties.length; i++) {
    const partyData = parties[i];
    try {
      // Validation (ensure all required fields from Party type are present)
       if (!partyData.companyName || !partyData.ownerName || !partyData.address || !partyData.phone || !partyData.panVat || !partyData.email) {
            result.failed++;
            result.errors.push(`Row ${i + 2}: Missing required fields`);
            continue;
       }
      if (partyData.email && !partyData.email.includes('@')) {
           result.failed++;
            result.errors.push(`Row ${i + 2}: Invalid email format`);
           continue;
       }

      // Construct the new party object, spreading partyData first
      const newParty: Party = {
         // Spread incoming data
         ...partyData,
         // Add required fields with defaults ONLY if they weren't in partyData
         phone: partyData.phone,
         panVat: partyData.panVat,
         latitude: partyData.latitude ?? null, // Default to null if not provided
         longitude: partyData.longitude ?? null, // Default to null if not provided
         // Generate ID and set dateCreated
         id: `bulk-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 7)}`,
         dateCreated: new Date().toISOString(),
      };

      mockPartyData.push(newParty);
      result.success++;

    } catch (error) {
      result.failed++;
      result.errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  console.log('Bulk upload complete:', result);
  return result;
};

