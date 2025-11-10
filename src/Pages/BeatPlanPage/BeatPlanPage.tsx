import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; 
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import Button from '../../components/UI/Button/Button';
import BeatPlanStatCard from '../../components/cards/BeatPlan_cards/BeatPlanStatCard';
import DatePicker from '../../components/UI/DatePicker/DatePicker';
import {
    getBeatPlanData,
    deleteBeatPlan,
    mockAllShops,
    type FullBeatPlanData
} from '../../api/beatPlanService';
import BeatPlanDetailsModal, { type BeatPlanDetail, type Shop } from '../../components/modals/BeatPlanDetailsModal';
import ConfirmationModal from '../../components/modals/DeleteEntityModal';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; 

import { Eye, ClipboardList, Route, Users, Store, Trash2, Loader2 } from 'lucide-react';
import { PencilSquareIcon } from '@heroicons/react/24/outline';


// --- Helper component ---
const StatusBadge = ({ status }: { status: 'active' | 'pending' }) => {
  const baseClasses = "px-3 py-1 text-xs font-medium rounded-full capitalize";
  const colorClasses = status === 'active'
    ? "bg-green-100 text-green-800"
    : "bg-yellow-100 text-yellow-800";

  return <span className={`${baseClasses} ${colorClasses}`}>{status}</span>;
};

// --- Animation Variants ---
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

// --- Skeleton Component ---
const BeatPlanSkeleton: React.FC = () => {
    return (
        <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
            <div className="p-6"> 
                {/* Header Skeleton */}
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">
                            <Skeleton width={200} height={36} />
                        </h1>
                        <p className="text-sm">
                            <Skeleton width={300} />
                        </p>
                    </div>
                    <div>
                        <Skeleton height={44} width={180} borderRadius={8} />
                    </div>
                </div>

                {/* Stat Cards Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} height={100} borderRadius={12} />
                    ))}
                </div>

                {/* Filter Controls Skeleton */}
                <div className="mb-4 p-4 bg-white rounded-lg flex flex-col sm:flex-row gap-4 items-center">
                    <div className="w-full sm:w-auto sm:max-w-xs">
                        <Skeleton height={60} borderRadius={8} />
                    </div>
                    <div className="w-full sm:w-auto sm:max-w-xs">
                        <Skeleton height={60} borderRadius={8} />
                    </div>
                    <div className="self-end sm:self-end pt-2 sm:pt-6 sm:ml-auto">
                        <Skeleton height={40} width={100} borderRadius={8} />
                    </div>
                </div>

                {/* Table Skeleton */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                    <Skeleton height={40} borderRadius={8} className="mb-2" /> {/* Table Head */}
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} height={50} borderRadius={4} className="mb-1" />
                    ))}
                </div>
            </div>
        </SkeletonTheme>
    );
};


