// In SitePage.tsx
import React, { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import SiteContent from './SiteContent';
// ✅ Added getSiteCategoriesList to imports
import { getSites, getSiteSubOrganizations, getSiteCategoriesList } from '../../api/siteService';
import toast from 'react-hot-toast';

const SitePage: React.FC = () => {
    const queryClient = useQueryClient();

    // 1. Fetch Sites
    const {
        data: siteData,
        isLoading: isSitesLoading,
        error: siteError,
        isError: isSiteError,
    } = useQuery({
        queryKey: ['sites'],
        queryFn: getSites,
    });

    // 2. Fetch Sub-Organizations
    const {
        data: subOrgsData = [],
        isLoading: isSubOrgsLoading,
    } = useQuery({
        queryKey: ['subOrganizations'],
        queryFn: getSiteSubOrganizations,
        staleTime: 5 * 60 * 1000,
    });

    // ✅ 3. ADDED: Fetch Site Categories
    const {
        data: categoriesData = [],
        isLoading: isCatsLoading,
    } = useQuery({
        queryKey: ['siteCategories'], // Changed key to differentiate from prospects
        queryFn: getSiteCategoriesList,
        staleTime: 30 * 60 * 1000, 
    });

    const handleAddSubOrg = (newSubOrg: string) => {
        queryClient.setQueryData(['subOrganizations'], (oldData: string[] | undefined) => {
            const currentList = oldData || [];
            if (!currentList.includes(newSubOrg)) {
                return [...currentList, newSubOrg].sort();
            }
            return currentList;
        });
    };

    useEffect(() => {
        if (isSiteError && siteError) {
            toast.error(siteError.message || 'Failed to load site data.');
        }
    }, [isSiteError, siteError]);

    // ✅ Updated isLoading to include categories
    const isLoading = isSitesLoading || isSubOrgsLoading || isCatsLoading;

    return (
        <Sidebar>
            <SiteContent
                data={siteData || null}
                loading={isLoading}
                error={siteError instanceof Error ? siteError.message : null}
                subOrgsList={subOrgsData}
                onAddSubOrg={handleAddSubOrg}
                // ✅ PASS CATEGORIES DATA DOWN
                categoriesData={categoriesData}
            />
        </Sidebar>
    );
};

export default SitePage;