// src/api/prospectService.ts

// --- MODIFIED: Prospect interface no longer has 'imageUrl' and 'dateCreated' ---
export interface Prospect {
    id: string; // Added ID for a stable key
    name: string; // This will be the "Prospect Name" (e.g., "Future Electronics")
    ownerName: string;
    dateJoined: string; // Using dateJoined consistently
    address: string; 
    description: string; // Required field
    latitude?: number;
    longitude?: number;
    email?: string;
    phone?: string;
    panVat?:string;
}

// --- MODIFIED: NewProspectData no longer has 'imageUrl' ---
export interface NewProspectData {
    name: string;
    ownerName: string;
    dateJoined: string; // Using dateJoined consistently
    address: string;
    description: string; // Required field
    latitude?: number;
    longitude?: number;
    email?: string;
    phone?: string;
    panVat?:string;
}
// ---

// Mock data (mutable let instead of const)
export let prospectData: Prospect[] = [
    { 
      id: 'prospect-1', 
      name: 'Future Electronics', 
      ownerName: 'Susan Brown', 
      dateJoined: '2025-01-15', // Using dateJoined
      address: '123 Tech Park, Bengaluru, KA',
      description: 'Large-scale distributor of components, high potential for long-term contract.',
      latitude: 12.9716, 
      longitude: 77.5946, 
      email: 'susan.b@future-electronics.com', 
      phone: '9876543210', 
      panVat:'1234567891'
    },
    { 
      id: 'prospect-2', 
      name: 'Apex Solutions', 
      ownerName: 'Robert Davis', 
      dateJoined: '2025-02-20', // Using dateJoined
      address: '456 Innovation Plaza, Mumbai, MH',
      description: 'Software development firm looking for IT infrastructure upgrades.',
      latitude: 19.0760, 
      longitude: 72.8777, 
      email: 'robert.d@apex.com', 
      phone: '9876543211', 
    },
    { 
      id: 'prospect-3', 
      name: 'Sunrise Retail', 
      ownerName: 'Linda Miller', 
      dateJoined: '2025-03-10', // Using dateJoined
      address: '789 Market St, Delhi, DL',
      description: 'Regional supermarket chain exploring warehouse automation solutions.',
      latitude: 28.6139, 
      longitude: 77.2090, 
      email: 'linda.m@sunrise.com', 
      phone: '9876543212', 
    },
    // --- 15 NEW MOCK DATA ENTRIES (Updated with description, no imageUrl, no dateCreated) ---
    { 
      id: 'prospect-4', 
      name: 'GreenLeaf Organics', 
      ownerName: 'David Lee', 
      dateJoined: '2025-04-01', // Using dateJoined
      address: '101 Farm Lane, Pune, MH',
      description: 'Organic food supplier requiring cold chain and transportation tracking.',
      latitude: 18.5204, 
      longitude: 73.8567, 
      email: 'david.l@greenleaf.com', 
      phone: '9876543213', 
    },
    { 
      id: 'prospect-5', 
      name: 'Quantum Innovations', 
      ownerName: 'Maria Garcia', 
      dateJoined: '2025-04-05', // Using dateJoined
      address: '202 Tech Hub, Hyderabad, TS',
      description: 'High-tech startup needing secure data storage and backup services.',
      latitude: 17.3850, 
      longitude: 78.4867, 
      email: 'maria.g@quantum.com', 
      phone: '9876543214', 
    },
    { 
      id: 'prospect-6', 
      name: 'Oceanic Goods', 
      ownerName: 'Thomas Wilson', 
      dateJoined: '2025-04-10', // Using dateJoined
      address: '303 Portside, Chennai, TN',
      description: 'Importer/Exporter needing customs documentation automation.',
      latitude: 13.0827, 
      longitude: 80.2707, 
      email: 'thomas.w@oceanic.com', 
      phone: '9876543215', 
    },
    { 
      id: 'prospect-7', 
      name: 'Stellar Hardware', 
      ownerName: 'Sarah Chen', 
      dateJoined: '2025-04-15', // Using dateJoined
      address: '404 Industrial, Ahmedabad, GJ',
      description: 'Manufacturing unit looking to implement IoT tracking on assembly lines.',
      latitude: 23.0225, 
      longitude: 72.5714, 
      email: 'sarah.c@stellar.com', 
      phone: '9876543216', 
    },
    { 
      id: 'prospect-8', 
      name: 'Horizon Pharma', 
      ownerName: 'James Rodriguez', 
      dateJoined: '2025-04-20', // Using dateJoined
      address: '505 Health Blvd, Kolkata, WB',
      description: 'Pharmaceutical company focused on compliance and validation services.',
      latitude: 22.5726, 
      longitude: 88.3639, 
      email: 'james.r@horizon.com', 
      phone: '9876543217', 
    },
    { 
      id: 'prospect-9', 
      name: 'Digital Weavers', 
      ownerName: 'Emily White', 
      dateJoined: '2025-04-25', // Using dateJoined
      address: '606 Cyber Park, Gurugram, HR',
      description: 'Digital marketing agency interested in cloud optimization.',
      latitude: 28.4595, 
      longitude: 77.0266, 
      email: 'emily.w@digitalweavers.com', 
      phone: '9876543218', 
    },
    { 
      id: 'prospect-10', 
      name: 'Pinnacle Logistics', 
      ownerName: 'Michael Brown', 
      dateJoined: '2025-05-01', // Using dateJoined
      address: '707 Supply St, Jaipur, RJ',
      description: 'Third-party logistics provider needing better route planning software.',
      latitude: 26.9124, 
      longitude: 75.7873, 
      email: 'michael.b@pinnacle.com', 
      phone: '9876543219', 
    },
    { 
      id: 'prospect-11', 
      name: 'EvoAuto Parts', 
      ownerName: 'Jessica Martinez', 
      dateJoined: '2025-05-05', // Using dateJoined
      address: '808 Auto Hub, Noida, UP',
      description: 'Auto parts manufacturer seeking inventory management solution.',
      latitude: 28.5355, 
      longitude: 77.3910, 
      email: 'jessica.m@evoauto.com', 
      phone: '9876543220', 
    },
    { 
      id: 'prospect-12', 
      name: 'Crafted Decor', 
      ownerName: 'Chris Johnson', 
      dateJoined: '2025-05-10', // Using dateJoined
      address: '909 Design Way, Lucknow, UP',
      description: 'Interior design studio requiring project management tools.',
      latitude: 26.8467, 
      longitude: 80.9462, 
      email: 'chris.j@crafted.com', 
      phone: '9876543221', 
    },
    { 
      id: 'prospect-13', 
      name: 'Nexus Telecom', 
      ownerName: 'Karen Lee', 
      dateJoined: '2025-05-15', // Using dateJoined
      address: '111 Signal Tower, Chandigarh, CH',
      description: 'Telecommunications provider interested in network monitoring tools.',
      latitude: 30.7333, 
      longitude: 76.7794, 
      email: 'karen.l@nexus.com', 
      phone: '9876543222', 
    },
    { 
      id: 'prospect-14', 
      name: 'AgroFresh Produce', 
      ownerName: 'Brian King', 
      dateJoined: '2025-05-20', // Using dateJoined
      address: '222 Growers Lane, Bhopal, MP',
      description: 'Farm-to-table service needing advanced supply chain traceability.',
      latitude: 23.2599, 
      longitude: 77.4126, 
      email: 'brian.k@agrofresh.com', 
      phone: '9876543223', 
    },
    { 
      id: 'prospect-15', 
      name: 'Coastal Exports', 
      ownerName: 'Amanda Wright', 
      dateJoined: '2025-05-25', // Using dateJoined
      address: '333 Seaside, Kochi, KL',
      description: 'Seafood export company needing refrigerated container tracking.',
      latitude: 9.9312, 
      longitude: 76.2673, 
      email: 'amanda.w@coastal.com', 
      phone: '9876543224', 
    },
    { 
      id: 'prospect-16', 
      name: 'Summit Construction', 
      ownerName: 'Paul Harris', 
      dateJoined: '2025-06-01', // Using dateJoined
      address: '444 Builders Ave, Indore, MP',
      description: 'Mid-sized construction firm needing equipment inventory control.',
      latitude: 22.7196, 
      longitude: 75.8577, 
      email: 'paul.h@summit.com', 
      phone: '9876543225', 
    },
    { 
      id: 'prospect-17', 
      name: 'RedRock Mining', 
      ownerName: 'Nancy Clark', 
      dateJoined: '2025-06-05', // Using dateJoined
      address: '555 Mineral Rd, Nagpur, MH',
      description: 'Mining operation looking for heavy machinery telemetry solutions.',
      latitude: 21.1458, 
      longitude: 79.0882, 
      email: 'nancy.c@redrock.com', 
      phone: '9876543226', 
    },
    { 
      id: 'prospect-18', 
      name: 'Alpha Education', 
      ownerName: 'Mark Lewis', 
      dateJoined: '2025-06-10', // Using dateJoined
      address: '666 Campus View, Patna, BR',
      description: 'Educational services provider requiring student attendance system.',
      latitude: 25.5941, 
      longitude: 85.1376, 
      email: 'mark.l@alphaedu.com', 
      phone: '9876543227', 
    },
    // --- END OF NEW DATA ---
];
// --- END MODIFICATION ---

