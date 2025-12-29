import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import Button from "../../components/UI/Button/Button";
import BeatPlanStatCard from "../../components/cards/BeatPlan_cards/BeatPlanStatCard";
import DatePicker from "../../components/UI/DatePicker/DatePicker";

import {
  getBeatPlans,
  getBeatPlanAnalytics,
  getBeatPlanById,
  deleteBeatPlan,
  type GetBeatPlansOptions,
  type BeatPlan as BeatPlanType,
  type GetBeatPlanDataResponse,
} from "../../api/beatPlanService";
import BeatPlanDetailsModal, {
  type BeatPlanDetail,
} from "../../components/modals/BeatPlanDetailsModal";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  Eye,
  ClipboardList,
  Route,
  Users,
  Store,
  Trash2,
  Loader2,
} from "lucide-react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

// --- HELPERS & VARIANTS ---

const StatusBadge = ({
  status,
}: {
  status: "active" | "pending" | "completed";
}) => {
  const baseClasses =
    "px-3 py-1 text-xs font-medium rounded-full capitalize";
  const colorClasses =
    status === "active"
      ? "bg-green-100 text-green-800"
      : status === "pending"
      ? "bg-yellow-100 text-yellow-800"
      : "bg-blue-100 text-blue-800";

  return <span className={`${baseClasses} ${colorClasses}`}>{status}</span>;
};

const containerVariants = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const toLocalDateString = (date: string | Date) => {
  const d = new Date(date);
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
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
const BeatPlanSkeleton: React.FC = () => (
  <div className="p-6">
    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold">
          <Skeleton width={200} height={36} />
        </h1>
        <p className="text-sm">
          <Skeleton width={300} />
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Skeleton height={40} width={120} />
        <Skeleton height={40} width={120} />
        <Skeleton height={40} width={100} />
        <Skeleton height={44} width={180} />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} height={90} />
      ))}
    </div>

    <Skeleton height={40} className="mb-2" />
    {[...Array(5)].map((_, i) => (
      <Skeleton key={i} height={50} className="mb-1" />
    ))}
  </div>
);

