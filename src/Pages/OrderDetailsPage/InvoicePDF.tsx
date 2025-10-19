import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { type InvoiceData } from '../../api/orderService';

// --- STYLES ---
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    padding: 30,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
  },
  pageBorder: {
    position: 'absolute',
    top: 15,
    left: 15,
    right: 15,
    bottom: 15,
    border: '2px solid #333333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 15,
    marginBottom: 15,
    borderBottom: '1px solid #E5E7EB',
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 10,
    color: '#6B7280',
  },
  dateInfo: {
    textAlign: 'right',
  },
  dateLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  addressSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottom: '1px solid #E5E7EB',
  },
  addressBlock: {
    width: '45%',
  },
  addressHeader: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  addressName: {
    fontWeight: 'bold',
  },
  addressText: {
    fontSize: 10,
    color: '#374151',
  },
  table: {
    width: '100%',
    border: '1px solid #E5E7EB',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderBottom: '1px solid #E5E7EB',
  },
  tableHeaderCell: {
    padding: 8,
    fontSize: 10,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #E5E7EB',
  },
  tableCell: {
    padding: 8,
  },
  tableCellSno: {
    width: '10%',
    textAlign: 'center',
  },
  tableCellDesc: {
    width: '40%',
  },
  tableCellQty: {
    width: '15%',
    textAlign: 'center',
  },
  tableCellRate: {
    width: '15%',
    textAlign: 'right',
  },
  tableCellAmount: {
    width: '20%',
    textAlign: 'right',
  },
  itemDesc: {
    fontWeight: 'bold',
  },
  itemDetail: {
    fontSize: 9,
    color: '#6B7280',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  totalContainer: {
    width: '40%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 8,
    borderTop: '1px solid #374151',
  },
  footer: {
    textAlign: 'center',
    marginTop: 30,
  },
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

interface InvoicePDFProps {
  data: InvoiceData;
  orderId?: string;
}

const InvoicePDF: React.FC<InvoicePDFProps> = ({ data, orderId }) => {
  const totalAmount = data.items.reduce((sum, item) => sum + (item.qty * item.rate), 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.pageBorder} fixed />

        <View style={styles.header} fixed>
          <View style={styles.headerInfo}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Order Details</Text>
              <Text style={styles.subtitle}>ORDER-{orderId}</Text>
            </View>
          </View>
          <View style={styles.dateInfo}>
            <Text style={styles.dateLabel}>Issue Date</Text>
            <Text>{data.issueDate}</Text>
          </View>
        </View>

        <View style={styles.addressSection}>
            <View style={styles.addressBlock}>
                <Text style={styles.addressHeader}>From</Text>
                <Text style={styles.addressName}>{data.from.name}</Text>
                <Text style={styles.addressText}>{data.from.address}</Text>
                <Text style={styles.addressText}>{data.from.phone}</Text>
            </View>
            <View style={styles.addressBlock}>
                <Text style={styles.addressHeader}>Bill To</Text>
                <Text style={styles.addressName}>{data.to.name}</Text>
                <Text style={styles.addressText}>{data.to.address}</Text>
                <Text style={styles.addressText}>{data.to.phone}</Text>
            </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader} fixed>
            <Text style={[styles.tableHeaderCell, styles.tableCellSno]}>S. No.</Text>
            <Text style={[styles.tableHeaderCell, styles.tableCellDesc]}>Description</Text>
            <Text style={[styles.tableHeaderCell, styles.tableCellQty]}>Qty</Text>
            <Text style={[styles.tableHeaderCell, styles.tableCellRate]}>Rate</Text>
            <Text style={[styles.tableHeaderCell, styles.tableCellAmount]}>Amount</Text>
          </View>

          {data.items.map((item, index) => (
            <View style={styles.tableRow} key={index} wrap={false}>
              <Text style={[styles.tableCell, styles.tableCellSno]}>{index + 1}</Text>
              <View style={[styles.tableCell, styles.tableCellDesc]}>
                <Text style={styles.itemDesc}>{item.desc}</Text>
                <Text style={styles.itemDetail}>{item.detail}</Text>
              </View>
              <Text style={[styles.tableCell, styles.tableCellQty]}>{item.qty}</Text>
              <Text style={[styles.tableCell, styles.tableCellRate]}>${item.rate.toFixed(2)}</Text>
              <Text style={[styles.tableCell, styles.tableCellAmount]}>${(item.qty * item.rate).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalSection}>
            <View style={styles.totalContainer}>
                <Text style={{fontWeight: 'bold'}}>Total Amount:</Text>
                <Text style={{fontWeight: 'bold'}}>${totalAmount.toFixed(2)}</Text>
            </View>
        </View>
        <View style={styles.footer}>
            <Text>Thank you for your business!</Text>
        </View>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `${pageNumber} / ${totalPages}`
        )} fixed />
      </Page>
    </Document>
  );
};

export default InvoicePDF;