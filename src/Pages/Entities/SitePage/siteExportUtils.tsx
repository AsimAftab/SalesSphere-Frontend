import toast from 'react-hot-toast';
import { saveAs } from 'file-saver';
import type { Site } from '../../../api/siteService';

export const handleExportPdf = async (
    data: Site[],
    setExportingStatus: (status: 'pdf' | 'excel' | null) => void
) => {
    if (!data || data.length === 0) {
        return toast.error("No data to export");
    }

    const toastId = toast.loading("Preparing PDF view...");
    setExportingStatus('pdf');

    try {
        const { pdf } = await import('@react-pdf/renderer');
        const SiteListPDF = (await import('./SiteListPDF')).default;
        const blob = await pdf(<SiteListPDF sites={ data } />).toBlob();
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        toast.success("PDF opened in new tab", { id: toastId });
        setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (err) {
        console.error('PDF Export Error:', err);
        toast.error("Failed to generate PDF", { id: toastId });
    } finally {
        setExportingStatus(null);
    }
};

export const handleExportExcel = async (
    data: Site[],
    setExportingStatus: (status: 'pdf' | 'excel' | null) => void
) => {
    if (!data || data.length === 0) {
        return toast.error("No data to export");
    }

    const toastId = toast.loading("Generating Excel report...");
    setExportingStatus('excel');

    try {
        const ExcelJS = (await import('exceljs')).default;
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sites');

        // Dynamic column generation
        const maxImages = data.reduce((max, site) =>
            Math.max(max, (site.images?.length || 0)), 0);

        const activeCategoriesSet = new Set<string>();
        data.forEach(site => {
            site.siteInterest?.forEach((interest: any) => {
                if (interest.category) activeCategoriesSet.add(interest.category);
            });
        });
        const dynamicCategories = Array.from(activeCategoriesSet).sort();

        // Build columns
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

        for (let i = 0; i < maxImages; i++) {
            columns.push({ header: `Image URL ${i + 1}`, key: `img_${i}`, width: 50 });
        }

        dynamicCategories.forEach(catName => {
            columns.push({ header: `${catName} (Brands)`, key: `cat_${catName}`, width: 25 });
        });

        worksheet.columns = columns;

        // Populate data rows
        data.forEach((site, index) => {
            const cleanPhone = site.phone
                ? Number(site.phone.toString().replace(/\D/g, ''))
                : null;

            const rowData: any = {
                sno: index + 1,
                name: site.name,
                owner: site.ownerName,
                subOrg: site.subOrgName || 'N/A',
                phone: cleanPhone,
                email: site.email || '-',
                address: site.address || '-',
                createdBy: site.createdBy?.name || '-',
                date: site.dateJoined
                    ? new Date(site.dateJoined).toLocaleDateString()
                    : '-',
            };

            // Image URLs
            if (site.images) {
                site.images.forEach((img: any, imgIdx: number) => {
                    const url = img.imageUrl || img.url;
                    if (url) {
                        rowData[`img_${imgIdx}`] = {
                            text: url,
                            hyperlink: url,
                            tooltip: 'Click to open'
                        };
                    }
                });
            }

            // Category brands
            dynamicCategories.forEach(catName => {
                const interest = site.siteInterest?.find((i: any) => i.category === catName);
                rowData[`cat_${catName}`] = interest ? interest.brands.join(', ') : '-';
            });

            const row = worksheet.addRow(rowData);

            // Style hyperlinks
            for (let i = 0; i < maxImages; i++) {
                const cell = row.getCell(`img_${i}`);
                if (cell.value && typeof cell.value === 'object') {
                    cell.font = { color: { argb: 'FF0000FF' }, underline: true };
                }
            }
        });

        // Style header row
        worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell) => {
                cell.alignment = { horizontal: 'left', vertical: 'middle' };
                if (rowNumber === 1) {
                    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FF197ADC' }
                    };
                }
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(
            new Blob([buffer]),
            `Sites_Report_${new Date().toISOString().split('T')[0]}.xlsx`
        );
        toast.success("Excel exported successfully", { id: toastId });
    } catch (err) {
        console.error('Excel Export Error:', err);
        toast.error("Failed to generate Excel", { id: toastId });
    } finally {
        setExportingStatus(null);
    }
};
