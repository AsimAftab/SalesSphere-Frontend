// // src/api/beatPlanService.ts

// // --- INTERFACE DEFINITIONS ---

// // For the four summary cards at the top
// export interface BeatPlanStats {
//   totalPlans: number;
//   activeRoutes: number;
//   assignedEmployees: number;
//   totalShops: number; // Represents the sum of shops across *all* plans
// }

// // Type for Shop data used across components
// export interface Shop {
//   id: number;
//   name: string;
//   address: string;
//   zone: string;
// }

// // For a single row in the "All Beat Plans" table
// export interface BeatPlan {
//   id: string; // Keep ID as string
//   serial: string;
//   employeeName: string;
//   employeeRole: string;
//   employeeImageUrl: string;
//   planName: string;
//   dateAssigned: string; // Keep as formatted string for display
//   shopsCount: number; // Total count for display in the main table
//   status: 'active' | 'pending';
//   employeeId?: number; // Store the original ID for pre-selecting in edit form
//   shopIds?: number[]; // Store the IDs of assigned shops
// }

// // Main interface for all data on the page
// export interface FullBeatPlanData {
//   stats: BeatPlanStats;
//   beatPlans: BeatPlan[];
// }

// // --- Interface for the "create" function payload ---
// export interface NewBeatPlanPayload {
//   employeeId: string; // ID from the dropdown
//   planName: string;
//   date: Date | null;
//   shopIds: number[]; // Array of assigned shop IDs
// }

// // --- Interface for the "update" function payload ---
// export interface UpdateBeatPlanPayload {
//   employeeId: string; // ID from the dropdown
//   planName: string;
//   date: Date | null;
//   shopIds: number[]; // Array of assigned shop IDs
//   // Add status if you allow editing it
//   // status?: 'active' | 'pending';
// }


// // --- MOCK DATA GENERATION (Now our "Database") ---

// const employeesData = [
//     { id: 1, name: 'Jason Price', designation: 'Admin', email: 'janick_parisian@yahoo.com', imageUrl: 'https://i.pravatar.cc/150?u=jason' },
//     { id: 2, name: 'Jukkoe Sisao', designation: 'CEO', email: 'sibyl_koey@hotmail.com', imageUrl: 'https://i.pravatar.cc/150?u=jukkoe' },
//     { id: 3, name: 'Harriet King', designation: 'CTO', email: 'nadia_block@hotmail.com', imageUrl: 'https://i.pravatar.cc/150?u=harrietk' },
//     { id: 4, name: 'Lenora Benson', designation: 'Lead', email: 'feil.wallace@kunde.us', imageUrl: 'https://i.pravatar.cc/150?u=lenora' },
//     { id: 5, name: 'Olivia Reese', designation: 'Strategist', email: 'kemmer.hattie@cremin.us', imageUrl: 'https://i.pravatar.cc/150?u=olivia' },
//     { id: 6, name: 'Bertha Valdez', designation: 'Digital Marketer', email: 'loraine.koelpin@tromp.io', imageUrl: 'https://i.pravatar.cc/150?u=bertha' },
//     { id: 7, name: 'Harriett Payne', designation: 'CEO', email: 'nunnie_west@estrella.tv', imageUrl: 'https://i.pravatar.cc/150?u=harriettp' },
//     { id: 8, name: 'George Bryant', designation: 'Social Media', email: 'delmer.kling@gmail.com', imageUrl: 'https://i.pravatar.cc/150?u=george' },
//     { id: 9, name: 'Lily French', designation: 'Strategist', email: 'lucienne.herman@hotmail.com', imageUrl: 'https://i.pravatar.cc/150?u=lily' },
//     { id: 10, name: 'Howard Adkins', designation: 'CEO', email: 'wiegand.leonor@herman.us', imageUrl: 'https://i.pravatar.cc/150?u=howard' },
//     { id: 11, name: 'Earl Bowman', designation: 'Digital Marketer', email: 'waino_ankeny@nicolette.tv', imageUrl: 'https://i.pravatar.cc/150?u=earl' },
//     { id: 12, name: 'Patrick Padilla', designation: 'Social Media', email: 'octavia.nienow@gleichner.net', imageUrl: 'https://i.pravatar.cc/150?u=patrick' },
//     { id: 13, name: 'John Doe', designation: 'Developer', email: 'john.doe@example.com', imageUrl: 'https://i.pravatar.cc/150?u=john' },
//     { id: 14, name: 'Jane Smith', designation: 'Designer', email: 'jane.smith@example.com', imageUrl: 'https://i.pravatar.cc/150?u=jane' },
// ];

