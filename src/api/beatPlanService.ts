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


// --- MOCK DATA GENERATION ---

const employeesData = [
  { name: 'Jason Price', designation: 'Admin', email: 'janick_parisian@yahoo.com', imageUrl: 'https://i.pravatar.cc/150?u=jason' },
  { name: 'Jukkoe Sisao', designation: 'CEO', email: 'sibyl_koey@hotmail.com', imageUrl: 'https://i.pravatar.cc/150?u=jukkoe' },
  { name: 'Harriet King', designation: 'CTO', email: 'nadia_block@hotmail.com', imageUrl: 'https://i.pravatar.cc/150?u=harrietk' },
  { name: 'Lenora Benson', designation: 'Lead', email: 'feil.wallace@kunde.us', imageUrl: 'https://i.pravatar.cc/150?u=lenora' },
  { name: 'Olivia Reese', designation: 'Strategist', email: 'kemmer.hattie@cremin.us', imageUrl: 'https://i.pravatar.cc/150?u=olivia' },
  { name: 'Bertha Valdez', designation: 'Digital Marketer', email: 'loraine.koelpin@tromp.io', imageUrl: 'https://i.pravatar.cc/150?u=bertha' },
  { name: 'Harriett Payne', designation: 'CEO', email: 'nunnie_west@estrella.tv', imageUrl: 'https://i.pravatar.cc/150?u=harriettp' },
  { name: 'George Bryant', designation: 'Social Media', email: 'delmer.kling@gmail.com', imageUrl: 'https://i.pravatar.cc/150?u=george' },
  { name: 'Lily French', designation: 'Strategist', email: 'lucienne.herman@hotmail.com', imageUrl: 'https://i.pravatar.cc/150?u=lily' },
  { name: 'Howard Adkins', designation: 'CEO', email: 'wiegand.leonor@herman.us', imageUrl: 'https://i.pravatar.cc/150?u=howard' },
  { name: 'Earl Bowman', designation: 'Digital Marketer', email: 'waino_ankeny@nicolette.tv', imageUrl: 'https://i.pravatar.cc/150?u=earl' },
  { name: 'Patrick Padilla', designation: 'Social Media', email: 'octavia.nienow@gleichner.net', imageUrl: 'https://i.pravatar.cc/150?u=patrick' },
  { name: 'John Doe', designation: 'Developer', email: 'john.doe@example.com', imageUrl: 'https://i.pravatar.cc/150?u=john' },
  { name: 'Jane Smith', designation: 'Designer', email: 'jane.smith@example.com', imageUrl: 'https://i.pravatar.cc/150?u=jane' },
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


// --- MOCK API FETCH FUNCTION ---

export const getBeatPlanData = async (): Promise<FullBeatPlanData> => {
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const beatPlans = generateMockBeatPlans();

  const mockData: FullBeatPlanData = {
    stats: {
      totalPlans: beatPlans.length,
      activeRoutes: beatPlans.filter(plan => plan.status === 'active').length,
      assignedEmployees: beatPlans.length,
      totalShops: beatPlans.reduce((sum, plan) => sum + plan.shopsCount, 0),
    },
    beatPlans: beatPlans,
  };

  if (Math.random() > 0.95) {
    throw new Error("Failed to fetch Beat Plan data from the server.");
  }

  return mockData;
};