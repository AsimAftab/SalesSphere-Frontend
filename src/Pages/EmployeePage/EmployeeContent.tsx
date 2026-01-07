import React, { useState, useMemo, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import EmployeeCard from '../../components/UI/ProfileCard';
import Button from '../../components/UI/Button/Button';
import ExportActions from '../../components/UI/ExportActions';
import {
  type Employee,
  addEmployee,
  uploadEmployeeDocuments,
} from '../../api/employeeService';
import EmployeeFormModal from '../../components/modals/EmployeeFormModal';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { EMPLOYEE_QUERY_KEY } from './EmployeesPage';
import { assignRoleToUser, roleService } from '../../api/roleService';
import { type Role } from '../AdminPanelPage/admin.types';

// REMOVED: import * as XLSX from 'xlsx';  <-- We removed this static import

import { motion } from 'framer-motion';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface EmployeeContentProps {
  data: Employee[] | null;
  loading: boolean;
  error: string | null;
}

const containerVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const EmployeeContentSkeleton: React.FC = () => {
  const ITEMS_PER_PAGE = 12;
  return (
    <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f1f5f9">
      <div className="flex-1 flex flex-col h-full overflow-hidden px-1 md:px-0">

        {/* Header Skeleton */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6 flex-shrink-0 px-1">
          <div className="flex-shrink-0">
            <Skeleton width={160} height={36} />
          </div>

          <div className="flex flex-row flex-wrap items-center justify-start lg:justify-end gap-6 w-full lg:w-auto">
            <Skeleton height={40} width={280} borderRadius={999} />
            <div className="flex flex-row items-center gap-6">
              <Skeleton width={42} height={42} borderRadius={8} />
              <Skeleton width={85} height={42} borderRadius={8} />
            </div>
            <Skeleton height={40} width={160} borderRadius={8} />
          </div>
        </div>

        {/* Content Grid Skeleton */}
        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 px-1 md:px-0">
            {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-2xl border border-gray-100 shadow-lg flex flex-col items-center text-center h-full"
              >
                {/* 1. Profile Circle (h-20 w-20) */}
                <div className="mb-4 flex-shrink-0">
                  <Skeleton circle width={80} height={80} />
                </div>

                {/* 2. Title Placeholder (Matches text-xl) */}
                <div className="w-full mb-1 flex justify-center">
                  <Skeleton
                    width="75%"
                    height={24}
                    containerClassName="w-full"
                  />
                </div>

                {/* 3. Owner Name Placeholder (Matches text-base) */}
                <div className="w-full mt-2 mb-2 flex justify-center">
                  <Skeleton
                    width="55%"
                    height={18}
                    containerClassName="w-full"
                  />
                </div>

                {/* 4. Address Placeholder (Matches text-xs) */}
                <div className="w-full flex flex-col items-center gap-1.5 px-2 mt-2">
                  <div className="w-full flex justify-center">
                    <Skeleton width="90%" height={12} containerClassName="w-full" />
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

// -------------------- main component --------------------
const EmployeeContent: React.FC<EmployeeContentProps> = ({
  data,
  loading,
  error,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch Roles for Lookup
  const { data: rolesResponse } = useQuery({
    queryKey: ['roles'],
    queryFn: roleService.getAll
  });
  const roles = rolesResponse?.data?.data || [];

  // Helper to get role name safely
  const getEmployeeRoleName = (employee: Employee): string => {
    if (typeof employee.customRoleId === 'object' && employee.customRoleId?.name) {
      return employee.customRoleId.name;
    }
    if (typeof employee.customRoleId === 'string') {
      const foundRole = roles.find((r: Role) => r._id === employee.customRoleId);
      if (foundRole) return foundRole.name;
    }
    return employee.role; // Default fallback (e.g. 'user')
  };

  // State to track export loading status
  const [exportingStatus, setExportingStatus] = useState<'pdf' | 'excel' | null>(null);

  const queryClient = useQueryClient();
  const ITEMS_PER_PAGE = 12;

  const filteredEmployee = useMemo(() => {
    if (!data) return [];
    const lowerSearchTerm = searchTerm.toLowerCase();
    return data.filter(
      (employee) => {
        const roleName = getEmployeeRoleName(employee);
        return (
          employee.name.toLowerCase().includes(lowerSearchTerm) ||
          roleName.toLowerCase().includes(lowerSearchTerm)
        );
      }
    );
  }, [data, searchTerm, roles]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // --- EXPORT FUNCTIONALITY ---

  // 1. PDF Export Handler (Already Lazy)
  const handleExportPdf = async () => {
    setExportingStatus('pdf');
    try {
      // Lazy load React-PDF and FileSaver
      const { pdf } = await import('@react-pdf/renderer');
      const { saveAs } = await import('file-saver');
      const EmployeeListPDF = (await import('./EmployeeListPDF')).default;

      const doc = <EmployeeListPDF employees={filteredEmployee} />;
      const blob = await pdf(doc).toBlob();
      saveAs(blob, `Employee_List_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('PDF exported successfully');
    } catch (err) {
      toast.error('Failed to export PDF');
    } finally {
      setExportingStatus(null);
    }
  };

  // 2. Excel Export Handler (Phone as Number, Fixed Alignments)
  const handleExportExcel = async () => {
    setExportingStatus('excel');
    try {
      const ExcelJS = await import('exceljs');
      const { saveAs } = await import('file-saver');

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Employees');

      // 1. Calculate max documents & Max Address Length
      let maxDocs = 0;
      let maxAddressLength = 15;

      filteredEmployee.forEach(emp => {
        if (emp.documents && emp.documents.length > maxDocs) {
          maxDocs = emp.documents.length;
        }
        const addrLen = emp.address ? emp.address.length : 0;
        if (addrLen > maxAddressLength) {
          maxAddressLength = addrLen;
        }
      });
      if (maxDocs === 0) maxDocs = 1;

      // 2. Define Columns
      const columns: any[] = [
        {
          header: 'S.No',
          key: 's_no',
          width: 6,
          style: { alignment: { horizontal: 'left' } } // Left Align
        },
        { header: 'Name', key: 'name', width: 25 },
        { header: 'Role', key: 'role', width: 15 },
        { header: 'Email', key: 'email', width: 30 },
        {
          header: 'Phone',
          key: 'phone',
          width: 15,
          style:
          {
            numFmt: '0',
            alignment: { horizontal: 'left' }
          } // ✅ FORMAT AS NUMBER (No Scientific Notation)
        },
        { header: 'Gender', key: 'gender', width: 10 },
        {
          header: 'Age',
          key: 'age',
          width: 8,
          style: { alignment: { horizontal: 'left' } } // Left Align
        },
        { header: 'Date of Birth', key: 'dob', width: 15 },
        { header: 'Date Joined', key: 'dateJoined', width: 15 },
        { header: 'PAN Number', key: 'panNumber', width: 15 },
        { header: 'Citizenship Number', key: 'citizenshipNumber', width: 20 },
        {
          header: 'Avatar URL',
          key: 'avatarUrl',
          width: 40,
          style: { alignment: { vertical: 'middle' as const, horizontal: 'left' as const } }
        },
      ];

      // 3. Add Dynamic Document Columns
      for (let i = 0; i < maxDocs; i++) {
        columns.push({
          header: `Document ${i + 1} URL`,
          key: `doc_${i}`,
          width: 50,
          style: { alignment: { vertical: 'middle' as const, horizontal: 'left' as const } }
        });
      }

      // 4. Add Address (Last)
      columns.push({
        header: 'Address',
        key: 'address',
        width: maxAddressLength + 2
      });

      worksheet.columns = columns;

      // 5. Prepare Rows
      const rows = filteredEmployee.map((emp, index) => {
        const rowData: any = {
          s_no: index + 1,
          name: emp.name,
          role: getEmployeeRoleName(emp),
          email: emp.email,

          // ✅ CONVERT PHONE TO NUMBER
          phone: emp.phone ? Number(emp.phone) : 'N/A',

          gender: emp.gender || 'N/A',
          age: emp.age !== undefined ? emp.age : 'N/A',
          dob: emp.dateOfBirth ? new Date(emp.dateOfBirth).toLocaleDateString() : 'N/A',
          dateJoined: emp.dateJoined ? new Date(emp.dateJoined).toLocaleDateString() : 'N/A',
          panNumber: emp.panNumber || 'N/A',
          citizenshipNumber: emp.citizenshipNumber || 'N/A',
          address: emp.address || 'N/A',
        };

        // Handle Avatar Link
        if (emp.avatarUrl) {
          rowData.avatarUrl = {
            text: emp.avatarUrl,
            hyperlink: emp.avatarUrl,
            tooltip: 'Click to open image'
          };
        } else {
          rowData.avatarUrl = 'N/A';
        }

        // Handle Docs
        for (let i = 0; i < maxDocs; i++) {
          if (emp.documents && emp.documents[i]) {
            const url = emp.documents[i].fileUrl;
            rowData[`doc_${i}`] = {
              text: url,
              hyperlink: url,
              tooltip: 'Click to open document'
            };
          } else {
            rowData[`doc_${i}`] = 'N/A';
          }
        }

        return rowData;
      });

      worksheet.addRows(rows);

      // 6. Style Header
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.commit();

      // 7. Style Hyperlinks
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        row.eachCell((cell) => {
          if (cell.value && typeof cell.value === 'object' && 'hyperlink' in cell.value) {
            cell.font = {
              color: { argb: 'FF0000FF' }, // Blue
              underline: true
            };
          }
        });
      });

      // 8. Ignore Errors (Green Triangles)
      // Removed Phone from here since it's now a real number
      const lastRow = worksheet.rowCount;
      if (lastRow > 1) {
        const panCol = worksheet.getColumn('panNumber').letter;
        const citizenCol = worksheet.getColumn('citizenshipNumber').letter;

        const sheetAny = worksheet as any;
        if (sheetAny.addIgnoredErrors) {
          sheetAny.addIgnoredErrors(`${panCol}2:${panCol}${lastRow}`, { numberStoredAsText: true });
          sheetAny.addIgnoredErrors(`${citizenCol}2:${citizenCol}${lastRow}`, { numberStoredAsText: true });
        }
      }

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `Employee_List_${new Date().toISOString().split('T')[0]}.xlsx`);

      toast.success('Excel exported successfully');
    } catch (err) {
      toast.error('Failed to export Excel');
    } finally {
      setExportingStatus(null);
    }
  };

  const addEmployeeMutation = useMutation({
    mutationFn: async ({
      userFormData,
      customRoleId,
      documentFiles,
    }: {
      userFormData: FormData;
      customRoleId: string;
      documentFiles: File[];
    }) => {
      // 1. Create User
      const newEmployee = await addEmployee(userFormData);

      // 2. Assign Custom Role (if valid ID)
      if (newEmployee && newEmployee._id && customRoleId) {
        await assignRoleToUser(customRoleId, newEmployee._id);
      }

      // 3. Upload Document Files
      if (newEmployee && newEmployee._id && documentFiles.length > 0) {
        await uploadEmployeeDocuments(newEmployee._id, documentFiles);
      }
      return newEmployee;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EMPLOYEE_QUERY_KEY] });
      toast.success('Employee created successfully!');
      setIsModalOpen(false);
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : 'Failed to create employee'
      );
    },
  });

  const handleAddEmployee = async (
    formData: FormData,
    customRoleId: string,
    documentFiles?: File[]
  ) => {
    addEmployeeMutation.mutate({
      userFormData: formData,
      customRoleId,
      documentFiles: documentFiles || []
    });
  };

  const isCreating = addEmployeeMutation.isPending;

  // Pagination Logic
  const totalPages = Math.ceil(filteredEmployee.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentEmployee = filteredEmployee.slice(startIndex, endIndex);

  const goToPage = (pageNumber: number) => {
    const newPage = Math.max(1, Math.min(pageNumber, totalPages || 1));
    setCurrentPage(newPage);
  };

  if (loading && !data) {
    return <EmployeeContentSkeleton />;
  }

  if (error && !data)
    return (
      <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">
        {error}
      </div>
    );

  return (
    <motion.div
      className="flex-1 flex flex-col h-full overflow-hidden overflow-x-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Overlays */}
      {loading && data && (
        <div className="text-center p-2 text-sm text-blue-500">
          Refreshing...
        </div>
      )}
      {error && data && (
        <div className="text-center p-2 text-sm text-red-600 bg-red-50 rounded">
          {error}
        </div>
      )}
      {/* Export Loading Overlay */}
      {exportingStatus && (
        <div className="w-full p-2 mb-2 text-center bg-blue-100 text-blue-800 rounded-lg text-sm">
          Generating {exportingStatus === 'pdf' ? 'PDF' : 'Excel'}... Please wait.
        </div>
      )}

      {isCreating && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-[9999]">
          <div className="flex flex-col items-center bg-white px-8 py-6 rounded-lg shadow-lg">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="mt-3 text-gray-800 font-semibold">
              Creating employee...
            </span>
          </div>
        </div>
      )}

      {/* Header Section */}
      <motion.div
        className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 flex-shrink-0"
        variants={itemVariants}
      >
        <h1 className="text-3xl font-bold text-[#202224] text-center md:text-left">
          Employees
        </h1>

        {/* Actions Container */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
          {/* Search */}

          <div className="relative w-full sm:w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Name or Role"
              className="h-10 w-full bg-gray-200 border border-gray-200 pl-10 pr-4 rounded-full text-sm shadow-sm outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          {/* Export Buttons */}
          <div className="flex justify-center w-full md:w-auto">
            <ExportActions
              onExportPdf={handleExportPdf}
              onExportExcel={handleExportExcel}
            />
          </div>

          {/* Add Button */}
          <div className="flex justify-center w-full md:w-auto">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="w-full md:w-auto"
            >
              Add New Employee
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Content Area */}
      <motion.div
        variants={itemVariants}
        className="flex-1 flex flex-col overflow-hidden"
      >
        {filteredEmployee.length === 0 && !loading ? (
          <div className="text-center p-10 text-gray-500">
            No employees found{searchTerm ? ' matching your search' : ''}
          </div>
        ) : (
          <>
            {/* Scrolling Grid */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden pb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-2 md:px-0">
                {currentEmployee.map((employee) => (
                  <EmployeeCard
                    key={employee._id}
                    basePath="/employees"
                    id={employee._id}
                    title={employee.name}
                    imageUrl={
                      employee.avatarUrl ||
                      `https://placehold.co/150x150/197ADC/ffffff?text=${employee.name.charAt(
                        0
                      )}`
                    }
                    role={getEmployeeRoleName(employee)}
                    phone={employee.phone || 'N/A'}
                    cardType="employee"
                  />
                ))}
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex-shrink-0 flex items-center justify-between mt-6 text-sm text-gray-600 pt-4 border-t border-gray-200">
                <p>
                  Showing {startIndex + 1} -{' '}
                  {Math.min(endIndex, filteredEmployee.length)} of{' '}
                  {filteredEmployee.length}
                </p>
                <div className="flex items-center gap-x-2">
                  {currentPage > 1 && (
                    <Button
                      onClick={() => goToPage(currentPage - 1)}
                      variant="secondary"
                    >
                      Previous
                    </Button>
                  )}
                  <span className="font-semibold">
                    {currentPage} / {totalPages}
                  </span>
                  {currentPage < totalPages && (
                    <Button
                      onClick={() => goToPage(currentPage + 1)}
                      variant="secondary"
                    >
                      Next
                    </Button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>

      <EmployeeFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode="add"
        onSave={handleAddEmployee}
      />
    </motion.div>
  );
};

export default EmployeeContent;