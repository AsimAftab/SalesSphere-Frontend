import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import PartyDetailsContent, {
  type FullPartyDetailsData,
} from './PartyDetailsContent'; // Import type from component
import { getPartyDetails } from '../../api/partyService'; // Import the new API function
import toast from 'react-hot-toast'; // --- 1. IMPORT TOAST ---

const PartyDetailsPage: React.FC = () => {
  const { partyId } = useParams<{ partyId: string }>();

  // 1. State for data, loading, and error (remains the same)
  const [partyDetails, setPartyDetails] = useState<FullPartyDetailsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. Function to fetch or refresh data (NOW ASYNC)
  const fetchPartyData = async () => {
    if (!partyId) {
      setError('Party ID is missing from the URL.');
      setLoading(false);
      setPartyDetails(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Call the real async API function
      const fetchedParty = await getPartyDetails(partyId);

      if (fetchedParty) {
        // ASSEMBLE the FullPartyDetailsData object
        // The API returns the party, but the component also needs an 'orders' array.
        // We provide an empty array for now.
        setPartyDetails({
          party: fetchedParty,
          orders: [], // Provide an empty array for orders
        });
      } else {
        setError('Party not found.');
        setPartyDetails(null);
      }
    } catch (err) {
      // --- 2. UPDATED CATCH BLOCK ---
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load party details.';
      setError(errorMessage);
      // Show toast notification
      toast.error(`Failed to load party: ${errorMessage}`);
      setPartyDetails(null);
      // --- END OF UPDATE ---
    } finally {
      setLoading(false);
    }
  };

  // 3. Fetch data on mount and when partyId changes
  useEffect(() => {
    fetchPartyData();
  }, [partyId]); // Dependency array includes partyId

  // 4. Define the refresh handler function
  const handleRefresh = () => {
    fetchPartyData();
  };

  return (
    <Sidebar>
      {/* 5. Pass state variables and the refresh handler */}
      <PartyDetailsContent
        data={partyDetails}
        loading={loading}
        error={error}
        onDataRefresh={handleRefresh}
      />
    </Sidebar>
  );
};

export default PartyDetailsPage;