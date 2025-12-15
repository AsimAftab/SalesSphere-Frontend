// /src/Pages/MiscellaneousWorkPage/MiscellaneousWorkContent.tsx

import React, { useState } from "react";
import { motion } from "framer-motion";

import Button from "../../components/UI/Button/Button";
import DatePicker from "../../components/UI/DatePicker/DatePicker";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import {
  Loader2,
  Image,
  Tag,
  MapPin,
  User,
  Images, // Changed icon to represent multiple images
} from "lucide-react";

// Import types from the API service
import { type MiscWork as MiscWorkType } from "../../api/miscellaneousWorkService";

// --- TYPES FOR PROPS ---
interface MiscellaneousWorkContentProps {
  tableData: MiscWorkType[];
  isFetchingList: boolean;

  // Date Filter Props
  selectedDateFilter: Date | null;
  setSelectedDateFilter: (date: Date | null) => void;

  // Month & Year Filter Props
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  selectedYear: string;
  setSelectedYear: (year: string) => void;

  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  totalItems: number;
  ITEMS_PER_PAGE: number;
  
  // UPDATED: Accepts array of strings
  handleViewImage: (images: string[]) => void;
}

// --- HELPERS & VARIANTS ---

const containerVariants = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const AvatarFallback: React.FC<{ name: string }> = ({ name }) => {
  const letter = name?.trim()?.charAt(0)?.toUpperCase() || "?";

  return (
    <div
      className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 
                font-semibold flex items-center justify-center 
                border border-gray-300 shrink-0"
    >
      {letter}
    </div>
  );
};

// --- SKELETON COMPONENT ---
export const MiscWorkSkeleton: React.FC = () => (
  <div className="p-6">
    <div className="flex justify-between items-center gap-4 mb-6">
      <Skeleton width={200} height={36} />
      <div className="flex items-center gap-2">
        <Skeleton height={40} width={120} />
        <Skeleton height={40} width={120} />
        <Skeleton height={40} width={120} />
      </div>
    </div>
    <Skeleton height={40} className="mb-2" />
    {[...Array(5)].map((_, i) => (
      <Skeleton key={i} height={50} className="mb-1" />
    ))}
  </div>
);

// --- COMPONENT: MOBILE CARD ---
const MiscWorkMobileCard: React.FC<Pick<
  MiscellaneousWorkContentProps,
  'handleViewImage'
