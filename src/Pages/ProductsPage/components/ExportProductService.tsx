import React from "react";
import { type Product } from "../../../api/productService";
import toast from "react-hot-toast";

export const ExportProductService = {
    async exportToExcel(filteredData: Product[]) {
        if (filteredData.length === 0) {
            toast.error("No data available to export");
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
            ];

            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF3B82F6' } };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
            });

            filteredData.forEach((product, index) => {
                worksheet.addRow({
                    sno: index + 1,
                    productName: product.productName,
                    category: product.category?.name || 'N/A',
                    serialNo: product.serialNo || 'N/A',
                    qty: product.qty,
                    price: product.price,
                });
            });

            // Format numeric columns
            worksheet.getColumn('qty').numFmt = '0';
            worksheet.getColumn('qty').alignment = { horizontal: 'center' };

            // Explicitly format Price column to match user's previous preference (RS #,##0.00)
            worksheet.getColumn('price').numFmt = '"RS" #,##0.00';
            worksheet.getColumn('price').alignment = { horizontal: 'right' };

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
            toast.error("No data available to export");
            return;
        }

        const toastId = toast.loading("Preparing PDF Document...");

        try {
            const { pdf } = await import("@react-pdf/renderer");
            // Create element from component
            const element = React.createElement(PDFComponent, { products });

            // Cast to any because pdf() expects stricter types than what createElement returns for a custom component
            const blob = await pdf(element as any).toBlob();
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