// // --- Mock Shop Data (Exported for use in components) ---
// export const mockAllShops: Shop[] = [
//     { id: 1, name: 'Metro Mart Downtown', address: '123 Main Street', zone: 'North Zone' },
//     { id: 2, name: 'Fresh Foods Central', address: '456 Oak Avenue', zone: 'North Zone' },
//     { id: 3, name: 'QuickStop Express', address: '789 Park Lane', zone: 'North Zone' },
//     { id: 4, name: 'City Grocery Hub', address: '321 Commerce Blvd', zone: 'East Zone' },
//     { id: 5, name: 'Sunrise Corner Store', address: '555 Sunrise Ave', zone: 'West Zone' },
//     { id: 6, name: 'West End Grocers', address: '987 West End Rd', zone: 'West Zone' },
//     { id: 7, name: 'Eastside Market', address: '654 Eastside Dr', zone: 'East Zone' },
// ];


// // This function creates the initial mock data for the table
// const generateMockBeatPlans = (): BeatPlan[] => {
//   const planTypes = ['Urban Blitz', 'Suburban Sweep', 'Metro Connect', 'Downtown Drive', 'Westside Route'];

//   return employeesData.map((employee, index) => {
//     const date = new Date();
//     date.setDate(date.getDate() - (index * 2 + 1));
//     const dateAssigned = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

//     // Assign some mock shop IDs
//     let assignedShopIds: number[] = [];
//     if (index % 4 === 0) assignedShopIds = [1, 3];
//     else if (index % 4 === 1) assignedShopIds = [2, 4, 5];
//     else if (index % 4 === 2) assignedShopIds = [6];
//     else assignedShopIds = [1, 5, 7];

//     return {
//       // *** USE STABLE ID ***
//       id: `mock-plan-${employee.id}`, // Use a predictable string based on employee ID
//       // *** END CHANGE ***
//       serial: `BP${(index + 1).toString().padStart(3, '0')}`,
//       employeeName: employee.name,
//       employeeRole: employee.designation,
//       employeeImageUrl: employee.imageUrl,
//       planName: `${planTypes[index % planTypes.length]} #${index + 1}`,
//       dateAssigned: dateAssigned,
//       shopsCount: assignedShopIds.length,
//       status: index % 3 === 0 ? 'pending' : 'active',
//       employeeId: employee.id,
//       shopIds: assignedShopIds
//     };
//   });
// };

// // --- This is now our persistent mock database ---
// // Ensure this runs only once ideally (though assignment here works for module scope)
// let mockBeatPlanDB: BeatPlan[] = generateMockBeatPlans();


// // --- MOCK API FETCH FUNCTIONS ---

// /**
//  * Fetches all beat plan data.
//  */
// export const getBeatPlanData = async (): Promise<FullBeatPlanData> => {
//   await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay

//   const mockData: FullBeatPlanData = {
//     stats: {
//       totalPlans: mockBeatPlanDB.length,
//       activeRoutes: mockBeatPlanDB.filter(plan => plan.status === 'active').length,
//       assignedEmployees: new Set(mockBeatPlanDB.map(p => p.employeeName)).size,
//       totalShops: mockBeatPlanDB.reduce((sum, plan) => sum + (plan.shopIds?.length ?? 0), 0),
//     },
//     // Return a copy
//     beatPlans: [...mockBeatPlanDB],
//   };
//   return mockData;
// };

// /**
//  * Fetches the list of employees for the dropdown.
//  */
// export const getBeatPlanEmployees = async (): Promise<{ id: number; name: string }[]> => {
//   await new Promise(resolve => setTimeout(resolve, 200));
//   return employeesData.map(e => ({ id: e.id, name: e.name }));
// }

// /**
//  * Creates a new beat plan and adds it to our mock DB.
//  */
// export const createBeatPlan = async (payload: NewBeatPlanPayload): Promise<BeatPlan> => {
//   await new Promise(resolve => setTimeout(resolve, 400));

