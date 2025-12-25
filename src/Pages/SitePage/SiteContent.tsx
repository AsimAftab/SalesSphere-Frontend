import React, { useState, useMemo, useEffect, useRef } from 'react'; 
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion'; 
import ProfileCard from '../../components/UI/ProfileCard';
import Button from '../../components/UI/Button/Button';
import { type Site, addSite, type NewSiteData } from '../../api/siteService';
import AddEntityModal, { type NewEntityData } from '../../components/modals/AddEntityModal';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  ArrowPathIcon, 
  ChevronDownIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'; 
import 'react-loading-skeleton/dist/skeleton.css'; 
import ExportActions from '../../components/UI/ExportActions';
import { saveAs } from 'file-saver';

interface SiteContentProps {
  data: Site[] | null;
  loading: boolean;
  error: string | null;
  subOrgsList?: string[];
  onAddSubOrg?: (newOrg: string) => void;
  categoriesData?: any[];
}

interface FilterDropdownProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
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

const SiteContentSkeleton: React.FC = () => {
  const ITEMS_PER_PAGE = 12;
  return (
    <SkeletonTheme baseColor="#e6e6e6" highlightColor="#f0f0f0">
      <div className="flex-1 flex flex-col h-full overflow-hidden overflow-x-hidden p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <Skeleton width={150} height={40} />
          <div className="flex gap-4">
            <Skeleton width={250} height={40} borderRadius={20} />
            <Skeleton width={40} height={40} />
            <Skeleton width={120} height={40} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-lg border border-gray-200">
              <Skeleton circle width={64} height={64} className="mx-auto mb-4" />
              <Skeleton count={3} />
            </div>
          ))}
        </div>
      </div>
    </SkeletonTheme>
  );
};

