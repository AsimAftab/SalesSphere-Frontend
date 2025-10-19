import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Define the type for a single order, matching your data structure
interface Order {
  id: string;
  partyName: string;
  address: string;
  dateTime: string;
  status: string;
}

interface OrderListPDFProps {
  orders: Order[];
}

// --- EDITED: Styles updated for a robust multi-page grid layout ---
const styles = StyleSheet.create({
  page: {
  padding: 30,
  fontFamily: 'Helvetica',
  fontSize: 10,
  },
  title: {
  fontSize: 24,
  textAlign: 'center',
  marginBottom: 20,
  fontFamily: 'Helvetica-Bold',
   },
  table: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 10,
  },
    tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#3B82F6',
    color: '#FFFFFF',
    fontFamily: 'Helvetica-Bold',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderTopWidth: 0, // This prevents double borders between rows
  },
  // A generic style for padding
  tableCell: {
    padding: 5,
  },
  tableHeaderCell: {
    color: '#FFFFFF',
    padding: 5,
  },
  // Column styles now include their right border to create vertical lines
  colSno: { width: '5%', textAlign: 'center', borderRight: '1px solid #E5E5E5' },
  colId: { width: '10%', borderRight: '1px solid #E5E5E5' },
  colPartyName: { width: '30%', textAlign: 'center', borderRight: '1px solid #E5E5E5' },
  colAddress: { width: '35%', textAlign: 'center', borderRight: '1px solid #E5E5E5' },
  // The last column does not need a right border
  colStatus: { width: '20%', textAlign: 'center' },
    pageNumber: {
    position: 'absolute',
    fontSize: 10,
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
});

const OrderListPDF: React.FC<OrderListPDFProps> = ({ orders }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Order List</Text>
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableHeader} fixed>
          <Text style={[styles.colSno, styles.tableHeaderCell]}>S.No.</Text>
          <Text style={[styles.colId, styles.tableHeaderCell]}>ID</Text>
          <Text style={[styles.colPartyName, styles.tableHeaderCell]}>Party Name</Text>
          <Text style={[styles.colAddress, styles.tableHeaderCell]}>Address</Text>
          {/* Last header cell has no right border */}
        <Text style={[styles.colStatus, styles.tableHeaderCell, { borderRightWidth: 0 }]}>Status</Text>
      </View>

        {/* Table Body */}
        {orders.map((order, index) => (
        <View style={[styles.tableRow, index === orders.length - 1 ? {borderBottomWidth: 1} : {}]} key={order.id} wrap={false}>
            <Text style={[styles.colSno, styles.tableCell]}>{index + 1}</Text>
            <Text style={[styles.colId, styles.tableCell]}>{order.id}</Text>
            <Text style={[styles.colPartyName, styles.tableCell]}>{order.partyName}</Text>
            <Text style={[styles.colAddress, styles.tableCell]}>{order.address}</Text>
            {/* Last body cell has no right border */}
          <Text style={[styles.colStatus, styles.tableCell, { borderRightWidth: 0 }]}>{order.status}</Text>
        </View>
        ))}
      </View>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
     `${pageNumber} / ${totalPages}`
     )} fixed />
    </Page>
  </Document>
);

export default OrderListPDF;
