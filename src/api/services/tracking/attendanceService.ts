// src/services/attendanceService.ts

// --- TYPE DEFINITIONS ---
export interface AttendanceRecord {
  [key: string]: string | undefined;
}

export interface Employee {
  id: number; // Unique ID is crucial for updates
  name: string;
  attendance: AttendanceRecord;
}

// --- MOCK DATA (Now lives in the service) ---
// Note: Added unique IDs and removed duplicate entries for clarity.
const mockEmployees: Employee[] = [
    { id: 1, name: 'Leslie Alexander', attendance: { 'October-2025': 'PWAWWPWPPLWPPPWAWWPPPWWPWAAWPHW', 'June-2025': 'PWAWWPWPPLWPPPWAWWPPPWWPWAAWPP', 'May-2025': 'PAAAPPWPPPLPPPPWWAAAWLPPWWPP' }},
    { id: 2, name: 'Helen Henderson', attendance: { 'October-2025': 'PAWAWAPPPPWPPWWWWLPPPPAWPPPWPPP', 'June-2025': 'PAWAWAPPPPWPPWWWWLPPPPAWPPPWPP', 'May-2025': 'PWPWAPWWPPPAPWPPPLPAWPPPPPAWPP' }},
    { id: 3, name: 'Marcus Johnson', attendance: { 'October-2025': 'WWAPPPPAPWPPPWLPPPPWWWWAAWPWPPP', 'June-2025': 'WWAPPPPAPWPPPWLPPPPWWWWAAWPWPP', 'May-2025': 'PLPWPWAWAPPPWWPPPAPPAPAWPLPWPP' }},
    { id: 4, name: 'Marcos Junior', attendance: { 'October-2025': 'PWAWAAPAWPPPAPAPWWPPWLLWAWPWPPP', 'June-2025': 'PWAWAAPAWPPPAPAPWWPPWLLWAWPWPP', 'May-2025': 'PAWAWAPPPPWPPWWWWLPPPPAWPPPWPP' }},
    { id: 5, name: 'Benjamin Davis', attendance: { 'October-2025': 'PLPWPWAWAPPPWWPPPAPPAPAWPLPWPPP', 'June-2025': 'PLPWPWAWAPPPWWPPPAPPAPAWPLPWPP', 'May-2025': 'WWAPPPPAPWPPPWLPPPPWWWWAAWPWPP' }},
    { id: 6, name: 'Hannah Paelgrgggrg', attendance: { 'October-2025': 'WAPWAPPPPPPLPWAPWPPPPWAWPWPWPPP', 'June-2025': 'WAPWAPPPPPPLPWAPWPPPPWAWPWPWPP' }},
    { id: 7, name: 'George Albert', attendance: { 'October-2025': 'APWPPPWWPPPPWPLPPALWPPWPLPPWPWW' , 'June-2025': 'APWPPPWWPPPPWPLPPALWPPWPLPPWPP' } },
    { id: 8, name: 'Kensh Wilson', attendance: { 'October-2025': 'PWPWAPWWPPPAPWPPPLPAWPPPPPAWPWW' , 'June-2025': 'PWPWAPWWPPPAPWPPPLPAWPPPPPAWPP' } },
    { id: 9, name: 'James Martinez', attendance: { 'October-2025': 'PPWWPPPPPPPWPPPAPLPPPPWPPAPWPWP' , 'June-2025': 'PPWWPPPPPPPWPPPAPLPPPPWPPAPWPP' } },
    { id: 10, name: 'Olivia Baker', attendance: { 'October-2025': 'PWWPPPPPPPWPPPAPLPPPPWPPAPWPPPP' , 'June-2025': 'PWWPPPPPPPWPPPAPLPPPPWPPAPWPP' } },
    // Added more for pagination example
    { id: 11, name: 'Liam Garcia', attendance: { 'October-2025': 'AWPWAPWPWPPAPWPWPPAPWPAPWPAPWPP' } },
    { id: 12, name: 'Sophia Rodriguez', attendance: { 'October-2025': 'PWPWAPWPWPPAPWPWPPAPWPAPWPAPWPP' } },
];


/**
 * Fetches attendance data for a given month and year.
 * @param month - The full name of the month (e.g., "October")
 * @param year - The four-digit year (e.g., 2025)
 * @returns A promise that resolves to an array of employee data.
 */
export const fetchAttendanceData = (month: string, year: number): Promise<Employee[]> => {
  console.log(`Fetching data for ${month} ${year}...`);
  // **BACKEND INTEGRATION POINT**
  // Replace the contents of this Promise with your actual API call, e.g., using axios.
  // const response = await axios.get(`/api/attendance?month=${month}&year=${year}`);
  // return response.data;

  return new Promise(resolve => {
    setTimeout(() => {
      // Simulate filtering data based on month/year for the demo
      const key = `${month}-${year}`;
      const dataForMonth = mockEmployees.filter(emp => emp.attendance[key]);
      resolve(dataForMonth);
    }, 500); // Simulate network delay
  });
};