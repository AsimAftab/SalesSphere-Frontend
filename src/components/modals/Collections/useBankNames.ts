import { useQuery } from '@tanstack/react-query';
import { CollectionRepository } from '@/api/collectionService';

export function useBankNames() {
  const { data, isLoading } = useQuery({
    queryKey: ['bankNames'],
    queryFn: CollectionRepository.getBankNames,
    staleTime: 1000 * 60 * 5,
  });

  const options = (data || []).map((b) => ({ value: b.name, label: b.name }));

  return { options, isLoading };
}
