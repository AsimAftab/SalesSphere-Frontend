import React from "react";
import { type Product } from "@/api/productService";
import toast from "react-hot-toast";
import { generatePdfBlob } from "@/utils/pdfUtils";

export const ExportProductService = {
    async exportToExcel(filteredData: Product[]) {
        if (filteredData.length === 0) {
            toast.error("No product data available to export");
            return;
        }

        const toastId = toast.loading("Generating Excel report...");

        try {
            const ExcelJS = (await import("exceljs")).default;
            const { saveAs } = await import("file-saver");

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Products");

            worksheet.columns = [
                { header: 'S.No.', key: 'sno', width: 8 },
                { header: 'Product Name', key: 'productName', width: 35 },
                { header: 'Category', key: 'category', width: 25 },
                { header: 'Serial No.', key: 'serialNo', width: 20 },
                { header: 'Stock (Qty)', key: 'qty', width: 12 },
                { header: 'Price', key: 'price', width: 15 },
                { header: 'Product Image', key: 'image', width: 20 },
            ];

            // Add Rows
            filteredData.forEach((product, index) => {
                worksheet.addRow({
                    sno: index + 1,
                    productName: product.productName,
                    category: product.category?.name || 'N/A',
                    serialNo: product.serialNo || 'N/A',
                    qty: product.qty,
                    price: product.price,
                    image: product.image?.url ? {
                        text: 'View Image',
                        hyperlink: product.image.url,
                        tooltip: 'Click to open'
                    } : 'N/A'
                });
            });

            // --- Styling Logic (Matches ExportLeaveService) ---

            // 1. Header Styling (Secondary Blue: #197ADC)
            const headerRow = worksheet.getRow(1);
            headerRow.height = 30;
            headerRow.eachCell((cell) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF197ADC' }
                };
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };

                // White borders for header
                cell.border = {
                    top: { style: 'thin', color: { argb: 'FFFFFFFF' } },
                    left: { style: 'thin', color: { argb: 'FFFFFFFF' } },
                    bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } },
                    right: { style: 'thin', color: { argb: 'FFFFFFFF' } }
                };
            });

            // 2. Row Formatting: Alignment, Borders
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber > 1) {
                    row.height = 25;

                    row.eachCell((cell, colNumber) => {
                        // Standard Grey Border
                        cell.border = {
                            top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
                            left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
                            bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
                            right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
                        };

                        // Alignment Logic
                        // 1: S.No (Center)
                        // 5: Stock (Center)
                        // 6: Price (Right + Currency)
                        // Others: Left
                        if ([1, 5].includes(colNumber)) {
                            cell.alignment = { vertical: 'middle', horizontal: 'center' };
                        }
                        else if (colNumber === 6) {
                            cell.alignment = { vertical: 'middle', horizontal: 'right' };
                            cell.numFmt = '"RS" #,##0.00';
                        }
                        else if (colNumber === 7) { // Image Column
                            cell.alignment = { vertical: 'middle', horizontal: 'center' };
                            if (cell.value && typeof cell.value === 'object') {
                                cell.font = { color: { argb: 'FF0000FF' }, underline: true };
                            }
                        }
                        else {
                            cell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
                        }
                    });
                }
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, `Products_Export_${new Date().toLocaleDateString()}.xlsx`);

            toast.success("Excel exported successfully!", { id: toastId });
        } catch (err) {
            console.error("Excel Export Error:", err);
            toast.error("Failed to generate Excel report", { id: toastId });
        }
    },

    async exportToPdf(products: Product[], PDFComponent: React.ComponentType<{ products: Product[] }>) {
        if (products.length === 0) {
            toast.error("No product data available to export");
            return;
        }

        const toastId = toast.loading("Preparing PDF Document...");

        try {
            // Create element from component
            const element = React.createElement(PDFComponent, { products });

            const blob = await generatePdfBlob(element);
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank");
            toast.success("PDF opened in new tab!", { id: toastId });
            setTimeout(() => URL.revokeObjectURL(url), 100);
        } catch (err) {
            console.error("PDF Export Error:", err);
            toast.error("Failed to generate PDF document", { id: toastId });
        }
    },
};
