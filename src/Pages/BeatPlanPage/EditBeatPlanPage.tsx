import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import Button from '../../components/UI/Button/Button';
import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  MapPinIcon,
  TrashIcon,
  ChevronDownIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import {
  Loader2,
  Store,
  Building,
} from 'lucide-react';
import DatePicker from '../../components/UI/DatePicker/DatePicker';

import {
  getSalespersons,
  getAvailableDirectories,
  getBeatPlanById, 
  updateBeatPlan, 
  type CreateBeatPlanPayload, 
  type BeatPlan as BeatPlanType, 
  type SimpleDirectory,
  type SimpleSalesperson,
  type GetAvailableDirectoriesResponse,
} from '../../api/beatPlanService';

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// --- UPDATED KEYS ---
const BEAT_PLAN_KEYS = {
  all: ['beat-plans'] as const,
  list: (filters: any) => [...BEAT_PLAN_KEYS.all, 'list', filters] as const,
  analytics: () => [...BEAT_PLAN_KEYS.all, 'analytics'] as const,
  salespersons: () => [...BEAT_PLAN_KEYS.all, 'salespersons'] as const,
  availableDirectories: () =>
    [...BEAT_PLAN_KEYS.all, 'available-directories'] as const,
  detail: (id: string) => [...BEAT_PLAN_KEYS.all, 'detail', id] as const, // Added
};

// --- TYPE DEFINITIONS ---
interface Directory {
  id: string;
  name: string;
  address: string;
  type: 'party' | 'site' | 'prospect';
}

interface Employee {
  id: string;
  name: string;
}

interface FormErrors {
  employee?: string;
  planName?: string;
  directories?: string;
  date?: string; // Added
}

type DirectoryFilter = 'all' | 'party' | 'site' | 'prospect';

