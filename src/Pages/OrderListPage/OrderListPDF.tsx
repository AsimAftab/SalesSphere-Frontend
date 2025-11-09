import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// --- Define types ---
interface Order {
  id: string;
  invoiceNumber: string;
  partyName: string;
  dateTime: string;
  totalAmount: number;
  status: string;
}

interface OrderListPDFProps {
  orders: Order[];
}

// --- Styles ---
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 10,
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#111827',
  },
  tableContainer: {
    display: 'flex',
    alignItems: 'center', // ✅ Center table horizontally
  },
  table: {
    display: 'flex',
    width: '90%',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 6,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
    fontFamily: 'Helvetica-Bold',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  headerCell: {
    paddingVertical: 8,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  bodyRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  bodyCell: {
    paddingVertical: 8,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#111827',
    borderRightWidth: 1,
    borderRightColor: '#000',
    display: 'flex',
    alignItems: 'center',
  },
  oddRow: {
    backgroundColor: '#F9FAFB',
  },
  colSno: { width: '7%' },
  colInvoice: { width: '18%' },
  colPartyName: { width: '22%' },
  colDate: { width: '22%' },
  colTotal: { width: '15%' },
  colStatus: {
    width: '16%',
    borderRightWidth: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ✅ Centered status text with no extra padding mismatch
  statusText: {
    textAlign: 'center',
    fontSize: 10,
    textTransform: 'capitalize',
  },

  // --- Status Colors ---
  // --- Status Colors ---
statusCompleted: { color: '#16A34A' }, 
statusPending: { color: '#2563EB' },   
statusTransit: { color: '#F97316' },   
statusRejected: { color: '#DC2626' }, 
statusProgress: { color: '#7C3AED' },  


  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 10,
    color: 'grey',
  },
});

// --- Helper ---
const formatDateTime = (dateTime: string) => {
  try {
    const date = new Date(dateTime);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateTime;
  }
};

// --- Component ---
const OrderListPDF: React.FC<OrderListPDFProps> = ({ orders }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <Text style={styles.title}>Order List</Text>

      <View style={styles.tableContainer}>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.headerRow}>
            <Text style={[styles.headerCell, styles.colSno]}>S.No.</Text>
            <Text style={[styles.headerCell, styles.colInvoice]}>Invoice</Text>
            <Text style={[styles.headerCell, styles.colPartyName]}>Party Name</Text>
            <Text style={[styles.headerCell, styles.colDate]}>Expected Delivery Date</Text>
            <Text style={[styles.headerCell, styles.colTotal]}>Total</Text>
            <Text style={[styles.headerCell, styles.colStatus, { borderRightWidth: 0 }]}>
              Status
            </Text>
          </View>

          {/* Table Body */}
          {orders.map((order, index) => (
            <View
              key={order.id}
              style={[
                styles.bodyRow
              ]}
            >
              <Text style={[styles.bodyCell, styles.colSno]}>{index + 1}</Text>
              <Text style={[styles.bodyCell, styles.colInvoice]}>{order.invoiceNumber}</Text>
              <Text style={[styles.bodyCell, styles.colPartyName]}>{order.partyName}</Text>
              <Text style={[styles.bodyCell, styles.colDate]}>
                {formatDateTime(order.dateTime)}
              </Text>
              <Text style={[styles.bodyCell, styles.colTotal]}>RS {order.totalAmount}</Text>

              {/* ✅ Centered and colored Status */}
              <View style={[styles.bodyCell, styles.colStatus]}>
                <Text
                  style={[
                    styles.statusText,
                    order.status.toLowerCase() === 'completed'
                      ? styles.statusCompleted
                      : order.status.toLowerCase() === 'in transit'
                      ? styles.statusTransit
                      : order.status.toLowerCase() === 'in progress'
                      ? styles.statusProgress
                      : order.status.toLowerCase() === 'pending'
                      ? styles.statusPending
                      : styles.statusRejected,
                  ]}
                >
                  {order.status}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <Text
        style={styles.footer}
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        fixed
      />
    </Page>
  </Document>
);

export default OrderListPDF;
