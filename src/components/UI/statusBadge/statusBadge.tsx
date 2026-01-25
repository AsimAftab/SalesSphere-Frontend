import React from 'react';

interface StatusBadgeProps {
  status: string;
  onClick?: () => void;
  disabled?: boolean;
}

const statusConfig: Record<string, { bg: string; text: string; border: string }> = {
  approved: { bg: "bg-green-100", text: "text-green-700", border: "border-green-200" },
  completed: { bg: "bg-green-100", text: "text-green-700", border: "border-green-200" },
  rejected: { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" },
  cancelled: { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" },
  pending: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" },
  'in progress': { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200" },
  'in transit': { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200" },
  active: { bg: "bg-green-100", text: "text-green-800", border: "border-green-200" }, // Added for BeatPlan
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, onClick, disabled }) => {
  const config = statusConfig[status.toLowerCase()] || { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200" };
  const isClickable = !!onClick && !disabled;

  return (
    <button
      onClick={isClickable ? onClick : undefined}
      disabled={!isClickable}
      className={`inline-flex items-center px-3 py-1 text-xs font-bold uppercase rounded-xl border transition-all ${config.bg} ${config.text} ${config.border} ${isClickable ? 'hover:scale-105 active:scale-95 cursor-pointer' : 'cursor-default'}`}
    >
      {status}
    </button>
  );
};