const BeatPlanPage: React.FC = () => {
  // --- All state and logic ---
  const [data, setData] = useState<FullBeatPlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState<BeatPlanDetail | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<FullBeatPlanData['beatPlans'][number] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const [selectedDateFilter, setSelectedDateFilter] = useState<Date | null>(null);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'pending' | 'active' | 'completed'>('all');

  const fetchData = useCallback(async (isRefetch = false) => {
    if (!isRefetch) {
        setLoading(true);
    }
    setError(null);
    console.log(isRefetch ? "Refetching beat plan data..." : "Fetching beat plan data...");
    try {
      const result = await getBeatPlanData();
      setData(result);
      console.log("Beat plan data fetched successfully.");
    } catch (err) {
      setError("Failed to load Beat Plan data. Please try again later.");
      console.error(err);
    } finally {
      if (!isRefetch) {
          setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchData(false);
  }, [fetchData]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !loading) {
        console.log("Tab is visible again, refetching data...");
        fetchData(true); 
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchData, loading]);

  const filteredBeatPlans = useMemo(() => {
    if (!data?.beatPlans) return [];
    let plans = data.beatPlans;
    if (selectedStatusFilter !== 'all') {
        plans = plans.filter(plan => plan.status === selectedStatusFilter);
    }
    if (selectedDateFilter) {
        const filterDateString = selectedDateFilter.toLocaleDateString('en-CA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
        plans = plans.filter(plan => plan.dateAssigned === filterDateString);
    }
    return plans;
  }, [data, selectedDateFilter, selectedStatusFilter]);

  const totalItems = filteredBeatPlans.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  useEffect(() => {
      if (currentPage > totalPages && totalPages > 0) {
          setCurrentPage(totalPages);
      } else if (totalPages === 0 ) {
            setCurrentPage(1);
      } else if (currentPage === 0 && totalPages > 0) {
            setCurrentPage(1);
      }
  }, [totalPages, currentPage]);

  const handleViewDetails = (plan: FullBeatPlanData['beatPlans'][number]) => {
    let actualAssignedShops: Shop[] = [];
    if (plan.shopIds && plan.shopIds.length > 0 && mockAllShops) {
        actualAssignedShops = mockAllShops.filter(shop => plan.shopIds!.includes(shop.id));
    } else {
        console.warn(`Plan ${plan.id} has no shopIds or mockAllShops is not available.`);
    }
    const tempFullPlan = {
        ...plan,
        id: typeof plan.id === 'string' ? parseInt(plan.id, 10) : plan.id,
        routeSummary: { totalShops: actualAssignedShops.length },
        assignedShops: actualAssignedShops,
    };
    setSelectedPlanDetails(tempFullPlan as BeatPlanDetail);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlanDetails(null);
  };

  const handleDeleteClick = (plan: FullBeatPlanData['beatPlans'][number]) => {
    setPlanToDelete(plan);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (planToDelete) {
      try {
        setLoading(true); 
        await deleteBeatPlan(planToDelete.id);
        setIsDeleteModalOpen(false);
        setPlanToDelete(null);
        await fetchData(false); 
      } catch (err) {
        console.error("Failed to delete beat plan:", err);
        setError("Failed to delete beat plan. Please try again.");
        setIsDeleteModalOpen(false);
        setPlanToDelete(null);
        setLoading(false); 
      }
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setPlanToDelete(null);
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBeatPlans = filteredBeatPlans.slice(startIndex, endIndex);

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };
  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };

  // --- Render Logic ---
  if (loading && !data) {
    return <Sidebar><BeatPlanSkeleton /></Sidebar>;
  }

  if (error && !data) {
    return <Sidebar><div className="p-6 text-center text-red-600">{error}</div></Sidebar>;
  }

  const stats = data?.stats ?? { totalPlans: 0, activeRoutes: 0, assignedEmployees: 0, totalShops: 0 };

  return (
    <Sidebar>
      {/* --- Main Motion Container --- */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Item 1: Header */}
        <motion.div 
            className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6"
            variants={itemVariants}
        >
          <div>
            <h1 className="text-3xl font-bold text-black">Beat Plans</h1>
            <p className="text-sm text-gray-500">Manage all sales routes and assignments</p>
          </div>
          <div className="flex items-center gap-x-2">
            <Link to="/beat-plan/create">
              <Button>Create New Beat Plan</Button>
            </Link>
          </div>
        </motion.div>

        {/* Item 2: Stat Cards */}
        <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            variants={itemVariants}
        >
          <BeatPlanStatCard title="Total Beat Plans" value={stats.totalPlans} icon={<ClipboardList className="h-6 w-6 text-blue-600" />} iconBgColor="bg-blue-100" />
          <BeatPlanStatCard title="Active Routes" value={stats.activeRoutes} icon={<Route className="h-6 w-6 text-green-600" />} iconBgColor="bg-green-100" />
          <BeatPlanStatCard title="Assigned Employees" value={stats.assignedEmployees} icon={<Users className="h-6 w-6 text-purple-600" />} iconBgColor="bg-purple-100" />
          <BeatPlanStatCard title="Total Shops" value={stats.totalShops} icon={<Store className="h-6 w-6 text-orange-600" />} iconBgColor="bg-orange-100" />
        </motion.div>

        {/* Item 3: Filter Controls */}
        <motion.div 
            className="mb-4 p-4 bg-white rounded-lg flex flex-col sm:flex-row gap-4 items-center"
            variants={itemVariants}
        >
          <div className="w-full sm:w-auto sm:max-w-xs">
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
            <select
                id="statusFilter"
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value as 'all' | 'pending' | 'active' | 'completed')}
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
            </select>
          </div>
          <div className="w-full sm:w-auto sm:max-w-xs">
            <label htmlFor="dateFilter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Date Assigned</label>
            <DatePicker
                value={selectedDateFilter}
                onChange={setSelectedDateFilter}
                placeholder="Select Date"
                isClearable={true}
            />
          </div>
          <div className="self-end sm:self-end pt-2 sm:pt-6 sm:ml-auto">
            <Button
                variant="secondary"
                onClick={() => {
                    setSelectedStatusFilter('all');
                    setSelectedDateFilter(null);
                    setCurrentPage(1);
                }}
                disabled={selectedStatusFilter === 'all' && !selectedDateFilter}
            >
                Clear Filters
            </Button>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
            {error}
          </div>
        )}


        {/* Item 4: Beat Plans Table */}
        <motion.div 
            className="bg-white rounded-lg shadow-sm overflow-x-auto relative"
            variants={itemVariants}
        >
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          )}
          
          <table className="w-full">
            <thead className="bg-secondary text-white text-left text-sm">
              <tr>
                <th className="p-3 font-semibold">S.No</th>
                <th className="p-3 font-semibold">Employee Name</th>
                <th className="p-3 font-semibold">Beat Plan Name</th>
                <th className="p-3 font-semibold">Date Assigned</th>
                <th className="p-3 font-semibold">Details</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold rounded-tr-lg">Action</th>
              </tr>
            </thead>
            
            {/* TBODY (Product Page style) */}
            <tbody className="divide-y divide-gray-700">
              {!loading && filteredBeatPlans.length === 0 && (
                 <tr><td colSpan={7} className="text-center p-10 text-gray-500">No beat plans match the current filters.</td></tr>
              )}
              {currentBeatPlans.map((plan, index) => (
                  <tr key={plan.id} className="hover:bg-gray-200">
                    <td className="p-3 whitespace-nowrap text-black">{startIndex + index + 1}</td>
                    <td className="p-3 whitespace-nowrap text-black">
                        <div className="flex items-center space-x-3">
                        <img className="h-10 w-10 rounded-full object-cover" src={plan.employeeImageUrl} alt={plan.employeeName} />
                        <div>
                            <p className="font-semibold">{plan.employeeName}</p> 
                            <p className="text-xs text-gray-500">{plan.employeeRole}</p>
                        </div>
                        </div>
                    </td>
                    <td className="p-3 whitespace-nowrap text-black font-medium">{plan.planName}</td>
                    <td className="p-3 whitespace-nowrap text-black">{plan.dateAssigned}</td>
                    <td className="p-3 whitespace-nowrap text-black">
                        <button className="flex items-center text-gray-600 hover:text-blue-600 font-semibold text-xs transition duration-150" onClick={() => handleViewDetails(plan)}>
                            <Eye className="h-4 w-4 mr-1" /> View Details
                        </button>
                    </td>
                    <td className="p-3 whitespace-nowrap text-black"><StatusBadge status={plan.status} /></td>
                    <td className="p-3 whitespace-nowrap text-black">
                        <div className="flex items-center space-x-3">
                            <Link to={`/beat-plan/edit/${plan.id}`} className="text-blue-700 transition-colors" title="Edit Plan">
                                <PencilSquareIcon className="h-5 w-5" />
                            </Link>
                            <button onClick={() => handleDeleteClick(plan)} className="text-red-600 transition-colors" title="Delete Plan">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
        </motion.div>


        {/* Item 5: Pagination Footer */}
        <motion.div 
            className="flex justify-between items-center pt-4 text-sm text-gray-600"
            variants={itemVariants}
        >
          <p>
            {totalItems === 0 ? "Showing 0-0 of 0" : `Showing ${startIndex + 1}-${Math.min(endIndex, totalItems)} of ${totalItems}`}
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-x-2">
              {currentPage > 1 && (<Button variant="secondary" onClick={goToPreviousPage}>Previous</Button>)}
              {currentPage < totalPages && (<Button variant="secondary" onClick={goToNextPage}>Next</Button>)}
            </div>
          )}
        </motion.div>
        
      </motion.div> 


      {/* Modals */}
      <BeatPlanDetailsModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        plan={selectedPlanDetails}
      />
      <ConfirmationModal 
        isOpen={isDeleteModalOpen} 
        message={`Are you sure you want to delete the plan "${planToDelete?.planName}" for ${planToDelete?.employeeName}?`} 
        onConfirm={confirmDelete} 
        onCancel={cancelDelete}
      />
    </Sidebar>
  );
};

export default BeatPlanPage;



