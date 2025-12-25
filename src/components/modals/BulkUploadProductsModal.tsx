import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../UI/SuperadminComponents/dialog";
import CustomButton from "../UI/Button/Button";
import { Alert, AlertDescription } from "../UI/SuperadminComponents/alert";
import { Upload, Download, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

// 1. FIXED: Moved Interface ABOVE the component so it is recognized globally in this file
interface BulkUploadProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationName?: string;
  onBulkUpdate: (products: any[]) => Promise<any>; 
  onUploadSuccess?: (count: number) => void;
}

const getCellValue = (cell: any): string => {
  if (!cell) return "";
  if (typeof cell === 'object' && cell.text) return String(cell.text).trim();
  if (typeof cell === 'object' && cell.result) return String(cell.result).trim();
  return String(cell).trim();
};

const readExcelFile = async (file: File): Promise<any[]> => {
  const ExcelJS = await import('exceljs');
  const buffer = await file.arrayBuffer();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const worksheet = workbook.worksheets[0];
  if (!worksheet) throw new Error("No worksheet found.");

  const jsonData: any[] = [];
  const headers: string[] = [];
  const headerRow = worksheet.getRow(1);
  headerRow.eachCell((cell) => { headers.push(String(cell.value).trim()); });

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber <= 2) return; 
    const rowObject: any = {};
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      const header = headers[colNumber - 1];
      rowObject[header] = cell.value;
    });
    if (Object.values(rowObject).some(val => val !== null && val !== '')) {
      jsonData.push(rowObject);
    }
  });
  return jsonData;
};

