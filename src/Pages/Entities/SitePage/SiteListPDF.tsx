import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { formatDisplayDate } from '../../../utils/dateUtils';
import type { Site } from '../../../api/siteService';
import { PDF_FONT_FAMILY } from '../../../utils/pdfFonts';

const styles = StyleSheet.create({
  page: { padding: 20, backgroundColor: '#FFFFFF', fontFamily: PDF_FONT_FAMILY },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#111827', paddingBottom: 10 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#111827', textTransform: 'uppercase' },
  reportInfo: { flexDirection: 'column', alignItems: 'flex-end' },
  reportLabel: { fontSize: 8, color: '#6B7280' },
  reportValue: { fontSize: 10, color: '#111827', fontWeight: 'bold' },
  tableContainer: { flexDirection: 'column', width: '100%', borderColor: '#E5E7EB', borderWidth: 1, borderRadius: 2 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#197ADC', borderBottomColor: '#E5E7EB', borderBottomWidth: 1, alignItems: 'center', minHeight: 26 },
  tableRow: { flexDirection: 'row', borderBottomColor: '#F3F4F6', borderBottomWidth: 1, alignItems: 'stretch', minHeight: 24 },
  rowEven: { backgroundColor: '#FFFFFF' },
  rowOdd: { backgroundColor: '#FAFAFA' },
  cellHeader: { fontSize: 7, fontWeight: 'bold', color: '#FFFFFF', paddingHorizontal: 4, paddingVertical: 5, textAlign: 'left' },
  // cellText: Optimized fontSize and lineHeight to prevent address overlap
  cellText: { fontSize: 6, color: '#1F2937', paddingHorizontal: 4, paddingVertical: 6, textAlign: 'left', lineHeight: 1.4 },
  textCenter: { textAlign: 'center' },
});

interface SiteListPDFProps {
  sites: Site[];
}

const SiteListPDF: React.FC<SiteListPDFProps> = ({ sites }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      {/* Report Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Site List Report</Text>
        <View style={styles.reportInfo}>
          <Text style={styles.reportLabel}>Generated On</Text>
          <Text style={styles.reportValue}>{formatDisplayDate(new Date().toISOString())}</Text>
          <Text style={styles.reportLabel}>Total Sites</Text>
          <Text style={styles.reportValue}>{sites.length}</Text>
        </View>
      </View>

      <View style={styles.tableContainer}>
        {/* Balanced Column Widths to prevent overlaps */}
        <View style={styles.tableHeader}>
          <View style={{ width: '3%' }}><Text style={[styles.cellHeader, styles.textCenter]}>S.No</Text></View>
          <View style={{ width: '8%' }}><Text style={styles.cellHeader}>Site Name</Text></View>
          <View style={{ width: '7%' }}><Text style={styles.cellHeader}>Owner</Text></View>
          <View style={{ width: '7%' }}><Text style={styles.cellHeader}>Phone</Text></View>
          <View style={{ width: '7%' }}><Text style={styles.cellHeader}>Sub-Org</Text></View>
          {/* Interest Columns */}
          <View style={{ width: '7%' }}><Text style={styles.cellHeader}>Category</Text></View>
          <View style={{ width: '9%' }}><Text style={styles.cellHeader}>Brands</Text></View>
          <View style={{ width: '14%' }}><Text style={styles.cellHeader}>Technicians</Text></View>
          <View style={{ width: '15%' }}><Text style={styles.cellHeader}>Email</Text></View>
          <View style={{ width: '16%' }}><Text style={styles.cellHeader}>Address</Text></View>
          <View style={{ width: '7%' }}><Text style={styles.cellHeader}>Joined</Text></View>
        </View>

        {sites.map((item, index) => {
          // Alignment Logic: Use double newlines to separate category blocks clearly
          const catList = item.siteInterest?.map((si: any) => si.category || '-').join('\n\n');

          const brandList = item.siteInterest?.map((si: any) =>
            (si.brands && si.brands.length > 0) ? si.brands.join(', ') : '-'
          ).join('\n\n');

          // User-Friendly Technician mapping: Each tech on a new line within their category block
          const techList = item.siteInterest?.map((si: any) => {
            if (!si.technicians || si.technicians.length === 0) return '-';
            return si.technicians.map((t: any) => `${t.name} (${t.phone})`).join('\n');
          }).join('\n\n');

          return (
            <View style={[styles.tableRow, index % 2 === 0 ? styles.rowEven : styles.rowOdd]} key={index}>
              <View style={{ width: '3%' }}><Text style={[styles.cellText, styles.textCenter]}>{index + 1}</Text></View>
              <View style={{ width: '8%' }}><Text style={styles.cellText}>{item.name}</Text></View>
              <View style={{ width: '7%' }}><Text style={styles.cellText}>{item.ownerName}</Text></View>
              <View style={{ width: '7%' }}><Text style={styles.cellText}>{item.phone}</Text></View>
              <View style={{ width: '7%' }}><Text style={styles.cellText}>{item.subOrgName || '-'}</Text></View>

              {/* Divided Interests: Perfect horizontal alignment between columns */}
              <View style={{ width: '7%' }}><Text style={styles.cellText}>{catList || '-'}</Text></View>
              <View style={{ width: '9%' }}><Text style={styles.cellText}>{brandList || '-'}</Text></View>
              <View style={{ width: '14%' }}><Text style={styles.cellText}>{techList || '-'}</Text></View>

              <View style={{ width: '15%' }}><Text style={styles.cellText}>{item.email || '-'}</Text></View>
              {/* Address width balanced */}
              <View style={{ width: '16%' }}><Text style={styles.cellText}>{item.address || '-'}</Text></View>
              <View style={{ width: '7%' }}><Text style={styles.cellText}>{item.dateJoined ? new Date(item.dateJoined).toISOString().split('T')[0] : 'N/A'}</Text></View>
            </View>
          );
        })}
      </View>
    </Page>
  </Document>
);

export default SiteListPDF;