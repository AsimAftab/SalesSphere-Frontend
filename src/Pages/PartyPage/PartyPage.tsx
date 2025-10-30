import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import PartyContent from './PartyContent';
import { type Party, getParties } from '../../api/partyService';
import toast from 'react-hot-toast'; // --- 1. IMPORT TOAST ---

const PartyPage: React.FC = () => {
  // State remains the same
  const [partyData, setPartyData] = useState<Party[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParties = async () => {
    setLoading(true);
    setError(null);
    try {
      const parties = await getParties();
      setPartyData(parties);
    } catch (err) {
      // --- 2. UPDATED CATCH BLOCK ---
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      // Show error toast to the user
      toast.error(`Failed to fetch parties: ${errorMessage}`);
      // --- END OF UPDATE ---
    } finally {
      setLoading(false);
    }
  };

  // 5. Use useEffect to fetch data on initial component load
  useEffect(() => {
    fetchParties();
    // Empty dependency array [] means this runs ONCE when the component mounts
  }, []); // Note: useEffect dependencies should be empty to run once

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