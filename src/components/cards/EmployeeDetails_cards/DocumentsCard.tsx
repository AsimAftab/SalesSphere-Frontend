import React from 'react';
import { FileText, Download, Trash2, Plus } from 'lucide-react';

interface FileItem {
  _id?: string; // We need the ID to delete it
  name: string;
  date: string;
  fileUrl: string;
}

interface DocumentsCardProps {
  title: string;
  files: FileItem[];
  onAddDocument?: () => void;           // New Prop
  onDeleteDocument?: (docId: string) => void; // New Prop
}

const DocumentsCard: React.FC<DocumentsCardProps> = ({ 
  title, 
  files, 
  onAddDocument, 
  onDeleteDocument 
}) => {

  const handleDownload = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {/* Plus Button for Upload */}
        {onAddDocument && (
          <button 
            onClick={onAddDocument}
            className="p-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            title="Upload Document"
          >
            <Plus size={20} />
          </button>
        )}
      </div>

      <ul className="space-y-3">
        {files.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No documents uploaded.</p>
        ) : (
          files.map((file, index) => (
            <li key={file._id || index} className="flex items-center p-3 bg-gray-50 rounded-md group">
              <FileText className="h-6 w-6 text-red-500 flex-shrink-0" />
              
              <div className="ml-3 flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-gray-800 truncate" title={file.name}>
                    {file.name}
                </p>
                <p className="text-xs text-gray-500">{file.date}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                  onClick={() => handleDownload(file.fileUrl)}
                  aria-label={`Open ${file.name}`}
                  title="Download/View"
                >
                  <Download size={18} />
                </button>

                {/* Trash Button for Delete */}
                {onDeleteDocument && file._id && (
                  <button
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    onClick={() => onDeleteDocument(file._id!)}
                    aria-label={`Delete ${file.name}`}
                    title="Delete Document"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default DocumentsCard;