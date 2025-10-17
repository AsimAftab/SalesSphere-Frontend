import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import Button from '../../components/UI/Button/Button';
import BeatPlanStatCard from '../../components/cards/BeatPlan_cards/BeatPlanStatCard';
import { getBeatPlanData, type FullBeatPlanData } from '../../api/beatPlanService';

// Import icons for the stat cards (using lucide-react as an example)
import { ClipboardList, Route, Users, Store, Eye } from 'lucide-react';

// --- Helper component for the status badge in the table ---
const StatusBadge = ({ status }: { status: 'active' | 'pending' }) => {
  const baseClasses = "px-3 py-1 text-xs font-medium rounded-full";
  const colorClasses = status === 'active' 
    ? "bg-green-100 text-green-800" 
    : "bg-yellow-100 text-yellow-800";
  
  return <span className={`${baseClasses} ${colorClasses}`}>{status}</span>;
};


const BeatPlanPage: React.FC = () => {
  const [data, setData] = useState<FullBeatPlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <Sidebar>
        {/* --- Header --- */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Beat Plans</h1>
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
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3">Serial No</th>
                  <th scope="col" className="px-6 py-3">Employee Name</th>
                  <th scope="col" className="px-6 py-3">Beat Plan Name</th>
                  <th scope="col" className="px-6 py-3">Date Assigned</th>
                  <th scope="col" className="px-6 py-3">View Beats</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Details</th>
                </tr>
              </thead>
              <tbody>
                {beatPlans.map(plan => (
                  <tr key={plan.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{plan.serial}</td>
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
                      <button className="text-blue-600 bg-blue-100 px-3 py-1 rounded-full text-xs font-semibold">
                        {plan.shopsCount} Shops
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={plan.status} />
                    </td>
                    <td className="px-6 py-4">
                      <button className="flex items-center text-gray-600 hover:text-blue-600 font-semibold text-xs">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </Sidebar>
  );
};

export default BeatPlanPage;
