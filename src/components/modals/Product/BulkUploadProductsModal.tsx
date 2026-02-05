import React from 'react';
import { FileSpreadsheet, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { useBulkUpload } from './hooks/useBulkUpload';
import BulkUploadForm from './components/BulkUploadForm';
import type { BulkUploadProductsModalProps } from './common/BulkUploadTypes';
import { ErrorBoundary } from '@/components/ui';

/**
 * BulkUploadProductsModal - Modal for bulk uploading products via Excel
 * 
 * @example
 * ```tsx
 * <BulkUploadProductsModal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   onBulkUpdate={handleBulkUpdate}
 *   onUploadSuccess={(count) => console.log(`Uploaded ${count} products`)}
 * />
 * ```
 */
export const BulkUploadProductsModal: React.FC<BulkUploadProductsModalProps> = ({
    isOpen,
    onClose,
    organizationName,
    onBulkUpdate,
    onUploadSuccess,
}) => {
    const {
        file,
        uploading,
        uploadResult,
        previewData,
        handleFileChange,
        handleDownloadTemplate,
        handleUpload,
        handleClose,
    } = useBulkUpload({
        onBulkUpdate,
        onUploadSuccess,
        onClose,
    });

    return (
        <ErrorBoundary>
            <Dialog open={isOpen} onOpenChange={handleClose}>
                <DialogContent hideCloseButton className="!w-[95vw] !max-w-[800px] !max-h-[90vh] overflow-hidden flex flex-col p-4 bg-white rounded-lg">
                    {/* Header */}
                    <DialogHeader className="flex-shrink-0">
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                    <FileSpreadsheet className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <div>
                                    <DialogTitle className="text-lg sm:text-xl text-slate-900">
                                        Bulk Upload Products
                                    </DialogTitle>
                                    <DialogDescription className="text-xs sm:text-sm">
                                        {organizationName ? `${organizationName} • ` : ''}Upload multiple products via Excel
                                    </DialogDescription>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 hover:rotate-90 focus:outline-none"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </DialogHeader>

                    {/* Form Content */}
                    <BulkUploadForm
                        file={file}
                        uploading={uploading}
                        uploadResult={uploadResult}
                        previewData={previewData}
                        onFileChange={handleFileChange}
                        onDownloadTemplate={handleDownloadTemplate}
                        onUpload={handleUpload}
                        onClose={handleClose}
                    />
                </DialogContent>
            </Dialog>
        </ErrorBoundary>
    );
};

export default BulkUploadProductsModal;
