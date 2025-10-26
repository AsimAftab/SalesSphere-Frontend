import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar/Sidebar'; 
import PartyContent from './PartyContent'; 
import { mockPartyData } from '../../api/partyService'; 

const PartyPage: React.FC = () => {
  // 1. Use useState
  const [partyData, setPartyData] = useState(mockPartyData);
  const [loading, setLoading] = useState(false); // Can keep these if needed
  // FIX: Explicitly type the error state to accept string OR null
  const [error, setError] = useState<string | null>(null);

  // 2. Define the refresh function
  const handleDataRefresh = () => {
    // Simulate refetching for mock data
    setLoading(true);
    setError(null); // Clear previous errors
    try {
        // Simulate potential failure
        if (Math.random() < 0.1) { // 10% chance to fail
             throw new Error("Simulated data refresh failure!");
        }

        setTimeout(() => {
            // Create a new array copy to trigger re-render
            setPartyData([...mockPartyData]);
            setLoading(false);
        }, 300); // Simulate network delay
    } catch (err) {
        console.error("Refresh failed:", err);
        // Now setError accepts a string
        setError(err instanceof Error ? err.message : "An unknown error occurred during refresh.");
        setLoading(false);
    }
  }; 

  return (
    <Sidebar>
      <PartyContent
        data={partyData}
        loading={loading}
        error={error}
        // 3. Pass the function as the onDataRefresh prop
        onDataRefresh={handleDataRefresh}
      />
    </Sidebar>
  );
};

export default PartyPage;

