import React from 'react';
import { Page, Text, View, Document, StyleSheet} from '@react-pdf/renderer';
import { type InvoiceData, type InvoiceItem } from '../../api/orderService';

// --- Define Colors ---
const colors = {
  primary: '#197ADC', // Your new blue header color
  white: '#FFFFFF',
  textDark: '#111827',
  textLight: '#4B5563',
  border: '#E5E7EB',
  bgLight: '#F9FAFB',
  status: {
    completed: '#28A745', // Green
    pending: '#3B82F6',   // Blue
    'in progress': '#8B5CF6', // VIOLET
    'in transit': '#F59E0B', // Orange
    rejected: '#EF4444',   // Red
  },
  deliveryBorder: '#F59E0B',
  deliveryBg: '#FFFBEB',
};

// --- Define Styles ---
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: 30,
    flexDirection: 'column',
    backgroundColor: colors.white,
  },
  header: {
    backgroundColor: colors.primary,
    color: colors.white,
    paddingVertical: 20,
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderRadius: 6,
  },
  headerLeft: {
    flexDirection: 'column',
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: 'Helvetica-Bold',
    color: colors.white,
    marginBottom: 4,
  },
  headerInvoiceId: {
    fontSize: 14,
    color: colors.white,
  },
  headerRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  headerDate: {
    color: colors.white,
    fontSize: 10,
    marginTop: 10,
  },
  statusBadge: {
    color: colors.white,
    padding: '4px 8px',
    borderRadius: 4,
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  fromToContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  addressBox: {
    width: '48%',
    padding: 10,
    border: `1px solid ${colors.border}`,
    borderRadius: 5,
  },
  addressTitle: {
    fontSize: 9,
    color: colors.primary,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 5,
  },
  addressName: {
    fontSize: 12,
    color: colors.textDark,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4, 
  },
  addressText: {
    fontSize: 9,
    color: colors.textLight,
    lineHeight: 1.4,
    marginTop: 3, 
  },
  deliveryDateWrapper: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  deliveryDateBox: {
    backgroundColor: colors.deliveryBg,
    border: `1px solid ${colors.deliveryBorder}`,
    borderRadius: 5,
    padding: 10,
  },
  deliveryDateLabel: {
    fontSize: 9,
    color: colors.textLight,
    marginBottom: 5, // Spacing fix
  },
  deliveryDate: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: colors.deliveryBorder, // Orange text
  },
  tableWrapper: {
    marginTop: 20,
    border: `1px solid ${colors.border}`,
    borderRadius: 5,
    overflow: 'hidden',
  },
  table: {
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    color: colors.white,
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: `1px solid ${colors.border}`,
    backgroundColor: colors.white,
  },
  tableHeaderCell: {
    padding: 8,
    color: colors.white,
    borderRightWidth: 1, // <-- FIX: Add border
    borderRightColor: colors.white, // <-- FIX: Set border color
  },
  // MODIFIED: Added vertical divider style
  tableCell: {
    padding: 8,
    fontSize: 10,
    color: colors.textLight,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  // Column widths
  colSno: { width: '8%' },
  colDesc: { width: '42%' },
  colQty: { width: '12%' },
  colPrice: { width: '20%' },
  // MODIFIED: Removed vertical divider from last column
  colAmt: { 
    width: '18%',
    borderRightWidth: 0,
  },
  alignRight: { textAlign: 'right' }, // This style is no longer used in the table
  totalsContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  totalsBox: {
    width: '40%',
    border: `1px solid ${colors.border}`,
    borderRadius: 5,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
  },
  totalsRowTotal: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: 8,
  backgroundColor: colors.bgLight,
  borderTopWidth: 1, // <-- FIX
  borderTopColor: colors.border, // <-- FIX
  marginTop: 4, // <-- FIX
  paddingTop: 8, // <-- FIX
},
  totalsLabel: {
    fontSize: 10,
    color: colors.textLight,
  },
  totalsValue: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: colors.textDark,
  },
  totalsTotalLabel: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: colors.primary,
  },
  totalsTotalValue: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: colors.primary,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
  },
  footerThankYou: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: colors.primary,
  },
  footerNote: {
    marginTop: 5,
    fontSize: 9,
    color: colors.textLight,
  },
});

