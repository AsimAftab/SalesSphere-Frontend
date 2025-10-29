// src/api/prospectDetailsService.ts

// Make sure you have EXPORTED prospectData from prospectService.ts
import { prospectData, type Prospect } from './prospectService'; 
// Make sure you have EXPORTED NewPartyData from partyService.ts
import { addParty, type NewPartyData } from './partyService'; 

/**
 * Simulates fetching a single prospect by its ID.
 * @param id The ID of the prospect to fetch.
 * @returns A Promise resolving to the Prospect or undefined if not found.
 */
export const getProspectById = async (id: string): Promise<Prospect | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    console.log(`getProspectById: Searching for ID: ${id}`);
    
    // FIX: Added (p: Prospect)
    const foundProspect = prospectData.find((p: Prospect) => p.id === id);
    
    if (foundProspect) {
        console.log(`getProspectById: Found:`, foundProspect);
        return { ...foundProspect }; // Return a copy to mimic API response
    }
    
    console.log(`getProspectById: Prospect with ID ${id} not found.`);
    return undefined;
};

/**
 * Simulates deleting a prospect by its ID.
 * @param id The ID of the prospect to delete.
 * @returns A Promise resolving to true on success.
 */
export const deleteProspect = async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 400));

    // FIX: Added (p: Prospect)
    const index = prospectData.findIndex((p: Prospect) => p.id === id);
    
    if (index > -1) {
        prospectData.splice(index, 1); // Mutate the mock data array
        console.log(`deleteProspect: Deleted prospect with ID: ${id}. New count: ${prospectData.length}`);
        return true;
    }
    
    console.error(`deleteProspect: Prospect with ID ${id} not found.`);
    throw new Error("Prospect not found");
};

/**
 * Simulates updating an existing prospect.
 * @param id The ID of the prospect to update.
 * @param updatedData A partial object of the prospect's data to update.
 * @returns A Promise resolving to the updated Prospect.
 */
export const updateProspect = async (id: string, updatedData: Partial<Prospect>): Promise<Prospect> => {
    await new Promise(resolve => setTimeout(resolve, 400));

    // FIX: Added (p: Prospect)
    const index = prospectData.findIndex((p: Prospect) => p.id === id);
    
    if (index > -1) {
        const currentProspect = prospectData[index];
        // Update the prospect in the mock data array
        prospectData[index] = {
            ...currentProspect,
            ...updatedData,
            id: currentProspect.id, // Ensure ID cannot be changed
            dateJoined: currentProspect.dateJoined, // Ensure dateCreated cannot be changed
        };
        
        console.log(`updateProspect: Updated prospect with ID: ${id}`, prospectData[index]);
        return { ...prospectData[index] }; // Return a copy
    }
    
    console.error(`updateProspect: Prospect with ID ${id} not found.`);
    throw new Error("Prospect not found");
};

/**
 * Simulates transferring a prospect to a party.
 * This involves removing the prospect and creating a new party.
 * @param prospectId The ID of the prospect to transfer.
 * @returns A Promise resolving to an object with success status and the new Party's ID.
 */
export const transferProspectToParty = async (prospectId: string): Promise<{ success: boolean; newPartyId: string }> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    console.log(`transferProspectToParty: Simulating transfer for Prospect ID: ${prospectId}`);

    // 1. Find and remove the prospect
    // FIX: Added (p: Prospect)
    const index = prospectData.findIndex((p: Prospect) => p.id === prospectId);
    if (index === -1) {
        console.warn(`transferProspectToParty: Prospect ${prospectId} not found for deletion.`);
        throw new Error("Prospect not found for transfer");
    }
    
    // Remove from prospectData and get the object
    const prospectToTransfer = prospectData.splice(index, 1)[0];
    console.log(`transferProspectToParty: Removed prospect ${prospectId}.`);

    // 2. Create a new Party payload from the prospect data
    // Ensure NewPartyData in partyService includes dateJoined
    const newPartyPayload: NewPartyData = {
        companyName: prospectToTransfer.name, // Map Prospect 'name' to Party 'companyName'
        ownerName: prospectToTransfer.ownerName,
        address: prospectToTransfer.address,
        dateJoined: prospectToTransfer.dateJoined, // Field now exists on prospect
        phone: prospectToTransfer.phone || '',
        email: prospectToTransfer.email || '',
        latitude: prospectToTransfer.latitude ?? null, // Convert undefined to null
        longitude: prospectToTransfer.longitude ?? null, // Convert undefined to null
        panVat: `PAN-${Date.now()}` // Create a mock PAN/VAT number
    };

    try {
        // 3. Add the new party using the partyService
        const newParty = await addParty(newPartyPayload);
        console.log(`transferProspectToParty: Successfully created new party with ID: ${newParty.id}`);
        return { success: true, newPartyId: newParty.id };
    } catch (error) {
        console.error("transferProspectToParty: Failed to create new party", error);
        // If adding the party fails, roll back by re-adding the prospect
        prospectData.splice(index, 0, prospectToTransfer); // Rollback
        console.warn(`transferProspectToParty: Rolled back. Prospect ${prospectId} re-added.`);
        throw new Error(`Failed to create party: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};

