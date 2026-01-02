import { useState } from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle
} from "../../UI/SuperadminComponents/dialog";
import CustomButton from "../../UI/Button/Button";
import { Alert, AlertDescription } from "../../UI/SuperadminComponents/alert";
import {
  Upload, Download, FileSpreadsheet, CheckCircle2, XCircle, AlertCircle, Loader2
} from "lucide-react";
import toast from "react-hot-toast";
import { bulkUploadParties } from "../../../api/partyService";
import type { Party } from "../../../api/partyService";

interface BulkUploadPartiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId?: string;
  organizationName?: string;
  onUploadSuccess?: (count: number) => void;
}

interface UploadResult {
  success: number;
  failed: number;
  errors: string[];
}

// ✅ Default Fallback Location (Kathmandu)
const DEFAULT_LAT = 27.7172;
const DEFAULT_LNG = 85.3240;
const DEFAULT_ADDRESS = "Kathmandu, Nepal";

const readExcelFile = async (file: File): Promise<any[]> => {
  const ExcelJS = await import('exceljs');
  const buffer = await file.arrayBuffer();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    throw new Error("No worksheet found in the file.");
  }

  const jsonData: any[] = [];
  const headers: string[] = [];

  const headerRow = worksheet.getRow(1);
  if (headerRow.cellCount === 0) {
    throw new Error("The Excel file is empty or the header row is missing.");
  }

  headerRow.eachCell((cell) => {
    headers.push(cell.value as string);
  });

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber <= 2) return;

    const rowObject: any = {};
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      const header = headers[colNumber - 1];
      const cellValue = cell.value;
      rowObject[header] = (typeof cellValue === 'object' && cellValue !== null && 'text' in cellValue)
        ? (cellValue as any).text
        : cellValue;
    });

    if (Object.values(rowObject).some(val => val !== null && val !== '' && val !== undefined)) {
      jsonData.push(rowObject);
    }
  });

  return jsonData;
}

