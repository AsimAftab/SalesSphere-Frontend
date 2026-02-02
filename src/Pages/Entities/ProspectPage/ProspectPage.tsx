import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../../../components/layout/Sidebar/Sidebar';
import ProspectContent from './ProspectContent';
import { useProspects } from './useProspects';
import { useEntityManager } from '../Shared/useEntityManager';
import { handleExportPdf, handleExportExcel } from './ProspectExportUtils';
import { type Prospect } from '../../../api/prospectService';

import ErrorBoundary from '../../../components/ui/ErrorBoundary/ErrorBoundary';

const isToday = (dateString: string) => {
  if (!dateString) return false;
  let d: Date;
  if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(dateString)) {
    const [day, month, year] = dateString.split('-').map(Number);
    d = new Date(year, month - 1, day);
  } else if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split('-').map(Number);
    d = new Date(year, month - 1, day);
  } else {
    d = new Date(dateString);
  }
  if (isNaN(d.getTime())) return false;
  const today = new Date();
  return d.toDateString() === today.toDateString();
};

const ProspectPage: React.FC = () => {
  const [exportingStatus, setExportingStatus] = useState<'pdf' | 'excel' | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Capture filter=today on mount, then strip it from the URL
  const initialFilter = useRef(searchParams.get('filter'));
  const dateFilter = initialFilter.current === 'today' ? 'today' : 'all';

  useEffect(() => {
    if (searchParams.has('filter')) {
      searchParams.delete('filter');
      setSearchParams(searchParams, { replace: true });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  // 2b. Apply one-time date filter from navigation
  const dateFilteredProspects = useMemo(() => {
    if (!prospects) return null;
    if (dateFilter === 'today') {
      return prospects.filter((p: Prospect) => isToday(p.createdAt || ''));
    }
    return prospects;
  }, [prospects, dateFilter]);

  // 3. Manager Hook: paginatedData will react to prospects arriving
  const entityManager = useEntityManager(dateFilteredProspects, ['name', 'ownerName']);

  // 4. Synchronize the UI Category selection back to the data hook
  React.useEffect(() => {
    setCatFilter(entityManager.activeFilters.category || []);
  }, [entityManager.activeFilters.category]);

  return (
    <Sidebar>
      <ErrorBoundary>
        <ProspectContent
          entityManager={entityManager}
          data={prospects}
          categoriesData={categories}
          availableBrands={availableBrands}
          loading={isLoading}
          error={isError ? error : null}
          onSaveProspect={async (data) => addProspect({
            name: data.name,
            ownerName: data.ownerName,
            dateJoined: data.dateJoined,
            address: data.address,
            phone: data.phone || '',
            latitude: data.latitude ?? null,
            longitude: data.longitude ?? null,
            email: data.email,
            description: data.description,
            panVat: data.panVat,
            interest: data.prospectInterest,
          })}
          isCreating={isCreating}
          onExportPdf={(data: Prospect[]) => handleExportPdf(data, setExportingStatus)}
          onExportExcel={(data: Prospect[]) => handleExportExcel(data, setExportingStatus)}
          exportingStatus={exportingStatus}
          permissions={useProspects(catFilter).permissions} // Pass permissions
        />
      </ErrorBoundary>
    </Sidebar>
  );
};

export default ProspectPage;