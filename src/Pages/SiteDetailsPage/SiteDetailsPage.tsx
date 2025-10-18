import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import SiteDetailsContent from './SiteDetailsContent';
import { getSiteDetails, type FullSiteDetailsData } from '../../api/siteDetailsService';

const SiteDetailsPage: React.FC = () => {
    const { siteId } = useParams<{ siteId: string }>();
    const [siteDetails, setSiteDetails] = useState<FullSiteDetailsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!siteId) {
                setError("Site ID is missing.");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const data = await getSiteDetails(siteId);
                setSiteDetails(data);
            } catch (err) {
                setError('Failed to load site details. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [siteId]);

    return (
        <Sidebar>
            <SiteDetailsContent data={siteDetails} loading={loading} error={error} />
        </Sidebar>
    );
};

export default SiteDetailsPage;