//   const employee = employeesData.find(e => e.id === parseInt(payload.employeeId));
//   if (!employee) {
//     throw new Error("Invalid employee ID");
//   }

//   const dateAssigned = (payload.date || new Date()).toLocaleDateString('en-US', {
//     month: 'short', day: 'numeric', year: 'numeric'
//   });

//   // New plans still get a UUID to differentiate them from initially loaded stable IDs
//   const newPlan: BeatPlan = {
//     id: crypto.randomUUID(),
//     serial: `BP${(mockBeatPlanDB.length + 1).toString().padStart(3, '0')}`,
//     employeeName: employee.name,
//     employeeRole: employee.designation,
//     employeeImageUrl: employee.imageUrl,
//     planName: payload.planName || 'Unnamed Plan',
//     dateAssigned: dateAssigned,
//     shopsCount: payload.shopIds.length,
//     status: 'pending',
//     employeeId: employee.id,
//     shopIds: payload.shopIds
//   };

//   mockBeatPlanDB.unshift(newPlan);
//   return { ...newPlan };
// };

// /**
//  * Fetches details for one specific beat plan by ID.
//  */
// export const getBeatPlanDetails = async (planId: string): Promise<BeatPlan | undefined> => {
//   console.log('Fetching details for mock plan ID:', planId);
//   await new Promise(resolve => setTimeout(resolve, 300));

//   const plan = mockBeatPlanDB.find(p => p.id === planId); // Finds by string ID (stable or UUID)
//   if (!plan) {
//     console.error(`Beat plan with ID ${planId} not found.`);
//     return undefined;
//   }
//   console.log('Found plan details (including shopIds):', plan);
//   return { ...plan };
// };


// /**
//  * Fetches the list of shops associated with a specific beat plan ID.
//  */
// export const getAssignedShopsForPlan = async (planId: string): Promise<Shop[]> => {
//     console.log('Fetching assigned shops for plan ID:', planId);
//     await new Promise(resolve => setTimeout(resolve, 250));

//     const plan = mockBeatPlanDB.find(p => p.id === planId);
//     if (!plan || !plan.shopIds) {
//         console.warn(`Plan ${planId} not found or has no shop IDs.`);
//         return [];
//     }

//     const assignedShops = mockAllShops.filter(shop => plan.shopIds!.includes(shop.id));
//     console.log(`Found ${assignedShops.length} assigned shops for plan ${planId}`);
//     return assignedShops;
// };


// /**
//  * Updates an existing beat plan in the mock DB.
//  */
// export const updateBeatPlan = async (planId: string, payload: UpdateBeatPlanPayload): Promise<BeatPlan> => {
//   console.log('Updating mock plan ID:', planId, 'with payload:', payload);
//   await new Promise(resolve => setTimeout(resolve, 400));

//   const planIndex = mockBeatPlanDB.findIndex(p => p.id === planId); // Finds by string ID
//   if (planIndex === -1) {
//     throw new Error(`Beat plan with ID ${planId} not found for update.`);
//   }

//   const employee = employeesData.find(e => e.id === parseInt(payload.employeeId));
//   if (!employee) {
//     throw new Error("Invalid employee ID during update");
//   }

//   const dateAssigned = (payload.date || new Date()).toLocaleDateString('en-US', {
//     month: 'short', day: 'numeric', year: 'numeric'
//   });

//   const updatedPlan: BeatPlan = {
//     ...mockBeatPlanDB[planIndex], // Keep existing ID, serial, status etc.
//     employeeName: employee.name,
//     employeeRole: employee.designation,
//     employeeImageUrl: employee.imageUrl,
//     planName: payload.planName,
//     dateAssigned: dateAssigned,
//     shopsCount: payload.shopIds.length,
//     employeeId: employee.id,
//     shopIds: payload.shopIds
//     // status: payload.status || mockBeatPlanDB[planIndex].status, // Update status if needed
//   };

//   mockBeatPlanDB[planIndex] = updatedPlan;
//   console.log('Updated plan in DB:', updatedPlan);

//   return { ...updatedPlan };
// };


// /**
//  * Deletes a beat plan from the mock DB.
//  */
// export const deleteBeatPlan = async (planId: string): Promise<void> => {
//   console.log('Deleting mock plan ID:', planId);
//   await new Promise(resolve => setTimeout(resolve, 300));

