import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { formatDisplayDate } from '../../../utils/dateUtils';
import { PDF_FONT_FAMILY } from '../../../utils/pdfFonts';

const styles = StyleSheet.create({
  page: { paddingTop: 20, paddingLeft: 20, paddingRight: 20, paddingBottom: 50, backgroundColor: '#FFFFFF', fontFamily: PDF_FONT_FAMILY },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#111827', paddingBottom: 10 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#111827', textTransform: 'uppercase' },
  titleGroup: { flexDirection: 'column' },
  subTitle: { fontSize: 10, color: '#6B7280', marginTop: 4, textTransform: 'uppercase' },
  reportInfo: { flexDirection: 'column', alignItems: 'flex-end' },
  reportLabel: { fontSize: 8, color: '#6B7280' },
  reportValue: { fontSize: 10, color: '#111827', fontWeight: 'bold' },
  tableContainer: { flexDirection: 'column', width: '100%' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#197ADC', borderBottomColor: '#E5E7EB', borderBottomWidth: 1, alignItems: 'center', height: 24, borderLeftWidth: 1, borderRightWidth: 1, borderTopWidth: 1, borderLeftColor: '#E5E7EB', borderRightColor: '#E5E7EB', borderTopColor: '#E5E7EB' },
  tableRow: { flexDirection: 'row', borderBottomColor: '#F3F4F6', borderBottomWidth: 1, alignItems: 'stretch', minHeight: 24, borderLeftWidth: 1, borderRightWidth: 1, borderLeftColor: '#E5E7EB', borderRightColor: '#E5E7EB' },
  rowEven: { backgroundColor: '#FFFFFF' },
  rowOdd: { backgroundColor: '#FAFAFA' },
  cellHeader: { fontSize: 7, fontWeight: 'bold', color: '#FFFFFF', paddingHorizontal: 4, paddingVertical: 5, textAlign: 'left' },
  cellText: { fontSize: 7, color: '#1F2937', paddingHorizontal: 4, paddingVertical: 4, textAlign: 'left' },
  textCenter: { textAlign: 'center' },
});

interface ProspectListPDFProps {
  prospects: any[];
}

const ProspectListPDF: React.FC<ProspectListPDFProps> = ({ prospects }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>

      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.titleGroup}>
          <Text style={styles.title}>Prospect List Report</Text>
          <Text style={styles.subTitle}>Overview of All Registered Prospects</Text>
        </View>
        <View style={styles.reportInfo}>
          <Text style={styles.reportLabel}>Generated On</Text>
          <Text style={styles.reportValue}>{formatDisplayDate(new Date().toISOString())}</Text>
          <Text style={styles.reportLabel}>Total Prospects</Text>
          <Text style={styles.reportValue}>{prospects.length}</Text>
        </View>
      </View>

      {/* Table */}
      <View style={styles.tableContainer}>
        {/* Table Header */}
        <View style={styles.tableHeader} fixed>
          <View style={{ width: '4%' }}><Text style={[styles.cellHeader, styles.textCenter]}>S.No</Text></View>
          <View style={{ width: '15%' }}><Text style={styles.cellHeader}>Prospect Name</Text></View>
          <View style={{ width: '10%' }}><Text style={styles.cellHeader}>Owner</Text></View>
          <View style={{ width: '10%' }}><Text style={styles.cellHeader}>Phone</Text></View>
          <View style={{ width: '22%' }}><Text style={styles.cellHeader}>Interests (Category: Brands)</Text></View>
          {/* ✅ Increased Width for Email */}
          <View style={{ width: '18%' }}><Text style={styles.cellHeader}>Email</Text></View>
          <View style={{ width: '13%' }}><Text style={styles.cellHeader}>Address</Text></View>
          <View style={{ width: '8%' }}><Text style={styles.cellHeader}>Joined</Text></View>
        </View>

        {/* Table Rows */}
        {prospects.map((item, index) => {
          const rowStyle = index % 2 === 0 ? styles.rowEven : styles.rowOdd;

          // Format Interests Logic
          let interestString = '-';
          const interests = item.interest || item.prospectInterest;
          if (interests && Array.isArray(interests) && interests.length > 0) {
            const interestList = interests.map((interest: any) => {
              const brands = (interest.brands && interest.brands.length > 0)
                ? interest.brands.join(', ')
                : 'No Brands';
              return `${interest.category}: ${brands}`;
            });
            interestString = interestList.join('\n');
          }

          return (
            <View style={[styles.tableRow, rowStyle]} key={item.id || item._id || index} wrap={false}>
              <View style={{ width: '4%' }}>
                <Text style={[styles.cellText, styles.textCenter]}>{index + 1}</Text>
              </View>

              <View style={{ width: '15%' }}>
                <Text style={styles.cellText}>{item.name || item.prospectName || 'N/A'}</Text>
              </View>

              <View style={{ width: '10%' }}>
                <Text style={styles.cellText}>{item.ownerName || 'N/A'}</Text>
              </View>

              <View style={{ width: '10%' }}>
                <Text style={styles.cellText}>{item.phone || item.contact?.phone || 'N/A'}</Text>
              </View>

              <View style={{ width: '22%' }}>
                <Text style={styles.cellText}>{interestString}</Text>
              </View>

              <View style={{ width: '18%' }}>
                <Text style={styles.cellText}>{item.email || item.contact?.email || '-'}</Text>
              </View>

              <View style={{ width: '13%' }}>
                <Text style={styles.cellText}>{item.address || item.location?.address || 'N/A'}</Text>
              </View>

              <View style={{ width: '8%' }}>
                <Text style={styles.cellText}>
                  {item.dateJoined ? new Date(item.dateJoined).toISOString().split('T')[0] : 'N/A'}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Footer */}
      <View style={{ position: 'absolute', bottom: 20, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} fixed>
        <Text style={{ fontSize: 8, color: '#9CA3AF' }}>Prospect List Report</Text>
        <Text style={{ fontSize: 8, color: '#9CA3AF' }} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
      </View>
    </Page>
  </Document>
);

export default ProspectListPDF;