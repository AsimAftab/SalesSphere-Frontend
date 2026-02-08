import React, { useState } from 'react';
import { NavigationTabs } from '@/components/ui';
import { usePlanBillingTab } from './hooks/usePlanBillingTab';
import YourPlanContent from './components/YourPlanContent';
import PaymentHistoryContent from './components/PaymentHistoryContent';
import PlanBillingSkeleton from './components/PlanBillingSkeleton';

const SUB_TABS = [
  { id: 'your-plan', label: 'Overview' },
  { id: 'payment-history', label: 'Payments' },
];

const PlanBillingTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState('your-plan');
  const { orgData, payments, summary, isLoadingOrg, isLoadingPayments, orgError } = usePlanBillingTab();

  if (isLoadingOrg) {
    return <PlanBillingSkeleton />;
  }

  if (orgError) {
    return (
      <>
        <div className="px-4 sm:px-6 pt-4 sm:pt-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#202224]">Plan & Billing</h1>
          <p className="text-xs sm:text-sm text-gray-500">Manage your plan details and billing history</p>
        </div>
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center text-red-600">
            <p>Failed to load subscription details.</p>
            <p className="text-sm text-gray-500 mt-1">{(orgError as Error).message}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className="px-4 sm:px-6 pt-4 sm:pt-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#202224]">Plan & Billing</h1>
        <p className="text-xs sm:text-sm text-gray-500">Manage your plan details and billing history</p>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 gap-6">
        {/* Sub-tab Navigation */}
        <NavigationTabs
          tabs={SUB_TABS}
          activeTab={activeSubTab}
          onTabChange={setActiveSubTab}
          className="!px-0"
          tabListClassName="!px-0"
        />

        {/* Tab Content */}
        {activeSubTab === 'your-plan' && orgData && (
          <YourPlanContent orgData={orgData} />
        )}

        {activeSubTab === 'payment-history' && (
          <div className="flex-1 min-h-0 overflow-auto">
            <PaymentHistoryContent
              payments={payments}
              summary={summary}
              isLoading={isLoadingPayments}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default PlanBillingTab;
