import React from 'react';

interface InfoBlockProps {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string | number | undefined | null | React.ReactNode;
    className?: string;
}

const InfoBlock: React.FC<InfoBlockProps> = ({ icon: Icon, label, value, className = "" }) => (
    <div className={`flex items-start gap-3 ${className}`}>
        <div className="p-2 bg-slate-100 rounded-lg border border-slate-200">
            <Icon className="h-5 w-5 text-slate-500" />
        </div>
        <div>
            <span className="font-semibold text-slate-500 block text-xs uppercase tracking-wider mb-0.5">
                {label}
            </span>
            <span className="text-[#202224] font-bold text-sm">
                {value || 'N/A'}
            </span>
        </div>
    </div>
);

export default InfoBlock;
