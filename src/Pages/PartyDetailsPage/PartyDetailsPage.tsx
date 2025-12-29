import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import PartyDetailsContent, {
  type FullPartyDetailsData,
  type Order,
} from './PartyDetailsContent';
import {
  getPartyDetails,
  deleteParty,
  updateParty,
  getPartyStats,
  getPartyTypes,
  type Party,
  type PartyStatsData,
} from '../../api/partyService';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/modals/DeleteEntityModal';
import EditEntityModal, { type EditEntityData } from '../../components/modals/EditEntityModal';

const PARTY_QUERY_KEY = 'partyDetails';
const PARTY_TYPES_QUERY_KEY = 'partyTypes';

// --- Helper: Map API Status to Frontend UI ---
const mapApiOrderToFrontend = (apiOrder: PartyStatsData['allOrders'][0]): Order => {
  let status: Order['status'] = 'pending';
  let statusColor: Order['statusColor'] = 'gray';

  switch (apiOrder.status) {
    case 'completed':
      status = 'Completed';
      statusColor = 'green';
      break;
    case 'rejected':
      status = 'Rejected';
      statusColor = 'red';
      break;
    case 'inTransit':
      status = 'In Transit';
      statusColor = 'orange';
      break;
    case 'pending':
      status = 'Pending';
      statusColor = 'blue';
      break;
    case 'inProgress':
      status = 'In Progress';
      statusColor = 'violet';
      break;
    default:
      status = apiOrder.status;
      statusColor = 'gray';
  }

  return {
    id: apiOrder._id,
    invoiceNumber: apiOrder.invoiceNumber,
    expectedDeliveryDate: apiOrder.expectedDeliveryDate,
    totalAmount: apiOrder.totalAmount,
    status: status,
    statusColor: statusColor,
  };
};

// --- Helper: Fetch Aggregate Data ---
const fetchFullPartyData = async (partyId: string): Promise<FullPartyDetailsData> => {
  if (!partyId) throw new Error('Party ID is missing.');

  const partyPromise = getPartyDetails(partyId);
  const statsPromise = getPartyStats(partyId);
  const [party, statsData] = await Promise.all([partyPromise, statsPromise]);
  const orders: Order[] = statsData ? statsData.allOrders.map(mapApiOrderToFrontend) : [];

  return { party, orders, stats: statsData ? statsData.summary : null };
};

const PartyDetailsPage: React.FC = () => {
  const { partyId } = useParams<{ partyId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // 🔥 1. PREFETCH PARTY TYPES IMMEDIATELY
  // This ensures that as soon as the page loads, the dropdown data is being fetched in the background.
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: [PARTY_TYPES_QUERY_KEY],
      queryFn: getPartyTypes,
    });
  }, [queryClient]);

  // 2. Fetch Main Party Details
  const partyQuery = useQuery<FullPartyDetailsData, Error>({
    queryKey: [PARTY_QUERY_KEY, partyId],
    queryFn: () => fetchFullPartyData(partyId!),
    enabled: !!partyId,
  });

  // 3. Fetch Party Types (Reads from Cache populated by Prefetch)
  const partyTypesQuery = useQuery<string[], Error>({
    queryKey: [PARTY_TYPES_QUERY_KEY],
    queryFn: getPartyTypes,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    refetchOnMount: 'always', 
  });

  // 🔥 4. OPTIMISTIC CACHE UPDATE FOR NEW PARTY TYPES
  // Allows the dropdown to show new entries without waiting for a server refetch
  const handleAddPartyType = (newType: string) => {
    queryClient.setQueryData<string[]>([PARTY_TYPES_QUERY_KEY], (old = []) => {
      const trimmed = newType.trim();
      if (trimmed && !old.includes(trimmed)) {
        return [...old, trimmed].sort();
      }
      return old;
    });
  };

  // 5. Update Mutation
  const updateMutation = useMutation({
    mutationFn: (payload: Partial<Party>) => updateParty(partyId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PARTY_QUERY_KEY, partyId] });
      queryClient.invalidateQueries({ queryKey: ['parties'] });
      toast.success('Party updated successfully!');
      setIsEditOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update party.');
    },
  });

  // 6. Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteParty(partyId!),
    onSuccess: () => {
      toast.success('Party deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['parties'] });
      navigate('/parties');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete party.');
    },
  });

  const handleModalSave = async (updatedData: Partial<EditEntityData>) => {
    const partyUpdatePayload: Partial<Party> = {
      companyName: updatedData.name,
      ownerName: updatedData.ownerName,
      address: updatedData.address,
      latitude: updatedData.latitude,
      longitude: updatedData.longitude,
      email: updatedData.email,
      phone: updatedData.phone,
      panVat: updatedData.panVat,
      description: updatedData.description,
      partyType: updatedData.partyType, 
    };
    updateMutation.mutate(partyUpdatePayload);
  };

  const isLoading = partyQuery.isPending || updateMutation.isPending || deleteMutation.isPending;
  const partyData = partyQuery.data?.party;

  return (
    <Sidebar>
      <PartyDetailsContent
        data={partyQuery.data || null}
        loading={isLoading}
        error={partyQuery.isError ? partyQuery.error.message : null}
        onDataRefresh={() => queryClient.invalidateQueries({ queryKey: [PARTY_QUERY_KEY, partyId] })}
        onOpenEditModal={() => setIsEditOpen(true)}
        onDeleteRequest={() => setIsDeleteConfirmOpen(true)}
      />

      {partyData && (
        <>
          <ConfirmationModal
            isOpen={isDeleteConfirmOpen}
            title="Confirm Deletion"
            message={`Are you sure you want to delete "${partyData.companyName}"? This action cannot be undone.`}
            onConfirm={() => deleteMutation.mutate()}
            onCancel={() => setIsDeleteConfirmOpen(false)}
            confirmButtonText="Delete"
            confirmButtonVariant="danger"
          />

          <EditEntityModal
            entityType="Party"
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            onSave={handleModalSave}
            title="Edit Party"
            nameLabel="Party Name"
            ownerLabel="Owner Name"
            panVatMode="required"
            descriptionMode="required"
            
            // 🔥 Use prefetched/cached data and local updater
            partyTypesList={partyTypesQuery.data || []}
            onAddPartyType={handleAddPartyType}

            initialData={{
              name: partyData.companyName,
              ownerName: partyData.ownerName,
              dateJoined: partyData.dateCreated,
              address: partyData.address ?? '',
              description: partyData.description ?? '',
              latitude: partyData.latitude ?? 0,
              longitude: partyData.longitude ?? 0,
              email: partyData.email ?? '',
              phone: (partyData.phone ?? '').replace(/[^0-9]/g, ''),
              panVat: partyData.panVat ?? '',
              partyType: partyData.partyType ?? '',
            }}
          />
        </>
      )}
    </Sidebar>
  );
};

export default PartyDetailsPage;