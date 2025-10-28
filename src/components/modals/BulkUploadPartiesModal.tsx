import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "../uix/dialog";
import CustomButton from "../UI/Button/Button";
import { Alert, AlertDescription } from "../uix/alert";
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
import * as XLSX from 'xlsx';
import { bulkUploadParties } from "../../api/partyService";
import type { Party } from "../../api/partyService";

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

  const handleDownloadTemplate = () => {
    // Create template data with example rows matching Party interface
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
      {
        "Company Name": "Taylor Design Studio",
        "Owner Name": "Michael Taylor",
        "PAN/VAT Number": "987654321",
        "Phone Number": "9851234567",
        "Email": "michael.taylor@taylordesign.com",
        "Address": "Durbar Marg, Kathmandu 44600, Nepal",
        "Latitude": 27.7056,
        "Longitude": 85.3164
      },
      {
        "Company Name": "Anderson Enterprises",
        "Owner Name": "Barbara Anderson",
        "PAN/VAT Number": "456789123",
        "Phone Number": "9861234567",
        "Email": "barbara.anderson@anderson.com",
        "Address": "Lakeside, Pokhara 33700, Nepal",
        "Latitude": 28.2096,
        "Longitude": 83.9588
      }
    ];

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(templateData);

    // Set column widths for better readability
    ws['!cols'] = [
      { wch: 35 }, // Company Name
      { wch: 25 }, // Owner Name
      { wch: 18 }, // PAN/VAT Number
      { wch: 15 }, // Phone Number
      { wch: 35 }, // Email
      { wch: 45 }, // Address
      { wch: 12 }, // Latitude
      { wch: 12 }  // Longitude
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Parties Template");

    // Download file
    XLSX.writeFile(wb, `Parties_Upload_Template_${organizationName.replace(/\s+/g, '_')}.xlsx`);

    toast.success("Template downloaded successfully. Fill in the template with your party data and upload");
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
      ];

      if (!validTypes.includes(selectedFile.type)) {
        toast.error("Invalid file type. Please upload an Excel (.xlsx, .xls) or CSV file");
        return;
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (selectedFile.size > maxSize) {
        toast.error("File too large. Maximum file size is 10MB. Please reduce the file size or split into multiple files.");
        return;
      }

      setFile(selectedFile);
      setUploadResult(null);
      previewFile(selectedFile);
    }
  };

  const previewFile = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

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

        toast.success(`File loaded successfully. Found ${jsonData.length} rows. Showing preview of first 5 rows.`);
      } catch (error) {
        toast.error("Failed to read file. Please ensure the file format is correct");
        setFile(null);
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("No file selected. Please select a file to upload");
      return;
    }

    setUploading(true);
    setUploadResult(null);

    try {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

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
          setUploading(false);

          if (result.success > 0) {
            const message = result.failed > 0
              ? `Successfully uploaded ${result.success} parties. ${result.failed} parties failed to upload`
              : `Successfully uploaded ${result.success} parties. All parties uploaded successfully`;
            toast.success(message);
            onUploadSuccess?.(result.success);
          } else {
            toast.error("Upload failed. No parties were uploaded successfully");
          }
        } catch (error) {
          setUploading(false);
          const errorMsg = error instanceof Error ? error.message : "An error occurred during upload";
          toast.error(`Upload failed. ${errorMsg}`);
        }
      };

      reader.readAsBinaryString(file);
    } catch (error) {
      setUploading(false);
      const errorMsg = error instanceof Error ? error.message : "An error occurred";
      toast.error(`Upload failed. ${errorMsg}`);
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
          {/* Instructions */}
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

          {/* Download Template Button */}
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

          {/* File Upload Section */}
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

          {/* Preview Data */}
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

          {/* Upload Result */}
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

        {/* Footer Actions */}
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
