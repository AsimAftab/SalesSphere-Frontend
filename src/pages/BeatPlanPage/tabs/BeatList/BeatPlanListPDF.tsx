import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { formatDisplayDate } from '@/utils/dateUtils';
import type { BeatPlanList } from '@/api/beatPlanService';
import { PDF_FONT_FAMILY } from '@/utils/pdfFonts';

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
  tableRow: { flexDirection: 'row', borderBottomColor: '#F3F4F6', borderBottomWidth: 1, alignItems: 'stretch', minHeight: 22, borderLeftWidth: 1, borderRightWidth: 1, borderLeftColor: '#E5E7EB', borderRightColor: '#E5E7EB' },
  rowEven: { backgroundColor: '#FFFFFF' },
  rowOdd: { backgroundColor: '#FAFAFA' },
  cellHeader: { fontSize: 7, fontWeight: 'bold', color: '#FFFFFF', paddingHorizontal: 4, paddingVertical: 5, textAlign: 'left' },
  cellText: { fontSize: 7, color: '#1F2937', paddingHorizontal: 4, paddingVertical: 4, textAlign: 'left' },
  textCenter: { textAlign: 'center' },
  footer: { position: 'absolute', bottom: 20, left: 0, right: 0, textAlign: 'center' as const },
  footerText: { fontSize: 8, color: '#9CA3AF' },
});

interface BeatPlanListPDFProps {
  data: BeatPlanList[];
}

const COL_WIDTHS = {
  sno: '5%',
  name: '16%',
  totalStops: '7%',
  entityType: '12%',
  entityName: '25%',
  createdDate: '12%',
  createdBy: '15%',
};

const buildEntityStrings = (bp: BeatPlanList) => {
  const types: string[] = [];
  const names: string[] = [];

  bp.parties?.forEach((p) => { types.push('Party'); names.push(p.partyName); });
  bp.sites?.forEach((s) => { types.push('Site'); names.push(s.siteName); });
  bp.prospects?.forEach((pr) => { types.push('Prospect'); names.push(pr.prospectName); });

  return {
    entityType: types.length > 0 ? types.join('\n') : '-',
    entityName: names.length > 0 ? names.join('\n') : '-',
  };
};

const BeatPlanListPDF: React.FC<BeatPlanListPDFProps> = ({ data }) => {
  return (
    <Document>
      <Page size="A4" orientation="portrait" style={styles.page} wrap>

        {/* Header */}
        <View style={styles.headerContainer} fixed>
          <View style={styles.titleGroup}>
            <Text style={styles.title}>Beat Plan Report</Text>
            <Text style={styles.subTitle}>Summary of All Beat Plans</Text>
          </View>
          <View style={styles.reportInfo}>
            <Text style={styles.reportLabel}>Generated On</Text>
            <Text style={styles.reportValue}>{formatDisplayDate(new Date().toISOString())}</Text>
            <Text style={styles.reportLabel}>Total Beat Plans</Text>
            <Text style={styles.reportValue}>{data.length}</Text>
          </View>
        </View>

        {/* Table */}
        <View style={styles.tableContainer}>
          {/* Table Header */}
          <View style={styles.tableHeader} fixed>
            <View style={{ width: COL_WIDTHS.sno }}><Text style={[styles.cellHeader, styles.textCenter]}>S.No</Text></View>
            <View style={{ width: COL_WIDTHS.name }}><Text style={styles.cellHeader}>Beat Plan Name</Text></View>
            <View style={{ width: COL_WIDTHS.totalStops }}><Text style={[styles.cellHeader, styles.textCenter]}>Stops</Text></View>
            <View style={{ width: COL_WIDTHS.entityType }}><Text style={styles.cellHeader}>Entity Type</Text></View>
            <View style={{ width: COL_WIDTHS.entityName }}><Text style={styles.cellHeader}>Entity Name</Text></View>
            <View style={{ width: COL_WIDTHS.createdDate }}><Text style={styles.cellHeader}>Created Date</Text></View>
            <View style={{ width: COL_WIDTHS.createdBy }}><Text style={styles.cellHeader}>Created By</Text></View>
          </View>

          {/* Table Rows */}
          {data.map((bp, index) => {
            const rowStyle = index % 2 === 0 ? styles.rowEven : styles.rowOdd;
            const { entityType, entityName } = buildEntityStrings(bp);

            return (
              <View style={[styles.tableRow, rowStyle]} key={bp._id || index} wrap={false}>
                <View style={{ width: COL_WIDTHS.sno }}>
                  <Text style={[styles.cellText, styles.textCenter]}>{index + 1}</Text>
                </View>
                <View style={{ width: COL_WIDTHS.name }}>
                  <Text style={styles.cellText}>{bp.name}</Text>
                </View>
                <View style={{ width: COL_WIDTHS.totalStops }}>
                  <Text style={[styles.cellText, styles.textCenter]}>{bp.totalDirectories || 0}</Text>
                </View>
                <View style={{ width: COL_WIDTHS.entityType }}>
                  <Text style={styles.cellText}>{entityType}</Text>
                </View>
                <View style={{ width: COL_WIDTHS.entityName }}>
                  <Text style={styles.cellText}>{entityName}</Text>
                </View>
                <View style={{ width: COL_WIDTHS.createdDate }}>
                  <Text style={styles.cellText}>{bp.createdAt ? new Date(bp.createdAt).toISOString().split('T')[0] : '-'}</Text>
                </View>
                <View style={{ width: COL_WIDTHS.createdBy }}>
                  <Text style={styles.cellText}>{bp.createdBy?.name || '-'}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Footer */}
        <View style={{ position: 'absolute', bottom: 20, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} fixed>
          <Text style={{ fontSize: 8, color: '#9CA3AF' }}>Beat Plan Report</Text>
          <Text style={{ fontSize: 8, color: '#9CA3AF' }} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
};

export default BeatPlanListPDF;
