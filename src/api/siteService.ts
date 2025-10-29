// src/api/siteService.ts

// --- TYPE DEFINITIONS ---
export interface Site {
  id: string;
  name: string;
  ownerName: string; // Or manager? Ensure consistency with how you display/use it
  address: string;   // Or location? Ensure consistency
  latitude?: number;
  longitude?: number;
  dateJoined: string; // Or dateCreated? Ensure consistency
}

export interface NewSiteData {
  name: string;
  ownerName: string; // Or manager?
  address: string;   // Or location?
  dateJoined: string; // Or dateCreated?
  description: string; // Add other fields from AddSiteModal
  phone: string;       // Add other fields from AddSiteModal
  email: string;       // Add other fields from AddSiteModal
  latitude?: number;
  longitude?: number;
}
// ---

// --- MOCK DATA ---
// Use 'let' so the array can be modified
export let mockSiteData: Site[] = [
    // Your existing array of mock sites...
    // Example using fixed date strings for consistency:
    {
      id: 'site-01',
      name: 'Main Warehouse',
      ownerName: 'Rohan Gupta',
      address: 'Bengaluru, KA',
      latitude: 12.9716,
      longitude: 77.5946,
      dateJoined: '2023-01-15T10:00:00Z'
    },
    {
      id: 'site-02',
      name: 'North Hub',
      ownerName: 'Priya Singh',
      address: 'Delhi, DL',
      latitude: 28.6139,
      longitude: 77.2090,
      dateJoined: '2023-02-20T11:00:00Z'
    },
    // ... include all 18 mock sites here ...
     {
      id: 'site-18',
      name: 'Guwahati East Hub',
      ownerName: 'Sameer Khan',
      address: 'Guwahati, AS',
      latitude: 26.1445,
      longitude: 91.7362,
      dateJoined: '2022-12-05T08:00:00Z'
    },
     {
      id: 'site-01',
      name: 'Main Warehouse',
      ownerName: 'Rohan Gupta',
      address: 'Bengaluru, KA',
      latitude: 12.9716,
      longitude: 77.5946,
      dateJoined: '2023-01-15T10:00:00Z'
    },
    {
      id: 'site-02',
      name: 'North Hub',
      ownerName: 'Priya Singh',
      address: 'Delhi, DL',
      latitude: 28.6139,
      longitude: 77.2090,
      dateJoined: '2023-02-20T11:00:00Z'
    },
    // ... include all 18 mock sites here ...
     {
      id: 'site-18',
      name: 'Guwahati East Hub',
      ownerName: 'Sameer Khan',
      address: 'Guwahati, AS',
      latitude: 26.1445,
      longitude: 91.7362,
      dateJoined: '2022-12-05T08:00:00Z'
    },
     {
      id: 'site-01',
      name: 'Main Warehouse',
      ownerName: 'Rohan Gupta',
      address: 'Bengaluru, KA',
      latitude: 12.9716,
      longitude: 77.5946,
      dateJoined: '2023-01-15T10:00:00Z'
    },
    {
      id: 'site-02',
      name: 'North Hub',
      ownerName: 'Priya Singh',
      address: 'Delhi, DL',
      latitude: 28.6139,
      longitude: 77.2090,
      dateJoined: '2023-02-20T11:00:00Z'
    },
    // ... include all 18 mock sites here ...
     {
      id: 'site-18',
      name: 'Guwahati East Hub',
      ownerName: 'Sameer Khan',
      address: 'Guwahati, AS',
      latitude: 26.1445,
      longitude: 91.7362,
      dateJoined: '2022-12-05T08:00:00Z'
    },
     {
      id: 'site-01',
      name: 'Main Warehouse',
      ownerName: 'Rohan Gupta',
      address: 'Bengaluru, KA',
      latitude: 12.9716,
      longitude: 77.5946,
      dateJoined: '2023-01-15T10:00:00Z'
    },
    {
      id: 'site-02',
      name: 'North Hub',
      ownerName: 'Priya Singh',
      address: 'Delhi, DL',
      latitude: 28.6139,
      longitude: 77.2090,
      dateJoined: '2023-02-20T11:00:00Z'
    },
    // ... include all 18 mock sites here ...
     {
      id: 'site-18',
      name: 'Guwahati East Hub',
      ownerName: 'Sameer Khan',
      address: 'Guwahati, AS',
      latitude: 26.1445,
      longitude: 91.7362,
      dateJoined: '2022-12-05T08:00:00Z'
    },
     {
      id: 'site-01',
      name: 'Main Warehouse',
      ownerName: 'Rohan Gupta',
      address: 'Bengaluru, KA',
      latitude: 12.9716,
      longitude: 77.5946,
      dateJoined: '2023-01-15T10:00:00Z'
    },
    {
      id: 'site-02',
      name: 'North Hub',
      ownerName: 'Priya Singh',
      address: 'Delhi, DL',
      latitude: 28.6139,
      longitude: 77.2090,
      dateJoined: '2023-02-20T11:00:00Z'
    },
    // ... include all 18 mock sites here ...
     {
      id: 'site-18',
      name: 'Guwahati East Hub',
      ownerName: 'Sameer Khan',
      address: 'Guwahati, AS',
      latitude: 26.1445,
      longitude: 91.7362,
      dateJoined: '2022-12-05T08:00:00Z'
    },
];

