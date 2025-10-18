// --- TYPE DEFINITIONS ---
interface SiteDetails {
    id: string;
    name: string;
    location: string;
    manager: string;
    imageUrl: string;
    description: string;
}

interface SiteContact {
    email: string;
    phone: string;
    fullAddress: string;
}

export interface FullSiteDetailsData {
    site: SiteDetails;
    contact: SiteContact;
}

// --- MOCK DATA ---
const mockSiteDetails: FullSiteDetailsData = {
    site: {
        id: 'site-01',
        name: 'Main Warehouse',
        location: 'Bengaluru, KA',
        manager: 'Ankita Roy',
        imageUrl: 'https://i.pravatar.cc/150?u=site1',
        description: 'This is the primary warehouse and distribution center for the southern region, equipped with modern logistics and inventory management systems.',
    },
    contact: {
        email: 'main.wh@example.com',
        phone: '+91-80-12345678',
        fullAddress: '123 Industrial Area, Peenya, Bengaluru, Karnataka, 560058',
    },
};

// --- MOCK API FETCH FUNCTION ---
export const getSiteDetails = async (siteId: string): Promise<FullSiteDetailsData> => {
    console.log(`Fetching details for site with ID: ${siteId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockSiteDetails;
};