//   const initialLength = mockBeatPlanDB.length;
//   mockBeatPlanDB = mockBeatPlanDB.filter(p => p.id !== planId); // Finds by string ID

//   if (mockBeatPlanDB.length === initialLength) {
//     console.warn(`Beat plan with ID ${planId} not found for deletion.`);
//   } else {
//     console.log(`Successfully deleted plan ${planId}.`);
//   }
// };



// src/api/beatPlanService.ts

// --- INTERFACE DEFINITIONS ---

// For the four summary cards at the top
export interface BeatPlanStats {
  totalPlans: number;
  activeRoutes: number;
  assignedEmployees: number;
  totalShops: number; // Represents the sum of shops across *all* plans
}

// Type for Shop data used across components
export interface Shop {
  id: number;
  name: string;
  address: string;
  zone: string;
}

// For a single row in the "All Beat Plans" table
export interface BeatPlan {
  id: string; // Keep ID as string
  serial: string;
  employeeName: string;
  employeeRole: string;
  employeeImageUrl: string;
  planName: string;
  dateAssigned: string; // Keep as formatted string (YYYY-MM-DD) for display
  shopsCount: number; // Total count for display in the main table
  status: 'active' | 'pending';
  employeeId?: number; // Store the original ID for pre-selecting in edit form
  shopIds?: number[]; // Store the IDs of assigned shops
}

// Main interface for all data on the page
export interface FullBeatPlanData {
  stats: BeatPlanStats;
  beatPlans: BeatPlan[];
}

// --- Interface for the "create" function payload ---
export interface NewBeatPlanPayload {
  employeeId: string; // ID from the dropdown
  planName: string;
  date: Date | null;
  shopIds: number[]; // Array of assigned shop IDs
}

// --- Interface for the "update" function payload ---
export interface UpdateBeatPlanPayload {
  employeeId: string; // ID from the dropdown
  planName: string;
  date: Date | null;
  shopIds: number[]; // Array of assigned shop IDs
  // Add status if you allow editing it
  // status?: 'active' | 'pending';
}


// --- MOCK DATA GENERATION (Now our "Database") ---

const employeesData = [
    { id: 1, name: 'Jason Price', designation: 'Admin', email: 'janick_parisian@yahoo.com', imageUrl: 'https://i.pravatar.cc/150?u=jason' },
    { id: 2, name: 'Jukkoe Sisao', designation: 'CEO', email: 'sibyl_koey@hotmail.com', imageUrl: 'https://i.pravatar.cc/150?u=jukkoe' },
    { id: 3, name: 'Harriet King', designation: 'CTO', email: 'nadia_block@hotmail.com', imageUrl: 'https://i.pravatar.cc/150?u=harrietk' },
    { id: 4, name: 'Lenora Benson', designation: 'Lead', email: 'feil.wallace@kunde.us', imageUrl: 'https://i.pravatar.cc/150?u=lenora' },
    { id: 5, name: 'Olivia Reese', designation: 'Strategist', email: 'kemmer.hattie@cremin.us', imageUrl: 'https://i.pravatar.cc/150?u=olivia' },
    { id: 6, name: 'Bertha Valdez', designation: 'Digital Marketer', email: 'loraine.koelpin@tromp.io', imageUrl: 'https://i.pravatar.cc/150?u=bertha' },
    { id: 7, name: 'Harriett Payne', designation: 'CEO', email: 'nunnie_west@estrella.tv', imageUrl: 'https://i.pravatar.cc/150?u=harriettp' },
    { id: 8, name: 'George Bryant', designation: 'Social Media', email: 'delmer.kling@gmail.com', imageUrl: 'https://i.pravatar.cc/150?u=george' },
    { id: 9, name: 'Lily French', designation: 'Strategist', email: 'lucienne.herman@hotmail.com', imageUrl: 'https://i.pravatar.cc/150?u=lily' },
    { id: 10, name: 'Howard Adkins', designation: 'CEO', email: 'wiegand.leonor@herman.us', imageUrl: 'https://i.pravatar.cc/150?u=howard' },
    { id: 11, name: 'Earl Bowman', designation: 'Digital Marketer', email: 'waino_ankeny@nicolette.tv', imageUrl: 'https://i.pravatar.cc/150?u=earl' },
    { id: 12, name: 'Patrick Padilla', designation: 'Social Media', email: 'octavia.nienow@gleichner.net', imageUrl: 'https://i.pravatar.cc/150?u=patrick' },
    { id: 13, name: 'John Doe', designation: 'Developer', email: 'john.doe@example.com', imageUrl: 'https://i.pravatar.cc/150?u=john' },
    { id: 14, name: 'Jane Smith', designation: 'Designer', email: 'jane.smith@example.com', imageUrl: 'https://i.pravatar.cc/150?u=jane' },
];

