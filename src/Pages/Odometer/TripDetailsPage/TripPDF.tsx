import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { type TripOdometerDetails } from '../../../api/odometerService';

const styles = StyleSheet.create({
    page: {
        padding: 30,
        backgroundColor: '#FFFFFF',
        fontFamily: 'Helvetica'
    },
    // Header 
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#197ADC',
        paddingBottom: 10
    },
    titleGroup: {
        flexDirection: 'column',
    },
    title: {
        fontSize: 22,
        color: '#111827',
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    tripNumber: {
        fontSize: 14,
        color: '#111827',
        fontWeight: 'bold',
        marginTop: 4
    },
    reportInfo: {
        flexDirection: 'column',
        alignItems: 'flex-end'
    },
    reportLabel: {
        fontSize: 8,
        color: '#6B7280',
        marginBottom: 2
    },
    reportValue: {
        fontSize: 10,
        color: '#111827',
        fontWeight: 'bold'
    },

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

    // Employee Info Card Layout
    employeeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    infoGroup: {
        flexDirection: 'column',
        gap: 2
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

    // Trip Info Grid
    gridRow: {
        flexDirection: 'row',
        marginBottom: 10,
        gap: 20
    },
    gridCol: {
        flex: 1
    },

    // Images
    imageSection: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 5
    },
    imageContainer: {
        width: '48%',
        height: 220,
        backgroundColor: '#F3F4F6',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        position: 'relative'
    },
    badgeContainer: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#374151',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4
    },
    badgeText: {
        color: '#FFF',
        fontSize: 9,
        fontWeight: 'bold',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    }
});

interface TripPDFProps {
    trip: TripOdometerDetails;
}

// Helper
const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    // Handle specific string formats if needed, otherwise rely on Date parsing
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
};

// Helper: 21 Jan 2026, 11:47 pm
const formatDateTime = (timeString: string) => {
    if (!timeString) return '-';

    let date: Date | null = null;

    if (timeString.includes('T') || timeString.includes('-')) {
        const normalized = timeString.replace('t', 'T');
        date = new Date(normalized);
    } else if (timeString.includes(':')) {
        const [hours, minutes] = timeString.split(':');
        date = new Date();
        date.setHours(parseInt(hours, 10));
        date.setMinutes(parseInt(minutes, 10));
    }

    if (date && !isNaN(date.getTime())) {
        const dateStr = date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
        const timeStr = date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        }).toLowerCase();
        return `${dateStr}, ${timeStr}`;
    }

    return timeString.toLowerCase();
};

