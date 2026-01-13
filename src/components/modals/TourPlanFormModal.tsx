import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2, MapPin, ClipboardList, AlertCircle, Info } from 'lucide-react';
import { z, type ZodIssue } from 'zod';
import Button from '../UI/Button/Button';
import DatePicker from '../UI/DatePicker/DatePicker';
import { type TourPlan, type CreateTourRequest } from '../../api/tourPlanService';

// 1. Validation Schema
const tourPlanSchema = z.object({
  placeOfVisit: z.string()
    .min(3, "Place of visit must be at least 3 characters")
    .max(100, "Place name is too long"),
  purposeOfVisit: z.string()
    .min(10, "Please provide a more detailed purpose (min 10 chars)")
    .max(500, "Purpose cannot exceed 500 characters"),

  startDate: z.date({
    invalid_type_error: "Please select a valid start date",
    required_error: "Start date is required",
  } as any),

  endDate: z.date({
    invalid_type_error: "Please select a valid end date",
    required_error: "End date is required",
  } as any),

}).refine((data) => {
  if (data.startDate && data.endDate) {
    return data.endDate >= data.startDate;
  }
  return true;
}, {
  message: "End date cannot be earlier than start date",
  path: ["endDate"],
});

type FormDataType = z.infer<typeof tourPlanSchema>;

interface TourPlanFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: CreateTourRequest) => Promise<void>;
  initialData?: TourPlan | null;
  isSaving: boolean;
}

