import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

interface Day {
  day: number;
  weekday: string;
  isWeekend: boolean;
}

interface Employee {
  name: string;
  attendanceString: string;
}

interface AttendancePDFProps {
  employees: Employee[];
  days: Day[];
  month: string;
  year: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: 'Helvetica',
    fontSize: 8,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: 'Helvetica-Bold',
  },
  table: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    // Added border for the entire table
    border: '1px solid #E5E5E5',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#111827',
    color: '#FFFFFF',
    fontFamily: 'Helvetica-Bold',
    fontSize: 7,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #E5E5E5',
    alignItems: 'center',
  },
  // --- New style for the S.No. column ---
  snoCell: {
    width: '5%',
    padding: 4,
    borderRight: '1px solid #E5E5E5',
    textAlign: 'center',
  },
  employeeNameCell: {
    // Adjusted width
    width: '20%', 
    padding: 4,
    borderRight: '1px solid #E5E5E5',
  },
  daysContainer: {
    // Adjusted width
    width: '65%', 
    flexDirection: 'row',
  },
  dayCell: {
    width: `${100 / 31}%`,
    textAlign: 'center',
    padding: 4,
    borderRight: '1px solid #E5E5E5',
  },
  workingDaysCell: {
    width: '10%',
    padding: 4,
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
  },
  dayHeaderCell: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRight: '1px solid #4B5563',
    padding: 2,
    width: `${100 / 31}%`,
  },
  weekendHeader: {
    backgroundColor: '#374151',
  },
  weekendCell: {
    backgroundColor: '#F3F4F6',
  },
  statusP: { color: '#16A34A' },
  statusA: { color: '#DC2626' },
  statusL: { color: '#F59E0B' },
  statusW: { color: '#3B82F6' },
  statusH: { color: '#8B5CF6' },
  defaultStatus: { color: '#4B5563' },
  pageNumber: {
    position: 'absolute',
    fontSize: 10,
    bottom: 15,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
});

const getStatusStyle = (status: string) => {
    switch(status) {
        case 'P': return styles.statusP;
        case 'A': return styles.statusA;
        case 'L': return styles.statusL;
        case 'W': return styles.statusW;
        case 'H': return styles.statusH;
        default: return styles.defaultStatus;
    }
};

const getWorkingDays = (attendanceString: string): number => {
  return (attendanceString.match(/[PLH]/g) || []).length;
};

const AttendancePDF: React.FC<AttendancePDFProps> = ({ employees, days, month, year }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <Text style={styles.title}>Employee Attendance - {month} {year}</Text>
      <View style={styles.table}>
        <View style={styles.tableHeader} fixed>
          {/* --- Added S.No. Header Cell --- */}
          <Text style={styles.snoCell}>S.No.</Text>
          <Text style={styles.employeeNameCell}>Employee Name</Text>
          <View style={styles.daysContainer}>
            {days.map(day => (
              <View key={day.day} style={[styles.dayHeaderCell, day.isWeekend ? styles.weekendHeader : {}]}>
                <Text>{day.day}</Text>
                <Text>{day.weekday}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.workingDaysCell}>Working Days</Text>
        </View>

        {employees.map((employee, index) => (
          <View style={styles.tableRow} key={employee.name} wrap={false}>
            {/* --- Added S.No. Body Cell --- */}
            <Text style={styles.snoCell}>{index + 1}</Text>
            <Text style={styles.employeeNameCell}>{employee.name}</Text>
            <View style={styles.daysContainer}>
              {employee.attendanceString.split('').map((status, idx) => (
                <Text key={idx} style={[styles.dayCell, days[idx].isWeekend ? styles.weekendCell : {}, getStatusStyle(status)]}>{status}</Text>
              ))}
            </View>
            <Text style={styles.workingDaysCell}>{getWorkingDays(employee.attendanceString)}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
        `${pageNumber} / ${totalPages}`
      )} fixed />
    </Page>
</Document>
);

export default AttendancePDF;