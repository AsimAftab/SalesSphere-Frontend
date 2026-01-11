import { type Employee } from '../../../api/employeeService';
import toast from 'react-hot-toast';
import { type Role } from '../../AdminPanelPage/PermissionTab/types/admin.types';

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

export const ExportEmployeeService = {
    exportToPdf: async (employees: Employee[]) => {
        try {
            const { pdf } = await import('@react-pdf/renderer');
            const { saveAs } = await import('file-saver');
            const EmployeeListPDF = (await import('../EmployeeListPDF')).default;

            const doc = <EmployeeListPDF employees={employees} />;
            const blob = await pdf(doc).toBlob();
            saveAs(blob, `Employee_List_${new Date().toISOString().split('T')[0]}.pdf`);
            toast.success('PDF exported successfully');
        } catch (err) {
            console.error(err);
            toast.error('Failed to export PDF');
            throw err;
        }
    },

    exportToExcel: async (employees: Employee[], roles: Role[]) => {
        try {
            const ExcelJS = await import('exceljs');
            const { saveAs } = await import('file-saver');

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Employees');

            // 1. Calculate max documents & Max Address Length
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

            // 2. Define Columns
            const columns: any[] = [
                {
                    header: 'S.No',
                    key: 's_no',
                    width: 6,
                    style: { alignment: { horizontal: 'left' } }
                },
                { header: 'Name', key: 'name', width: 25 },
                { header: 'Role', key: 'role', width: 15 },
                { header: 'Email', key: 'email', width: 30 },
                {
                    header: 'Phone',
                    key: 'phone',
                    width: 15,
                    style: { numFmt: '0', alignment: { horizontal: 'left' } }
                },
                { header: 'Gender', key: 'gender', width: 10 },
                {
                    header: 'Age',
                    key: 'age',
                    width: 8,
                    style: { alignment: { horizontal: 'left' } }
                },
                { header: 'Date of Birth', key: 'dob', width: 15 },
                { header: 'Date Joined', key: 'dateJoined', width: 15 },
                { header: 'PAN Number', key: 'panNumber', width: 15 },
                { header: 'Citizenship Number', key: 'citizenshipNumber', width: 20 },
                {
                    header: 'Avatar URL',
                    key: 'avatarUrl',
                    width: 40,
                    style: { alignment: { vertical: 'middle', horizontal: 'left' } }
                },
            ];

            // 3. Add Dynamic Document Columns
            for (let i = 0; i < maxDocs; i++) {
                columns.push({
                    header: `Document ${i + 1} URL`,
                    key: `doc_${i}`,
                    width: 50,
                    style: { alignment: { vertical: 'middle', horizontal: 'left' } }
                });
            }

            // 4. Add Address (Last)
            columns.push({
                header: 'Address',
                key: 'address',
                width: maxAddressLength + 2
            });

            worksheet.columns = columns;

            // 5. Prepare Rows
            const rows = employees.map((emp, index) => {
                const rowData: any = {
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
                };

                // Handle Avatar Link
                if (emp.avatarUrl) {
                    rowData.avatarUrl = {
                        text: emp.avatarUrl,
                        hyperlink: emp.avatarUrl,
                        tooltip: 'Click to open image'
                    };
                } else {
                    rowData.avatarUrl = 'N/A';
                }

                // Handle Docs
                for (let i = 0; i < maxDocs; i++) {
                    if (emp.documents && emp.documents[i]) {
                        const url = emp.documents[i].fileUrl;
                        rowData[`doc_${i}`] = {
                            text: url,
                            hyperlink: url,
                            tooltip: 'Click to open document'
                        };
                    } else {
                        rowData[`doc_${i}`] = 'N/A';
                    }
                }

                return rowData;
            });

            worksheet.addRows(rows);

            // 6. Style Header
            const headerRow = worksheet.getRow(1);
            headerRow.font = { bold: true };
            headerRow.commit();

            // 7. Style Hyperlinks
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) return;
                row.eachCell((cell) => {
                    if (cell.value && typeof cell.value === 'object' && 'hyperlink' in cell.value) {
                        cell.font = {
                            color: { argb: 'FF0000FF' }, // Blue
                            underline: true
                        };
                    }
                });
            });

            // 8. Ignore Errors
            const lastRow = worksheet.rowCount;
            if (lastRow > 1) {
                const panCol = worksheet.getColumn('panNumber').letter;
                const citizenCol = worksheet.getColumn('citizenshipNumber').letter;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const sheetAny = worksheet as any;
                if (sheetAny.addIgnoredErrors) {
                    sheetAny.addIgnoredErrors(`${panCol}2:${panCol}${lastRow}`, { numberStoredAsText: true });
                    sheetAny.addIgnoredErrors(`${citizenCol}2:${citizenCol}${lastRow}`, { numberStoredAsText: true });
                }
            }

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, `Employee_List_${new Date().toISOString().split('T')[0]}.xlsx`);

            toast.success('Excel exported successfully');
        } catch (err) {
            console.error(err);
            toast.error('Failed to export Excel');
            throw err;
        }
    }
};
