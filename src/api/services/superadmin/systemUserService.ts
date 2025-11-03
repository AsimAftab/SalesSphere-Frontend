// Type Definitions
export interface SystemUser {
  id: string;
  name: string;
  email: string;
  password: string; // For login authentication
  role: "superadmin" | "Developer";
  phone: string;
  position: string;
  dob: string;
  pan: string;
  citizenship: string;
  gender: string;
  location: string;
  photoPreview: string | null;
  createdDate: string;
  lastActive: string;
  isActive: boolean; // Track if user has access to the system
}

export interface UpdateSystemUserRequest {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  position?: string;
  dob?: string;
  pan?: string;
  citizenship?: string;
  gender?: string;
  location?: string;
  photoPreview?: string | null;
  isActive?: boolean;
}

// Mock System Users Data
const generateMockSystemUsers = (): SystemUser[] => {
  return [
    {
      id: "su-001",
      name: "Asim Aftab",
      email: "asim.aftab@salessphere.com",
      password: "SuperAdmin@123",
      role: "superadmin",
      phone: "9876543210",
      position: "System Administrator",
      dob: "1990-05-15",
      pan: "12345678901234",
      citizenship: "12345678901234",
      gender: "Male",
      location: "Kathmandu, Nepal",
      photoPreview: "https://ui-avatars.com/api/?name=Asim+Aftab&size=300&background=3b82f6&color=fff",
      createdDate: "2024-01-01",
      lastActive: "2 hours ago",
      isActive: true
    },
    {
      id: "su-002",
      name: "Bikram Agrawal",
      email: "bikram.agrawal@salessphere.com",
      password: "SuperAdmin@456",
      role: "superadmin",
      phone: "9876543211",
      position: "System Administrator",
      dob: "1988-08-22",
      pan: "12345678901235",
      citizenship: "12345678901235",
      gender: "Male",
      location: "Lalitpur, Nepal",
      photoPreview: "https://ui-avatars.com/api/?name=Bikram+Agrawal&size=300&background=3b82f6&color=fff",
      createdDate: "2024-01-01",
      lastActive: "1 hour ago",
      isActive: true
    },
    {
      id: "su-003",
      name: "Ayush Kumar Mahato",
      email: "ayush.mahato@salessphere.com",
      password: "Developer@456",
      role: "Developer",
      phone: "9876543212",
      position: "Software Developer",
      dob: "1995-03-10",
      pan: "12345678901236",
      citizenship: "12345678901236",
      gender: "Male",
      location: "Bhaktapur, Nepal",
      photoPreview: "https://ui-avatars.com/api/?name=Ayush+Mahato&size=300&background=10b981&color=fff",
      createdDate: "2024-02-15",
      lastActive: "30 minutes ago",
      isActive: true
    },
    {
      id: "su-004",
      name: "Ankit Kumar Gupta",
      email: "ankit.gupta@salessphere.com",
      password: "Developer@456",
      role: "Developer",
      phone: "9876543213",
      position: "Software Developer",
      dob: "1994-11-25",
      pan: "12345678901237",
      citizenship: "12345678901237",
      gender: "Male",
      location: "Pokhara, Nepal",
      photoPreview: "https://ui-avatars.com/api/?name=Ankit+Gupta&size=300&background=10b981&color=fff",
      createdDate: "2024-02-15",
      lastActive: "15 minutes ago",
      isActive: true
    }
  ];
};

let mockSystemUsers = generateMockSystemUsers();

// API Functions
export const getAllSystemUsers = async (): Promise<SystemUser[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...mockSystemUsers];
};

export const getSystemUserById = async (id: string): Promise<SystemUser | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const user = mockSystemUsers.find(u => u.id === id);
  return user ? { ...user } : null;
};

export const authenticateSystemUser = async (email: string, password: string): Promise<SystemUser | null> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const user = mockSystemUsers.find(u => u.email === email && u.password === password);
  return user ? { ...user } : null;
};

export const updateSystemUser = async (userData: UpdateSystemUserRequest): Promise<SystemUser> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockSystemUsers.findIndex(u => u.id === userData.id);
  if (index === -1) {
    throw new Error(`System user with ID ${userData.id} not found`);
  }
  const updatedUser: SystemUser = {
    ...mockSystemUsers[index],
    ...userData
  };
  mockSystemUsers[index] = updatedUser;
  return { ...updatedUser };
};

export const updateSystemUserPassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const user = mockSystemUsers.find(u => u.id === userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.password !== currentPassword) {
    throw new Error("Current password is incorrect");
  }

  user.password = newPassword;
  return true;
};

export const getSystemUserStats = () => {
  const stats = {
    total: mockSystemUsers.length,
    superAdmins: mockSystemUsers.filter(u => u.role === "superadmin").length,
    developers: mockSystemUsers.filter(u => u.role === "Developer").length
  };
  return stats;
};