// Simulates fetching data from an API.
export const getProspects = async (): Promise<Prospect[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...prospectData]; // Return a copy
};

// --- MODIFIED: Function to add a prospect, now handles the required 'description' field, no imageUrl ---
export const addProspect = async (newProspect: NewProspectData): Promise<Prospect> => {
    await new Promise(resolve => setTimeout(resolve, 400));

    // Validation
    if (!newProspect.name || !newProspect.ownerName || !newProspect.address || !newProspect.dateJoined || !newProspect.description) {
        throw new Error("Prospect name, owner name, date joined, address, and description are required.");
    }
    
    // Check for duplicate email if provided
    if (newProspect.email && prospectData.some((p: Prospect) => p.email === newProspect.email)) {
       throw new Error(`Prospect with email ${newProspect.email} already exists.`);
    }

    // Create the full prospect object
    const createdProspect: Prospect = {
        id: `prospect-${Date.now()}`, // Simple unique ID
        name: newProspect.name,
        ownerName: newProspect.ownerName,
        dateJoined: newProspect.dateJoined, // Using dateJoined
        address: newProspect.address,
        description: newProspect.description, 
        latitude: newProspect.latitude || 27.7172, // Default coords if none
        longitude: newProspect.longitude || 85.324,
        email: newProspect.email || '',
        phone: newProspect.phone || '',
        panVat:newProspect.panVat || '',
    };

    prospectData.unshift(createdProspect);
    console.log("Added prospect:", createdProspect);
    return createdProspect;
};
// ---