// --- GET SITES FUNCTION (For List View) ---
export const getSites = async (): Promise<Site[]> => {
  console.log("Fetching site list from mock data...");
  await new Promise(resolve => setTimeout(resolve, 300));
  // Return a copy to prevent accidental direct modification elsewhere
  return [...mockSiteData];
};

// --- ADD SITE FUNCTION ---
export const addSite = async (newSite: NewSiteData): Promise<Site> => {
    await new Promise(resolve => setTimeout(resolve, 400));

    if (!newSite.name || !newSite.ownerName || !newSite.address) {
        throw new Error("Site name, owner name, and address are required.");
    }
    if (mockSiteData.some(s => s.name === newSite.name)) {
       throw new Error(`Site with name ${newSite.name} already exists.`);
    }

    // Create the new Site object matching the Site interface
    const createdSite: Site = {
        id: `site-${Date.now()}`, // Generate ID
        name: newSite.name,
        ownerName: newSite.ownerName, // Match Site interface
        address: newSite.address,     // Match Site interface
        latitude: newSite.latitude,
        longitude: newSite.longitude,
        dateJoined: newSite.dateJoined // Match Site interface
        // Add other fields to Site interface if they need to be stored/returned in the list
    };

    mockSiteData.unshift(createdSite); // Add to beginning of the array
    console.log("Added site to mock data:", createdSite);
    return createdSite;
};

// --- DELETE SITE FUNCTION ---
export const deleteSite = async (siteId: string): Promise<void> => {
    console.log(`Attempting to delete site ${siteId} from mock array`);
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay

    const indexToDelete = mockSiteData.findIndex((site: Site) => site.id === siteId); // Added type

    if (indexToDelete !== -1) {
        mockSiteData.splice(indexToDelete, 1); // Remove the item from the array
        console.log(`Mock site ${siteId} deleted successfully from array.`);
    } else {
        console.error(`Mock site with ID ${siteId} not found in array for deletion.`);
        throw new Error(`Mock site with ID ${siteId} not found`);
    }
};

// --- UPDATE SITE FUNCTION (Consolidated Here) ---
// It's better to have functions modifying the array in the same file that owns the array
export const updateSiteArrayData = async (siteId: string, updatedData: Partial<Site>): Promise<Site> => {
    console.log(`Attempting to update site ${siteId} in mock array with data:`, updatedData);
    await new Promise(resolve => setTimeout(resolve, 300));

    const siteIndex = mockSiteData.findIndex((s: Site) => s.id === siteId); // Added type

    if (siteIndex !== -1) {
        // Update the item in the main array
        // Use spread operator cautiously, ensure updatedData matches Site fields
        mockSiteData[siteIndex] = {
            ...mockSiteData[siteIndex], // Keep existing fields
            ...updatedData, // Overwrite with fields from updatedData
            // Ensure required fields aren't accidentally removed if updatedData omits them
            id: mockSiteData[siteIndex].id, // Keep original ID
            dateJoined: mockSiteData[siteIndex].dateJoined, // Keep original dateJoined
        };
        console.log(`Mock site ${siteId} updated successfully in array.`);
        return mockSiteData[siteIndex]; // Return the updated site
    } else {
        console.error(`Mock site with ID ${siteId} not found for update.`);
        throw new Error(`Mock site with ID ${siteId} not found`);
    }
};