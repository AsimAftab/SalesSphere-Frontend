// --------------------------------------------------------------------------------
// FINAL CreateBeatPlanPage.tsx 
// Uses TanStack Query, fully corrected for scrolling and search visibility.
// --------------------------------------------------------------------------------

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; 
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import Button from '../../components/UI/Button/Button';
import { ArrowLeftIcon, MagnifyingGlassIcon, PlusIcon, MapPinIcon, TrashIcon, ChevronDownIcon,XCircleIcon} from '@heroicons/react/24/outline';
import { Loader2 } from 'lucide-react';
import DatePicker from '../../components/UI/DatePicker/DatePicker';

// --- Imports from Service ---
import { 
    createBeatPlan, 
    getSalespersons, 
    getAvailableParties, 
    type CreateBeatPlanPayload as ServiceNewBeatPlanPayload,
    type SimpleParty,
    type SimpleSalesperson, 
} from '../../api/beatPlanService'; 

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// --- QUERY KEY FACTORY ---
const BEAT_PLAN_KEYS = {
    all: ['beat-plans'] as const,
    list: (filters: any) => [...BEAT_PLAN_KEYS.all, 'list', filters] as const, 
    analytics: () => [...BEAT_PLAN_KEYS.all, 'analytics'] as const, 
    salespersons: () => [...BEAT_PLAN_KEYS.all, 'salespersons'] as const,
    availableParties: () => [...BEAT_PLAN_KEYS.all, 'available-parties'] as const,
};


// --- TYPE DEFINITIONS ---
interface Shop {
    id: string; // MongoDB IDs are strings
    name: string; // Mapped from partyName
    address: string; // Mapped from location.address
    zone: string; // Placeholder or derived
}

interface Employee {
    id: string; // MongoDB IDs are strings
    name: string;
}

interface FormErrors {
    employee?: string;
    planName?: string;
    shops?: string;
}

