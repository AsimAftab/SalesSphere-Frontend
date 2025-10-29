import React, { useState, useEffect, useCallback } from 'react'; // Added useEffect, useCallback
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import SiteContent from './SiteContent';
import { getSites, type Site } from '../../api/siteService';

const SitePage: React.FC = () => {
  // --- MODIFIED: Use state for data ---
  const [siteData, setSiteData] = useState<Site[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- ADDED: Fetch and Refresh Logic ---
  const fetchData = useCallback(async (isInitialLoad = false) => {
    if (isInitialLoad) setLoading(true);
    setError(null);
    try {
      console.log("Fetching sites...");
      const data = await getSites(); // Fetch fresh data
      setSiteData(data);
      console.log("Sites fetched.");
    } catch (err) {
      setError('Failed to load site data. Please try again later.');
      console.error(err);
      if (isInitialLoad) setSiteData(null);
    } finally {
      if (isInitialLoad) setLoading(false);
    }
  }, []); // Empty dependency array

  // Initial fetch on mount
  useEffect(() => {
    fetchData(true);
  }, []);

  // Refresh function to pass down
  const handleDataRefresh = useCallback(() => {
    console.log("Refreshing site data...");
    fetchData(false); // isInitialLoad = false for refresh
  }, [fetchData]);
  // --- END ADDED ---

  return (
    <Sidebar>
      <SiteContent
          data={siteData}
          loading={loading}
          error={error}
          // --- ADDED: Pass refresh function ---
          onDataRefresh={handleDataRefresh}
       />
    </Sidebar>
  );
};

export default SitePage;