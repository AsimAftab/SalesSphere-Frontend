import toast from 'react-hot-toast';
import type { Site, SiteInterestItem, ApiSiteImage } from '@/api/siteService';
import {
    ExportService,
    createHyperlink,
    type ExcelColumn,
    type ExcelCellValue,
} from '@/services/export';

/**
 * Site Export Service
 *
 * Uses the generic ExportService for standardized Excel/PDF exports.
 */
export const SiteExportService = {
    async toPdf(
        data: Site[],
        setExportingStatus?: (status: 'pdf' | 'excel' | null) => void
    ) {
        if (!data || data.length === 0) {
            toast.error("No data to export");
            return;
        }

        setExportingStatus?.('pdf');

        try {
            const SiteListPDF = (await import('../SiteListPDF')).default;

            await ExportService.toPdf({
                component: <SiteListPDF sites={data} />,
                filename: 'Sites_Report',
                openInNewTab: true,
            });
        } catch {
            toast.error("Failed to export PDF");
        } finally {
            setExportingStatus?.(null);
        }
    },

    async toExcel(
        data: Site[],
        setExportingStatus?: (status: 'pdf' | 'excel' | null) => void
    ) {
        if (!data || data.length === 0) {
            toast.error("No data to export");
            return;
        }

        setExportingStatus?.('excel');

        try {
            // Dynamic column generation
            const maxImages = data.reduce((max, site) =>
                Math.max(max, (site.images?.length || 0)), 0);

            const activeCategoriesSet = new Set<string>();
            data.forEach(site => {
                site.siteInterest?.forEach((interest: SiteInterestItem) => {
                    if (interest.category) activeCategoriesSet.add(interest.category);
                });
            });
            const dynamicCategories = Array.from(activeCategoriesSet).sort();

            // Build columns
            const columns: ExcelColumn[] = [
                { header: 'S.No', key: 'sno', width: 8, style: { alignment: { horizontal: 'center' } } },
                { header: 'Site Name', key: 'name', width: 25 },
                { header: 'Owner Name', key: 'owner', width: 20 },
                { header: 'Sub Organization', key: 'subOrg', width: 20 },
                { header: 'Phone', key: 'phone', width: 16 },
                { header: 'Email', key: 'email', width: 27 },
                { header: 'Address', key: 'address', width: 60 },
                { header: 'Created By', key: 'createdBy', width: 25 },
                { header: 'Joined Date', key: 'date', width: 15, style: { alignment: { horizontal: 'center' } } },
            ];

            // Append categories first
            dynamicCategories.forEach(catName => {
                columns.push({ header: `${catName} (Brands)`, key: `cat_${catName}`, width: 35 });
            });

            // Append images last
            for (let i = 0; i < maxImages; i++) {
                columns.push({ header: `Site Image ${i + 1}`, key: `img_${i}`, width: 20 });
            }

            await ExportService.toExcel({
                data,
                filename: 'Sites_Report',
                sheetName: 'Sites',
                columns,
                rowMapper: (site, index) => {
                    const cleanPhone = site.phone
                        ? Number(site.phone.toString().replace(/\D/g, ''))
                        : null;

                    const rowData: Record<string, ExcelCellValue> = {
                        sno: index + 1,
                        name: site.name,
                        owner: site.ownerName,
                        subOrg: site.subOrgName || 'N/A',
                        phone: cleanPhone,
                        email: site.email || '-',
                        address: site.address || '-',
                        createdBy: site.createdBy?.name || '-',
                        date: site.dateJoined
                            ? new Date(site.dateJoined).toISOString().split('T')[0]
                            : '-',
                    };

                    // Category brands
                    dynamicCategories.forEach(catName => {
                        const interest = site.siteInterest?.find((i: SiteInterestItem) => i.category === catName);
                        rowData[`cat_${catName}`] = interest ? interest.brands.join(', ') : '-';
                    });

                    // Image URLs
                    if (site.images) {
                        site.images.forEach((img: ApiSiteImage, imgIdx: number) => {
                            const url = img.imageUrl || (img as ApiSiteImage & { url?: string }).url;
                            if (url) {
                                rowData[`img_${imgIdx}`] = createHyperlink(url, 'View Image');
                            }
                        });
                    }

                    return rowData;
                },
                onWorksheetReady: (worksheet) => {
                    // Apply text wrapping to address column
                    worksheet.eachRow((row, rowNumber) => {
                        if (rowNumber === 1) return;
                        row.height = 30;
                        row.eachCell((cell, colNumber) => {
                            // Wrap: Address (7)
                            if (colNumber === 7) {
                                cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true, indent: 1 };
                            }
                        });
                    });
                },
            });
        } catch {
            toast.error("Failed to generate Excel");
        } finally {
            setExportingStatus?.(null);
        }
    },
};
