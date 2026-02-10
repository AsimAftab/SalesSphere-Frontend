import React from 'react';
import {
    AlertCircle,
    CheckCircle2,
    Download,
    FileSpreadsheet,
    RefreshCw,
    Upload,
    AlertTriangle,
    Info,
} from 'lucide-react';
import type { PartyExcelRow, UploadResultState } from '../types';
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
}) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = React.useState(false);

    // Drag and drop handlers
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.name.match(/\.(xlsx|xls|csv)$/)) {
                const syntheticEvent = {
                    target: { files: e.dataTransfer.files }
                } as React.ChangeEvent<HTMLInputElement>;
                onFileChange(syntheticEvent);
            }
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className="space-y-5 p-5">
            {/* Step 1: Preparation */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100">
                        1
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900">Prepare Your Data</h3>
                </div>

                <div className="space-y-4">
                    {/* Instructions Card */}
                    <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-blue-900 uppercase tracking-wide">
                                    Guidelines
                                </h4>
                                <ul className="space-y-1.5">
                                    <li className="text-sm text-blue-800 flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                                        <span>Use the provided template below.</span>
                                    </li>
                                    <li className="text-sm text-blue-800 flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                                        <span>Start data entry from <strong>Row 3</strong>.</span>
                                    </li>
                                    <li className="text-sm text-blue-800 flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                                        <span>Required: Party Name, Owner, Phone Number, PAN/VAT.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Template Download Card */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-row items-center justify-between hover:border-blue-200 transition-colors group">
                        <div className="space-y-1">
                            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide group-hover:text-blue-700 transition-colors">
                                Template
                            </h4>
                            <p className="text-xs text-gray-500">
                                Download standard Excel structure.
                            </p>
                        </div>
                        <CustomButton
                            variant="outline"
                            onClick={onDownloadTemplate}
                            className="ml-4 h-9 text-xs font-medium border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
                        >
                            <Download className="w-4 h-4 mr-2" /> Download File
                        </CustomButton>
                    </div>
                </div>
            </div>

            {/* Step 2: Upload */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100">
                        2
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900">Upload Data</h3>
                </div>

                <div className="bg-white">
                    {file ? (
                        <div className="relative group overflow-hidden rounded-xl border border-blue-200 bg-blue-50/20 ring-1 ring-blue-100 transition-all">
                            <div className="p-5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white rounded-lg shadow-sm border border-blue-100 text-blue-600">
                                        <FileSpreadsheet className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                                            {file.name}
                                        </h4>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-xs text-gray-500 font-medium">
                                                {formatFileSize(file.size)}
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                                            <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                                                <CheckCircle2 className="w-3 h-3" /> Ready to process
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept=".xlsx, .xls, .csv"
                                        onChange={onFileChange}
                                        disabled={uploading}
                                        ref={fileInputRef}
                                    />
                                    <CustomButton
                                        variant="ghost"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="h-9 px-3 text-xs text-gray-500 hover:text-blue-700 hover:bg-blue-50"
                                        disabled={uploading}
                                    >
                                        <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Replace
                                    </CustomButton>
                                </div>
                            </div>

                            {/* Upload Progress Overlay */}
                            {uploading && (
                                <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-end">
                                    <div className="w-full h-1 bg-blue-100">
                                        <div className="h-full bg-blue-600 animate-loading-bar" style={{ width: '100%' }} />
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <label
                            htmlFor="bulk-upload-file-parties"
                            className={`relative flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden
                                ${dragActive
                                    ? 'border-blue-500 bg-blue-50 ring-4 ring-blue-100/50'
                                    : 'border-gray-200 bg-gray-50/50 hover:border-blue-300 hover:bg-white'
                                }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <input
                                id="bulk-upload-file-parties"
                                type="file"
                                className="hidden"
                                accept=".xlsx, .xls, .csv"
                                onChange={onFileChange}
                                disabled={uploading}
                            />

                            <div className="flex flex-col items-center justify-center space-y-3 p-6 text-center z-10">
                                <div className={`p-3 rounded-full transition-all duration-300 ${dragActive ? 'bg-blue-100 text-blue-600 scale-110' : 'bg-white shadow-sm border border-gray-100 text-gray-400 group-hover:text-blue-500 group-hover:border-blue-100'}`}>
                                    <Upload className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-700">
                                        <span className="text-blue-600 hover:underline">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        Supports .xlsx and .xls
                                    </p>
                                </div>
                            </div>
                        </label>
                    )}
                </div>
            </div>

            {/* Validation & Status Block */}
            {(uploadResult || uploadErrors.length > 0 || previewData.length > 0) && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100">
                            3
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900">Review & Validate</h3>
                    </div>

                    {/* Preview Table */}
                    {previewData.length > 0 && !uploadResult && uploadErrors.length === 0 && (
                        <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                            <div className="bg-gray-50/80 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Data Preview</span>
                                <span className="text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-500">First 5 rows</span>
                            </div>
                            <div className="overflow-x-auto max-h-[250px] scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
                                        <tr>
                                            {['S.No', 'Party Name', 'Owner', 'Phone', 'Type', 'PAN/VAT', 'Status'].map(h => (
                                                <th key={h} className="px-4 py-2.5 font-medium text-gray-500 whitespace-nowrap bg-gray-50/50">
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {previewData.map((row, i) => {
                                            const hasError = validationErrors[i]?.length > 0;
                                            return (
                                                <tr key={i} className={`hover:bg-gray-50/60 transition-colors group ${hasError ? 'bg-red-50/10' : ''}`}>
                                                    <td className="px-4 py-2 text-gray-400 font-mono">{row.sNo}</td>
                                                    <td className="px-4 py-2 font-medium text-gray-900">{row.partyName}</td>
                                                    <td className="px-4 py-2 text-gray-600">{row.ownerName}</td>
                                                    <td className="px-4 py-2 text-gray-600 font-mono">{row.phone || '-'}</td>
                                                    <td className="px-4 py-2 text-gray-500">{row.partyType || '-'}</td>
                                                    <td className="px-4 py-2 text-gray-500 font-mono">{row.panVat || '-'}</td>
                                                    <td className="px-4 py-2">
                                                        {hasError ? (
                                                            <div className="flex items-center gap-1.5 text-red-600">
                                                                <AlertCircle className="w-3.5 h-3.5" />
                                                                <span className="font-medium">Missing Fields</span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-1.5 text-green-600">
                                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                                <span className="font-medium">Valid</span>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Results / Errors Panel */}
                    {(uploadResult || uploadErrors.length > 0) && (
                        <div className={`rounded-xl border p-5 shadow-sm transition-all duration-300 ${uploadErrors.length === 0
                            ? 'bg-emerald-50/30 border-emerald-100'
                            : 'bg-red-50 border-red-100' // Softer red background
                            }`}>
                            <div className="flex gap-4">
                                <div className={`p-2.5 rounded-lg shrink-0 ${uploadErrors.length === 0
                                    ? 'bg-emerald-100 text-emerald-600'
                                    : 'bg-red-100 text-red-600'
                                    }`}>
                                    {uploadErrors.length === 0 ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                                </div>
                                <div className="space-y-1 flex-1">
                                    <h4 className={`text-sm font-semibold ${uploadErrors.length === 0 ? 'text-emerald-900' : 'text-red-900'
                                        }`}>
                                        {uploadErrors.length === 0 ? 'Import Successful' : 'Attention Needed'}
                                    </h4>

                                    {uploadResult && (
                                        <p className="text-xs text-gray-700 mb-2">
                                            Successfully processed <span className="font-semibold text-gray-900">{uploadResult.successfullyImported}</span> records.
                                        </p>
                                    )}

                                    {/* Display Errors (uploadErrors is string[]) */}
                                    {uploadErrors.length > 0 && (
                                        <div className="mt-3 bg-white rounded-lg border border-red-200 shadow-sm overflow-hidden">
                                            <div className="px-3 py-2 bg-red-50 border-b border-red-100 flex justify-between items-center">
                                                <span className="text-[10px] uppercase font-bold text-red-800 tracking-wider">Error Log</span>
                                                <span className="text-[10px] text-red-600 font-medium">{uploadErrors.length} issues found</span>
                                            </div>
                                            <div className="max-h-40 overflow-y-auto p-0 scrollbar-thin scrollbar-thumb-red-200">
                                                <ul className="divide-y divide-red-100">
                                                    {uploadErrors.map((err, idx) => (
                                                        <li key={idx} className="px-3 py-2.5 text-xs text-gray-700 hover:bg-red-50/50 flex gap-2 items-start">
                                                            <span className="text-red-500 font-mono text-[10px] mt-0.5">•</span>
                                                            <span className="leading-relaxed">{err}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BulkUploadPartiesForm;
