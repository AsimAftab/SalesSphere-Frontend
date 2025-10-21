import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import Button from '../../components/UI/Button/Button';
import { ArrowLeftIcon, MagnifyingGlassIcon, PlusIcon, MapPinIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Loader2 } from 'lucide-react';
import DatePicker from '../../components/UI/DatePicker/DatePicker';

// --- 1. Import the new API functions and types ---
import { createBeatPlan, getBeatPlanEmployees, type NewBeatPlanPayload } from '../../api/beatPlanService';

// --- TYPE DEFINITIONS ---
interface Shop {
  id: number;
  name: string;
  address: string;
  zone: string;
  priority: 'high' | 'medium' | 'low';
}

// --- MODIFIED: Employee type now matches service ---
interface Employee {
  id: number;
  name: string;
}

// --- MOCK DATA (Only for shops now) ---
const mockShops: Shop[] = [
  { id: 1, name: 'Metro Mart Downtown', address: '123 Main Street', zone: 'North Zone', priority: 'high' },
  { id: 2, name: 'Fresh Foods Central', address: '456 Oak Avenue', zone: 'North Zone', priority: 'medium' },
  { id: 3, name: 'QuickStop Express', address: '789 Park Lane', zone: 'North Zone', priority: 'high' },
  { id: 4, name: 'City Grocery Hub', address: '321 Commerce Blvd', zone: 'East Zone', priority: 'low' },
  { id: 5, name: 'Sunrise Corner Store', address: '555 Sunrise Ave', zone: 'West Zone', priority: 'medium' },
];

// --- Helper Components for Priority Badges (unchanged) ---
const PriorityBadge: React.FC<{ priority: Shop['priority'] }> = ({ priority }) => {
  const styles = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-blue-100 text-blue-700',
  };
  return <span className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${styles[priority]}`}>{priority}</span>;
};

const CreateBeatPlanPage: React.FC = () => {
  const [availableShops, setAvailableShops] = useState<Shop[]>(mockShops);
  const [assignedRoute, setAssignedRoute] = useState<Shop[]>([]);
  
  // --- 2. State for form fields ---
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [planName, setPlanName] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  // --- 3. Fetch employees when the page loads ---
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

  const addShopToRoute = (shopToAdd: Shop) => {
    setAssignedRoute(prev => [...prev, shopToAdd]);
    setAvailableShops(prev => prev.filter(shop => shop.id !== shopToAdd.id));
  };

  const removeShopFromRoute = (shopToRemove: Shop) => {
    setAvailableShops(prev => [...prev, shopToRemove].sort((a,b) => a.id - b.id));
    setAssignedRoute(prev => prev.filter(shop => shop.id !== shopToRemove.id));
  };

  // --- 4. Updated HandleSave function ---
  const handleSave = async () => {
    // Basic validation
    if (!selectedEmployee || !planName || assignedRoute.length === 0) {
      alert("Please select an employee, enter a plan name, and assign at least one shop.");
      return;
    }
    
    setIsSaving(true);
    
    // Create the payload for the API
    const payload: NewBeatPlanPayload = {
      employeeId: selectedEmployee,
      planName: planName,
      date: selectedDate,
      shopsCount: assignedRoute.length
    };

    try {
      // Call the API
      await createBeatPlan(payload);
      
      // On success, navigate back to the main page
      navigate('/beat-plan');
      
    } catch (error) {
      console.error("Failed to save beat plan:", error);
      alert("An error occurred while saving. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Sidebar>
        {/* --- Header --- */}
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
            {isSaving ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              'Save Beat Plan'
            )}
          </Button>
        </div>

        {/* --- Main Three-Column Layout --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* --- Column 1: Beat Plan Details --- */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm space-y-6">
            <h2 className="text-lg font-semibold text-gray-800">Beat Plan Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Select Employee</label>
                {/* --- 5. Updated Select to use fetched employees --- */}
                <select 
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose employee...</option>
                  {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Beat Plan Name</label>
                <input 
                  type="text" 
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  placeholder="e.g., North Zone Route 1" 
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Date</label>
                <DatePicker 
                  value={selectedDate}
                  onChange={setSelectedDate}
                />
              </div>
            </div>
            <div className="border-t pt-4 space-y-2">
              <h3 className="text-md font-semibold text-gray-700">Route Summary</h3>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Total Shops:</span><span className="font-medium">{assignedRoute.length}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">High Priority:</span><span className="font-medium">{assignedRoute.filter(s => s.priority === 'high').length}</span></div>
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
                    <div className="flex items-center gap-2 mt-1">
                      <PriorityBadge priority={shop.priority} />
                      <span className="text-xs text-gray-400">{shop.zone}</span>
                    </div>
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

export default CreateBeatPlanPage;