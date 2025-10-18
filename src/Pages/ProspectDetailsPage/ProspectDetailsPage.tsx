import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import ProspectDetailsContent from './ProspectDetailsContent';
import { getProspectDetails, type FullProspectDetailsData } from '../../api/prospectDetailsService';

const ProspectDetailsPage: React.FC = () => {
    const { prospectId } = useParams<{ prospectId: string }>();
    const [prospectDetails, setProspectDetails] = useState<FullProspectDetailsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            // Use a placeholder ID if none is in the URL, as our mock service doesn't use it yet
            const idToFetch = prospectId || 'prospect-001';

            try {
                setLoading(true);
                const data = await getProspectDetails(idToFetch);
                setProspectDetails(data);
            } catch (err) {
                setError('Failed to load prospect details. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [prospectId]); // Re-fetch data if the prospectId from the URL changes

    return (
        <Sidebar>
            <ProspectDetailsContent data={prospectDetails} loading={loading} error={error} />
        </Sidebar>
    );
};

export default ProspectDetailsPage;
