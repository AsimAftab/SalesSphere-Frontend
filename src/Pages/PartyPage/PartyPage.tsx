import React from 'react';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import PartyContent from './PartyContent';
import { mockPartyData } from '../../api/partyService';

const PartyPage: React.FC = () => {
  // Using mock data directly (API disconnected for development)
  const partyData = mockPartyData;
  const loading = false;
  const error = null;

  return (
    <Sidebar>
      <PartyContent data={partyData} loading={loading} error={error} />
    </Sidebar>
  );
};

export default PartyPage;
