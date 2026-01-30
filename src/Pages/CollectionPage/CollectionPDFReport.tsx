import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { Collection } from '../../api/collectionService';
import { formatDisplayDate } from '../../utils/dateUtils';
import { PDF_FONT_FAMILY } from '../../utils/pdfFonts';

// PDF Styles
const styles = StyleSheet.create({
    page: {
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 50,
        backgroundColor: '#FFFFFF',
        fontFamily: PDF_FONT_FAMILY,
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
    titleGroup: { flexDirection: 'column' },
    subTitle: { fontSize: 10, color: '#6B7280', marginTop: 4, textTransform: 'uppercase' },
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
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#197ADC', // Matches secondary theme color
        borderBottomColor: '#E5E7EB',
        borderBottomWidth: 1,
        alignItems: 'center',
        minHeight: 24,
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
    pageNumber: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 8,
        color: '#9CA3AF',
    },
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
                    <View style={styles.titleGroup}>
                        <Text style={styles.title}>Collections Report</Text>
                        <Text style={styles.subTitle}>Summary of All Payment Collections</Text>
                    </View>
                    <View style={styles.reportInfo}>
                        <Text style={styles.reportLabel}>Generated On</Text>
                        <Text style={styles.reportValue}>{formatDisplayDate(new Date().toISOString())}</Text>
                        <Text style={styles.reportLabel}>Total Records</Text>
                        <Text style={styles.reportValue}>{collections.length}</Text>
                        <Text style={styles.reportLabel}>Total Amount</Text>
                        <Text style={styles.totalAmount}>{formatCurrency(totalAmount)}</Text>
                    </View>
                </View>

                {/* Main Table Section */}
                <View style={styles.tableContainer}>
                    {/* Table Header Row */}
                    <View style={styles.tableHeader} fixed>
                        <View style={{ width: '5%' }}><Text style={[styles.cellHeader, styles.textCenter]}>S.No</Text></View>
                        <View style={{ width: '12%' }}><Text style={styles.cellHeader}>Party Name</Text></View>
                        <View style={{ width: '10%' }}><Text style={styles.cellHeader}>Amount</Text></View>
                        <View style={{ width: '10%' }}><Text style={styles.cellHeader}>Payment Mode</Text></View>
                        <View style={{ width: '10%' }}><Text style={styles.cellHeader}>Received Date</Text></View>
                        <View style={{ width: '10%' }}><Text style={styles.cellHeader}>Bank Name</Text></View>
                        <View style={{ width: '10%' }}><Text style={styles.cellHeader}>Cheque No.</Text></View>
                        <View style={{ width: '9%' }}><Text style={styles.cellHeader}>Cheque Date</Text></View>
                        <View style={{ width: '8%' }}><Text style={styles.cellHeader}>Cheque Status</Text></View>
                        <View style={{ width: '8%' }}><Text style={styles.cellHeader}>Notes</Text></View>
                        <View style={{ width: '8%' }}><Text style={styles.cellHeader}>Created By</Text></View>
                    </View>

                    {/* Dynamic Data Rows */}
                    {collections.map((collection, index) => {
                        const rowStyle = index % 2 === 0 ? styles.rowEven : styles.rowOdd;

                        return (
                            <View key={collection.id} style={[styles.tableRow, rowStyle]} wrap={false}>
                                <View style={{ width: '5%' }}>
                                    <Text style={[styles.cellText, styles.textCenter]}>{index + 1}</Text>
                                </View>

                                <View style={{ width: '12%' }}>
                                    <Text style={styles.cellText}>{collection.partyName}</Text>
                                </View>

                                <View style={{ width: '10%' }}>
                                    <Text style={styles.cellText}>{formatCurrency(collection.paidAmount)}</Text>
                                </View>

                                <View style={{ width: '10%' }}>
                                    <Text style={styles.cellText}>
                                        {collection.paymentMode}
                                    </Text>
                                </View>

                                <View style={{ width: '10%' }}>
                                    <Text style={styles.cellText}>{formatDate(collection.receivedDate)}</Text>
                                </View>

                                <View style={{ width: '10%' }}>
                                    <Text style={styles.cellText}>{collection.bankName || '-'}</Text>
                                </View>

                                <View style={{ width: '10%' }}>
                                    <Text style={styles.cellText}>
                                        {collection.paymentMode === 'Cheque' ? (collection.chequeNumber || '-') : '-'}
                                    </Text>
                                </View>

                                <View style={{ width: '9%' }}>
                                    <Text style={styles.cellText}>
                                        {collection.paymentMode === 'Cheque' && collection.chequeDate ? formatDate(collection.chequeDate) : '-'}
                                    </Text>
                                </View>

                                <View style={{ width: '8%' }}>
                                    <Text style={styles.cellText}>
                                        {collection.paymentMode === 'Cheque' ? (collection.chequeStatus || '-') : '-'}
                                    </Text>
                                </View>

                                <View style={{ width: '8%' }}>
                                    <Text style={styles.cellText}>{collection.notes || '-'}</Text>
                                </View>

                                <View style={{ width: '8%' }}>
                                    <Text style={styles.cellText}>{collection.createdBy.name}</Text>
                                </View>
                            </View>
                        );
                    })}
                </View>

                {/* Page Number Footer */}
                <View style={{ position: 'absolute', bottom: 20, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} fixed>
                    <Text style={{ fontSize: 8, color: '#9CA3AF' }}>Collections Report</Text>
                    <Text style={{ fontSize: 8, color: '#9CA3AF' }} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
                </View>

            </Page>
        </Document>
    );
};

export default CollectionPDFReport;
