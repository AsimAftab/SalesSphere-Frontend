import React, { useRef } from 'react';
import DocumentsCard from '../cards/DocumentsCard';
import ConfirmationModal from '../../../../../components/modals/CommonModals/ConfirmationModal';
import { useDocuments } from '../../hooks/useDocuments';
import { type Employee } from '../../../../../api/employeeService';
import { useAuth } from '../../../../../api/authService';

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
        handleUpload
    } = useDocuments(employee?._id);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleTriggerUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleUpload(Array.from(e.target.files));
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
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
