// src/api/siteDetailsService.ts

// Import the data source, the necessary types, and the update function
import { mockSiteData, type Site, updateSiteArrayData } from './siteService';

// --- TYPE DEFINITIONS for the Details Page ---
// These might differ slightly from the basic 'Site' type if needed
export interface SiteDetails {
    id: string;
    name: string;
    location: string; // e.g., 'Bengaluru, KA'
    manager: string;  // e.g., 'Rohan Gupta'
    imageUrl?: string; // Optional image URL
    description: string;
    latitude: number;
    longitude: number;
    dateJoined: string; // The creation/join date
}

export interface SiteContact {
    email: string;
    phone: string;       // Store as plain digits? Or formatted string?
    fullAddress: string; // More detailed address
}

// Allow null for when a site isn't found or after deletion
export interface FullSiteDetailsData {
    site: SiteDetails | null;
    contact: SiteContact | null;
}
// ---

// --- GET SITE DETAILS FUNCTION ---
export const getSiteDetails = async (siteId: string): Promise<FullSiteDetailsData | null> => {
    console.log(`Fetching details for site ID from mock array: ${siteId}`);
    await new Promise(resolve => setTimeout(resolve, 300));

    if (siteId === 'error-id') { // Keep error simulation if needed
        throw new Error('Site not found (Simulated Error)');
    }

    // Find the site in the imported array
    const foundSite = mockSiteData.find((site: Site) => site.id === siteId);

    if (foundSite) {
        console.log("Found site in array:", foundSite);
        // Construct the FullSiteDetailsData object based on the found site
        const siteDetailsResult: FullSiteDetailsData = {
            site: { // Map fields from Site to SiteDetails
                id: foundSite.id,
                name: foundSite.name,
                location: foundSite.address, // Map Site.address to SiteDetails.location
                manager: foundSite.ownerName, // Map Site.ownerName to SiteDetails.manager
                description: `Mock description for ${foundSite.name}. Replace with actual data if available.`, // Add mock/real description
                latitude: foundSite.latitude ?? 0, // Provide default
                longitude: foundSite.longitude ?? 0,// Provide default
                dateJoined: foundSite.dateJoined,
                imageUrl: `https://i.pravatar.cc/150?u=${foundSite.id}`, // Generate mock image URL
            },
            contact: { // Construct mock contact details (replace with real data if available)
                // Assuming phone/email aren't in the main Site array, generate mocks
                email: `${foundSite.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
                // Generate a mock 10-digit phone number string
                phone: `98${Math.floor(10000000 + Math.random() * 90000000)}`,
                // Construct a more detailed mock address
                fullAddress: `123 ${foundSite.name} Street, ${foundSite.address}`,
            }
        };
        return siteDetailsResult;
    } else {
        console.log(`Site with ID ${siteId} not found in mockSiteData array.`);
        return null; // Return null if not found
    }
};

// --- UPDATE FUNCTION (Calls the function in siteService.ts) ---
// This function now acts as a bridge, preparing data and calling the consolidated update logic
export const updateSite = async (siteId: string, updatedDetailsData: Partial<SiteDetails> & Partial<SiteContact>): Promise<void> => {
    console.log(`Preparing update for site ${siteId} via siteDetailsService`);

    // Map fields from SiteDetails/SiteContact back to the Site type if necessary
    const siteUpdatePayload: Partial<Site> = {
         id: siteId, // Include ID if updateSiteArrayData needs it for lookup (though it uses findIndex)
         name: updatedDetailsData.name,
         ownerName: updatedDetailsData.manager, // Map manager back to ownerName
         address: updatedDetailsData.location, // Map location back to address
         latitude: updatedDetailsData.latitude,
         longitude: updatedDetailsData.longitude,
         // description is not in Site type, ignore or add it
         // phone is not in Site type, ignore or add it
         // email is not in Site type, ignore or add it
         // dateJoined is intentionally not updated
    };

    // Remove undefined fields before sending
    Object.keys(siteUpdatePayload).forEach(key =>
        (siteUpdatePayload as any)[key] === undefined && delete (siteUpdatePayload as any)[key]
    );


    // Call the function that modifies the array in siteService.ts
    await updateSiteArrayData(siteId, siteUpdatePayload);

    console.log(`Update call forwarded to siteService for ${siteId}`);
};

// --- DELETE FUNCTION IS REMOVED FROM THIS FILE ---
// It should only exist in siteService.ts to modify mockSiteData