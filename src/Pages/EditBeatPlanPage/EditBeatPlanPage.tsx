import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom'; // Added useParams
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import Button from '../../components/UI/Button/Button';
import { ArrowLeftIcon, MagnifyingGlassIcon, PlusIcon, MapPinIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Loader2 } from 'lucide-react';
import DatePicker from '../../components/UI/DatePicker/DatePicker';

// --- UPDATED: Import necessary API functions and types ---
import {
  getBeatPlanEmployees,
  getBeatPlanDetails, // Function to fetch plan details
  updateBeatPlan,     // Function to update the plan
  type BeatPlan,      // Type for the fetched plan
  type UpdateBeatPlanPayload // Type for the update payload
} from '../../api/beatPlanService';

// --- TYPE DEFINITIONS (Priority removed) ---
interface Shop {
  id: number;
  name: string;
  address: string;
  zone: string;
}

// --- Employee type ---
interface Employee {
  id: number;
  name: string;
}

// --- MOCK DATA (Shops - same as Create page) ---
// In a real app, you might fetch *all* shops here, then filter out the assigned ones
const mockShops: Shop[] = [
  { id: 1, name: 'Metro Mart Downtown', address: '123 Main Street', zone: 'North Zone' },
  { id: 2, name: 'Fresh Foods Central', address: '456 Oak Avenue', zone: 'North Zone' },
  { id: 3, name: 'QuickStop Express', address: '789 Park Lane', zone: 'North Zone' },
  { id: 4, name: 'City Grocery Hub', address: '321 Commerce Blvd', zone: 'East Zone' },
  { id: 5, name: 'Sunrise Corner Store', address: '555 Sunrise Ave', zone: 'West Zone' },
];

