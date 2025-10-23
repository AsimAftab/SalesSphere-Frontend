import React from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import PartyDetailsContent from './PartyDetailsContent';
import { getMockPartyDetails } from '../../api/partyDetailsService';
import './PartyDetailsPage.css';

const PartyDetailsPage: React.FC = () => {
    const { partyId } = useParams<{ partyId: string }>();

    // Using mock data directly (API disconnected for development)
    const partyDetails = partyId ? getMockPartyDetails(partyId) : null;
    const loading = false;
    const error = !partyId ? "Party ID is missing from the URL." : (!partyDetails ? "Party not found." : null);

    return (
        <Sidebar>
            <PartyDetailsContent data={partyDetails} loading={loading} error={error} />
        </Sidebar>
    );
};

export default PartyDetailsPage;
