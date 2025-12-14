import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import ProspectContent from './ProspectContent';
import { 
    getProspects, 
    addProspect, 
    getAllProspectsDetails,
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

    // Process API data into simple lists for simple dropdowns if needed
    const existingCategories = categoryQuery.data?.map(cat => cat.name) || [];
    const existingBrands = Array.from(new Set(
        categoryQuery.data?.flatMap(cat => cat.brands) || []
    ));

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
            
            // 1. Identify ALL unique categories & Max Images
            const allUniqueCategories = new Set<string>();
            let maxImageCount = 0;

            rawData.forEach((item: any) => {
                if (item.prospectInterest && Array.isArray(item.prospectInterest)) {
                    item.prospectInterest.forEach((interest: any) => {
                        if (interest.category) {
                            allUniqueCategories.add(interest.category);
                        }
                    });
                }
                if (item.images && Array.isArray(item.images)) {
                    maxImageCount = Math.max(maxImageCount, item.images.length);
                }
            });
            const sortedCategories = Array.from(allUniqueCategories).sort();

            // 2. Define Static Columns
            const columns: any[] = [
                { header: 'S.No', key: 's_no', width: 8, style: { alignment: { horizontal: 'left' as const } } },
                { header: 'Prospect Name', key: 'prospectName', width: 25 },
                { header: 'Owner Name', key: 'ownerName', width: 20 },
                { header: 'Phone', key: 'phone', width: 15, style: { numFmt: '0', alignment: { horizontal: 'left' as const } } },
                { header: 'Email', key: 'email', width: 25 },
                { header: 'PAN/VAT', key: 'panVat', width: 15 },
                { header: 'Date Joined', key: 'dateJoined', width: 15 },
                { header: 'Address', key: 'address', width: 30 },
                { header: 'Description', key: 'description', width: 30 },
            ];

            // 3. Append Dynamic Columns (ORDER CHANGED)
            
            // 3a. Images First
            for (let i = 1; i <= maxImageCount; i++) {
                columns.push({
                    header: `Image ${i}`,
                    key: `img_${i}`,
                    width: 50 
                });
            }

            // 3b. Categories Last
            sortedCategories.forEach(category => {
                columns.push({ 
                    header: `${category} (Brands)`, 
                    key: `cat_${category}`,         
                    width: 30 
                });
            });

            worksheet.columns = columns;

            // 4. Map Data Rows
            const rows = rawData.map((item: any, index: number) => {
                let phoneNum: number | string = 'N/A';
                if (item.contact?.phone) {
                    const cleanPhone = String(item.contact.phone).replace(/\D/g, ''); 
                    phoneNum = cleanPhone ? Number(cleanPhone) : 'N/A';
                }

                const rowData: any = {
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

                // 4a. Dynamic Image Data Mapping
                if (item.images && Array.isArray(item.images)) {
                    const sortedImages = [...item.images].sort((a, b) => a.imageNumber - b.imageNumber);
                    
                    sortedImages.forEach((img, i) => {
                        const columnKey = `img_${i + 1}`;
                        rowData[columnKey] = {
                            text: img.imageUrl, 
                            hyperlink: img.imageUrl,
                            tooltip: 'Click to open image'
                        };
                    });
                }

                // 4b. Dynamic Interest Data Mapping
                sortedCategories.forEach(catName => {
                    const interestEntry = item.prospectInterest?.find(
                        (pi: any) => pi.category === catName
                    );

                    if (interestEntry && interestEntry.brands && interestEntry.brands.length > 0) {
                        rowData[`cat_${catName}`] = interestEntry.brands.join(', ');
                    } else {
                        rowData[`cat_${catName}`] = '-'; 
                    }
                });

                return rowData;
            });

            worksheet.addRows(rows);
            
            // 5. Styling
            worksheet.getRow(1).font = { bold: true };

            // Apply Hyperlink Styling (Blue & Underlined) ONLY to image cells
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber > 1) { 
                    // Iterate through dynamic image columns
                    for (let i = 1; i <= maxImageCount; i++) {
                        const imgKey = `img_${i}`;
                        const cell = row.getCell(imgKey);
                        if (cell.value && (cell.value as any).hyperlink) {
                            cell.font = { color: { argb: 'FF0000FF' }, underline: true };
                        }
                    }
                }
            });
            
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, `Prospect_List_${new Date().toISOString().split('T')[0]}.xlsx`);
            toast.success('Excel exported successfully');
        } catch (err) {
            console.error(err);
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
                existingCategories={existingCategories}
                existingBrands={existingBrands}
                categoriesData={categoryQuery.data || []}
            />
        </Sidebar>
    );
};

export default ProspectPage;