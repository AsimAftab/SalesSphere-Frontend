import React from "react";
import { type Product } from "@/api/productService";
import {
    ExportService,
    createHyperlink,
    type ExcelColumn,
    type ExcelCellValue,
} from '@/services/export';

/**
 * Product Export Service
 *
 * Uses the generic ExportService for standardized Excel/PDF exports.
 */
export const ProductExportService = {
    async toExcel(filteredData: Product[]) {
        const columns: ExcelColumn[] = [
            { header: 'S.No.', key: 'sno', width: 8, style: { alignment: { horizontal: 'center' } } },
            { header: 'Product Name', key: 'productName', width: 35 },
            { header: 'Category', key: 'category', width: 25 },
            { header: 'Serial No.', key: 'serialNo', width: 20 },
            { header: 'Stock (Qty)', key: 'qty', width: 12, style: { alignment: { horizontal: 'center' } } },
            { header: 'Price', key: 'price', width: 15 },
            { header: 'Product Image', key: 'image', width: 20 },
        ];

        await ExportService.toExcel({
            data: filteredData,
            filename: 'Products_Export',
            sheetName: 'Products',
            columns,
            rowMapper: (product, index) => {
                const rowData: Record<string, ExcelCellValue> = {
                    sno: index + 1,
                    productName: product.productName,
                    category: product.category?.name || 'N/A',
                    serialNo: product.serialNo || 'N/A',
                    qty: product.qty,
                    price: product.price,
                    image: product.image?.url
                        ? createHyperlink(product.image.url, 'View Image')
                        : 'N/A',
                };
                return rowData;
            },
            onWorksheetReady: (worksheet) => {
                // Apply currency format to price column
                worksheet.eachRow((row, rowNumber) => {
                    if (rowNumber === 1) return;
                    const priceCell = row.getCell(6); // Price column
                    priceCell.numFmt = '"RS" #,##0.00';
                    priceCell.alignment = { vertical: 'middle', horizontal: 'right' };

                    // Center the image column
                    const imageCell = row.getCell(7);
                    imageCell.alignment = { vertical: 'middle', horizontal: 'center' };
                });
            },
        });
    },

    async toPdf(products: Product[], PDFComponent: React.ComponentType<{ products: Product[] }>) {
        const element = React.createElement(PDFComponent, { products });

        await ExportService.toPdf({
            component: element,
            filename: 'Products_Report',
            openInNewTab: true,
        });
    },
};
