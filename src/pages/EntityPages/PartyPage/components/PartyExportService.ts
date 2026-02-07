import { createElement } from 'react';
import toast from 'react-hot-toast';
import type { Party } from '@/api/partyService';
import { getAllPartiesDetails } from '@/api/partyService';
import { formatDisplayDate } from '@/utils/dateUtils';
import {
    ExportService,
    createHyperlink,
    type ExcelColumn,
    type ExcelCellValue,
} from '@/services/export';

/** Extended Party type for export - includes raw API fallback fields */
interface PartyExportData extends Party {
    contact?: { phone?: string; email?: string };
    partyName?: string;
    panVatNumber?: string;
    location?: { address?: string };
}

/**
 * Party Export Service
 *
 * Uses the generic ExportService for standardized Excel/PDF exports.
 */
export const PartyExportService = {
    async toPdf(
        filteredData: Party[],
        setStatus?: (status: 'pdf' | null) => void
    ) {
        if (filteredData.length === 0) {
            toast.error("No parties to export");
            return;
        }

        setStatus?.('pdf');
        try {
            const response = await getAllPartiesDetails();
            const allDetailedData: Party[] = Array.isArray(response) ? response : (response as { data: Party[] }).data;

            const filteredIds = new Set(filteredData.map(p => p.id));
            const finalDataToExport = allDetailedData.filter((p: Party) => filteredIds.has(p.id));

            const PartyListPDF = (await import('../PartyListPDF')).default;

            const docElement = createElement(PartyListPDF, {
                parties: finalDataToExport
            });

            await ExportService.toPdf({
                component: docElement,
                filename: 'Party_List',
                openInNewTab: true,
            });
        } catch {
            toast.error('Failed to export PDF');
        } finally {
            setStatus?.(null);
        }
    },

    async toExcel(
        filteredData: Party[],
        setStatus?: (status: 'excel' | null) => void
    ) {
        if (filteredData.length === 0) {
            toast.error("No parties to export");
            return;
        }

        setStatus?.('excel');

        try {
            const response = await getAllPartiesDetails();
            const allDetailedData: Party[] = Array.isArray(response) ? response : (response as { data: Party[] }).data;

            const filteredIds = new Set(filteredData.map(p => p.id));
            const finalDataToExport = allDetailedData.filter((p: Party) => filteredIds.has(p.id)) as PartyExportData[];

            const columns: ExcelColumn[] = [
                { header: 'S.No', key: 's_no', width: 10, style: { alignment: { horizontal: 'center' } } },
                { header: 'Party Name', key: 'companyName', width: 35 },
                { header: 'Owner Name', key: 'ownerName', width: 25 },
                { header: 'Party Type', key: 'partyType', width: 20 },
                { header: 'Email', key: 'email', width: 40 },
                { header: 'Phone', key: 'phone', width: 20 },
                { header: 'PAN/VAT', key: 'panVat', width: 20 },
                { header: 'Date Joined', key: 'dateJoined', width: 20, style: { alignment: { horizontal: 'center' } } },
                { header: 'Address', key: 'address', width: 60 },
                { header: 'Description', key: 'description', width: 50 },
                { header: 'Image', key: 'image', width: 15 },
            ];

            await ExportService.toExcel({
                data: finalDataToExport,
                filename: 'Party_List',
                sheetName: 'Parties',
                columns,
                rowMapper: (party, index) => {
                    const rawPhone = party.phone || party.contact?.phone;
                    const phoneAsNumber = rawPhone ? Number(rawPhone.toString().replace(/\D/g, '')) : null;
                    const panVatValue = party.panVat || party.panVatNumber;
                    const panVatString = panVatValue ? String(panVatValue) : 'N/A';

                    const rowData: Record<string, ExcelCellValue> = {
                        s_no: index + 1,
                        companyName: party.companyName || party.partyName || '',
                        ownerName: party.ownerName,
                        partyType: party.partyType || 'Not Specified',
                        email: party.email || party.contact?.email || 'N/A',
                        phone: phoneAsNumber || 'N/A',
                        panVat: panVatString,
                        dateJoined: party.dateCreated || party.createdAt
                            ? formatDisplayDate(party.dateCreated || party.createdAt || '')
                            : 'N/A',
                        address: party.address || party.location?.address || '',
                        description: party.description || 'N/A',
                        image: party.image
                            ? createHyperlink(party.image, 'View Image', 'Click to view image')
                            : 'No Image',
                    };
                    return rowData;
                },
                onWorksheetReady: (worksheet) => {
                    // Apply text wrapping to address and description columns
                    worksheet.eachRow((row, rowNumber) => {
                        if (rowNumber === 1) return;
                        row.eachCell((cell, colNumber) => {
                            // Wrap Address (9) and Description (10)
                            if ([9, 10].includes(colNumber)) {
                                cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true, indent: 1 };
                            }
                        });
                    });
                },
            });
        } catch {
            toast.error('Failed to export Excel');
        } finally {
            setStatus?.(null);
        }
    },
};
