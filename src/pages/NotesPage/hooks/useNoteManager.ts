import { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  NoteRepository,
  type Note,
  type CreateNoteRequest
} from '../../../api/notesService';
import { PartyRepository } from '@/api/partyService';
import { ProspectRepository } from '@/api/prospectService';
import { SiteRepository } from '@/api/siteService';
import { useTableSelection } from '@/hooks/useTableSelection';

/**
 * Custom hook for managing Notes page state and operations.
 * Centralizes data fetching, filtering, pagination, selection, and CRUD mutations.
 * Follows the Manager Hook pattern for enterprise-grade state management.
 */
const useNoteManager = (ITEMS_PER_PAGE: number = 10) => {
  const queryClient = useQueryClient();

  // --- UI & Filter State ---
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    date: null as Date | null,
    employees: [] as string[],
    entityTypes: [] as string[],
    months: [] as string[],
  });

  // --- 1. Data Fetching (Notes + Entity Lists) ---
  const { data: notes = [], isFetching } = useQuery<Note[]>({
    queryKey: ["notes-list"],
    queryFn: NoteRepository.getAllNotes,
  });

  const { data: parties = [] } = useQuery({
    queryKey: ["parties-list"],
    queryFn: () => PartyRepository.getParties()
  });

  const { data: prospects = [] } = useQuery({
    queryKey: ["prospects-list"],
    queryFn: () => ProspectRepository.getProspects()
  });

  const { data: sites = [] } = useQuery({
    queryKey: ["sites-list"],
    queryFn: () => SiteRepository.getSites()
  });

  // --- 2. Mutations ---
  const createMutation = useMutation({
    mutationFn: async ({ data, files }: { data: CreateNoteRequest, files: File[] }) => {
      const newNote = await NoteRepository.createNote(data);
      if (files.length > 0) {
        await Promise.all(
          files.map((file, index) =>
            NoteRepository.uploadNoteImage(newNote.id, index + 1, file)
          )
        );
      }
      return newNote;
    },
    onSuccess: () => {
      toast.success("Note created successfully!");
      queryClient.invalidateQueries({ queryKey: ["notes-list"] });
    },
    onError: (err: Error) => toast.error(err.message || "Failed to create note"),
  });

  // --- 3. Filtering Logic ---
  const filteredData = useMemo(() => {
    return notes.filter((note) => {
      const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.createdBy.name.toLowerCase().includes(searchQuery.toLowerCase());

      const entityType = note.partyName ? "Party" : note.prospectName ? "Prospect" : note.siteName ? "Site" : "General";
      const matchesEntityType = filters.entityTypes.length === 0 || filters.entityTypes.includes(entityType);

      const noteDateString = note.createdAt.split('T')[0];
      const matchesDate = !filters.date || (() => {
        const year = filters.date.getFullYear();
        const month = String(filters.date.getMonth() + 1).padStart(2, '0');
        const day = String(filters.date.getDate()).padStart(2, '0');
        return noteDateString === `${year}-${month}-${day}`;
      })();

      const matchesMonth = filters.months.length === 0 || (() => {
        const monthName = new Date(note.createdAt).toLocaleString('en-US', { month: 'long' });
        return filters.months.includes(monthName);
      })();

      const matchesEmployee = filters.employees.length === 0 || filters.employees.includes(note.createdBy.name);

      return matchesSearch && matchesEntityType && matchesDate && matchesMonth && matchesEmployee;
    });
  }, [notes, searchQuery, filters]);

  // --- 4. Pagination Logic ---
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedNotes = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // --- 5. Selection Logic ---
  const { selectedIds, toggleRow, clearSelection, selectMultiple } = useTableSelection(paginatedNotes);

  const selectAll = useCallback((ids: string[]) => {
    if (ids.length > 0) selectMultiple(ids);
    else clearSelection();
  }, [selectMultiple, clearSelection]);

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => NoteRepository.bulkDeleteNotes(ids),

    // Optimistic delete
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: ["notes-list"] });
      const previousNotes = queryClient.getQueryData<Note[]>(["notes-list"]);

      if (previousNotes) {
        queryClient.setQueryData<Note[]>(["notes-list"],
          previousNotes.filter(note => !ids.includes(note.id))
        );
      }

      return { previousNotes };
    },

    onSuccess: () => {
      toast.success("Notes deleted successfully");
      clearSelection();
      queryClient.invalidateQueries({ queryKey: ["notes-list"] });
    },

    onError: (_error, _ids, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(["notes-list"], context.previousNotes);
      }
      toast.error("Failed to delete notes");
    },
  });

  const employeeOptions = useMemo(() => Array.from(new Set(notes.map(n => n.createdBy.name))), [notes]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setFilters({ date: null, employees: [], entityTypes: [], months: [] });
    setCurrentPage(1);
    clearSelection();
  };

  return {
    // Data
    notes: filteredData,         // Full filtered list (for legacy/export)
    paginatedNotes,              // Sliced data for table
    parties,
    prospects,
    sites,
    isFetching,

    // Pagination
    currentPage,
    setCurrentPage,
    totalPages,                  // New: Calculated in hook
    totalItems,                  // New
    itemsPerPage: ITEMS_PER_PAGE,// New

    // Search & Filter
    searchQuery,
    setSearchQuery,
    isFilterVisible,
    setIsFilterVisible,
    filters,
    setFilters,
    employeeOptions,
    onResetFilters: handleResetFilters,

    // Selection (New)
    selectedIds,
    toggleSelection: toggleRow,
    selectAll,
    clearSelection,

    // Actions
    handleCreateNote: (data: CreateNoteRequest, files: File[]) =>
      createMutation.mutateAsync({ data, files }),

    handleBulkDelete: (ids: string[]) => bulkDeleteMutation.mutateAsync(ids),
    isCreating: createMutation.isPending,
    isDeleting: bulkDeleteMutation.isPending,
  };
};

export default useNoteManager;