import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { Collection } from '../../api/collectionService';

// PDF Styles
const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 10,
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 20,
        borderBottom: 2,
        borderBottomColor: '#163355',
        paddingBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#163355',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 10,
        color: '#666',
    },
    table: {
        width: '100%',
        marginTop: 10,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        borderBottomStyle: 'solid',
        alignItems: 'center',
        minHeight: 30,
    },
    tableHeader: {
        backgroundColor: '#163355',
        color: '#FFFFFF',
        fontWeight: 'bold',
        paddingVertical: 8,
    },
    tableCell: {
        padding: 5,
        fontSize: 9,
    },
    col1: { width: '5%' }, // S.No
    col2: { width: '20%' }, // Party
    col3: { width: '12%' }, // Amount
    col4: { width: '15%' }, // Payment Mode
    col5: { width: '13%' }, // Date
    col6: { width: '15%' }, // Created By
    col7: { width: '20%' }, // Notes
    footer: {
        marginTop: 20,
        paddingTop: 10,
        borderTop: 2,
        borderTopColor: '#163355',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    totalLabel: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    totalAmount: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#163355',
    },
    badge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        fontSize: 8,
        fontWeight: 'bold',
    },
    badgeCash: {
        backgroundColor: '#D1FAE5',
        color: '#065F46',
    },
    badgeCheque: {
        backgroundColor: '#DBEAFE',
        color: '#1E40AF',
    },
    badgeBank: {
        backgroundColor: '#E9D5FF',
        color: '#6B21A8',
    },
    badgeQR: {
        backgroundColor: '#E0E7FF',
        color: '#3730A3',
    },
});

interface CollectionPDFReportProps {
    collections: Collection[];
}

const CollectionPDFReport: React.FC<CollectionPDFReportProps> = ({ collections }) => {
    const formatCurrency = (amount: number) => {
        return `₹ ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const totalAmount = collections.reduce((sum, c) => sum + c.paidAmount, 0);

    const getPaymentModeBadgeStyle = (mode: string) => {
        switch (mode) {
            case 'Cash':
                return styles.badgeCash;
            case 'Cheque':
                return styles.badgeCheque;
            case 'Bank Transfer':
                return styles.badgeBank;
            case 'QR Pay':
                return styles.badgeQR;
            default:
                return styles.badgeCash;
        }
    };

    return (
        <Document>
            <Page size="A4" orientation="landscape" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Collection Report</Text>
                    <Text style={styles.subtitle}>
                        Generated on {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </Text>
                    <Text style={styles.subtitle}>Total Records: {collections.length}</Text>
                </View>

                {/* Table */}
                <View style={styles.table}>
                    {/* Table Header */}
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[styles.tableCell, styles.col1]}>#</Text>
                        <Text style={[styles.tableCell, styles.col2]}>Party Name</Text>
                        <Text style={[styles.tableCell, styles.col3]}>Amount</Text>
                        <Text style={[styles.tableCell, styles.col4]}>Payment Mode</Text>
                        <Text style={[styles.tableCell, styles.col5]}>Received Date</Text>
                        <Text style={[styles.tableCell, styles.col6]}>Created By</Text>
                        <Text style={[styles.tableCell, styles.col7]}>Notes</Text>
                    </View>

                    {/* Table Rows */}
                    {collections.map((collection, index) => (
                        <View key={collection.id} style={styles.tableRow}>
                            <Text style={[styles.tableCell, styles.col1]}>{index + 1}</Text>
                            <Text style={[styles.tableCell, styles.col2]}>{collection.partyName}</Text>
                            <Text style={[styles.tableCell, styles.col3]}>{formatCurrency(collection.paidAmount)}</Text>
                            <View style={[styles.tableCell, styles.col4]}>
                                <Text style={[styles.badge, getPaymentModeBadgeStyle(collection.paymentMode)]}>
                                    {collection.paymentMode}
                                </Text>
                                {collection.paymentMode === 'Cheque' && collection.chequeStatus && (
                                    <Text style={{ fontSize: 7, marginTop: 2, color: '#666' }}>
                                        {collection.chequeStatus}
                                    </Text>
                                )}
                            </View>
                            <Text style={[styles.tableCell, styles.col5]}>{formatDate(collection.receivedDate)}</Text>
                            <Text style={[styles.tableCell, styles.col6]}>{collection.createdBy.name}</Text>
                            <Text style={[styles.tableCell, styles.col7]}>{collection.notes || '-'}</Text>
                        </View>
                    ))}
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
