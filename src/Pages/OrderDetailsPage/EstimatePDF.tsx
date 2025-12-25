import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { type Estimate, type EstimateItem } from '../../api/estimateService';

// --- Define Colors ---
const colors = {
  primary: '#F97316',    // Orange theme
  blueLabel: '#1D4ED8',  // Blue labels for FROM/TO
  white: '#FFFFFF',
  textDark: '#111827',
  textLight: '#4B5563',
  border: '#E5E7EB',     // Gray for all dividers
  summaryBg: '#FFF7ED',  // Light orange background
  summaryBorder: '#FED7AA',
  danger: '#EF4444',     // Red for discount
  statusBg: '#9CA3AF', 
};

// --- Define Styles ---
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: 40,
    flexDirection: 'column',
    backgroundColor: colors.white,
  },
  header: {
    backgroundColor: colors.primary,
    color: colors.white,
    paddingVertical: 18,
    paddingHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: colors.white,
  },
  headerId: { fontSize: 12, color: colors.white, marginTop: 2 },
  headerDate: { color: colors.white, fontSize: 9, marginTop: 8 },
  statusBadge: {
    backgroundColor: colors.statusBg,
    color: colors.white,
    padding: '4px 12px',
    borderRadius: 4,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
  },
  fromToContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  addressBox: {
    width: '48%',
    padding: 12,
    border: `1px solid ${colors.border}`,
    borderRadius: 8,
  },
  addressTitle: {
    fontSize: 8,
    color: colors.blueLabel,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  addressName: {
    fontSize: 11,
    color: colors.textDark,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4, 
  },
  addressText: {
    fontSize: 8,
    color: colors.textLight,
    lineHeight: 1.4,
  },
  deliveryDateWrapper: { marginTop: 20 },
  deliveryDateBox: {
    backgroundColor: colors.summaryBg,
    border: `1px solid ${colors.summaryBorder}`,
    borderRadius: 8,
    padding: 10,
    width: 160,
  },
  deliveryDateLabel: { fontSize: 8, color: colors.textLight, marginBottom: 4 },
  deliveryDate: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: colors.primary },
  
  // --- Updated Table Styles (Square corners & Gray Dividers) ---
  tableContainer: {
    marginTop: 30,
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    // REMOVED borderRadius and overflow:hidden to make it not round
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    color: colors.white,
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    minHeight: 30,
    alignItems: 'center',
    // REMOVED border rounding properties
  },
  tableHeaderCell: {
    padding: 8,
    // UPDATED to gray color
    borderRightWidth: 1,
    borderRightColor: colors.border, 
    textAlign: 'center',
    height: '100%',
    justifyContent: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    minHeight: 30,
    alignItems: 'center',
  },
  tableCell: {
    padding: 8,
    fontSize: 9,
    color: colors.textLight,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    textAlign: 'center',
    height: '100%',
    justifyContent: 'center',
  },
  colSno: { width: '8%' },
  colDesc: { width: '38%', textAlign: 'left', paddingLeft: 10 },
  colQty: { width: '10%' },
  colPrice: { width: '16%' },
  colDisc: { width: '12%' }, 
  colAmt: { width: '16%' },
  
  // --- Summary Card ---
  totalsContainer: { 
    marginTop: 25, 
    flexDirection: 'row', 
    justifyContent: 'flex-end' 
  },
  totalsBox: { 
    width: '45%', 
    backgroundColor: colors.summaryBg, 
    border: `1px solid ${colors.summaryBorder}`, 
    borderRadius: 12,
    padding: 15 
  },
  totalsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 5 
  },
  totalsLabel: { fontSize: 10, color: colors.textLight },
  totalsValue: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: colors.textDark },
  
  // Discount value in RED
  discountValue: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: colors.danger },
  
  // Gray divider for the summary footer
  totalDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.border, 
    marginTop: 8,
    paddingTop: 8,
  },
  totalsTotalLabel: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: colors.primary },
  totalsTotalValue: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: colors.primary },
  
  footer: { position: 'absolute', bottom: 30, left: 30, right: 30, textAlign: 'center' },
  footerThankYou: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: colors.blueLabel, marginBottom: 5 },
  footerNote: { fontSize: 7, color: colors.textLight, marginTop: 2 },
});

