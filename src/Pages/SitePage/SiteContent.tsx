import React, { useState, useMemo, useEffect } from 'react'; 
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion'; 
import ProfileCard from '../../components/UI/ProfileCard';
import Button from '../../components/UI/Button/Button';
import { type Site, addSite, type NewSiteData } from '../../api/siteService';
import AddEntityModal, { type NewEntityData } from '../../components/modals/AddEntityModal';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon 
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'; 
import 'react-loading-skeleton/dist/skeleton.css'; 
import ExportActions from '../../components/UI/ExportActions';
import { saveAs } from 'file-saver';

// --- New Reusable Components ---
import FilterBar from '../../components/UI/FilterDropDown/FilterBar';
import FilterDropdown from '../../components/UI/FilterDropDown/FilterDropDown';

interface SiteContentProps {
  data: Site[] | null;
  loading: boolean;
  error: string | null;
  subOrgsList?: string[];
  onAddSubOrg?: (newOrg: string) => void;
  categoriesData?: any[];
}

const formatAddress = (fullAddress: string | undefined | null): string => {
  if (!fullAddress) return 'Address not available';
  const parts = fullAddress.split(',').map((part) => part.trim());
  if (parts.length > 2) {
    const desiredParts = parts.slice(1, 3);
    return desiredParts.join(', ');
  } else if (parts.length === 2) {
    return parts[1];
  } else {
    return fullAddress;
  }
};

