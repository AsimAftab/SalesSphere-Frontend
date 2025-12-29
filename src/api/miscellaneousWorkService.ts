import apiClient from './api';

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
  workDate: string; 
  images: string[]; 
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
  date?: string;  // YYYY-MM-DD
  month?: string; // 1-12
  year?: string;  // YYYY
  search?: string;
  employees?: string[];
}

export const getMiscWorks = async (options: GetMiscWorksOptions): Promise<GetMiscWorksResponse> => {
  const { page = 1, limit = 10, date, month, year, search, employees } = options;

  try {
    const params: Record<string, any> = { page, limit };
    if (date) params.date = date;
    if (month) params.month = month;
    if (year) params.year = year;
    if (search) params.search = search;
    if (employees?.length) params.employees = employees.join(',');

    const response = await apiClient.get('/miscellaneous-work', { params });
    const rawData = response.data.data;

    // Mapping based on your provided JSON structure
    const mappedData: MiscWork[] = rawData.map((item: any) => ({
      _id: item._id,
      employee: {
        _id: item.employeeId?._id || '',
        name: item.employeeId?.name || 'Unknown',
        role: item.employeeId?.role || 'Staff',
        avatarUrl: item.employeeId?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.employeeId?.name || 'User')}&background=random`, 
      },
      natureOfWork: item.natureOfWork,
      address: item.address,
      assignedBy: {
        _id: '', 
        name: typeof item.assignedBy === 'string' ? item.assignedBy : (item.assignedBy?.name || 'System'),
        role: 'Admin',
      },
      workDate: item.workDate, 
      // Extracts imageUrl from the array of objects in your JSON
      images: item.images ? item.images.map((img: any) => img.imageUrl) : [],
    }));

    return {
      data: mappedData,
      pagination: {
        total: response.data.count || mappedData.length,
        pages: Math.ceil((response.data.count || mappedData.length) / limit),
        currentPage: page,
      },
    };
  } catch (error) {
    console.error("Failed to fetch miscellaneous work:", error);
    return { data: [], pagination: { total: 0, pages: 0, currentPage: 1 } };
  }
};

export const deleteMiscWork = async (id: string): Promise<void> => {
  await apiClient.delete(`/miscellaneous-work/${id}`);
};