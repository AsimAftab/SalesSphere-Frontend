import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import EmployeeCard from '../../components/UI/ProfileCard';
import Button from '../../components/UI/Button/Button';
import { type Employee, addEmployee, uploadEmployeeDocuments } from '../../api/services/employee/employeeService';
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
  const ITEMS_PER_PAGE = 12;

  if (loading) {
    return <div className="text-center p-10 text-gray-500">Loading Employees...</div>;
  }
  if (error) {
    return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;
  }
  if (!data || data.length === 0) {
    return <div className="text-center p-10 text-gray-500">No employees found.</div>;
  }

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentEmployees = data.slice(startIndex, endIndex);

  const goToNextPage = () => setCurrentPage((page) => Math.min(page + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage((page) => Math.max(page - 1, 1));

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
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#202224]">Employees</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add New Employee</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {currentEmployees.map(employee => (
          <Link key={employee._id} to={`/employees/${employee._id}`}>
            <EmployeeCard
              // FIX: Add basePath prop
              basePath="/employees"
              id={employee._id}
              title={employee.name}
              imageUrl={employee.avatarUrl || `https://placehold.co/150x150/e0e0e0/ffffff?text=${employee.name.charAt(0)}`}
              role={employee.role}
              phone={employee.phone || 'N/A'}
            />
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8 text-sm text-gray-600">
          <p>Showing {startIndex + 1}-{Math.min(endIndex, data.length)} of {data.length}</p>
          <div className="flex items-center gap-x-2">
            <Button onClick={goToPreviousPage} variant="secondary" disabled={currentPage === 1}>Previous</Button>
            <span className="font-semibold">{currentPage} / {totalPages}</span>
            <Button onClick={goToNextPage} variant="secondary" disabled={currentPage === totalPages}>Next</Button>
          </div>
        </div>
      )}

      <AddEmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddEmployee}
      />
    </div>
  );
};

export default EmployeeContent;