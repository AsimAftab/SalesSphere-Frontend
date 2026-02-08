import React from 'react';
import { useCustomFieldsTab } from './hooks/useCustomFieldsTab';
import CategorySidebar from './components/CategorySidebar';
import EntityCrudPanel from './components/EntityCrudPanel';
import CustomFieldsTabSkeleton from './components/CustomFieldsTabSkeleton';
import { EmptyState } from '@/components/ui';
import { Settings2 } from 'lucide-react';

const CustomFieldsTab: React.FC = () => {
  const {
    enabledCategories,
    selectedKey,
    setSelectedKey,
    selectedConfig,
    isLoading,
  } = useCustomFieldsTab();

  if (isLoading) {
    return <CustomFieldsTabSkeleton />;
  }

  if (enabledCategories.length === 0) {
    return (
      <>
        <div className="px-4 sm:px-6 pt-4 sm:pt-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#202224]">Custom Fields</h1>
          <p className="text-xs sm:text-sm text-gray-500">Manage custom fields and configurable options</p>
        </div>
        <div className="flex-1 flex items-center justify-center bg-gray-100">
          <EmptyState
            title="No Custom Fields Available"
            description="Your current subscription plan does not include any modules with customizable fields."
            icon={<Settings2 className="w-12 h-12 text-gray-300" />}
          />
        </div>
      </>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className="px-4 sm:px-6 pt-4 sm:pt-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#202224]">Custom Fields</h1>
        <p className="text-xs sm:text-sm text-gray-500">Manage custom fields and configurable options</p>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden bg-gray-100 px-4 sm:px-6 py-4 sm:py-6 gap-4 sm:gap-6">
        {/* Left Sidebar */}
        <div className="w-full lg:w-72 flex-shrink-0">
          <CategorySidebar
            categories={enabledCategories}
            selectedKey={selectedKey}
            onSelect={setSelectedKey}
          />
        </div>

        {/* Right Panel */}
        {selectedConfig && (
          <EntityCrudPanel key={selectedConfig.key} config={selectedConfig} />
        )}
      </div>
    </>
  );
};

export default CustomFieldsTab;
