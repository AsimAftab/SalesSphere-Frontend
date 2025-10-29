import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import PartyContent from './PartyContent';
// 1. Import the Party type and the new getParties API function
import { type Party, getParties } from '../../api/partyService';

const PartyPage: React.FC = () => {
  // State remains the same
  const [partyData, setPartyData] = useState<Party[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. Renamed and updated the fetch function to be async
  const fetchParties = async () => {
    setLoading(true);
    setError(null);
    try {
      // 3. Call the real API function
      const parties = await getParties();
      setPartyData(parties);
    } catch (err) {
      console.error('Fetch failed:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
    } finally {
      // 4. Ensure loading is set to false even if there's an error
      setLoading(false);
    }
  };

  // 5. Use useEffect to fetch data on initial component load
  useEffect(() => {
    fetchParties();
    // Empty dependency array [] means this runs ONCE when the component mounts
  }, []);

  return (
    <Sidebar>
      <PartyContent
        data={partyData}
        loading={loading}
        error={error}
        // 6. Pass the new fetchParties function as the refresh handler
        onDataRefresh={fetchParties}
      />
    </Sidebar>
  );
};

export default PartyPage;