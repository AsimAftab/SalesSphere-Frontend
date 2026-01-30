import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { type Note } from '../../api/notesService';
import { formatDisplayDate } from '../../utils/dateUtils';
import { PDF_FONT_FAMILY } from '../../utils/pdfFonts';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#FFFFFF',
    fontFamily: PDF_FONT_FAMILY
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#111827',
    paddingBottom: 10
  },
  title: {
    fontSize: 22,
    color: '#111827',
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  reportInfo: {
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  reportLabel: {
    fontSize: 8,
    color: '#6B7280',
    marginBottom: 2
  },
  reportValue: {
    fontSize: 10,
    color: '#111827',
    fontWeight: 'bold'
  },
  tableContainer: {
    flexDirection: 'column',
    width: '100%',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 4,
    overflow: 'hidden'
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#197ADC',
    alignItems: 'center',
    height: 30
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomColor: '#F3F4F6',
    borderBottomWidth: 1,
    alignItems: 'center',
    minHeight: 32
  },
  rowEven: { backgroundColor: '#FFFFFF' },
  rowOdd: { backgroundColor: '#F9FAFB' },
  cellHeader: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#FFFFFF',
    paddingHorizontal: 6,
    textAlign: 'left'
  },
  cellText: {
    fontSize: 8,
    color: '#374151',
    paddingHorizontal: 6,
    paddingVertical: 6,
    textAlign: 'left'
  },
  textCenter: { textAlign: 'center' },

  // Dynamic Badge Base Style
  badgeBase: {
    fontSize: 7,
    fontWeight: 'bold',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  // Color Variants
  badgeParty: {
    backgroundColor: '#EBF5FF', // Blue bg
    color: '#1E40AF',           // Blue text
  },
  badgeProspect: {
    backgroundColor: '#F0FDF4', // Green bg
    color: '#166534',           // Green text
  },
  badgeSite: {
    backgroundColor: '#FFF7ED', // Orange bg
    color: '#9A3412',           // Orange text
  },
  badgeGeneral: {
    backgroundColor: '#F3F4F6', // Gray bg
    color: '#374151',           // Gray text
  }
});

interface NoteListPDFProps {
  data: Note[];
}

const NoteListPDF: React.FC<NoteListPDFProps> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>

      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Notes Report</Text>
        <View style={styles.reportInfo}>
          <Text style={styles.reportLabel}>Generated On</Text>
          <Text style={styles.reportValue}>{formatDisplayDate(new Date().toISOString())}</Text>
          <Text style={styles.reportLabel}>Total Records</Text>
          <Text style={styles.reportValue}>{data.length}</Text>
        </View>
      </View>

      {/* Table Section */}
      <View style={styles.tableContainer}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <View style={{ width: '5%' }}><Text style={[styles.cellHeader, styles.textCenter]}>S.No</Text></View>
          <View style={{ width: '15%' }}><Text style={styles.cellHeader}>Title</Text></View>
          <View style={{ width: '12%' }}><Text style={styles.cellHeader}>Date</Text></View>
          <View style={{ width: '10%' }}><Text style={styles.cellHeader}>Type</Text></View>
          <View style={{ width: '15%' }}><Text style={styles.cellHeader}>Linked To</Text></View>
          <View style={{ width: '15%' }}><Text style={styles.cellHeader}>Created By</Text></View>
          <View style={{ width: '28%' }}><Text style={styles.cellHeader}>Description</Text></View>
        </View>

        {/* Table Body */}
        {data.map((item, index) => {
          const rowStyle = index % 2 === 0 ? styles.rowEven : styles.rowOdd;

          // Logic for Entity Type and Style
          let entityType = "General";
          let badgeStyle = styles.badgeGeneral;

          if (item.partyName) {
            entityType = "Party";
            badgeStyle = styles.badgeParty;
          } else if (item.prospectName) {
            entityType = "Prospect";
            badgeStyle = styles.badgeProspect;
          } else if (item.siteName) {
            entityType = "Site";
            badgeStyle = styles.badgeSite;
          }

          const linkedTo = item.partyName || item.prospectName || item.siteName || 'General';

          return (
            <View style={[styles.tableRow, rowStyle]} key={item.id || index} wrap={false}>
              <View style={{ width: '5%' }}>
                <Text style={[styles.cellText, styles.textCenter]}>{index + 1}</Text>
              </View>

              <View style={{ width: '15%' }}>
                <Text style={styles.cellText}>{item.title || '-'}</Text>
              </View>

              <View style={{ width: '12%' }}>
                <Text style={styles.cellText}>
                  {item.createdAt ? formatDisplayDate(item.createdAt) : '—'}
                </Text>
              </View>

              <View style={{ width: '10%', paddingHorizontal: 4 }}>
                <Text style={[styles.badgeBase, badgeStyle]}>{entityType}</Text>
              </View>

              <View style={{ width: '15%' }}>
                <Text style={styles.cellText}>{linkedTo}</Text>
              </View>

              <View style={{ width: '15%' }}>
                <Text style={styles.cellText}>{item.createdBy?.name || 'N/A'}</Text>
              </View>

              <View style={{ width: '28%' }}>
                <Text style={styles.cellText}>{item.description || '-'}</Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Footer Page Numbering */}
      <Text
        style={{
          position: 'absolute',
          bottom: 20,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: 9,
          color: '#9CA3AF'
        }}
        render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
        fixed
      />
    </Page>
  </Document>
);

export default NoteListPDF;