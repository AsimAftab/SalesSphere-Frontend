import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { type Note } from '../../api/notesService';

// 1. Define Professional PDF Styles
const styles = StyleSheet.create({
  page: { 
    padding: 30, 
    backgroundColor: '#FFFFFF', 
    fontFamily: 'Helvetica' 
  },
  headerContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20, 
    borderBottomWidth: 2, 
    borderBottomColor: '#197ADC', 
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
    alignItems: 'stretch', 
    minHeight: 28 
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
  badge: {
    fontSize: 7,
    fontWeight: 'bold',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 2,
    textAlign: 'center',
    backgroundColor: '#F3F4F6',
    color: '#374151'
  }
});

interface NoteListPDFProps {
  data: Note[];
}

const NoteListPDF: React.FC<NoteListPDFProps> = ({ data }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      
      {/* 2. Header Section */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Interaction Notes Report</Text>
        <View style={styles.reportInfo}>
            <Text style={styles.reportLabel}>Generated On</Text>
            <Text style={styles.reportValue}>{new Date().toLocaleDateString('en-GB')}</Text>
            <Text style={styles.reportLabel}>Total Records</Text>
            <Text style={styles.reportValue}>{data.length}</Text>
        </View>
      </View>

      {/* 3. Table Section */}
      <View style={styles.tableContainer}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <View style={{ width: '5%' }}><Text style={[styles.cellHeader, styles.textCenter]}>S.No</Text></View>
          <View style={{ width: '15%' }}><Text style={styles.cellHeader}>Title</Text></View>
          <View style={{ width: '35%' }}><Text style={styles.cellHeader}>Description</Text></View>
          <View style={{ width: '15%' }}><Text style={styles.cellHeader}>Linked To</Text></View>
          <View style={{ width: '15%' }}><Text style={styles.cellHeader}>Created By</Text></View>
          <View style={{ width: '15%' }}><Text style={styles.cellHeader}>Date</Text></View>
        </View>

        {/* Table Body */}
        {data.map((item, index) => {
          const rowStyle = index % 2 === 0 ? styles.rowEven : styles.rowOdd;
          const linkedTo = item.partyName || item.prospectName || item.siteName || 'General';

          return (
            <View style={[styles.tableRow, rowStyle]} key={item.id || index}>
              <View style={{ width: '5%' }}>
                <Text style={[styles.cellText, styles.textCenter]}>{index + 1}</Text>
              </View>
              
              <View style={{ width: '15%' }}>
                <Text style={[styles.cellText, { fontWeight: 'bold' }]}>{item.title || '-'}</Text>
              </View>

              <View style={{ width: '35%' }}>
                <Text style={styles.cellText}>{item.description || '-'}</Text>
              </View>
              
              <View style={{ width: '15%', justifyContent: 'center', paddingLeft: 6 }}>
                <Text style={styles.badge}>{linkedTo}</Text>
              </View>

              <View style={{ width: '15%' }}>
                <Text style={styles.cellText}>{item.createdBy?.name || 'N/A'}</Text>
              </View>

              <View style={{ width: '15%' }}>
                <Text style={styles.cellText}>
                  {item.createdAt ? new Date(item.createdAt).toISOString().split('T')[0] : '—'}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* 4. Footer Page Numbering */}
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