import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import ProspectContent from './ProspectContent';
import { getProspects, addProspect,type NewProspectData } from '../../api/prospectService';
import toast from 'react-hot-toast';

// Define a unique key for this query
const PROSPECTS_QUERY_KEY = 'prospects';

const ProspectPage: React.FC = () => {
  const queryClient = useQueryClient();

  // 1. Replaced useState/useEffect with useQuery
  // This fetches, caches, and manages loading/error states
  const prospectQuery = useQuery({
    queryKey: [PROSPECTS_QUERY_KEY],
    queryFn: getProspects,
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });

  // 2. Create the mutation for adding a prospect
  const addProspectMutation = useMutation({
    mutationFn: (newProspectData: NewProspectData) => addProspect(newProspectData),
    onSuccess: () => {
      // Show success toast
      toast.success('Prospect added successfully!');
      // Invalidate the 'prospects' query to refetch the list
      queryClient.invalidateQueries({ queryKey: [PROSPECTS_QUERY_KEY] });
    },
    onError: (error: Error) => {
      // Show the specific error toast from the service
      toast.error(error.message || 'Failed to add prospect');
    },
  });

  // 3. Define the save handler to pass to the content component
  const handleSaveProspect = (newProspectData: NewProspectData) => {
    addProspectMutation.mutate(newProspectData);
  };

  return (
    <Sidebar>
      <ProspectContent
        data={prospectQuery.data || null} // Pass the cached data
        loading={prospectQuery.isPending} // Use TQ's loading state
        error={prospectQuery.isError ? prospectQuery.error.message : null} // Use TQ's error
        
        // Pass the mutation function and its loading state
        onSaveProspect={handleSaveProspect}
        isCreating={addProspectMutation.isPending}
      />
    </Sidebar>
  );
};

export default ProspectPage;