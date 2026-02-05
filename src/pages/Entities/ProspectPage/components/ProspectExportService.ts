import { createElement } from 'react';
import toast from 'react-hot-toast';
import type { Prospect, ProspectInterest, ApiProspectImage } from '@/api/prospectService';
import { getAllProspectsDetails } from '@/api/prospectService';
import {
    ExportService,
    createHyperlink,
    type ExcelColumn,
    type ExcelCellValue,
} from '@/services/export';

/**
 * Prospect Export Service
 *
 * Uses the generic ExportService for standardized Excel/PDF exports.
 */
export const ProspectExportService = {
    async toPdf(
        filteredData: Prospect[],
        setStatus?: (status: 'pdf' | null) => void
    ) {
        if (filteredData.length === 0) {
            toast.error("No prospects to export");
            return;
        }

        setStatus?.('pdf');

        try {
            const allDetailedData = await getAllProspectsDetails();
            const filteredIds = new Set(filteredData.map(p => p.id));
            const finalDataToExport = allDetailedData.filter((p: Prospect) => filteredIds.has(p.id));

            const ProspectListPDF = (await import('../ProspectListPDF')).default;

            const docElement = createElement(ProspectListPDF, {
                prospects: finalDataToExport
            });

            await ExportService.toPdf({
                component: docElement,
                filename: 'Prospect_Report',
                openInNewTab: true,
            });
        } catch {
            toast.error('Failed to export PDF');
        } finally {
            setStatus?.(null);
        }
    },

    async toExcel(
        filteredData: Prospect[],
        setStatus?: (status: 'excel' | null) => void
    ) {
        if (!filteredData || filteredData.length === 0) {
            toast.error("No prospects to export");
            return;
        }

        setStatus?.('excel');

        try {
            // Fetch full detailed data
            const allDetailedData = await getAllProspectsDetails();
            const filteredIds = new Set(filteredData.map(p => p.id));
            const rawDetailedData = allDetailedData.filter((p: Prospect) => filteredIds.has(p.id));

            // Build lookup from filteredData for fields not populated in details endpoint
            const filteredDataMap = new Map(filteredData.map(p => [p.id, p]));

            // Calculate dynamic column needs
            const maxImages = rawDetailedData.reduce((max: number, p: Prospect) =>
                Math.max(max, (p.images?.length || 0)), 0);

            // Get unique categories
            const activeCategoriesSet = new Set<string>();
            rawDetailedData.forEach((p: Prospect) => {
                const interests = p.interest || [];
                interests.forEach((i: ProspectInterest) => {
                    if (i.category) activeCategoriesSet.add(i.category);
                });
            });
            const dynamicCategories = Array.from(activeCategoriesSet).sort();

            // Define columns
            const columns: ExcelColumn[] = [
                { header: 'S.No', key: 'sno', width: 8, style: { alignment: { horizontal: 'center' } } },
                { header: 'Prospect Name', key: 'name', width: 25 },
                { header: 'Owner Name', key: 'owner', width: 20 },
                { header: 'Phone', key: 'phone', width: 16 },
                { header: 'Email', key: 'email', width: 27 },
                { header: 'PAN/VAT', key: 'panVat', width: 15 },
                { header: 'Address', key: 'address', width: 60 },
                { header: 'Created By', key: 'createdBy', width: 25 },
                { header: 'Joined Date', key: 'date', width: 15, style: { alignment: { horizontal: 'center' } } },
            ];

            // Add dynamic image columns
            for (let i = 0; i < maxImages; i++) {
                columns.push({ header: `Image URL ${i + 1}`, key: `img_${i}`, width: 25 });
            }

            // Add dynamic category columns
            dynamicCategories.forEach(catName => {
                columns.push({ header: `${catName} (Brands)`, key: `cat_${catName}`, width: 35 });
            });

            await ExportService.toExcel({
                data: rawDetailedData,
                filename: 'Detailed_Prospect_Report',
                sheetName: 'Prospect Details',
                columns,
                rowMapper: (p, index) => {
                    const listData = filteredDataMap.get(p.id);
                    const cleanPhone = p.phone
                        ? Number(p.phone.toString().replace(/\D/g, ''))
                        : null;

                    const rowData: Record<string, ExcelCellValue> = {
                        sno: index + 1,
                        name: p.name || '-',
                        owner: p.ownerName || '-',
                        phone: cleanPhone || (p.phone || '-'),
                        email: p.email || '-',
                        panVat: p.panVat || '-',
                        address: p.address || listData?.address || '-',
                        createdBy: p.createdBy?.name || listData?.createdBy?.name || '-',
                        date: p.dateJoined ? new Date(p.dateJoined).toISOString().split('T')[0] : '-',
                    };

                    // Map images as hyperlinks
                    if (p.images) {
                        p.images.forEach((img: ApiProspectImage, imgIdx: number) => {
                            if (img.imageUrl) {
                                rowData[`img_${imgIdx}`] = createHyperlink(img.imageUrl, 'View Image');
                            }
                        });
                    }

                    // Map dynamic interest categories
                    dynamicCategories.forEach(catName => {
                        const interests = p.interest || [];
                        const match = interests.find((i: ProspectInterest) => i.category === catName);
                        rowData[`cat_${catName}`] = match ? (match.brands?.join(', ') || '-') : '-';
                    });

                    return rowData;
                },
                onWorksheetReady: (worksheet) => {
                    const firstCatCol = 10 + maxImages;
                    // Apply text wrapping to address and category columns
                    worksheet.eachRow((row, rowNumber) => {
                        if (rowNumber === 1) return;
                        row.height = 30;
                        row.eachCell((cell, colNumber) => {
                            // Wrap: Address (7), Category columns (10 + maxImages onwards)
                            if (colNumber === 7 || colNumber >= firstCatCol) {
                                cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true, indent: 1 };
                            }
                        });
                    });
                },
            });
        } catch {
            toast.error("Failed to export Excel");
        } finally {
            setStatus?.(null);
        }
    },
};
