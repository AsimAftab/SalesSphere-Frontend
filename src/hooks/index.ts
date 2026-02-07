// Table Selection
export { useTableSelection } from './useTableSelection';

// Pagination
export { usePagination } from './usePagination';
export type { UsePaginationOptions, UsePaginationReturn } from './usePagination';

// Search
export { useSearch, useSimpleSearch } from './useSearch';
export type { UseSearchOptions, UseSearchReturn } from './useSearch';

// Modal State
export { useModalState, useMultiModal, MODAL_NAMES } from './useModalState';
export type { ModalState, UseModalStateReturn, UseMultiModalReturn } from './useModalState';

// Filter
export { useFilter } from './useFilter';
export type { FilterConfig, FilterValue, UseFilterOptions, UseFilterReturn } from './useFilter';

// List State (Combined pagination, search, filter)
export { useListState } from './useListState';
export type { ListStateOptions, ListStateReturn } from './useListState';

// Entity Manager (Factory hook for entity management)
export { useEntityManager } from './useEntityManager';
export type { EntityManagerConfig, EntityManagerState, EntityManagerActions, EntityManagerReturn } from './useEntityManager';

// Optimistic Mutations (React Query helpers)
export { useOptimisticMutation, useOptimisticDelete, useOptimisticUpdate } from './useOptimisticMutation';
export type { OptimisticMutationConfig } from './useOptimisticMutation';
