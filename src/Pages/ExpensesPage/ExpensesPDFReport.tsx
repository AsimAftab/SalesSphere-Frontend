import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { type Expense } from '../../api/expensesService';
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
  
  // Table Structure
  tableContainer: {
    flexDirection: 'column',
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#197ADC', // Matches secondary theme color
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
    alignItems: 'center',
    minHeight: 24,
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
    minHeight: 24,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderLeftColor: '#E5E7EB',
    borderRightColor: '#E5E7EB',
  },
  rowEven: { backgroundColor: '#FFFFFF' },
  rowOdd: { backgroundColor: '#FAFAFA' },
  
  // Cell Styling
  cellHeader: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#FFFFFF',
    paddingHorizontal: 3,
    paddingVertical: 4,
    textAlign: 'left',
  },
  cellText: {
    fontSize: 7,
    color: '#1F2937',
    paddingHorizontal: 3,
    paddingVertical: 4,
    textAlign: 'left',
    flexWrap: 'wrap',
  },
  textCenter: { textAlign: 'center' },
  statusPending: { color: '#F59E0B' },
  statusApproved: { color: '#10B981' },
  statusRejected: { color: '#EF4444' },
});

interface ExpensesPDFReportProps {
  data: Expense[];
}

const ExpensesPDFReport: React.FC<ExpensesPDFReportProps> = ({ data }) => (
  <Document>
    <Page size="A4" orientation="portrait" style={styles.page}>
      
      {/* Report Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.titleGroup}>
          <Text style={styles.title}>Expenses Report</Text>
          <Text style={styles.subTitle}>Summary of All Submitted Expenses</Text>
        </View>
        <View style={styles.reportInfo}>
            <Text style={styles.reportLabel}>Generated On</Text>
            <Text style={styles.reportValue}>{formatDisplayDate(new Date().toISOString())}</Text>
            <Text style={styles.reportLabel}>Total Records</Text>
            <Text style={styles.reportValue}>{data.length}</Text>
        </View>
      </View>

      {/* Main Table Section */}
      <View style={styles.tableContainer}>
        {/* Table Header Row */}
        <View style={styles.tableHeader} fixed>
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

          let statusStyle = styles.statusPending;
          if (exp.status === 'approved') statusStyle = styles.statusApproved;
          else if (exp.status === 'rejected') statusStyle = styles.statusRejected;

          return (
            <View style={[styles.tableRow, rowStyle]} key={exp.id || index} wrap={false}>
              
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
                <Text style={styles.cellText}>{exp.approvedBy?.name || 'Under Review'}</Text>
              </View>

              <View style={{ width: '11%' }}>
                 <Text style={[styles.cellText, statusStyle, { fontWeight: 'bold', textTransform: 'uppercase' }]}>
                 {exp.status}
                 </Text>
              </View>

            </View>
          );
        })}
      </View>

      {/* Footer */}
      <View style={{ position: 'absolute', bottom: 20, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} fixed>
        <Text style={{ fontSize: 8, color: '#9CA3AF' }}>Expenses Report</Text>
        <Text style={{ fontSize: 8, color: '#9CA3AF' }} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
      </View>
    </Page>
  </Document>
);

export default ExpensesPDFReport;