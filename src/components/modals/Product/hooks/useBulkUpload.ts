/**
 * useBulkUpload Hook
 * Manages state and logic for bulk product upload functionality
 * Follows Single Responsibility Principle - only handles upload logic
 */

import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import type { BulkProductData } from '../../../../api/productService';
import type {
    BulkUploadResult,
    ExcelRowData,
    UploadResultState
} from '../common/BulkUploadTypes';
import {
    readExcelFile,
    transformExcelToBulkPayload,
    downloadBulkUploadTemplate
} from '../common/ExcelUtils';

interface UseBulkUploadProps {
    /** Callback to handle bulk product update */
    onBulkUpdate: (products: BulkProductData[]) => Promise<BulkUploadResult>;
    /** Optional callback after successful upload */
    onUploadSuccess?: (count: number) => void;
    /** Callback when modal should close */
    onClose: () => void;
}

interface UseBulkUploadReturn {
    /** Currently selected file */
    file: File | null;
    /** Whether upload is in progress */
    uploading: boolean;
    /** Upload result state */
    uploadResult: UploadResultState | null;
    /** Preview data (first 5 rows) */
    previewData: ExcelRowData[];
    /** Handle file selection */
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    /** Handle template download */
    handleDownloadTemplate: () => Promise<void>;
    /** Handle file upload */
    handleUpload: () => Promise<void>;
    /** Handle modal close (resets state) */
    handleClose: () => void;
}

/**
 * Hook for managing bulk upload state and operations
 * @param props - Configuration options
 * @returns State and handlers for bulk upload
 */
export const useBulkUpload = ({
    onBulkUpdate,
    onUploadSuccess,
    onClose,
}: UseBulkUploadProps): UseBulkUploadReturn => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState<UploadResultState | null>(null);
    const [previewData, setPreviewData] = useState<ExcelRowData[]>([]);

    /**
     * Resets all state and closes modal
     */
    const handleClose = useCallback(() => {
        setFile(null);
        setPreviewData([]);
        setUploadResult(null);
        onClose();
    }, [onClose]);

    /**
     * Downloads the Excel template
     */
    const handleDownloadTemplate = useCallback(async () => {
        toast.loading('Generating template...');
        try {
            await downloadBulkUploadTemplate();
            toast.dismiss();
            toast.success('Template downloaded.');
        } catch {
            toast.dismiss();
            toast.error('Failed to download template.');
        }
    }, []);

    /**
     * Handles file selection and generates preview
     */
    const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (!selected) return;

        setFile(selected);
        try {
            const data = await readExcelFile(selected);
            setPreviewData(data.slice(0, 5));
        } catch {
            toast.error('Error reading file. Please check the format.');
        }
    }, []);

    /**
     * Handles file upload and bulk update
     */
    const handleUpload = useCallback(async () => {
        if (!file) return;

        setUploading(true);
        try {
            const jsonData = await readExcelFile(file);
            const formatted = transformExcelToBulkPayload(jsonData);
            const result = await onBulkUpdate(formatted);

            const data = result?.data;
            const count = (data && !Array.isArray(data) ? data.successfullyImported : undefined) || result?.length || 0;
            setUploadResult({ successfullyImported: count });

            if (onUploadSuccess) {
                onUploadSuccess(count);
            }

            toast.success(`Successfully processed ${count} products.`);
        } catch {
            toast.error('Upload failed. Please check your data format.');
        } finally {
            setUploading(false);
        }
    }, [file, onBulkUpdate, onUploadSuccess]);

    return {
        file,
        uploading,
        uploadResult,
        previewData,
        handleFileChange,
        handleDownloadTemplate,
        handleUpload,
        handleClose,
    };
};
