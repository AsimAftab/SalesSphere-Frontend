import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon, 
  MapPinIcon, 
  CalendarIcon, 
  UserIcon, 
  ClockIcon,
  BriefcaseIcon,
  CheckBadgeIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

import Button from '../../components/UI/Button/Button';
import { type TourPlan } from "../../api/tourPlanService";
import { TourPlanDetailSkeleton } from './TourPlanDetailSkeleton';

interface TourPlanDetailContentProps {
  tourPlan: TourPlan | null;
  loading: boolean;
  error: string | null;
  onEdit?: () => void;
  onDelete?: () => void;
  onBack?: () => void;
}

const STATUS_STYLES: Record<string, string> = {
  approved: 'bg-green-50 text-green-700 border-green-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  pending: 'bg-blue-50 text-blue-700 border-blue-200',
};

const InfoBlock: React.FC<{ icon: any; label: string; value: string | number }> = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
      <Icon className="h-5 w-5 text-gray-400" />
    </div>
    <div>
      <span className="font-medium text-gray-400 block text-xs uppercase tracking-wider mb-0.5">{label}</span>
      <span className="text-[#202224] font-bold text-sm">{value || 'N/A'}</span>
    </div>
  </div>
);

const TourPlanDetailContent: React.FC<TourPlanDetailContentProps> = ({ 
  tourPlan, loading, error, onEdit, onDelete, onBack 
}) => {
  if (loading && !tourPlan) return <TourPlanDetailSkeleton />;
  if (error) return <div className="text-center p-10 text-red-600 bg-red-50 rounded-2xl m-4 border border-red-100">{error}</div>;
  if (!tourPlan) return <div className="text-center p-10 text-gray-500 font-black uppercase tracking-widest">Plan Not Found</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="hover:text-blue-600 transition-colors">
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-black text-[#202224]">Tour Plan Details</h1>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onEdit} className="font-bold shadow-sm">Edit Tour Plan</Button>
          <Button variant="danger" onClick={onDelete} className="font-bold shadow-sm">Delete Tour Plan</Button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
              <BriefcaseIcon className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-black text-black">Tour Information</h3>
          </div>
          <span className={`px-4 py-1 text-sm font-black uppercase tracking-widest rounded-full border ${STATUS_STYLES[tourPlan.status.toLowerCase()]}`}>
            {tourPlan.status}
          </span>
        </div>

        <hr className="border-gray-100 -mx-8 mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <InfoBlock icon={MapPinIcon} label="Place of Visit" value={tourPlan.placeOfVisit} />
          <InfoBlock icon={UserIcon} label="Created By" value={tourPlan.createdBy?.name} />
          <InfoBlock icon={ClockIcon} label="Duration" value={`${tourPlan.numberOfDays} Days`} />
          <InfoBlock icon={CalendarIcon} label="Start Date" value={tourPlan.startDate} />
          <InfoBlock icon={CalendarIcon} label="End Date" value={tourPlan.endDate || 'TBD'} />
          <InfoBlock icon={CheckBadgeIcon} label="Reviewer" value={tourPlan.approvedBy?.name || 'Pending Review'} />
        </div>

        <div className="mt-10 pt-8 border-t border-gray-100">
          <h4 className="text-sm font-black text-gray-400 mb-4 flex items-center gap-2 tracking-wider">
            <ChatBubbleLeftRightIcon className="w-4 h-4" /> Purpose of Visit
          </h4>
          <p className="text-black font-bold text-sm leading-relaxed bg-gray-50 p-6 rounded-xl border border-gray-100">
            "{tourPlan.purposeOfVisit || 'No specific purpose provided for this trip.'}"
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default TourPlanDetailContent;