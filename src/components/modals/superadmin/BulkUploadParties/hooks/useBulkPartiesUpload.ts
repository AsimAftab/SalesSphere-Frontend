/**
 * useBulkPartiesUpload Hook
 * Manages state and logic for bulk party upload functionality
 * Follows Single Responsibility Principle - only handles upload logic
 */

import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { bulkUploadParties } from '../../../../../api/partyService';
import type { UploadResultState, PartyExcelRow } from '../types';
import {
    readPartyExcelFile,
    transformExcelToPartyPayload,
    downloadPartyTemplate,
    validatePartyRow
} from '../utils/partyExcelUtils';

interface UseBulkPartiesUploadProps {
    organizationId?: string;
    organizationName?: string;
    onUploadSuccess?: (count: number) => void;
    onClose: () => void;
}

interface UseBulkPartiesUploadReturn {
    file: File | null;
    uploading: boolean;
    uploadResult: UploadResultState | null;
    uploadErrors: string[]; // Store errors separately for results
    previewData: PartyExcelRow[];
    validationErrors: Record<number, string[]>; // Row index -> Errors
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    handleDownloadTemplate: () => Promise<void>;
    handleUpload: () => Promise<void>;
    handleClose: () => void;
}

export const useBulkPartiesUpload = ({
    organizationId,
    organizationName,
    onUploadSuccess,
    onClose,
}: UseBulkPartiesUploadProps): UseBulkPartiesUploadReturn => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState<UploadResultState | null>(null);
    const [uploadErrors, setUploadErrors] = useState<string[]>([]);
    const [previewData, setPreviewData] = useState<PartyExcelRow[]>([]);
    const [validationErrors, setValidationErrors] = useState<Record<number, string[]>>({});

    const handleClose = useCallback(() => {
        setFile(null);
        setPreviewData([]);
        setUploadResult(null);
        setUploadErrors([]);
        setValidationErrors({});
        onClose();
    }, [onClose]);

    const handleDownloadTemplate = useCallback(async () => {
        toast.loading('Generating template...');
        try {
            await downloadPartyTemplate(organizationName);
            toast.dismiss();
            toast.success('Template downloaded.');
        } catch {
            toast.dismiss();
            toast.error('Failed to download template.');
        }
    }, [organizationName]);

    const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (!selected) return;

        setFile(selected);
        setUploadResult(null);
        setUploadErrors([]);
        setValidationErrors({});

        try {
            const data = await readPartyExcelFile(selected);

            // Validate first 5 rows for preview
            const preview = data.slice(0, 5).map((row, index) => {
                // Map to our internal structure just for preview
                return {
                    sNo: row['S.No'] || row['s.no'] || index + 1,
                    partyName: row['Party Name'],
                    ownerName: row['Owner Name'],
                    panVat: row['PAN/VAT Number'],
                    phone: row['Phone Number'],
                    email: row['Email'],
                    address: row['Address'],
                    partyType: row['Party Type'],
                    description: row['Description']
                } as PartyExcelRow;
            });

            // Run Zod validation on preview rows to show immediate feedback
            const errorsMap: Record<number, string[]> = {};
            data.slice(0, 5).forEach((row, index) => {
                const result = validatePartyRow(row);
                if (!result.success && result.errors) {
                    errorsMap[index] = result.errors;
                }
            });

            setPreviewData(preview);
            setValidationErrors(errorsMap);
            toast.success(`File loaded. Found ${data.length} rows.`);

        } catch {
            toast.error('Error reading file. Please check the format.');
            setFile(null);
        }
    }, []);

    const handleUpload = useCallback(async () => {
        if (!file || !organizationId) {
            toast.error("Missing file or organization ID");
            return;
        }

        setUploading(true);
        try {
            const jsonData = await readPartyExcelFile(file);
            const formattedPayload = transformExcelToPartyPayload(jsonData);

            if (formattedPayload.length === 0) {
                toast.error("No valid parties found to upload.");
                setUploading(false);
                return;
            }

            const result = await bulkUploadParties(organizationId, formattedPayload);

            setUploadResult({ successfullyImported: result.success });
            setUploadErrors(result.errors || []);

            if (result.success > 0 && onUploadSuccess) {
                onUploadSuccess(result.success);
            }

            if (result.success > 0) {
                toast.success(`Successfully uploaded ${result.success} parties.`);
            } else {
                toast.error("Upload failed.");
            }

        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Upload failed. Please check your data format.';
            toast.error(message);
        } finally {
            setUploading(false);
        }
    }, [file, organizationId, onUploadSuccess]);

    return {
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
    };
};
