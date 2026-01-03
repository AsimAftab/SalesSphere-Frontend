// src/Pages/NotesPage/components/useNoteManager.ts
import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { 
  NoteRepository, 
  type Note, 
  type CreateNoteRequest 
} from '../../../api/notesService';

const useNoteManager = () => {
  const queryClient = useQueryClient();
  
  // --- 1. Basic UI State ---
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // --- 2. Advanced Filter State ---
  const [filters, setFilters] = useState({
    date: null as Date | null,
    employees: [] as string[],
    entityTypes: [] as string[], // Party, Prospect, Site
    months: [] as string[],
  });

  // --- 3. Data Fetching ---
  const { data: notes = [], isFetching } = useQuery<Note[]>({
    queryKey: ["notes-list"],
    queryFn: NoteRepository.getAllNotes,
  });

  // --- 4. Mutations ---
  const createMutation = useMutation({
    mutationFn: (data: CreateNoteRequest) => NoteRepository.createNote(data),
    onSuccess: () => {
      toast.success("Note created successfully!");
      queryClient.invalidateQueries({ queryKey: ["notes-list"] });
    },
    onError: (err: any) => toast.error(err.message || "Failed to create note"),
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => NoteRepository.bulkDeleteNotes(ids),
    onSuccess: () => {
      toast.success("Notes deleted successfully");
      setSelectedIds([]); 
      queryClient.invalidateQueries({ queryKey: ["notes-list"] });
    },
  });

  // --- 5. Centralized Filtering Logic (Enterprise Pattern) ---
  const filteredData = useMemo(() => {
    return notes.filter((note) => {
      // 1. Search: Title or Creator
      const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            note.createdBy.name.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Entity Type Logic (Party, Prospect, Site)
      const entityType = note.partyName ? "Party" : note.prospectName ? "Prospect" : note.siteName ? "Site" : "General";
      const matchesEntityType = filters.entityTypes.length === 0 || filters.entityTypes.includes(entityType);

      // --- 3. FIXED DATE LOGIC: Exact match (YYYY-MM-DD) ---
      // Extract YYYY-MM-DD from the note's ISO string (stored in UTC)
      const noteDateString = note.createdAt.split('T')[0];

      const matchesDate = !filters.date || (() => {
        // Manually construct the string using local date methods to avoid UTC shifts
        const year = filters.date.getFullYear();
        const month = String(filters.date.getMonth() + 1).padStart(2, '0');
        const day = String(filters.date.getDate()).padStart(2, '0');
        const localFilterDate = `${year}-${month}-${day}`;

        return noteDateString === localFilterDate;
      })();

      // 4. Month: Based on createdAt
      const matchesMonth = filters.months.length === 0 || (() => {
        const monthName = new Date(note.createdAt).toLocaleString('en-US', { month: 'long' });
        return filters.months.includes(monthName);
      })();

      // 5. Employee: CreatedBy filter
      const matchesEmployee = filters.employees.length === 0 || filters.employees.includes(note.createdBy.name);

      return matchesSearch && matchesEntityType && matchesDate && matchesMonth && matchesEmployee;
    });
  }, [notes, searchQuery, filters]);

  // --- 6. Derived Options for Dropdowns ---
  const employeeOptions = useMemo(() => 
    Array.from(new Set(notes.map(n => n.createdBy.name))), 
  [notes]);

  // --- 7. Reset Logic ---
  const handleResetFilters = () => {
    setSearchQuery("");
    setFilters({ date: null, employees: [], entityTypes: [], months: [] });
    setCurrentPage(1);
    setSelectedIds([]);
  };

  return {
    // Data
    notes: filteredData,
    isFetching,
    
    // Pagination & Search
    currentPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    
    // Filter Visibility
    isFilterVisible,
    setIsFilterVisible,
    
    // Filter Values & Setters (passed to NoteContent)
    filters,
    setFilters,
    employeeOptions,
    onResetFilters: handleResetFilters,
    
    // Selection
    selectedIds,
    setSelectedIds,
    
    // Actions & Mutations
    handleCreateNote: (data: CreateNoteRequest) => createMutation.mutateAsync(data),
    handleBulkDelete: (ids: string[]) => bulkDeleteMutation.mutateAsync(ids),
    isCreating: createMutation.isPending,
    isDeleting: bulkDeleteMutation.isPending,
  };
};

export default useNoteManager;