// 2. FIXED: Component correctly references the interface above
export function BulkUploadProductsModal({ 
  isOpen, 
  onClose, 
  organizationName, 
  onBulkUpdate, 
  onUploadSuccess 
}: BulkUploadProductsModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);

  const handleClose = () => {
    setFile(null);
    setPreviewData([]);
    setUploadResult(null);
    onClose();
  };

  const handleDownloadTemplate = async () => {
    toast.loading("Generating template...");
    try {
      const ExcelJS = await import('exceljs');
      const { saveAs } = await import('file-saver');
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Products Template");

      worksheet.columns = [
        { header: 'Product Name', key: 'productName', width: 30 },
        { header: 'Category', key: 'category', width: 20 },
        { header: 'Price', key: 'price', width: 15 },
        { header: 'Stock (Qty)', key: 'stock', width: 15 }, 
        { header: 'Serial No', key: 'serialNo', width: 20 },
      ];

      worksheet.addRow(["Required", "Required", "Required (Number)", "Required (Number)", "Optional"]);
      const headerRow = worksheet.getRow(1);
      headerRow.eachCell((cell, col) => {
        if (col <= 4) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFE6E6' } };
            cell.font = { bold: true, color: { argb: 'FF990000' } };
        } else {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE6F0FF' } };
            cell.font = { bold: true, color: { argb: 'FF003366' } };
        }
      });

      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), `Product_Template.xlsx`);
      toast.dismiss();
      toast.success("Template downloaded.");
    } catch (e) { toast.dismiss(); toast.error("Failed to download."); }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      try {
        const data = await readExcelFile(selected);
        setPreviewData(data.slice(0, 5));
      } catch (err) { toast.error("Error reading file."); }
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const jsonData = await readExcelFile(file);
      
      const formatted = jsonData.map(row => ({
        productName: getCellValue(row["Product Name"]), // Backend Key
        category: getCellValue(row["Category"]), 
        price: parseFloat(getCellValue(row["Price"])) || 0,
        qty: parseInt(getCellValue(row["Stock (Qty)"]), 10) || 0, // Backend Key
        serialNo: getCellValue(row["Serial No"]) || null
      }));

      const result = await onBulkUpdate(formatted);
      
      // result.data contains backend Step 10 counts
      const count = result?.data?.successfullyImported || result?.length || 0;
      setUploadResult({ successfullyImported: count }); 
      
      if (onUploadSuccess) onUploadSuccess(count);
      toast.success(`Successfully processed ${count} products.`);
    } catch (err: any) { 
        toast.error("Upload failed. Please check your data format."); 
    } finally { setUploading(false); }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="!w-[95vw] !max-w-[800px] !max-h-[90vh] overflow-hidden flex flex-col p-4 bg-white rounded-lg">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg sm:text-xl text-slate-900">Bulk Upload Products</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">
                {organizationName ? `${organizationName} • ` : ""}Upload multiple products via Excel
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto flex-1 mt-4 px-1">
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-xs sm:text-sm">
              <p className="font-medium mb-1">Upload Instructions:</p>
              <ul className="list-disc ml-4 space-y-1">
                <li>Download the Excel template using the button below.</li>
                <li><strong>Do not remove or rename</strong> the column headers.</li>
                <li>Fill in the data starting from <strong>Row 3</strong>.</li>
                <li><strong>Required fields:</strong> Product Name, Category, Price, Stock (Qty).</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="bg-slate-50 rounded-lg p-4 border-2 border-dashed border-slate-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-slate-900 font-semibold text-sm">Step 1: Download Template</h3>
                <p className="text-slate-600 text-xs">Get the Excel template with proper column headers</p>
              </div>
              <CustomButton variant="outline" onClick={handleDownloadTemplate} className="text-sm">
                <Download className="w-4 h-4 mr-2" /> Download
              </CustomButton>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 border-2 border-dashed border-slate-300">
            <h3 className="text-slate-900 font-semibold text-sm mb-3">Step 2: Upload Filled Excel</h3>
            <label className="block w-full">
              <input 
                type="file" 
                className="hidden" 
                accept=".xlsx, .xls" 
                onChange={handleFileChange} 
                disabled={uploading} 
              />
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-6 bg-white border-2 border-slate-300 border-dashed rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                <Upload className="w-8 h-8 text-slate-400" />
                <div className="text-center sm:text-left">
                  <p className="text-slate-700 font-medium text-sm">{file ? file.name : "Click to select file"}</p>
                  <p className="text-slate-500 text-xs mt-1">Excel (.xlsx, .xls) files only</p>
                </div>
              </div>
            </label>
          </div>

          {previewData.length > 0 && (
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="p-3 border-b border-slate-200 bg-slate-50">
                <h3 className="text-slate-900 font-semibold text-sm">Data Preview (First 5 rows)</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700">Product Name</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700">Category</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700">Price</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700">Stock (Qty)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, i) => (
                      <tr key={i} className="border-t border-slate-100 hover:bg-slate-50">
                        <td className="px-3 py-2 text-slate-900 font-medium">{getCellValue(row["Product Name"])}</td>
                        <td className="px-3 py-2 text-slate-600">{getCellValue(row["Category"])}</td>
                        <td className="px-3 py-2 text-slate-600">{getCellValue(row["Price"])}</td>
                        <td className="px-3 py-2 text-slate-600">{getCellValue(row["Stock (Qty)"])}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {uploadResult && (
             <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <p className="font-medium mb-1">Upload Complete</p>
                  <p className="text-sm">Successfully imported {uploadResult.successfullyImported} products.</p>
                </AlertDescription>
             </Alert>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-4 pt-3 border-t flex-shrink-0">
          <CustomButton variant="outline" onClick={handleClose} disabled={uploading}>
            {uploadResult ? "Close" : "Cancel"}
          </CustomButton>
          {!uploadResult && (
            <CustomButton onClick={handleUpload} disabled={!file || uploading} className="min-w-[100px]">
              {uploading ? <><Loader2 className="animate-spin mr-2 w-4 h-4" /> Uploading...</> : <><Upload className="mr-2 w-4 h-4" /> Upload</>}
            </CustomButton>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}