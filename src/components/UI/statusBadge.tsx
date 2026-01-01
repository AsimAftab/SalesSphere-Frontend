import React from 'react';

interface StatusBadgeProps {
  status: string;
  onClick?: () => void;
}

const statusConfig: Record<string, { bg: string; text: string; border: string }> = {
  approved: { bg: "bg-green-100", text: "text-green-700", border: "border-green-200" },
  rejected: { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" },
  pending: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, onClick }) => {
  const config = statusConfig[status.toLowerCase()] || statusConfig.pending;
  return (
    <button 
      onClick={onClick} 
      disabled={!onClick}
      className={`inline-flex items-center px-3 py-1 text-xs font-bold uppercase rounded-xl border transition-all ${config.bg} ${config.text} ${config.border} ${onClick ? 'hover:scale-105 active:scale-95' : ''}`}
    >
      {status}
    </button>
  );
};