import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import toast from "react-hot-toast";
// Import types and services
import {
  getMiscWorks,
  deleteMiscWork,
  type GetMiscWorksOptions,
  type GetMiscWorksResponse,
  type MiscWork as MiscWorkType,
} from "../../api/miscellaneousWorkService";

// Components
import MiscellaneousWorkContent from "./MiscellaneousWorkContent";
import ViewImageModal from "../../components/modals/ViewImageModal";
import MiscellaneousWorkListPDF from "./MiscellaneousWorkListPDF";

const MISC_WORK_KEYS = {
  all: ["misc-works"] as const,
  list: (filters: GetMiscWorksOptions) =>
    [...MISC_WORK_KEYS.all, "list", filters] as const,
};

const MiscellaneousWorkPage: React.FC = () => {
  const queryClient = useQueryClient();

  // --- STATE MANAGEMENT ---
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imagesToView, setImagesToView] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Filter States
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string[]>([]);

  const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // --- HANDLERS ---
  const onResetFilters = () => {
    setSearchQuery("");
    setSelectedDate(null);
    setSelectedEmployee([]); 
    setSelectedMonth([]);    
    setCurrentPage(1);
    toast.success("Filters reset");
  };

  const handleExportPdf = async (filteredData: MiscWorkType[]) => {
    if (filteredData.length === 0) {
        toast.error("No data to export");
        return;
    }

    const toastId = toast.loading("Preparing PDF view...");
    try {
        // --- Lazy Loading the Library ---
        const { pdf } = await import('@react-pdf/renderer');

        // Generate the PDF blob using your custom template component
        const blob = await pdf(<MiscellaneousWorkListPDF data={filteredData} />).toBlob();
        
        // Create a temporary URL for the blob
        const url = URL.createObjectURL(blob);

        // ✅ Opens in a new tab
        window.open(url, '_blank');

        toast.success("PDF opened in new tab!", { id: toastId });

        // Cleanup: Revoke the URL after a short delay to free up memory
        setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (err) {
        console.error("PDF Export Error:", err);
        toast.error("Failed to generate PDF", { id: toastId });
    }
};

  const handleExportExcel = async (filteredData: MiscWorkType[]) => {
    if (filteredData.length === 0) {
        toast.error("No data to export");
        return;
    }

    const toastId = toast.loading("Generating Excel report...");
    try {
        // --- Lazy Loading Libraries ---
        const ExcelJS = (await import('exceljs')).default;
        const { saveAs } = await import('file-saver');

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Miscellaneous Work');

        // 1. Identify dynamic image columns
        let maxImageCount = 0;
        filteredData.forEach((item) => {
            if (item.images) {
                maxImageCount = Math.max(maxImageCount, item.images.length);
            }
        });

        // 2. Define Columns
        const columns: any[] = [
            { header: 'S.No', key: 'sno', width: 8 },
            { header: 'Employee', key: 'employee', width: 25 },
            { header: 'Nature of Work', key: 'nature', width: 35 },
            { header: 'Work Date', key: 'date', width: 15 },
            { header: 'Address', key: 'address', width: 50 },
        ];

        // 3. Dynamic Image Columns
        for (let i = 1; i <= maxImageCount; i++) {
            columns.push({ header: `Image ${i}`, key: `img_${i}`, width: 50 });
        }

        columns.push({ header: 'Assigner', key: 'assigner', width: 25 });
        worksheet.columns = columns;

        // 4. Map Rows
        filteredData.forEach((item, index) => {
            const rowData: any = {
                sno: index + 1,
                employee: item.employee?.name || 'N/A',
                nature: item.natureOfWork || '-',
                date: item.workDate ? new Date(item.workDate).toLocaleDateString('en-GB') : '-',
                address: item.address || 'No Address',
                assigner: item.assignedBy?.name || 'N/A',
            };

            if (item.images) {
                item.images.forEach((url, i) => {
                    rowData[`img_${i + 1}`] = { text: url, hyperlink: url };
                });
            }
            worksheet.addRow(rowData);
        });

        // 5. Fix TypeScript Errors and UI Spillover
        worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell, colNumber) => {
                // FIX: Use worksheet.getColumn(colNumber).key to avoid TS error
                const columnKey = worksheet.getColumn(colNumber).key;

                cell.alignment = { 
                    horizontal: 'left', 
                    vertical: 'middle',
                    // Force wrapping for Address and Nature to prevent spill-over
                    wrapText: columnKey === 'address' || columnKey === 'nature' 
                };

                // Header Styling (Row 1)
                if (rowNumber === 1) {
                    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                    cell.fill = { 
                        type: 'pattern', 
                        pattern: 'solid', 
                        fgColor: { argb: 'FF197ADC' } 
                    };
                } 
                // Hyperlink Styling
                else if (cell.value && typeof cell.value === 'object' && 'hyperlink' in cell.value) {
                    cell.font = { color: { argb: 'FF0000FF' }, underline: true };
                }
            });
        });

        // 6. Save File
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), `Misc_Work_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
        toast.success('Excel exported successfully', { id: toastId });

    } catch (err) {
        console.error("Export Error:", err);
        toast.error('Failed to export Excel', { id: toastId });
    }
};

  // --- QUERY CONSTRUCTION ---
  const listQueryOptions: GetMiscWorksOptions = useMemo(() => {
    return {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      search: searchQuery,
      date: selectedDate?.toISOString().split('T')[0],
      employees: selectedEmployee, 
      month: selectedMonth.length > 0 ? (monthsList.indexOf(selectedMonth[0]) + 1).toString() : undefined,
    };
  }, [currentPage, searchQuery, selectedDate, selectedEmployee, selectedMonth]);

  // --- DATA FETCHING ---
  const {
    data: listResponse,
    error: listError,
    isFetching: isFetchingList,
  } = useQuery<GetMiscWorksResponse, Error>({
    queryKey: MISC_WORK_KEYS.list(listQueryOptions),
    queryFn: () => getMiscWorks(listQueryOptions),
    placeholderData: (prev) => prev,
  });

  const employeeOptions = useMemo(() => {
    if (!listResponse?.data) return [];
    const names = listResponse.data.map(item => item.employee?.name).filter(Boolean);
    return Array.from(new Set(names)).map(name => ({ label: name, value: name }));
  }, [listResponse?.data]);

  // --- MUTATIONS ---
  const deleteMutation = useMutation({
    mutationFn: deleteMiscWork,
    onSuccess: () => {
      toast.success("Entry deleted successfully");
      queryClient.invalidateQueries({ queryKey: MISC_WORK_KEYS.all });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete entry");
    }
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleViewImage = (images: string[]) => {
    setImagesToView(images);
    setIsImageModalOpen(true);
  };

  if (listError) {
    return (
      <Sidebar>
        <div className="p-6 text-center text-red-600 bg-red-50 rounded-lg mx-4 mt-4 border border-red-100">
          Error loading miscellaneous work data. Please try again.
        </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <MiscellaneousWorkContent
        tableData={listResponse?.data || []}
        isFetchingList={isFetchingList}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={listResponse?.pagination.pages || 1}
        totalItems={listResponse?.pagination.total || 0}
        ITEMS_PER_PAGE={ITEMS_PER_PAGE}
        isFilterVisible={isFilterVisible}
        setIsFilterVisible={setIsFilterVisible}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedEmployee={selectedEmployee}      
        setSelectedEmployee={setSelectedEmployee} 
        selectedMonth={selectedMonth}            
        setSelectedMonth={setSelectedMonth}      
        employeeOptions={employeeOptions} 
        onResetFilters={onResetFilters}
        handleViewImage={handleViewImage}
        onDelete={handleDelete}
        onExportPdf={handleExportPdf}
        onExportExcel={handleExportExcel}
      />

      <ViewImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        images={imagesToView}
        title="Attached Work Images"
      />
    </Sidebar>
  );
};

export default MiscellaneousWorkPage;