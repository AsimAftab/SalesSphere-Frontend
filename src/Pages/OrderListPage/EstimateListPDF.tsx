import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 20, backgroundColor: '#FFFFFF', fontFamily: 'Helvetica' },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#111827', paddingBottom: 10 },
  title: { fontSize: 20, fontWeight: 'heavy', color: '#111827', textTransform: 'uppercase' },
  reportInfo: { flexDirection: 'column', alignItems: 'flex-end' },
  reportLabel: { fontSize: 8, color: '#6B7280' },
  reportValue: { fontSize: 10, color: '#111827', fontWeight: 'bold' },
  tableContainer: { flexDirection: 'column', width: '100%', borderColor: '#E5E7EB', borderWidth: 1, borderRadius: 2 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#197ADC', borderBottomColor: '#E5E7EB', borderBottomWidth: 1, alignItems: 'center', height: 24 },
  tableRow: { flexDirection: 'row', borderBottomColor: '#F3F4F6', borderBottomWidth: 1, alignItems: 'stretch', minHeight: 24 },
  rowEven: { backgroundColor: '#FFFFFF' },
  rowOdd: { backgroundColor: '#FAFAFA' },
  cellHeader: { fontSize: 7, fontWeight: 'bold', color: '#FFFFFF', paddingHorizontal: 4, paddingVertical: 5, textAlign: 'left' },
  cellText: { fontSize: 7, color: '#1F2937', paddingHorizontal: 4, paddingVertical: 4, textAlign: 'left' },
  textCenter: { textAlign: 'center' },
});

interface Estimate {
  id: string;
  estimateNumber: string;
  partyName: string;
  totalAmount: number;
  dateTime: string;
  createdBy: { name: string };
}

interface EstimateListPDFProps {
  estimates: Estimate[];
}

const EstimateListPDF: React.FC<EstimateListPDFProps> = ({ estimates }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Estimate List</Text>
        <View style={styles.reportInfo}>
            <Text style={styles.reportLabel}>Generated On</Text>
            <Text style={styles.reportValue}>{new Date().toLocaleDateString()}</Text>
            <Text style={styles.reportLabel}>Total Estimates</Text>
            <Text style={styles.reportValue}>{estimates.length}</Text>
        </View>
      </View>

      {/* Table */}
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <View style={{ width: '5%' }}><Text style={[styles.cellHeader, styles.textCenter]}>S.No</Text></View>
          <View style={{ width: '20%' }}><Text style={styles.cellHeader}>Estimate Number</Text></View>
          <View style={{ width: '25%' }}><Text style={styles.cellHeader}>Party Name</Text></View>
          <View style={{ width: '20%' }}><Text style={styles.cellHeader}>Created By</Text></View>
          <View style={{ width: '15%' }}><Text style={styles.cellHeader}>Created Date</Text></View>
          <View style={{ width: '15%' }}><Text style={styles.cellHeader}>Total Amount</Text></View>
        </View>

        {estimates.map((item, index) => (
          <View style={[styles.tableRow, index % 2 === 0 ? styles.rowEven : styles.rowOdd]} key={item.id}>
            <View style={{ width: '5%' }}><Text style={[styles.cellText, styles.textCenter]}>{index + 1}</Text></View>
            <View style={{ width: '20%' }}><Text style={styles.cellText}>{item.estimateNumber}</Text></View>
            <View style={{ width: '25%' }}><Text style={styles.cellText}>{item.partyName}</Text></View>
            <View style={{ width: '20%' }}><Text style={styles.cellText}>{item.createdBy?.name || '-'}</Text></View>
            <View style={{ width: '15%' }}><Text style={styles.cellText}>{new Date(item.dateTime).toLocaleDateString()}</Text></View>
            <View style={{ width: '15%' }}><Text style={styles.cellText}>RS {item.totalAmount.toLocaleString()}</Text></View>
          </View>
        ))}
      </View>

      <Text
        style={{ position: 'absolute', bottom: 20, left: 0, right: 0, textAlign: 'center', fontSize: 8, color: '#9CA3AF' }}
        render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
        fixed
      />
    </Page>
  </Document>
);

export default EstimateListPDF;