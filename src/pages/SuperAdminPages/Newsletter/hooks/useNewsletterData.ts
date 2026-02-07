import { useState, useEffect, useCallback } from 'react';
import { newsletterAdminService } from '@/api/SuperAdmin/newsletterService';
import type { Subscriber, SubscriberStats } from '../types';
import toast from 'react-hot-toast';

export const useNewsletterData = () => {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [stats, setStats] = useState<SubscriberStats | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchSubscribers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await newsletterAdminService.getSubscribers();
            setSubscribers(response.data.data || []);
            setStats(response.data.stats || null);
        } catch {
            toast.error('Failed to load subscribers');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSubscribers();
    }, [fetchSubscribers]);

    return {
        subscribers,
        stats,
        loading,
        refresh: fetchSubscribers,
    };
};
