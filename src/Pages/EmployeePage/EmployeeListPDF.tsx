import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { type Employee } from '../../api/employeeService';
import { formatDisplayDate } from '../../utils/dateUtils';
import { PDF_FONT_FAMILY } from '../../utils/pdfFonts';

const styles = StyleSheet.create({
  page: {
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 50,
    backgroundColor: '#FFFFFF',
    fontFamily: PDF_FONT_FAMILY,
  },
  // Header Section
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
  reportLabel: {
    fontSize: 8,
    color: '#6B7280',
  },
  reportValue: {
    fontSize: 10,
    color: '#111827',
    fontWeight: 'bold',
  },

  // Table Styles
  tableContainer: {
    flexDirection: 'column',
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#197ADC', // ✅ Updated Background Color
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 24,
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
    alignItems: 'center',
    minHeight: 24, // Allow growth for text wrapping
    paddingVertical: 4,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderLeftColor: '#E5E7EB',
    borderRightColor: '#E5E7EB',
  },
  // Alternating Row Color
  rowEven: {
    backgroundColor: '#FFFFFF',
  },
  rowOdd: {
    backgroundColor: '#FAFAFA', // Very light gray for alternate rows
  },

  // Cell Styles
  cellHeader: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#FFFFFF', // ✅ Changed text to White for contrast
    paddingLeft: 4,
    paddingRight: 4,
    textAlign: 'left',
  },
  cellText: {
    fontSize: 7,
    color: '#1F2937',
    paddingLeft: 4,
    paddingRight: 4,
    textAlign: 'left',
  },
  // Utilities
  textCenter: { textAlign: 'center' },
  textRight: { textAlign: 'right' },
});

interface EmployeeListPDFProps {
  employees: Employee[];
}

const EmployeeListPDF: React.FC<EmployeeListPDFProps> = ({ employees }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>

      {/* 1. Page Header */}
      <View style={styles.headerContainer}>
        <View style={styles.titleGroup}>
          <Text style={styles.title}>Employee List Report</Text>
          <Text style={styles.subTitle}>Overview of All Employees</Text>
        </View>
        <View style={styles.reportInfo}>
          <Text style={styles.reportLabel}>Generated On</Text>
          <Text style={styles.reportValue}>{formatDisplayDate(new Date().toISOString())}</Text>
          <Text style={styles.reportLabel}>Total Employees</Text>
          <Text style={styles.reportValue}>{employees.length}</Text>
        </View>
      </View>

      {/* 2. Table */}
      <View style={styles.tableContainer}>

        {/* Table Header Row */}
        <View style={styles.tableHeader} fixed>
          <Text style={[styles.cellHeader, styles.textCenter, { width: '4%' }]}>S.No</Text>
          <Text style={[styles.cellHeader, { width: '11%' }]}>Name</Text>
          <Text style={[styles.cellHeader, { width: '8%' }]}>Role</Text>
          <Text style={[styles.cellHeader, { width: '14%' }]}>Email</Text>
          <Text style={[styles.cellHeader, { width: '9%' }]}>Phone</Text>
          <Text style={[styles.cellHeader, { width: '5%' }]}>Gender</Text>
          <Text style={[styles.cellHeader, styles.textCenter, { width: '4%' }]}>Age</Text>
          <Text style={[styles.cellHeader, { width: '7%' }]}>DOB</Text>
          <Text style={[styles.cellHeader, { width: '7%' }]}>Joined</Text>
          <Text style={[styles.cellHeader, { width: '13%' }]}>Address</Text>
          <Text style={[styles.cellHeader, { width: '9%' }]}>PAN</Text>
          <Text style={[styles.cellHeader, { width: '9%' }]}>Citizenship</Text>
        </View>

        {/* Table Rows */}
        {employees.map((emp, index) => {
          // Zebra striping logic
          const rowStyle = index % 2 === 0 ? styles.rowEven : styles.rowOdd;

          return (
            <View style={[styles.tableRow, rowStyle]} key={emp._id} wrap={false}>
              {/* S.No */}
              <Text style={[styles.cellText, styles.textCenter, { width: '4%' }]}>
                {index + 1}
              </Text>

              {/* Name */}
              <Text style={[styles.cellText, { width: '11%' }]}>
                {emp.name}
              </Text>

              {/* Role */}
              <Text style={[styles.cellText, { width: '8%' }]}>
                {(typeof emp.customRoleId === 'object' && emp.customRoleId?.name)
                  ? emp.customRoleId.name
                  : emp.role}
              </Text>

              {/* Email */}
              <Text style={[styles.cellText, { width: '14%' }]}>
                {emp.email}
              </Text>

              {/* Phone */}
              <Text style={[styles.cellText, { width: '9%' }]}>
                {emp.phone || '-'}
              </Text>

              {/* Gender */}
              <Text style={[styles.cellText, { width: '5%' }]}>
                {emp.gender || '-'}
              </Text>

              {/* Age */}
              <Text style={[styles.cellText, styles.textCenter, { width: '4%' }]}>
                {emp.age !== undefined ? emp.age : '-'}
              </Text>

              {/* DOB */}
              <Text style={[styles.cellText, { width: '7%' }]}>
                {emp.dateOfBirth ? new Date(emp.dateOfBirth).toISOString().split('T')[0] : '-'}
              </Text>

              {/* Joined */}
              <Text style={[styles.cellText, { width: '7%' }]}>
                {emp.dateJoined ? new Date(emp.dateJoined).toISOString().split('T')[0] : '-'}
              </Text>

              {/* Address */}
              <Text style={[styles.cellText, { width: '13%' }]}>
                {emp.address || '-'}
              </Text>

              {/* PAN */}
              <Text style={[styles.cellText, { width: '9%' }]}>
                {emp.panNumber || '-'}
              </Text>

              {/* Citizenship */}
              <Text style={[styles.cellText, { width: '9%' }]}>
                {emp.citizenshipNumber || '-'}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Footer */}
      <View style={{ position: 'absolute', bottom: 20, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} fixed>
        <Text style={{ fontSize: 8, color: '#9CA3AF' }}>Employee List Report</Text>
        <Text style={{ fontSize: 8, color: '#9CA3AF' }} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
      </View>
    </Page>
  </Document>
);

export default EmployeeListPDF;