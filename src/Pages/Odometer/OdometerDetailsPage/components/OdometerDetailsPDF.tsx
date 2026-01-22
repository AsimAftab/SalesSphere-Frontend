import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import type { EmployeeOdometerDetails } from '../../../../api/odometerService';
import { formatDisplayDate, formatDateToLocalISO } from '../../../../utils/dateUtils';

// Consistent styles
const styles = StyleSheet.create({
    page: { padding: 30, backgroundColor: '#FFFFFF', fontFamily: 'Helvetica' },

    // Header
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
        alignItems: 'flex-start'
    },
    title: { fontSize: 20, fontWeight: 'bold', color: '#111827', textTransform: 'uppercase' },
    subTitle: { fontSize: 10, color: '#6B7280', marginTop: 4, textTransform: 'uppercase' },

    reportInfo: { flexDirection: 'column', alignItems: 'flex-end' },
    reportLabel: { fontSize: 8, color: '#6B7280' },
    reportValue: { fontSize: 10, color: '#111827', fontWeight: 'bold' },

    // Card Layout
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
        marginTop: 15,
        textTransform: 'uppercase'
    },
    card: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 4,
        backgroundColor: '#F9FAFB',
        padding: 12,
        marginBottom: 10
    },
    employeeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    label: {
        fontSize: 8,
        color: '#6B7280',
        textTransform: 'uppercase',
        marginBottom: 2
    },
    value: {
        fontSize: 10,
        color: '#111827',
        fontWeight: 'bold'
    },

    // Table
    tableContainer: {
        flexDirection: 'column',
        width: '100%',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        borderRadius: 2,
        marginTop: 5
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
        alignItems: 'center', // Changed to center for better alignment
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

interface OdometerDetailsPDFProps {
    data: EmployeeOdometerDetails;
}

const OdometerDetailsPDF: React.FC<OdometerDetailsPDFProps> = ({ data }) => (
    <Document>
        <Page size="A4" orientation="portrait" style={styles.page}>

            {/* Header Section */}
            <View style={styles.headerContainer}>
                <View style={styles.titleGroup}>
                    <Text style={styles.title}>Odometer Detail Report</Text>
                    <Text style={styles.subTitle}>Employee Daily Log</Text>
                </View>
                <View style={styles.reportInfo}>
                    <Text style={styles.reportLabel}>Generated On</Text>
                    <Text style={styles.reportValue}>{formatDisplayDate(new Date().toISOString())}</Text>
                    <Text style={styles.reportLabel}>Total Records</Text>
                    <Text style={styles.reportValue}>{data.dailyRecords.length}</Text>
                </View>
            </View>

            {/* Employee Information Card */}
            <Text style={styles.sectionTitle}>Employee Information</Text>
            <View style={styles.card}>
                <View style={styles.employeeRow}>
                    <View style={{ width: '20%' }}>
                        <Text style={styles.label}>Name</Text>
                        <Text style={styles.value}>{data.employee.name}</Text>
                    </View>
                    <View style={{ width: '25%' }}>
                        <Text style={styles.label}>Role</Text>
                        <Text style={styles.value}>{data.employee.role}</Text>
                    </View>
                    <View style={{ width: '30%' }}>
                        <Text style={styles.label}>Date Range</Text>
                        <Text style={styles.value}>
                            {formatDisplayDate(data.summary.dateRange.start)} - {formatDisplayDate(data.summary.dateRange.end)}
                        </Text>
                    </View>
                    <View style={{ width: '25%' }}>
                        <Text style={styles.label}>Total Distance</Text>
                        <Text style={[styles.value, { color: '#2563EB' }]}>{data.summary.totalDistance.toLocaleString()} KM</Text>
                    </View>
                </View>
            </View>

            {/* Table Section */}
            <View style={styles.tableContainer}>
                {/* Table Header */}
                <View style={styles.tableHeader}>
                    <View style={{ width: '10%' }}><Text style={[styles.cellHeader, styles.textCenter]}>S.No</Text></View>
                    <View style={{ width: '40%' }}><Text style={styles.cellHeader}>Date</Text></View>
                    <View style={{ width: '25%' }}><Text style={[styles.cellHeader, styles.textCenter]}>Total Distance</Text></View>
                    <View style={{ width: '25%' }}><Text style={[styles.cellHeader, styles.textCenter]}>No. of Trips</Text></View>
                </View>

                {/* Table Body */}
                {data.dailyRecords.map((item, index) => {
                    const rowStyle = index % 2 === 0 ? styles.rowEven : styles.rowOdd;

                    // Format Date to YYYY-MM-DD
                    const dateStr = formatDateToLocalISO(new Date(item.date));

                    return (
                        <View style={[styles.tableRow, rowStyle]} key={item.id || index}>
                            <View style={{ width: '10%' }}>
                                <Text style={[styles.cellText, styles.textCenter]}>{index + 1}</Text>
                            </View>

                            <View style={{ width: '40%' }}>
                                <Text style={styles.cellText}>{dateStr}</Text>
                            </View>

                            <View style={{ width: '25%' }}>
                                <Text style={[styles.cellText, styles.textCenter]}>{item.totalKm} KM</Text>
                            </View>

                            <View style={{ width: '25%' }}>
                                <Text style={[styles.cellText, styles.textCenter]}>{item.tripCount}</Text>
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

export default OdometerDetailsPDF;
