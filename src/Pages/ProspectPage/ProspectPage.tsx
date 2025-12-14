import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import ProspectContent from './ProspectContent';
import { 
    getProspects, 
    addProspect, 
    getAllProspectsDetails,
    getProspectCategoriesList, // Make sure this is imported
    type NewProspectData 
} from '../../api/prospectService';
import toast from 'react-hot-toast';

const PROSPECTS_QUERY_KEY = 'prospects';
const CATEGORIES_QUERY_KEY = 'prospectCategories';

const ProspectPage: React.FC = () => {
    const queryClient = useQueryClient();
    const [exportingStatus, setExportingStatus] = useState<'pdf' | 'excel' | null>(null);

    // 1. Fetch Prospects
    const prospectQuery = useQuery({
        queryKey: [PROSPECTS_QUERY_KEY],
        queryFn: getProspects,
        staleTime: 1000 * 60 * 5, 
    });

    // 2. Fetch Categories & Brands (NEW)
    const categoryQuery = useQuery({
        queryKey: [CATEGORIES_QUERY_KEY],
        queryFn: getProspectCategoriesList,
        staleTime: 1000 * 60 * 30, // Cache for 30 mins
    });

    // Process API data into simple lists for the Modal
    const existingCategories = categoryQuery.data?.map(cat => cat.name) || [];
    // Flatten all brands from all categories into one unique list for suggestions
    const existingBrands = Array.from(new Set(
        categoryQuery.data?.flatMap(cat => cat.brands) || []
    ));

    // 3. Add Prospect Mutation
    const addProspectMutation = useMutation({
        mutationFn: (newProspectData: NewProspectData) => addProspect(newProspectData),
        onSuccess: () => {
            toast.success('Prospect added successfully!');
            queryClient.invalidateQueries({ queryKey: [PROSPECTS_QUERY_KEY] });
            // Also invalidate categories in case the backend creates new ones automatically
            queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to add prospect');
        },
    });

    const handleSaveProspect = (newProspectData: NewProspectData) => {
        addProspectMutation.mutate(newProspectData);
    };

    // --- EXPORT HANDLERS (Unchanged) ---
    const handleExportPdf = async () => {
        setExportingStatus('pdf');
        try {
            const response: any = await getAllProspectsDetails();
            const rawData = response.data || (Array.isArray(response) ? response : []); 
            const { pdf } = await import('@react-pdf/renderer');
            const { saveAs } = await import('file-saver');
            const ProspectListPDF = (await import('./ProspectListPDF')).default; 
            const doc = <ProspectListPDF prospects={rawData} />;
            const blob = await pdf(doc).toBlob();
            saveAs(blob, `Prospect_List_${new Date().toISOString().split('T')[0]}.pdf`);
            toast.success('PDF exported successfully');
        } catch (err) {
            console.error(err);
            toast.error('Failed to export PDF');
        } finally {
            setExportingStatus(null);
        }
    };

    const handleExportExcel = async () => {
        setExportingStatus('excel');
        try {
            const response: any = await getAllProspectsDetails();
            const rawData = response.data || (Array.isArray(response) ? response : []);
            const ExcelJS = await import('exceljs');
            const { saveAs } = await import('file-saver');
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Prospects');
            
            worksheet.columns = [
                { header: 'S.No', key: 's_no',style:{ alignment: { horizontal: 'left' }}},
                { header: 'Prospect Name', key: 'prospectName' },
                { header: 'Owner Name', key: 'ownerName' },
                { header: 'Phone', key: 'phone', style: { numFmt: '0', alignment: { horizontal: 'left' }}},
                { header: 'Email', key: 'email' },
                { header: 'PAN/VAT', key: 'panVat' },
                { header: 'Date Joined', key: 'dateJoined' },
                { header: 'Address', key: 'address' },
                { header: 'Description', key: 'description' },
            ];

            const rows = rawData.map((item: any, index: number) => {
                let phoneNum: number | string = 'N/A';
                if (item.contact?.phone) {
                    const cleanPhone = String(item.contact.phone).replace(/\D/g, ''); 
                    phoneNum = cleanPhone ? Number(cleanPhone) : 'N/A';
                }

                return {
                    s_no: index + 1,
                    prospectName: item.prospectName || 'N/A',
                    ownerName: item.ownerName || 'N/A',
                    phone: phoneNum, 
                    email: item.contact?.email || 'N/A',
                    panVat: item.panVatNumber || 'N/A',
                    dateJoined: item.dateJoined ? new Date(item.dateJoined).toLocaleDateString() : 'N/A',
                    address: item.location?.address || 'N/A',
                    description: item.description || 'N/A',
                };
            });

            worksheet.addRows(rows);
            // ... styling code ...
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, `Prospect_List_${new Date().toISOString().split('T')[0]}.xlsx`);
            toast.success('Excel exported successfully');
        } catch (err) {
            toast.error('Failed to export Excel');
        } finally {
            setExportingStatus(null);
        }
    };

    return (
        <Sidebar>
            <ProspectContent
                data={prospectQuery.data || null}
                loading={prospectQuery.isPending}
                error={prospectQuery.isError ? prospectQuery.error.message : null}
                onSaveProspect={handleSaveProspect}
                isCreating={addProspectMutation.isPending}
                onExportPdf={handleExportPdf}
                onExportExcel={handleExportExcel}
                exportingStatus={exportingStatus}
                // 👇 Pass the fetched data here
                existingCategories={existingCategories}
                existingBrands={existingBrands}
            />
        </Sidebar>
    );
};

export default ProspectPage;