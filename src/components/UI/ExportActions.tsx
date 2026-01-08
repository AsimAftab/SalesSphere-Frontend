import React from 'react';
import { FileDown, FileText, Printer } from 'lucide-react';
import Button from './Button/Button';

interface ExportActionsProps {
    onExportPdf?: () => void; // Now optional
    onExportExcel?: () => void;
    onPrint?: () => void;
}

const ExportActions: React.FC<ExportActionsProps> = ({ onExportPdf, onExportExcel, onPrint }) => {
    return (
        <div className="flex space-x-3">
            {onExportPdf && (
                <Button
                    type="button"
                    onClick={onExportPdf}
                    variant="outline"
                    title="Export to PDF"
                    className="rounded-lg px-6 py-2.5 flex items-center gap-2"
                >
                    <FileText size={16} className="text-red-500" />
                    <span className="hidden sm:inline">PDF</span>
                </Button>
            )}

            {/* This button will only show if onExportExcel is provided */}
            {onExportExcel && (
                <Button
                    type="button"
                    onClick={onExportExcel}
                    variant="outline"
                    title="Export to Excel"
                    className="rounded-lg px-6 py-2.5 flex items-center gap-2"
                >
                    <FileDown size={16} className="text-green-600" />
                    <span className="hidden sm:inline">Excel</span>
                </Button>
            )}

            {/* This button will only show if onPrint is provided */}
            {onPrint && (
                <Button
                    type="button"
                    onClick={onPrint}
                    variant="outline"
                    title="Print Document"
                    className="rounded-lg px-6 py-2.5 flex items-center gap-2"
                >
                    <Printer size={16} className="text-blue-500" />
                    <span className="hidden sm:inline">Print</span>
                </Button>
            )}
        </div>
    );
};

export default ExportActions;
