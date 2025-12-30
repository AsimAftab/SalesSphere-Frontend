import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; // ✅ Added useMutation & useQueryClient
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import toast from "react-hot-toast";

// Import types and mock service
import { getTourPlans } from "../../api/tourPlanService"; // ✅ Ensure updateTourPlanStatus is added here or mocked
import TourPlanContent, { type TourPlan } from "./TourPlanContent";
import TourPlanListPDF from "./TourPlanListPDF";

const TourPlanPage: React.FC = () => {
  const queryClient = useQueryClient(); // ✅ Required for cache invalidation
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string[]>([]);

  // --- DATA FETCHING ---
  const { data: tourPlans = [], isFetching } = useQuery<TourPlan[]>({
    queryKey: ["tour-plans"],
    queryFn: getTourPlans,
  });

  // --- STATUS UPDATE MUTATION ---
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      // Logic: Replace this with your actual API call:
      // return await updateTourPlanStatus(id, status);
      console.log(`Updating ${id} to ${status}`);
      return new Promise((resolve) => setTimeout(resolve, 500)); // Mock delay
    },
    onSuccess: () => {
      toast.success("Status updated successfully");
      // Refresh the list by invalidating the query
      queryClient.invalidateQueries({ queryKey: ["tour-plans"] });
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });

  const handleUpdateStatus = (id: string, newStatus: string) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  const employeeOptions = useMemo(() => {
    const names = tourPlans.map((item) => item.employee.name);
    return Array.from(new Set(names));
  }, [tourPlans]);

  const onResetFilters = () => {
    setSearchQuery("");
    setSelectedDate(null);
    setSelectedEmployee([]);
    setSelectedStatus([]);
    setSelectedMonth([]);
    setCurrentPage(1);
    toast.success("Filters cleared");
  };

  // --- LAZY LOADED EXPORT HANDLERS (UNCHANGED) ---

  const handleExportPdf = async (filteredData: TourPlan[]) => {
    if (filteredData.length === 0) return toast.error("No data to export");
    const toastId = toast.loading("Preparing PDF view...");
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const blob = await pdf(<TourPlanListPDF data={filteredData} />).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      toast.success("PDF opened in new tab!", { id: toastId });
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (err) {
      console.error("PDF Export Error:", err);
      toast.error("Failed to generate PDF", { id: toastId });
    }
  };

  const handleExportExcel = async (filteredData: TourPlan[]) => {
    if (filteredData.length === 0) return toast.error("No data to export");
    const toastId = toast.loading("Generating Excel report...");
    try {
      const ExcelJS = (await import("exceljs")).default;
      const { saveAs } = await import("file-saver");
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Tour Plans");

      worksheet.columns = [
        { header: "S.No", key: "sno", width: 8 },
        { header: "Employee", key: "employee", width: 25 },
        { header: "Place", key: "place", width: 30 },
        { header: "Start Date", key: "start", width: 15 },
        { header: "End Date", key: "end", width: 15 },
        { header: "Status", key: "status", width: 15 },
        { header: "Reviewer", key: "reviewer", width: 20 },
      ];

      filteredData.forEach((item, index) => {
        worksheet.addRow({
          sno: index + 1,
          employee: item.employee.name,
          place: item.placeOfVisit,
          start: new Date(item.startDate).toLocaleDateString("en-GB"),
          end: new Date(item.endDate).toLocaleDateString("en-GB"),
          status: item.status,
          reviewer: item.reviewer || "-",
        });
      });

      worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
          const columnKey = worksheet.getColumn(colNumber).key;
          cell.alignment = { horizontal: "left", vertical: "middle", wrapText: columnKey === "place" };
          if (rowNumber === 1) {
            cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF197ADC" } };
          }
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), `Tour_Plans_${new Date().toISOString().split("T")[0]}.xlsx`);
      toast.success("Excel exported successfully!", { id: toastId });
    } catch (err) {
      console.error("Excel Export Error:", err);
      toast.error("Failed to export Excel", { id: toastId });
    }
  };

  return (
    <Sidebar>
      <TourPlanContent
        tableData={tourPlans}
        isFetchingList={isFetching}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        ITEMS_PER_PAGE={ITEMS_PER_PAGE}
        isFilterVisible={isFilterVisible}
        setIsFilterVisible={setIsFilterVisible}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedEmployee={selectedEmployee}
        setSelectedEmployee={setSelectedEmployee}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        employeeOptions={employeeOptions}
        onResetFilters={onResetFilters}
        onExportPdf={handleExportPdf}
        onExportExcel={handleExportExcel}
        // ✅ Passing new update props to content
        onUpdateStatus={handleUpdateStatus}
        isUpdatingStatus={updateStatusMutation.isPending}
      />
    </Sidebar>
  );
};

export default TourPlanPage;