const TourPlanFormModal: React.FC<TourPlanFormModalProps> = ({
  isOpen, onClose, onSave, initialData, isSaving
}) => {
  const [formData, setFormData] = useState<FormDataType>({
    placeOfVisit: '',
    purposeOfVisit: '',
    startDate: null as unknown as Date,
    endDate: null as unknown as Date,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          placeOfVisit: initialData.placeOfVisit || '',
          purposeOfVisit: initialData.purposeOfVisit || '',
          startDate: initialData.startDate ? new Date(initialData.startDate) : null as unknown as Date,
          endDate: initialData.endDate ? new Date(initialData.endDate) : null as unknown as Date,
        });
      } else {
        setFormData({
          placeOfVisit: '',
          purposeOfVisit: '',
          startDate: null as unknown as Date,
          endDate: null as unknown as Date
        });
      }
      setErrors({});
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // FIXED: Do not map null to undefined. Keep as null or Date so required_error triggers.
    const result = tourPlanSchema.safeParse(formData);

    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((issue: ZodIssue) => {
        const field = issue.path[0];
        if (typeof field === "string") {
          formattedErrors[field] = issue.message;
        }
      });
      setErrors(formattedErrors);
      return;
    }

    const normalizeDate = (d: Date | null | undefined) => {
      if (!d) return '';
      const copy = new Date(d);
      copy.setHours(12, 0, 0, 0);
      return copy.toISOString();
    };

    await onSave({
      ...result.data,
      startDate: normalizeDate(result.data.startDate),
      endDate: normalizeDate(result.data.endDate),
    });
  }


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[95vh]">

        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
              <MapPin className="text-secondary w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">
              {initialData ? 'Edit Tour Plan' : 'Create Tour Plan'}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-red-200 rounded-full transition-colors group">
            <X size={20} className="group-hover:rotate-90 transition-transform text-gray-500" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto custom-scrollbar flex-grow flex flex-col">
          <div className="p-6 space-y-6">

            {/* Destination */}
            <div className="relative">
              <label className="block text-xs font-bold text-gray-400 mb-1.5 ml-1 tracking-wider uppercase">Destination</label>
              <div className="relative">
                <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.placeOfVisit ? 'text-red-400' : 'text-gray-400'}`} size={16} />
                <input
                  className={`w-full pl-11 pr-4 py-2.5 border rounded-xl outline-none transition-all font-medium text-black ${errors.placeOfVisit ? 'border-red-300 ring-1 ring-red-100' : 'border-gray-200 focus:ring-2 focus:ring-secondary'}`}
                  value={formData.placeOfVisit}
                  onChange={(e) => setFormData({ ...formData, placeOfVisit: e.target.value })}
                  placeholder="e.g. Mumbai Regional Office"
                />
              </div>
              {errors.placeOfVisit && <p className="text-red-500 text-[10px] mt-1 ml-1 flex items-center gap-1 font-bold"><AlertCircle size={10} /> {errors.placeOfVisit}</p>}
            </div>

            {/* Start Date */}
            <div className="relative">
              <label className="block text-xs font-bold text-gray-400 mb-1.5 ml-1 tracking-wider uppercase">Start Date</label>
              <DatePicker
                value={formData.startDate}
                onChange={(date) => setFormData({ ...formData, startDate: date as Date })}
                placeholder="Select start date"
              />
              {/* ADDED: Required error message for Start Date */}
              {errors.startDate && <p className="text-red-500 text-[10px] mt-1 ml-1 flex items-center gap-1 font-bold"><AlertCircle size={10} /> {errors.startDate}</p>}
            </div>

            {/* End Date */}
            <div className="relative">
              <label className="block text-xs font-bold text-gray-400 mb-1.5 ml-1 tracking-wider uppercase">End Date</label>
              <DatePicker
                value={formData.endDate}
                onChange={(date) => setFormData({ ...formData, endDate: date as Date })}
                placeholder="Select end date"
              />
              {/* ADDED: Required error message for End Date */}
              {errors.endDate && <p className="text-red-500 text-[10px] mt-1 ml-1 flex items-center gap-1 font-bold"><AlertCircle size={10} /> {errors.endDate}</p>}
            </div>

            {/* Purpose */}
            <div className="relative">
              <div className="flex justify-between items-center mb-1.5 px-1">
                <label className="text-xs font-bold text-gray-400 tracking-wider uppercase">Purpose of Visit</label>
                <span className={`text-[10px] font-bold ${formData.purposeOfVisit.length > 450 ? 'text-red-500' : 'text-gray-400'}`}>
                  {formData.purposeOfVisit.length}/500
                </span>
              </div>
              <div className="relative">
                <ClipboardList className={`absolute left-4 top-4 ${errors.purposeOfVisit ? 'text-red-400' : 'text-gray-400'}`} size={18} />
                <textarea
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl outline-none shadow-sm resize-none transition-all font-medium text-black min-h-[140px] ${errors.purposeOfVisit ? 'border-red-300 ring-1 ring-red-100' : 'border-gray-200 focus:ring-2 focus:ring-secondary'}`}
                  rows={5}
                  value={formData.purposeOfVisit}
                  onChange={(e) => setFormData({ ...formData, purposeOfVisit: e.target.value })}
                  placeholder="Clearly state the business objective..."
                />
              </div>
              {errors.purposeOfVisit && <p className="text-red-500 text-[10px] mt-1 ml-1 flex items-center gap-1 font-bold"><AlertCircle size={10} /> {errors.purposeOfVisit}</p>}
            </div>

            {/* Info */}
            <div className="bg-blue-50/50 p-3 rounded-xl flex items-start gap-3 border border-blue-100/50">
              <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-blue-600 leading-relaxed font-medium">
                Tour plans require administrative review before approval.
              </p>
            </div>

          </div>

          {/* Footer */}
          <div className="p-4 flex gap-3 sticky bottom-0 bg-white flex-shrink-0 mt-auto border-t border-gray-100">
            <Button variant="ghost" type="button" onClick={onClose} className="flex-1 font-bold text-gray-400 hover:bg-gray-100">Cancel</Button>
            <Button type="submit" disabled={isSaving} className="flex-1 flex justify-center items-center gap-2 font-bold shadow-lg shadow-blue-200">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : initialData ? 'Update Tour Plan' : 'Create Tour Plan'}
            </Button>
          </div>
        </form>

      </motion.div>
    </div>
  );
};

export default TourPlanFormModal;