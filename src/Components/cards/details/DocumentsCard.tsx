import React from 'react';
import { FileText, Download } from 'lucide-react';

interface FileItem {
  name: string;
  size: string;
  date: string;
}

interface DocumentsCardProps {
  title: string;
  files: FileItem[];
}

const DocumentsCard: React.FC<DocumentsCardProps> = ({ title, files }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <ul className="space-y-3">
        {files.map((file) => (
          <li key={file.name} className="flex items-center p-3 bg-gray-50 rounded-md">
            <FileText className="h-6 w-6 text-red-500 flex-shrink-0" />
            <div className="ml-3 flex-1">
              <p className="text-sm font-semibold text-gray-800">{file.name}</p>
              <p className="text-xs text-gray-500">{`${file.size} - ${file.date}`}</p>
            </div>
            <button className="ml-4 p-1 text-gray-400 hover:text-blue-600">
              <Download size={18} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentsCard;