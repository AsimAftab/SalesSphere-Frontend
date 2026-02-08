import { type Employee } from '@/api/employeeService';
import { type Role } from '../../AdminPanelPage/RolesPermissionsTab/types/admin.types';
import {
    ExportService,
    createHyperlink,
    type ExcelColumn,
    type ExcelCellValue,
} from '@/services/export';

// Helper to get role name safely
const getEmployeeRoleName = (employee: Employee, roles: Role[]): string => {
    if (typeof employee.customRoleId === 'object' && employee.customRoleId?.name) {
        return employee.customRoleId.name;
    }
    if (typeof employee.customRoleId === 'string') {
        const foundRole = roles.find((r: Role) => r._id === employee.customRoleId);
        if (foundRole) return foundRole.name;
    }
    return employee.role || 'user';
};

/**
 * Employee Export Service
 *
 * Uses the generic ExportService for standardized Excel/PDF exports.
 */
export const EmployeeExportService = {
    async toPdf(employees: Employee[]) {
        const EmployeeListPDF = (await import('../EmployeeListPDF')).default;

        await ExportService.toPdf({
            component: <EmployeeListPDF employees={employees} />,
            filename: 'Employee_List',
            openInNewTab: false, // Original behavior was to download
        });
    },

    async toExcel(employees: Employee[], roles: Role[]) {
        // Calculate max documents for dynamic columns
        let maxDocs = 0;
        let maxAddressLength = 15;

        employees.forEach(emp => {
            if (emp.documents && emp.documents.length > maxDocs) {
                maxDocs = emp.documents.length;
            }
            const addrLen = emp.address ? emp.address.length : 0;
            if (addrLen > maxAddressLength) {
                maxAddressLength = addrLen;
            }
        });
        if (maxDocs === 0) maxDocs = 1;

        // Define columns
        const columns: ExcelColumn[] = [
            { header: 'S.No', key: 's_no', width: 6, style: { alignment: { horizontal: 'center' } } },
            { header: 'Name', key: 'name', width: 25 },
            { header: 'Role', key: 'role', width: 15 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Phone', key: 'phone', width: 15 },
            { header: 'Gender', key: 'gender', width: 10 },
            { header: 'Age', key: 'age', width: 8, style: { alignment: { horizontal: 'center' } } },
            { header: 'Date of Birth', key: 'dob', width: 15 },
            { header: 'Date Joined', key: 'dateJoined', width: 15 },
            { header: 'PAN Number', key: 'panNumber', width: 15 },
            { header: 'Citizenship Number', key: 'citizenshipNumber', width: 20 },
            { header: 'Avatar URL', key: 'avatarUrl', width: 40 },
        ];

        // Add dynamic document columns
        for (let i = 0; i < maxDocs; i++) {
            columns.push({ header: `Document ${i + 1} URL`, key: `doc_${i}`, width: 50 });
        }

        // Add address column (last)
        columns.push({ header: 'Address', key: 'address', width: maxAddressLength + 2 });

        await ExportService.toExcel({
            data: employees,
            filename: 'Employee_List',
            sheetName: 'Employees',
            columns,
            rowMapper: (emp, index) => {
                const rowData: Record<string, ExcelCellValue> = {
                    s_no: index + 1,
                    name: emp.name,
                    role: getEmployeeRoleName(emp, roles),
                    email: emp.email,
                    phone: emp.phone ? Number(emp.phone) : 'N/A',
                    gender: emp.gender || 'N/A',
                    age: emp.age !== undefined ? emp.age : 'N/A',
                    dob: emp.dateOfBirth ? new Date(emp.dateOfBirth).toLocaleDateString() : 'N/A',
                    dateJoined: emp.dateJoined ? new Date(emp.dateJoined).toLocaleDateString() : 'N/A',
                    panNumber: emp.panNumber || 'N/A',
                    citizenshipNumber: emp.citizenshipNumber || 'N/A',
                    address: emp.address || 'N/A',
                    avatarUrl: emp.avatarUrl
                        ? createHyperlink(emp.avatarUrl, emp.avatarUrl, 'Click to open image')
                        : 'N/A',
                };

                // Handle document URLs
                for (let i = 0; i < maxDocs; i++) {
                    if (emp.documents && emp.documents[i]) {
                        const url = emp.documents[i].fileUrl;
                        rowData[`doc_${i}`] = createHyperlink(url, url, 'Click to open document');
                    } else {
                        rowData[`doc_${i}`] = 'N/A';
                    }
                }

                return rowData;
            },
        });
    }
};
