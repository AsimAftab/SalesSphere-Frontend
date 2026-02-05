import { useState, useCallback } from 'react';

export interface ModalState<T = unknown> {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Data associated with the modal */
  data: T | null;
}

export interface UseModalStateReturn<T = unknown> {
  /** Current modal state */
  state: ModalState<T>;
  /** Whether modal is open */
  isOpen: boolean;
  /** Open the modal with optional data */
  open: (data?: T) => void;
  /** Close the modal */
  close: () => void;
  /** Toggle modal open/close */
  toggle: () => void;
  /** Get modal data */
  getData: () => T | null;
  /** Set modal data without changing open state */
  setData: (data: T | null) => void;
}

/**
 * Hook for managing single modal state
 */
export function useModalState<T = unknown>(
  initialData: T | null = null
): UseModalStateReturn<T> {
  const [state, setState] = useState<ModalState<T>>({
    isOpen: false,
    data: initialData,
  });

  const open = useCallback((data?: T) => {
    setState({
      isOpen: true,
      data: data ?? null,
    });
  }, []);

  const close = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  const toggle = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: !prev.isOpen,
    }));
  }, []);

  const getData = useCallback(() => state.data, [state.data]);

  const setData = useCallback((data: T | null) => {
    setState((prev) => ({
      ...prev,
      data,
    }));
  }, []);

  return {
    state,
    isOpen: state.isOpen,
    open,
    close,
    toggle,
    getData,
    setData,
  };
}

/**
 * Hook for managing multiple named modals
 */
export interface UseMultiModalReturn {
  /** Check if a specific modal is open */
  isOpen: (name: string) => boolean;
  /** Open a modal by name with optional data */
  open: <T = unknown>(name: string, data?: T) => void;
  /** Close a modal by name */
  close: (name: string) => void;
  /** Close all modals */
  closeAll: () => void;
  /** Get data for a specific modal */
  getData: <T = unknown>(name: string) => T | null;
  /** Get all modal states */
  modals: Record<string, ModalState>;
}

export function useMultiModal(): UseMultiModalReturn {
  const [modals, setModals] = useState<Record<string, ModalState>>({});

  const isOpen = useCallback(
    (name: string) => modals[name]?.isOpen ?? false,
    [modals]
  );

  const open = useCallback(<T = unknown>(name: string, data?: T) => {
    setModals((prev) => ({
      ...prev,
      [name]: { isOpen: true, data: data ?? null },
    }));
  }, []);

  const close = useCallback((name: string) => {
    setModals((prev) => ({
      ...prev,
      [name]: { ...prev[name], isOpen: false },
    }));
  }, []);

  const closeAll = useCallback(() => {
    setModals((prev) => {
      const closed: Record<string, ModalState> = {};
      Object.keys(prev).forEach((key) => {
        closed[key] = { ...prev[key], isOpen: false };
      });
      return closed;
    });
  }, []);

  const getData = useCallback(
    <T = unknown>(name: string): T | null => {
      return (modals[name]?.data as T) ?? null;
    },
    [modals]
  );

  return {
    isOpen,
    open,
    close,
    closeAll,
    getData,
    modals,
  };
}

// Preset modal names for common use cases
export const MODAL_NAMES = {
  CREATE: 'create',
  EDIT: 'edit',
  DELETE: 'delete',
  VIEW: 'view',
  CONFIRM: 'confirm',
  FILTER: 'filter',
  EXPORT: 'export',
} as const;

export default useModalState;
