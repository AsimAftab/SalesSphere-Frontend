import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import PartyContent from './PartyContent';
import { getParties, addParty, type NewPartyData } from '../../api/partyService';
import toast from 'react-hot-toast';

const PARTIES_QUERY_KEY = 'parties';

const PartyPage: React.FC = () => {
  const queryClient = useQueryClient();

  // 1. Replaced useState/useEffect with useQuery
  const partyQuery = useQuery({
    queryKey: [PARTIES_QUERY_KEY],
    queryFn: getParties,
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });

  // 2. Create the mutation for adding a party
  const addPartyMutation = useMutation({
    mutationFn: (newPartyData: NewPartyData) => addParty(newPartyData),
    onSuccess: () => {
      toast.success('Party added successfully!');
      queryClient.invalidateQueries({ queryKey: [PARTIES_QUERY_KEY] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add party');
    },
  });

  // 3. Define the save handler to pass to the content component
  const handleSaveParty = (newPartyData: NewPartyData) => {
    addPartyMutation.mutate(newPartyData);
  };

  return (
    <Sidebar>
      <PartyContent
        data={partyQuery.data || null} // Pass the cached data
        loading={partyQuery.isPending} // Use TQ's loading state
        error={partyQuery.isError ? partyQuery.error.message : null} // Use TQ's error
        // Pass the mutation function and its loading state
        onSaveParty={handleSaveParty}
        isCreating={addPartyMutation.isPending}
      />
    </Sidebar>
  );
};

export default PartyPage;