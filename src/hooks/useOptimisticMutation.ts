/**
 * useOptimisticMutation - Optimistic Updates for React Query
 *
 * Provides a reusable pattern for mutations with optimistic updates,
 * automatic rollback on error, and cache invalidation.
 *
 * Benefits:
 * - Instant UI feedback (no loading delay)
 * - Automatic rollback on failure
 * - Consistent error handling
 * - Type-safe mutations
 *
 * Usage:
 * ```tsx
 * const { mutate, isLoading } = useOptimisticMutation({
 *   queryKey: ['todos'],
 *   mutationFn: updateTodo,
 *   updateCache: (oldData, newItem) => oldData.map(item =>
 *     item.id === newItem.id ? { ...item, ...newItem } : item
 *   ),
 *   onSuccessMessage: 'Todo updated!',
 *   onErrorMessage: 'Failed to update todo',
 * });
 * ```
 */

import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export interface OptimisticMutationConfig<TData, TVariables, TContext = unknown> {
  /** Query key to update optimistically */
  queryKey: QueryKey;
  /** The mutation function */
  mutationFn: (variables: TVariables) => Promise<TData>;
  /** Function to update cached data optimistically */
  updateCache: (oldData: TData | undefined, variables: TVariables) => TData | undefined;
  /** Success toast message (optional) */
  onSuccessMessage?: string | ((data: TData, variables: TVariables) => string);
  /** Error toast message (optional) */
  onErrorMessage?: string | ((error: Error, variables: TVariables) => string);
  /** Additional query keys to invalidate on success */
  invalidateKeys?: QueryKey[];
  /** Callback on success */
  onSuccess?: (data: TData, variables: TVariables, context: TContext | undefined) => void;
  /** Callback on error */
  onError?: (error: Error, variables: TVariables, context: TContext | undefined) => void;
  /** Callback on settled (success or error) */
  onSettled?: (
    data: TData | undefined,
    error: Error | null,
    variables: TVariables,
    context: TContext | undefined
  ) => void;
}

export function useOptimisticMutation<TData, TVariables, TContext = { previousData: TData | undefined }>({
  queryKey,
  mutationFn,
  updateCache,
  onSuccessMessage,
  onErrorMessage,
  invalidateKeys = [],
  onSuccess,
  onError,
  onSettled,
}: OptimisticMutationConfig<TData, TVariables, TContext>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,

    // Optimistic update
    onMutate: async (variables: TVariables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData<TData>(queryKey);

      // Optimistically update the cache
      if (previousData !== undefined) {
        const newData = updateCache(previousData, variables);
        if (newData !== undefined) {
          queryClient.setQueryData<TData>(queryKey, newData);
        }
      }

      // Return context with snapshot
      return { previousData } as TContext;
    },

    // Rollback on error
    onError: (error: Error, variables: TVariables, context: TContext | undefined) => {
      // Rollback to previous data
      const ctx = context as { previousData?: TData } | undefined;
      if (ctx?.previousData !== undefined) {
        queryClient.setQueryData<TData>(queryKey, ctx.previousData);
      }

      // Show error toast
      if (onErrorMessage) {
        const message =
          typeof onErrorMessage === 'function'
            ? onErrorMessage(error, variables)
            : onErrorMessage;
        toast.error(message);
      }

      // Call custom error handler
      onError?.(error, variables, context);
    },

    // Success handling
    onSuccess: (data: TData, variables: TVariables, context: TContext | undefined) => {
      // Show success toast
      if (onSuccessMessage) {
        const message =
          typeof onSuccessMessage === 'function'
            ? onSuccessMessage(data, variables)
            : onSuccessMessage;
        toast.success(message);
      }

      // Call custom success handler
      onSuccess?.(data, variables, context);
    },

    // Always refetch after mutation
    onSettled: (
      data: TData | undefined,
      error: Error | null,
      variables: TVariables,
      context: TContext | undefined
    ) => {
      // Invalidate main query
      queryClient.invalidateQueries({ queryKey });

      // Invalidate additional keys
      invalidateKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });

      // Call custom settled handler
      onSettled?.(data, error, variables, context);
    },
  });
}

/**
 * Helper for creating optimistic delete mutations
 */
export function useOptimisticDelete<TData extends { id: string }[]>({
  queryKey,
  mutationFn,
  onSuccessMessage = 'Item deleted successfully',
  onErrorMessage = 'Failed to delete item',
  invalidateKeys = [],
  onSuccess,
}: {
  queryKey: QueryKey;
  mutationFn: (id: string) => Promise<void>;
  onSuccessMessage?: string;
  onErrorMessage?: string;
  invalidateKeys?: QueryKey[];
  onSuccess?: () => void;
}) {
  return useOptimisticMutation<TData, string>({
    queryKey,
    mutationFn: async (id) => {
      await mutationFn(id);
      return undefined as unknown as TData; // Return type for delete
    },
    updateCache: (oldData, id) => {
      if (!oldData) return oldData;
      return oldData.filter((item) => item.id !== id) as TData;
    },
    onSuccessMessage,
    onErrorMessage,
    invalidateKeys,
    onSuccess: onSuccess ? () => onSuccess() : undefined,
  });
}

/**
 * Helper for creating optimistic update mutations
 */
export function useOptimisticUpdate<TData extends { id: string }[], TUpdateData extends { id: string }>({
  queryKey,
  mutationFn,
  onSuccessMessage = 'Item updated successfully',
  onErrorMessage = 'Failed to update item',
  invalidateKeys = [],
  onSuccess,
}: {
  queryKey: QueryKey;
  mutationFn: (data: TUpdateData) => Promise<TUpdateData>;
  onSuccessMessage?: string;
  onErrorMessage?: string;
  invalidateKeys?: QueryKey[];
  onSuccess?: (data: TUpdateData) => void;
}) {
  return useOptimisticMutation<TUpdateData, TUpdateData>({
    queryKey,
    mutationFn,
    updateCache: (oldData, newItem) => {
      if (!oldData) return oldData;
      return (oldData as unknown as TData).map((item) =>
        item.id === newItem.id ? { ...item, ...newItem } : item
      ) as unknown as TUpdateData;
    },
    onSuccessMessage,
    onErrorMessage,
    invalidateKeys,
    onSuccess,
  });
}

export default useOptimisticMutation;