// --- Animation/Skeleton ---
const containerVariants = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const EditBeatPlanSkeleton: React.FC = () => {
  // ... Skeleton component (no changes)
  return (
    <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
      <div className="p-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <Skeleton circle height={36} width={36} />
            <div>
              <Skeleton width={180} height={24} />
              <Skeleton width={220} height={16} />
            </div>
          </div>
          <Skeleton
            height={40}
            borderRadius={8}
            className="w-full sm:w-[130px]"
          />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1 Skeleton */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm space-y-6">
            <Skeleton width={150} height={20} />
            <div className="space-y-4">
              <div>
                <Skeleton height={40} borderRadius={8} />
              </div>
              <div>
                <Skeleton height={40} borderRadius={8} />
              </div>
              <div>
                <Skeleton height={40} borderRadius={8} />
              </div>
            </div>
            <div className="border-t pt-4">
              <Skeleton width={100} height={18} />
              <Skeleton width={180} height={16} className="mt-2" />
            </div>
          </div>
          {/* Column 2 & 3 Skeleton */}
          {[1, 2].map((i) => (
            <div
              key={i}
              className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm flex flex-col"
            >
              <Skeleton
                width={i === 1 ? 130 : 180}
                height={20}
                className="mb-4"
              />
              {i === 1 && (
                <Skeleton height={40} borderRadius={8} className="mb-4" />
              )}
              <div className="space-y-3 overflow-hidden lg:max-h-[55vh]">
                {[...Array(5)].map((_, j) => (
                  <Skeleton key={j} height={80} borderRadius={8} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SkeletonTheme>
  );
};

// --- Helper: Icon for Directory Card ---
const DirectoryIcon: React.FC<{ type: 'party' | 'site' | 'prospect' }> = ({
  type,
}) => {
  switch (type) {
    case 'party':
      return <Store className="h-4 w-4 text-blue-500" />;
    case 'site':
      return <Building className="h-4 w-4 text-orange-500" />;
    case 'prospect':
      return <Store className="h-4 w-4 text-green-500" />;
    default:
      return <MapPinIcon className="h-4 w-4 text-gray-400" />;
  }
};

// --- Helper component for filter buttons ---
const FilterButton: React.FC<{
  type: DirectoryFilter;
  current: DirectoryFilter;
  onClick: (type: DirectoryFilter) => void;
}> = ({ type, current, onClick }) => {
  const isActive = type === current;
  const baseStyle =
    'px-3 py-1 text-sm font-medium rounded-full cursor-pointer transition-colors capitalize';
  const activeStyle = 'bg-blue-600 text-white';
  const inactiveStyle = 'bg-gray-200 text-gray-700 hover:bg-gray-300';

  return (
    <button
      onClick={() => onClick(type)}
      className={`${baseStyle} ${isActive ? activeStyle : inactiveStyle}`}
    >
      {type}
    </button>
  );
};

const EditBeatPlanPage: React.FC = () => {
  // --- UPDATED: Setup for Edit Page ---
  const { planId } = useParams<{ planId: string }>();
  if (!planId) {
    return (
      <Sidebar>
        <div className="p-6 text-center text-red-600">
          Error: No Beat Plan ID provided.
        </div>
      </Sidebar>
    );
  }

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // --- Local State ---
  const [assignedDirectories, setAssignedDirectories] = useState<Directory[]>(
    [],
  );
  const [availableDirectories, setAvailableDirectories] = useState<Directory[]>(
    [],
  );
  const [directorySearchTerm, setDirectorySearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [planName, setPlanName] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // State for employee search
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState('');
  // State for directory filter
  const [directoryFilter, setDirectoryFilter] =
    useState<DirectoryFilter>('all');

  // Click outside hook
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setEmployeeSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  // --- 1. TANSTACK QUERY: Fetch Employees (Salespersons) ---
  const { data: employeesData, isLoading: isLoadingEmployees } = useQuery<
    SimpleSalesperson[],
    Error,
    Employee[]
  >({
    queryKey: BEAT_PLAN_KEYS.salespersons(),
    queryFn: () => getSalespersons(),
    staleTime: 1000 * 60 * 5,
    select: (data) => data.map((e) => ({ id: e._id, name: e.name })),
  });

  // --- 2. TANSTACK QUERY: Fetch Available Directories ---
  const { data: allDirectoriesData, isLoading: isLoadingDirectories } = useQuery<
    GetAvailableDirectoriesResponse['data'],
    Error,
    Directory[]
  >({
    queryKey: BEAT_PLAN_KEYS.availableDirectories(),
    queryFn: () => getAvailableDirectories(),
    staleTime: 1000 * 60 * 5,
    select: (data) =>
      data.all.map((d: SimpleDirectory) => ({
        id: d._id,
        name: d.name,
        address: d.location.address,
        type: d.type,
      })),
  });

  // --- 3. TANSTACK QUERY: Fetch This Beat Plan's Details ---
  const {
    data: planData,
    isLoading: isLoadingPlanDetails,
    error: planError,
  } = useQuery<BeatPlanType, Error>({
    queryKey: BEAT_PLAN_KEYS.detail(planId),
    queryFn: () => getBeatPlanById(planId),
  });

  // --- 4. TANSTACK QUERY: Update Beat Plan Mutation ---
  const updateMutation = useMutation<
    any,
    Error,
    { id: string; updateData: CreateBeatPlanPayload }
  >({
    mutationFn: updateBeatPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BEAT_PLAN_KEYS.all });
      navigate('/beat-plan');
    },
    onError: (error) => {
      console.error('Failed to update beat plan:', error);
      alert(
        `Update failed: ${
          error.message || 'An unknown error occurred while updating.'
        }`,
      );
    },
  });

  // --- EFFECT: Populate Form When All Data Loads ---
  useEffect(() => {
    if (planData && allDirectoriesData && employeesData) {
      // Set simple form fields
      setPlanName(planData.name);
      setSelectedEmployee(planData.employees[0]?._id || '');
      setSelectedDate(new Date(planData.schedule.startDate));

      // Create a Set of assigned IDs for easy lookup
      const assignedPartyIds = new Set(planData.parties.map((p) => p._id));
      const assignedSiteIds = new Set(planData.sites.map((s) => s._id));
      const assignedProspectIds = new Set(
        planData.prospects.map((p) => p._id),
      );
      const allAssignedIds = new Set([
        ...assignedPartyIds,
        ...assignedSiteIds,
        ...assignedProspectIds,
      ]);

      // Filter the master directory list into two groups
      const assigned: Directory[] = [];
      const available: Directory[] = [];

      allDirectoriesData.forEach((dir) => {
        if (allAssignedIds.has(dir.id)) {
          assigned.push(dir);
        } else {
          available.push(dir);
        }
      });

      setAssignedDirectories(assigned);
      setAvailableDirectories(available);
    }
  }, [planData, allDirectoriesData, employeesData]);

  const employees = employeesData || [];
  const isLoading =
    isLoadingEmployees || isLoadingDirectories || isLoadingPlanDetails;
  const isSaving = updateMutation.isPending;

  // --- Memoized list for filtering employees ---
  const filteredEmployees = useMemo(() => {
    if (!employeeSearchTerm) {
      return employees;
    }
    return employees.filter((emp) =>
      emp.name.toLowerCase().includes(employeeSearchTerm.toLowerCase()),
    );
  }, [employees, employeeSearchTerm]);

  // --- Memoized list for filtering directories ---
  const filteredAvailableDirectories = useMemo(() => {
    let filtered = availableDirectories;

    if (directoryFilter !== 'all') {
      filtered = filtered.filter((dir) => dir.type === directoryFilter);
    }

    if (directorySearchTerm) {
      const term = directorySearchTerm.toLowerCase();
      filtered = filtered.filter((dir) => {
        const nameMatch = (dir.name ?? '').toLowerCase().includes(term);
        const addressMatch = (dir.address ?? '').toLowerCase().includes(term);
        const typeMatch = (dir.type ?? '').toLowerCase().includes(term);
        return nameMatch || addressMatch || typeMatch;
      });
    }

    return filtered;
  }, [availableDirectories, directorySearchTerm, directoryFilter]);

  const addDirectoryToRoute = (dirToAdd: Directory) => {
    setAssignedDirectories((prev) => [...prev, dirToAdd]);
    setAvailableDirectories((prev) =>
      prev.filter((dir) => dir.id !== dirToAdd.id),
    );
    if (assignedDirectories.length === 0 && errors.directories) {
      setErrors((prev) => ({ ...prev, directories: undefined }));
    }
  };

  const removeDirectoryFromRoute = (dirToRemove: Directory) => {
    setAvailableDirectories((prev) =>
      [...prev, dirToRemove].sort((a, b) => a.name.localeCompare(b.name)),
    );
    setAssignedDirectories((prev) =>
      prev.filter((dir) => dir.id !== dirToRemove.id),
    );
  };

  // --- UPDATED: Validation function ---
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!selectedEmployee) {
      newErrors.employee = 'Please select an employee.';
    }
    if (!planName.trim()) {
      newErrors.planName = 'Please enter a beat plan name.';
    }
    if (!selectedDate) {
      newErrors.date = 'Please select an assignment date.';
    }
    if (assignedDirectories.length === 0) {
      newErrors.directories = 'Please assign at least one directory.';
    }
    return newErrors;
  };

  const handleSave = () => {
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      return;
    }

    const assignedDateString = selectedDate!.toLocaleDateString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const parties = assignedDirectories
      .filter((d) => d.type === 'party')
      .map((d) => d.id);
    const sites = assignedDirectories
      .filter((d) => d.type === 'site')
      .map((d) => d.id);
    const prospects = assignedDirectories
      .filter((d) => d.type === 'prospect')
      .map((d) => d.id);

    const payload: CreateBeatPlanPayload = {
      name: planName.trim(),
      employeeId: selectedEmployee,
      assignedDate: assignedDateString,
      parties: parties,
      sites: sites,
      prospects: prospects,
    };

    updateMutation.mutate({ id: planId, updateData: payload });
  };

  const selectedEmployeeName =
    employees.find((emp) => emp.id === selectedEmployee)?.name ||
    'Choose employee...';

  if (isLoading) {
    return (
      <Sidebar>
        <EditBeatPlanSkeleton />
      </Sidebar>
    );
  }

  if (planError) {
    return (
      <Sidebar>
        <div className="p-6 text-center text-red-600">
          Error loading plan data: {planError.message}
        </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4"
          variants={itemVariants}
        >
          <div className="flex items-center gap-4">
            <Link
              to="/beat-plan"
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Edit Beat Plan
              </h1>
              <p className="text-sm text-gray-500">
                Update and assign sales routes
              </p>
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full sm:w-auto"
          >
            {isSaving ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              'Update Beat Plan'
            )}
          </Button>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          variants={itemVariants}
        >
          {/* Column 1: Beat Plan Details */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm space-y-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Beat Plan Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Select Employee
                </label>
                {/* --- Employee Dropdown --- */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`flex justify-between items-center w-full p-2 border rounded-md shadow-sm bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${
                      errors.employee ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isSaving || isLoadingEmployees}
                  >
                    <span
                      className={
                        selectedEmployee ? 'text-gray-900' : 'text-gray-500'
                      }
                    >
                      {isLoadingEmployees
                        ? 'Loading employees...'
                        : selectedEmployeeName}
                    </span>
                    <ChevronDownIcon
                      className={`h-5 w-5 text-gray-400 transition-transform ${
                        isDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* --- UPDATED DROPDOWN PANEL --- */}
                  {isDropdownOpen && (
                    <motion.ul
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto flex flex-col"
                    >
                      {/* Search Bar */}
                      <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
                        <div className="relative">
                          <MagnifyingGlassIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                          <input
                            type="text"
                            placeholder="Search employee..."
                            className="w-full pl-8 pr-8 py-1.5 border border-gray-300 rounded-md text-sm "
                            value={employeeSearchTerm}
                            onChange={(e) =>
                              setEmployeeSearchTerm(e.target.value)
                            }
                            onClick={(e) => e.stopPropagation()}
                          />
                          {employeeSearchTerm && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEmployeeSearchTerm('');
                              }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              aria-label="Clear employee search"
                            >
                              <XCircleIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Scrollable List */}
                      <div className="overflow-y-auto">
                        <li
                          onClick={() => {
                            setSelectedEmployee('');
                            setIsDropdownOpen(false);
                            setEmployeeSearchTerm(''); 
                            if (errors.employee)
                              setErrors((prev) => ({
                                ...prev,
                                employee: undefined,
                              }));
                          }}
                          className="px-4 py-2 text-gray-500 cursor-pointer hover:bg-gray-100"
                        >
                          Choose employee...
                        </li>

                        {filteredEmployees.length > 0 ? (
                          filteredEmployees.map((emp) => (
                            <li
                              key={emp.id}
                              onClick={() => {
                                setSelectedEmployee(emp.id);
                                setIsDropdownOpen(false);
                                setEmployeeSearchTerm(''); 
                                if (errors.employee)
                                  setErrors((prev) => ({
                                    ...prev,
                                    employee: undefined,
                                  }));
                              }}
                              className="px-4 py-2 text-gray-900 cursor-pointer hover:bg-gray-100"
                            >
                              {emp.name}
                            </li>
                          ))
                        ) : (
                          <li className="px-4 py-2 text-gray-500 text-sm">
                            No employees found.
                          </li>
                        )}
                      </div>
                    </motion.ul>
                  )}
                </div>
                {errors.employee && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.employee}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Beat Plan Name
                </label>
                <input
                  type="text"
                  value={planName}
                  onChange={(e) => {
                    setPlanName(e.target.value);
                    if (errors.planName)
                      setErrors((prev) => ({ ...prev, planName: undefined }));
                  }}
                  placeholder="e.g., North Zone Route 1"
                  className={`block w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${
                    errors.planName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.planName && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.planName}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Date
                </label>
                <DatePicker
                  value={selectedDate}
                  onChange={(date) => {
                    setSelectedDate(date);
                    if (errors.date)
                      setErrors((prev) => ({ ...prev, date: undefined }));
                  }}
                  className={`block w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.date && (
                  <p className="mt-1 text-xs text-red-600">{errors.date}</p>
                )}
              </div>
            </div>
            <div className="border-t pt-4 space-y-2">
              <h3 className="text-md font-semibold text-gray-700">
                Route Summary
              </h3>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Directories:</span>
                <span className="font-medium">
                  {assignedDirectories.length}
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Available Directories */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm flex flex-col">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Available Directories ({filteredAvailableDirectories.length} Total)
            </h2>

            {/* --- ADDED: Filter Buttons --- */}
            <div className="flex flex-wrap gap-2 mb-4">
              <FilterButton
                type="all"
                current={directoryFilter}
                onClick={setDirectoryFilter}
              />
              <FilterButton
                type="party"
                current={directoryFilter}
                onClick={setDirectoryFilter}
              />
              <FilterButton
                type="site"
                current={directoryFilter}
                onClick={setDirectoryFilter}
              />
              <FilterButton
                type="prospect"
                current={directoryFilter}
                onClick={setDirectoryFilter}
              />
            </div>

            {/* --- Search Bar --- */}
            <div className="relative mb-4">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              {directorySearchTerm && (
                <button
                  type="button"
                  onClick={() => setDirectorySearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                  aria-label="Clear search"
                >
                  <XCircleIcon className="h-5 w-5" />
                </button>
              )}
              <input
                type="text"
                placeholder="Search Directories..."
                className="w-full pl-10 pr-10 p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                value={directorySearchTerm}
                onChange={(e) => setDirectorySearchTerm(e.target.value)}
              />
            </div>

            {/* --- Directory List --- */}
            <div className="space-y-3 overflow-y-auto pr-2 lg:max-h-[calc(55vh-80px)]">
              {isLoadingDirectories ? (
                <div className="text-center py-4 text-blue-500 text-sm flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading
                  Directories...
                </div>
              ) : filteredAvailableDirectories.length > 0 ? (
                filteredAvailableDirectories.map((dir) => (
                  <motion.div
                    key={dir.id}
                    className="p-3 border rounded-lg flex justify-between items-center hover:shadow-md transition-shadow cursor-default"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-3">
                      <DirectoryIcon type={dir.type} />
                      <div>
                        <p className="font-semibold">{dir.name}</p>
                        <p className="text-sm text-gray-500">{dir.address}</p>
                        <span
                          className={`text-xs capitalize font-medium mt-1 inline-block px-2 py-0.5 rounded ${
                            dir.type === 'party'
                              ? 'bg-blue-100 text-blue-700'
                              : dir.type === 'site'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {dir.type}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => addDirectoryToRoute(dir)}
                      className="p-1.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors flex-shrink-0"
                      aria-label={`Add ${dir.name}`}
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm">
                  {directorySearchTerm
                    ? 'No directories match your search.'
                    : 'No available directories.'}
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Assigned Route */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm flex flex-col">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              Assigned Route ({assignedDirectories.length} items)
            </h2>
            {errors.directories && (
              <p className="mb-3 text-xs text-red-600">
                {errors.directories}
              </p>
            )}
            <div className="space-y-3 overflow-y-auto pr-2 lg:max-h-[55vh]">
              {isLoadingPlanDetails ? (
                <div className="text-center py-4 text-blue-500 text-sm flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading
                  Route...
                </div>
              ) : assignedDirectories.length === 0 ? (
                <div
                  className={`text-center py-16 text-gray-500 border-2 rounded-lg flex flex-col items-center justify-center h-full ${
                    errors.directories
                      ? 'border-red-500 border-solid'
                      : 'border-dashed'
                  }`}
                >
                  <MapPinIcon className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p className="mt-1 text-sm font-semibold">
                    No directories assigned yet!
                  </p>
                  <p className="text-xs">Add items from the left</p>
                </div>
              ) : (
                assignedDirectories.map((dir, index) => (
                  <div
                    key={dir.id}
                    className="p-3 border rounded-lg flex justify-between items-center hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-blue-600 text-lg w-6 text-center">
                        {index + 1}
                      </span>
                      <DirectoryIcon type={dir.type} />
                      <div>
                        <p className="font-semibold">{dir.name}</p>
                        <p className="text-sm text-gray-500">{dir.address}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeDirectoryFromRoute(dir)}
                      className="p-1.5 text-red-600 hover:bg-red-100 rounded-full transition-colors flex-shrink-0"
                      aria-label={`Remove ${dir.name}`}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Sidebar>
  );
};

export default EditBeatPlanPage;