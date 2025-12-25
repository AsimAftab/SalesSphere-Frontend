import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; 
import Button from '../../components/UI/Button/Button';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'; 
import 'react-loading-skeleton/dist/skeleton.css'; 
import { Loader2 } from 'lucide-react'; 

interface Estimate {
  id: string;      // Used for routing
  _id: string;     // MongoDB ID
  estimateNumber: string;
  partyName: string;
  totalAmount: number;
  dateTime: string;
  createdBy: { name: string };
}

interface EstimateListContentProps {
  data: Estimate[] | null;
  loading: boolean;
  error: string | null;
  initialDateFilter: string;
  initialMonth: string | undefined;
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const containerVariants = { hidden: { opacity: 1 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const EstimateListSkeleton: React.FC = () => {
  const ITEMS_PER_PAGE = 10;
  return (
    <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 px-2">
          <Skeleton width={180} height={36} />
          <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
            <Skeleton height={40} width={256} borderRadius={999} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
            <Skeleton key={i} height={50} borderRadius={4} className="mb-1" />
          ))}
        </div>
      </div>
    </SkeletonTheme>
  );
};

const EstimateListContent: React.FC<EstimateListContentProps> = ({
  data, loading, error, initialDateFilter, initialMonth
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string>(initialMonth || months[new Date().getMonth()]);
  const [selectedDate, setSelectedDate] = useState<string>(initialDateFilter);
  const ITEMS_PER_PAGE = 10;

  const filteredEstimates = useMemo(() => {
    if (!data) return [];
    
    return data
      .filter(est => {
        const estDate = new Date(est.dateTime);
        const monthMatch = selectedMonth === 'all' || months[estDate.getMonth()] === selectedMonth;
        const searchMatch = (est.partyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (est.estimateNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (est.createdBy?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
        
        // Simple today filter logic
        let dateMatch = true;
        if (selectedDate === 'today') {
            const today = new Date().toISOString().split('T')[0];
            dateMatch = est.dateTime.split('T')[0] === today;
        }
        
        return monthMatch && searchMatch && dateMatch;
      })
      .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
  }, [data, searchTerm, selectedMonth, selectedDate]);

  const totalPages = Math.ceil(filteredEstimates.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentEstimates = filteredEstimates.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (loading && !data) return <EstimateListSkeleton />;
  if (error && !data) return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col">
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 px-2">
        <div>
          <h1 className="text-3xl font-bold text-[#202224]">Estimates</h1>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="Search Estimates..."
              className="h-10 w-full bg-white border border-gray-200 pl-10 pr-4 rounded-full text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
            />
          </div>

          <div className="flex gap-2">
            <select value={selectedDate} onChange={(e) => { setSelectedDate(e.target.value); setCurrentPage(1); }} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white shadow-sm outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Dates</option>
              <option value="today">Today</option>
            </select>

            <select value={selectedMonth} onChange={(e) => { setSelectedMonth(e.target.value); setCurrentPage(1); }} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white shadow-sm outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Months</option>
              {months.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <Button className="flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 shadow-md"> 
            Create Estimate 
          </Button>
        </div>
      </motion.div>

      {/* Table Container */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
        {loading && data && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        )}
        
        {filteredEstimates.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-secondary text-white text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">S.NO.</th>
                    <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">ID Number</th>
                    <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Party Name</th>
                    <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Created By</th>
                    <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Total Amount</th>
                    <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Details</th>
                    <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {currentEstimates.map((est, index) => (
                    <tr key={est._id || est.id} className="hover:bg-gray-200 transition-colors">
                      <td className="px-5 py-3 text-black text-sm">{startIndex + index + 1}</td>
                      <td className="px-5 py-3 text-black text-sm">{est.estimateNumber}</td>
                      <td className="px-5 py-3 text-black text-sm">{est.partyName}</td>
                      <td className="px-5 py-3 text-black text-sm">{est.createdBy?.name || '-'}</td>
                      <td className="px-5 py-3 text-black text-sm">RS {est.totalAmount.toLocaleString()}</td>
                      <td className="px-5 py-4 text-sm"><Link to={`/estimate/${est._id || est.id}`}  className="text-blue-500 hover:underline font-semibold">View Details</Link></td>
                      <td className="px-5 py-3 "></td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-50 bg-gray-50/50 text-sm text-gray-500">
                <p>Showing <span className="font-semibold text-gray-700">{startIndex + 1}</span> to <span className="font-semibold text-gray-700">{Math.min(startIndex + ITEMS_PER_PAGE, filteredEstimates.length)}</span> of <span className="font-semibold text-gray-700">{filteredEstimates.length}</span> results</p>
                <div className="flex items-center gap-2">
                  <Button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} variant="secondary" className="px-3 py-1 h-8 text-xs">Previous</Button>
                  <div className="flex gap-1">
                    {[...Array(totalPages)].map((_, i) => (
                        <button 
                            key={i} 
                            onClick={() => setCurrentPage(i + 1)}
                            className={`w-8 h-8 rounded-md text-xs font-bold transition-colors ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'hover:bg-gray-200 text-gray-600'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                  </div>
                  <Button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} variant="secondary" className="px-3 py-1 h-8 text-xs">Next</Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
                <MagnifyingGlassIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No estimates found</h3>
            <p className="text-gray-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default EstimateListContent;