import React from 'react';
import { Upload, Download, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '../../../UI/SuperadminComponents/alert';
import CustomButton from '../../../UI/Button/Button';
import type { ExcelRowData, UploadResultState } from '../common/BulkUploadTypes';
import { getCellValue } from '../common/ExcelUtils';

interface BulkUploadFormProps {
    /** Currently selected file */
    file: File | null;
    /** Whether upload is in progress */
    uploading: boolean;
    /** Upload result state */
    uploadResult: UploadResultState | null;
    /** Preview data (first 5 rows) */
    previewData: ExcelRowData[];
    /** Handle file selection */
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    /** Handle template download */
    onDownloadTemplate: () => void;
    /** Handle file upload */
    onUpload: () => void;
    /** Handle modal close */
    onClose: () => void;
}

/**
 * BulkUploadForm - Renders the bulk upload UI
 * Receives all state and handlers from parent/hook
 */
const BulkUploadForm: React.FC<BulkUploadFormProps> = ({
    file,
    uploading,
    uploadResult,
    previewData,
    onFileChange,
    onDownloadTemplate,
    onUpload,
    onClose,
}) => {
    return (
        <>
            {/* Content Area */}
            <div className="space-y-4 overflow-y-auto flex-1 mt-4 px-1">
                {/* Instructions Alert */}
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

                {/* Step 1: Download Template */}
                <div className="bg-slate-50 rounded-lg p-4 border-2 border-dashed border-slate-300">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-slate-900 font-semibold text-sm">Step 1: Download Template</h3>
                            <p className="text-slate-600 text-xs">Get the Excel template with proper column headers</p>
                        </div>
                        <CustomButton variant="outline" onClick={onDownloadTemplate} className="text-sm">
                            <Download className="w-4 h-4 mr-2" /> Download
                        </CustomButton>
                    </div>
                </div>

                {/* Step 2: Upload File */}
                <div className="bg-slate-50 rounded-lg p-4 border-2 border-dashed border-slate-300">
                    <h3 className="text-slate-900 font-semibold text-sm mb-3">Step 2: Upload Filled Excel</h3>
                    <label className="block w-full">
                        <input
                            type="file"
                            className="hidden"
                            accept=".xlsx, .xls"
                            onChange={onFileChange}
                            disabled={uploading}
                        />
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-6 bg-white border-2 border-slate-300 border-dashed rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                            <Upload className="w-8 h-8 text-slate-400" />
                            <div className="text-center sm:text-left">
                                <p className="text-slate-700 font-medium text-sm">
                                    {file ? file.name : 'Click to select file'}
                                </p>
                                <p className="text-slate-500 text-xs mt-1">Excel (.xlsx, .xls) files only</p>
                            </div>
                        </div>
                    </label>
                </div>

                {/* Data Preview Table */}
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
                                            <td className="px-3 py-2 text-slate-900 font-medium">{getCellValue(row['Product Name'] || row['product name'] || row['productname'])}</td>
                                            <td className="px-3 py-2 text-slate-600">{getCellValue(row['Category'] || row['category'])}</td>
                                            <td className="px-3 py-2 text-slate-600">{getCellValue(row['Price'] || row['price'])}</td>
                                            <td className="px-3 py-2 text-slate-600">{getCellValue(row['Stock (Qty)'] || row['stock (qty)'] || row['stock'] || row['qty'])}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Success Alert */}
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

export default BulkUploadForm;
