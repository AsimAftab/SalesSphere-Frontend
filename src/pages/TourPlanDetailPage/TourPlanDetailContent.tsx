import React from 'react';
import { motion } from 'framer-motion';

import { type TourPlan } from "@/api/tourPlanService";
import { TourPlanDetailSkeleton } from './TourPlanDetailSkeleton';
import { type TourDetailPermissions } from './hooks/useTourPlanDetail';
import { formatDisplayDate } from '@/utils/dateUtils';
import { Button, StatusBadge, InfoBlock, EmptyState } from '@/components/ui';
import {
  ArrowLeft,
  BadgeCheck,
  Briefcase,
  Calendar,
  Clock,
  MapPin,
  MessageSquare,
  User,
} from 'lucide-react';

interface TourPlanDetailContentProps {
  tourPlan: TourPlan | null;
  loading: boolean;
  error: string | null;
  onEdit?: () => void;
  onDelete?: () => void;
  onBack?: () => void;
  permissions: TourDetailPermissions;
  onStatusUpdate?: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 },
};

const TourPlanDetailContent: React.FC<TourPlanDetailContentProps> = ({
  tourPlan, loading, error, onEdit, onDelete, onBack, permissions, onStatusUpdate
}) => {
  if (loading && !tourPlan) return <TourPlanDetailSkeleton permissions={permissions} />;
  if (error) return <EmptyState title="Error" description={error} variant="error" />;
  if (!tourPlan) return <EmptyState title="Plan Not Found" description="The tour plan you're looking for doesn't exist or has been deleted." />;

  return (
    <motion.div className="relative space-y-6" variants={containerVariants} initial="hidden" animate="show">

      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-black text-[#202224]">Tour Plan Details</h1>
        </div>
        <div className="flex flex-row gap-3">
          {permissions.canUpdate && onEdit && (
            <Button variant="secondary" onClick={onEdit} className="h-11 px-6 font-bold shadow-sm">Edit Tour Plan</Button>
          )}
          {permissions.canDelete && onDelete && (
            <Button variant="danger" onClick={onDelete} className="h-11 px-6 font-bold shadow-sm">Delete Tour Plan</Button>
          )}
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

        {/* Left Column: Tour Information */}
        <div className="lg:col-span-2 flex flex-col h-full">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-black text-black">Tour Information</h3>
              </div>
              <StatusBadge
                status={tourPlan.status}
                onClick={permissions.canApprove ? onStatusUpdate : undefined}
              />
            </div>

            <hr className="border-gray-200 -mx-8 mb-5" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5">
              <InfoBlock icon={MapPin} label="Place of Visit" value={tourPlan.placeOfVisit} />
              <InfoBlock icon={User} label="Created By" value={tourPlan.createdBy?.name} />
              <InfoBlock icon={Calendar} label="Start Date" value={tourPlan.startDate ? formatDisplayDate(tourPlan.startDate) : 'N/A'} />
              <InfoBlock icon={Calendar} label="End Date" value={tourPlan.endDate ? formatDisplayDate(tourPlan.endDate) : 'TBD'} />
              <InfoBlock icon={Clock} label="Duration" value={`${tourPlan.numberOfDays} Days`} />
              <InfoBlock icon={BadgeCheck} label="Reviewer" value={tourPlan.approvedBy?.name || 'Under Review'} />
            </div>

            <hr className="border-gray-200 -mx-8 mt-4 mb-4" />

            <div>
              <InfoBlock
                icon={MessageSquare}
                label="Purpose of Visit"
                value={tourPlan.purposeOfVisit || 'No specific purpose provided for this trip.'}
              />
            </div>
          </div>
        </div>

      </motion.div>
    </motion.div>
  );
};

export default TourPlanDetailContent;
