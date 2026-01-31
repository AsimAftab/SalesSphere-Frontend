import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMyStatusToday, checkInEmployee, checkOutEmployee } from '../../../api/attendanceService';
import toast from 'react-hot-toast';
import { DateTime } from 'luxon';

export const useWebAttendance = () => {
    const queryClient = useQueryClient();
    const [currentTime, setCurrentTime] = useState(DateTime.now());

    // Update time every minute for UI state calculation
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(DateTime.now());
        }, 60000); // 1 minute
        return () => clearInterval(timer);
    }, []);

    // 1. Fetch Today's Status
    const { data: statusData, isLoading } = useQuery({
        queryKey: ['myAttendanceStatus'],
        queryFn: fetchMyStatusToday,
        refetchInterval: 1000 * 60 * 5, // Refresh every 5 mins
    });

    // 2. Mutations
    const checkInMutation = useMutation({
        mutationFn: checkInEmployee,
        onSuccess: () => {
            toast.success('Checked in successfully!');
            queryClient.invalidateQueries({ queryKey: ['myAttendanceStatus'] });
            queryClient.invalidateQueries({ queryKey: ['attendance'] }); // Refresh main table
        },
        onError: (err: Error) => {
            toast.error(err.message || 'Failed to check in');
        }
    });

    const checkOutMutation = useMutation({
        mutationFn: checkOutEmployee,
        onSuccess: () => {
            toast.success('Checked out successfully!');
            queryClient.invalidateQueries({ queryKey: ['myAttendanceStatus'] });
            queryClient.invalidateQueries({ queryKey: ['attendance'] });
        },
        onError: (err: Error) => {
            toast.error(err.message || 'Failed to check out');
        }
    });

    // 3. Logic & State Calculation
    const attendanceState = useMemo(() => {
        if (!statusData || !statusData.data) {
            // No record yet -> Can Check In (if time permits)
            return { type: 'CHECK_IN' };
        }
        const record = statusData.data;

        if (record.checkInTime && !record.checkOutTime) {
            // Checked In -> Can Check Out
            return { type: 'CHECK_OUT' };
        }

        if (record.checkInTime && record.checkOutTime) {
            // Completed
            return { type: 'COMPLETED' };
        }

        return { type: 'CHECK_IN' };
    }, [statusData]);

    // 4. Time Window Validation
    // "1st checkin button enable 2 hours before check in time ... allow 30 min grace period"
    // "checkin only enable 2 hours before check in time" should logically mean enabled FROM (Time - 2hr) TO (Time + 30min)
    const isCheckInEnabled = useMemo(() => {
        if (attendanceState.type !== 'CHECK_IN') return false;
        if (!statusData?.organizationCheckInTime) return false;

        const timezone = statusData.organizationTimezone || 'Asia/Kolkata';
        // Note: We're comparing using client time, relying on browser being reasonably synced or converting logic.
        // Better to parse org time in context of 'today'

        try {
            const [h, m] = statusData.organizationCheckInTime.split(':').map(Number);
            const now = DateTime.now().setZone(timezone);
            const checkInTime = now.set({ hour: h, minute: m, second: 0 });

            const startWindow = checkInTime.minus({ hours: 2 });
            const endWindow = checkInTime.plus({ minutes: 30 }); // Grace period

            return now >= startWindow && now <= endWindow;
        } catch (e) {
            console.error(e);
            return false;
        }
    }, [attendanceState, statusData, currentTime]);

    // "2nd half day checkout enable before 30 mins and allow 15 min grace period afterwards"
    const canHalfDayCheckOut = useMemo(() => {
        if (attendanceState.type !== 'CHECK_OUT') return false;
        if (!statusData?.organizationHalfDayCheckOutTime) return false;

        const timezone = statusData.organizationTimezone || 'Asia/Kolkata';
        try {
            const [h, m] = statusData.organizationHalfDayCheckOutTime.split(':').map(Number);
            const now = DateTime.now().setZone(timezone);
            const halfDayTime = now.set({ hour: h, minute: m, second: 0 });

            // "enable before 30 mins" -> start = time - 30m
            // "allow 15 min grace period afterwards" -> end = time + 15m
            const startWindow = halfDayTime.minus({ minutes: 30 });
            const endWindow = halfDayTime.plus({ minutes: 15 });

            return now >= startWindow && now <= endWindow;
        } catch (e) {
            return false;
        }
    }, [attendanceState, statusData, currentTime]);

    // "3rd checkout button enable before 30 min only" (Assumed: enable from 30min before checkout time onwards)
    // Actually typically "enable before 30 mins" means "starts being enabled 30 mins before". 
    // Is there an end time? Usually for full day checkout, you can checkout anytime after. 
    // Re-reading: "checkout button enable before 30 min only". Logic: Enable if time >= (CheckoutTime - 30min)
    const canFullDayCheckOut = useMemo(() => {
        if (attendanceState.type !== 'CHECK_OUT') return false;
        if (!statusData?.organizationCheckOutTime) return false;

        const timezone = statusData.organizationTimezone || 'Asia/Kolkata';
        try {
            const [h, m] = statusData.organizationCheckOutTime.split(':').map(Number);
            const now = DateTime.now().setZone(timezone);
            const checkOutTime = now.set({ hour: h, minute: m, second: 0 });

            const startWindow = checkOutTime.minus({ minutes: 30 });

            // Assuming no upper limit for full day checkout unless specified, or maybe end of day?
            return now >= startWindow;
        } catch (e) {
            return false;
        }
    }, [attendanceState, statusData, currentTime]);

    // Format time window message for UI
    const timeWindowMessage = useMemo(() => {
        const timezone = statusData?.organizationTimezone || 'Asia/Kolkata';
        const now = DateTime.now().setZone(timezone);

        if (attendanceState.type === 'CHECK_IN') {
            if (!statusData?.organizationCheckInTime) return 'Shift time not configured';
            try {
                const [h, m] = statusData.organizationCheckInTime.split(':').map(Number);
                const checkInTime = now.set({ hour: h, minute: m, second: 0 });
                const start = checkInTime.minus({ hours: 2 });
                const end = checkInTime.plus({ minutes: 30 });
                return `Check-in allowed: ${start.toFormat('hh:mm a')} - ${end.toFormat('hh:mm a')}`;
            } catch { return ''; }
        }

        if (attendanceState.type === 'CHECK_OUT') {
            const parts = [];

            // Half Day Info
            if (statusData?.organizationHalfDayCheckOutTime) {
                try {
                    const [h, m] = statusData.organizationHalfDayCheckOutTime.split(':').map(Number);
                    const halfTime = now.set({ hour: h, minute: m, second: 0 });
                    const start = halfTime.minus({ minutes: 30 });
                    const end = halfTime.plus({ minutes: 15 });
                    parts.push(`Half-day: ${start.toFormat('hh:mm a')} - ${end.toFormat('hh:mm a')}`);
                } catch { }
            }

            // Full Day Info
            if (statusData?.organizationCheckOutTime) {
                try {
                    const [h, m] = statusData.organizationCheckOutTime.split(':').map(Number);
                    const fullTime = now.set({ hour: h, minute: m, second: 0 });
                    const start = fullTime.minus({ minutes: 30 });
                    parts.push(`Checkout from: ${start.toFormat('hh:mm a')}`);
                } catch { }
            }

            return parts.length > 0 ? parts.join(' | ') : 'Checkout times not configured';
        }

        return '';
    }, [attendanceState.type, statusData]);

    // Helper: Reverse Geocode
    const getAddressFromCoords = async (lat: number, lng: number): Promise<string> => {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        if (!apiKey) return `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;

        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
            );
            const data = await response.json();
            if (data.status === 'OK' && data.results?.[0]) {
                return data.results[0].formatted_address;
            } else {
                return `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
            }
        } catch (error) {
            return `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
        }
    };

    // 5. Actions
    const handleCheckIn = () => {
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const address = await getAddressFromCoords(latitude, longitude);

                checkInMutation.mutate({
                    latitude,
                    longitude,
                    address,
                });
            },
            () => {
                toast.error('Location permission denied. Please enable location to check in.');
            }
        );
    };

    const handleCheckOut = (isHalfDay: boolean = false) => {
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const address = await getAddressFromCoords(latitude, longitude);

                checkOutMutation.mutate({
                    latitude,
                    longitude,
                    address,
                    isHalfDay
                });
            },
            () => {
                toast.error('Location permission denied. Please enable location to check out.');
            }
        );
    };

    return {
        isLoading,
        attendanceState,
        isCheckInEnabled,
        canHalfDayCheckOut,
        canFullDayCheckOut,
        handleCheckIn,
        handleCheckOut,
        checkInPending: checkInMutation.isPending,
        checkOutPending: checkOutMutation.isPending,
        statusData,
        timeWindowMessage
    };
};
