import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import SiteDetailsContent from './SiteDetailsContent';
import { getSiteDetails, type FullSiteDetailsData } from '../../api/services/site/siteDetailsService';

const SiteDetailsPage: React.FC = () => {
    const { siteId } = useParams<{ siteId: string }>();
    const [siteDetails, setSiteDetails] = useState<FullSiteDetailsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 1. Define the data fetching function as a useCallback hook
    const fetchData = useCallback(async () => {
        if (!siteId) {
            setError("Site ID is missing.");
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError(null); // Clear previous errors
            const data = await getSiteDetails(siteId);
            setSiteDetails(data);
        } catch (err) {
            setError('Failed to load site details. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [siteId]); // Dependency array includes siteId

    // 2. Call fetchData once on component mount or when siteId changes
    useEffect(() => {
        fetchData();
    }, [fetchData]); // Dependency array includes fetchData

    // 3. Define the refresh handler to pass to the child component
    // Since fetchData is already a useCallback hook, we can pass it directly
    const handleDataRefresh = fetchData; 

    return (
        <Sidebar>
            {/* 4. PASS THE MISSING PROP */}
            <SiteDetailsContent 
                data={siteDetails} 
                loading={loading} 
                error={error} 
                onDataRefresh={handleDataRefresh} 
            />
        </Sidebar>
    );
};

export default SiteDetailsPage;