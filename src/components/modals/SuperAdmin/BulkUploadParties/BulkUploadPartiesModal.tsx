import React from 'react';
import { FileSpreadsheet, Upload, Loader2 } from 'lucide-react';
import { FormModal, Button } from '@/components/ui';
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
            title="Bulk Upload Parties"
            description={organizationName ? `${organizationName} • Upload multiple parties via Excel` : 'Upload multiple parties via Excel'}
            size="2xl"
            icon={<FileSpreadsheet className="h-5 w-5 text-blue-600" />}
            footer={footer}
        >
            <BulkUploadPartiesForm
                file={file}
                uploading={uploading}
                uploadResult={uploadResult}
                uploadErrors={uploadErrors}
                previewData={previewData}
                validationErrors={validationErrors}
                onFileChange={handleFileChange}
                onDownloadTemplate={handleDownloadTemplate}
            />
        </FormModal>
    );
};

export default BulkUploadPartiesModal;
