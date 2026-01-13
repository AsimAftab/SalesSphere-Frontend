import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { Collection } from '../../api/collectionService';

// PDF Styles
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
        fontWeight: 'bold',
        color: '#111827',
        textTransform: 'uppercase',
    },
    reportInfo: {
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    reportLabel: { fontSize: 8, color: '#6B7280' },
    reportValue: { fontSize: 10, color: '#111827', fontWeight: 'bold' },

    // Table Structure
    tableContainer: {
        flexDirection: 'column',
        width: '100%',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        borderRadius: 2,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#197ADC', // Matches secondary theme color
        borderBottomColor: '#E5E7EB',
        borderBottomWidth: 1,
        alignItems: 'center',
        minHeight: 24,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomColor: '#F3F4F6',
        borderBottomWidth: 1,
        alignItems: 'stretch',
        minHeight: 24,
    },
    rowEven: { backgroundColor: '#FFFFFF' },
    rowOdd: { backgroundColor: '#FAFAFA' },

    // Cell Styling
    cellHeader: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#FFFFFF',
        paddingHorizontal: 4,
        paddingVertical: 5,
        textAlign: 'left',
    },
    cellText: {
        fontSize: 8,
        color: '#1F2937',
        paddingHorizontal: 4,
        paddingVertical: 5,
        textAlign: 'left', // All fields left aligned
        flexWrap: 'wrap',
    },
    textCenter: { textAlign: 'center' },
    textRight: { textAlign: 'right' },

    // Status / Mode Text Colors (Replacing Badges to match Expenses Report Image Style)
    textCash: { color: '#10B981' }, // Green
    textCheque: { color: '#F59E0B' }, // Orange
    textBank: { color: '#3B82F6' }, // Blue
    textQR: { color: '#8B5CF6' }, // Purple
    textDefault: { color: '#1F2937' },

    footer: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#111827',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10
    },
    totalLabel: { fontSize: 10, fontWeight: 'bold', color: '#111827' },
    totalAmount: { fontSize: 10, fontWeight: 'bold', color: '#197ADC' },
});

interface CollectionPDFReportProps {
    collections: Collection[];
}

const CollectionPDFReport: React.FC<CollectionPDFReportProps> = ({ collections }) => {
    const formatCurrency = (amount: number) => {
        return `RS ${amount.toLocaleString('en-IN')}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // YYYY-MM-DD
    };

    const totalAmount = collections.reduce((sum, c) => sum + c.paidAmount, 0);

    return (
        <Document>
            <Page size="A4" orientation="landscape" style={styles.page}>

                {/* Report Header Section */}
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>COLLECTIONS REPORT</Text>
                    <View style={styles.reportInfo}>
                        <Text style={styles.reportLabel}>Generated On</Text>
                        <Text style={styles.reportValue}>{new Date().toLocaleDateString()}</Text>
                        <Text style={styles.reportLabel}>Total Records</Text>
                        <Text style={styles.reportValue}>{collections.length}</Text>
                    </View>
                </View>

                {/* Main Table Section */}
                <View style={styles.tableContainer}>
                    {/* Table Header Row */}
                    <View style={styles.tableHeader}>
                        <View style={{ width: '10%' }}><Text style={[styles.cellHeader, styles.textCenter]}>S.No</Text></View>
                        <View style={{ width: '20%' }}><Text style={styles.cellHeader}>Party Name</Text></View>
                        <View style={{ width: '20%' }}><Text style={styles.cellHeader}>Amount Received</Text></View>
                        <View style={{ width: '15%' }}><Text style={styles.cellHeader}>Payment Mode</Text></View>
                        <View style={{ width: '15%' }}><Text style={styles.cellHeader}>Received Date</Text></View>
                        <View style={{ width: '20%' }}><Text style={styles.cellHeader}>Created By</Text></View>
                    </View>

                    {/* Dynamic Data Rows */}
                    {collections.map((collection, index) => {
                        const rowStyle = index % 2 === 0 ? styles.rowEven : styles.rowOdd;

                        return (
                            <View key={collection.id} style={[styles.tableRow, rowStyle]}>
                                <View style={{ width: '10%' }}>
                                    <Text style={[styles.cellText, styles.textCenter]}>{index + 1}</Text>
                                </View>

                                <View style={{ width: '20%' }}>
                                    <Text style={styles.cellText}>{collection.partyName}</Text>
                                </View>

                                <View style={{ width: '20%' }}>
                                    <Text style={styles.cellText}>{formatCurrency(collection.paidAmount)}</Text>
                                </View>

                                <View style={{ width: '15%' }}>
                                    <Text style={styles.cellText}>
                                        {collection.paymentMode}
                                    </Text>
                                </View>

                                <View style={{ width: '15%' }}>
                                    <Text style={styles.cellText}>{formatDate(collection.receivedDate)}</Text>
                                </View>

                                <View style={{ width: '20%' }}>
                                    <Text style={styles.cellText}>{collection.createdBy.name}</Text>
                                </View>
                            </View>
                        );
                    })}
                </View>

                {/* Footer with Total */}
                <View style={styles.footer}>
                    <Text style={styles.totalLabel}>Total Collections:</Text>
                    <Text style={styles.totalAmount}>{formatCurrency(totalAmount)}</Text>
                </View>

            </Page>
        </Document>
    );
};

export default CollectionPDFReport;
