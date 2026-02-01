import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { type Estimate, type EstimateItem } from '../../../../api/estimateService';
import { PDF_FONT_FAMILY } from '../../../../utils/pdfFonts';
import { formatDisplayDate } from '../../../../utils/dateUtils';

// --- Define Colors ---
const colors = {
  primary: '#F97316',
  white: '#FFFFFF',
  textDark: '#111827',
  textLight: '#4B5563',
  border: '#E5E7EB',
  bgLight: '#F9FAFB',
  danger: '#EF4444',
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
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  headerLeft: { flexDirection: 'column' },
  headerTitle: {
    fontSize: 28,
    fontFamily: PDF_FONT_FAMILY, fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  headerEstimateId: { fontSize: 12, color: colors.textDark },
  headerRight: { flexDirection: 'column', alignItems: 'flex-end' },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  headerLabel: { fontSize: 9, color: colors.textLight },
  headerValue: { fontSize: 9, color: colors.textDark, fontFamily: PDF_FONT_FAMILY, fontWeight: 'bold', marginLeft: 4 },
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
  discountLabel: { fontSize: 10, color: colors.danger },
  discountValue: { fontSize: 10, fontFamily: PDF_FONT_FAMILY, fontWeight: 'bold', color: colors.danger },
  totalsTotalLabel: { fontSize: 12, fontFamily: PDF_FONT_FAMILY, fontWeight: 'bold', color: colors.primary },
  totalsTotalValue: { fontSize: 12, fontFamily: PDF_FONT_FAMILY, fontWeight: 'bold', color: colors.primary },

  footer: {
    position: 'absolute',
    bottom: 15,
    left: 30,
    right: 30,
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
  footerTitle: { fontSize: 10, fontFamily: PDF_FONT_FAMILY, fontWeight: 'bold', color: colors.primary },
  footerNote: { marginTop: 3, fontSize: 7, color: colors.textLight },
});

// --- Helpers ---
const formatCurrency = (amount: number) => {
  return `Rs. ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Max rows that fit on page 1 with the summary card
const MAX_ROWS_WITH_SUMMARY = 13;

const TableHeader = () => (
  <View style={styles.tableHeader}>
    <Text style={[styles.tableHeaderCell, styles.colSno]}>SN</Text>
    <Text style={[styles.tableHeaderCell, styles.colDesc]}>Item Description</Text>
    <Text style={[styles.tableHeaderCell, styles.colQty]}>Qty</Text>
    <Text style={[styles.tableHeaderCell, styles.colPrice]}>Unit Price</Text>
    <Text style={[styles.tableHeaderCell, styles.colDisc]}>Discount</Text>
    <Text style={[styles.tableHeaderCell, styles.colAmt]}>Amount</Text>
  </View>
);

const TableRow = ({ item, index }: { item: EstimateItem; index: number }) => (
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

const EstimatePDF = ({ data }: { data: Estimate }) => {
  const globalDiscountPercentage = data.discount || 0;
  const globalDiscountAmount = (data.subtotal * globalDiscountPercentage) / 100;

  const totalItems = data.items.length;

  // If items fit with summary on page 1, show everything on one page
  // If items exceed that but fit without summary, split: all rows on page 1, summary on page 2
  //   BUT that looks bad (summary alone), so instead cut at a lower number so page 2 has enough rows
  // Strategy: if > MAX_ROWS_WITH_SUMMARY, cut at MAX_ROWS_WITH_SUMMARY so page 2 gets the rest + summary
  const firstPageCount = totalItems <= MAX_ROWS_WITH_SUMMARY ? totalItems : MAX_ROWS_WITH_SUMMARY;
  const firstPageItems = data.items.slice(0, firstPageCount);
  const remainingItems = data.items.slice(firstPageCount);
  const hasOverflow = remainingItems.length > 0;

  const Summary = () => (
    <View style={styles.totalsContainer} wrap={false}>
      <View style={styles.totalsBox}>
        <View style={styles.totalsRow}>
          <Text style={styles.totalsLabel}>Subtotal</Text>
          <Text style={styles.totalsValue}>{formatCurrency(data.subtotal)}</Text>
        </View>
        {globalDiscountPercentage > 0 && (
          <View style={styles.totalsRow}>
            <Text style={styles.discountLabel}>Discount ({globalDiscountPercentage}%)</Text>
            <Text style={styles.discountValue}>-{formatCurrency(globalDiscountAmount)}</Text>
          </View>
        )}
        <View style={styles.totalsRowTotal}>
          <Text style={styles.totalsTotalLabel}>TOTAL</Text>
          <Text style={styles.totalsTotalValue}>{formatCurrency(data.totalAmount)}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <Document title={`Estimate - ${data.estimateNumber}`}>
      {/* Page 1: Header + Addresses + First 12 rows (+ summary if fits) */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>ESTIMATE</Text>
            <Text style={styles.headerEstimateId}>{data.estimateNumber}</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.headerRow}>
              <Text style={styles.headerLabel}>Date:</Text>
              <Text style={styles.headerValue}>{formatDisplayDate(data.createdAt)}</Text>
            </View>
            <View style={[styles.headerRow, { marginTop: 4 }]}>
              <Text style={styles.headerLabel}>Items:</Text>
              <Text style={styles.headerValue}>{data.items?.length || 0}</Text>
            </View>
          </View>
        </View>

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
            <Text style={styles.addressText}>Owner: {data.partyOwnerName}</Text>
          </View>
        </View>

        <View style={styles.tableWrapper}>
          <View style={styles.table}>
            <TableHeader />
            {firstPageItems.map((item, index) => (
              <TableRow key={index} item={item} index={index} />
            ))}
          </View>
        </View>

        {!hasOverflow && <Summary />}

        <View style={styles.footer} fixed>
          <Text style={styles.footerTitle}>Thank you for considering our estimate!</Text>
          <Text style={styles.footerNote}>Generated by SalesSphere</Text>
        </View>
      </Page>

      {/* Page 2+: Remaining rows + Summary */}
      {hasOverflow && (
        <Page size="A4" style={styles.page}>
          <View style={styles.tableWrapper}>
            <View style={styles.table}>
              <TableHeader />
              {remainingItems.map((item, index) => (
                <TableRow key={index} item={item} index={firstPageCount + index} />
              ))}
            </View>
          </View>
          <Summary />

          <View style={styles.footer} fixed>
            <Text style={styles.footerTitle}>Thank you for considering our estimate!</Text>
            <Text style={styles.footerNote}>Prices are subject to change.</Text>
            <Text style={styles.footerNote}>Generated by SalesSphere</Text>
          </View>
        </Page>
      )}
    </Document>
  );
};

export default EstimatePDF;
