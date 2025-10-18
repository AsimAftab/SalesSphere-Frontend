import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import ProspectContent from './ProspectContent';
import { getProspects, type Prospect } from '../../api/prospectService';

const ProspectPage: React.FC = () => {
  const [prospectData, setProspectData] = useState<Prospect[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProspects = async () => {
      try {
        setLoading(true);
        const data = await getProspects();
        setProspectData(data);
      } catch (err) {
        setError('Failed to load prospect data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProspects();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <Sidebar>
      <ProspectContent data={prospectData} loading={loading} error={error} />
    </Sidebar>
  );
};

export default ProspectPage;
