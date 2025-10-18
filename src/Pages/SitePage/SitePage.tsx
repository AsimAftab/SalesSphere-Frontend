import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import SiteContent from './SiteContent';
import { getSites, type Site } from '../../api/siteService';

const SitePage: React.FC = () => {
  const [siteData, setSiteData] = useState<Site[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        setLoading(true);
        const data = await getSites();
        setSiteData(data);
      } catch (err) {
        setError('Failed to load site data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSites();
  }, []);

  return (
    <Sidebar>
      <SiteContent data={siteData} loading={loading} error={error} />
    </Sidebar>
  );
};

export default SitePage;
