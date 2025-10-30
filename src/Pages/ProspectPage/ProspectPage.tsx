import React, { useState, useEffect, useCallback } from 'react'; // Added useEffect, useCallback
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import ProspectContent from './ProspectContent';
import { getProspects, type Prospect } from '../../api/prospectService';

const ProspectPage: React.FC = () => {
  const [prospectData, setProspectData] = useState<Prospect[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Using useCallback for stability if passed to useEffect dependencies later
  const fetchData = useCallback(async (isInitialLoad = false) => {
    if (isInitialLoad) setLoading(true); // Only show full loading on first load
    setError(null);
    try {
      const data = await getProspects();
      setProspectData(data);
    } catch (err) {
      setError('Failed to load prospect data. Please try again later.');
      if (isInitialLoad) setProspectData(null);
    } finally {
      if (isInitialLoad) setLoading(false);
    }
  }, []);

  // Fetch data on initial mount
  useEffect(() => {
    fetchData(true);
  }, [fetchData]);

  // Refresh function to pass down
  const handleDataRefresh = useCallback(() => {
    fetchData(false); // false = don't show full loading spinner
  }, [fetchData]);

  return (
    <Sidebar>
      <ProspectContent
        data={prospectData}
        loading={loading}
        error={error}
        onDataRefresh={handleDataRefresh} // Pass the refresh function
      />
    </Sidebar>
  );
};

export default ProspectPage;