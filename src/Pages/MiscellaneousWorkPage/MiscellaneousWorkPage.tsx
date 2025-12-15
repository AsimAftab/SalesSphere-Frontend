// /src/Pages/MiscellaneousWorkPage/MiscellaneousWorkPage.tsx

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "../../components/layout/Sidebar/Sidebar";

// Import types and services
import {
  getMiscWorks,
  type GetMiscWorksOptions,
  type GetMiscWorksResponse,
} from "../../api/miscellaneousWorkService";
import ViewImageModal from "../../components/modals/ViewImageModal";

// Import the Content component and Skeleton
import MiscellaneousWorkContent, { MiscWorkSkeleton } from "./MiscellaneousWorkContent";

// --- QUERY KEYS ---
const MISC_WORK_KEYS = {
  all: ["misc-works"] as const,
  list: (filters: GetMiscWorksOptions) =>
    [...MISC_WORK_KEYS.all, "list", filters] as const,
};

// Helper: Convert Month name to number string ("January" -> "1")
const getMonthNumber = (monthName: string): string | undefined => {
  if (!monthName) return undefined;
  const date = new Date(`${monthName} 1, 2000`);
  return (date.getMonth() + 1).toString();
};

// --- MAIN PAGE COMPONENT ---
const MiscellaneousWorkPage: React.FC = () => {
  
  // --- STATE MANAGEMENT ---
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imagesToView, setImagesToView] = useState<string[]>([]); // UPDATED: Array of strings
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filters
  const [selectedDateFilter, setSelectedDateFilter] = useState<Date | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>(""); 
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());

  const ITEMS_PER_PAGE = 10;

  // --- FILTER QUERY CONSTRUCTION ---
  const listQueryOptions: GetMiscWorksOptions = useMemo(
    () => {
      const options: GetMiscWorksOptions = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      };

      if (selectedDateFilter) {
        // Format Date to YYYY-MM-DD for backend
        // Adjusting for timezone to ensure the correct day is sent
        const year = selectedDateFilter.getFullYear();
        const month = String(selectedDateFilter.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDateFilter.getDate()).padStart(2, '0');
        options.date = `${year}-${month}-${day}`;
      } else if (selectedMonth) {
        options.month = getMonthNumber(selectedMonth);
        options.year = selectedYear;
      }
      
      return options;
    },
    [currentPage, selectedDateFilter, selectedMonth, selectedYear]
  );

  // --- DATA FETCHING ---
  const {
    data: listResponse,
    isLoading: isLoadingList,
    error: listError,
    isFetching: isFetchingList,
  } = useQuery<GetMiscWorksResponse, Error>({
    queryKey: MISC_WORK_KEYS.list(listQueryOptions),
    queryFn: () => getMiscWorks(listQueryOptions),
    placeholderData: (prev) => prev, // Keep previous data while fetching new page/filter
  });

  const tableData = listResponse?.data || [];
  const totalItems = listResponse?.pagination.total || 0;
  const totalPages = listResponse?.pagination.pages || 1;

  // Handler for opening modal with multiple images
  const handleViewImage = (images: string[]) => {
    setImagesToView(images);
    setIsImageModalOpen(true);
  };

  if (isLoadingList && !listResponse) {
    return (
      <Sidebar>
        <MiscWorkSkeleton />
      </Sidebar>
    );
  }

  if (listError) {
    return (
      <Sidebar>
        <div className="p-6 text-center text-red-600">
          Error loading miscellaneous work data.
        </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <MiscellaneousWorkContent
        tableData={tableData}
        isFetchingList={isFetchingList}
        
        // Date Props
        selectedDateFilter={selectedDateFilter}
        setSelectedDateFilter={setSelectedDateFilter}
        
        // Month/Year Props
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        
        // Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        ITEMS_PER_PAGE={ITEMS_PER_PAGE}
        
        // Actions
        handleViewImage={handleViewImage}
      />

      {/* Modals */}
      <ViewImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        images={imagesToView} // Pass the array
        title="Attached Work Images"
      />

    </Sidebar>
  );
};

export default MiscellaneousWorkPage;