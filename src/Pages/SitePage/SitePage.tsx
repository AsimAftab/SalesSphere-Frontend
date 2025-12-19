import React, { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query'; // Import useQueryClient
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import SiteContent from './SiteContent';
// ✅ Import getSiteSubOrganizations
import { getSites, getSiteSubOrganizations } from '../../api/siteService'; 
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

    // ✅ 2. Fetch Sub-Organizations
    const {
        data: subOrgsData,
        isLoading: isSubOrgsLoading,
    } = useQuery({
        queryKey: ['subOrganizations'],
        queryFn: getSiteSubOrganizations,
        initialData: [],
    });

    // ✅ 3. Handler to update Sub-Org list immediately after creation
    const handleAddSubOrg = (newSubOrg: string) => {
        queryClient.setQueryData(['subOrganizations'], (oldData: string[] | undefined) => {
            const currentList = oldData || [];
            if (!currentList.includes(newSubOrg)) {
                return [...currentList, newSubOrg].sort();
            }
            return currentList;
        });
    };

    // Error Handling
    useEffect(() => {
        if (isSiteError && siteError) {
            toast.error(siteError.message || 'Failed to load site data.');
        }
    }, [isSiteError, siteError]);

    const isLoading = isSitesLoading || isSubOrgsLoading;

    return (
        <Sidebar>
            <SiteContent
                data={siteData || null}
                loading={isLoading}
                error={siteError instanceof Error ? siteError.message : null}
                // ✅ Pass the props down
                subOrgsList={subOrgsData}
                onAddSubOrg={handleAddSubOrg}
            />
        </Sidebar>
    );
};

export default SitePage;