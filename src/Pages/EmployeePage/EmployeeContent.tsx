import React, { useState,useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import EmployeeCard from '../../components/UI/ProfileCard';
import Button from '../../components/UI/Button/Button';
import { type Employee, addEmployee, uploadEmployeeDocuments } from '../../api/employeeService';
import AddEmployeeModal from '../../components/modals/AddEmployeeModal';

interface EmployeeContentProps {
  data: Employee[] | null;
  loading: boolean;
  error: string | null;
  onDataRefresh: () => void;
}

const EmployeeContent: React.FC<EmployeeContentProps> = ({
  data,
  loading,
  error,
  onDataRefresh
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const ITEMS_PER_PAGE = 12;

  const filteredEmployee = useMemo(() => {
      if (!data) return [];
      setCurrentPage(1);
      return data.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }, [data, searchTerm]);

  if (loading) return <div className="text-center p-10 text-gray-500">Loading Employee...</div>;
  if (error) return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;
   if (!data) return <div className="text-center p-10 text-gray-500">No Employee found.</div>;
  

   const totalPages = Math.ceil(filteredEmployee.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentEmployee = filteredEmployee.slice(startIndex, endIndex);

   const goToPage = (pageNumber: number) => {
    const newPage = Math.max(1, Math.min(pageNumber, totalPages));
    setCurrentPage(newPage);
  };

  const handleAddEmployee = async (userFormData: FormData, documentFiles: File[]) => {
    let newEmployee = null;
    
    // --- Step 1: Create Employee ---
    try {
      newEmployee = await addEmployee(userFormData);
    } catch (error) {
      console.error("Failed to create employee (Step 1/2):", error);
      alert(`Failed to create employee: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return; // Stop if user creation fails
    }

    // --- Step 2: Upload Documents ---
    if (newEmployee && newEmployee._id && documentFiles.length > 0) {
      try {
        console.log(`Uploading ${documentFiles.length} documents for user ${newEmployee._id}`);
        await uploadEmployeeDocuments(newEmployee._id, documentFiles);
        console.log("Documents uploaded successfully.");

      } catch (uploadError) {
        // FIX: Display a specific warning if documents fail but user was created.
        console.error("Documents upload failed (Step 2/2):", uploadError);
        alert(`Employee created, but document upload failed: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}. Please check file type (PDF only) and size (Max 2MB).`);
        // We still refresh the list and close the modal, as the employee was created.
      }
    }

    // --- Step 3: Cleanup and Refresh ---
    setIsModalOpen(false);
    onDataRefresh();
};

  

return (
     <div className="flex-1 flex flex-col overflow-hidden">
        {/* Show subsequent loading/error messages */}
        {loading && data && <div className="text-center p-2 text-sm text-blue-500">Refreshing...</div>}
        {error && data && <div className="text-center p-2 text-sm text-red-600 bg-red-50 rounded">{error}</div>}
        <div className="flex flex-col md:flex-row md:items-center   justify-between mb-8 gap-4 ">
                      <h1 className="text-3xl font-bold text-[#202224] text-center md:text-left">Employee</h1>
                      <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
                        <div className="relative">
              <MagnifyingGlassIcon className="pointer-events-none absolute inset-y-0 left-3 h-full w-5 text-gray-500" />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Name or Role "
                className="block h-10 w-full md:w-64 border-transparent bg-gray-200 py-0 pl-10 pr-3 text-gray-900 placeholder:text-gray-500 focus:ring-0 sm:text-sm rounded-full"
              />
            </div>
            <div className="flex justify-center w-full md:w-auto">
                <Button onClick={() => setIsModalOpen(true)} className="w-full md:w-auto">
                    Add New Employee
                </Button>
            </div>
          </div>
        </div>

        {filteredEmployee.length === 0 && !loading ? (
              <div className="text-center p-10 text-gray-500">No Employee found.</div>
        ) : (
          <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {currentEmployee.map(employee => (
              <Link key={employee._id} to={`/employees/${employee._id}`}>
                <EmployeeCard
                  // FIX: Add basePath prop
                  basePath="/employees"
                  id={employee._id}
                  title={employee.name}
                  imageUrl={employee.avatarUrl || `https://placehold.co/150x150/e0e0e0/ffffff?text=${employee.name.charAt(0)}`}
                  role={employee.role}
                  phone={employee.phone || 'N/A'}
                  cardType='employee'
                />
              </Link>
            ))}
          </div>

              {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 text-sm text-gray-600">
            <p>
              Showing {startIndex + 1} - {Math.min(endIndex, filteredEmployee.length)} of {filteredEmployee.length}
            </p>
            <div className="flex items-center gap-x-2">
              {currentPage > 1 && (
                <Button onClick={() => goToPage(currentPage - 1)} variant="secondary">Previous</Button>
              )}
              <span className="font-semibold">{currentPage} / {totalPages}</span>
              {currentPage < totalPages && (
                <Button onClick={() => goToPage(currentPage + 1)} variant="secondary">Next</Button>
              )}
            </div>
          </div>
        )}

        <AddEmployeeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddEmployee}
        />
        </>
      )}
    </div>
  );
};

export default EmployeeContent;