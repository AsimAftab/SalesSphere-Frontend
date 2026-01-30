import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import type { FilteredEmployee, CalendarDay } from './types';
import { formatDisplayDate } from '../../utils/dateUtils';
import { PDF_FONT_FAMILY } from '../../utils/pdfFonts';

// Tailwind Colors Mapping
const COLORS = {
  primary: '#163355',   // Dark Blue (Weekly Off Header)
  secondary: '#197ADC', // Brand Blue (Default Header)
  text: {
    P: '#22c55e', // green-500
    A: '#ef4444', // red-500
    W: '#3b82f6', // blue-500
    L: '#eab308', // yellow-500
    H: '#a855f7', // purple-500
    default: '#9ca3af' // gray-400
  },
  bg: {
    weeklyOff: '#F9FAFB' // gray-50
  }
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 50,
    backgroundColor: '#FFFFFF',
    fontFamily: PDF_FONT_FAMILY,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#111827',
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    textTransform: 'uppercase',
  },
  titleGroup: { flexDirection: 'column' },
  subTitle: { fontSize: 10, color: '#6B7280', marginTop: 4, textTransform: 'uppercase' },
  reportInfo: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  reportLabel: { fontSize: 8, color: '#6B7280' },
  reportValue: { fontSize: 10, color: '#111827', fontWeight: 'bold' },

  // Table
  tableContainer: {
    flexDirection: 'column',
    width: '100%',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.secondary,
    alignItems: 'stretch',
    height: 25,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderLeftColor: '#E5E7EB',
    borderRightColor: '#E5E7EB',
    borderTopColor: '#E5E7EB',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomColor: '#F3F4F6',
    borderBottomWidth: 1,
    alignItems: 'stretch',
    minHeight: 18,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderLeftColor: '#E5E7EB',
    borderRightColor: '#E5E7EB',
  },
  rowEven: { backgroundColor: '#FFFFFF' },
  rowOdd: { backgroundColor: '#FAFAFA' },

  // Cells
  cellBase: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 0.5,
    borderRightColor: '#E5E5E5',
    height: '100%',
  },
  headerCell: {
    color: '#FFFFFF',
    fontSize: 6,
    fontWeight: 'bold',
    paddingTop: 2,
  },
  bodyCell: {
    color: '#1F2937',
    fontSize: 6,
    paddingTop: 1,
  },

  // Static Column Widths
  colSno: { width: '3%' },
  colName: {
    width: '17%',
    alignItems: 'flex-start',
    paddingLeft: 4
  },
  colWorkDays: {
    width: '8%',
  },

  // Backgrounds
  bgSecondary: { backgroundColor: COLORS.secondary },
  bgPrimary: { backgroundColor: COLORS.primary },
});

interface AttendancePDFProps {
  employees: FilteredEmployee[];
  days: CalendarDay[];
  month: string;
  year: number;
}

