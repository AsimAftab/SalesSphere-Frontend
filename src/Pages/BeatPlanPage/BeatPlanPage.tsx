import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import Button from '../../components/UI/Button/Button';
import BeatPlanStatCard from '../../components/cards/BeatPlan_cards/BeatPlanStatCard';
import DatePicker from '../../components/UI/DatePicker/DatePicker'; // Import DatePicker
// Import necessary functions and types from the service
import {
    getBeatPlanData,
    deleteBeatPlan,
    mockAllShops, // Make sure this is exported from service
    type FullBeatPlanData
} from '../../api/beatPlanService';
import BeatPlanDetailsModal, { type BeatPlanDetail, type Shop } from '../../components/modals/BeatPlanDetailsModal';
import ConfirmationModal from '../../components/modals/DeleteEntityModal';
// --- MODIFIED: Added Loader2 ---
import { Eye, ClipboardList, Route, Users, Store, Trash2, Loader2 } from 'lucide-react';
import { PencilSquareIcon } from '@heroicons/react/24/outline';


// --- Helper component for the status badge in the table ---
const StatusBadge = ({ status }: { status: 'active' | 'pending' }) => {
  const baseClasses = "px-3 py-1 text-xs font-medium rounded-full capitalize";
  const colorClasses = status === 'active'
    ? "bg-green-100 text-green-800"
    : "bg-yellow-100 text-yellow-800";

  return <span className={`${baseClasses} ${colorClasses}`}>{status}</span>;
};


