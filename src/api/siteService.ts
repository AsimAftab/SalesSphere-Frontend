// --- TYPE DEFINITION ---
// Defines the shape of a single site object
export interface Site {
  id: string;
  name: string;
  location: string;
  email: string; // Used as the identifier for the details link
  imageUrl: string;
}

// --- MOCK DATA ---
// In a real app, this data would come from your API
const mockSiteData: Site[] = [
    { id: 'site-01', name: 'Main Warehouse', location: 'Bengaluru, KA', email: 'main.wh@example.com', imageUrl: 'https://i.pravatar.cc/150?u=site1' },
    { id: 'site-02', name: 'North Hub', location: 'Delhi, DL', email: 'north.hub@example.com', imageUrl: 'https://i.pravatar.cc/150?u=site2' },
    { id: 'site-03', name: 'West Distribution', location: 'Mumbai, MH', email: 'west.dist@example.com', imageUrl: 'https://i.pravatar.cc/150?u=site3' },
    { id: 'site-04', name: 'East Depot', location: 'Kolkata, WB', email: 'east.depot@example.com', imageUrl: 'https://i.pravatar.cc/150?u=site4' },
    { id: 'site-05', name: 'South Center', location: 'Chennai, TN', email: 'south.center@example.com', imageUrl: 'https://i.pravatar.cc/150?u=site5' },
    { id: 'site-06', name: 'Central Point', location: 'Nagpur, MH', email: 'central.point@example.com', imageUrl: 'https://i.pravatar.cc/150?u=site6' },
    { id: 'site-07', name: 'Jaipur Outlet', location: 'Jaipur, RJ', email: 'jaipur.outlet@example.com', imageUrl: 'https://i.pravatar.cc/150?u=site7' },
    { id: 'site-08', name: 'Hyderabad Branch', location: 'Hyderabad, TS', email: 'hyd.branch@example.com', imageUrl: 'https://i.pravatar.cc/150?u=site8' },
    { id: 'site-09', name: 'Pune Office', location: 'Pune, MH', email: 'pune.office@example.com', imageUrl: 'https://i.pravatar.cc/150?u=site9' },
    { id: 'site-10', name: 'Ahmedabad Unit', location: 'Ahmedabad, GJ', email: 'ahd.unit@example.com', imageUrl: 'https://i.pravatar.cc/150?u=site10' },
    { id: 'site-11', name: 'Lucknow Center', location: 'Lucknow, UP', email: 'lko.center@example.com', imageUrl: 'https://i.pravatar.cc/150?u=site11' },
    { id: 'site-12', name: 'Kochi Port', location: 'Kochi, KL', email: 'kochi.port@example.com', imageUrl: 'https://i.pravatar.cc/150?u=site12' },
];

// --- MOCK API FETCH FUNCTION ---
export const getSites = async (): Promise<Site[]> => {
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real app, you would make an API call here:
  // const response = await api.get('/sites');
  // return response.data;

  // For now, return the mock data
  return mockSiteData;
};
