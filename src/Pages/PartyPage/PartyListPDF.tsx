import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { type Party } from '../../api/partyService';

const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#111827',
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'heavy',
    color: '#111827',
    textTransform: 'uppercase',
  },
  reportInfo: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  reportLabel: { fontSize: 8, color: '#6B7280' },
  reportValue: { fontSize: 10, color: '#111827', fontWeight: 'bold' },
  
  // Table
  tableContainer: {
    flexDirection: 'column',
    width: '100%',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#197ADC',
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 24,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomColor: '#F3F4F6',
    borderBottomWidth: 1,
    // CHANGED: 'stretch' makes sure all cells are the same height if one wraps
    alignItems: 'stretch', 
    minHeight: 24,
  },
  rowEven: { backgroundColor: '#FFFFFF' },
  rowOdd: { backgroundColor: '#FAFAFA' },
  
  // Cells
  cellHeader: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#FFFFFF',
    paddingHorizontal: 4,
    paddingVertical: 5, // Vertical padding for header text
    textAlign: 'left',
  },
  cellText: {
    fontSize: 7,
    color: '#1F2937',
    paddingHorizontal: 4,
    paddingVertical: 4,
    textAlign: 'left',
  },
  textCenter: { textAlign: 'center' },
});

interface PartyListPDFProps {
  parties: Party[];
}

const PartyListPDF: React.FC<PartyListPDFProps> = ({ parties }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Party List</Text>
        <View style={styles.reportInfo}>
            <Text style={styles.reportLabel}>Generated On</Text>
            <Text style={styles.reportValue}>{new Date().toLocaleDateString()}</Text>
            <Text style={styles.reportLabel}>Total Parties</Text>
            <Text style={styles.reportValue}>{parties.length}</Text>
        </View>
      </View>

      {/* Table */}
      <View style={styles.tableContainer}>
        {/* Header Row */}
        <View style={styles.tableHeader}>
          {/* CHANGED: Wrapped headers in View to match Data Rows exactly */}
          <View style={{ width: '5%' }}><Text style={[styles.cellHeader, styles.textCenter]}>S.No</Text></View>
          <View style={{ width: '15%' }}><Text style={styles.cellHeader}>Party Name</Text></View>
          <View style={{ width: '12%' }}><Text style={styles.cellHeader}>Owner</Text></View>
          <View style={{ width: '10%' }}><Text style={styles.cellHeader}>Phone</Text></View>
          <View style={{ width: '15%' }}><Text style={styles.cellHeader}>Email</Text></View>
          <View style={{ width: '10%' }}><Text style={styles.cellHeader}>PAN/VAT</Text></View>
          <View style={{ width: '10%' }}><Text style={styles.cellHeader}>Date Joined</Text></View>
          {/* CHANGED: Address uses flex: 1 to fill strictly remaining space */}
          <View style={{ flex: 1 }}><Text style={styles.cellHeader}>Address</Text></View>
        </View>

        {/* Data Rows */}
        {parties.map((party, index) => {
          const rowStyle = index % 2 === 0 ? styles.rowEven : styles.rowOdd;
          return (
            <View style={[styles.tableRow, rowStyle]} key={party.id || index}>
              
              <View style={{ width: '5%' }}>
                <Text style={[styles.cellText, styles.textCenter]}>{index + 1}</Text>
              </View>

              <View style={{ width: '15%' }}>
                <Text style={styles.cellText}>{party.companyName}</Text>
              </View>

              <View style={{ width: '12%' }}>
                <Text style={styles.cellText}>{party.ownerName}</Text>
              </View>

              <View style={{ width: '10%' }}>
                <Text style={styles.cellText}>{party.phone}</Text>
              </View>

              <View style={{ width: '15%' }}>
                 <Text style={styles.cellText}>{party.email || '-'}</Text>
              </View>

              <View style={{ width: '10%' }}>
                <Text style={styles.cellText}>{party.panVat}</Text>
              </View>

              <View style={{ width: '10%' }}>
                <Text style={styles.cellText}>
                  {party.dateCreated ? new Date(party.dateCreated).toLocaleDateString() : '-'}
                </Text>
              </View>

              {/* CHANGED: Address uses flex: 1 */}
              <View style={{ flex: 1 }}>
                <Text style={styles.cellText}>{party.address}</Text>
              </View>

            </View>
          );
        })}
      </View>
    </Page>
  </Document>
);

export default PartyListPDF;