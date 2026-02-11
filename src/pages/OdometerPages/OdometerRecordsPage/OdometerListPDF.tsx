import React from 'react';
import { formatDisplayDate, formatDateToLocalISO } from '@/utils/dateUtils';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import type { OdometerStat } from '@/api/odometerService';
import { PDF_FONT_FAMILY } from '@/utils/pdfFonts';

// Consistent styles with MiscellaneousWorkListPDF
const styles = StyleSheet.create({
    page: { paddingTop: 20, paddingLeft: 20, paddingRight: 20, paddingBottom: 50, backgroundColor: '#FFFFFF', fontFamily: PDF_FONT_FAMILY },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#111827',
        paddingBottom: 10
    },
    titleGroup: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    title: { fontSize: 20, fontWeight: 'bold', color: '#111827', textTransform: 'uppercase' },
    subTitle: { fontSize: 10, color: '#6B7280', marginTop: 4, textTransform: 'uppercase' },
    reportInfo: { flexDirection: 'column', alignItems: 'flex-end' },
    reportLabel: { fontSize: 8, color: '#6B7280' },
    reportValue: { fontSize: 10, color: '#111827', fontWeight: 'bold' },
    tableContainer: {
        flexDirection: 'column',
        width: '100%',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#197ADC',
        borderBottomColor: '#E5E7EB',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 24,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderTopWidth: 1,
        borderLeftColor: '#E5E7EB',
        borderRightColor: '#E5E7EB',
        borderTopColor: '#E5E7EB',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomColor: '#F3F4F6',
        borderBottomWidth: 1,
        alignItems: 'stretch',
        minHeight: 24,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderLeftColor: '#E5E7EB',
        borderRightColor: '#E5E7EB',
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

interface OdometerListPDFProps {
    data: OdometerStat[];
}

const OdometerListPDF: React.FC<OdometerListPDFProps> = ({ data }) => (
    <Document>
        <Page size="A4" orientation="portrait" style={styles.page}>

            {/* Header Section */}
            {/* Header Section */}
            <View style={styles.headerContainer}>
                <View style={styles.titleGroup}>
                    <Text style={styles.title}>Odometer Records Report</Text>
                    <Text style={styles.subTitle}>Overview of Employee Travel History</Text>
                </View>
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
                <View style={styles.tableHeader} fixed>
                    <View style={{ width: '8%' }}><Text style={[styles.cellHeader, styles.textCenter]}>S.No</Text></View>
                    <View style={{ width: '25%' }}><Text style={styles.cellHeader}>Employee</Text></View>
                    <View style={{ width: '20%' }}><Text style={styles.cellHeader}>Role</Text></View>
                    <View style={{ width: '30%' }}><Text style={styles.cellHeader}>Date Range</Text></View>
                    <View style={{ width: '17%' }}><Text style={styles.cellHeader}>Total Distance</Text></View>
                </View>

                {/* Table Body */}
                {data.map((item, index) => {
                    const rowStyle = index % 2 === 0 ? styles.rowEven : styles.rowOdd;
                    const dateRangeStr = `${formatDateToLocalISO(new Date(item.dateRange.start))} to ${formatDateToLocalISO(new Date(item.dateRange.end))}`;

                    return (
                        <View style={[styles.tableRow, rowStyle]} key={item._id || index} wrap={false}>
                            <View style={{ width: '8%' }}>
                                <Text style={[styles.cellText, styles.textCenter]}>{index + 1}</Text>
                            </View>

                            <View style={{ width: '25%' }}>
                                <Text style={styles.cellText}>{item.employee?.name || 'N/A'}</Text>
                            </View>

                            <View style={{ width: '20%' }}>
                                <Text style={styles.cellText}>{item.employee?.role || 'Staff'}</Text>
                            </View>

                            <View style={{ width: '30%' }}>
                                <Text style={styles.cellText}>{dateRangeStr}</Text>
                            </View>

                            <View style={{ width: '17%' }}>
                                <Text style={styles.cellText}>{item.totalDistance.toLocaleString()} KM</Text>
                            </View>
                        </View>
                    );
                })}
            </View>

            {/* Footer */}
            <View style={{ position: 'absolute', bottom: 20, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} fixed>
                <Text style={{ fontSize: 8, color: '#9CA3AF' }}>Odometer Records Report</Text>
                <Text style={{ fontSize: 8, color: '#9CA3AF' }} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
            </View>
        </Page>
    </Document>
);

export default OdometerListPDF;
