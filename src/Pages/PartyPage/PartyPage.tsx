import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import PartyContent from './PartyContent';
import { getParties, type Party } from '../../api/partyService';

const PartyPage: React.FC = () => {
  const [partyData, setPartyData] = useState<Party[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParties = async () => {
      try {
        setLoading(true);
        const data = await getParties();
        setPartyData(data);
      } catch (err) {
        setError('Failed to load party data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchParties();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <Sidebar>
      <PartyContent data={partyData} loading={loading} error={error} />
    </Sidebar>
  );
};

export default PartyPage;
