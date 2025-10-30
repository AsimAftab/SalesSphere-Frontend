import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import ProspectDetailsContent from './ProspectDetailsContent';
import { type Prospect, getProspectById } from '../../api/prospectService'; // Get the type from the main service
import toast from 'react-hot-toast'; // --- 1. IMPORT TOAST ---

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

    try {
      setLoading(true);
      setError(null);
      const data = await getProspectById(prospectId); // Using async function
      if (data) {
        setProspect(data);
      } else {
        setError(`Prospect with ID ${prospectId} not found.`);
        setProspect(null); // Ensure data is cleared on not found
      }
    } catch (err) {
      // --- 2. UPDATED CATCH BLOCK ---
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load prospect details.';
      setError(errorMessage);
      toast.error(`Failed to load prospect: ${errorMessage}`);
      setProspect(null); // Ensure data is cleared on error
      // --- END OF UPDATE ---
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