import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { type Expense } from '../../api/expensesService';

const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
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
  reportInfo: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  reportLabel: { fontSize: 8, color: '#6B7280' },
  reportValue: { fontSize: 10, color: '#111827', fontWeight: 'bold' },
  
  // Table Structure
  tableContainer: {
    flexDirection: 'column',
    width: '100%',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#197ADC', // Matches secondary theme color
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
    alignItems: 'center',
    minHeight: 24,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomColor: '#F3F4F6',
    borderBottomWidth: 1,
    alignItems: 'stretch',
    minHeight: 24,
  },
  rowEven: { backgroundColor: '#FFFFFF' },
  rowOdd: { backgroundColor: '#FAFAFA' },
  
  // Cell Styling
  cellHeader: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#FFFFFF',
    paddingHorizontal: 4,
    paddingVertical: 5,
    textAlign: 'left',
  },
  cellText: {
    fontSize: 8,
    color: '#1F2937',
    paddingHorizontal: 4,
    paddingVertical: 5,
    textAlign: 'left', // All fields left aligned
    flexWrap: 'wrap', 
  },
  textCenter: { textAlign: 'center' },
});

interface ExpensesPDFReportProps {
  data: Expense[];
}

const ExpensesPDFReport: React.FC<ExpensesPDFReportProps> = ({ data }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      
      {/* Report Header Section */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Expenses Report</Text>
        <View style={styles.reportInfo}>
            <Text style={styles.reportLabel}>Generated On</Text>
            <Text style={styles.reportValue}>{new Date().toLocaleDateString()}</Text>
            <Text style={styles.reportLabel}>Total Records</Text>
            <Text style={styles.reportValue}>{data.length}</Text>
        </View>
      </View>

      {/* Main Table Section */}
      <View style={styles.tableContainer}>
        {/* Table Header Row */}
        <View style={styles.tableHeader}>
          <View style={{ width: '5%' }}><Text style={[styles.cellHeader, styles.textCenter]}>S.No</Text></View>
          <View style={{ width: '20%' }}><Text style={styles.cellHeader}>Title</Text></View>
          <View style={{ width: '12%' }}><Text style={styles.cellHeader}>Amount</Text></View>
          <View style={{ width: '13%' }}><Text style={styles.cellHeader}>Incurred Date</Text></View>
          <View style={{ width: '15%' }}><Text style={styles.cellHeader}>Category</Text></View>
          <View style={{ width: '12%' }}><Text style={styles.cellHeader}>Submitted By</Text></View>
          <View style={{ width: '12%' }}><Text style={styles.cellHeader}>Reviewer</Text></View>
          <View style={{ width: '11%' }}><Text style={styles.cellHeader}>Status</Text></View>
        </View>

        {/* Dynamic Data Rows */}
        {data.map((exp, index) => {
          const rowStyle = index % 2 === 0 ? styles.rowEven : styles.rowOdd;
          return (
            <View style={[styles.tableRow, rowStyle]} key={exp.id || index}>
              
              <View style={{ width: '5%' }}>
                <Text style={[styles.cellText, styles.textCenter]}>{index + 1}</Text>
              </View>

              <View style={{ width: '20%' }}>
                <Text style={styles.cellText}>{exp.title}</Text>
              </View>

              <View style={{ width: '12%' }}>
                {/* Prefix changed to RS */}
                <Text style={styles.cellText}>RS {exp.amount.toLocaleString()}</Text>
              </View>

              <View style={{ width: '13%' }}>
                <Text style={styles.cellText}>{exp.incurredDate}</Text>
              </View>

              <View style={{ width: '15%' }}>
                <Text style={styles.cellText}>{exp.category}</Text>
              </View>

              <View style={{ width: '12%' }}>
                <Text style={styles.cellText}>{exp.createdBy.name}</Text>
              </View>

              <View style={{ width: '12%' }}>
                {/* Reviewer column included */}
                <Text style={styles.cellText}>{exp.approvedBy?.name || '—'}</Text>
              </View>

              <View style={{ width: '11%' }}>
                <Text style={styles.cellText}>{exp.status.toUpperCase()}</Text>
              </View>

            </View>
          );
        })}
      </View>
    </Page>
  </Document>
);

export default ExpensesPDFReport;