import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';


import { PartyDetailsTabs } from './components/PartyDetailsTabs';

// New Tab Imports
import { PartyInfoTab } from './tabs/Info/PartyInfoTab';
import { PartyInfoSkeleton } from './tabs/Info/PartyInfoSkeleton';
import { PartyOrdersTab } from './tabs/Orders/PartyOrdersTab';
import { PartyOrdersSkeleton } from './tabs/Orders/PartyOrdersSkeleton';
import { PartyCollectionsTab } from './tabs/Collections/PartyCollectionsTab';
import { PartyCollectionsSkeleton } from './tabs/Collections/PartyCollectionsSkeleton';
import { getCollections, type Collection } from '@/api/collectionService';
import { getOrders, type Order } from '@/api/orderService';

// Hooks & Types
import { usePartyTabSecurity } from './hooks/usePartyTabSecurity';
import type { PartyDetailsResponse } from './types';

interface PartyDetailsContentProps {
  data: PartyDetailsResponse | null;
  loading: boolean;
  onOpenEdit: () => void;
  onOpenDelete: () => void;
  onImageUpload: (file: File) => Promise<void>;
  onImageDelete: () => Promise<void>;
  isUploading: boolean;
  isDeletingImage: boolean;
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
};

const PartyDetailsContent: React.FC<PartyDetailsContentProps> = ({
  data, loading, onOpenEdit, onOpenDelete, onImageUpload, onImageDelete, isUploading, isDeletingImage
}) => {

  const [searchParams, setSearchParams] = useSearchParams();
  const { allowedTabs, activeTabId, setActiveTabId, hasPermission } = usePartyTabSecurity();

  // Sync state with URL when tab changes
  // Sync state with URL when tab changes
  const handleTabChange = (tabId: string) => {
    setActiveTabId(tabId);
    setSearchParams({ tab: tabId });
  };

  // Sync URL with state on mount/back navigation
  useEffect(() => {
    const currentTab = searchParams.get('tab');
    if (currentTab && allowedTabs.some(t => t.id === currentTab)) {
      setActiveTabId(currentTab);
    } else if (allowedTabs.length > 0 && !currentTab) {
      // Default to first allowed tab if no query param
      setActiveTabId(allowedTabs[0].id);
    }
  }, [searchParams, allowedTabs, setActiveTabId]);

  // Collections Data Fetching
  const [collections, setCollections] = useState<Collection[]>([]);
  const [collectionsLoading, setCollectionsLoading] = useState(true);

  // Orders Data Fetching (filtered by partyId)
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (data?.party?.id) {
      const fetchData = async () => {
        try {
          const [collectionsResult, ordersResult] = await Promise.all([
            getCollections({ partyId: data.party.id }),
            getOrders()
          ]);
          setCollections(collectionsResult);
          // Filter orders by party name (since party field may not always match)
          const partyOrders = ordersResult.filter(order =>
            order.partyName === data.party.companyName
          );
          setOrders(partyOrders);
        } catch (error) {
          console.error("Failed to fetch data", error);
        } finally {
          setCollectionsLoading(false);
          setOrdersLoading(false);
        }
      };
      fetchData();
    }
  }, [data?.party?.id, data?.party?.companyName]);

  const party = data?.party;
  const totalOrders = orders.length;

  const totalCollectionsAmount = collections.reduce((sum, item) => sum + item.paidAmount, 0);

  return (
    <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="show">

      <div className="-mx-4 sm:-mx-6 lg:-mx-8">
        <PartyDetailsTabs
          activeTab={activeTabId}
          onTabChange={handleTabChange}
          allowedTabs={allowedTabs}
          loading={loading || !data}
          rightContent={
            activeTabId === 'orders' ? (
              <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-bold border border-secondary/20 shadow-sm whitespace-nowrap">
                Total Orders: {totalOrders}
              </span>
            ) : activeTabId === 'collections' ? (
              <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-bold border border-green-200 shadow-sm whitespace-nowrap">
                Total Collections: RS {totalCollectionsAmount.toLocaleString('en-IN')}
              </span>
            ) : null
          }
        />
      </div>


      {/* Dynamic Content Area */}
      <div className="min-h-[400px]">
        {activeTabId === 'details' && (
          (loading || !party) ? (
            <PartyInfoSkeleton
              canUpdate={hasPermission('parties', 'update')}
              canDelete={hasPermission('parties', 'delete')}
            />
          ) : (
            <PartyInfoTab
              party={party}
              isUploading={isUploading}
              isDeleting={isDeletingImage}
              onImageUpload={onImageUpload}
              onImageDelete={onImageDelete}
              onOpenEdit={hasPermission('parties', 'update') ? onOpenEdit : undefined}
              onOpenDelete={hasPermission('parties', 'delete') ? onOpenDelete : undefined}
            />
          )
        )}

        {activeTabId === 'orders' && (
          (loading || ordersLoading) ? <PartyOrdersSkeleton /> : (
            <PartyOrdersTab
              orders={orders}
              partyName={party?.companyName || 'Party Name'}
              partyId={party?._id || party?.id || ''}
            />
          )
        )}

        {activeTabId === 'collections' && (
          collectionsLoading ? <PartyCollectionsSkeleton /> : (
            <PartyCollectionsTab
              collections={collections}
              partyName={party?.companyName || 'Party Name'}
              partyId={party?._id || party?.id || ''}
            />
          )
        )}
      </div>

    </motion.div>
  );
};

export default PartyDetailsContent;