const FilterDropdown: React.FC<FilterDropdownProps> = ({ label, options, selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleOption = (option: string) => {
    const newSelected = selected.includes(option)
      ? selected.filter((item) => item !== option)
      : [...selected, option];
    onChange(newSelected);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white transition-colors group"
      >
        <span>{label}</span>
        {selected.length > 0 && (
          <span className="bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
            {selected.length}
          </span>
        )}
        <ChevronDownIcon className={`h-3 w-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute left-0 mt-3 w-56 bg-white rounded-lg shadow-2xl py-2 z-[100] border border-gray-100 overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {options.length === 0 ? (
                <div className="px-4 py-2 text-xs text-gray-400 italic">No options available</div>
              ) : (
                options.map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors group"
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(opt)}
                      onChange={() => handleToggleOption(opt)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-blue-700 truncate">{opt}</span>
                  </label>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SiteContent: React.FC<SiteContentProps> = ({
  data,
  loading,
  error,
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
  const names = data
    .map((site) => site.createdBy?.name)
    .filter(Boolean); // Remove null/undefined
  return Array.from(new Set(names)).sort() as string[];
}, [data]);

  // ✅ DYNAMIC DEPENDENT DATA EXTRACTION
  const availableBrands = useMemo(() => {
    // If categories are selected, filter the data pool first
    const sourceData = filters.categories.length > 0
      ? categoriesData.filter((cat: any) => filters.categories.includes(cat.name))
      : categoriesData;

    const brands = sourceData.flatMap((cat: any) => cat.brands || []);
    return Array.from(new Set(brands)).sort() as string[];
  }, [categoriesData, filters.categories]);

  const availableTechnicians = useMemo(() => {
    // If categories are selected, filter the data pool first
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

    // ✅ Added: Created By filter check
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

    return matchesSearch && matchesSubOrg && matchesInterests && matchesCreator; // ✅ Added matchesCreator
  });
}, [data, searchTerm, filters]);

  const handleExportPdf = async () => {
    if (!filteredSite || filteredSite.length === 0) return toast.error("No data to export");

    setExportingStatus('pdf');
    try {
      // Lazy load dependencies
      const { pdf } = await import('@react-pdf/renderer');
      const { default: SiteListPDF } = await import('./SiteListPDF');

      const blob = await pdf(<SiteListPDF sites={filteredSite} />).toBlob();
      saveAs(blob, `Sites_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success("PDF exported successfully");
    } catch (err) {
      console.error("PDF Export Error:", err);
      toast.error("Failed to generate PDF");
    } finally {
      setExportingStatus(null);
    }
  };

  const handleExportExcel = async () => {
  if (!filteredSite || filteredSite.length === 0) return toast.error("No data to export");

  setExportingStatus('excel');
  try {
    const ExcelJS = (await import('exceljs')).default;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sites');

    // 1. Determine max images using the correct property from your API
    const maxImages = filteredSite.reduce((max, site) => 
      Math.max(max, (site.images?.length || 0)), 0
    );

    const dynamicCategories = categoriesData.map(cat => cat.name);

    // 2. Define Columns
    const baseColumns = [
      { header: 'S.No', key: 'sno', width: 8 },
      { header: 'Site Name', key: 'name', width: 25 },
      { header: 'Owner Name', key: 'owner', width: 20 },
      { header: 'Sub Organization', key: 'subOrg', width: 25 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Date Joined', key: 'date', width: 12 },
      { header: 'Address', key: 'address', width: 40 },
      { header: 'Description', key: 'description', width: 35 },
    ];

    const categoryColumns = dynamicCategories.map(catName => ({
      header: `${catName} (Brands)`,
      key: `cat_${catName}`,
      width: 25
    }));

    const imageColumns = Array.from({ length: maxImages }, (_, i) => ({
      header: `Image ${i + 1}`,
      key: `image_${i}`,
      width: 40
    }));

    worksheet.columns = [...baseColumns,...imageColumns, ...categoryColumns];

    // 3. Add Rows
    filteredSite.forEach((site, index) => {
      const rowData: any = {
        sno: index + 1,
        name: site.name,
        owner: site.ownerName,
        subOrg: site.subOrgName || 'N/A',
        phone: site.phone ? Number(site.phone.replace(/\D/g, '')) : null,
        email: site.email || 'N/A',
        date: site.dateJoined ? new Date(site.dateJoined).toLocaleDateString() : 'N/A',
        address: site.address || 'N/A',
        description: site.description || '-',
      };

      dynamicCategories.forEach(catName => {
        const interest = site.siteInterest?.find((i: any) => i.category === catName);
        rowData[`cat_${catName}`] = interest ? interest.brands.join(', ') : '-';
      });

      // FIX: Access site.images[].imageUrl as per your API JSON
      if (site.images && Array.isArray(site.images)) {
        site.images.forEach((imgObj: any, imgIdx: number) => {
          const url = imgObj.imageUrl; // Accessing the correct property
          if (url) {
            rowData[`image_${imgIdx}`] = {
              text: url,
              hyperlink: url,
              tooltip: 'Click to view image'
            };
          }
        });
      }

      const row = worksheet.addRow(rowData);
      
      // Styling: Black underlined text for hyperlinks (No blue highlight)
      if (site.images) {
        site.images.forEach((_: any, imgIdx: number) => {
          const cell = row.getCell(`image_${imgIdx}`);
          if (cell.value && typeof cell.value === 'object') {
            cell.font = { underline: true, color: { argb: 'FF0000FF' } };
          }
        });
      }
    });

    // 4. Global Alignment and Plain Header
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
      });

      if (rowNumber === 1) {
        row.font = { bold: true };
        row.fill = { type: 'pattern', pattern: 'none' }; 
      }
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Sites_Full_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("Excel exported successfully");
  } catch (err) {
    toast.error("Failed to generate Excel");
  } finally {
    setExportingStatus(null);
  }
};

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  if (loading && !data) return <SiteContentSkeleton />;
  
  if (error) {
    console.error("Filter error:", error);
  }

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
          <button 
            type="button"
            onClick={() => setIsFilterVisible(!isFilterVisible)}
            className={`p-2.5 rounded-lg border transition-all ${isFilterVisible ? 'bg-secondary text-white border-blue-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
          >
            <FunnelIcon className="h-5 w-5" />
          </button>

          <div className="flex-shrink-0">
            <ExportActions 
                onExportPdf={handleExportPdf}   
                onExportExcel={handleExportExcel}
            />
                    </div>
          <Button onClick={() => setIsAddModalOpen(true)} className="w-full md:w-auto">
            Add New Site
          </Button>
        </div>
      </motion.div>

      {/* Expandable Filter Bar */}
      <AnimatePresence>
        {isFilterVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-visible mb-6"
          >
            <div className="bg-primary rounded-xl p-5 text-white flex flex-wrap items-center gap-12 shadow-xl relative z-[60]">
              <div className="flex items-center gap-3 text-sm font-semibold border-r border-white/20 pr-6">
                <FunnelIcon className="h-4 w-4 text-white/70" />
                <span>Filter By</span>
              </div>

              <FilterDropdown 
                label="Sub Organization" 
                options={subOrgsList} 
                selected={filters.subOrgs}
                onChange={(val: string[]) => setFilters({...filters, subOrgs: val})}
              />

              {/* ✅ ADDED: Filter by Creator */}
              <FilterDropdown 
                label="Created By" 
                options={availableCreators} 
                selected={filters.creators}
                onChange={(val: string[]) => setFilters({...filters, creators: val})}
              />

              <FilterDropdown 
                label="Category" 
                options={categoriesData.map((c: any) => c.name)} 
                selected={filters.categories}
                onChange={(val: string[]) => setFilters({...filters, categories: val})}
              />

              <FilterDropdown 
                label="Brand" 
                options={availableBrands} 
                selected={filters.brands} 
                onChange={(val: string[]) => setFilters({...filters, brands: val})} 
              />
              
              <FilterDropdown 
                label="Technician" 
                options={availableTechnicians} 
                selected={filters.technicians} 
                onChange={(val: string[]) => setFilters({...filters, technicians: val})} 
              />

              <button 
                type="button"
                onClick={resetFilters}
                className="ml-auto flex items-center gap-2 text-[#FF9E66] hover:text-[#ffb285] transition-colors text-sm font-bold uppercase tracking-wider"
              >
                <ArrowPathIcon className="h-4 w-4" />
                Reset Filter
              </button>

              <button onClick={() => setIsFilterVisible(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors ml-2">
                <XMarkIcon className="h-4 w-4 text-white/40 hover:text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                  <ProfileCard
                    key={site.id}
                    basePath="/sites"
                    id={site.id}
                    title={site.name}
                    ownerName={site.ownerName}
                    address={formatAddress(site.address)} 
                    cardType="site"
                  />
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

export default SiteContent;