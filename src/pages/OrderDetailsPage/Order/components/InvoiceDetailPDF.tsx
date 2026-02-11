import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { type InvoiceData, type InvoiceItem } from '@/api/orderService';
import { PDF_FONT_FAMILY } from '@/utils/pdfFonts';

// --- Define Colors ---
const colors = {
  primary: '#197ADC',
  white: '#FFFFFF',
  textDark: '#111827',
  textLight: '#4B5563',
  border: '#E5E7EB',
  bgLight: '#F9FAFB',
  danger: '#EF4444', // Added red for discount
  status: {
    completed: '#28A745',
    pending: '#3B82F6',
    'in progress': '#8B5CF6',
    'in transit': '#F59E0B',
    rejected: '#EF4444',
  },
  deliveryBorder: '#F59E0B',
  deliveryBg: '#FFFBEB',
};

// --- Define Styles ---
const styles = StyleSheet.create({
  page: {
    fontFamily: PDF_FONT_FAMILY,
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
  headerLeft: { flexDirection: 'column' },
  headerTitle: {
    fontSize: 32,
    fontFamily: PDF_FONT_FAMILY, fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  headerInvoiceId: { fontSize: 14, color: colors.white },
  headerRight: { flexDirection: 'column', alignItems: 'flex-end' },
  headerDate: { color: colors.white, fontSize: 10, marginTop: 10 },
  statusBadge: {
    color: colors.white,
    padding: '4px 8px',
    borderRadius: 4,
    fontSize: 10,
    fontFamily: PDF_FONT_FAMILY, fontWeight: 'bold',
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
    fontFamily: PDF_FONT_FAMILY, fontWeight: 'bold',
    marginBottom: 5,
  },
  addressName: {
    fontSize: 12,
    color: colors.textDark,
    fontFamily: PDF_FONT_FAMILY, fontWeight: 'bold',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 9,
    color: colors.textLight,
    lineHeight: 1.4,
    marginTop: 3,
  },
  deliveryDateWrapper: { marginTop: 20, flexDirection: 'row', alignItems: 'flex-start' },
  deliveryDateBox: {
    backgroundColor: colors.deliveryBg,
    border: `1px solid ${colors.deliveryBorder}`,
    borderRadius: 5,
    padding: 10,
  },
  deliveryDateLabel: { fontSize: 9, color: colors.textLight, marginBottom: 5 },
  deliveryDate: {
    fontSize: 12,
    fontFamily: PDF_FONT_FAMILY, fontWeight: 'bold',
    color: colors.deliveryBorder,
  },
  tableWrapper: {
    marginTop: 20,
  },
  table: { width: '100%' },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    fontFamily: PDF_FONT_FAMILY, fontWeight: 'bold',
    fontSize: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
    backgroundColor: colors.white,
    minHeight: 28,
  },
  tableHeaderCell: {
    padding: 8,
    color: colors.white,
    borderRightWidth: 1,
    borderRightColor: colors.white,
    textAlign: 'center',
  },
  tableCell: {
    padding: 8,
    fontSize: 9,
    color: colors.textLight,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  colSno: { width: '8%' },
  colDesc: { width: '30%', textAlign: 'left' },
  colQty: { width: '10%' },
  colPrice: { width: '18%' },
  colDisc: { width: '16%' },
  colAmt: { width: '18%' },

  totalsContainer: { marginTop: 20, flexDirection: 'row', justifyContent: 'flex-end' },
  totalsBox: { width: '45%', border: `1px solid ${colors.border}`, borderRadius: 5 },
  totalsRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 8 },
  totalsRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    backgroundColor: colors.bgLight,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalsLabel: { fontSize: 10, color: colors.textLight },
  totalsValue: { fontSize: 10, fontFamily: PDF_FONT_FAMILY, fontWeight: 'bold', color: colors.textDark },
  // Styles for the red discount text
  discountLabel: { fontSize: 10, color: colors.danger },
  discountValue: { fontSize: 10, fontFamily: PDF_FONT_FAMILY, fontWeight: 'bold', color: colors.danger },

  totalsTotalLabel: { fontSize: 12, fontFamily: PDF_FONT_FAMILY, fontWeight: 'bold', color: colors.primary },
  totalsTotalValue: { fontSize: 12, fontFamily: PDF_FONT_FAMILY, fontWeight: 'bold', color: colors.primary },
  footer: {
    position: 'absolute',
    bottom: 12,
    left: 30,
    right: 30,
    textAlign: 'center',
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    paddingTop: 5,
  },
  footerThankYou: { fontSize: 7, color: colors.textDark, fontWeight: 'bold' as const, marginBottom: 2 },
  footerNote: { fontSize: 6, color: colors.textLight, marginTop: 1 },
});

// --- Helpers ---
const formatDate = (dateStr: string) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatDeliveryDate = (dateStr: string) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: '2-digit', year: 'numeric' });
};

