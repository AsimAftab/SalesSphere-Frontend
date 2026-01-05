import React, { useState } from 'react';
import Sidebar from '../../../components/layout/Sidebar/Sidebar';
import ProspectContent from './ProspectContent';
import { useProspects } from './useProspects';
import { useEntityManager } from '../Shared/useEntityManager';
import { handleExportPdf, handleExportExcel } from './ProspectExportUtils';
import { type Prospect, type NewProspectData } from '../../../api/prospectService';

const ProspectPage: React.FC = () => {
  const [exportingStatus, setExportingStatus] = useState<'pdf' | 'excel' | null>(null);

  // 1. Temporary bridge state for categories
  const [catFilter, setCatFilter] = useState<string[]>([]);

  // 2. Data Hook: availableBrands will react to catFilter
  const {
    prospects,
    categories,
    availableBrands,
    isLoading,
    isError,
    error,
    isCreating,
    addProspect
  } = useProspects(catFilter);

  // 3. Manager Hook: paginatedData will react to prospects arriving
  const entityManager = useEntityManager<Prospect>(prospects, ['name', 'ownerName']);

  // 4. Synchronize the UI Category selection back to the data hook
  React.useEffect(() => {
    setCatFilter(entityManager.activeFilters.category || []);
  }, [entityManager.activeFilters.category]);

  return (
    <Sidebar>
      <ProspectContent
        entityManager={entityManager} 
        data={prospects} 
        categoriesData={categories}
        availableBrands={availableBrands} 
        loading={isLoading}
        error={isError ? error : null}
        onSaveProspect={(data: NewProspectData) => addProspect(data)}
        isCreating={isCreating}
        onExportPdf={(data: Prospect[]) => handleExportPdf(data, setExportingStatus)}
        onExportExcel={(data: Prospect[]) => handleExportExcel(data, setExportingStatus)}
        exportingStatus={exportingStatus}
      />
    </Sidebar>
  );
};

export default ProspectPage;