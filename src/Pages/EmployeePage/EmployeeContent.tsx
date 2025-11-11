import React, { useState, useMemo, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import EmployeeCard from '../../components/UI/ProfileCard';
import Button from '../../components/UI/Button/Button';
import {
  type Employee,
  addEmployee,
  uploadEmployeeDocuments,
} from '../../api/employeeService';
import AddEmployeeModal from '../../components/modals/AddEmployeeModal';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { EMPLOYEE_QUERY_KEY } from './EmployeesPage';

// --- ADDED: Framer Motion and Skeleton imports ---
import { motion } from 'framer-motion';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface EmployeeContentProps {
  data: Employee[] | null;
  loading: boolean;
  error: string | null;
}

// --- ADDED: Animation Variants (from PartyContent) ---
const containerVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

// --- ADDED: Skeleton Component (from PartyContent) ---
const EmployeeContentSkeleton: React.FC = () => {
  const ITEMS_PER_PAGE = 12;
  return (
    <SkeletonTheme baseColor="#e6e6e6" highlightColor="#f0f0f0">
      <div className="flex-1 flex flex-col h-full overflow-hidden overflow-x-hidden">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 flex-shrink-0">
          <h1 className="text-3xl font-bold">
            <Skeleton width={120} height={36} />
          </h1>
          <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
            <Skeleton height={40} width={256} borderRadius={999} /> {/* Search bar */}
            <Skeleton height={40} width={160} borderRadius={8} /> {/* Button */}
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-2 md:px-0">
            {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-start min-h-[180px]"
              >
                {/* Avatar */}
                <div className="mb-3 pt-2 flex justify-center w-full">
                  <Skeleton
                    containerClassName="w-full flex justify-center"
                    width={64}
                    height={64}
                    style={{ borderRadius: '50%', display: 'block' }}
                  />
                </div>

                {/* Text Details */}
                <div className="flex flex-col items-center w-full space-y-1 pb-2">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="w-full flex justify-center">
                      <Skeleton
                        containerClassName="w-full"
                        height={14}
                        style={{
                          display: 'block',
                          width: '100%',
                          borderRadius: '6px',
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Skeleton */}
        <div className="flex-shrink-0 flex items-center justify-between mt-6 text-sm pt-4 border-t border-gray-200">
          <Skeleton width={150} height={18} />
          <div className="flex items-center gap-x-2">
            <Skeleton width={80} height={36} borderRadius={8} />
            <Skeleton width={80} height={36} borderRadius={8} />
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

// -------------------- main component --------------------
const EmployeeContent: React.FC<EmployeeContentProps> = ({
  data,
  loading,
  error,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();
  const ITEMS_PER_PAGE = 12;

  const filteredEmployee = useMemo(() => {
    if (!data) return [];
    const lowerSearchTerm = searchTerm.toLowerCase();
    // Logic from original file (unchanged)
    return data.filter(
      (employee) =>
        employee.name.toLowerCase().includes(lowerSearchTerm) ||
        employee.role.toLowerCase().includes(lowerSearchTerm)
    );
  }, [data, searchTerm]);

  // --- ADDED: Reset page to 1 on search (moved from useMemo) ---
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // --- Logic from original file (unchanged) ---
  const addEmployeeMutation = useMutation({
    mutationFn: async ({
      userFormData,
      documentFiles,
    }: {
      userFormData: FormData;
      documentFiles: File[];
    }) => {
      const newEmployee = await addEmployee(userFormData);
      if (newEmployee && newEmployee._id && documentFiles.length > 0) {
        await uploadEmployeeDocuments(newEmployee._id, documentFiles);
      }
      return newEmployee;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EMPLOYEE_QUERY_KEY] });
      toast.success('Employee created successfully!');
      setIsModalOpen(false);
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : 'Failed to create employee'
      );
    },
  });

  // --- Logic from original file (unchanged) ---
  const handleAddEmployee = async (
    userFormData: FormData,
    documentFiles: File[]
  ) => {
    addEmployeeMutation.mutate({ userFormData, documentFiles });
  };

  const isCreating = addEmployeeMutation.isPending;

  // --- Pagination Logic (unchanged) ---
  const totalPages = Math.ceil(filteredEmployee.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentEmployee = filteredEmployee.slice(startIndex, endIndex);

  const goToPage = (pageNumber: number) => {
    const newPage = Math.max(1, Math.min(pageNumber, totalPages || 1));
    setCurrentPage(newPage);
  };

  // --- UPDATED: Skeleton Loading State (matches Party page behavior) ---
  if (loading && !data) {
    return <EmployeeContentSkeleton />;
  }

  // --- ADDED: Initial Error State (matches Party page behavior) ---
  if (error && !data)
    return (
      <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">
        {error}
      </div>
    );

  return (
    // --- UPDATED: Main container class to match PartyContent layout ---
    <motion.div
      className="flex-1 flex flex-col h-full overflow-hidden overflow-x-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* --- UPDATED: Overlays (matches PartyContent logic) --- */}
      {loading && data && (
        <div className="text-center p-2 text-sm text-blue-500">
          Refreshing...
        </div>
      )}
      {error && data && (
        <div className="text-center p-2 text-sm text-red-600 bg-red-50 rounded">
          {error}
        </div>
      )}

      {/* Mutation loading spinner (unchanged) */}
      {isCreating && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-[9999]">
          <div className="flex flex-col items-center bg-white px-8 py-6 rounded-lg shadow-lg">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="mt-3 text-gray-800 font-semibold">
              Creating employee...
            </span>
          </div>
        </div>
      )}

      {/* --- UPDATED: Header (added motion variants and flex-shrink-0) --- */}
      <motion.div
        className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 flex-shrink-0"
        variants={itemVariants}
      >
        <h1 className="text-3xl font-bold text-[#202224] text-center md:text-left">
          Employees
        </h1>
        <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
          <div className="relative">
            <MagnifyingGlassIcon className="pointer-events-none absolute inset-y-0 left-3 h-full w-5 text-gray-500" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Name or Role "
              className="block h-10 w-full md:w-64 border-transparent bg-gray-200 py-0 pl-10 pr-3 text-gray-900 placeholder:text-gray-500 focus:ring-0 sm:text-sm rounded-full"
            />
          </div>
          <div className="flex justify-center w-full md:w-auto">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="w-full md:w-auto"
            >
              Add New Employee
            </Button>
          </div>
        </div>
      </motion.div>

      {/* --- UPDATED: Content Area (matches PartyContent layout) --- */}
      <motion.div
        variants={itemVariants}
        className="flex-1 flex flex-col overflow-hidden"
      >
        {filteredEmployee.length === 0 && !loading ? (
          // --- UPDATED: "No results" text is now dynamic
          <div className="text-center p-10 text-gray-500">
            No employees found{searchTerm ? ' matching your search' : ''}.
          </div>
        ) : (
          <>
            {/* Scrolling Grid */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden pb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-2 md:px-0">
                {currentEmployee.map((employee) => (
                  <EmployeeCard
                    key={employee._id}
                    basePath="/employees"
                    id={employee._id}
                    title={employee.name}
                    imageUrl={
                      employee.avatarUrl ||
                      `https://placehold.co/150x150/e0e0e0/ffffff?text=${employee.name.charAt(
                        0
                      )}`
                    }
                    role={employee.role}
                    phone={employee.phone || 'N/A'}
                    cardType="employee"
                  />
                ))}
              </div>
            </div>

            {/* Fixed Pagination */}
            {totalPages > 1 && (
              <div className="flex-shrink-0 flex items-center justify-between mt-6 text-sm text-gray-600 pt-4 border-t border-gray-200">
                <p>
                  Showing {startIndex + 1} -{' '}
                  {Math.min(endIndex, filteredEmployee.length)} of{' '}
                  {filteredEmployee.length}
                </p>
                <div className="flex items-center gap-x-2">
                  {currentPage > 1 && (
                    <Button
                      onClick={() => goToPage(currentPage - 1)}
                      variant="secondary"
                    >
                      Previous
                    </Button>
                  )}
                  <span className="font-semibold">
                    {currentPage} / {totalPages}
                  </span>
                  {currentPage < totalPages && (
                    <Button
                      onClick={() => goToPage(currentPage + 1)}
                      variant="secondary"
                    >
                      Next
                    </Button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Modal (unchanged) */}
      <AddEmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddEmployee}
      />
    </motion.div>
  );
};

export default EmployeeContent;