import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { formatDisplayDate, formatDateToLocalISO } from '@/utils/dateUtils';
import { PDF_FONT_FAMILY } from '@/utils/pdfFonts';

const styles = StyleSheet.create({
  page: { paddingTop: 20, paddingLeft: 20, paddingRight: 20, paddingBottom: 50, backgroundColor: '#FFFFFF', fontFamily: PDF_FONT_FAMILY },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#111827', paddingBottom: 10 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#111827', textTransform: 'uppercase' },
  titleGroup: { flexDirection: 'column' },
  subTitle: { fontSize: 10, color: '#6B7280', marginTop: 4, textTransform: 'uppercase' },
  reportInfo: { flexDirection: 'column', alignItems: 'flex-end' },
  reportLabel: { fontSize: 8, color: '#6B7280' },
  reportValue: { fontSize: 10, color: '#111827', fontWeight: 'bold' },
  tableContainer: { flexDirection: 'column', width: '100%' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#197ADC', borderBottomColor: '#E5E7EB', borderBottomWidth: 1, alignItems: 'center', height: 24, borderLeftWidth: 1, borderRightWidth: 1, borderTopWidth: 1, borderLeftColor: '#E5E7EB', borderRightColor: '#E5E7EB', borderTopColor: '#E5E7EB' },
  tableRow: { flexDirection: 'row', borderBottomColor: '#F3F4F6', borderBottomWidth: 1, alignItems: 'stretch', minHeight: 24, borderLeftWidth: 1, borderRightWidth: 1, borderLeftColor: '#E5E7EB', borderRightColor: '#E5E7EB' },
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
    <Page size="A4" orientation="portrait" style={styles.page}>

      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.titleGroup}>
          <Text style={styles.title}>Estimate List Report</Text>
          <Text style={styles.subTitle}>Overview of All Estimates</Text>
        </View>
        <View style={styles.reportInfo}>
          <Text style={styles.reportLabel}>Generated On</Text>
          <Text style={styles.reportValue}>{formatDisplayDate(new Date().toISOString())}</Text>
          <Text style={styles.reportLabel}>Total Estimates</Text>
          <Text style={styles.reportValue}>{estimates.length}</Text>
        </View>
      </View>

      {/* Table */}
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader} fixed>
          <View style={{ width: '5%' }}><Text style={[styles.cellHeader, styles.textCenter]}>S.No</Text></View>
          <View style={{ width: '20%' }}><Text style={styles.cellHeader}>Estimate Number</Text></View>
          <View style={{ width: '25%' }}><Text style={styles.cellHeader}>Party Name</Text></View>
          <View style={{ width: '20%' }}><Text style={styles.cellHeader}>Created By</Text></View>
          <View style={{ width: '15%' }}><Text style={styles.cellHeader}>Created Date</Text></View>
          <View style={{ width: '15%' }}><Text style={styles.cellHeader}>Total Amount</Text></View>
        </View>

        {estimates.map((item, index) => (
          <View style={[styles.tableRow, index % 2 === 0 ? styles.rowEven : styles.rowOdd]} key={item.id} wrap={false}>
            <View style={{ width: '5%' }}><Text style={[styles.cellText, styles.textCenter]}>{index + 1}</Text></View>
            <View style={{ width: '20%' }}><Text style={styles.cellText}>{item.estimateNumber}</Text></View>
            <View style={{ width: '25%' }}><Text style={styles.cellText}>{item.partyName}</Text></View>
            <View style={{ width: '20%' }}><Text style={styles.cellText}>{item.createdBy?.name || '-'}</Text></View>
            <View style={{ width: '15%' }}><Text style={styles.cellText}>{formatDateToLocalISO(new Date(item.dateTime))}</Text></View>
            <View style={{ width: '15%' }}><Text style={styles.cellText}>RS {item.totalAmount.toLocaleString()}</Text></View>
          </View>
        ))}
      </View>

      <View style={{ position: 'absolute', bottom: 20, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} fixed>
        <Text style={{ fontSize: 8, color: '#9CA3AF' }}>Estimate List Report</Text>
        <Text style={{ fontSize: 8, color: '#9CA3AF' }} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
      </View>
    </Page>
  </Document>
);

export default EstimateListPDF;