// --- Animation/Skeleton ---
const containerVariants = { hidden: { opacity: 1 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const CreateBeatPlanSkeleton: React.FC = () => {
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
                    <Skeleton height={40} borderRadius={8} className="w-full sm:w-[130px]" />
                </div>

                {/* Grid Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Column 1 Skeleton */}
                    <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm space-y-6">
                        <Skeleton width={150} height={20} />
                        <div className="space-y-4">
                            <div> <Skeleton height={40} borderRadius={8} /> </div>
                            <div> <Skeleton height={40} borderRadius={8} /> </div>
                            <div> <Skeleton height={40} borderRadius={8} /> </div>
                        </div>
                        <div className="border-t pt-4">
                            <Skeleton width={100} height={18} />
                            <Skeleton width={180} height={16} className="mt-2" />
                        </div>
                    </div>
                    {/* Column 2 & 3 Skeleton */}
                    {[1, 2].map(i => (
                        <div key={i} className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm flex flex-col">
                            <Skeleton width={i === 1 ? 130 : 180} height={20} className="mb-4" />
                            {i === 1 && <Skeleton height={40} borderRadius={8} className="mb-4" />}
                            <div className="space-y-3 overflow-hidden lg:max-h-[55vh]">
                                {[...Array(5)].map((_, j) => ( <Skeleton key={j} height={80} borderRadius={8} /> ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </SkeletonTheme>
    );
};


const CreateBeatPlanPage: React.FC = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // --- Local State ---
    const [assignedRoute, setAssignedRoute] = useState<Shop[]>([]);
    const [shopSearchTerm, setShopSearchTerm] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState(''); 
    const [planName, setPlanName] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [errors, setErrors] = useState<FormErrors>({});

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);


    // --- 1. TANSTACK QUERY: Fetch Employees (Salespersons) ---
    const { data: employeesData, isLoading: isLoadingEmployees } = useQuery<SimpleSalesperson[], Error, Employee[]>({ 
        queryKey: BEAT_PLAN_KEYS.salespersons(),
        queryFn: () => getSalespersons(), 
        staleTime: 1000 * 60 * 5, 
        select: (data) => data.map(e => ({ id: e._id, name: e.name })), 
    });

    // --- 2. TANSTACK QUERY: Fetch Available Parties (Shops) ---
    const { data: allPartiesData, isLoading: isLoadingParties } = useQuery<SimpleParty[], Error, Shop[]>({
        queryKey: BEAT_PLAN_KEYS.availableParties(),
        queryFn: () => getAvailableParties(),
        staleTime: 1000 * 60 * 5, 
        select: (data) => data.map(p => ({
            id: p._id,
            name: p.partyName,
            address: p['location.address'],
            zone: 'N/A' 
        })),
    });

    // --- 3. TANSTACK QUERY: Create Beat Plan Mutation ---
    const createBeatPlanMutation = useMutation<any, Error, ServiceNewBeatPlanPayload>({
        mutationFn: createBeatPlan,
        onSuccess: () => {
            // Invalidate and refetch the main list page and analytics card data
            queryClient.invalidateQueries({ queryKey: BEAT_PLAN_KEYS.list({}) });
            queryClient.invalidateQueries({ queryKey: BEAT_PLAN_KEYS.analytics() });
            
            navigate('/beat-plan');
        },
        onError: (error) => {
            console.error("Failed to save beat plan:", error);
            alert(`Save failed: ${error.message || "An unknown error occurred while saving."}`);
        }
    });

    const employees = employeesData || [];
    const allShops = allPartiesData || [];
    const isLoadingData = isLoadingEmployees || isLoadingParties;
    const isSaving = createBeatPlanMutation.isPending;
    
    const [availableShops, setAvailableShops] = useState<Shop[]>([]);
    useEffect(() => {
        if (allShops.length > 0) {
            setAvailableShops(allShops);
        }
    }, [allShops]);


    const filteredAvailableShops = useMemo(() => 
    {
        if (!shopSearchTerm) 
        { return availableShops; }
        const term = shopSearchTerm.toLowerCase(); 

        return availableShops.filter(shop => {
            const nameMatch = (shop.name ?? '').toLowerCase().includes(term);
            const addressMatch = (shop.address ?? '').toLowerCase().includes(term);
            const zoneMatch = (shop.zone ?? '').toLowerCase().includes(term);

            return nameMatch || addressMatch || zoneMatch;
        });
    }, [availableShops, shopSearchTerm]);


    const addShopToRoute = (shopToAdd: Shop) => {
        setAssignedRoute(prev => [...prev, shopToAdd]);
        setAvailableShops(prev => prev.filter(shop => shop.id !== shopToAdd.id));
        if (assignedRoute.length === 0 && errors.shops) {
            setErrors(prev => ({ ...prev, shops: undefined }));
        }
    };

    const removeShopFromRoute = (shopToRemove: Shop) => {
  
        setAvailableShops(prev => [...prev, shopToRemove].sort((a, b) => a.name.localeCompare(b.name)));
        setAssignedRoute(prev => prev.filter(shop => shop.id !== shopToRemove.id));
    };

    const validateForm = (): FormErrors => {
        const newErrors: FormErrors = {};
        if (!selectedEmployee) {
            newErrors.employee = 'Please select an employee.';
        }
        if (!planName.trim()) {
            newErrors.planName = 'Please enter a beat plan name.';
        }
        if (assignedRoute.length === 0) {
            newErrors.shops = 'Please assign at least one Party.';
        }
        return newErrors;
    };

    const handleSave = () => {
        const formErrors = validateForm();
        setErrors(formErrors);

        if (Object.keys(formErrors).length > 0) {
            return;
        }
        
        const assignedDateString = selectedDate 
            ? selectedDate.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }) 
            : new Date().toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });

        const payload: ServiceNewBeatPlanPayload = {
            name: planName.trim(), 
            employeeId: selectedEmployee,
            assignedDate: assignedDateString, 
            parties: assignedRoute.map(shop => shop.id), 
        };
        
        // Trigger the mutation
        createBeatPlanMutation.mutate(payload);
    };

    const selectedEmployeeName = employees.find(emp => emp.id === selectedEmployee)?.name || "Choose employee...";

    if (isLoadingData) {
        return (
            <Sidebar>
                <CreateBeatPlanSkeleton />
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
                        <Link to="/beat-plan" className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Create Beat Plan</h1>
                            <p className="text-sm text-gray-500">Create and assign sales routes</p>
                        </div>
                    </div>
                    <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto">
                        {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Save Beat Plan'}
                    </Button>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                    variants={itemVariants}
                >

                    {/* Column 1: Beat Plan Details */}
                    <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm space-y-6">
                        <h2 className="text-lg font-semibold text-gray-800">Beat Plan Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Select Employee</label>
                                {/* --- Employee Dropdown --- */}
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        type="button"
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className={`flex justify-between items-center w-full p-2 border rounded-md shadow-sm bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${errors.employee ? 'border-red-500' : 'border-gray-300'}`}
                                        disabled={isSaving || isLoadingEmployees}
                                    >
                                        <span className={selectedEmployee ? 'text-gray-900' : 'text-gray-500'}>
                                            {isLoadingEmployees ? "Loading employees..." : selectedEmployeeName}
                                        </span>
                                        <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isDropdownOpen && (
                                        <motion.ul
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
                                        >
                                            <li
                                                onClick={() => {
                                                    setSelectedEmployee("");
                                                    setIsDropdownOpen(false);
                                                    if (errors.employee) setErrors(prev => ({ ...prev, employee: undefined }));
                                                }}
                                                className="px-4 py-2 text-gray-500 cursor-pointer hover:bg-gray-100"
                                            >
                                                Choose employee...
                                            </li>
                                            {employees.map(emp => (
                                                <li
                                                    key={emp.id}
                                                    onClick={() => {
                                                        setSelectedEmployee(emp.id); 
                                                        setIsDropdownOpen(false);
                                                        if (errors.employee) setErrors(prev => ({ ...prev, employee: undefined }));
                                                    }}
                                                    className="px-4 py-2 text-gray-900 cursor-pointer hover:bg-gray-100"
                                                >
                                                    {emp.name}
                                                </li>
                                            ))}
                                        </motion.ul>
                                    )}
                                </div>
                                {errors.employee && <p className="mt-1 text-xs text-red-600">{errors.employee}</p>}
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Beat Plan Name</label>
                                <input
                                    type="text"
                                    value={planName}
                                    onChange={(e) => {
                                        setPlanName(e.target.value);
                                        if (errors.planName) setErrors(prev => ({ ...prev, planName: undefined }));
                                    }}
                                    placeholder="e.g., North Zone Route 1"
                                    className={`block w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${errors.planName ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.planName && <p className="mt-1 text-xs text-red-600">{errors.planName}</p>}
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Date</label>
                                <DatePicker
                                    value={selectedDate}
                                    onChange={setSelectedDate}
                                    className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                                />
                            </div>
                        </div>
                        <div className="border-t pt-4 space-y-2">
                            <h3 className="text-md font-semibold text-gray-700">Route Summary</h3>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Total Parties:</span>
                                <span className="font-medium">{assignedRoute.length}</span>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Available Shops (Fully Scrollable) */}
                    <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm flex flex-col">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Available Parties ({filteredAvailableShops.length} Total)
                        </h2>
                        <div className="relative mb-4">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                            {shopSearchTerm && (
                                <button
                                    type="button"
                                    onClick={() => setShopSearchTerm('')} // <-- Clears the state
                                    className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                                    aria-label="Clear search"
                                >
                                    <XCircleIcon className="h-5 w-5" /> {/* <-- The X Icon */}
                                </button>
                            )}
                            <input
                                type="text"
                                placeholder="Search Party..."
                                className="w-full pl-10 p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                                value={shopSearchTerm}
                                onChange={(e) => setShopSearchTerm(e.target.value)}
                            />
                        </div>
                        {/* FIX: Removed redundant scroll limit logic, relies on CSS max-h */}
                        <div className="space-y-3 overflow-y-auto pr-2 lg:max-h-[calc(55vh-40px)]">
                            {/* Loading State for Shops */}
                            {isLoadingParties ? (
                                <div className="text-center py-4 text-blue-500 text-sm flex items-center justify-center">
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading Parties...
                                </div>
                            ) : filteredAvailableShops.length > 0 ? (
                                filteredAvailableShops.map(shop => (
                                    <motion.div 
                                        key={shop.id} 
                                        className="p-3 border rounded-lg flex justify-between items-center hover:shadow-md transition-shadow cursor-default"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div>
                                            <p className="font-semibold">{shop.name}</p>
                                            <p className="text-sm text-gray-500">{shop.address}</p>
                                            <span className="text-xs text-gray-400 mt-1 block">{shop.zone}</span>
                                        </div>
                                        <button onClick={() => addShopToRoute(shop)} className="p-1.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors flex-shrink-0" aria-label={`Add ${shop.name}`}>
                                            <PlusIcon className="h-4 w-4" />
                                        </button>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-4 text-gray-500 text-sm">
                                    {shopSearchTerm ? 'No Parties match your search.' : 'No available Parties.'}
                                </div>
                            )}
                        </div>
                    </div>

            
                    <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm flex flex-col">
                        <h2 className="text-lg font-semibold text-gray-800 mb-1">
                            Assigned Route ({assignedRoute.length} shops)
                        </h2>
                        {errors.shops && <p className="mb-3 text-xs text-red-600">{errors.shops}</p>}
                        <div className="space-y-3 overflow-y-auto pr-2 lg:max-h-[55vh]">
                            {assignedRoute.length === 0 ? (
                                <div className={`text-center py-16 text-gray-500 border-2 rounded-lg flex flex-col items-center justify-center h-full ${errors.shops ? 'border-red-500 border-solid' : 'border-dashed'}`}>
                                    <MapPinIcon className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                                    <p className="mt-1 text-sm font-semibold">No Parties assigned yet!</p>
                                    <p className="text-xs">Add Parties from the left</p>
                                </div>
                            ) : (
                                assignedRoute.map((shop, index) => (
                                    <div key={shop.id} className="p-3 border rounded-lg flex justify-between items-center hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-blue-600 text-lg w-6 text-center">{index + 1}</span>
                                            <div>
                                                <p className="font-semibold">{shop.name}</p>
                                                <p className="text-sm text-gray-500">{shop.address}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => removeShopFromRoute(shop)} className="p-1.5 text-red-600 hover:bg-red-100 rounded-full transition-colors flex-shrink-0" aria-label={`Remove ${shop.name}`}>
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

export default CreateBeatPlanPage;