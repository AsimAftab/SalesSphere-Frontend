import React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Loader2,
  RefreshCw,
  Upload,
  XCircle,
} from 'lucide-react';
import type { PartyExcelRow, UploadResultState } from '../types';
import { Alert, AlertDescription } from '@/components/ui/SuperadminComponents/alert';
import { Button as CustomButton } from '@/components/ui';

interface BulkUploadPartiesFormProps {
    file: File | null;
    uploading: boolean;
    uploadResult: UploadResultState | null;
    uploadErrors: string[];
    previewData: PartyExcelRow[];
    validationErrors: Record<number, string[]>;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDownloadTemplate: () => void;
    onUpload: () => void;
    onClose: () => void;
}

const BulkUploadPartiesForm: React.FC<BulkUploadPartiesFormProps> = ({
    file,
    uploading,
    uploadResult,
    uploadErrors,
    previewData,
    validationErrors,
    onFileChange,
    onDownloadTemplate,
    onUpload,
    onClose,
}) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    return (
        <>
            <div className="space-y-4 overflow-y-auto flex-1 mt-4 px-1">
                {/* Instructions Banner */}
                <div className="bg-blue-50/60 border border-blue-200 rounded-lg p-4 flex items-start gap-4 shadow-sm">
                    <div className="p-2 bg-white rounded-md border border-blue-100 shadow-sm shrink-0">
                        <AlertCircle className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="space-y-1.5 pt-0.5">
                        <h4 className="text-md font-bold text-gray-900">Import Instructions</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                            <p>To ensure a successful bulk upload, please follow these steps:</p>
                            <ul className="list-disc ml-4 space-y-0.5 text-gray-700 font-medium">
                                <li>Download the standard template below.</li>
                                <li>Do not modify or rename the column headers.</li>
                                <li>Populate data starting from <strong>Row 3</strong>.</li>
                                <li>Required fields: <span className="text-blue-700">Party Name, Owner Name, PAN/VAT, Phone</span>.</li>
                                <li>Note: Coordinates will default to Kathmandu if Address is missing.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Step 1: Download Template */}
                <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm transition-all hover:shadow-md hover:border-blue-300 group">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold text-sm border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                1
                            </div>
                            <div>
                                <h3 className="text-md font-bold text-gray-900">Download Template</h3>
                                <p className="text-sm text-gray-500">Get the correctly formatted Excel file</p>
                            </div>
                        </div>
                        <CustomButton variant="outline" onClick={onDownloadTemplate} className="text-sm font-medium border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600">
                            <Download className="w-4 h-4 mr-2" /> Download Template
                        </CustomButton>
                    </div>
                </div>

                {/* Step 2: Upload File */}
                <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm transition-all hover:shadow-md hover:border-blue-300 group">
                    <div className="mb-5 flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold text-sm border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            2
                        </div>
                        <div>
                            <h3 className="text-md font-bold text-gray-900">Upload Filled Excel</h3>
                            <p className="text-sm text-gray-500">Select your filled Excel file to import</p>
                        </div>
                    </div>

                    {file ? (
                        // Compact File Selected State
                        <div className="flex items-center justify-between p-4 bg-blue-50/50 border border-blue-200 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg border border-blue-100 text-blue-600 shadow-sm">
                                    <FileSpreadsheet className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {(file.size / 1024).toFixed(1)} KB
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <label className="cursor-pointer">
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept=".xlsx, .xls, .csv"
                                        onChange={onFileChange}
                                        disabled={uploading}
                                        ref={fileInputRef}
                                    />
                                </label>
                                <CustomButton
                                    onClick={() => fileInputRef.current?.click()}
                                    className="h-9 px-4 text-xs font-bold shadow-sm"
                                >
                                    <RefreshCw className="mr-2 w-3.5 h-3.5" /> Change
                                </CustomButton>
                            </div>
                        </div>
                    ) : (
                        // Empty State Dropzone
                        <label className="block w-full">
                            <input
                                type="file"
                                className="hidden"
                                accept=".xlsx, .xls, .csv"
                                onChange={onFileChange}
                                disabled={uploading}
                            />
                            <div className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-gray-300 bg-gray-50/50 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-300 group">
                                <div className="p-3 bg-white rounded-full text-gray-400 border border-gray-200 shadow-sm group-hover:text-blue-500 group-hover:scale-110 transition-all">
                                    <Upload className="w-6 h-6" />
                                </div>
                                <div className="text-center space-y-1">
                                    <p className="text-sm font-semibold text-gray-700 group-hover:text-blue-700">
                                        Click to browse or drag file here
                                    </p>
                                    <p className="text-xs text-gray-400">Supports .xlsx, .xls, .csv</p>
                                </div>
                            </div>
                        </label>
                    )}
                </div>

                {/* Data Preview Table */}
                {previewData.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-2">
                        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-white">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-gray-50 rounded-md border border-gray-100">
                                    <FileSpreadsheet className="w-3.5 h-3.5 text-gray-500" />
                                </div>
                                <h3 className="text-sm font-bold text-gray-800">Preview Data</h3>
                            </div>
                            <span className="text-sm font-semibold text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                                Showing top 5 rows
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50/80 border-b border-gray-100">
                                    <tr>
                                        {['S.No', 'Party Name', 'Owner', 'Type', 'PAN/VAT', 'Phone'].map((h) => (
                                            <th key={h} className="px-5 py-2.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {previewData.map((row, i) => (
                                        <tr key={i} className={`group transition-colors ${validationErrors[i] ? 'bg-red-50/50' : 'hover:bg-blue-50/40'}`}>
                                            <td className="px-5 py-3 text-gray-400 font-mono text-xs whitespace-nowrap">
                                                {row.sNo}
                                            </td>
                                            <td className="px-5 py-3 font-medium text-gray-700 group-hover:text-gray-900 truncate max-w-[150px]">
                                                {row.partyName}
                                                {validationErrors[i] && validationErrors[i].some(e => e.includes('Name')) && (
                                                    <AlertCircle className="inline w-3 h-3 text-red-500 ml-1" />
                                                )}
                                            </td>
                                            <td className="px-5 py-3 text-gray-600 text-xs whitespace-nowrap">
                                                {row.ownerName}
                                            </td>
                                            <td className="px-5 py-3 text-gray-500 text-xs whitespace-nowrap">
                                                {row.partyType || '-'}
                                            </td>
                                            <td className="px-5 py-3 text-gray-600 font-mono text-xs whitespace-nowrap">
                                                {row.panVat || '-'}
                                            </td>
                                            <td className="px-5 py-3 text-gray-600 text-xs whitespace-nowrap">
                                                {row.phone}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Success Alert */}
                {uploadResult && (
                    <Alert className={uploadErrors.length === 0 ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}>
                        {uploadErrors.length === 0 ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-amber-600" />}
                        <AlertDescription className={uploadErrors.length === 0 ? "text-green-800" : "text-amber-800"}>
                            <p className="font-medium mb-2">Upload Complete</p>
                            <div className="text-sm space-y-1">
                                <p>Successfully uploaded: <strong>{uploadResult.successfullyImported}</strong> parties</p>
                                {uploadErrors.length > 0 && (
                                    <div className="mt-2">
                                        <p className="font-medium text-amber-900">Errors encountered:</p>
                                        <ul className="list-disc ml-4 text-xs text-amber-800 max-h-32 overflow-y-auto">
                                            {uploadErrors.slice(0, 10).map((error, index) => <li key={index}>{error}</li>)}
                                            {uploadErrors.length > 10 && <li>...and {uploadErrors.length - 10} more errors</li>}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </AlertDescription>
                    </Alert>
                )}
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 mt-4 pt-3 border-t flex-shrink-0">
                <CustomButton variant="outline" onClick={onClose} disabled={uploading}>
                    {uploadResult ? 'Close' : 'Cancel'}
                </CustomButton>
                {!uploadResult && (
                    <CustomButton onClick={onUpload} disabled={!file || uploading} className="min-w-[100px]">
                        {uploading ? (
                            <>
                                <Loader2 className="animate-spin mr-2 w-4 h-4" /> Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="mr-2 w-4 h-4" /> Upload
                            </>
                        )}
                    </CustomButton>
                )}
            </div>
        </>
    );
};

export default BulkUploadPartiesForm;