// --- Helper Functions (No Changes) ---
const formatDate = (dateStr: string) => {
  if (!dateStr) return 'N/A';
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch { return dateStr; }
};
const formatDeliveryDate = (dateStr: string) => {
  if (!dateStr) return 'N/A';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: '2-digit',
      year: 'numeric'
    });
  } catch { return dateStr; }
};
const formatCurrency = (amount: number) => {
  return `Rs. ${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
const getStatusColor = (status: InvoiceData['status']) => {
  return colors.status[status] || colors.status.pending;
};

// --- PDF Component Props ---
interface InvoiceDetailPDFProps {
  invoice: InvoiceData;
}

// --- The PDF Document Component (MODIFIED) ---
const InvoiceDetailPDF: React.FC<InvoiceDetailPDFProps> = ({ invoice }) => {
  const statusColor = getStatusColor(invoice.status);
  const discountPercent = ((invoice.discount / invoice.subtotal) * 100 || 0).toFixed(1);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* --- Header --- */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>INVOICE</Text>
            <Text style={styles.headerInvoiceId}>{invoice.invoiceNumber}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              {invoice.status.toUpperCase()}
            </Text>
            <Text style={styles.headerDate}>Date: {formatDate(invoice.createdAt)}</Text>
          </View>
        </View>

        {/* --- From/To Info --- */}
        <View style={styles.fromToContainer}>
          <View style={styles.addressBox}>
            <Text style={styles.addressTitle}>FROM</Text>
            <Text style={styles.addressName}>{invoice.organizationName}</Text>
            <Text style={styles.addressText}>{invoice.organizationAddress}</Text>
            <Text style={styles.addressText}>Phone: {invoice.organizationPhone}</Text>
            <Text style={styles.addressText}>PAN/VAT: {invoice.organizationPanVatNumber}</Text>
          </View>

          <View style={styles.addressBox}>
            <Text style={styles.addressTitle}>TO</Text>
            <Text style={styles.addressName}>{invoice.partyName}</Text>
            {/* MODIFIED: Re-ordered fields to match design */}
            <Text style={styles.addressText}>{invoice.partyAddress}</Text>
            <Text style={styles.addressText}>PAN/VAT: {invoice.partyPanVatNumber}</Text>
            <Text style={styles.addressText}>Owner: {invoice.partyOwnerName}</Text>
          </View>
        </View>

        {/* --- Delivery Date --- */}
        <View style={styles.deliveryDateWrapper}>
          <View style={styles.deliveryDateBox}>
            <Text style={styles.deliveryDateLabel}>Expected Delivery Date</Text>
            <Text style={styles.deliveryDate}>
              {formatDeliveryDate(invoice.expectedDeliveryDate)}
            </Text>
          </View>
        </View>

        {/* --- Items Table --- */}
        <View style={styles.tableWrapper}>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader} fixed>
              {/* MODIFIED: Changed # to SN and removed alignRight */}
              <Text style={[styles.tableHeaderCell, styles.colSno]}>SN</Text>
              <Text style={[styles.tableHeaderCell, styles.colDesc]}>Item Description</Text>
              <Text style={[styles.tableHeaderCell, styles.colQty]}>Quantity</Text>
              <Text style={[styles.tableHeaderCell, styles.colPrice]}>Unit Price</Text>
              <Text style={[styles.tableHeaderCell, styles.colAmt]}>Amount</Text>
            </View>
            {/* Table Body */}
            {invoice.items.map((item: InvoiceItem, index) => (
              <View style={styles.tableRow} key={item.productId} wrap={false}>
                {/* MODIFIED: Removed alignRight from all cells */}
                <Text style={[styles.tableCell, styles.colSno]}>{index + 1}</Text>
                <Text style={[styles.tableCell, styles.colDesc]}>{item.productName}</Text>
                <Text style={[styles.tableCell, styles.colQty]}>{item.quantity}</Text>
                <Text style={[styles.tableCell, styles.colPrice]}>
                  {formatCurrency(item.price)}
                </Text>
                <Text style={[styles.tableCell, styles.colAmt]}>
                  {formatCurrency(item.total)}
                </Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* --- Summary --- */}
       
        <View style={styles.totalsContainer}>
          <View style={styles.totalsBox}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Subtotal</Text>
              <Text style={styles.totalsValue}>{formatCurrency(invoice.subtotal)}</Text>
            </View>

            {/* MODIFIED: Conditionally render discount */}
            {invoice.discount > 0 && (
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>Discount ({discountPercent}%)</Text>
                <Text style={styles.totalsValue}>-{formatCurrency(invoice.discount)}</Text>
              </View>
            )}

            <View style={styles.totalsRowTotal}>
              <Text style={styles.totalsTotalLabel}>TOTAL</Text>
              <Text style={styles.totalsTotalValue}>{formatCurrency(invoice.totalAmount)}</Text>
            </View>
          </View>
        </View>

        {/* --- Footer --- */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerThankYou}>Thank you for your business!</Text>
          <Text style={styles.footerNote}>
            This is a computer-generated invoice and does not require a signature.
          </Text>
          <Text style={styles.footerNote}>Generated by SalesSphere</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoiceDetailPDF;