// /src/api/miscellaneousWorkService.ts
import apiClient from './api'; // Assuming your client is here

export interface EmployeeRef {
  _id: string;
  name: string;
  role: string;
  avatarUrl?: string;
}

export interface MiscWork {
  _id: string;
  employee: EmployeeRef;
  natureOfWork: string;
  address: string;
  assignedBy: EmployeeRef;
  date: string; // ISO Date string
  images: string[]; // UPDATED: Now an array of strings to hold up to 2 images
}

export interface GetMiscWorksResponse {
  data: MiscWork[];
  pagination: {
    total: number;
    pages: number;
    currentPage: number;
  };
}

export interface GetMiscWorksOptions {
  page?: number;
  limit?: number;
  date?: string;  // Format: YYYY-MM-DD
  month?: string; // Format: 1-12
  year?: string;  // Format: YYYY
}

// --- REAL API FUNCTION ---
export const getMiscWorks = async (options: GetMiscWorksOptions): Promise<GetMiscWorksResponse> => {
  const { page = 1, limit = 10, date, month, year } = options;

  try {
    // 1. Construct Query Params
    const params: Record<string, any> = {};
    if (date) params.date = date;
    if (month) params.month = month;
    if (year) params.year = year;

    // 2. API Call
    const response = await apiClient.get('/miscellaneous-work', { params });
    const rawData = response.data.data;

    // 3. Map Backend Data to Frontend Interface
    const mappedData: MiscWork[] = rawData.map((item: any) => ({
      _id: item._id,
      employee: {
        _id: item.employeeId?._id || '',
        name: item.employeeId?.name || 'Unknown',
        role: item.employeeId?.role || 'Staff',
        // Fallback avatar generation if backend doesn't provide one
        avatarUrl: item.employeeId?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.employeeId?.name || 'User')}&background=random`, 
      },
      natureOfWork: item.natureOfWork,
      address: item.address,
      assignedBy: {
        _id: item.assignedById?._id || '',
        name: item.assignedById?.name || 'System',
        role: 'Admin', // Note: Ensure backend populates 'role' if you need this dynamic
      },
      date: item.workDate,
      // EXTRACT ALL IMAGES: Map the backend objects { imageNumber, imageUrl } to a simple string array
      images: item.images ? item.images.map((img: any) => img.imageUrl) : [],
    }));

    // 4. Client-Side Pagination (since backend returns all records)
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = mappedData.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      pagination: {
        total: mappedData.length,
        pages: Math.ceil(mappedData.length / limit),
        currentPage: page,
      },
    };

  } catch (error) {
    console.error("Failed to fetch miscellaneous work:", error);
    return {
      data: [],
      pagination: {
        total: 0,
        pages: 0,
        currentPage: 1,
      },
    };
  }
};