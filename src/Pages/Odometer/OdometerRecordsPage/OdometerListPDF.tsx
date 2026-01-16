import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import type { OdometerStat } from '../../../api/odometerService';

// Consistent styles with MiscellaneousWorkListPDF
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

interface OdometerListPDFProps {
    data: OdometerStat[];
}

const OdometerListPDF: React.FC<OdometerListPDFProps> = ({ data }) => (
    <Document>
        <Page size="A4" orientation="landscape" style={styles.page}>

            {/* Header Section */}
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Odometer Records Report</Text>
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
                    <View style={{ width: '8%' }}><Text style={[styles.cellHeader, styles.textCenter]}>S.No</Text></View>
                    <View style={{ width: '25%' }}><Text style={styles.cellHeader}>Employee</Text></View>
                    <View style={{ width: '20%' }}><Text style={styles.cellHeader}>Role</Text></View>
                    <View style={{ width: '30%' }}><Text style={styles.cellHeader}>Date Range</Text></View>
                    <View style={{ width: '17%' }}><Text style={styles.cellHeader}>Total Distance</Text></View>
                </View>

                {/* Table Body */}
                {data.map((item, index) => {
                    const rowStyle = index % 2 === 0 ? styles.rowEven : styles.rowOdd;

                    const formatDate = (dateString: string) => {
                        return new Date(dateString).toLocaleDateString('en-GB', {
                            day: '2-digit', month: 'short', year: 'numeric'
                        });
                    };
                    const dateRangeStr = `${formatDate(item.dateRange.start)} - ${formatDate(item.dateRange.end)}`;

                    return (
                        <View style={[styles.tableRow, rowStyle]} key={item._id || index}>
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

export default OdometerListPDF;
