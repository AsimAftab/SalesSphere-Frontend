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


    setExportingStatus('pdf');

    try {
        const { pdf } = await import('@react-pdf/renderer');
        const SiteListPDF = (await import('./SiteListPDF')).default;
        const blob = await pdf(<SiteListPDF sites={data} />).toBlob();
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        toast.success("PDF exported sucessfully.");
        setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (err) {
        toast.error("Failed to export PDF");
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
            { header: 'Phone', key: 'phone', width: 16 },
            { header: 'Email', key: 'email', width: 27 },
            { header: 'Address', key: 'address', width: 40 },
            { header: 'Created By', key: 'createdBy', width: 25 },
            { header: 'Joined Date', key: 'date', width: 15 },
        ];

        for (let i = 0; i < maxImages; i++) {
            columns.push({ header: `Site Image ${i + 1}`, key: `img_${i}`, width: 20 });
        }

        dynamicCategories.forEach(catName => {
            columns.push({ header: `${catName} (Brands)`, key: `cat_${catName}`, width: 35 });
        });

        worksheet.columns = columns;

        // Define Strict Export Interface
        interface SiteExportRow {
            sno: number;
            name: string;
            owner: string;
            subOrg: string;
            phone: number | null;
            email: string;
            address: string;
            createdBy: string;
            date: string;
            [key: string]: string | number | null | undefined | { text: string; hyperlink: string; tooltip: string };
        }

        // Populate data rows
        data.forEach((site, index) => {
            const cleanPhone = site.phone
                ? Number(site.phone.toString().replace(/\D/g, ''))
                : null;

            const rowData: SiteExportRow = {
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

            // Image URLs
            if (site.images) {
                site.images.forEach((img: any, imgIdx: number) => {
                    const url = img.imageUrl || img.url;
                    if (url) {
                        rowData[`img_${imgIdx}`] = {
                            text: 'View Image',
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
        const headerRow = worksheet.getRow(1);
        headerRow.height = 30;
        headerRow.eachCell((cell) => {
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF197ADC' }
            };
            cell.border = {
                top: { style: 'thin', color: { argb: 'FFFFFFFF' } },
                left: { style: 'thin', color: { argb: 'FFFFFFFF' } },
                bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } },
                right: { style: 'thin', color: { argb: 'FFFFFFFF' } }
            };
        });

        // Style data rows
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) {
                row.height = 25;
            }

            row.eachCell((cell, colNumber) => {
                // Standard Border
                cell.border = {
                    top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
                    left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
                    bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
                    right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
                };

                // Alignment Logic
                // Center: S.No (1), Date (9)
                // Wrap: Address (7)
                // Left: Others
                if ([1, 9].includes(colNumber)) {
                    cell.alignment = { vertical: 'middle', horizontal: 'center' };
                } else if (colNumber === 7) {
                    cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true, indent: 1 };
                } else {
                    cell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
                }
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(
            new Blob([buffer]),
            `Sites_Report_${new Date().toISOString().split('T')[0]}.xlsx`
        );
        toast.success("Excel exported successfully");
    } catch (err) {
        console.error('Excel Export Error:', err);
        toast.error("Failed to generate Excel");
    } finally {
        setExportingStatus(null);
    }
};
