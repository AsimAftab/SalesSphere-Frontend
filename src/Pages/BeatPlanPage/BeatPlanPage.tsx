import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import Button from '../../components/UI/Button/Button';
import BeatPlanStatCard from '../../components/cards/BeatPlan_cards/BeatPlanStatCard';
import { getBeatPlanData, type FullBeatPlanData } from '../../api/beatPlanService';
import BeatPlanDetailsModal, { type BeatPlanDetail, type Shop } from '../../components/modals/BeatPlanDetailsModal'; 
import { Eye, ClipboardList, Route, Users, Store } from 'lucide-react'; 


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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- STATE IS CORRECTLY TYPED using the imported BeatPlanDetail ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<BeatPlanDetail | null>(null);

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10; // Restrict to 10 rows

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getBeatPlanData();
        setData(result);
      } catch (err) {
        setError("Failed to load Beat Plan data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- CORRECTED HANDLER FUNCTIONS ---
  const handleViewDetails = (plan: FullBeatPlanData['beatPlans'][number]) => {
    
    // Define the mock shops using the imported Shop type
    const mockAssignedShops: Shop[] = [
      { id: 1, name: 'Metro Mart Downtown', address: '123 Main Street', priority: 'High', zone: 'North Zone' },
      { id: 2, name: 'Fresh Foods Central', address: '456 Oak Avenue', priority: 'Medium', zone: 'North Zone' },
      { id: 3, name: 'QuickStop Express', address: '789 Park Lane', priority: 'High', zone: 'North Zone' },
    ];
      
    // OPTIMAL FIX: Create a temporary object and cast it when setting state.
    // This bypasses the complex type inference error when merging intersection types.
    const tempFullPlan = {
        ...plan,
        id: Number(plan.id),
        routeSummary: {
            totalShops: mockAssignedShops.length,
            highPriority: mockAssignedShops.filter(s => s.priority === 'High').length,
        },
        assignedShops: mockAssignedShops,
    };

    // Cast the merged object to the final required type
    setSelectedPlan(tempFullPlan as BeatPlanDetail);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };
  // --- END CORRECTED HANDLER FUNCTIONS ---

  if (loading) {
    return <Sidebar><div className="p-6 text-center">Loading Beat Plans...</div></Sidebar>;
  }
  if (error) {
    return <Sidebar><div className="p-6 text-center text-red-600">{error}</div></Sidebar>;
  }
  if (!data) {
    return <Sidebar><div className="p-6 text-center">No data available.</div></Sidebar>;
  }

  const { stats, beatPlans } = data;

  // --- Pagination Logic ---
  const totalItems = beatPlans.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  
  // Slice the data for the current page
  const currentBeatPlans = beatPlans.slice(startIndex, endIndex);

  // Pagination handlers
  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };
  // --- End Pagination Logic ---

  return (
    <Sidebar>
      {/* --- Header --- */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-black">Beat Plans</h1>
          <p className="text-sm text-gray-500">Manage all sales routes and assignments</p>
        </div>
        <Link to="/beat-plan/create">
          <Button>Create New Beat Plan</Button>
        </Link>
      </div>

      {/* --- Stat Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <BeatPlanStatCard 
          title="Total Beat Plans"
          value={stats.totalPlans}
          icon={<ClipboardList className="h-6 w-6 text-blue-600" />}
          iconBgColor="bg-blue-100"
        />
        <BeatPlanStatCard 
          title="Active Routes"
          value={stats.activeRoutes}
          icon={<Route className="h-6 w-6 text-green-600" />}
          iconBgColor="bg-green-100"
        />
        <BeatPlanStatCard 
          title="Assigned Employees"
          value={stats.assignedEmployees}
          icon={<Users className="h-6 w-6 text-purple-600" />}
          iconBgColor="bg-purple-100"
        />
        <BeatPlanStatCard 
          title="Total Shops"
          value={stats.totalShops}
          icon={<Store className="h-6 w-6 text-orange-600" />}
          iconBgColor="bg-orange-100"
        />
      </div>

      {/* --- All Beat Plans Table --- */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">All Beat Plans</h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-white uppercase bg-secondary">
              <tr>
                <th scope="col" className="px-6 py-4">S. No</th>
                <th scope="col" className="px-6 py-4">Employee Name</th>
                <th scope="col" className="px-6 py-4">Beat Plan Name</th>
                <th scope="col" className="px-6 py-4">Date Assigned</th>
                <th scope="col" className="px-6 py-4">Details</th>
                <th scope="col" className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentBeatPlans.map((plan, index) => (
                <tr key={plan.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img className="h-10 w-10 rounded-full" src={plan.employeeImageUrl} alt={plan.employeeName} />
                      <div>
                        <p className="font-semibold">{plan.employeeName}</p>
                        <p className="text-xs text-gray-500">{plan.employeeRole}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{plan.planName}</td>
                  <td className="px-6 py-4">{plan.dateAssigned}</td>
                  <td className="px-6 py-4">
                    <button 
                      className="flex items-center text-gray-600 hover:text-blue-600 font-semibold text-xs transition duration-150"
                      onClick={() => handleViewDetails(plan)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={plan.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- NEW: Pagination Footer --- */}
        <div className="flex justify-between items-center pt-4 text-sm text-gray-600">
          <p>
            {totalItems === 0
              ? "Showing 0-0 of 0"
              : `Showing ${startIndex + 1}-${Math.min(endIndex, totalItems)} of ${totalItems}`
            }
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-x-2">
              {/* Button only appears when not on the first page */}
              {currentPage > 1 && (
                <Button onClick={goToPreviousPage}>Previous</Button>
              )}
              {/* Button only appears when not on the last page */}
              {currentPage < totalPages && (
                <Button onClick={goToNextPage}>Next</Button>
              )}
            </div>
          )}
        </div>
        {/* --- End Pagination Footer --- */}
        
      </div>

      {/* --- RENDER THE MODAL COMPONENT --- */}
      <BeatPlanDetailsModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        plan={selectedPlan} 
      />
    </Sidebar>
  );
};

export default BeatPlanPage;
