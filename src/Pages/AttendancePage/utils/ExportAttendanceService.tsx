import toast from 'react-hot-toast';
import type { FilteredEmployee, CalendarDay } from '../types';

export const ExportAttendanceService = {
    exportToPdf: async (employees: FilteredEmployee[], month: string, year: number, days: CalendarDay[]) => {
        try {
            const { pdf } = await import('@react-pdf/renderer');
            const AttendancePDF = (await import('../AttendancePDF')).default;

            // @ts-ignore
            const doc = <AttendancePDF employees={employees} month={month} year={year} days={days} />;
            const blob = await pdf(doc).toBlob();

            // Open in new tab
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');

            toast.success('PDF generated successfully');
        } catch (err) {
            console.error(err);
            toast.error('Failed to generate PDF');
            throw err;
        }
    },

//     exportToExcel: async (employees: FilteredEmployee[], month: string, year: number, days: any[]) => {
//         try {
//             const ExcelJS = await import('exceljs');
//             const { saveAs } = await import('file-saver');

//             const workbook = new ExcelJS.Workbook();
//             const worksheet = workbook.addWorksheet('Attendance');

//             // Define Columns Count
//             // 1 (S.No) + 1 (Name) + Days + 1 (Working Days)
//             const totalColumns = 2 + days.length + 1;

//             // --- 1. Header Information ---
//             // Title
//             worksheet.mergeCells(1, 1, 1, totalColumns); // row, col, row, col
//             const titleCell = worksheet.getCell('A1');
//             titleCell.value = `ATTENDANCE REPORT - ${month.toUpperCase()} ${year}`;
//             titleCell.font = { name: 'Helvetica', size: 14, bold: true };
//             titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

//             // Generated Date
//             worksheet.mergeCells(2, 1, 2, totalColumns);
//             const dateCell = worksheet.getCell('A2');
//             dateCell.value = `Generated On: ${new Date().toLocaleDateString()}`;
//             dateCell.font = { name: 'Helvetica', size: 10, italic: true };
//             dateCell.alignment = { horizontal: 'center', vertical: 'middle' };

//             // --- 2. Legend ---
//             // Row 4 for Legend - Clean Text Format
//             worksheet.mergeCells(4, 1, 4, totalColumns);
//             const legendCell = worksheet.getCell('A4');
//             legendCell.value = "   P: Present      A: Absent      W: Weekly Off      L: Leave      H: Half Day";
//             legendCell.font = { name: 'Helvetica', size: 10, bold: true };
//             legendCell.alignment = { horizontal: 'center', vertical: 'middle' };

//             // Hide Gridlines
//             worksheet.views = [
//                 { showGridLines: false }
//             ];

//             // --- 3. Table Headers ---
//             const headerRowIndex = 6;
//             const headerRow = worksheet.getRow(headerRowIndex);

//             // Static Columns
//             headerRow.getCell(1).value = 'S.No';
//             headerRow.getCell(2).value = 'Employee Name';

//             // Dynamic Day Columns
//             days.forEach((day: any, i: number) => {
//                 const colIndex = 3 + i;
//                 const cell = headerRow.getCell(colIndex);
//                 // "1\nT" format
//                 cell.value = `${day.day}\n${day.weekday.substring(0, 1)}`;
//                 cell.alignment = { horizontal: 'center', wrapText: true, vertical: 'middle' };

//                 // Header Styling
//                 cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
//                 cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

//                 // Weekly Off Header Styling (Darker Blue) vs Regular Day (Standard Blue)
//                 if (day.isWeeklyOff) {
//                     cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF163355' } }; // Darker Blue for Weekend Header
//                 } else {
//                     cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF197ADC' } }; // Standard Corporate Blue
//                 }
//             });

//             // Working Days Header
//             const wdColIndex = 3 + days.length;
//             const wdHeader = headerRow.getCell(wdColIndex);
//             wdHeader.value = 'Working Days';
//             // Explicitly set width
//             worksheet.getColumn(wdColIndex).width = 15;

//             // Apply Styling to Static Columns & Working Days Column
//             [1, 2, wdColIndex].forEach(c => {
//                 const cell = headerRow.getCell(c);
//                 cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF197ADC' } };
//                 cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
//                 cell.alignment = { vertical: 'middle', horizontal: 'center' };
//                 cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
//             });

//             headerRow.height = 30;

//             // --- 4. Data Rows ---
//             employees.forEach((emp, index) => {
//                 const rowIndex = headerRowIndex + 1 + index;
//                 const row = worksheet.getRow(rowIndex);

//                 // S.No
//                 const sNoCell = row.getCell(1);
//                 sNoCell.value = index + 1;
//                 sNoCell.alignment = { horizontal: 'center' };
//                 sNoCell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

//                 // Name
//                 const nameCell = row.getCell(2);
//                 nameCell.value = emp.name;
//                 nameCell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

//                 const str = emp.attendanceString || '';
//                 let p = 0, h = 0, w_count = 0, l = 0;

//                 // Fill Days
//                 days.forEach((day: any, i: number) => {
//                     const status = str[i] || '-';
//                     const colIndex = 3 + i;
//                     const cell = row.getCell(colIndex);

//                     cell.value = status;
//                     cell.alignment = { horizontal: 'center' };
//                     cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

//                     // Default Font: Black
//                     cell.font = { color: { argb: 'FF000000' } };

//                     // Counts
//                     if (status === 'P') p++;
//                     if (status === 'H') h++;
//                     if (status === 'W') w_count++;
//                     if (status === 'L') l++;

//                     // Highlight Weekly Off Columns in Data Rows
//                     if (day.isWeeklyOff) {
//                         cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } }; // Light Grey
//                     }
//                 });

//                 // Working Days
//                 const workingDays = p + (h * 0.5) + w_count + l;
//                 const wdCell = row.getCell(wdColIndex);
//                 wdCell.value = workingDays;
//                 wdCell.font = { bold: true };
//                 wdCell.alignment = { horizontal: 'center' };
//                 wdCell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
//             });

//             // --- 5. Column Widths ---
//             worksheet.getColumn(1).width = 6;  // S.No
//             worksheet.getColumn(2).width = 25; // Name
//             // Days
//             for (let i = 0; i < days.length; i++) {
//                 worksheet.getColumn(3 + i).width = 5;
//             }

//             // Write File
//             const buffer = await workbook.xlsx.writeBuffer();
//             const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//             saveAs(blob, `Attendance_Sheet_${month}_${year}.xlsx`);

//             toast.success('Excel exported successfully');
//         } catch (err) {
//             console.error(err);
//             toast.error('Failed to export Excel');
//             throw err;
//         }
//     }



 };
