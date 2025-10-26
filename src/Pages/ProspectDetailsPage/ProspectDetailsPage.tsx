// src/pages/prospects/ProspectDetailsPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import ProspectDetailsContent from './ProspectDetailsContent';
import { type Prospect } from '../../api/prospectService'; // Get the type from the main service
import { getProspectById } from '../../api/prospectDetailsService'; // Get the function from the details service


const ProspectDetailsPage: React.FC = () => {
    const { prospectId } = useParams<{ prospectId: string }>();
    const [prospect, setProspect] = useState<Prospect | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Use useCallback to memoize the fetch function
    const fetchData = useCallback(async () => {
        if (!prospectId) {
            setError('Prospect ID not found in URL.');
            setLoading(false);
            return;
        }
        console.log(`ProspectDetailPage: Fetching data for ID: ${prospectId}`);
        try {
            setLoading(true);
            setError(null);
            const data = await getProspectById(prospectId); // Using async function
            if (data) {
                setProspect(data);
                console.log("ProspectDetailPage: Data fetched successfully:", data);
            } else {
                console.warn(`ProspectDetailPage: Prospect with ID ${prospectId} not found.`);
                setError(`Prospect with ID ${prospectId} not found.`);
                setProspect(null); // Ensure data is cleared on not found
            }
        } catch (err) {
            setError('Failed to load prospect details. Please try again.');
            console.error("ProspectDetailPage: Fetch error:", err);
            setProspect(null); // Ensure data is cleared on error
        } finally {
            setLoading(false);
        }
    }, [prospectId]); // Dependency is just prospectId

    // Fetch data on mount and when prospectId changes
    useEffect(() => {
        fetchData();
    }, [fetchData]); // useEffect dependency is the memoized fetchData function

    // The refresh handler is now the same as the initial fetch function
    const handleRefresh = () => {
        fetchData();
    };

    return (
        <Sidebar>
            <ProspectDetailsContent
                data={prospect}
                loading={loading}
                error={error}
                onDataRefresh={handleRefresh} // Pass the refresh handler
            />
        </Sidebar>
    );
};

export default ProspectDetailsPage;