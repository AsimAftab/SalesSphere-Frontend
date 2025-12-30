import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { type MiscWork as MiscWorkType } from "../../api/miscellaneousWorkService";

// Consistent styles with OrderListPDF
const styles = StyleSheet.create({
  page: { padding: 20, backgroundColor: '#FFFFFF', fontFamily: 'Helvetica' },
  headerContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20, 
    borderBottomWidth: 1, 
    borderBottomColor: '#111827', 
    paddingBottom: 10 
  },
  title: { fontSize: 20, fontWeight: 'heavy', color: '#111827', textTransform: 'uppercase' },
  reportInfo: { flexDirection: 'column', alignItems: 'flex-end' },
  reportLabel: { fontSize: 8, color: '#6B7280' },
  reportValue: { fontSize: 10, color: '#111827', fontWeight: 'bold' },
  tableContainer: { 
    flexDirection: 'column', 
    width: '100%', 
    borderColor: '#E5E7EB', 
    borderWidth: 1, 
    borderRadius: 2 
  },
  tableHeader: { 
    flexDirection: 'row', 
    backgroundColor: '#197ADC', 
    borderBottomColor: '#E5E7EB', 
    borderBottomWidth: 1, 
    alignItems: 'center', 
    height: 24 
  },
  tableRow: { 
    flexDirection: 'row', 
    borderBottomColor: '#F3F4F6', 
    borderBottomWidth: 1, 
    alignItems: 'stretch', 
    minHeight: 24 
  },
  rowEven: { backgroundColor: '#FFFFFF' },
  rowOdd: { backgroundColor: '#FAFAFA' },
  cellHeader: { 
    fontSize: 7, 
    fontWeight: 'bold', 
    color: '#FFFFFF', 
    paddingHorizontal: 4, 
    paddingVertical: 5, 
    textAlign: 'left' 
  },
  cellText: { 
    fontSize: 7, 
    color: '#1F2937', 
    paddingHorizontal: 4, 
    paddingVertical: 4, 
    textAlign: 'left' 
  },
  textCenter: { textAlign: 'center' },
});

interface MiscellaneousWorkListPDFProps {
  data: MiscWorkType[];
}

const MiscellaneousWorkListPDF: React.FC<MiscellaneousWorkListPDFProps> = ({ data }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Miscellaneous Work Report</Text>
        <View style={styles.reportInfo}>
            <Text style={styles.reportLabel}>Generated On</Text>
            <Text style={styles.reportValue}>{new Date().toLocaleDateString('en-GB')}</Text>
            <Text style={styles.reportLabel}>Total Records</Text>
            <Text style={styles.reportValue}>{data.length}</Text>
        </View>
      </View>

      {/* Table Section */}
      <View style={styles.tableContainer}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <View style={{ width: '5%' }}><Text style={[styles.cellHeader, styles.textCenter]}>S.No</Text></View>
          <View style={{ width: '15%' }}><Text style={styles.cellHeader}>Employee</Text></View>
          <View style={{ width: '25%' }}><Text style={styles.cellHeader}>Nature of Work</Text></View>
          <View style={{ width: '10%' }}><Text style={styles.cellHeader}>Work Date</Text></View>
          <View style={{ width: '30%' }}><Text style={styles.cellHeader}>Address</Text></View>
          <View style={{ width: '15%' }}><Text style={styles.cellHeader}>Assigned By</Text></View>
        </View>

        {/* Table Body */}
        {data.map((item, index) => {
          const rowStyle = index % 2 === 0 ? styles.rowEven : styles.rowOdd;
          
          return (
            <View style={[styles.tableRow, rowStyle]} key={item._id || index}>
              <View style={{ width: '5%' }}>
                <Text style={[styles.cellText, styles.textCenter]}>{index + 1}</Text>
              </View>
              
              <View style={{ width: '15%' }}>
                <Text style={styles.cellText}>{item.employee?.name || 'N/A'}</Text>
              </View>
              
              <View style={{ width: '25%' }}>
                <Text style={styles.cellText}>{item.natureOfWork || '-'}</Text>
              </View>
              
              <View style={{ width: '10%' }}>
                <Text style={styles.cellText}>
                  {item.workDate 
                    ? new Date(item.workDate).toLocaleDateString('en-GB') 
                    : '-'}
                </Text>
              </View>

              <View style={{ width: '30%' }}>
                <Text style={styles.cellText}>{item.address || 'No Address Provided'}</Text>
              </View>

              <View style={{ width: '15%' }}>
                <Text style={styles.cellText}>{item.assignedBy?.name || 'N/A'}</Text>
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
          fontSize: 8,
          color: '#9CA3AF'
        }}
        render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
        fixed
      />
    </Page>
  </Document>
);

export default MiscellaneousWorkListPDF;