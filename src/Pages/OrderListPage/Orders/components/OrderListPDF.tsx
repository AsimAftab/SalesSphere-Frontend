import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { formatDisplayDate } from '../../../../utils/dateUtils';
import { PDF_FONT_FAMILY } from '../../../../utils/pdfFonts';

// Exact styles from ProspectListPDF for consistency
const styles = StyleSheet.create({
  page: { padding: 20, backgroundColor: '#FFFFFF', fontFamily: PDF_FONT_FAMILY },
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

interface Order {
  id: string;
  _id?: string;
  invoiceNumber: string;
  partyName: string;
  dateTime: string;
  totalAmount: number;
  status: string;
  createdBy?: { name: string };
  expectedDeliveryDate?: string;
}

interface OrderListPDFProps {
  orders: Order[];
}

const OrderListPDF: React.FC<OrderListPDFProps> = ({ orders }) => (
  <Document>
    <Page size="A4" orientation="portrait" style={styles.page}>

      {/* Header - Identical to Prospect List */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Order List</Text>
        <View style={styles.reportInfo}>
          <Text style={styles.reportLabel}>Generated On</Text>
          <Text style={styles.reportValue}>{formatDisplayDate(new Date().toISOString())}</Text>
          <Text style={styles.reportLabel}>Total Orders</Text>
          <Text style={styles.reportValue}>{orders.length}</Text>
        </View>
      </View>

      {/* Table */}
      <View style={styles.tableContainer}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <View style={{ width: '5%' }}><Text style={[styles.cellHeader, styles.textCenter]}>S.No</Text></View>
          <View style={{ width: '15%' }}><Text style={styles.cellHeader}>Invoice Number</Text></View>
          <View style={{ width: '20%' }}><Text style={styles.cellHeader}>Party Name</Text></View>
          <View style={{ width: '15%' }}><Text style={styles.cellHeader}>Created By</Text></View>
          <View style={{ width: '15%' }}><Text style={styles.cellHeader}>Delivery Date</Text></View>
          <View style={{ width: '15%' }}><Text style={styles.cellHeader}>Total Amount</Text></View>
          <View style={{ width: '15%' }}><Text style={styles.cellHeader}>Status</Text></View>
        </View>

        {/* Table Body */}
        {orders.map((order, index) => {
          const rowStyle = index % 2 === 0 ? styles.rowEven : styles.rowOdd;

          return (
            <View style={[styles.tableRow, rowStyle]} key={order._id || order.id || index}>
              <View style={{ width: '5%' }}>
                <Text style={[styles.cellText, styles.textCenter]}>{index + 1}</Text>
              </View>

              <View style={{ width: '15%' }}>
                <Text style={styles.cellText}>{order.invoiceNumber || 'N/A'}</Text>
              </View>

              <View style={{ width: '20%' }}>
                <Text style={styles.cellText}>{order.partyName || 'N/A'}</Text>
              </View>

              <View style={{ width: '15%' }}>
                <Text style={styles.cellText}>{order.createdBy?.name || '-'}</Text>
              </View>

              <View style={{ width: '15%' }}>
                <Text style={styles.cellText}>
                  {order.expectedDeliveryDate
                    ? new Date(order.expectedDeliveryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                    : '-'}
                </Text>
              </View>

              <View style={{ width: '15%' }}>
                <Text style={styles.cellText}>RS {order.totalAmount?.toLocaleString()}</Text>
              </View>

              <View style={{ width: '15%' }}>
                <Text style={[styles.cellText, { textTransform: 'uppercase', fontWeight: 'bold' }]}>
                  {order.status}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Footer Page Numbering */}
      <Text
        style={{
          position: 'absolute',
          bottom: 20,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: 8,
          color: '#9CA3AF'
        }}
        render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
        fixed
      />
    </Page>
  </Document>
);

export default OrderListPDF;