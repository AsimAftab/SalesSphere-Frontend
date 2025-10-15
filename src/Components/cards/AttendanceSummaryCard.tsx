import React from 'react';
import { type AttendanceSummary } from '../../api/dashboardService';

// --- ADDED: Interface to define the component's props ---
interface AttendanceSummaryCardProps {
  data: AttendanceSummary;
}

const AttendanceSummaryCard: React.FC<AttendanceSummaryCardProps> = ({ data }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm h-full">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance Summary</h3>
    <div className="space-y-3">
      <div className="flex justify-between text-sm"><span className="text-gray-600">Team Strength</span><span className="font-semibold text-gray-800">{data.teamStrength}</span></div>
      <div className="flex justify-between text-sm"><span className="text-green-500">Present</span><span className="font-semibold text-green-500">{data.present}</span></div>
      <div className="flex justify-between text-sm"><span className="text-red-500">Absent</span><span className="font-semibold text-red-500">{data.absent}</span></div>
      <div className="flex justify-between text-sm"><span className="text-yellow-500">On Leave</span><span className="font-semibold text-yellow-500">{data.onLeave}</span></div>
      <div className="pt-2">
        <div className="flex justify-between mb-1"><span className="text-sm font-medium text-gray-700">Attendance Rate</span><span className="text-sm font-medium text-gray-700">{data.attendanceRate}%</span></div>
        <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{ width: `${data.attendanceRate}%` }}></div></div>
      </div>
    </div>
  </div>
);

export default AttendanceSummaryCard;
