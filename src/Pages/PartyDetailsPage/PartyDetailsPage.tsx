import React, { useState } from 'react';
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
  type Party,
  type PartyStatsData, 
} from '../../api/partyService';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/modals/DeleteEntityModal';
import EditEntityModal, { type EditEntityData } from '../../components/modals/EditEntityModal';

const PARTY_QUERY_KEY = 'partyDetails';

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

  const partyQuery = useQuery<FullPartyDetailsData, Error>({
    queryKey: [PARTY_QUERY_KEY, partyId],
    queryFn: () => fetchFullPartyData(partyId!), 
    enabled: !!partyId, 
  });


 
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
    };
 
    updateMutation.mutate(partyUpdatePayload);
  };

  const handleDeleteConfirmed = () => {
    deleteMutation.mutate();
    setIsDeleteConfirmOpen(false);
 };
  
  const isLoading = partyQuery.isPending || updateMutation.isPending || deleteMutation.isPending;
  const errorMsg = partyQuery.isError ? partyQuery.error.message : null;
  const partyData = partyQuery.data?.party;

  return (
    <Sidebar>
      <PartyDetailsContent
        data={partyQuery.data || null}
        loading={isLoading}
       error={errorMsg}
        onDataRefresh={() => queryClient.invalidateQueries({ queryKey: [PARTY_QUERY_KEY, partyId] })}
      
        onOpenEditModal={() => setIsEditOpen(true)}
        onDeleteRequest={() => setIsDeleteConfirmOpen(true)}
     />

     
      {partyData && (
        <ConfirmationModal
          isOpen={isDeleteConfirmOpen}
          title="Confirm Deletion"
          message={`Are you sure you want to delete "${partyData.companyName}"? This action cannot be undone.`}
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setIsDeleteConfirmOpen(false)}
          confirmButtonText="Delete"
          confirmButtonVariant="danger"
        />
      )}
      
      {partyData && (
       <EditEntityModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onSave={handleModalSave} 
          title="Edit Party"
          nameLabel="Party Name"
          ownerLabel="Owner Name"
         panVatMode="required"
          descriptionMode="required"
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
          }}
        />
      )}
    </Sidebar>
  );
};

export default PartyDetailsPage;