const TripPDF: React.FC<TripPDFProps> = ({ trip }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* Header */}
                <View style={styles.headerContainer}>
                    <View style={styles.titleGroup}>
                        <Text style={styles.title}>Trip Detail Report</Text>
                        <Text style={styles.tripNumber}>Trip #{trip.tripNumber}</Text>
                    </View>
                    <View style={styles.reportInfo}>
                        <Text style={styles.reportLabel}>Generated On</Text>
                        <Text style={styles.reportValue}>{formatDate(new Date().toISOString())}</Text>
                    </View>
                </View>

                {/* Employee Information Card */}
                <Text style={styles.sectionTitle}>Employee Information</Text>
                <View style={styles.card}>
                    <View style={styles.employeeRow}>
                        <View style={{ width: '25%' }}>
                            <Text style={styles.label}>Name</Text>
                            <Text style={styles.value}>{trip.employeeName}</Text>
                        </View>
                        <View style={{ width: '25%' }}>
                            <Text style={styles.label}>Role</Text>
                            <Text style={styles.value}>{trip.employeeRole || 'Staff'}</Text>
                        </View>
                        <View style={{ width: '25%' }}>
                            <Text style={styles.label}>Odometer Date</Text>
                            <Text style={styles.value}>{formatDate(trip.date)}</Text>
                        </View>
                        <View style={{ width: '25%' }}>
                            <Text style={styles.label}>Total Distance</Text>
                            <Text style={[styles.value, { color: '#2563EB' }]}>{trip.endReading - trip.startReading} KM</Text>
                        </View>
                    </View>
                </View>

                {/* Trip Information Card (Split Layout) */}
                <Text style={styles.sectionTitle}>Trip Information</Text>
                <View style={[styles.card, { flexDirection: 'row', padding: 0 }]}>

                    {/* LEFT COLUMN: START DETAILS */}
                    <View style={{ width: '50%', padding: 12, borderRightWidth: 1, borderRightColor: '#E5E7EB' }}>
                        <Text style={[styles.label, { color: '#059669', fontSize: 9, marginBottom: 8, fontWeight: 'bold' }]}>
                            ODOMETER START DETAILS
                        </Text>

                        <View style={{ marginBottom: 16 }}>
                            <Text style={styles.label}>Start Date and Time</Text>
                            <Text style={styles.value}>{formatDateTime(trip.startTime)}</Text>
                        </View>

                        <View style={{ marginBottom: 16 }}>
                            <Text style={styles.label}>Start Reading</Text>
                            <Text style={styles.value}>{trip.startReading} KM</Text>
                        </View>

                        <View style={{ marginBottom: 16 }}>
                            <Text style={styles.label}>Start Location</Text>
                            <Text style={[styles.value, { fontSize: 9, lineHeight: 1.2 }]}>
                                {trip.startLocation.address || 'Address not available'}
                            </Text>
                        </View>

                        <View>
                            <Text style={styles.label}>Start Description</Text>
                            <Text style={[styles.value, { fontWeight: 'normal' }]}>{trip.startDescription || '-'}</Text>
                        </View>
                    </View>

                    {/* RIGHT COLUMN: END DETAILS */}
                    <View style={{ width: '50%', padding: 12 }}>
                        <Text style={[styles.label, { color: '#DC2626', fontSize: 9, marginBottom: 8, fontWeight: 'bold' }]}>
                            ODOMETER END DETAILS
                        </Text>

                        <View style={{ marginBottom: 16 }}>
                            <Text style={styles.label}>End Date and Time</Text>
                            <Text style={styles.value}>{formatDateTime(trip.endTime)}</Text>
                        </View>

                        <View style={{ marginBottom: 16 }}>
                            <Text style={styles.label}>End Reading</Text>
                            <Text style={styles.value}>{trip.endReading} KM</Text>
                        </View>

                        <View style={{ marginBottom: 16 }}>
                            <Text style={styles.label}>End Location</Text>
                            <Text style={[styles.value, { fontSize: 9, lineHeight: 1.2 }]}>
                                {trip.endLocation.address || 'Address not available'}
                            </Text>
                        </View>

                        <View>
                            <Text style={styles.label}>End Description</Text>
                            <Text style={[styles.value, { fontWeight: 'normal' }]}>{trip.endDescription || '-'}</Text>
                        </View>
                    </View>

                </View>

                {/* Odometer Images */}
                {(trip.startImage || trip.endImage) && (
                    <>
                        <Text style={styles.sectionTitle}>Odometer Images</Text>
                        <View style={[styles.card, { flexDirection: 'row', gap: 10, padding: 10 }]}>
                            {trip.startImage && (
                                <View style={styles.imageContainer}>
                                    <Image src={trip.startImage} style={styles.image} />
                                    <View style={styles.badgeContainer}>
                                        <Text style={styles.badgeText}>Start Reading</Text>
                                    </View>
                                </View>
                            )}
                            {trip.endImage && (
                                <View style={styles.imageContainer}>
                                    <Image src={trip.endImage} style={styles.image} />
                                    <View style={styles.badgeContainer}>
                                        <Text style={styles.badgeText}>End Reading</Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    </>
                )}

            </Page>
        </Document>
    );
};

export default TripPDF;
