import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import ProspectContent from './ProspectContent';
import { 
    getProspects, 
    addProspect, 
    getAllProspectsDetails, // ✅ Import maintained
    getProspectCategoriesList, 
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

    // 2. Fetch Categories & Brands
    const categoryQuery = useQuery({
        queryKey: [CATEGORIES_QUERY_KEY],
        queryFn: getProspectCategoriesList,
        staleTime: 1000 * 60 * 30, 
    });

    // 3. Add Prospect Mutation
    const addProspectMutation = useMutation({
        mutationFn: (newProspectData: NewProspectData) => addProspect(newProspectData),
        onSuccess: () => {
            toast.success('Prospect added successfully!');
            queryClient.invalidateQueries({ queryKey: [PROSPECTS_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to add prospect');
        },
    });

    const handleSaveProspect = (newProspectData: NewProspectData) => {
        addProspectMutation.mutate(newProspectData);
    };

    // --- EXPORT HANDLERS ---

    // ✅ Updated PDF Handler: Uses getAllProspectsDetails + Filters + Opens in New Tab
    const handleExportPdf = async (filteredIds: string[]) => {
        setExportingStatus('pdf');
        const toastId = toast.loading("Preparing PDF view...");
        try {
            const response: any = await getAllProspectsDetails();
            const allData = response.data || (Array.isArray(response) ? response : []); 
            
            // Filter raw detail data to match only what's on screen
            const dataToExport = allData.filter((item: any) => filteredIds.includes(item._id));

            const { pdf } = await import('@react-pdf/renderer');
            const ProspectListPDF = (await import('./ProspectListPDF')).default; 
            
            const blob = await pdf(<ProspectListPDF prospects={dataToExport} />).toBlob();
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank'); // Opens in new tab

            toast.success('PDF opened in new tab', { id: toastId });
        } catch (err) {
            toast.error('Failed to export PDF', { id: toastId });
        } finally {
            setExportingStatus(null);
        }
    };

    // ✅ Updated Excel Handler: Uses getAllProspectsDetails + Filters + Left Alignment + Images First
    const handleExportExcel = async (filteredIds: string[]) => {
        setExportingStatus('excel');
        const toastId = toast.loading("Generating Excel report...");
        try {
            const response: any = await getAllProspectsDetails();
            const allData = response.data || (Array.isArray(response) ? response : []);
            
            // Filter raw detail data to match only what's on screen
            const rawData = allData.filter((item: any) => filteredIds.includes(item._id));

            const ExcelJS = (await import('exceljs')).default;
            const { saveAs } = await import('file-saver');
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Prospects');
            
            // 1. Identify dynamic columns based ONLY on filtered data
            const activeCategoriesSet = new Set<string>();
            let maxImageCount = 0;

            rawData.forEach((item: any) => {
                if (item.prospectInterest) {
                    item.prospectInterest.forEach((i: any) => i.category && activeCategoriesSet.add(i.category));
                }
                if (item.images) maxImageCount = Math.max(maxImageCount, item.images.length);
            });
            const sortedCategories = Array.from(activeCategoriesSet).sort();

            // 2. Define Columns
            const columns: any[] = [
                { header: 'S.No', key: 's_no', width: 8 },
                { header: 'Prospect Name', key: 'prospectName', width: 25 },
                { header: 'Owner Name', key: 'ownerName', width: 20 },
                { header: 'Phone', key: 'phone', width: 18 },
                { header: 'Email', key: 'email', width: 25 },
                { header: 'PAN/VAT', key: 'panVat', width: 15 },
                { header: 'Date Joined', key: 'dateJoined', width: 15 },
                { header: 'Address', key: 'address', width: 40 },
            ];

            // 3. Images First
            for (let i = 1; i <= maxImageCount; i++) {
                columns.push({ header: `Image ${i}`, key: `img_${i}`, width: 50 });
            }

            // 4. Categories Last
            sortedCategories.forEach(category => {
                columns.push({ header: `${category} (Brands)`, key: `cat_${category}`, width: 30 });
            });

            worksheet.columns = columns;

            // 5. Map Rows
            rawData.forEach((item: any, index: number) => {
                const cleanPhone = item.contact?.phone ? Number(String(item.contact.phone).replace(/\D/g, '')) : null;

                const rowData: any = {
                    s_no: index + 1,
                    prospectName: item.prospectName || 'N/A', 
                    ownerName: item.ownerName || 'N/A',
                    phone: cleanPhone, 
                    email: item.contact?.email || '-',
                    panVat: item.panVatNumber || '-',
                    dateJoined: item.dateJoined ? new Date(item.dateJoined).toLocaleDateString('en-GB') : '-',
                    address: item.location?.address || '-',
                };

                if (item.images) {
                    item.images.forEach((img: any, i: number) => {
                        rowData[`img_${i + 1}`] = { text: img.imageUrl, hyperlink: img.imageUrl };
                    });
                }

                sortedCategories.forEach(catName => {
                    const interest = item.prospectInterest?.find((pi: any) => pi.category === catName);
                    rowData[`cat_${catName}`] = interest ? interest.brands.join(', ') : '-';
                });

                worksheet.addRow(rowData);
            });

            // 6. Global Left Alignment & Styling
            worksheet.eachRow((row, rowNumber) => {
                row.eachCell((cell) => {
                    cell.alignment = { horizontal: 'left', vertical: 'middle' };
                    if (rowNumber === 1) {
                        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF197ADC' } };
                    } else if (cell.value && (cell.value as any).hyperlink) {
                        cell.font = { color: { argb: 'FF0000FF' }, underline: true };
                    }
                });
            });

            const buffer = await workbook.xlsx.writeBuffer();
            saveAs(new Blob([buffer]), `Prospect_Filtered_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
            toast.success('Excel exported successfully', { id: toastId });
        } catch (err) {
            toast.error('Failed to export Excel', { id: toastId });
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
                // ✅ Pass functions to child (Cast to any to allow filtered IDs argument)
                onExportPdf={handleExportPdf as any}
                onExportExcel={handleExportExcel as any}
                exportingStatus={exportingStatus}
                categoriesData={categoryQuery.data || []}
            />
        </Sidebar>
    );
};

export default ProspectPage;