// --- EDIT BEAT PLAN PAGE COMPONENT ---
export const EditBeatPlanPage: React.FC = () => { // Make sure this is exported (named export)
  const { planId } = useParams<{ planId: string }>(); // Get planId from URL
  const navigate = useNavigate();

  // --- State for existing plan data ---
  const [originalPlan, setOriginalPlan] = useState<BeatPlan | null>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // State for shop lists (similar to Create page)
  const [availableShops, setAvailableShops] = useState<Shop[]>(mockShops);
  const [assignedRoute, setAssignedRoute] = useState<Shop[]>([]); // Starts empty, populated by fetch

  // State for form fields
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [planName, setPlanName] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // Start null, populated by fetch

  const [isSaving, setIsSaving] = useState(false);

  // --- Fetch employees (same as Create page) ---
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const emps = await getBeatPlanEmployees();
        setEmployees(emps);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
        // Handle employee fetch error if needed
      }
    };
    fetchEmployees();
  }, []);

  // --- Fetch existing Beat Plan details ---
  useEffect(() => {
    if (!planId) {
      setFetchError("Beat Plan ID not found in URL.");
      setIsLoadingPlan(false);
      return;
    }

    const fetchPlanDetails = async () => {
      setIsLoadingPlan(true);
      setFetchError(null);
      try {
        const planData = await getBeatPlanDetails(planId);
        if (planData) {
          setOriginalPlan(planData);
          // Populate form fields with fetched data
          setSelectedEmployee(planData.employeeId?.toString() || ''); // Ensure employeeId exists and is string
          setPlanName(planData.planName);
          // Convert date string back to Date object (handle potential invalid date)
          const assignedDate = new Date(planData.dateAssigned);
          setSelectedDate(isNaN(assignedDate.getTime()) ? null : assignedDate);

          // --- IMPORTANT: Handle Assigned Shops ---
          // The current mock `getBeatPlanDetails` doesn't return assigned shops.
          // In a real app, you would fetch the list of shops assigned to this planId.
          // For now, it remains empty.
          // Example:
          // const assignedShopsData = await getAssignedShopsForPlan(planId);
          // setAssignedRoute(assignedShopsData);
          // Filter available shops based on assigned ones
          // setAvailableShops(mockShops.filter(s => !assignedShopsData.some(as => as.id === s.id)));

          setAssignedRoute([]); // Keep empty for mock data
          setAvailableShops(mockShops); // Show all shops as available for mock data

        } else {
          setFetchError(`Beat Plan with ID ${planId} not found.`);
        }
      } catch (error) {
        console.error("Failed to fetch beat plan details:", error);
        setFetchError("Failed to load beat plan details. Please try again.");
      } finally {
        setIsLoadingPlan(false);
      }
    };

    fetchPlanDetails();
  }, [planId]); // Re-run if planId changes

  // Shop management functions (same as Create page)
  const addShopToRoute = (shopToAdd: Shop) => {
    setAssignedRoute(prev => [...prev, shopToAdd]);
    setAvailableShops(prev => prev.filter(shop => shop.id !== shopToAdd.id));
  };

  const removeShopFromRoute = (shopToRemove: Shop) => {
    setAvailableShops(prev => [...prev, shopToRemove].sort((a,b) => a.id - b.id));
    setAssignedRoute(prev => prev.filter(shop => shop.id !== shopToRemove.id));
  };

  // --- Updated HandleSave function to UPDATE ---
  const handleSave = async () => {
    if (!planId) {
      alert("Cannot save: Beat Plan ID is missing.");
      return;
    }
    // Basic validation
    if (!selectedEmployee || !planName || assignedRoute.length === 0) {
      alert("Please select an employee, enter a plan name, and assign at least one shop.");
      return;
    }

    setIsSaving(true);

    // Create the payload for the API
    const payload: UpdateBeatPlanPayload = {
      employeeId: selectedEmployee,
      planName: planName,
      date: selectedDate,
      shopsCount: assignedRoute.length
      // Include status if you want to update it
    };

    try {
      // Call the UPDATE API
      await updateBeatPlan(planId, payload);

      // On success, navigate back to the main page
      navigate('/beat-plan');

    } catch (error) {
      console.error("Failed to update beat plan:", error);
      alert("An error occurred while updating. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- Loading/Error states for initial fetch ---
  if (isLoadingPlan) {
    return <Sidebar><div className="p-6 text-center">Loading Beat Plan Details...</div></Sidebar>;
  }
  if (fetchError) {
    return <Sidebar><div className="p-6 text-center text-red-600">{fetchError}</div></Sidebar>;
  }
  // ---

  return (
    <Sidebar>
        {/* --- Header (Updated Title) --- */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Link to="/beat-plan" className="p-2 rounded-full hover:bg-gray-200 transition-colors">
              <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
            </Link>
            <div>
              {/* --- UPDATED Title --- */}
              <h1 className="text-2xl font-bold text-gray-800">Edit Beat Plan</h1>
              <p className="text-sm text-gray-500">Update and assign sales routes</p>
            </div>
          </div>
          {/* --- UPDATED Button Text --- */}
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              'Update Beat Plan' // <-- Updated Text
            )}
          </Button>
        </div>

        {/* --- Main Three-Column Layout (Same structure as Create) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* --- Column 1: Beat Plan Details --- */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm space-y-6">
            <h2 className="text-lg font-semibold text-gray-800">Beat Plan Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Select Employee</label>
                <select
                  value={selectedEmployee} // State controls the value
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose employee...</option>
                  {/* Ensure employee IDs are strings for comparison */}
                  {employees.map(emp => <option key={emp.id} value={emp.id.toString()}>{emp.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Beat Plan Name</label>
                <input
                  type="text"
                  value={planName} // State controls the value
                  onChange={(e) => setPlanName(e.target.value)}
                  placeholder="e.g., North Zone Route 1"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Date</label>
                <DatePicker
                  value={selectedDate} // State controls the value
                  onChange={setSelectedDate}
                />
              </div>
            </div>
            <div className="border-t pt-4 space-y-2">
              <h3 className="text-md font-semibold text-gray-700">Route Summary</h3>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Total Shops:</span><span className="font-medium">{assignedRoute.length}</span></div>
            </div>
          </div>

          {/* --- Column 2: Available Shops --- */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Available Shops</h2>
            <div className="relative mb-4">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="text" placeholder="Search" className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {availableShops.map(shop => (
                <div key={shop.id} className="p-3 border rounded-lg flex justify-between items-center hover:shadow-md transition-shadow">
                  <div>
                    <p className="font-semibold">{shop.name}</p>
                    <p className="text-sm text-gray-500">{shop.address}</p>
                    <span className="text-xs text-gray-400 mt-1 block">{shop.zone}</span>
                  </div>
                  <button onClick={() => addShopToRoute(shop)} className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* --- Column 3: Assigned Route --- */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Assigned Route ({assignedRoute.length} shops)</h2>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {assignedRoute.length === 0 ? (
                <div className="text-center py-16 text-gray-500 border-2 border-dashed rounded-lg">
                  <MapPinIcon className="h-12 w-12 mx-auto text-gray-300" />
                  <p className="mt-2 text-sm font-semibold">No shops assigned yet!</p>
                  <p className="text-xs">Add shops from the left to create a route</p>
                </div>
              ) : (
                assignedRoute.map((shop, index) => (
                  <div key={shop.id} className="p-3 border rounded-lg flex justify-between items-center hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-blue-600 text-lg">{index + 1}</span>
                      <div>
                        <p className="font-semibold">{shop.name}</p>
                        <p className="text-sm text-gray-500">{shop.address}</p>
                      </div>
                    </div>
                    <button onClick={() => removeShopFromRoute(shop)} className="p-2 text-gray-400 hover:text-red-500 rounded-full transition-colors">
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