const formatCurrency = (amount: number) => {
  return `Rs. ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const getStatusColor = (status: InvoiceData['status']) => colors.status[status] || colors.status.pending;

// Invoice has delivery date section so fewer rows fit
const MAX_ROWS_WITH_SUMMARY = 10;

const InvoiceTableHeader = () => (
  <View style={styles.tableHeader}>
    <Text style={[styles.tableHeaderCell, styles.colSno]}>SN</Text>
    <Text style={[styles.tableHeaderCell, styles.colDesc]}>Item Description</Text>
    <Text style={[styles.tableHeaderCell, styles.colQty]}>Qty</Text>
    <Text style={[styles.tableHeaderCell, styles.colPrice]}>Unit Price</Text>
    <Text style={[styles.tableHeaderCell, styles.colDisc]}>Discount</Text>
    <Text style={[styles.tableHeaderCell, styles.colAmt]}>Amount</Text>
  </View>
);

const InvoiceTableRow = ({ item, index }: { item: InvoiceItem; index: number }) => (
  <View style={styles.tableRow} wrap={false}>
    <Text style={[styles.tableCell, styles.colSno]}>{index + 1}</Text>
    <Text style={[styles.tableCell, styles.colDesc]}>{item.productName}</Text>
    <Text style={[styles.tableCell, styles.colQty]}>{item.quantity}</Text>
    <Text style={[styles.tableCell, styles.colPrice]}>{formatCurrency(item.price)}</Text>
    <Text style={[styles.tableCell, styles.colDisc]}>
      {item.discount > 0 ? `${item.discount}%` : '-'}
    </Text>
    <Text style={[styles.tableCell, styles.colAmt]}>{formatCurrency(item.total)}</Text>
  </View>
);

interface InvoiceDetailPDFProps { invoice: InvoiceData; }

const InvoiceDetailPDF: React.FC<InvoiceDetailPDFProps> = ({ invoice }) => {
  const statusColor = getStatusColor(invoice.status);

  const globalDiscountPercentage = invoice.discount || 0;
  const globalDiscountAmount = (invoice.subtotal * globalDiscountPercentage) / 100;

  const totalItems = invoice.items.length;
  const firstPageCount = totalItems <= MAX_ROWS_WITH_SUMMARY ? totalItems : MAX_ROWS_WITH_SUMMARY;
  const firstPageItems = invoice.items.slice(0, firstPageCount);
  const remainingItems = invoice.items.slice(firstPageCount);
  const hasOverflow = remainingItems.length > 0;

  const Summary = () => (
    <View style={styles.totalsContainer} wrap={false}>
      <View style={styles.totalsBox}>
        <View style={styles.totalsRow}>
          <Text style={styles.totalsLabel}>Subtotal</Text>
          <Text style={styles.totalsValue}>{formatCurrency(invoice.subtotal)}</Text>
        </View>
        {globalDiscountPercentage > 0 && (
          <View style={styles.totalsRow}>
            <Text style={styles.discountLabel}>Discount ({globalDiscountPercentage}%)</Text>
            <Text style={styles.discountValue}>-{formatCurrency(globalDiscountAmount)}</Text>
          </View>
        )}
        <View style={styles.totalsRowTotal}>
          <Text style={styles.totalsTotalLabel}>TOTAL</Text>
          <Text style={styles.totalsTotalValue}>{formatCurrency(invoice.totalAmount)}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <Document>
      {/* Page 1 */}
      <Page size="A4" style={styles.page}>
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
            <Text style={styles.addressText}>{invoice.partyAddress}</Text>
            <Text style={styles.addressText}>PAN/VAT: {invoice.partyPanVatNumber}</Text>
            <Text style={styles.addressText}>Owner: {invoice.partyOwnerName}</Text>
          </View>
        </View>

        <View style={styles.deliveryDateWrapper}>
          <View style={styles.deliveryDateBox}>
            <Text style={styles.deliveryDateLabel}>Expected Delivery Date</Text>
            <Text style={styles.deliveryDate}>{formatDeliveryDate(invoice.expectedDeliveryDate)}</Text>
          </View>
        </View>

        <View style={styles.tableWrapper}>
          <View style={styles.table}>
            <InvoiceTableHeader />
            {firstPageItems.map((item, index) => (
              <InvoiceTableRow key={item.productId} item={item} index={index} />
            ))}
          </View>
        </View>

        {!hasOverflow && <Summary />}

        <View style={styles.footer} fixed>
          <Text style={styles.footerNote}>Computer-generated invoice. Does not require a signature. | Generated by SalesSphere</Text>
        </View>
      </Page>

      {/* Page 2+: Remaining rows + Summary */}
      {hasOverflow && (
        <Page size="A4" style={styles.page}>
          <View style={styles.tableWrapper}>
            <View style={styles.table}>
              <InvoiceTableHeader />
              {remainingItems.map((item, index) => (
                <InvoiceTableRow key={item.productId} item={item} index={firstPageCount + index} />
              ))}
            </View>
          </View>
          <Summary />

          <View style={styles.footer} fixed>
            <Text style={styles.footerThankYou}>Thank you for your business!</Text>
            <Text style={styles.footerNote}>This is a computer-generated invoice and does not require a signature.</Text>
            <Text style={styles.footerNote}>Generated by SalesSphere</Text>
          </View>
        </Page>
      )}
    </Document>
  );
};

export default InvoiceDetailPDF;