// --- Mock Shop Data (Exported for use in components) ---
export const mockAllShops: Shop[] = [
    { id: 1, name: 'Metro Mart Downtown', address: '123 Main Street', zone: 'North Zone' },
    { id: 2, name: 'Fresh Foods Central', address: '456 Oak Avenue', zone: 'North Zone' },
    { id: 3, name: 'QuickStop Express', address: '789 Park Lane', zone: 'North Zone' },
    { id: 4, name: 'City Grocery Hub', address: '321 Commerce Blvd', zone: 'East Zone' },
    { id: 5, name: 'Sunrise Corner Store', address: '555 Sunrise Ave', zone: 'West Zone' },
    { id: 6, name: 'West End Grocers', address: '987 West End Rd', zone: 'West Zone' },
    { id: 7, name: 'Eastside Market', address: '654 Eastside Dr', zone: 'East Zone' },
];


// This function creates the initial mock data for the table
const generateMockBeatPlans = (): BeatPlan[] => {
  const planTypes = ['Urban Blitz', 'Suburban Sweep', 'Metro Connect', 'Downtown Drive', 'Westside Route'];

  return employeesData.map((employee, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (index * 2 + 1));
    // *** Use en-CA for YYYY-MM-DD format ***
    const dateAssigned = date.toLocaleDateString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    // *** END CHANGE ***

    let assignedShopIds: number[] = [];
    if (index % 4 === 0) assignedShopIds = [1, 3];
    else if (index % 4 === 1) assignedShopIds = [2, 4, 5];
    else if (index % 4 === 2) assignedShopIds = [6];
    else assignedShopIds = [1, 5, 7];

    return {
      id: `mock-plan-${employee.id}`, // Use stable ID
      serial: `BP${(index + 1).toString().padStart(3, '0')}`,
      employeeName: employee.name,
      employeeRole: employee.designation,
      employeeImageUrl: employee.imageUrl,
      planName: `${planTypes[index % planTypes.length]} #${index + 1}`,
      dateAssigned: dateAssigned, // <-- Now YYYY-MM-DD
      shopsCount: assignedShopIds.length,
      status: index % 3 === 0 ? 'pending' : 'active',
      employeeId: employee.id,
      shopIds: assignedShopIds
    };
  });
};

// --- This is now our persistent mock database ---
let mockBeatPlanDB: BeatPlan[] = generateMockBeatPlans();


// --- MOCK API FETCH FUNCTIONS ---

/**
 * Fetches all beat plan data.
 */
export const getBeatPlanData = async (): Promise<FullBeatPlanData> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const mockData: FullBeatPlanData = {
    stats: {
      totalPlans: mockBeatPlanDB.length,
      activeRoutes: mockBeatPlanDB.filter(plan => plan.status === 'active').length,
      assignedEmployees: new Set(mockBeatPlanDB.map(p => p.employeeName)).size,
      totalShops: mockBeatPlanDB.reduce((sum, plan) => sum + (plan.shopIds?.length ?? 0), 0),
    },
    beatPlans: [...mockBeatPlanDB], // Return a copy
  };
  return mockData;
};

/**
 * Fetches the list of employees for the dropdown.
 */
export const getBeatPlanEmployees = async (): Promise<{ id: number; name: string }[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return employeesData.map(e => ({ id: e.id, name: e.name }));
}

/**
 * Creates a new beat plan and adds it to our mock DB.
 */
