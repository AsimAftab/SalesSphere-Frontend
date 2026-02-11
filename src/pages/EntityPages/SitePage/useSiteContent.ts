import { useState, useMemo, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { type Site, addSite, type NewSiteData, type Technician } from '@/api/siteService';
import { type NewEntityData } from '@/components/modals/Entities/AddEntityModal/types';
import { useEntityManager } from '../Shared/useEntityManager';
import { SiteExportService } from './components/SiteExportService';
import { useAuth } from '@/api/authService';

export interface SiteCategoryWithTechnicians {
    _id: string;
    name: string;
    brands: string[];
    technicians?: Technician[];
}

export const useSiteContent = (
    data: Site[] | null,
    categoriesData: SiteCategoryWithTechnicians[] = [],
    onAddSubOrg?: (newOrg: string) => void
) => {
    const queryClient = useQueryClient();
    const { hasPermission } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [exportingStatus, setExportingStatus] = useState<'pdf' | 'excel' | null>(null);

    // --- Site-specific filter state ---
    const [filters, setFilters] = useState({
        categories: [] as string[],
        brands: [] as string[],
        technicians: [] as string[],
        subOrgs: [] as string[],
        creators: [] as string[],
    });

    // Capture filter=today on mount, then strip it from the URL
    const initialFilter = useRef(searchParams.get('filter'));
    const dateFilter = initialFilter.current === 'today' ? 'today' : 'all';

    // --- Initialize Filters from URL (one-time) ---
    useEffect(() => {
        const brandParam = searchParams.get('brand');
        const subOrgParam = searchParams.get('subOrg');

        if (brandParam) {
            setFilters(prev => ({ ...prev, brands: [decodeURIComponent(brandParam)] }));
            setIsFilterVisible(true);
        }
        if (subOrgParam) {
            setFilters(prev => ({ ...prev, subOrgs: [decodeURIComponent(subOrgParam)] }));
            setIsFilterVisible(true);
        }

        // Strip the one-time filter param from the URL
        if (searchParams.has('filter')) {
            searchParams.delete('filter');
            setSearchParams(searchParams, { replace: true });
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // --- Shared Entity Manager (Search & Pagination) ---
    const {
        searchTerm, setSearchTerm,
        currentPage, setCurrentPage,
        resetFilters: resetBaseFilters,
    } = useEntityManager(data, ['name', 'ownerName']);

    // --- Complex Filtering Logic ---
    const filteredData = useMemo(() => {
        if (!data) return [];
        const lowerSearch = searchTerm.toLowerCase();

        // Helper for Today check
        const isToday = (dateString: string) => {
            if (!dateString) return false;
            let d: Date;

            // Handle DD-MM-YYYY format (e.g., "25-01-2026") - Treat as LOCAL
            if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(dateString)) {
                const [day, month, year] = dateString.split('-').map(Number);
                d = new Date(year, month - 1, day);
            }
            // Handle YYYY-MM-DD format (e.g., "2026-01-25") - Treat as LOCAL to avoid UTC interpretation
            else if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
                const [year, month, day] = dateString.split('-').map(Number);
                d = new Date(year, month - 1, day);
            }
            else {
                // Fallback to standard parsing (ISO with time, etc.)
                d = new Date(dateString);
            }

            if (isNaN(d.getTime())) return false;

            const today = new Date();
            return d.toDateString() === today.toDateString();
        };

        return data.filter((site) => {
            // 0. Date Filter (URL)
            if (dateFilter === 'today') {
                if (!isToday(site.createdAt || '')) return false;
            }

            // 1. Search
            const matchesSearch =
                (site.name?.toLowerCase() || '').includes(lowerSearch) ||
                (site.ownerName?.toLowerCase() || '').includes(lowerSearch);
            if (!matchesSearch) return false;

            // 2. Sub-Org Filter
            if (filters.subOrgs.length > 0) {
                const isNone = filters.subOrgs.includes('None');
                const hasNoSubOrg = !site.subOrgName || site.subOrgName === 'N/A';
                const matches = site.subOrgName && filters.subOrgs.includes(site.subOrgName);
                if (!((isNone && hasNoSubOrg) || matches)) return false;
            }

            // 3. Creator Filter
            if (filters.creators.length > 0) {
                const isNone = filters.creators.includes('None');
                const hasNoCreator = !site.createdBy?.name;
                const matches = site.createdBy?.name && filters.creators.includes(site.createdBy.name);
                if (!((isNone && hasNoCreator) || matches)) return false;
            }

            // 4. Interest-based filtering (categories, brands, technicians)
            const hasCatFilter = filters.categories.length > 0;
            const hasBrandFilter = filters.brands.length > 0;
            const hasTechFilter = filters.technicians.length > 0;

            if (hasCatFilter || hasBrandFilter || hasTechFilter) {
                const interests = site.siteInterest || [];
                const hasInterests = interests.length > 0;

                // --- Category Filter ---
                if (hasCatFilter) {
                    const catNone = filters.categories.includes('Not Specified') || filters.categories.includes('None');
                    const catSpecific = filters.categories.filter(c => c !== 'Not Specified' && c !== 'None');

                    // Match if (None Selected AND No Interests) OR (Has Interest matching Specific)
                    const matchesNone = catNone && !hasInterests;
                    const matchesSpecific = hasInterests && interests.some(i => catSpecific.includes(i.category));

                    if (!matchesNone && !matchesSpecific) return false;
                }

                // --- Brand Filter ---
                if (hasBrandFilter) {
                    const brandNone = filters.brands.includes('Not Specified') || filters.brands.includes('None');
                    const brandSpecific = filters.brands.filter(b => b !== 'Not Specified' && b !== 'None');

                    // Match if (None Selected AND (No Interests OR Interest has no brands)) OR (Interest has matching Brand)
                    const matchesNone = brandNone && (!hasInterests || interests.every(i => !i.brands || i.brands.length === 0));
                    const matchesSpecific = hasInterests && interests.some(i => i.brands?.some(b => brandSpecific.includes(b)));

                    if (!matchesNone && !matchesSpecific) return false;
                }

                // --- Technician (Contact) Filter ---
                if (hasTechFilter) {
                    const techNone = filters.technicians.includes('Not Specified') || filters.technicians.includes('None');
                    const techSpecific = filters.technicians.filter(t => t !== 'Not Specified' && t !== 'None');

                    // Match if (None Selected AND (No Interests OR Interest has no techs)) OR (Interest has matching Tech)
                    const matchesNone = techNone && (!hasInterests || interests.every(i => !i.technicians || i.technicians.length === 0));
                    const matchesSpecific = hasInterests && interests.some(i => i.technicians?.some((t) => techSpecific.includes(t.name)));

                    if (!matchesNone && !matchesSpecific) return false;
                }
            }

            return true;
        });
    }, [data, searchTerm, filters, dateFilter]);

    // --- Pagination ---
    const ITEMS_PER_PAGE = 12;
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredData.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredData, currentPage]);

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

    // --- Computed Filter Options ---
    const availableCreators = useMemo(() => {
        if (!data) return [];
        return Array.from(new Set(data.map((s) => s.createdBy?.name).filter(Boolean))).sort() as string[];
    }, [data]);

    const availableBrands = useMemo(() => {
        const source = filters.categories.length > 0
            ? categoriesData.filter((c) => filters.categories.includes(c.name))
            : categoriesData;
        return Array.from(new Set(source.flatMap((c) => c.brands || []))).sort() as string[];
    }, [categoriesData, filters.categories]);

    const availableTechnicians = useMemo(() => {
        const source = filters.categories.length > 0
            ? categoriesData.filter((c) => filters.categories.includes(c.name))
            : categoriesData;
        return Array.from(
            new Set(source.flatMap((c) => c.technicians?.map((t) => t.name) || []))
        ).sort() as string[];
    }, [categoriesData, filters.categories]);

    // --- Mutations ---
    const addSiteMutation = useMutation({
        mutationFn: addSite,
        onSuccess: () => {
            toast.success('Site added successfully!');
            queryClient.invalidateQueries({ queryKey: ['sites'] });
            queryClient.invalidateQueries({ queryKey: ['sitesDashboardData'] });
            queryClient.invalidateQueries({ queryKey: ['sitesCategoriesData'] });
            queryClient.invalidateQueries({ queryKey: ['sitesSubOrgsData'] });
            setIsAddModalOpen(false);
        },
        onError: (err: Error) => {
            toast.error(err.message || 'Failed to add site.');
        },
    });

    const handleAddSite = async (entityData: NewEntityData): Promise<void> => {
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
            siteInterest: entityData.siteInterest,
        };
        addSiteMutation.mutate(newSiteData);
    };

    // --- Actions ---
    const resetAllFilters = () => {
        resetBaseFilters();
        setFilters({ categories: [], brands: [], technicians: [], subOrgs: [], creators: [] });
        // dateFilter is derived from URL param, no need to reset
    };

    const handleExport = (type: 'pdf' | 'excel') => {
        if (type === 'pdf') SiteExportService.toPdf(filteredData, setExportingStatus);
        else SiteExportService.toExcel(filteredData, setExportingStatus);
    };

    return {
        // State
        searchTerm,
        setSearchTerm,
        isFilterVisible,
        setIsFilterVisible,
        filters,
        setFilters,
        currentPage,
        setCurrentPage,
        isAddModalOpen,
        setIsAddModalOpen,
        exportingStatus,

        // Data
        paginatedData,
        filteredDataCount: filteredData.length,
        totalPages,

        // Filter Options
        availableCreators,
        availableBrands,
        availableTechnicians,

        // handlers
        resetAllFilters,
        handleAddSite,
        onAddSubOrg, // pass through
        handleExport,

        // Status
        isCreating: addSiteMutation.isPending,
        itemsPerPage: ITEMS_PER_PAGE,

        // Permissions
        permissions: {
            canCreate: hasPermission('sites', 'create'),
            canView: hasPermission('sites', 'view'),
            canExportPdf: hasPermission('sites', 'exportPdf'),
            canExportExcel: hasPermission('sites', 'exportExcel'),
        }
    };
};
