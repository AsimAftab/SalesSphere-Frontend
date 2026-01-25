import React from 'react';
import { FileSpreadsheet } from 'lucide-react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../../UI/SuperadminComponents/dialog';
import ErrorBoundary from '../../../UI/ErrorBoundary/ErrorBoundary';
import { useBulkPartiesUpload } from './hooks/useBulkPartiesUpload';
import BulkUploadPartiesForm from './components/BulkUploadPartiesForm';

interface BulkUploadPartiesModalProps {
    isOpen: boolean;
    onClose: () => void;
    organizationId?: string;
    organizationName?: string;
    onUploadSuccess?: (count: number) => void;
}

export const BulkUploadPartiesModal: React.FC<BulkUploadPartiesModalProps> = ({
    isOpen,
    onClose,
    organizationId,
    organizationName,
    onUploadSuccess,
}) => {
    const {
        file,
        uploading,
        uploadResult,
        uploadErrors,
        previewData,
        validationErrors,
        handleFileChange,
        handleDownloadTemplate,
        handleUpload,
        handleClose,
    } = useBulkPartiesUpload({
        organizationId,
        organizationName,
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
                                        Bulk Upload Parties
                                    </DialogTitle>
                                    <DialogDescription className="text-xs sm:text-sm">
                                        {organizationName ? `${organizationName} • ` : ''}Upload multiple parties via Excel
                                    </DialogDescription>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 hover:rotate-90 focus:outline-none"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </DialogHeader>

                    {/* Form Content */}
                    <BulkUploadPartiesForm
                        file={file}
                        uploading={uploading}
                        uploadResult={uploadResult}
                        uploadErrors={uploadErrors}
                        previewData={previewData}
                        validationErrors={validationErrors}
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

export default BulkUploadPartiesModal;