export function BulkUploadPartiesModal({
  isOpen,
  onClose,
  organizationId,
  organizationName,
  onUploadSuccess
}: BulkUploadPartiesModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [previewData, setPreviewData] = useState<Partial<Party>[]>([]);

  const handleDownloadTemplate = async () => {
    toast.loading("Generating template...");
    try {
      const ExcelJS = await import('exceljs');
      const { saveAs } = await import('file-saver');

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Parties Template");

      // 1. Define Columns - ✅ Added Party Type
      worksheet.columns = [
        { header: 'Party Name', key: 'Party Name', width: 30 },
        { header: 'Owner Name', key: 'Owner Name', width: 25 },
        { header: 'PAN/VAT Number', key: 'PAN/VAT Number', width: 20 },
        { header: 'Phone Number', key: 'Phone Number', width: 20 },
        { header: 'Party Type', key: 'Party Type', width: 20 },
        { header: 'Email', key: 'Email', width: 30 },
        { header: 'Address', key: 'Address', width: 40 },
        { header: 'Description', key: 'Description', width: 40 },
      ];

      // 2. Add Instruction Row
      const instructionRow = worksheet.addRow([
        "Required",
        "Required",
        "Required (Max 14 chars)",
        "Required (10 Digits)",
        "Required (e.g., Retailer)",
        "Optional",
        "Optional",
        "Optional"
      ]);
      instructionRow.font = { italic: true, size: 10, color: { argb: 'FF555555' } };
      instructionRow.alignment = { horizontal: 'center' };

      // 3. Highlight & Style Headers
      const headerRow = worksheet.getRow(1);
      headerRow.height = 25;
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

      headerRow.eachCell((cell, colNumber) => {
        if (colNumber <= 5) { // Required Columns (Red) - ✅ Updated to 5
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFE6E6' } };
          cell.font = { bold: true, size: 12, color: { argb: 'FF990000' } };
          cell.border = {
            top: { style: 'thin', color: { argb: 'FF990000' } },
            bottom: { style: 'medium', color: { argb: 'FF990000' } },
            left: { style: 'thin', color: { argb: 'FF990000' } },
            right: { style: 'thin', color: { argb: 'FF990000' } }
          };
        } else { // Optional Columns (Blue)
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE6F0FF' } };
          cell.font = { bold: true, size: 12, color: { argb: 'FF003366' } };
          cell.border = {
            top: { style: 'thin', color: { argb: 'FF003366' } },
            bottom: { style: 'medium', color: { argb: 'FF003366' } },
            left: { style: 'thin', color: { argb: 'FF003366' } },
            right: { style: 'thin', color: { argb: 'FF003366' } }
          };
        }
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const safeName = organizationName || "Organization";
      saveAs(blob, `Parties_Upload_Template_${safeName.replace(/\s+/g, '_')}.xlsx`);

      toast.dismiss();
      toast.success("Template downloaded.");
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to download template.");
      console.error(error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'text/csv'];
      if (!validTypes.includes(selectedFile.type)) {
        toast.error("Invalid file type. Please upload an Excel or CSV file");
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("File too large. Maximum file size is 10MB.");
        return;
      }
      setFile(selectedFile);
      setUploadResult(null);
      previewFile(selectedFile);
    }
  };

  const previewFile = async (file: File) => {
    try {
      const jsonData = await readExcelFile(file);
      const mappedData = jsonData.slice(0, 5).map((row: any) => {
        let address = row["Address"];
        if (!address || String(address).trim() === "") {
          address = DEFAULT_ADDRESS;
        }

        return {
          companyName: row["Party Name"] || "",
          ownerName: row["Owner Name"] || "",
          panVat: row["PAN/VAT Number"] || "",
          phone: row["Phone Number"] ? String(row["Phone Number"]) : "",
          partyType: row["Party Type"] || "Retailer", // ✅ Added field
          email: row["Email"] || "",
          address: String(address),
          description: row["Description"] || "",
        };
      });

      setPreviewData(mappedData);
      toast.success(`File loaded. Found ${jsonData.length} rows. Previewing first 5.`);
    } catch (error) {
      toast.error("Failed to read file.");
      setFile(null);
      console.error(error);
    }
  };

  const handleUpload = async () => {
    if (!file || !organizationId) return;
    setUploading(true);
    setUploadResult(null);

    try {
      const jsonData = await readExcelFile(file);
      // ✅ Updated mapping to fix TS2322 (Property 'partyType' is missing)
      const parties: Omit<Party, 'id' | 'dateCreated'>[] = jsonData.map((row: any) => {
        let address = row["Address"];
        let finalLat = null;
        let finalLng = null;

        if (!address || String(address).trim() === "") {
          address = DEFAULT_ADDRESS;
          finalLat = DEFAULT_LAT;
          finalLng = DEFAULT_LNG;
        }

        return {
          companyName: row["Party Name"] || "",
          ownerName: row["Owner Name"] || "",
          panVat: row["PAN/VAT Number"] || "",
          phone: row["Phone Number"] ? String(row["Phone Number"]) : "",
          partyType: row["Party Type"] || "Retailer", // ✅ Added field
          email: row["Email"] || "",
          address: String(address),
          description: row["Description"] || "",
          latitude: finalLat,
          longitude: finalLng
        };
      });

      const result = await bulkUploadParties(organizationId, parties);
      setUploadResult(result);

      if (result.success > 0) {
        toast.success(`Successfully uploaded ${result.success} parties.`);
        onUploadSuccess?.(result.success);
      } else {
        toast.error("Upload failed.");
      }
    } catch (error) {
      toast.error("An error occurred during upload");
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreviewData([]);
    setUploadResult(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="!w-[95vw] !max-w-[800px] !max-h-[90vh] overflow-hidden flex flex-col p-4 bg-white rounded-lg">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
              <FileSpreadsheet className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg sm:text-xl text-slate-900">Bulk Upload Parties</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">
                {organizationName ? `${organizationName} • ` : ""}Upload multiple parties using Excel
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
                <li><strong>Required:</strong> Party Name, Owner Name, PAN/VAT, Phone, Party Type.</li>
                <li><strong>Optional:</strong> Email, Address, Desc.</li>
                <li><em>Note: If Address is missing, location will default to Kathmandu.</em></li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="bg-slate-50 rounded-lg p-4 border-2 border-dashed border-slate-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-slate-900 font-semibold text-sm mb-1">Step 1: Download Template</h3>
                <p className="text-slate-600 text-xs">Get the Excel template with proper column headers</p>
              </div>
              <CustomButton variant="outline" onClick={handleDownloadTemplate} className="text-sm py-2 px-4 w-full sm:w-auto">
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </CustomButton>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 border-2 border-dashed border-slate-300">
            <h3 className="text-slate-900 font-semibold text-sm mb-3">Step 2: Upload Filled Excel</h3>
            <div className="flex items-center gap-4">
              <label className="flex-1 w-full">
                <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileChange} className="hidden" disabled={uploading} />
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-6 bg-white border-2 border-slate-300 border-dashed rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                  <Upload className="w-8 h-8 text-slate-400" />
                  <div className="text-center sm:text-left">
                    <p className="text-slate-700 font-medium text-sm">{file ? file.name : "Click to select file"}</p>
                    <p className="text-slate-500 text-xs mt-1">Excel (.xlsx, .xls) or CSV files only</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {previewData.length > 0 && (
            <div className="bg-white rounded-lg border border-slate-200">
              <div className="p-3 border-b border-slate-200 bg-slate-50">
                <h3 className="text-slate-900 font-semibold text-sm">Data Preview (First 5 rows)</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700 whitespace-nowrap">Party Name</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700 whitespace-nowrap">Owner Name</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700 whitespace-nowrap">Type</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700 whitespace-nowrap">PAN/VAT</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700 whitespace-nowrap">Phone</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700 whitespace-nowrap">Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((party, index) => (
                      <tr key={index} className="border-t border-slate-100 hover:bg-slate-50">
                        <td className="px-3 py-2 text-slate-900 font-medium whitespace-nowrap">{party.companyName}</td>
                        <td className="px-3 py-2 text-slate-600 whitespace-nowrap">{party.ownerName}</td>
                        <td className="px-3 py-2 text-slate-600 whitespace-nowrap text-xs">{party.partyType}</td>
                        <td className="px-3 py-2 text-slate-600 text-xs whitespace-nowrap">{party.panVat || '-'}</td>
                        <td className="px-3 py-2 text-slate-600 text-xs whitespace-nowrap">{party.phone}</td>
                        <td className="px-3 py-2 text-slate-600 text-xs truncate max-w-[150px]" title={party.address}>
                          {party.address}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {uploadResult && (
            <Alert className={uploadResult.failed === 0 ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}>
              {uploadResult.failed === 0 ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-amber-600" />}
              <AlertDescription className={uploadResult.failed === 0 ? "text-green-800" : "text-amber-800"}>
                <p className="font-medium mb-2">Upload Complete</p>
                <div className="text-sm space-y-1">
                  <p>Successfully uploaded: {uploadResult.success} parties</p>
                  {uploadResult.failed > 0 && (
                    <>
                      <p>Failed: {uploadResult.failed} parties</p>
                      {uploadResult.errors.length > 0 && (
                        <div className="mt-2">
                          <p className="font-medium">Errors:</p>
                          <ul className="list-disc ml-4 text-xs">
                            {uploadResult.errors.slice(0, 5).map((error, index) => <li key={index}>{error}</li>)}
                            {uploadResult.errors.length > 5 && <li>...and {uploadResult.errors.length - 5} more errors</li>}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-4 pt-3 border-t flex-shrink-0">
          <CustomButton variant="outline" onClick={handleClose} disabled={uploading} className="text-xs sm:text-sm">
            {uploadResult ? "Close" : "Cancel"}
          </CustomButton>
          {!uploadResult && (
            <CustomButton variant="primary" onClick={handleUpload} disabled={!file || uploading} className="min-w-[100px] text-xs sm:text-sm">
              {uploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</> : <><Upload className="w-4 h-4 mr-2" /> Upload</>}
            </CustomButton>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}