const AttendancePDF: React.FC<AttendancePDFProps> = ({ employees, days, month, year }) => {
  const remainingWidth = 72;
  const dayWidth = remainingWidth / days.length;

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>

        {/* Header Section */}
        <View style={styles.headerContainer}>
          <View style={styles.titleGroup}>
            <Text style={styles.title}>Attendance Report - {month} {year}</Text>
            <Text style={styles.subTitle}>Monthly Employee Attendance Summary</Text>
          </View>
          <View style={styles.reportInfo}>
            <Text style={styles.reportLabel}>Generated On</Text>
            <Text style={styles.reportValue}>{formatDisplayDate(new Date().toISOString())}</Text>
            <Text style={styles.reportLabel}>Total Employees</Text>
            <Text style={styles.reportValue}>{employees.length}</Text>
          </View>
        </View>

        {/* Legend Section */}
        <View style={{ flexDirection: 'row', marginBottom: 12, alignSelf: 'flex-start' }}>
          <Text style={{ fontSize: 8, color: '#374151', marginRight: 5, fontWeight: 'bold' }}>Legend:</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
            <View style={{ width: 8, height: 8, backgroundColor: COLORS.text.P, marginRight: 3, borderRadius: 2 }} />
            <Text style={{ fontSize: 8, color: '#374151' }}>Present (P)</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
            <View style={{ width: 8, height: 8, backgroundColor: COLORS.text.A, marginRight: 3, borderRadius: 2 }} />
            <Text style={{ fontSize: 8, color: '#374151' }}>Absent (A)</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
            <View style={{ width: 8, height: 8, backgroundColor: COLORS.text.W, marginRight: 3, borderRadius: 2 }} />
            <Text style={{ fontSize: 8, color: '#374151' }}>Weekly Off (W)</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
            <View style={{ width: 8, height: 8, backgroundColor: COLORS.text.L, marginRight: 3, borderRadius: 2 }} />
            <Text style={{ fontSize: 8, color: '#374151' }}>Leave (L)</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 8, height: 8, backgroundColor: COLORS.text.H, marginRight: 3, borderRadius: 2 }} />
            <Text style={{ fontSize: 8, color: '#374151' }}>Half Day (H)</Text>
          </View>
        </View>

        {/* Table Section */}
        <View style={styles.tableContainer}>
          {/* --- Header Row (fixed across pages) --- */}
          <View style={styles.tableHeaderRow} fixed>
            <View style={[styles.cellBase, styles.colSno]}>
              <Text style={styles.headerCell}>S.No</Text>
            </View>
            <View style={[styles.cellBase, styles.colName]}>
              <Text style={styles.headerCell}>Employee Name</Text>
            </View>

            {/* Dynamic Day Columns */}
            {days.map(d => (
              <View
                key={d.day}
                style={[
                  styles.cellBase,
                  { width: `${dayWidth}%` },
                  d.isWeeklyOff ? styles.bgPrimary : {}
                ]}
              >
                <Text style={styles.headerCell}>{d.day}</Text>
                <Text style={styles.headerCell}>{d.weekday.substring(0, 1)}</Text>
              </View>
            ))}

            {/* Working Days Column */}
            <View style={[styles.cellBase, styles.colWorkDays]}>
              <Text style={styles.headerCell}>Working Days</Text>
            </View>
          </View>

          {/* --- Data Rows --- */}
          {employees.map((emp, index) => {
            const rowStyle = index % 2 === 0 ? styles.rowEven : styles.rowOdd;
            const str = emp.attendanceString || '';

            const p = (str.match(/P/g) || []).length;
            const h = (str.match(/H/g) || []).length;
            const w_count = (str.match(/W/g) || []).length;
            const l_count = (str.match(/L/g) || []).length;
            const workingDays = p + (h * 0.5) + w_count + l_count;

            return (
              <View style={[styles.tableRow, rowStyle]} key={emp.id} wrap={false}>
                <View style={[styles.cellBase, styles.colSno]}>
                  <Text style={styles.bodyCell}>{index + 1}</Text>
                </View>
                <View style={[styles.cellBase, styles.colName]}>
                  <Text style={styles.bodyCell}>{emp.name}</Text>
                </View>

                {/* Days */}
                {days.map((d, i) => {
                  const status = str[i] || '-';
                  let color = COLORS.text.default;
                  if (status === 'P') color = COLORS.text.P;
                  if (status === 'A') color = COLORS.text.A;
                  if (status === 'L') color = COLORS.text.L;
                  if (status === 'H') color = COLORS.text.H;
                  if (status === 'W') color = COLORS.text.W;

                  return (
                    <View
                      key={d.day}
                      style={[
                        styles.cellBase,
                        { width: `${dayWidth}%` },
                        d.isWeeklyOff ? { backgroundColor: COLORS.bg.weeklyOff } : {}
                      ]}
                    >
                      <Text style={[styles.bodyCell, { color, fontWeight: 'bold' }]}>{status}</Text>
                    </View>
                  );
                })}

                {/* Working Days */}
                <View style={[styles.cellBase, styles.colWorkDays]}>
                  <Text style={[styles.bodyCell, { fontWeight: 'bold' }]}>{workingDays}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Footer */}
        <View style={{ position: 'absolute', bottom: 20, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} fixed>
          <Text style={{ fontSize: 8, color: '#9CA3AF' }}>Attendance Report</Text>
          <Text style={{ fontSize: 8, color: '#9CA3AF' }} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
};

export default AttendancePDF;
