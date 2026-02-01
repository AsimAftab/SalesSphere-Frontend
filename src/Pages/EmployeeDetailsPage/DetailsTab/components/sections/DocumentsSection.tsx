import React, { useRef } from 'react';
import toast from 'react-hot-toast';
import DocumentsCard from '../cards/DocumentsCard';
import ConfirmationModal from '../../../../../components/modals/CommonModals/ConfirmationModal';
import { useDocuments } from '../../hooks/useDocuments';
import { type Employee } from '../../../../../api/employeeService';
import { useAuth } from '../../../../../api/authService';

const ALLOWED_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png', 'image/jpeg'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface DocumentsSectionProps {
    employee: Employee | null;
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({ employee }) => {
    const { hasPermission } = useAuth();
    const canUpdate = hasPermission('employees', 'update');

    const {
        isDocDeleteModalOpen, setIsDocDeleteModalOpen,
        documentToDelete,
        handleRequestDeleteDocument,
        confirmDeleteDocument,
        handleUpload,
        isUploading
    } = useDocuments(employee?._id);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleTriggerUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const files = Array.from(e.target.files);
        const validFiles: File[] = [];

        for (const file of files) {
            if (!ALLOWED_TYPES.includes(file.type)) {
                toast.error(`"${file.name}" is not a supported file type. Use PDF, DOC, DOCX, PNG, or JPG.`);
                continue;
            }
            if (file.size > MAX_FILE_SIZE) {
                toast.error(`"${file.name}" exceeds 5MB limit.`);
                continue;
            }
            validFiles.push(file);
        }

        if (validFiles.length > 0) {
            handleUpload(validFiles);
        }

        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const documentFiles = (employee?.documents || []).map(doc => ({
        _id: doc._id,
        name: doc.fileName,
        fileUrl: doc.fileUrl,
        size: 'N/A',
        date: doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString('en-CA') : 'N/A',
    }));

    if (!employee) return null;

    return (
        <>
            <input
                type="file"
                multiple
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            />

            <DocumentsCard
                title="Documents & Files"
                files={documentFiles}
                onAddDocument={canUpdate ? handleTriggerUpload : undefined}
                onDeleteDocument={canUpdate ? (id) => {
                    const doc = employee.documents?.find(d => d._id === id);
                    if (doc) handleRequestDeleteDocument(id, doc.fileName);
                } : undefined}
                isUploading={isUploading}
            />

            <ConfirmationModal
                isOpen={isDocDeleteModalOpen}
                title="Delete Document"
                message={`Are you sure you want to delete "${documentToDelete?.name || 'this file'}"? This action cannot be undone.`}
                onConfirm={confirmDeleteDocument}
                onCancel={() => { setIsDocDeleteModalOpen(false); }}
                confirmButtonText="Delete Document"
                confirmButtonVariant="danger"
            />
        </>
    );
};

export default DocumentsSection;