// --- Helpers ---
const formatDate = (dateStr: string) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatCurrency = (amount: number) => {
  return `Rs. ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const EstimatePDF = ({ data }: { data: Estimate }) => {
  const globalDiscountPercentage = data.discount || 0;
  const globalDiscountAmount = (data.subtotal * globalDiscountPercentage) / 100;

  return (
    <Document title={`Estimate - ${data.estimateNumber}`}>
      <Page size="A4" style={styles.page}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>ESTIMATE</Text>
            <Text style={styles.headerId}>{data.estimateNumber}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.statusBadge}>{data.status.toUpperCase()}</Text>
            <Text style={styles.headerDate}>Date: {formatDate(data.createdAt)}</Text>
          </View>
        </View>

        {/* Addresses */}
        <View style={styles.fromToContainer}>
          <View style={styles.addressBox}>
            <Text style={styles.addressTitle}>FROM</Text>
            <Text style={styles.addressName}>{data.organizationName}</Text>
            <Text style={styles.addressText}>{data.organizationAddress}</Text>
            <Text style={styles.addressText}>Phone: {data.organizationPhone}</Text>
            <Text style={styles.addressText}>PAN/VAT: {data.organizationPanVatNumber}</Text>
          </View>
          <View style={styles.addressBox}>
            <Text style={styles.addressTitle}>TO</Text>
            <Text style={styles.addressName}>{data.partyName}</Text>
            <Text style={styles.addressText}>{data.partyAddress}</Text>
            <Text style={styles.addressText}>PAN/VAT: {data.partyPanVatNumber}</Text>
            <Text style={styles.addressText}>Attn: {data.partyOwnerName}</Text>
          </View>
        </View>

        {/* Delivery Date */}
        <View style={styles.deliveryDateWrapper}>
          <View style={styles.deliveryDateBox}>
            <Text style={styles.deliveryDateLabel}>Expected Delivery Date</Text>
            <Text style={styles.deliveryDate}>Not set</Text>
          </View>
        </View>

        {/* Table Section (No rounding, Gray dividers) */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colSno]}>S.NO</Text>
            <Text style={[styles.tableHeaderCell, styles.colDesc]}>Item Description</Text>
            <Text style={[styles.tableHeaderCell, styles.colQty]}>Qty</Text>
            <Text style={[styles.tableHeaderCell, styles.colPrice]}>Unit Price</Text>
            <Text style={[styles.tableHeaderCell, styles.colDisc]}>Discount</Text>
            <Text style={[styles.tableHeaderCell, styles.colAmt, { borderRightWidth: 0 }]}>Amount</Text>
          </View>

          {data.items.map((item: EstimateItem, index: number) => (
            <View style={styles.tableRow} key={index} wrap={false}>
              <Text style={[styles.tableCell, styles.colSno]}>{index + 1}</Text>
              <Text style={[styles.tableCell, styles.colDesc]}>{item.productName}</Text>
              <Text style={[styles.tableCell, styles.colQty]}>{item.quantity}</Text>
              <Text style={[styles.tableCell, styles.colPrice]}>{formatCurrency(item.price)}</Text>
              <Text style={[styles.tableCell, styles.colDisc]}>{item.discount > 0 ? `${item.discount}%` : '-'}</Text>
              <Text style={[styles.tableCell, styles.colAmt, { borderRightWidth: 0 }]}>{formatCurrency(item.total)}</Text>
            </View>
          ))}
        </View>
        
        {/* Footer Summary Card */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalsBox}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Subtotal</Text>
              <Text style={styles.totalsValue}>{formatCurrency(data.subtotal)}</Text>
            </View>

            {globalDiscountPercentage > 0 && (
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>Discount ({globalDiscountPercentage}%)</Text>
                {/* Discount value in RED */}
                <Text style={styles.discountValue}>-{formatCurrency(globalDiscountAmount)}</Text>
              </View>
            )}

            {/* Gray divider inside the footer card */}
            <View style={[styles.totalsRow, styles.totalDivider]}>
              <Text style={styles.totalsTotalLabel}>TOTAL</Text>
              <Text style={styles.totalsTotalValue}>{formatCurrency(data.totalAmount)}</Text>
            </View>
          </View>
        </View>

        {/* Footer Credits */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerThankYou}>Thank you for your business!</Text>
          <Text style={styles.footerNote}>This is a computer-generated invoice and does not require a signature.</Text>
          <Text style={styles.footerNote}>Generated by SalesSphere</Text>
        </View>
      </Page>
    </Document>
  );
};

export default EstimatePDF;