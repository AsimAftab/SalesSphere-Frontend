import React from 'react';
import { FileText, Image, Download, Trash2, Upload, FolderOpen, Calendar } from 'lucide-react';
import { Button } from '@/components/ui';

interface FileItem {
  _id?: string;
  name: string;
  date: string;
  fileUrl: string;
}

interface DocumentsCardProps {
  title: string;
  files: FileItem[];
  onAddDocument?: () => void;
  onDeleteDocument?: (docId: string) => void;
  isUploading?: boolean;
}

const getFileExtension = (fileName: string) => fileName.split('.').pop()?.toLowerCase() || '';

const getFileMeta = (fileName: string) => {
  const ext = getFileExtension(fileName);
  if (ext === 'pdf') return { iconBg: 'bg-red-100', iconColor: 'text-red-600', label: 'PDF', labelBg: 'bg-red-50 text-red-600', Icon: FileText };
  if (['doc', 'docx'].includes(ext)) return { iconBg: 'bg-blue-100', iconColor: 'text-blue-600', label: 'DOC', labelBg: 'bg-blue-50 text-blue-600', Icon: FileText };
  if (['png', 'jpg', 'jpeg', 'webp'].includes(ext)) return { iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', label: ext.toUpperCase(), labelBg: 'bg-emerald-50 text-emerald-600', Icon: Image };
  return { iconBg: 'bg-gray-100', iconColor: 'text-gray-600', label: ext.toUpperCase() || 'FILE', labelBg: 'bg-gray-50 text-gray-600', Icon: FileText };
};

const DocumentsCard: React.FC<DocumentsCardProps> = ({
  title,
  files,
  onAddDocument,
  onDeleteDocument,
  isUploading = false,
}) => {

  const handleDownload = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {onAddDocument && (
          <Button
            variant="outline"
            size="default"
            onClick={onAddDocument}
            isLoading={isUploading}
            className="!py-2 !px-4 !text-xs"
          >
            <Upload className="h-3.5 w-3.5 mr-1.5" />
            Upload
          </Button>
        )}
      </div>

      {/* File List */}
      <div className="space-y-2.5">
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center rounded-xl">
            <div className="p-3 bg-gray-50 rounded-full mb-3">
              <FolderOpen className="h-6 w-6 text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-500">No Documents Available</p>
            <p className="text-xs text-gray-400 mt-1">Uploaded documents will be displayed here</p>
          </div>
        ) : (
          files.map((file, index) => {
            const { iconBg, iconColor,Icon } = getFileMeta(file.name);
            return (
              <div
                key={file._id || index}
                className="rounded-xl border border-gray-200 bg-white hover:shadow-sm transition-all overflow-hidden"
              >
                <div className="flex items-center gap-3 px-3.5 py-3">
                  {/* Icon */}
                  <div className={`p-2.5 rounded-xl flex-shrink-0 ${iconBg}`}>
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 overflow-hidden min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate" title={file.name}>
                      {file.name}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span className="text-xs font-medium">{file.date}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      onClick={() => handleDownload(file.fileUrl)}
                      aria-label={`Download ${file.name}`}
                      title="Download"
                    >
                      <Download size={16} />
                    </button>

                    {onDeleteDocument && file._id && (
                      <button
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        onClick={() => onDeleteDocument(file._id!)}
                        aria-label={`Delete ${file.name}`}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DocumentsCard;