> & { work: MiscWorkType }> = ({
  work,
  handleViewImage,
}) => {
  const employee = work.employee;
  const [avatarError, setAvatarError] = useState(false);
  const hasImages = work.images && work.images.length > 0;

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-4">
      {/* Header: Employee Info */}
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          {employee?.avatarUrl && !avatarError ? (
            <img
              src={employee.avatarUrl}
              alt={employee.name}
              className="h-10 w-10 rounded-full object-cover border border-gray-300 shrink-0"
              onError={() => setAvatarError(true)}
            />
          ) : (
            <AvatarFallback name={employee?.name || "?"} />
          )}
          <div>
            <p className="font-semibold text-gray-900 text-sm">
              {employee?.name || "N/A"}
            </p>
            <p className="text-xs text-gray-500">{employee?.role || "N/A"}</p>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          {new Date(work.date).toLocaleDateString()}
        </p>
      </div>

      {/* Body: Key Details Grid */}
      <div className="bg-gray-50 rounded-lg p-3 grid grid-cols-1 gap-y-3 text-sm">
        <div>
          <p className="text-xs text-gray-400 uppercase font-semibold flex items-center">
            <Tag className="h-3 w-3 mr-1" /> Nature of Work
          </p>
          <p className="font-medium text-gray-800">{work.natureOfWork}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase font-semibold flex items-center">
            <MapPin className="h-3 w-3 mr-1" /> Address
          </p>
          <p className="font-medium text-gray-800">{work.address}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase font-semibold flex items-center">
            <User className="h-3 w-3 mr-1" /> Assigned By
          </p>
          <p className="font-medium text-gray-800">
            {work.assignedBy.name || "N/A"}
          </p>
        </div>
      </div>

      {/* Footer: Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <button
          className="flex items-center text-secondary font-semibold text-sm disabled:opacity-50 transition-opacity"
          onClick={() => handleViewImage(work.images)}
          disabled={!hasImages}
        >
          {hasImages && work.images.length > 1 ? (
             <><Images className="h-4 w-4 mr-1" /> View Images ({work.images.length})</>
          ) : (
             <><Image className="h-4 w-4 mr-1" /> View Image</>
          )}
        </button>
      </div>
    </div>
  );
};

// --- COMPONENT: DESKTOP TABLE ROW ---
const MiscWorkRow: React.FC<Pick<
  MiscellaneousWorkContentProps,
  'currentPage' | 'ITEMS_PER_PAGE' | 'handleViewImage'
> & { work: MiscWorkType; index: number }> = ({
  work,
  index,
  currentPage,
  ITEMS_PER_PAGE,
  handleViewImage,
}) => {
  const employee = work.employee;
  const [avatarError, setAvatarError] = useState(false);
  const hasImages = work.images && work.images.length > 0;

  return (
    <tr className="hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors">
      <td className="p-3 whitespace-nowrap text-gray-600">
        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
      </td>

      <td className="p-3 whitespace-nowrap text-gray-900">
        <div className="flex items-center space-x-3">
          {employee?.avatarUrl && !avatarError ? (
            <img
              src={employee.avatarUrl}
              alt={employee.name}
              className="h-10 w-10 rounded-full object-cover border border-gray-300"
              onError={() => setAvatarError(true)}
            />
          ) : (
            <AvatarFallback name={employee?.name || "?"} />
          )}
          <div>
            <p className="font-semibold text-sm">{employee?.name || "N/A"}</p>
            <p className="text-xs text-gray-500">{employee?.role || "N/A"}</p>
          </div>
        </div>
      </td>

      <td className="p-3 whitespace-normal text-gray-900 font-medium text-sm max-w-xs">
        {work.natureOfWork}
      </td>

      <td className="p-3 whitespace-normal text-gray-600 text-sm max-w-xs">
        {work.address}
      </td>

      <td className="p-3 whitespace-nowrap text-gray-600 text-sm">
        {work.assignedBy.name || "N/A"}
      </td>

      <td className="p-3 whitespace-nowrap">
        <button
          className="flex items-center text-secondary font-semibold text-xs hover:text-blue-700 transition disabled:opacity-50"
          onClick={() => handleViewImage(work.images)}
          disabled={!hasImages}
        >
          {hasImages && work.images.length > 1 ? (
             <><Images className="h-4 w-4 mr-1" /> View ({work.images.length})</>
          ) : (
             <><Image className="h-4 w-4 mr-1" /> View Image</>
          )}
        </button>
      </td>
    </tr>
  );
};


// --- CONTENT COMPONENT ---
const MiscellaneousWorkContent: React.FC<MiscellaneousWorkContentProps> = ({
  tableData,
  isFetchingList,
  selectedDateFilter,
  setSelectedDateFilter,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  currentPage,
  setCurrentPage,
  totalPages,
  totalItems,
  ITEMS_PER_PAGE,
  handleViewImage,
}) => {

  // Generate years for dropdown (e.g., last 5 years)
  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex-1 flex flex-col overflow-visible bg-gray-50"
    >
      {/* Header Section */}
      <motion.div
        className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 relative z-20"
        variants={itemVariants}
      >
        <div className="w-full flex flex-col gap-4">
          <div className="w-full flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            {/* Title */}
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold text-black">
                Miscellaneous Work
              </h1>
              <p className="text-sm text-gray-500">
                Track ad-hoc tasks and unplanned activities.
              </p>
            </div>

            {/* Filters & Actions */}
            <div className="flex flex-col sm:flex-row md:flex-row lg:items-center gap-3 w-full lg:w-auto">
              
              {/* Date Filter (Specific Date) */}
              <div className="w-full sm:w-40">
                <DatePicker
                  value={selectedDateFilter}
                  onChange={(date) => {
                    setSelectedDateFilter(date);
                    if (date) setSelectedMonth(""); // Clear month if specific date selected
                  }}
                  placeholder="Select Date"
                  isClearable
                  className="w-full"
                />
              </div>

              {/* Month Filter */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                      value={selectedMonth}
                      onChange={(e) => {
                          setSelectedMonth(e.target.value);
                          if(e.target.value) setSelectedDateFilter(null); 
                      }}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-[38px] bg-white w-full sm:w-32"
                  >
                      <option value="">Select Month</option>
                      {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(month => (
                          <option key={month} value={month}>{month}</option>
                      ))}
                  </select>
              </div>

              {/* Year Filter (Visible only if not filtering by specific date, generally useful with month) */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-[38px] bg-white w-full sm:w-24"
                      disabled={!!selectedDateFilter} 
                  >
                      {years.map(year => (
                          <option key={year} value={year}>{year}</option>
                      ))}
                  </select>
              </div>

              <Button
                variant="secondary"
                onClick={() => {
                  setSelectedDateFilter(null);
                  setSelectedMonth("");
                  setSelectedYear(new Date().getFullYear().toString());
                  setCurrentPage(1);
                }}
                className="w-full sm:w-auto"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* DATA DISPLAY SECTION */}
      <motion.div
        className="bg-transparent md:bg-white md:rounded-lg md:shadow-sm overflow-x-hidden relative"
        variants={itemVariants}
      >
        {(isFetchingList) && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 min-h-[200px] rounded-lg">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        )}

        {/* Empty State */}
        {tableData.length === 0 && !isFetchingList && (
          <div className="text-center p-10 text-gray-500 bg-white rounded-lg border border-gray-200">
            No miscellaneous work entries found.
          </div>
        )}

        {/* --- MOBILE VIEW: CARDS --- */}
        <div className="md:hidden space-y-4">
          {tableData.map((work) => (
            <MiscWorkMobileCard
              key={work._id}
              work={work}
              handleViewImage={handleViewImage}
            />
          ))}
        </div>

        {/* --- DESKTOP VIEW: TABLE --- */}
        {tableData.length > 0 && (
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-max table-auto">
              <thead className="bg-secondary text-white text-left text-sm">
                <tr>
                  <th className="p-3 font-semibold">S.No</th>
                  <th className="p-3 font-semibold">Employee Name</th>
                  <th className="p-3 font-semibold">Nature of Work</th>
                  <th className="p-3 font-semibold">Address</th>
                  <th className="p-3 font-semibold">Assigned By</th>
                  <th className="p-3 font-semibold rounded-tr-lg">Images</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tableData.map((work, index) => (
                  <MiscWorkRow
                    key={work._id}
                    work={work}
                    index={index}
                    currentPage={currentPage}
                    ITEMS_PER_PAGE={ITEMS_PER_PAGE}
                    handleViewImage={handleViewImage}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex-shrink-0 flex items-center justify-between mt-6 text-sm text-gray-600 pt-4 border-t border-gray-200">
          <p>
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} of{" "}
            {totalItems}
          </p>
          <div className="flex items-center gap-x-2">
            {currentPage > 1 && (
              <Button
                onClick={() => setCurrentPage(currentPage - 1)}
                variant="secondary"
              >
                Previous
              </Button>
            )}
            <span className="font-semibold px-2">
              {currentPage} / {totalPages}
            </span>
            {currentPage < totalPages && (
              <Button
                onClick={() => setCurrentPage(currentPage + 1)}
                variant="secondary"
              >
                Next
              </Button>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MiscellaneousWorkContent;