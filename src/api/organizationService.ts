// Type Definitions
export interface User {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Manager" | "Admin" | "Sales Rep";
  emailVerified: boolean;
  lastActive: string;
}

export interface Organization {
  id: string;
  name: string;
  address: string;
  owner: string;
  ownerEmail: string;
  phone: string;
  panVat: string;
  latitude: number;
  longitude: number;
  addressLink: string;
  status: "Active" | "Inactive";
  users: User[];
  createdDate: string;
  emailVerified: boolean;
  subscriptionStatus: "Active" | "Expired";
  subscriptionExpiry: string;
  deactivationReason?: string;
  deactivatedDate?: string;
}

export interface OrganizationStats {
  total: number;
  active: number;
  inactive: number;
  expired: number;
}

export interface AddOrganizationRequest {
  name: string;
  address: string;
  owner: string;
  ownerEmail: string;
  phone: string;
  panVat: string;
  latitude: number;
  longitude: number;
  addressLink: string;
  status: "Active" | "Inactive";
  emailVerified: boolean;
  subscriptionStatus: "Active" | "Expired";
  subscriptionExpiry: string;
}

export interface UpdateOrganizationRequest {
  id: string;
  name?: string;
  address?: string;
  owner?: string;
  ownerEmail?: string;
  phone?: string;
  panVat?: string;
  latitude?: number;
  longitude?: number;
  addressLink?: string;
  status?: "Active" | "Inactive";
  emailVerified?: boolean;
  subscriptionStatus?: "Active" | "Expired";
  subscriptionExpiry?: string;
  deactivationReason?: string;
  deactivatedDate?: string;
}

// Mock Data Generation
// Secure random integer generator using crypto.getRandomValues()
const randomInt = (min: number, max: number) => {
  const range = max - min + 1;
  const randomBuffer = new Uint32Array(1);
  crypto.getRandomValues(randomBuffer);
  return min + (randomBuffer[0] % range);
};

// Secure random float generator (0 to 1) using crypto.getRandomValues()
const randomFloat = (): number => {
  const randomBuffer = new Uint32Array(1);
  crypto.getRandomValues(randomBuffer);
  return randomBuffer[0] / (0xffffffff + 1);
};

const generateMockUsers = (count: number, ownerEmail: string, ownerName: string): User[] => {
  const roles: ("Manager" | "Admin" | "Sales Rep")[] = ["Manager", "Admin", "Sales Rep"];
  const users: User[] = [
    {
      id: `u-${Date.now()}-0`,
      name: ownerName,
      email: ownerEmail,
      role: "Owner",
      emailVerified: true,
      lastActive: `${randomInt(1, 5)} hours ago`
    }
  ];

  const names = [
    "Sarah Mitchell", "Mike Johnson", "Emily Davis", "Robert Chen",
    "Lisa Wong", "James Wilson", "Amanda Brown", "Chris Martinez",
    "Patricia Taylor", "Sandra Kim"
  ];

  for (let i = 1; i < count; i++) {
    const name = names[i % names.length];
    users.push({
      id: `u-${Date.now()}-${i}`,
      name: name,
      email: name.toLowerCase().replace(" ", ".") + "@example.com",
      role: roles[randomInt(0, roles.length - 1)],
      emailVerified: randomFloat() > 0.2,
      lastActive: randomFloat() > 0.3 ? `${randomInt(1, 24)} hours ago` : `${randomInt(1, 7)} days ago`
    });
  }

  return users;
};

