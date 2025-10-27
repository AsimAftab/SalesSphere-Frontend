import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import Button from '../../components/UI/Button/Button';
import { ArrowLeftIcon, MagnifyingGlassIcon, PlusIcon, MapPinIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Loader2 } from 'lucide-react';
import DatePicker from '../../components/UI/DatePicker/DatePicker';
import { createBeatPlan, getBeatPlanEmployees, type NewBeatPlanPayload } from '../../api/services/tracking/beatPlanService';

// --- TYPE DEFINITIONS ---
interface Shop {
  id: number;
  name: string;
  address: string;
  zone: string;
}

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

// --- MOCK DATA ---
const mockAllShops: Shop[] = [
  { id: 1, name: 'Metro Mart Downtown', address: '123 Main Street', zone: 'North Zone' },
  { id: 2, name: 'Fresh Foods Central', address: '456 Oak Avenue', zone: 'North Zone' },
  { id: 3, name: 'QuickStop Express', address: '789 Park Lane', zone: 'North Zone' },
  { id: 4, name: 'City Grocery Hub', address: '321 Commerce Blvd', zone: 'East Zone' },
  { id: 5, name: 'Sunrise Corner Store', address: '555 Sunrise Ave', zone: 'West Zone' },
  { id: 6, name: 'West End Grocers', address: '987 West End Rd', zone: 'West Zone' },
  { id: 7, name: 'Eastside Market', address: '654 Eastside Dr', zone: 'East Zone' },
];

const CreateBeatPlanPage: React.FC = () => {
  const [availableShops, setAvailableShops] = useState<Shop[]>(mockAllShops);
  const [assignedRoute, setAssignedRoute] = useState<Shop[]>([]);
  const [shopSearchTerm, setShopSearchTerm] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [planName, setPlanName] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  // --- ADDED: State for errors ---
  const [errors, setErrors] = useState<FormErrors>({});
  // ---

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const emps = await getBeatPlanEmployees();
        setEmployees(emps);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  const filteredAvailableShops = useMemo(() => {
    if (!shopSearchTerm) { return availableShops; }
    return availableShops.filter(shop =>
      shop.name.toLowerCase().includes(shopSearchTerm.toLowerCase()) ||
      shop.address.toLowerCase().includes(shopSearchTerm.toLowerCase()) ||
      shop.zone.toLowerCase().includes(shopSearchTerm.toLowerCase())
    );
  }, [availableShops, shopSearchTerm]);

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

    if (Object.keys(formErrors).length > 0) {
        return; // Stop if errors exist
    }

    setIsSaving(true);
    const payload: NewBeatPlanPayload = {
      employeeId: selectedEmployee,
      planName: planName.trim(), // Trim name
      date: selectedDate,
      shopIds: assignedRoute.map(shop => shop.id)
    };

    try {
      await createBeatPlan(payload);
      // Consider adding a success toast here
      navigate('/beat-plan');
    } catch (error) {
      console.error("Failed to save beat plan:", error);
      // Consider adding an error toast here instead of alert
      alert("An error occurred while saving. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };
  // ---

  return (
    <Sidebar>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link to="/beat-plan" className="p-2 rounded-full hover:bg-gray-200 transition-colors">
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Create Beat Plan</h1>
            <p className="text-sm text-gray-500">Create and assign sales routes</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Save Beat Plan'}
        </Button>
      </div>

      {/* Main Three-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Column 1: Beat Plan Details */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm space-y-6">
          <h2 className="text-lg font-semibold text-gray-800">Beat Plan Details</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Select Employee</label> {/* Added block & mb-1 */}
              <select
                value={selectedEmployee}
                onChange={(e) => {
                    setSelectedEmployee(e.target.value);
                    // Clear error when user selects
                    if (errors.employee) setErrors(prev => ({ ...prev, employee: undefined }));
                }}
                className={`block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.employee ? 'border-red-500' : 'border-gray-300'}`} // Conditional border
              >
                <option value="">Choose employee...</option>
                {employees.map(emp => <option key={emp.id} value={String(emp.id)}>{emp.name}</option>)}
              </select>
              {/* --- ERROR MESSAGE --- */}
              {errors.employee && <p className="mt-1 text-xs text-red-600">{errors.employee}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Beat Plan Name</label> {/* Added block & mb-1 */}
              <input
                type="text"
                value={planName}
                 onChange={(e) => {
                    setPlanName(e.target.value);
                    // Clear error when user types
                    if (errors.planName) setErrors(prev => ({ ...prev, planName: undefined }));
                 }}
                placeholder="e.g., North Zone Route 1"
                className={`block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.planName ? 'border-red-500' : 'border-gray-300'}`} // Conditional border
              />
              {/* --- ERROR MESSAGE --- */}
              {errors.planName && <p className="mt-1 text-xs text-red-600">{errors.planName}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Date</label> 
              <DatePicker
                value={selectedDate}
                onChange={setSelectedDate}
                // Optionally add error styling to DatePicker if needed
              />
               {/* No specific error state for DatePicker shown here, add if required */}
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
          <div className="relative mb-4">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search Shops..."
              className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={shopSearchTerm}
              onChange={(e) => setShopSearchTerm(e.target.value)}
            />
          </div>
          <div className="space-y-3 overflow-y-auto pr-2 flex-1" style={{maxHeight: 'calc(60vh - 40px)'}}>
            {filteredAvailableShops.length > 0 ? (
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
          <h2 className="text-lg font-semibold text-gray-800 mb-1"> {/* Reduced mb */}
              Assigned Route ({assignedRoute.length} shops)
          </h2>
          {/* --- ERROR MESSAGE --- */}
          {errors.shops && <p className="mb-3 text-xs text-red-600">{errors.shops}</p>}
          <div className="space-y-3 overflow-y-auto pr-2 flex-1" style={{maxHeight: 'calc(60vh)'}}>
            {assignedRoute.length === 0 ? (
              <div className={`text-center py-16 text-gray-500 border-2 rounded-lg flex flex-col items-center justify-center h-full ${errors.shops ? 'border-red-500 border-solid' : 'border-dashed'}`}> {/* Conditional border */}
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

export default CreateBeatPlanPage;