import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import PartyDetailsContent from './PartyDetailsContent';
import { getPartyDetails, type FullPartyDetailsData } from '../../api/partyDetailsService';

const PartyDetailsPage: React.FC = () => {
    const { partyId } = useParams<{ partyId: string }>();
    const [partyDetails, setPartyDetails] = useState<FullPartyDetailsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!partyId) {
                setError("Party ID is missing from the URL.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const data = await getPartyDetails(partyId);
                setPartyDetails(data);
            } catch (err) {
                setError('Failed to load party details. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [partyId]); // Re-run if the partyId in the URL changes

    return (
        <Sidebar>
            <PartyDetailsContent data={partyDetails} loading={loading} error={error} />
        </Sidebar>
    );
};

export default PartyDetailsPage;