// --- NEW COMPONENT: MOBILE CARD ---
// Used only on small screens
const BeatPlanMobileCard: React.FC<{
  plan: BeatPlanType;
  handleViewDetails: (id: string) => void;
  handleDeleteClick: (plan: BeatPlanType) => void;
  isLoadingDetail: boolean;
  deletePending: boolean;
}> = ({
  plan,
  handleViewDetails,
  handleDeleteClick,
  isLoadingDetail,
  deletePending,
}) => {
  const employee = plan.employees[0];
  const [avatarError, setAvatarError] = useState(false);

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-4">
      {/* Header: Employee Info & Status */}
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
        <StatusBadge status={plan.status} />
      </div>

      {/* Body: Key Details Grid */}
      <div className="bg-gray-50 rounded-lg p-3 grid grid-cols-2 gap-y-3 text-sm">
        <div className="col-span-2">
          <p className="text-xs text-gray-400 uppercase font-semibold">
            Beat Plan Name
          </p>
          <p className="font-medium text-gray-800">{plan.name}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase font-semibold">
            Date Assigned
          </p>
          <p className="font-medium text-gray-800">
            {new Date(plan.schedule.startDate).toISOString().split("T")[0]}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase font-semibold">
            Created By
          </p>
          <p className="font-medium text-gray-800">
            {plan.createdBy?.name || "N/A"}
          </p>
        </div>
      </div>

      {/* Footer: Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <button
          className="flex items-center text-secondary font-semibold text-sm"
          onClick={() => handleViewDetails(plan._id)}
          disabled={isLoadingDetail}
        >
          <Eye className="h-4 w-4 mr-1" /> View Details
        </button>

        <div className="flex items-center space-x-3">
          <Link
            to={`/beat-plan/edit/${plan._id}`}
            className="text-blue-700 p-2 bg-blue-50 rounded-full hover:bg-blue-100 transition"
          >
            <PencilSquareIcon className="h-5 w-5" />
          </Link>

          <button
            onClick={() => handleDeleteClick(plan)}
            className="text-red-600 p-2 bg-red-50 rounded-full hover:bg-red-100 transition"
            disabled={deletePending}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT: DESKTOP TABLE ROW ---
const BeatPlanRow: React.FC<{
  plan: BeatPlanType;
  index: number;
  currentPage: number;
  ITEMS_PER_PAGE: number;
  handleViewDetails: (id: string) => void;
  handleDeleteClick: (plan: BeatPlanType) => void;
  isLoadingDetail: boolean;
  deletePending: boolean;
}> = ({
  plan,
  index,
  currentPage,
  ITEMS_PER_PAGE,
  handleViewDetails,
  handleDeleteClick,
  isLoadingDetail,
  deletePending,
}) => {
  const employee = plan.employees[0];
  const [avatarError, setAvatarError] = useState(false);

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

      <td className="p-3 whitespace-nowrap text-gray-900 font-medium text-sm">
        {plan.name}
      </td>

      <td className="p-3 whitespace-nowrap text-gray-600 text-sm">
        {new Date(plan.schedule.startDate).toISOString().split("T")[0]}
      </td>

      <td className="p-3 whitespace-nowrap text-gray-600 text-sm">
        {plan.createdBy?.name || "N/A"}
      </td>

      <td className="p-3 whitespace-nowrap">
        <button
          className="flex items-center text-secondary font-semibold text-xs hover:text-blue-700 transition"
          onClick={() => handleViewDetails(plan._id)}
          disabled={isLoadingDetail}
        >
          <Eye className="h-4 w-4 mr-1" /> View Details
        </button>
      </td>

      <td className="p-3 whitespace-nowrap">
        <StatusBadge status={plan.status} />
      </td>

      <td className="p-3 whitespace-nowrap">
        <div className="flex items-center space-x-3">
          <Link
            to={`/beat-plan/edit/${plan._id}`}
            className="text-blue-700 hover:text-blue-900 transition"
          >
            <PencilSquareIcon className="h-5 w-5" />
          </Link>

          <button
            onClick={() => handleDeleteClick(plan)}
            className="text-red-600 hover:text-red-800 transition"
            disabled={deletePending}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

const BEAT_PLAN_KEYS = {
  all: ["beat-plans"] as const,
  list: (filters: GetBeatPlansOptions) =>
    [...BEAT_PLAN_KEYS.all, "list", filters] as const,
  detail: (id: string) => [...BEAT_PLAN_KEYS.all, "detail", id] as const,
  analytics: () => [...BEAT_PLAN_KEYS.all, "analytics"] as const,
};

// --- MAIN PAGE COMPONENT ---
const BeatPlanPage: React.FC = () => {
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [planIdToView, setPlanIdToView] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<BeatPlanType | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDateFilter, setSelectedDateFilter] = useState<Date | null>(
    null
  );
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<
    "all" | "pending" | "active" | "completed"
  >("all");

  const ITEMS_PER_PAGE = 10;

  const { data: analyticsData, error: analyticsError } = useQuery<
    GetBeatPlanDataResponse["data"],
    Error
  >({
    queryKey: BEAT_PLAN_KEYS.analytics(),
    queryFn: getBeatPlanAnalytics,
    staleTime: 5 * 60 * 1000,
  });

  const listQueryOptions: GetBeatPlansOptions = useMemo(
    () => ({
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      status: selectedStatusFilter === "all" ? undefined : selectedStatusFilter,
    }),
    [currentPage, selectedStatusFilter]
  );

  const {
    data: listResponse,
    isLoading: isLoadingList,
    error: listError,
    isFetching: isFetchingList,
  } = useQuery({
    queryKey: BEAT_PLAN_KEYS.list(listQueryOptions),
    queryFn: () => getBeatPlans(listQueryOptions),
    placeholderData: (prev) => prev,
  });

  const { data: detailedPlanData, isLoading: isLoadingDetail } = useQuery<
    BeatPlanType,
    Error
  >({
    queryKey: BEAT_PLAN_KEYS.detail(planIdToView || ""),
    queryFn: () => getBeatPlanById(planIdToView!),
    enabled: !!planIdToView,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBeatPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BEAT_PLAN_KEYS.list({}) });
      queryClient.invalidateQueries({ queryKey: BEAT_PLAN_KEYS.analytics() });
    },
  });

  const allBeatPlans = listResponse?.data || [];
  const totalItems = listResponse?.pagination.total || 0;
  const totalPages = listResponse?.pagination.pages || 1;

  const tableData = useMemo(() => {
    let plans = allBeatPlans;

    if (selectedDateFilter) {
      const filterDate = toLocalDateString(selectedDateFilter);
      plans = plans.filter((p) => {
        const planDate = toLocalDateString(p.schedule.startDate);
        return planDate === filterDate;
      });
    }

    return plans;
  }, [allBeatPlans, selectedDateFilter]);

  const getModalDetails = (plan: BeatPlanType): BeatPlanDetail => {
    // Combine all directories into one array
    const parties = plan.parties.map((p) => ({
      _id: p._id,
      name: p.partyName,
      ownerName: p.ownerName,
      type: "party" as const,
      location: { address: p.location.address },
    }));

    const sites = plan.sites.map((s) => ({
      _id: s._id,
      name: s.siteName,
      ownerName: s.ownerName,
      type: "site" as const,
      location: { address: s.location.address },
    }));

    const prospects = plan.prospects.map((pr) => ({
      _id: pr._id,
      name: pr.prospectName,
      ownerName: pr.ownerName,
      type: "prospect" as const,
      location: { address: pr.location.address },
    }));
    const allDirectories = [...parties, ...sites, ...prospects];

    return {
      id: plan._id,
      employeeName: plan.employees[0]?.name || "N/A",
      employeeRole: plan.employees[0]?.role || "N/A",
      employeeImageUrl: plan.employees[0]?.avatarUrl || "",
      planName: plan.name,
      dateAssigned: toLocalDateString(plan.schedule.startDate),
      status: plan.status,
      routeSummary: {
        totalDirectories: plan.progress.totalDirectories,
      },
      assignedDirectories: allDirectories,
    };
  };

  const handleViewDetails = (id: string) => {
    setPlanIdToView(id);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (plan: BeatPlanType) => {
    setPlanToDelete(plan);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (planToDelete) {
      await deleteMutation.mutateAsync(planToDelete._id);
      setIsDeleteModalOpen(false);
      setPlanToDelete(null);
    }
  };

  const isError = listError || analyticsError;

  if (isLoadingList && !listResponse) {
    return (
      <Sidebar>
        <BeatPlanSkeleton />
      </Sidebar>
    );
  }

  if (isError) {
    return (
      <Sidebar>
        <div className="p-6 text-center text-red-600">
          Error loading data.
        </div>
      </Sidebar>
    );
  }

  const stats = analyticsData || {
    totalParties: 0,
    totalBeatPlans: 0,
    activeBeatPlans: 0,
    assignedEmployeesCount: 0,
  };

  const modalPlan = detailedPlanData ? getModalDetails(detailedPlanData) : null;
  const isModalLoading = isLoadingDetail || deleteMutation.isPending;

  return (
    <Sidebar>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 flex flex-col overflow-hidden"
      >
        {/* Header Section */}
        <motion.div
          className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6"
          variants={itemVariants}
        >
          <div className="w-full flex flex-col gap-4">
            <div className="w-full flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
              {/* Title */}
              <div className="flex flex-col">
                <h1 className="text-3xl font-bold text-black">Beat Plans</h1>
                <p className="text-sm text-gray-500">
                  Manage all sales routes and assignments
                </p>
              </div>

              {/* Filters & Actions */}
              <div className="flex flex-col sm:flex-row md:flex-row lg:items-center gap-3 w-full lg:w-auto">
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => {
                    setSelectedStatusFilter(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full sm:w-40 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>

                <div className="w-full sm:w-48">
                  <DatePicker
                    value={selectedDateFilter}
                    onChange={setSelectedDateFilter}
                    placeholder="Select Date"
                    isClearable
                    className="w-full"
                  />
                </div>

                <Button
                  variant="secondary"
                  onClick={() => {
                    setSelectedStatusFilter("all");
                    setSelectedDateFilter(null);
                    setCurrentPage(1);
                  }}
                  className="w-full sm:w-auto"
                >
                  Clear Filters
                </Button>

                <Link to="/beat-plan/create" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto">
                    Create New Beat Plan
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={itemVariants}
        >
          <BeatPlanStatCard
            title="Total Parties"
            value={stats.totalParties}
            icon={<Store className="h-6 w-6 text-orange-600" />}
            iconBgColor="bg-orange-100"
          />
          <BeatPlanStatCard
            title="Total Beat Plans"
            value={stats.totalBeatPlans}
            icon={<ClipboardList className="h-6 w-6 text-blue-600" />}
            iconBgColor="bg-blue-100"
          />
          <BeatPlanStatCard
            title="Active Beat"
            value={stats.activeBeatPlans}
            icon={<Route className="h-6 w-6 text-green-600" />}
            iconBgColor="bg-green-100"
          />
          <BeatPlanStatCard
            title="Assigned Employees"
            value={stats.assignedEmployeesCount}
            icon={<Users className="h-6 w-6 text-purple-600" />}
            iconBgColor="bg-purple-100"
          />
        </motion.div>

        {/* DATA DISPLAY SECTION (Responsive Switch) */}
        <motion.div
          className="bg-transparent md:bg-white md:rounded-lg md:shadow-sm overflow-x-hidden relative"
          variants={itemVariants}
        >
          {(isFetchingList || deleteMutation.isPending) && (
            <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10 min-h-[200px] rounded-lg">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          )}

          {/* Empty State */}
          {tableData.length === 0 && !isFetchingList && (
            <div className="text-center p-10 text-gray-500 bg-white rounded-lg border border-gray-200">
              No beat plans found.
            </div>
          )}

          {/* --- MOBILE VIEW: CARDS --- */}
          <div className="md:hidden space-y-4">
            {tableData.map((plan) => (
              <BeatPlanMobileCard
                key={plan._id}
                plan={plan}
                handleViewDetails={handleViewDetails}
                handleDeleteClick={handleDeleteClick}
                isLoadingDetail={isLoadingDetail}
                deletePending={deleteMutation.isPending}
              />
            ))}
          </div>

          {/* --- DESKTOP VIEW: TABLE --- */}
          {/* ADD THIS CHECK: tableData.length > 0 && (...) */}
          {tableData.length > 0 && (
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-max table-auto">
                <thead className="bg-secondary text-white text-left text-sm">
                  <tr>
                    <th className="p-3 font-semibold">S.No</th>
                    <th className="p-3 font-semibold">Employee Name</th>
                    <th className="p-3 font-semibold">Beat Plan Name</th>
                    <th className="p-3 font-semibold">Date Assigned</th>
                    <th className="p-3 font-semibold">Created By</th>
                    <th className="p-3 font-semibold">View Details</th>
                    <th className="p-3 font-semibold">Status</th>
                    <th className="p-3 font-semibold rounded-tr-lg">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tableData.map((plan, index) => (
                    <BeatPlanRow
                      key={plan._id}
                      plan={plan}
                      index={index}
                      currentPage={currentPage}
                      ITEMS_PER_PAGE={ITEMS_PER_PAGE}
                      handleViewDetails={handleViewDetails}
                      handleDeleteClick={handleDeleteClick}
                      isLoadingDetail={isLoadingDetail}
                      deletePending={deleteMutation.isPending}
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

      {/* Modals */}
      <BeatPlanDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        plan={modalPlan}
        isLoading={isModalLoading}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        message={`Are you sure you want to delete the plan "${planToDelete?.name}"?`}
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        confirmButtonText="Delete"
        confirmButtonVariant="danger"
      />
    </Sidebar>
  );
};

export default BeatPlanPage;