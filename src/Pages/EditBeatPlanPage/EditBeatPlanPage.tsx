import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import Button from '../../components/UI/Button/Button';
import { ArrowLeftIcon, MagnifyingGlassIcon, PlusIcon, MapPinIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Loader2 } from 'lucide-react';
import DatePicker from '../../components/UI/DatePicker/DatePicker';
import {
  getBeatPlanEmployees,
  getBeatPlanDetails,
  updateBeatPlan,
  getAssignedShopsForPlan,
  mockAllShops, // Make sure this is exported from service
  type UpdateBeatPlanPayload,
  type Shop
} from '../../api/beatPlanService';

// --- Employee type ---
interface Employee {
  id: number;
  name: string;
}

// --- ADDED: Form Error types ---
interface FormErrors {
  employee?: string;
  planName?: string;
  shops?: string;
}
// ---

// --- EDIT BEAT PLAN PAGE COMPONENT ---
export const EditBeatPlanPage: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();

  const [isLoadingPlan, setIsLoadingPlan] = useState(true);
  const [isLoadingShops, setIsLoadingShops] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [availableShops, setAvailableShops] = useState<Shop[]>([]);
  const [assignedRoute, setAssignedRoute] = useState<Shop[]>([]);
  const [shopSearchTerm, setShopSearchTerm] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [planName, setPlanName] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // --- ADDED: State for errors ---
  const [errors, setErrors] = useState<FormErrors>({});
  // ---

  // --- Fetch employees ---
  useEffect(() => {
    const fetchEmployees = async () => {
      // ... fetch logic ...
       try {
        const emps = await getBeatPlanEmployees();
        setEmployees(emps);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  // --- Fetch existing Beat Plan details AND Assigned Shops ---
  useEffect(() => {
    if (!planId) {
      setFetchError("Beat Plan ID not found in URL.");
      setIsLoadingPlan(false);
      setIsLoadingShops(false);
      return;
    }

    const fetchPlanData = async () => {
       // ... fetch logic ...
      setIsLoadingPlan(true);
      setIsLoadingShops(true);
      setFetchError(null);
      try {
        const planDataPromise = getBeatPlanDetails(planId);
        const assignedShopsPromise = getAssignedShopsForPlan(planId);
        const [planData, assignedShopsData] = await Promise.all([planDataPromise, assignedShopsPromise]);

        if (planData) {
          setSelectedEmployee(String(planData.employeeId) || '');
          setPlanName(planData.planName);
          const assignedDate = new Date(planData.dateAssigned);
          setSelectedDate(isNaN(assignedDate.getTime()) ? null : assignedDate);
          setIsLoadingPlan(false); // Stop main loading

          try {
            // Already fetched above with Promise.all
            // const assignedShopsData = await getAssignedShopsForPlan(planId);
            setAssignedRoute(assignedShopsData);
            const assignedShopIds = new Set(assignedShopsData.map(s => s.id));
            setAvailableShops(mockAllShops ? mockAllShops.filter(s => !assignedShopIds.has(s.id)) : []);
          } catch (shopError) {
             console.error("Failed to fetch assigned shops:", shopError);
             setFetchError("Failed to load assigned shops for the plan.");
          } finally {
             setIsLoadingShops(false); // Stop shop loading
          }
        } else {
          setFetchError(`Beat Plan with ID ${planId} not found.`);
          setIsLoadingPlan(false);
          setIsLoadingShops(false);
        }
      } catch (error) {
         console.error("Failed to fetch beat plan details:", error);
         setFetchError("Failed to load beat plan details. Please try again.");
         setIsLoadingPlan(false);
         setIsLoadingShops(false);
      }
    };

    fetchPlanData();
  }, [planId]);

  // Memoized filtering for available shops
  const filteredAvailableShops = useMemo(() => {
    if (!shopSearchTerm) { return availableShops; }
    return availableShops.filter(shop =>
      shop.name.toLowerCase().includes(shopSearchTerm.toLowerCase()) ||
      shop.address.toLowerCase().includes(shopSearchTerm.toLowerCase()) ||
      shop.zone.toLowerCase().includes(shopSearchTerm.toLowerCase())
    );
  }, [availableShops, shopSearchTerm]);

  // Shop management functions
  const addShopToRoute = (shopToAdd: Shop) => {
    setAssignedRoute(prev => [...prev, shopToAdd]);
    setAvailableShops(prev => prev.filter(shop => shop.id !== shopToAdd.id));
     // Clear shops error if adding the first shop
    if (assignedRoute.length === 0 && errors.shops) {
        setErrors(prev => ({ ...prev, shops: undefined }));
    }
  };

  const removeShopFromRoute = (shopToRemove: Shop) => {
    setAvailableShops(prev => [...prev, shopToRemove].sort((a,b) => a.id - b.id));
    setAssignedRoute(prev => prev.filter(shop => shop.id !== shopToRemove.id));
  };

   // --- ADDED: Validation function ---
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!selectedEmployee) {
        newErrors.employee = 'Please select an employee.';
    }
    if (!planName.trim()) {
        newErrors.planName = 'Please enter a beat plan name.';
    }
    if (assignedRoute.length === 0) {
        newErrors.shops = 'Please assign at least one shop.';
    }
    return newErrors;
  };
  // ---

  // --- MODIFIED: handleSave incorporates validation ---
  const handleSave = async () => {
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0 || !planId) { // Also check planId exists
        if (!planId) alert("Cannot save: Beat Plan ID is missing.");
        return; // Stop if errors exist or planId is missing
    }

    setIsSaving(true);
    const payload: UpdateBeatPlanPayload = {
      employeeId: selectedEmployee,
      planName: planName.trim(), // Trim name
      date: selectedDate,
      shopIds: assignedRoute.map(shop => shop.id)
    };

    try {
      await updateBeatPlan(planId, payload);
      // Consider adding success toast
      navigate('/beat-plan');
    } catch (error) {
      console.error("Failed to update beat plan:", error);
      // Consider adding error toast
      alert("An error occurred while updating. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };
  // ---

  // --- RENDER LOGIC ---
  if (isLoadingPlan) { return <Sidebar><div className="p-6 text-center">Loading Beat Plan Details...</div></Sidebar>; }
  if (fetchError && !selectedEmployee) { return <Sidebar><div className="p-6 text-center text-red-600">{fetchError}</div></Sidebar>; }

  return (
    <Sidebar>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Link to="/beat-plan" className="p-2 rounded-full hover:bg-gray-200 transition-colors">
              <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Edit Beat Plan</h1>
              <p className="text-sm text-gray-500">Update and assign sales routes</p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Update Beat Plan'}
          </Button>
        </div>

        {/* Display fetch error related to shops */}
        {fetchError && selectedEmployee && (
             <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">{fetchError}</div>
        )}

        {/* Main Three-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Column 1: Beat Plan Details */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm space-y-6">
            <h2 className="text-lg font-semibold text-gray-800">Beat Plan Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Select Employee</label>
                <select
                  value={selectedEmployee}
                  onChange={(e) => {
                      setSelectedEmployee(e.target.value);
                      if (errors.employee) setErrors(prev => ({ ...prev, employee: undefined }));
                  }}
                  className={`block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.employee ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Choose employee...</option>
                  {employees.map(emp => <option key={emp.id} value={String(emp.id)}>{emp.name}</option>)}
                </select>
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
                  className={`block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.planName ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.planName && <p className="mt-1 text-xs text-red-600">{errors.planName}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Date</label>
                <DatePicker value={selectedDate} onChange={setSelectedDate} />
                {/* Add date validation error display if needed */}
              </div>
            </div>
            <div className="border-t pt-4 space-y-2">
              <h3 className="text-md font-semibold text-gray-700">Route Summary</h3>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Total Shops:</span><span className="font-medium">{assignedRoute.length}</span></div>
            </div>
          </div>

          {/* Column 2: Available Shops */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm flex flex-col">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Available Shops</h2>
            {/* Search Input */}
            <div className="relative mb-4">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              <input type="text" placeholder="Search Shops..." className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" value={shopSearchTerm} onChange={(e) => setShopSearchTerm(e.target.value)} />
            </div>
            {/* Conditional Loading/List */}
            <div className="space-y-3 overflow-y-auto pr-2 flex-1" style={{ maxHeight: 'calc(60vh - 40px)' }}>
              {isLoadingShops ? (
                <div className="flex justify-center items-center h-full text-gray-500">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading Shops...
                </div>
              ) : filteredAvailableShops.length > 0 ? (
                filteredAvailableShops.map(shop => (
                  <div key={shop.id} className="p-3 border rounded-lg flex justify-between items-center hover:shadow-md transition-shadow">
                     <div>
                       <p className="font-semibold">{shop.name}</p>
                       <p className="text-sm text-gray-500">{shop.address}</p>
                       <span className="text-xs text-gray-400 mt-1 block">{shop.zone}</span>
                     </div>
                     <button onClick={() => addShopToRoute(shop)} className="p-1.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors flex-shrink-0" aria-label={`Add ${shop.name}`}>
                       <PlusIcon className="h-4 w-4" />
                     </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm">
                  {shopSearchTerm ? 'No shops match your search.' : 'No available shops.'}
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Assigned Route */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm flex flex-col">
             <h2 className="text-lg font-semibold text-gray-800 mb-1">
                 Assigned Route ({assignedRoute.length} shops)
             </h2>
             {/* Error Message */}
             {errors.shops && <p className="mb-3 text-xs text-red-600">{errors.shops}</p>}
             {/* Conditional Loading/List */}
            <div className="space-y-3 overflow-y-auto pr-2 flex-1" style={{ maxHeight: 'calc(60vh)' }}>
              {isLoadingShops ? (
                <div className="flex justify-center items-center h-full text-gray-500">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading Route...
                </div>
              ) : assignedRoute.length === 0 ? (
                 <div className={`text-center py-16 text-gray-500 border-2 rounded-lg flex flex-col items-center justify-center h-full ${errors.shops ? 'border-red-500 border-solid' : 'border-dashed'}`}>
                    <MapPinIcon className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                    <p className="mt-1 text-sm font-semibold">No shops assigned yet!</p>
                    <p className="text-xs">Add shops from the left</p>
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
                      <button onClick={() => removeShopFromRoute(shop)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors flex-shrink-0" aria-label={`Remove ${shop.name}`}>
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                ))
              )}
            </div>
          </div>
        </div>
    </Sidebar>
  );
};

export default EditBeatPlanPage;