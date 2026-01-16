import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import type { EmployeeOdometerDetails } from '../../../../api/odometerService';

// Consistent styles
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
    subHeader: {
        fontSize: 12,
        color: '#374151',
        marginBottom: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
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

interface OdometerDetailsPDFProps {
    data: EmployeeOdometerDetails;
}

const OdometerDetailsPDF: React.FC<OdometerDetailsPDFProps> = ({ data }) => (
    <Document>
        <Page size="A4" orientation="portrait" style={styles.page}>

            {/* Header Section */}
            <View style={styles.headerContainer}>
                <View>
                    <Text style={styles.title}>Odometer Details</Text>
                    <Text style={{ fontSize: 10, color: '#6B7280', marginTop: 4 }}>
                        {data.employee.name} | {data.employee.role}
                    </Text>
                </View>
                <View style={styles.reportInfo}>
                    <Text style={styles.reportLabel}>Generated On</Text>
                    <Text style={styles.reportValue}>{new Date().toLocaleDateString('en-GB')}</Text>
                    <Text style={styles.reportLabel}>Total Distance</Text>
                    <Text style={styles.reportValue}>{data.summary.totalDistance.toLocaleString()} KM</Text>
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
                    const date = new Date(item.date);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    const dateStr = `${year}-${month}-${day}`;

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