export const createBeatPlan = async (payload: NewBeatPlanPayload): Promise<BeatPlan> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  const employee = employeesData.find(e => e.id === parseInt(payload.employeeId));
  if (!employee) { throw new Error("Invalid employee ID"); }

  // *** Use en-CA for YYYY-MM-DD format ***
  const dateAssigned = (payload.date || new Date()).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  // *** END CHANGE ***

  const newPlan: BeatPlan = {
    id: crypto.randomUUID(), // New plans get UUID
    serial: `BP${(mockBeatPlanDB.length + 1).toString().padStart(3, '0')}`,
    employeeName: employee.name,
    employeeRole: employee.designation,
    employeeImageUrl: employee.imageUrl,
    planName: payload.planName || 'Unnamed Plan',
    dateAssigned: dateAssigned, // <-- Now YYYY-MM-DD
    shopsCount: payload.shopIds.length,
    status: 'pending',
    employeeId: employee.id,
    shopIds: payload.shopIds
  };

  mockBeatPlanDB.unshift(newPlan);
  return { ...newPlan };
};

/**
 * Fetches details for one specific beat plan by ID.
 */
export const getBeatPlanDetails = async (planId: string): Promise<BeatPlan | undefined> => {
  console.log('Fetching details for mock plan ID:', planId);
  await new Promise(resolve => setTimeout(resolve, 300));

  const plan = mockBeatPlanDB.find(p => p.id === planId);
  if (!plan) {
    console.error(`Beat plan with ID ${planId} not found.`);
    return undefined;
  }
  console.log('Found plan details (including shopIds):', plan);
  return { ...plan };
};


/**
 * Fetches the list of shops associated with a specific beat plan ID.
 */
export const getAssignedShopsForPlan = async (planId: string): Promise<Shop[]> => {
    console.log('Fetching assigned shops for plan ID:', planId);
    await new Promise(resolve => setTimeout(resolve, 250));

    const plan = mockBeatPlanDB.find(p => p.id === planId);
    if (!plan || !plan.shopIds) {
        console.warn(`Plan ${planId} not found or has no shop IDs.`);
        return [];
    }

    const assignedShops = mockAllShops.filter(shop => plan.shopIds!.includes(shop.id));
    console.log(`Found ${assignedShops.length} assigned shops for plan ${planId}`);
    return assignedShops;
};


/**
 * Updates an existing beat plan in the mock DB.
 */
export const updateBeatPlan = async (planId: string, payload: UpdateBeatPlanPayload): Promise<BeatPlan> => {
  console.log('Updating mock plan ID:', planId, 'with payload:', payload);
  await new Promise(resolve => setTimeout(resolve, 400));

  const planIndex = mockBeatPlanDB.findIndex(p => p.id === planId);
  if (planIndex === -1) { throw new Error(`Beat plan ID ${planId} not found.`); }

  const employee = employeesData.find(e => e.id === parseInt(payload.employeeId));
  if (!employee) { throw new Error("Invalid employee ID during update"); }

  // *** Use en-CA for YYYY-MM-DD format ***
  const dateAssigned = (payload.date || new Date()).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  // *** END CHANGE ***

  const updatedPlan: BeatPlan = {
    ...mockBeatPlanDB[planIndex],
    employeeName: employee.name,
    employeeRole: employee.designation,
    employeeImageUrl: employee.imageUrl,
    planName: payload.planName,
    dateAssigned: dateAssigned, // <-- Now YYYY-MM-DD
    shopsCount: payload.shopIds.length,
    employeeId: employee.id,
    shopIds: payload.shopIds
    // status: payload.status || mockBeatPlanDB[planIndex].status,
  };

  mockBeatPlanDB[planIndex] = updatedPlan;
  console.log('Updated plan in DB:', updatedPlan);
  return { ...updatedPlan };
};


/**
 * Deletes a beat plan from the mock DB.
 */
export const deleteBeatPlan = async (planId: string): Promise<void> => {
  console.log('Deleting mock plan ID:', planId);
  await new Promise(resolve => setTimeout(resolve, 300));

  const initialLength = mockBeatPlanDB.length;
  mockBeatPlanDB = mockBeatPlanDB.filter(p => p.id !== planId);

  if (mockBeatPlanDB.length === initialLength) {
    console.warn(`Beat plan with ID ${planId} not found for deletion.`);
  } else {
    console.log(`Successfully deleted plan ${planId}.`);
  }
};