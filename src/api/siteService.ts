// src/api/siteService.ts

// --- MODIFIED: Site interface uses dateJoined and removes imageUrl ---
export interface Site {
  id: string;
  name: string;       
  ownerName: string;   
  address: string;     
  latitude?: number;
  longitude?: number;
  dateJoined: string; // 💡 CHANGED from dateCreated
}

// --- MODIFIED: NewSiteData uses dateJoined and removes imageUrl ---
export interface NewSiteData {
  name: string;
  ownerName: string;
  address: string;
  dateJoined: string; // 💡 CHANGED from dateCreated
  description: string;
  phone: string;
  email: string;
  latitude?: number;
  longitude?: number;
}
// ---

// --- MODIFIED: Updated mock data to use dateJoined and remove imageUrl ---
let mockSiteData: Site[] = [
    { 
      id: 'site-01', 
      name: 'Main Warehouse', 
      ownerName: 'Rohan Gupta',
      address: 'Bengaluru, KA',
      latitude: 12.9716, 
      longitude: 77.5946, 
      dateJoined: new Date().toISOString() // 💡 CHANGED
    },
    { 
      id: 'site-02', 
      name: 'North Hub', 
      ownerName: 'Priya Singh',
      address: 'Delhi, DL',
      latitude: 28.6139, 
      longitude: 77.2090, 
      dateJoined: new Date().toISOString() // 💡 CHANGED
    },
    { 
      id: 'site-03', 
      name: 'West Distribution', 
      ownerName: 'Amit Patel',
      address: 'Mumbai, MH',
      latitude: 19.0760, 
      longitude: 72.8777, 
      dateJoined: new Date().toISOString() // 💡 CHANGED
    },
    { 
      id: 'site-04', 
      name: 'Chennai Depot', 
      ownerName: 'Anjali Mehta',
      address: 'Chennai, TN',
      latitude: 13.0827, 
      longitude: 80.2707, 
      dateJoined: new Date().toISOString() // 💡 CHANGED
    },
    { 
      id: 'site-05', 
      name: 'Kolkata Logistics', 
      ownerName: 'Vikram Sharma',
      address: 'Kolkata, WB',
      latitude: 22.5726, 
      longitude: 88.3639, 
      dateJoined: new Date().toISOString() // 💡 CHANGED
    },
    { 
      id: 'site-06', 
      name: 'Hyderabad Hub', 
      ownerName: 'Sunita Rao',
      address: 'Hyderabad, TS',
      latitude: 17.3850, 
      longitude: 78.4867, 
      dateJoined: new Date().toISOString() // 💡 CHANGED
    },
    { 
      id: 'site-07', 
      name: 'Pune Warehouse', 
      ownerName: 'Rajesh Kumar',
      address: 'Pune, MH',
      latitude: 18.5204, 
      longitude: 73.8567, 
      dateJoined: new Date().toISOString() // 💡 CHANGED
    },
    { 
      id: 'site-08', 
      name: 'Ahmedabad Center', 
      ownerName: 'Meera Reddy',
      address: 'Ahmedabad, GJ',
      latitude: 23.0225, 
      longitude: 72.5714, 
      dateJoined: new Date().toISOString() // 💡 CHANGED
    },
    { 
      id: 'site-09', 
      name: 'Jaipur Stockroom', 
      ownerName: 'Deepak Verma',
      address: 'Jaipur, RJ',
      latitude: 26.9124, 
      longitude: 75.7873, 
      dateJoined: new Date().toISOString() // 💡 CHANGED
    },
    { 
      id: 'site-10', 
      name: 'Lucknow Unit', 
      ownerName: 'Kavita Desai',
      address: 'Lucknow, UP',
      latitude: 26.8467, 
      longitude: 80.9462, 
      dateJoined: new Date().toISOString() // 💡 CHANGED
    },
    { 
      id: 'site-11', 
      name: 'Chandigarh Depot', 
      ownerName: 'Arjun Nair',
      address: 'Chandigarh, CH',
      latitude: 30.7333, 
      longitude: 76.7794, 
      dateJoined: new Date().toISOString() // 💡 CHANGED
    },
    { 
      id: 'site-12', 
      name: 'Kochi Terminal', 
      ownerName: 'Neha Agarwal',
      address: 'Kochi, KL',
      latitude: 9.9312, 
      longitude: 76.2673, 
      dateJoined: new Date().toISOString() // 💡 CHANGED
    },
    { 
      id: 'site-13', 
      name: 'Bhopal Warehouse', 
      ownerName: 'Harish Joshi',
      address: 'Bhopal, MP',
      latitude: 23.2599, 
      longitude: 77.4126, 
      dateJoined: new Date().toISOString() // 💡 CHANGED
    },
    { 
      id: 'site-14', 
      name: 'Patna Distribution', 
      ownerName: 'Geeta Iyer',
      address: 'Patna, BR',
      latitude: 25.5941, 
      longitude: 85.1376, 
      dateJoined: new Date().toISOString() // 💡 CHANGED
    },
    { 
      id: 'site-15', 
      name: 'Nagpur Hub', 
      ownerName: 'Suresh Menon',
      address: 'Nagpur, MH',
      latitude: 21.1458, 
      longitude: 79.0882, 
      dateJoined: new Date().toISOString() // 💡 CHANGED
    },
    { 
      id: 'site-16', 
      name: 'Indore Gateway', 
      ownerName: 'Preeti Narayan',
      address: 'Indore, MP',
      latitude: 22.7196, 
      longitude: 75.8577, 
      dateJoined: new Date().toISOString() // 💡 CHANGED
    },
    { 
      id: 'site-17', 
      name: 'Vizag Port Site', 
      ownerName: 'Manish Bhat',
      address: 'Visakhapatnam, AP',
      latitude: 17.6868, 
      longitude: 83.2185, 
      dateJoined: new Date().toISOString() // 💡 CHANGED
    },
    { 
      id: 'site-18', 
      name: 'Guwahati East Hub', 
      ownerName: 'Sameer Khan',
      address: 'Guwahati, AS',
      latitude: 26.1445, 
      longitude: 91.7362, 
      dateJoined: new Date().toISOString() // 💡 CHANGED
    },
];

// --- MOCK API FETCH FUNCTION ---
export const getSites = async (): Promise<Site[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...mockSiteData]; // Return a copy
};

// --- MODIFIED: addSite function uses dateJoined ---
export const addSite = async (newSite: NewSiteData): Promise<Site> => {
    await new Promise(resolve => setTimeout(resolve, 400));

    if (!newSite.name || !newSite.ownerName || !newSite.address) {
        throw new Error("Site name, owner name, and address are required.");
    }
    
    // Check for duplicate name
    if (mockSiteData.some(s => s.name === newSite.name)) {
       throw new Error(`Site with name ${newSite.name} already exists.`);
    }

    const createdSite: Site = {
        id: `site-${Date.now()}`,
        ...newSite, 
        latitude: newSite.latitude || 27.7172,
        longitude: newSite.longitude || 85.324,
    };

    mockSiteData.unshift(createdSite);
    console.log("Added site:", createdSite);
    return createdSite;
};