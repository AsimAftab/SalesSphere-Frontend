// --- INTERFACE DEFINITIONS ---

// For the four summary cards at the top
export interface BeatPlanStats {
  totalPlans: number;
  activeRoutes: number;
  assignedEmployees: number;
  totalShops: number;
}

// For a single row in the "All Beat Plans" table
export interface BeatPlan {
  id: string;
  serial: string;
  employeeName: string;
  employeeRole: string;
  employeeImageUrl: string;
  planName: string;
  dateAssigned: string;
  shopsCount: number;
  status: 'active' | 'pending';
}

// Main interface for all data on the page
export interface FullBeatPlanData {
  stats: BeatPlanStats;
  beatPlans: BeatPlan[];
}

// --- NEW: Interface for the "create" function payload ---
export interface NewBeatPlanPayload {
  employeeId: string;
  planName: string;
  date: Date | null;
  shopsCount: number;
}


// --- MOCK DATA GENERATION (Now our "Database") ---

const employeesData = [
  // --- MODIFIED: Added 'id' to be consistent ---
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

// This function creates the mock data for the table
const generateMockBeatPlans = (): BeatPlan[] => {
  const planTypes = ['Urban Blitz', 'Suburban Sweep', 'Metro Connect', 'Downtown Drive', 'Westside Route'];
  
  return employeesData.map((employee, index) => {
    // Generate a random date within the last 30 days
    const date = new Date();
    date.setDate(date.getDate() - (index * 2 + 1));
    const dateAssigned = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return {
      id: crypto.randomUUID(),
      serial: `BP${(index + 1).toString().padStart(3, '0')}`,
      employeeName: employee.name,
      employeeRole: employee.designation,
      employeeImageUrl: employee.imageUrl,
      planName: `${planTypes[index % planTypes.length]} #${index + 1}`,
      dateAssigned: dateAssigned,
      shopsCount: Math.floor(Math.random() * 10) + 2, // Random number of shops between 2 and 11
      status: index % 3 === 0 ? 'pending' : 'active', // Alternate status for variety
    };
  });
};

// --- MODIFIED: This is now our persistent mock database ---
// It's defined *outside* the function so it doesn't reset
let mockBeatPlanDB: BeatPlan[] = generateMockBeatPlans();


// --- MOCK API FETCH FUNCTIONS ---

/**
 * Fetches all beat plan data.
 */
export const getBeatPlanData = async (): Promise<FullBeatPlanData> => {
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // --- MODIFIED: Calculates stats based on the *current* DB ---
  const mockData: FullBeatPlanData = {
    stats: {
      totalPlans: mockBeatPlanDB.length,
      activeRoutes: mockBeatPlanDB.filter(plan => plan.status === 'active').length,
      assignedEmployees: new Set(mockBeatPlanDB.map(p => p.employeeName)).size, // More accurate
      totalShops: mockBeatPlanDB.reduce((sum, plan) => sum + plan.shopsCount, 0),
    },
    beatPlans: mockBeatPlanDB, // Returns the current list
  };

  if (Math.random() > 0.95) {
    throw new Error("Failed to fetch Beat Plan data from the server.");
  }

  return mockData;
};

/**
 * --- NEW: Fetches the list of employees for the dropdown ---
 */
export const getBeatPlanEmployees = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return employeesData.map(e => ({ id: e.id, name: e.name }));
}

/**
 * --- NEW: Creates a new beat plan and adds it to our mock DB ---
 */
export const createBeatPlan = async (payload: NewBeatPlanPayload): Promise<BeatPlan> => {
  // Simulate a network delay for creation
  await new Promise(resolve => setTimeout(resolve, 500));

  // Find the full employee details from the ID
  const employee = employeesData.find(e => e.id === parseInt(payload.employeeId));
  if (!employee) {
    throw new Error("Invalid employee ID");
  }

  const dateAssigned = (payload.date || new Date()).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  // Create the new plan object
  const newPlan: BeatPlan = {
    id: crypto.randomUUID(),
    serial: `BP${(mockBeatPlanDB.length + 1).toString().padStart(3, '0')}`,
    employeeName: employee.name,
    employeeRole: employee.designation,
    employeeImageUrl: employee.imageUrl,
    planName: payload.planName || 'Unnamed Plan',
    dateAssigned: dateAssigned,
    shopsCount: payload.shopsCount,
    status: 'pending', // New plans always start as pending
  };

  // --- MODIFIED: Add the new plan to the top of our "database" ---
  mockBeatPlanDB.unshift(newPlan);

  return newPlan;
};