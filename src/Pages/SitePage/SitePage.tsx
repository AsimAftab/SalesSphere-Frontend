// src/pages/sites/SitePage.tsx

import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import SiteContent from './SiteContent';
import { getSites } from '../../api/siteService'; // Use the new API service
import toast from 'react-hot-toast';

const SitePage: React.FC = () => {
    // 1. Fetch data using useQuery
    const {
        data: siteData,
        isLoading,
        error,
        isError,
    } = useQuery({
        queryKey: ['sites'], // Unique key for this query
        queryFn: getSites,  // The function to fetch the data
    });

    // 2. (Optional) Show a toast on error
    useEffect(() => {
        if (isError && error) {
            toast.error(error.message || 'Failed to load site data.');
        }
    }, [isError, error]);

    return (
        <Sidebar>
            <SiteContent
                data={siteData || null}
                loading={isLoading}
                error={error instanceof Error ? error.message : null}
            />
        </Sidebar>
    );
};

export default SitePage;