const BeatPlanPage: React.FC = () => {
  const [data, setData] = useState<FullBeatPlanData | null>(null);
  const [loading, setLoading] = useState(true); // Tracks initial load or manual refresh/refetch
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState<BeatPlanDetail | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<FullBeatPlanData['beatPlans'][number] | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // --- Filter States ---
  const [selectedDateFilter, setSelectedDateFilter] = useState<Date | null>(null);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'pending' | 'active' | 'completed'>('all');

  // --- Wrap fetchData in useCallback ---
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
  }, []); // Empty dependency array

  // --- Initial fetch on component mount ---
  useEffect(() => {
    fetchData(false);
  }, [fetchData]);

  // --- Effect for Refetching Data on Focus ---
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !loading) {
        console.log("Tab is visible again, refetching data...");
        fetchData(true); // Call with true for refetch
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchData, loading]); // Include loading
  // ---

   // --- Filtered Beat Plans Logic ---
   const filteredBeatPlans = useMemo(() => {
        if (!data?.beatPlans) return [];
        let plans = data.beatPlans;
        if (selectedStatusFilter !== 'all') {
            plans = plans.filter(plan => plan.status === selectedStatusFilter);
        }
        if (selectedDateFilter) {
            // Use en-CA for YYYY-MM-DD comparison matching the service format
            const filterDateString = selectedDateFilter.toLocaleDateString('en-CA', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            });
            plans = plans.filter(plan => plan.dateAssigned === filterDateString);
        }
        return plans;
    }, [data, selectedDateFilter, selectedStatusFilter]);
    // ---

  // --- Pagination Reset Effect ---
  const totalItems = filteredBeatPlans.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  useEffect(() => {
      if (currentPage > totalPages && totalPages > 0) {
          setCurrentPage(totalPages);
      // --- MODIFIED: Removed beatPlans.length check from here ---
      } else if (totalPages === 0 /* && (data?.beatPlans?.length ?? 0) > 0 */ ) {
           setCurrentPage(1); // Reset to 1 if no results after filtering
      } else if (currentPage === 0 && totalPages > 0) {
           setCurrentPage(1);
      }
  // --- MODIFIED: Removed beatPlans.length from dependency array ---
  }, [totalPages, currentPage]);
  // ---

  const handleViewDetails = (plan: FullBeatPlanData['beatPlans'][number]) => {
    let actualAssignedShops: Shop[] = [];
    if (plan.shopIds && plan.shopIds.length > 0 && mockAllShops) {
        actualAssignedShops = mockAllShops.filter(shop => plan.shopIds!.includes(shop.id));
    } else {
        console.warn(`Plan ${plan.id} has no shopIds or mockAllShops is not available.`);
    }

    const tempFullPlan = {
        ...plan,
        id: typeof plan.id === 'string' ? parseInt(plan.id, 10) : plan.id, // Adjust if modal expects number ID
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
        setLoading(true); // Indicate loading during delete/refetch
        await deleteBeatPlan(planToDelete.id);
        setIsDeleteModalOpen(false);
        setPlanToDelete(null);
        await fetchData(false); // Full refetch after delete
      } catch (err) {
        console.error("Failed to delete beat plan:", err);
        setError("Failed to delete beat plan. Please try again.");
        setIsDeleteModalOpen(false);
        setPlanToDelete(null);
        setLoading(false); // Stop loading on error
      }
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setPlanToDelete(null);
  };

  // --- Pagination Slice Logic ---
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
    return <Sidebar><div className="p-6 text-center">Loading Beat Plans...</div></Sidebar>;
  }
  if (error && !data) {
    return <Sidebar><div className="p-6 text-center text-red-600">{error}</div></Sidebar>;
  }

  const stats = data?.stats ?? { totalPlans: 0, activeRoutes: 0, assignedEmployees: 0, totalShops: 0 };

  return (
    <Sidebar>
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-black">Beat Plans</h1>
          <p className="text-sm text-gray-500">Manage all sales routes and assignments</p>
        </div>
        <div className="flex items-center gap-x-2">
            <Link to="/beat-plan/create">
                <Button>Create New Beat Plan</Button>
            </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <BeatPlanStatCard title="Total Beat Plans" value={stats.totalPlans} icon={<ClipboardList className="h-6 w-6 text-blue-600" />} iconBgColor="bg-blue-100" />
        <BeatPlanStatCard title="Active Routes" value={stats.activeRoutes} icon={<Route className="h-6 w-6 text-green-600" />} iconBgColor="bg-green-100" />
        <BeatPlanStatCard title="Assigned Employees" value={stats.assignedEmployees} icon={<Users className="h-6 w-6 text-purple-600" />} iconBgColor="bg-purple-100" />
        <BeatPlanStatCard title="Total Shops" value={stats.totalShops} icon={<Store className="h-6 w-6 text-orange-600" />} iconBgColor="bg-orange-100" />
      </div>

       {/* Filter Controls */}
       <div className="mb-4 p-4 bg-white rounded-lg flex flex-col sm:flex-row gap-4 items-center">
            <div className="w-full sm:w-auto sm:max-w-xs"> {/* Adjusted width */}
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
                    {/* <option value="completed">Completed</option> */}
                </select>
            </div>
            <div className="w-full sm:w-auto sm:max-w-xs"> {/* Adjusted width */}
                 <label htmlFor="dateFilter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Date Assigned</label>
                <DatePicker
                    value={selectedDateFilter}
                    onChange={setSelectedDateFilter}
                    placeholder="Select Date"
                    isClearable={true} // Assumes DatePicker component supports this
                />
            </div>
             <div className="self-end sm:self-end pt-2 sm:pt-6 sm:ml-auto"> {/* Adjusted alignment */}
                 <Button
                    variant="secondary"
                    onClick={() => {
                        setSelectedStatusFilter('all');
                        setSelectedDateFilter(null);
                        setCurrentPage(1); // Reset page when clearing filters
                    }}
                    disabled={selectedStatusFilter === 'all' && !selectedDateFilter}
                  >
                    Clear Filters
                  </Button>
             </div>
       </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
          {error}
        </div>
      )}

      {/* Beat Plans Table */}
      <div className="bg-white rounded-lg shadow-sm p-4 overflow-x-auto relative">
           {/* Overlay loading indicator */}
           {loading && (
               <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
                   <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
               </div>
           )}
          <table className="w-full text-sm text-left min-w-[700px]">
            <thead className="text-xs text-white uppercase bg-secondary">
              <tr>
                <th scope="col" className="px-6 py-4">S. No</th>
                <th scope="col" className="px-6 py-4">Employee Name</th>
                <th scope="col" className="px-6 py-4">Beat Plan Name</th>
                <th scope="col" className="px-6 py-4">Date Assigned</th>
                <th scope="col" className="px-6 py-4">Details</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Show 'No plans' only if not loading and filtered list is empty */}
              {!loading && filteredBeatPlans.length === 0 && (
                 <tr><td colSpan={7} className="text-center py-10 text-gray-500">No beat plans match the current filters.</td></tr>
              )}
              {/* Render plans */}
              {currentBeatPlans.map((plan, index) => (
                    <tr key={plan.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{startIndex + index + 1}</td>
                    <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                        <img className="h-10 w-10 rounded-full object-cover" src={plan.employeeImageUrl} alt={plan.employeeName} />
                        <div>
                            <p className="font-semibold">{plan.employeeName}</p>
                            <p className="text-xs text-gray-500">{plan.employeeRole}</p>
                        </div>
                        </div>
                    </td>
                    <td className="px-6 py-4">{plan.planName}</td>
                    <td className="px-6 py-4">{plan.dateAssigned}</td>
                    <td className="px-6 py-4">
                        <button className="flex items-center text-gray-600 hover:text-blue-600 font-semibold text-xs transition duration-150" onClick={() => handleViewDetails(plan)}>
                            <Eye className="h-4 w-4 mr-1" /> View Details
                        </button>
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={plan.status} /></td>
                    <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                            <Link to={`/beat-plan/edit/${plan.id}`} className="text-gray-500 hover:text-blue-600" title="Edit Plan">
                                <PencilSquareIcon className="h-5 w-5" />
                            </Link>
                            <button onClick={() => handleDeleteClick(plan)} className="text-gray-500 hover:text-red-600" title="Delete Plan">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </td>
                    </tr>
                ))
              }
            </tbody>
          </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex justify-between items-center pt-4 text-sm text-gray-600">
        <p>
          {totalItems === 0 ? "Showing 0-0 of 0" : `Showing ${startIndex + 1}-${Math.min(endIndex, totalItems)} of ${totalItems}`}
        </p>
        {totalPages > 1 && (
          <div className="flex items-center gap-x-2">
            {currentPage > 1 && (<Button variant="secondary" onClick={goToPreviousPage}>Previous</Button>)}
            {currentPage < totalPages && (<Button variant="secondary" onClick={goToNextPage}>Next</Button>)}
          </div>
        )}
      </div>

      {/* Details Modal */}
      <BeatPlanDetailsModal isOpen={isModalOpen} onClose={handleCloseModal} plan={selectedPlanDetails}/>

      {/* Confirmation Modal */}
      <ConfirmationModal isOpen={isDeleteModalOpen} message={`Are you sure you want to delete the plan "${planToDelete?.planName}" for ${planToDelete?.employeeName}?`} onConfirm={confirmDelete} onCancel={cancelDelete}/>

    </Sidebar>
  );
};

export default BeatPlanPage;