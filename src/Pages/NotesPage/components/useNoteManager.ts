import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  NoteRepository,
  type Note,
  type CreateNoteRequest
} from '../../../api/notesService';
import { PartyRepository } from '../../../api/partyService';
import { ProspectRepository } from '../../../api/prospectService';
import { SiteRepository } from '../../../api/siteService';

/**
 * Custom hook for managing Notes page state and operations.
 * Centralizes data fetching, filtering, pagination, and CRUD mutations.
 * Follows the Manager Hook pattern for enterprise-grade state management.
 * 
 * @returns Object containing notes data, filter state, actions, and loading states
 * 
 * @example
 * ```tsx
 * const manager = useNoteManager();
 * // Access filtered notes: manager.notes
 * // Create note: manager.handleCreateNote(data, files)
 * // Delete notes: manager.handleBulkDelete(ids)
 * ```
 */
const useNoteManager = () => {
  const queryClient = useQueryClient();

  // --- UI & Filter State ---
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
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

  // Fetching lists for the SearchableSelect dropdowns
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

  // --- 2. Mutations (Sequential Creation + Upload) ---
  const createMutation = useMutation({
    // Handles two arguments by wrapping them in an object
    mutationFn: async ({ data, files }: { data: CreateNoteRequest, files: File[] }) => {
      // Step 1: Create the text record
      const newNote = await NoteRepository.createNote(data);

      // Step 2: If files exist, upload them to the newly created ID
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

  const employeeOptions = useMemo(() => Array.from(new Set(notes.map(n => n.createdBy.name))), [notes]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setFilters({ date: null, employees: [], entityTypes: [], months: [] });
    setCurrentPage(1);
    setSelectedIds([]);
  };

  return {
    // Data (Including new entity lists for Modal)
    notes: filteredData,
    parties,
    prospects,
    sites,
    isFetching,

    // Pagination & Search
    currentPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery,

    // Filter UI
    isFilterVisible,
    setIsFilterVisible,
    filters,
    setFilters,
    employeeOptions,
    onResetFilters: handleResetFilters,

    // Selection
    selectedIds,
    setSelectedIds,

    // Updated Action Signature
    handleCreateNote: (data: CreateNoteRequest, files: File[]) =>
      createMutation.mutateAsync({ data, files }),

    handleBulkDelete: (ids: string[]) => bulkDeleteMutation.mutateAsync(ids),
    isCreating: createMutation.isPending,
    isDeleting: bulkDeleteMutation.isPending,
  };
};

export default useNoteManager;