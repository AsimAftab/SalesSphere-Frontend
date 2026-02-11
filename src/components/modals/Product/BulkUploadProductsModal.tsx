import React from 'react';
import { FileSpreadsheet, Upload, Loader2 } from 'lucide-react';
import { FormModal, Button } from '@/components/ui';
import { useBulkUpload } from './hooks/useBulkUpload';
import BulkUploadForm from './components/BulkUploadForm';
import type { BulkUploadProductsModalProps } from './common/BulkUploadTypes';

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

    const footer = (
        <div className="flex justify-end gap-3 w-full">
            <Button variant="outline" onClick={handleClose} disabled={uploading}>
                {uploadResult ? 'Close' : 'Cancel'}
            </Button>
            {!uploadResult && (
                <Button onClick={handleUpload} disabled={!file || uploading} className="min-w-[100px]">
                    {uploading ? (
                        <>
                            <Loader2 className="animate-spin mr-2 w-4 h-4" /> Uploading...
                        </>
                    ) : (
                        <>
                            <Upload className="mr-2 w-4 h-4" /> Upload
                        </>
                    )}
                </Button>
            )}
        </div>
    );

    return (
        <FormModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Bulk Upload Products"
            description={organizationName ? `${organizationName} • Upload multiple products via Excel` : 'Upload multiple products via Excel'}
            size="2xl"
            icon={<FileSpreadsheet className="h-5 w-5 text-blue-600" />}
            footer={footer}
        >
            <BulkUploadForm
                file={file}
                uploading={uploading}
                uploadResult={uploadResult}
                previewData={previewData}
                onFileChange={handleFileChange}
                onDownloadTemplate={handleDownloadTemplate}
            />
        </FormModal>
    );
};

export default BulkUploadProductsModal;
