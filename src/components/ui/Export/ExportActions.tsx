import React from 'react';
import { FileDown, FileText } from 'lucide-react';
import { Button } from '@/components/ui';

interface ExportActionsProps {
    onExportPdf?: () => void; // Now optional
    onExportExcel?: () => void;
}

const ExportActions: React.FC<ExportActionsProps> = ({ onExportPdf, onExportExcel }) => {
    return (
        <div className="flex space-x-2">
            {onExportPdf && (
                <Button
                    type="button"
                    onClick={onExportPdf}
                    variant="outline"
                    title="Export to PDF"
                    className="rounded-lg px-2 sm:px-3 py-2 h-9 sm:h-10 flex items-center gap-1.5"
                >
                    <FileText size={16} className="text-red-500" />
                    <span className="text-sm">PDF</span>
                </Button>
            )}

            {/* This button will only show if onExportExcel is provided */}
            {onExportExcel && (
                <Button
                    type="button"
                    onClick={onExportExcel}
                    variant="outline"
                    title="Export to Excel"
                    className="rounded-lg px-2 sm:px-3 py-2 h-9 sm:h-10 flex items-center gap-1.5"
                >
                    <FileDown size={16} className="text-green-600" />
                    <span className="text-sm">Excel</span>
                </Button>
            )}
        </div>
    );
};

export default ExportActions;
