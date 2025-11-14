import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "../../UI/SuperadminComponents/dialog";
import CustomButton from "../../UI/Button/Button";
import { Alert, AlertDescription } from "../../UI/SuperadminComponents/alert";
import {
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import toast from "react-hot-toast";
import { bulkUploadParties } from "../../../api/partyService";
import type { Party } from "../../../api/partyService";

interface BulkUploadPartiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
  organizationName: string;
  onUploadSuccess?: (count: number) => void;
}

interface UploadResult {
  success: number;
  failed: number;
  errors: string[];
}

// --- ADDED: Helper function to read Excel file with exceljs ---
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
    const headerRow = worksheet.getRow(1);
    if (headerRow.cellCount === 0) {
        throw new Error("The Excel file is empty or the header row is missing.");
    }
    
    const headers: string[] = [];
    headerRow.eachCell((cell) => {
        headers.push(cell.value as string);
    });
    
    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header row
        
        const rowObject: any = {};
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            // colNumber is 1-based, headers array is 0-based
            const header = headers[colNumber - 1];
            rowObject[header] = cell.value;
        });
        jsonData.push(rowObject);
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

  // --- REFACTORED: To use exceljs and be lazy-loaded ---
  const handleDownloadTemplate = async () => {
    toast.loading("Generating template...");
    try {
      const ExcelJS = await import('exceljs');
      const { saveAs } = await import('file-saver');
      
      const templateData = [
        {
          "Company Name": "New Traders Pvt. Ltd.",
          "Owner Name": "Patrick Padilla",
          "PAN/VAT Number": "123456789",
          "Phone Number": "9841234567",
          "Email": "patrick.padilla@newtraders.com",
          "Address": "Thamel, Kathmandu, Nepal",
          "Latitude": 27.7172,
          "Longitude": 85.3240
        },
        // ... (other example rows) ...
      ];

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Parties Template");

      // Set columns with headers and widths
      worksheet.columns = [
        { header: 'Company Name', key: 'Company Name', width: 35 },
        { header: 'Owner Name', key: 'Owner Name', width: 25 },
        { header: 'PAN/VAT Number', key: 'PAN/VAT Number', width: 18 },
        { header: 'Phone Number', key: 'Phone Number', width: 15 },
        { header: 'Email', key: 'Email', width: 35 },
        { header: 'Address', key: 'Address', width: 45 },
        { header: 'Latitude', key: 'Latitude', width: 12 },
        { header: 'Longitude', key: 'Longitude', width: 12 }
      ];

      // Style header
      worksheet.getRow(1).eachCell(cell => {
        cell.font = { bold: true };
      });

      // Add example rows
      worksheet.addRows(templateData);

      // Download file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `Parties_Upload_Template_${organizationName.replace(/\s+/g, '_')}.xlsx`);

      toast.dismiss();
      toast.success("Template downloaded. Fill it in and upload.");

    } catch (error) {
      toast.dismiss();
      toast.error("Failed to download template.");
      console.error(error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // ... (file type and size validation remains the same) ...
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
      ];
      if (!validTypes.includes(selectedFile.type)) {
        toast.error("Invalid file type. Please upload an Excel (.xlsx, .xls) or CSV file");
        return;
      }
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (selectedFile.size > maxSize) {
        toast.error("File too large. Maximum file size is 10MB.");
        return;
      }

      setFile(selectedFile);
      setUploadResult(null);
      previewFile(selectedFile); // Call async preview
    }
  };

  // --- REFACTORED: To use the new async helper ---
  const previewFile = async (file: File) => {
    try {
      const jsonData = await readExcelFile(file);

      // Map Excel data to Party format and preview first 5 rows
      const mappedData = jsonData.slice(0, 5).map((row: any) => ({
        companyName: row["Company Name"] || "",
        ownerName: row["Owner Name"] || "",
        panVat: row["PAN/VAT Number"] || "",
        phone: row["Phone Number"] || "",
        email: row["Email"] || "",
        address: row["Address"] || "",
        latitude: row["Latitude"] ? parseFloat(row["Latitude"]) : null,
        longitude: row["Longitude"] ? parseFloat(row["Longitude"]) : null
      }));

      setPreviewData(mappedData);
      toast.success(`File loaded. Found ${jsonData.length} rows. Previewing first 5.`);
    } catch (error) {
      toast.error("Failed to read file. Please ensure the file format is correct");
      setFile(null);
      console.error(error);
    }
  };

  // --- REFACTORED: To use the new async helper ---
  const handleUpload = async () => {
    if (!file) {
      toast.error("No file selected. Please select a file to upload");
      return;
    }

    setUploading(true);
    setUploadResult(null);

    try {
      const jsonData = await readExcelFile(file);

      // Map Excel data to Party format
      const parties: Omit<Party, 'id' | 'dateCreated'>[] = jsonData.map((row: any) => ({
        companyName: row["Company Name"] || "",
        ownerName: row["Owner Name"] || "",
        panVat: row["PAN/VAT Number"] || "",
        phone: row["Phone Number"] || "",
        email: row["Email"] || "",
        address: row["Address"] || "",
        latitude: row["Latitude"] ? parseFloat(row["Latitude"]) : null,
        longitude: row["Longitude"] ? parseFloat(row["Longitude"]) : null
      }));

      // Call API to bulk upload
      const result = await bulkUploadParties(organizationId, parties);

      setUploadResult(result);

      if (result.success > 0) {
        const message = result.failed > 0
          ? `Successfully uploaded ${result.success} parties. ${result.failed} parties failed.`
          : `Successfully uploaded ${result.success} parties.`;
        toast.success(message);
        onUploadSuccess?.(result.success);
      } else {
        toast.error("Upload failed. No parties were uploaded.");
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "An error occurred during upload";
      toast.error(`Upload failed. ${errorMsg}`);
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
      <DialogContent className="!w-[90vw] !max-w-[800px] !max-h-[90vh] overflow-hidden flex flex-col p-4">
        {/* ... (Your DialogHeader JSX is unchanged) ... */}
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-slate-900">Bulk Upload Parties</DialogTitle>
              <DialogDescription>
                {organizationName} • Upload multiple parties using Excel
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto flex-1 mt-4">
          {/* ... (Your Alert/Instructions JSX is unchanged) ... */}
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-sm">
              <p className="font-medium mb-1">Upload Instructions:</p>
              <ol className="list-decimal ml-4 text-xs space-y-1">
                <li>Download the Excel template using the button below</li>
                <li>Fill in your party data following the template format</li>
                <li>Upload the completed Excel file</li>
                <li>Review the preview and click "Upload Parties"</li>
              </ol>
            </AlertDescription>
          </Alert>

          {/* ... (Your Download Template Button JSX is unchanged) ... */}
          <div className="bg-slate-50 rounded-lg p-4 border-2 border-dashed border-slate-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-slate-900 font-semibold text-sm mb-1">
                  Step 1: Download Template
                </h3>
                <p className="text-slate-600 text-xs">
                  Get the Excel template with proper column headers
                </p>
              </div>
              <CustomButton
                variant="outline"
                onClick={handleDownloadTemplate}
                className="text-sm py-2 px-4"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </CustomButton>
            </div>
          </div>

          {/* ... (Your File Upload Section JSX is unchanged) ... */}
          <div className="bg-slate-50 rounded-lg p-4 border-2 border-dashed border-slate-300">
            <h3 className="text-slate-900 font-semibold text-sm mb-3">
              Step 2: Upload Filled Excel
            </h3>
            <div className="flex items-center gap-4">
              <label className="flex-1">
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={uploading}
                />
                <div className="flex items-center justify-center gap-3 p-6 bg-white border-2 border-slate-300 border-dashed rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                  <Upload className="w-6 h-6 text-slate-400" />
                  <div className="text-center">
                    <p className="text-slate-700 font-medium text-sm">
                      {file ? file.name : "Click to select file"}
                    </p>
                    <p className="text-slate-500 text-xs mt-1">
                      Excel (.xlsx, .xls) or CSV files only
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* ... (Your Preview Data JSX is unchanged) ... */}
          {previewData.length > 0 && (
            <div className="bg-white rounded-lg border border-slate-200">
              <div className="p-3 border-b border-slate-200 bg-slate-50">
                <h3 className="text-slate-900 font-semibold text-sm">
                  Data Preview (First 5 rows)
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700">Company Name</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700">Owner Name</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700">Phone</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700">Email</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700">PAN/VAT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((party, index) => (
                      <tr key={index} className="border-t border-slate-100">
                        <td className="px-3 py-2 text-slate-900">{party.companyName}</td>
                        <td className="px-3 py-2 text-slate-600">{party.ownerName}</td>
                        <td className="px-3 py-2 text-slate-600 text-xs">{party.phone}</td>
                        <td className="px-3 py-2 text-slate-600 text-xs">{party.email}</td>
                        <td className="px-3 py-2 text-slate-600 text-xs">{party.panVat || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ... (Your Upload Result JSX is unchanged) ... */}
          {uploadResult && (
            <Alert className={uploadResult.failed === 0 ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}>
              {uploadResult.failed === 0 ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-amber-600" />
              )}
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
                            {uploadResult.errors.slice(0, 5).map((error, index) => (
                              <li key={index}>{error}</li>
                            ))}
                            {uploadResult.errors.length > 5 && (
                              <li>...and {uploadResult.errors.length - 5} more errors</li>
                            )}
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

        {/* ... (Your Footer Actions JSX is unchanged) ... */}
        <div className="flex justify-end gap-3 mt-4 pt-3 border-t flex-shrink-0">
          <CustomButton variant="outline" onClick={handleClose} disabled={uploading}>
            {uploadResult ? "Close" : "Cancel"}
          </CustomButton>
          {!uploadResult && (
            <CustomButton
              variant="primary"
              onClick={handleUpload}
              disabled={!file || uploading}
              className="min-w-[120px]"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Parties
                </>
              )}
            </CustomButton>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}