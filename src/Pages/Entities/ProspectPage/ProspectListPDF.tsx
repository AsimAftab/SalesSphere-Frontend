import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 20, backgroundColor: '#FFFFFF', fontFamily: 'Helvetica' },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#111827', paddingBottom: 10 },
  title: { fontSize: 20, fontWeight: 'heavy', color: '#111827', textTransform: 'uppercase' },
  reportInfo: { flexDirection: 'column', alignItems: 'flex-end' },
  reportLabel: { fontSize: 8, color: '#6B7280' },
  reportValue: { fontSize: 10, color: '#111827', fontWeight: 'bold' },
  tableContainer: { flexDirection: 'column', width: '100%', borderColor: '#E5E7EB', borderWidth: 1, borderRadius: 2 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#197ADC', borderBottomColor: '#E5E7EB', borderBottomWidth: 1, alignItems: 'center', height: 24 },
  tableRow: { flexDirection: 'row', borderBottomColor: '#F3F4F6', borderBottomWidth: 1, alignItems: 'stretch', minHeight: 24 },
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
        <Text style={styles.title}>Prospect List</Text>
        <View style={styles.reportInfo}>
            <Text style={styles.reportLabel}>Generated On</Text>
            <Text style={styles.reportValue}>{new Date().toLocaleDateString()}</Text>
            <Text style={styles.reportLabel}>Total Prospects</Text>
            <Text style={styles.reportValue}>{prospects.length}</Text>
        </View>
      </View>

      {/* Table */}
      <View style={styles.tableContainer}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
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
          if (item.prospectInterest && Array.isArray(item.prospectInterest) && item.prospectInterest.length > 0) {
             const interestList = item.prospectInterest.map((interest: any) => {
                const brands = (interest.brands && interest.brands.length > 0) 
                    ? interest.brands.join(', ') 
                    : 'No Brands';
                return `${interest.category}: ${brands}`;
             });
             interestString = interestList.join('\n'); 
          }

          return (
            <View style={[styles.tableRow, rowStyle]} key={item._id || index}>
              <View style={{ width: '4%' }}>
                <Text style={[styles.cellText, styles.textCenter]}>{index + 1}</Text>
              </View>
              
              <View style={{ width: '15%' }}>
                <Text style={styles.cellText}>{item.prospectName || 'N/A'}</Text>
              </View>
              
              <View style={{ width: '10%' }}>
                <Text style={styles.cellText}>{item.ownerName || 'N/A'}</Text>
              </View>
              
              <View style={{ width: '10%' }}>
                <Text style={styles.cellText}>{item.contact?.phone || 'N/A'}</Text>
              </View>

              <View style={{ width: '22%' }}>
                <Text style={styles.cellText}>{interestString}</Text>
              </View>

              {/* ✅ Increased Width for Email */}
              <View style={{ width: '18%' }}>
                <Text style={styles.cellText}>{item.contact?.email || '-'}</Text>
              </View>
              
              <View style={{ width: '13%' }}>
                <Text style={styles.cellText}>{item.location?.address || 'N/A'}</Text>
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
    </Page>
  </Document>
);

export default ProspectListPDF;