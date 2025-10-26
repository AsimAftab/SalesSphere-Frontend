import React from 'react';
import { FileText, Download } from 'lucide-react';

interface FileItem {
  name: string;
  date: string;
  // FIX 1: Add fileUrl which is necessary for downloading
  fileUrl: string; 
}

interface DocumentsCardProps {
  title: string;
  files: FileItem[];
}

const DocumentsCard: React.FC<DocumentsCardProps> = ({ title, files }) => {
  
  // FIX 2: Handler function to trigger download
  const handleDownload = (url: string, fileName: string) => {
    // Creating a temporary anchor tag to simulate a click and initiate download
    const link = document.createElement('a');
    link.href = url;
    // Setting the download attribute forces the browser to download the file 
    // instead of navigating to it, using the file's original name.
    link.setAttribute('download', fileName); 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <ul className="space-y-3">
        {files.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No documents uploaded.</p>
        ) : (
            files.map((file) => (
            <li key={file.name} className="flex items-center p-3 bg-gray-50 rounded-md">
                <FileText className="h-6 w-6 text-red-500 flex-shrink-0" />
                <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-gray-800">{file.name}</p>
                <p className="text-xs text-gray-500">{`${file.date}`}</p>
                </div>
                {/* FIX 3: Attach the handleDownload function to the button */}
                <button 
                className="ml-4 p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                onClick={() => handleDownload(file.fileUrl, file.name)}
                aria-label={`Download ${file.name}`}
                >
                <Download size={18} />
                </button>
            </li>
            ))
        )}
      </ul>
    </div>
  );
};

export default DocumentsCard;