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
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#002244', // Dark blue header to match your theme
    color: '#FFFFFF',
    padding: 5,
    fontFamily: 'Helvetica-Bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #E5E5E5',
    padding: 5,
  },
  colSno: { width: '8%' },
  colId: { width: '12%' },
  colParty: { width: '25%' },
  colAddress: { width: '30%' },
  colStatus: { width: '25%' },
  pageNumber: {
    position: 'absolute',
    fontSize: 10,
    bottom: 30,
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
          <Text style={styles.colSno}>S.No.</Text>
          <Text style={styles.colId}>ID</Text>
          <Text style={styles.colParty}>Party Name</Text>
          <Text style={styles.colAddress}>Address</Text>
          <Text style={styles.colStatus}>Status</Text>
        </View>

        {/* Table Body */}
        {orders.map((order, index) => (
          <View style={styles.tableRow} key={order.id} wrap={false}>
            <Text style={styles.colSno}>{index + 1}</Text>
            <Text style={styles.colId}>{order.id}</Text>
            <Text style={styles.colParty}>{order.partyName}</Text>
            <Text style={styles.colAddress}>{order.address}</Text>
            <Text style={styles.colStatus}>{order.status}</Text>
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
