import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { useParams } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import PartyDetailsContent from './PartyDetailsContent';
// Assuming getMockPartyDetails can handle async simulation or is replaced by an async function
import { getMockPartyDetails, type FullPartyDetailsData } from '../../api/services/party/partyDetailsService';
import './PartyDetailsPage.css';

const PartyDetailsPage: React.FC = () => {
    const { partyId } = useParams<{ partyId: string }>();

    // 1. Use State for data, loading, and error
    const [partyDetails, setPartyDetails] = useState<FullPartyDetailsData | null>(null);
    const [loading, setLoading] = useState(true); // Start loading initially
    const [error, setError] = useState<string | null>(null);

    // 2. Function to fetch or refresh data
    const fetchPartyData = () => {
        // Basic check
        if (!partyId) {
            setError("Party ID is missing from the URL.");
            setLoading(false);
            setPartyDetails(null);
            return;
        }

        // Simulate async fetching for mock data
        setLoading(true);
        setError(null);
        // Assuming getMockPartyDetails might be async or needs simulation
        // If getMockPartyDetails is purely synchronous, wrap it
        Promise.resolve(getMockPartyDetails(partyId))
            .then(details => {
                if (details) {
                    setPartyDetails(details);
                } else {
                    setError("Party not found.");
                    setPartyDetails(null);
                }
            })
            .catch(err => {
                console.error("Error fetching mock party details:", err);
                setError("Failed to load party details.");
                setPartyDetails(null);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // 3. Fetch data on mount and when partyId changes
    useEffect(() => {
        fetchPartyData();
    }, [partyId]); // Dependency array includes partyId

    // 4. Define the refresh handler function (it just calls fetchPartyData again)
    const handleRefresh = () => {
        fetchPartyData();
    };

    return (
        <Sidebar>
            {/* Pass state variables and the refresh handler */}
            <PartyDetailsContent
                data={partyDetails}
                loading={loading}
                error={error}
                onDataRefresh={handleRefresh} // 5. Pass the refresh handler down
            />
        </Sidebar>
    );
};

export default PartyDetailsPage;