const generateMockOrganizations = (count: number = 5): Organization[] => {
  const organizations: Organization[] = [];
  const cities = [
    { name: "San Francisco, CA", zip: "94105" },
    { name: "New York, NY", zip: "10001" },
    { name: "Austin, TX", zip: "78701" },
    { name: "Chicago, IL", zip: "60601" },
    { name: "Seattle, WA", zip: "98101" }
  ];

  const companyNames = [
    "TechCorp Solutions",
    "Global Retail Inc",
    "ProSales Dynamics",
    "Apex Distribution",
    "Northwest Trading Co",
    "Summit Logistics",
    "Metro Sales Group",
    "Pacific Commerce"
  ];

  const ownerNames = [
    "John Anderson",
    "Maria Garcia",
    "David Thompson",
    "Jennifer Lee",
    "Michael Chang",
    "Rachel Martinez",
    "Kevin O'Brien",
    "Lisa Patel"
  ];

  for (let i = 0; i < count; i++) {
    const companyName = companyNames[i % companyNames.length];
    const ownerName = ownerNames[i % ownerNames.length];
    const city = cities[i % cities.length];
    const isActive = randomFloat() > 0.3;
    const subscriptionStatuses: ("Active" | "Expired")[] = isActive
      ? ["Active"]
      : ["Expired"];
    const subscriptionStatus = subscriptionStatuses[randomInt(0, subscriptionStatuses.length - 1)];
    const emailVerified = true;

    const createdDate = new Date();
    createdDate.setMonth(createdDate.getMonth() - randomInt(3, 6));

    const subscriptionExpiry = new Date(createdDate);
    if (subscriptionStatus === "Active") {
      subscriptionExpiry.setFullYear(subscriptionExpiry.getFullYear() + 1);
    } else {
      subscriptionExpiry.setMonth(subscriptionExpiry.getMonth() - randomInt(1, 3));
    }

    const latitude = 27.7172 + (randomFloat() - 0.5) * 0.2;
    const longitude = 85.324 + (randomFloat() - 0.5) * 0.2;

    const org: Organization = {
      id: `org-${String(i + 1).padStart(3, '0')}`,
      name: companyName,
      address: `${randomInt(100, 999)} ${["Tech Street", "Commerce Ave", "Business Blvd", "Logistics Lane", "Market Street"][i % 5]}, ${city.name} ${city.zip}`,
      owner: ownerName,
      ownerEmail: `${ownerName.toLowerCase().replace(" ", ".")}@${companyName.toLowerCase().replace(/\s+/g, "").substring(0, 10)}.com`,
      phone: `+1${randomInt(200, 999)}${randomInt(200, 999)}${randomInt(1000, 9999)}`,
      panVat: `${randomInt(100000000, 999999999)}`,
      latitude: latitude,
      longitude: longitude,
      addressLink: `https://maps.google.com/?q=${latitude},${longitude}`,
      status: isActive ? "Active" : "Inactive",
      users: generateMockUsers(randomInt(1, 5), "", ownerName),
      createdDate: createdDate.toISOString().split('T')[0],
      emailVerified: emailVerified,
      subscriptionStatus: subscriptionStatus,
      subscriptionExpiry: subscriptionExpiry.toISOString().split('T')[0],
    };

    org.users[0].email = org.ownerEmail;

    if (!isActive && subscriptionStatus === "Expired") {
      org.deactivationReason = "Subscription expired - payment not received";
      org.deactivatedDate = subscriptionExpiry.toISOString().split('T')[0];
    }

    organizations.push(org);
  }

  return organizations;
};

let mockOrganizations = generateMockOrganizations(5);

// API Functions
export const getAllOrganizations = async (): Promise<Organization[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  if (randomFloat() > 0.95) {
    throw new Error("Failed to fetch organizations from the server.");
  }
  return [...mockOrganizations];
};

export const getOrganizationById = async (id: string): Promise<Organization | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const org = mockOrganizations.find(o => o.id === id);
  return org ? { ...org } : null;
};

export const addOrganization = async (orgData: AddOrganizationRequest): Promise<Organization> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newOrg: Organization = {
    ...orgData,
    id: `org-${String(mockOrganizations.length + 1).padStart(3, '0')}`,
    createdDate: new Date().toISOString().split('T')[0],
    users: [
      {
        id: `u-${Date.now()}`,
        name: orgData.owner,
        email: orgData.ownerEmail,
        role: "Owner",
        emailVerified: orgData.emailVerified,
        lastActive: "Never"
      }
    ]
  };
  mockOrganizations.push(newOrg);
  return { ...newOrg };
};

export const updateOrganization = async (orgData: UpdateOrganizationRequest): Promise<Organization> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockOrganizations.findIndex(o => o.id === orgData.id);
  if (index === -1) {
    throw new Error(`Organization with ID ${orgData.id} not found`);
  }
  const updatedOrg: Organization = {
    ...mockOrganizations[index],
    ...orgData
  };
  mockOrganizations[index] = updatedOrg;
  return { ...updatedOrg };
};

export const deleteOrganization = async (id: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockOrganizations.findIndex(o => o.id === id);
  if (index === -1) {
    throw new Error(`Organization with ID ${id} not found`);
  }
  mockOrganizations.splice(index, 1);
  return true;
};

export const getOrganizationStats = async (): Promise<OrganizationStats> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const stats: OrganizationStats = {
    total: mockOrganizations.length,
    active: mockOrganizations.filter(o => o.status === "Active").length,
    inactive: mockOrganizations.filter(o => o.status === "Inactive").length,
    expired: mockOrganizations.filter(o => o.subscriptionStatus === "Expired").length
  };
  return stats;
};

export const searchOrganizations = async (query: string): Promise<Organization[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const lowerQuery = query.toLowerCase();
  const filtered = mockOrganizations.filter(org =>
    org.name.toLowerCase().includes(lowerQuery) ||
    org.owner.toLowerCase().includes(lowerQuery) ||
    org.ownerEmail.toLowerCase().includes(lowerQuery)
  );
  return [...filtered];
};

export const filterOrganizationsByStatus = async (
  status: "all" | "active" | "inactive"
): Promise<Organization[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  if (status === "all") {
    return [...mockOrganizations];
  }
  const filtered = mockOrganizations.filter(org =>
    status === "active" ? org.status === "Active" : org.status === "Inactive"
  );
  return [...filtered];
};
