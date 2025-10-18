// This interface defines the shape of a single prospect object.
// Ensure your API returns data that matches this structure.
export interface Prospect {
  name: string;
  designation: string;
  email: string;
  imageUrl: string;
}

// Mock data, moved from the component file.
const prospectData: Prospect[] = [
    { name: 'Mary Johnson', designation: 'Developer', email: 'mary.johnson@example.com', imageUrl: 'https://i.pravatar.cc/150?u=mary' },
    { name: 'David Williams', designation: 'Designer', email: 'david.williams@example.com', imageUrl: 'https://i.pravatar.cc/150?u=david' },
    { name: 'Susan Brown', designation: 'Manager', email: 'susan.brown@example.com', imageUrl: 'https://i.pravatar.cc/150?u=susan' },
    { name: 'Robert Davis', designation: 'Developer', email: 'robert.davis@example.com', imageUrl: 'https://i.pravatar.cc/150?u=robert' },
    { name: 'Linda Miller', designation: 'Designer', email: 'linda.miller@example.com', imageUrl: 'https://i.pravatar.cc/150?u=linda' },
    { name: 'James Wilson', designation: 'Manager', email: 'james.wilson@example.com', imageUrl: 'https://i.pravatar.cc/150?u=james' },
    { name: 'Patricia Moore', designation: 'Developer', email: 'patricia.moore@example.com', imageUrl: 'https://i.pravatar.cc/150?u=patricia' },
    { name: 'Michael Taylor', designation: 'Designer', email: 'michael.taylor@example.com', imageUrl: 'https://i.pravatar.cc/150?u=michael' },
    { name: 'Barbara Anderson', designation: 'Manager', email: 'barbara.anderson@example.com', imageUrl: 'https://i.pravatar.cc/150?u=barbara' },
    { name: 'William Thomas', designation: 'Developer', email: 'william.thomas@example.com', imageUrl: 'https://i.pravatar.cc/150?u=william' },
    { name: 'Elizabeth Jackson', designation: 'Designer', email: 'elizabeth.jackson@example.com', imageUrl: 'https://i.pravatar.cc/150?u=elizabeth' },
    { name: 'Richard White', designation: 'Manager', email: 'richard.white@example.com', imageUrl: 'https://i.pravatar.cc/150?u=richard' },
    { name: 'Jennifer Harris', designation: 'Developer', email: 'jennifer.harris@example.com', imageUrl: 'https://i.pravatar.cc/150?u=jennifer' },
    { name: 'Charles Martin', designation: 'Designer', email: 'charles.martin@example.com', imageUrl: 'https://i.pravatar.cc/150?u=charles' },
    { name: 'Sarah Thompson', designation: 'Manager', email: 'sarah.thompson@example.com', imageUrl: 'https://i.pravatar.cc/150?u=sarah' },
    { name: 'Joseph Garcia', designation: 'Developer', email: 'joseph.garcia@example.com', imageUrl: 'https://i.pravatar.cc/150?u=joseph' },
    { name: 'Jason Price', designation: 'Admin', email: 'janick_parisian@yahoo.com', imageUrl: 'https://i.pravatar.cc/150?u=jason' },
    { name: 'Jukkoe Sisao', designation: 'CEO', email: 'sibyl_koey@hotmail.com', imageUrl: 'https://i.pravatar.cc/150?u=jukkoe' },
    { name: 'Harriet King', designation: 'CTO', email: 'nadia_block@hotmail.com', imageUrl: 'https://i.pravatar.cc/150?u=harrietk' },
    { name: 'Lenora Benson', designation: 'Lead', email: 'feil.wallace@kunde.us', imageUrl: 'https://i.pravatar.cc/150?u=lenora' },
    { name: 'Olivia Reese', designation: 'Strategist', email: 'kemmer.hattie@cremin.us', imageUrl: 'https://i.pravatar.cc/150?u=olivia' },
    { name: 'Bertha Valdez', designation: 'Digital Marketer', email: 'loraine.koelpin@tromp.io', imageUrl: 'https://i.pravatar.cc/150?u=bertha' },
    { name: 'Harriett Payne', designation: 'CEO', email: 'nunnie_west@estrella.tv', imageUrl: 'https://i.pravatar.cc/150?u=harriettp' },
    { name: 'George Bryant', designation: 'Social Media', email: 'delmer.kling@gmail.com', imageUrl: 'https://i.pravatar.cc/150?u=george' },
    { name: 'Lily French', designation: 'Strategist', email: 'lucienne.herman@hotmail.com', imageUrl: 'https://i.pravatar.cc/150?u=lily' },
];

// This function simulates fetching data from an API.
export const getProspects = async (): Promise<Prospect[]> => {
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // To connect to a real backend, you would replace this line
  // with an API call, like:
  // const response = await api.get('/prospects');
  // return response.data.prospects;

  return prospectData;
};
