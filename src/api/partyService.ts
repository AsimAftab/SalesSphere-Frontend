// --- TYPE DEFINITION ---
export interface Party {
  name: string;
  designation: string;
  email: string;
  imageUrl: string;
}

// --- MOCK DATA ---
const mockPartyData: Party[] = [
    { name: 'Michael Taylor', designation: 'Designer', email: 'michael.taylor@example.com', imageUrl: 'https://i.pravatar.cc/150?u=michael' },
    { name: 'Barbara Anderson', designation: 'Manager', email: 'barbara.anderson@example.com', imageUrl: 'https://i.pravatar.cc/150?u=barbara' },
    { name: 'William Thomas', designation: 'Developer', email: 'william.thomas@example.com', imageUrl: 'https://i.pravatar.cc/150?u=william' },
    { name: 'Elizabeth Jackson', designation: 'Designer', email: 'elizabeth.jackson@example.com', imageUrl: 'https://i.pravatar.cc/150?u=elizabeth' },
    { name: 'Richard White', designation: 'Manager', email: 'richard.white@example.com', imageUrl: 'https://i.pravatar.cc/150?u=richard' },
    { name: 'Jennifer Harris', designation: 'Developer', email: 'jennifer.harris@example.com', imageUrl: 'https://i.pravatar.cc/150?u=jennifer' },
    { name: 'Charles Martin', designation: 'Designer', email: 'charles.martin@example.com', imageUrl: 'https://i.pravatar.cc/150?u=charles' },
    { name: 'Sarah Thompson', designation: 'Manager', email: 'sarah.thompson@example.com', imageUrl: 'https://i.pravatar.cc/150?u=sarah' },
    { name: 'Joseph Garcia', designation: 'Developer', email: 'joseph.garcia@example.com', imageUrl: 'https://i.pravatar.cc/150?u=joseph' },
    { name: 'Karen Martinez', designation: 'Designer', email: 'karen.martinez@example.com', imageUrl: 'https://i.pravatar.cc/150?u=karen' },
    { name: 'Thomas Robinson', designation: 'Manager', email: 'thomas.robinson@example.com', imageUrl: 'https://i.pravatar.cc/150?u=thomas' },
    { name: 'Nancy Clark', designation: 'Developer', email: 'nancy.clark@example.com', imageUrl: 'https://i.pravatar.cc/150?u=nancy' },
    { name: 'Daniel Rodriguez', designation: 'Designer', email: 'daniel.rodriguez@example.com', imageUrl: 'https://i.pravatar.cc/150?u=daniel' },
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
];

// --- MOCK API FETCH FUNCTION ---
export const getParties = async (): Promise<Party[]> => {
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // To test the error state, you can uncomment this line:
  // if (Math.random() > 0.8) throw new Error("Failed to fetch parties from the server.");

  return mockPartyData;
};
