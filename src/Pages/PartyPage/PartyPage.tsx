import React, { useState, useEffect } from 'react'; // 1. Import useEffect
import Sidebar from '../../components/layout/Sidebar/Sidebar'; 
import PartyContent from './PartyContent'; 
import { mockPartyData, type Party } from '../../api/partyService'; // 2. Import Party type

const PartyPage: React.FC = () => {
  // 3. Start with empty/loading state
  const [partyData, setPartyData] = useState<Party[] | null>(null);
  const [loading, setLoading] = useState(true); // Start as true
  const [error, setError] = useState<string | null>(null);

  // 4. Define the refresh/fetch function (can be used for both)
  const fetchMockData = () => {
    setLoading(true);
    setError(null); 
    try {
      if (Math.random() < 0.1) {
          throw new Error("Simulated data fetch failure!");
      }
      setTimeout(() => {
          setPartyData([...mockPartyData]); 
          setLoading(false);
      }, 500); // Simulate a longer initial network delay
    } catch (err) {
      console.error("Fetch failed:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
      setLoading(false);
    }
  }; 

  // 5. Use useEffect to fetch data on initial component load
  useEffect(() => {
    fetchMockData();
    // Empty dependency array [] means this runs ONCE when the component mounts
  }, []); 

  return (
    <Sidebar>
      <PartyContent
        data={partyData}
        loading={loading}
        error={error}
        // 6. Pass the same function for onDataRefresh
        onDataRefresh={fetchMockData} 
      />
    </Sidebar>
  );
};

export default PartyPage;