const containerVariants = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const SiteContent: React.FC<SiteContentProps> = ({
  data,
  loading,
  subOrgsList = [],
  onAddSubOrg,
  categoriesData = []
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [exportingStatus, setExportingStatus] = useState<'pdf' | 'excel' | null>(null);
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState({
    categories: [] as string[],
    brands: [] as string[],
    technicians: [] as string[],
    subOrgs: [] as string[],
    creators: [] as string[],
  });

  const availableCreators = useMemo(() => {
    if (!data) return [];
    const names = data.map((site) => site.createdBy?.name).filter(Boolean);
    return Array.from(new Set(names)).sort() as string[];
  }, [data]);

  const availableBrands = useMemo(() => {
    const sourceData = filters.categories.length > 0
      ? categoriesData.filter((cat: any) => filters.categories.includes(cat.name))
      : categoriesData;

    const brands = sourceData.flatMap((cat: any) => cat.brands || []);
    return Array.from(new Set(brands)).sort() as string[];
  }, [categoriesData, filters.categories]);

  const availableTechnicians = useMemo(() => {
    const sourceData = filters.categories.length > 0
      ? categoriesData.filter((cat: any) => filters.categories.includes(cat.name))
      : categoriesData;

    const techs = sourceData.flatMap((cat: any) => 
      cat.technicians?.map((t: any) => t.name) || []
    );
    return Array.from(new Set(techs)).sort() as string[];
  }, [categoriesData, filters.categories]);

  const resetFilters = () => {
    setFilters({ categories: [], brands: [], technicians: [], subOrgs: [], creators: [] });
    setSearchTerm('');
    toast.success('Filters cleared');
  };

  const addSiteMutation = useMutation({
    mutationFn: addSite,
    onSuccess: () => {
      toast.success('Site added successfully!');
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      setIsAddModalOpen(false);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to add site.');
    },
  });

  const filteredSite = useMemo(() => {
    if (!data) return [];
    return data.filter(site => {
      const matchesSearch = (site.ownerName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                            (site.name?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      
      const matchesSubOrg = filters.subOrgs.length === 0 || 
                            (site.subOrgName && filters.subOrgs.includes(site.subOrgName));

      const matchesCreator = filters.creators.length === 0 || 
                             (site.createdBy?.name && filters.creators.includes(site.createdBy.name));

      const matchesInterests = site.siteInterest && site.siteInterest.length > 0 ? site.siteInterest.some((interest: any) => {
        const categoryMatch = filters.categories.length === 0 || filters.categories.includes(interest.category);
        const brandMatch = filters.brands.length === 0 || 
                           (interest.brands && interest.brands.some((b: string) => filters.brands.includes(b)));
        const techMatch = filters.technicians.length === 0 || 
                          (interest.technicians && interest.technicians.some((t: any) => filters.technicians.includes(t.name)));

        return categoryMatch && brandMatch && techMatch;
      }) : (filters.categories.length === 0 && filters.brands.length === 0 && filters.technicians.length === 0);

      return matchesSearch && matchesSubOrg && matchesInterests && matchesCreator;
    });
  }, [data, searchTerm, filters]);

  const handleExportPdf = async () => {
    if (!filteredSite || filteredSite.length === 0) return toast.error("No data matching filters to export");
    const toastId = toast.loading("Preparing PDF view...");
    setExportingStatus('pdf');
    try {
      const { pdf } = await import('@react-pdf/renderer');
      const SiteListPDF = (await import('./SiteListPDF')).default;
      const blob = await pdf(<SiteListPDF sites={filteredSite} />).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      toast.success("PDF opened in new tab", { id: toastId });
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (err) {
      toast.error("Failed to generate PDF", { id: toastId });
    } finally {
      setExportingStatus(null);
    }
  };

  const handleExportExcel = async () => {
    if (!filteredSite || filteredSite.length === 0) return toast.error("No filtered data to export");
    const toastId = toast.loading("Generating Excel report...");
    setExportingStatus('excel');
    try {
      const ExcelJS = (await import('exceljs')).default;
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Filtered Sites');
      const maxImages = filteredSite.reduce((max, site) => Math.max(max, (site.images?.length || 0)), 0);
      const activeCategoriesSet = new Set<string>();
      filteredSite.forEach(site => {
        site.siteInterest?.forEach(interest => { if (interest.category) activeCategoriesSet.add(interest.category); });
      });
      const dynamicCategories = Array.from(activeCategoriesSet).sort();
      const columns: any[] = [
        { header: 'S.No', key: 'sno', width: 8 },
        { header: 'Site Name', key: 'name', width: 25 },
        { header: 'Owner Name', key: 'owner', width: 20 },
        { header: 'Sub Organization', key: 'subOrg', width: 20 },
        { header: 'Phone', key: 'phone', width: 18 },
        { header: 'Email', key: 'email', width: 25 },
        { header: 'Address', key: 'address', width: 40 },
        { header: 'Created By', key: 'createdBy', width: 15 },
        { header: 'Joined Date', key: 'date', width: 15 },
      ];
      for (let i = 0; i < maxImages; i++) columns.push({ header: `Image URL ${i + 1}`, key: `img_${i}`, width: 50 });
      dynamicCategories.forEach(catName => columns.push({ header: `${catName} (Brands)`, key: `cat_${catName}`, width: 25 }));
      worksheet.columns = columns;
      filteredSite.forEach((site, index) => {
        const cleanPhone = site.phone ? Number(site.phone.toString().replace(/\D/g, '')) : null;
        const rowData: any = { sno: index + 1, name: site.name, owner: site.ownerName, subOrg: site.subOrgName || 'N/A', phone: cleanPhone, email: site.email || '-', address: site.address || '-', createdBy: site.createdBy?.name || '-', date: site.dateJoined ? new Date(site.dateJoined).toLocaleDateString() : '-' };
        if (site.images) { site.images.forEach((img: any, imgIdx: number) => { const url = img.imageUrl || img.url; if (url) rowData[`img_${imgIdx}`] = { text: url, hyperlink: url, tooltip: 'Click to open' }; }); }
        dynamicCategories.forEach(catName => { const interest = site.siteInterest?.find((i: any) => i.category === catName); rowData[`cat_${catName}`] = interest ? interest.brands.join(', ') : '-'; });
        const row = worksheet.addRow(rowData);
        for (let i = 0; i < maxImages; i++) { const cell = row.getCell(`img_${i}`); if (cell.value && typeof cell.value === 'object') { cell.font = { color: { argb: 'FF0000FF' }, underline: true }; } }
      });
      worksheet.eachRow((row, rowNumber) => { row.eachCell((cell) => { cell.alignment = { horizontal: 'left', vertical: 'middle' }; if (rowNumber === 1) { cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }; cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF197ADC' } }; } }); });
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), `Sites_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success("Excel exported successfully", { id: toastId });
    } catch (err) {
      toast.error("Failed to generate Excel", { id: toastId });
    } finally {
      setExportingStatus(null);
    }
  };

  useEffect(() => { setCurrentPage(1); }, [searchTerm, filters]);

  if (loading && !data) return <SiteContentSkeleton />;

  const ITEMS_PER_PAGE = 12;
  const totalPages = Math.ceil(filteredSite.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentSite = filteredSite.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleAddSite = async (entityData: NewEntityData) => {
    try {
      const newSiteData: NewSiteData = {
        name: entityData.name,
        ownerName: entityData.ownerName,
        dateJoined: entityData.dateJoined,
        subOrgName: entityData.subOrgName, 
        phone: entityData.phone ?? '',
        email: entityData.email ?? '',
        address: entityData.address,
        latitude: entityData.latitude ?? 0,
        longitude: entityData.longitude ?? 0,
        description: entityData.description ?? '',
        siteInterest: entityData.prospectInterest, 
      };
      addSiteMutation.mutate(newSiteData);
    } catch (err) {
      toast.error("Preparation failed");
    }
  };

  return (
    <motion.div className="flex-1 flex flex-col h-full overflow-hidden" variants={containerVariants} initial="hidden" animate="show">
      {exportingStatus && (
        <div className="w-full p-2 mb-4 text-center bg-blue-100 text-blue-800 rounded-lg text-sm font-medium animate-pulse">
          Generating {exportingStatus === 'pdf' ? 'PDF' : 'Excel'}... Please wait.
        </div>
      )}

      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 flex-shrink-0">
        <h1 className="text-3xl font-bold text-[#202224]">Sites</h1>
        <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Name or Owner"
              className="h-10 w-full bg-gray-200 border border-gray-200 pl-10 pr-4 rounded-full text-sm shadow-sm outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          <div className="flex flex-row items-center gap-3">
            <button 
              type="button"
              onClick={() => setIsFilterVisible(!isFilterVisible)}
              className={`p-2.5 rounded-lg border transition-all ${isFilterVisible ? 'bg-secondary text-white border-blue-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
            >
              <FunnelIcon className="h-5 w-5" />
            </button>
            <ExportActions onExportPdf={handleExportPdf} onExportExcel={handleExportExcel} />
          </div>

          <Button onClick={() => setIsAddModalOpen(true)} className="w-full md:w-auto">
            Add New Site
          </Button>
        </div>
      </motion.div>

      {/* REFACTORED: Filter Bar Section */}
      <FilterBar 
        isVisible={isFilterVisible} 
        onClose={() => setIsFilterVisible(false)} 
        onReset={resetFilters}
      >
        <FilterDropdown 
          label="Created By" 
          options={availableCreators} 
          selected={filters.creators}
          onChange={(val) => setFilters({...filters, creators: val})}
          align="left"
        />
        <FilterDropdown 
          label="Sub Organization" 
          options={subOrgsList} 
          selected={filters.subOrgs}
          onChange={(val) => setFilters({...filters, subOrgs: val})}
          align="left"
        />
        <FilterDropdown 
          label="Category" 
          options={categoriesData.map((c: any) => c.name)} 
          selected={filters.categories}
          onChange={(val) => setFilters({...filters, categories: val})}
          align="left"
        />
        <FilterDropdown 
          label="Brand" 
          options={availableBrands} 
          selected={filters.brands} 
          onChange={(val) => setFilters({...filters, brands: val})} 
          align="left"
        />
        <FilterDropdown 
          label="Technician" 
          options={availableTechnicians} 
          selected={filters.technicians} 
          onChange={(val) => setFilters({...filters, technicians: val})} 
          align="left"
        />
      </FilterBar>

      {/* Grid Content */}
      <motion.div variants={itemVariants} className="flex-1 flex flex-col overflow-hidden">
         {!loading && filteredSite.length === 0 ? (
          <div className="text-center p-20 text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            No sites found matching your criteria.
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto overflow-x-hidden pb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 px-2 md:px-0">
                {currentSite.map(site => (
                  <ProfileCard key={site.id} basePath="/sites" id={site.id} title={site.name} ownerName={site.ownerName} address={formatAddress(site.address)} cardType="site" />
                ))}
              </div>
            </div>
            {totalPages > 1 && (
              <div className="flex-shrink-0 flex items-center justify-between mt-6 text-sm text-gray-600 pt-4 border-t border-gray-200">
                <p>Showing {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredSite.length)} of {filteredSite.length}</p>
                <div className="flex items-center gap-x-2">
                  <Button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} variant="secondary">Previous</Button>
                  <span className="font-bold bg-gray-100 px-3 py-1 rounded-md">{currentPage} / {totalPages}</span>
                  <Button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} variant="secondary">Next</Button>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>

      <AddEntityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddSite}
        title="Add New Site"
        nameLabel="Site Name"
        ownerLabel="Owner Name"
        panVatMode="hidden"
        entityType='Site'
        subOrgsList={subOrgsList}
        onAddSubOrg={onAddSubOrg}
        categoriesData={categoriesData}
      />
    </motion.div>
  );
};

const SiteContentSkeleton: React.FC = () => {
  const ITEMS_PER_PAGE = 12;
  return (
    <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f1f5f9">
      <div className="flex-1 flex flex-col h-full overflow-hidden px-1 md:px-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6 flex-shrink-0 px-1">
          <div className="flex-shrink-0"><Skeleton width={160} height={36} /></div>
          <div className="flex flex-row flex-wrap items-center justify-start lg:justify-end gap-6 w-full lg:w-auto">
            <Skeleton height={40} width={280} borderRadius={999} /><div className="flex flex-row items-center gap-6"><Skeleton width={42} height={42} borderRadius={8} /><Skeleton width={85} height={42} borderRadius={8} /></div><Skeleton height={40} width={160} borderRadius={8} />
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 px-1 md:px-0">
            {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-lg flex flex-col items-center text-center h-full">
                <div className="mb-4 flex-shrink-0"><Skeleton circle width={80} height={80} /></div>
                <div className="w-full mb-1 flex justify-center"><Skeleton width="75%" height={24} containerClassName="w-full" /></div>
                <div className="w-full mt-2 mb-2 flex justify-center"><Skeleton width="55%" height={18} containerClassName="w-full" /></div>
                <div className="w-full flex flex-col items-center gap-1.5 px-2 mt-2"><div className="w-full flex justify-center"><Skeleton width="90%" height={12} containerClassName="w-full" /></div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default SiteContent;