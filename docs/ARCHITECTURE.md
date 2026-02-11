# SalesSphere Frontend - Architecture Guide

This document describes the architecture, patterns, and conventions used in the SalesSphere Frontend codebase.

## Table of Contents

- [Overview](#overview)
- [Folder Structure](#folder-structure)
- [Page Architecture](#page-architecture)
- [Hook Patterns](#hook-patterns)
- [Naming Conventions](#naming-conventions)
- [Testing Strategy](#testing-strategy)
- [State Management](#state-management)
- [API Layer](#api-layer)

---

## Overview

SalesSphere Frontend is a React + TypeScript application built with:

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Query (TanStack Query)** - Server state management
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Vitest** - Testing framework

### Key Principles

1. **Separation of Concerns** - UI, business logic, and data fetching are separated
2. **Single Responsibility** - Each hook/component does one thing well
3. **Composition over Inheritance** - Small hooks composed into larger ones
4. **Testability** - Pure functions and hooks that are easy to test

---

## Folder Structure

```
src/
├── api/                    # API services and types
│   ├── SuperAdmin/         # SuperAdmin services with index.ts barrel export
│   │   ├── index.ts
│   │   ├── organizationService.ts
│   │   └── ...
│   ├── authService.ts
│   ├── employeeService.ts
│   ├── expenseService.ts   # Note: singular naming
│   └── ...
├── components/
│   ├── layout/             # Layout components (Sidebar, Header)
│   ├── modals/             # Modal components organized by domain
│   │   ├── Entities/
│   │   │   ├── components/  # (was sections/)
│   │   │   └── ...
│   │   ├── Collections/
│   │   │   └── hooks/       # Modal-specific hooks
│   │   └── Product/
│   └── ui/                 # Reusable UI components
├── hooks/                  # Shared hooks (useTableSelection, useDebounce, useLocationServices)
├── pages/                  # Page components (see Page Architecture)
│   ├── EntityPages/        # Container for entity pages
│   ├── OdometerPages/      # Container for odometer pages
│   ├── SuperAdminPages/    # Container for super admin pages
│   └── ...
├── utils/                  # Utility functions
└── types/                  # Shared TypeScript types

tests/
├── unit/
│   ├── api/               # API service tests
│   ├── components/        # Component tests
│   ├── hooks/             # Shared hook tests
│   ├── pages/             # Page-specific tests
│   └── utils/             # Utility tests
├── integration/           # Integration tests (future)
└── e2e/                   # End-to-end tests (future)
```

---

## Page Architecture

Every page follows the **Container/Content pattern**:

```
PageNamePage/
├── PageNamePage.tsx           # Container (thin, ~20-50 lines)
├── PageNameContent.tsx        # Presentation (UI only)
├── index.ts                   # Barrel export
├── types.ts                   # Page-specific types
├── hooks/                     # Hooks MUST be here, NOT in components/
│   ├── index.ts               # Barrel export for hooks
│   ├── usePageNameData.ts     # Data fetching (React Query)
│   ├── usePageNameFilters.ts  # Search/filter/pagination logic
│   ├── usePageNameActions.ts  # Mutations (create, update, delete)
│   ├── usePageNamePermissions.ts # Permission checks
│   └── usePageNameManager.ts  # Facade hook composing others
├── components/
│   ├── PageNameHeader.tsx     # Page-specific header
│   ├── PageNameTable.tsx      # Table/list component
│   ├── PageNameSkeleton.tsx   # Loading skeleton
│   └── PageNameExportService.tsx  # Export service (PDF/Excel)
└── utils/                     # Helper functions
```

### Container Component (PageNamePage.tsx)

The container is responsible for:
- Calling hooks to get data and actions
- Passing props to the content component
- Wrapping with error boundaries

```tsx
// Example: EmployeePage.tsx
const EmployeePage: React.FC = () => {
  const { state, actions, helpers } = useEmployeeManager();

  return (
    <Sidebar>
      <ErrorBoundary>
        <EmployeeContent
          state={state}
          actions={actions}
          helpers={helpers}
        />
      </ErrorBoundary>
    </Sidebar>
  );
};
```

### Content Component (PageNameContent.tsx)

The content component:
- Receives all data via props
- Handles UI rendering only
- Has no business logic

```tsx
// Example: EmployeeContent.tsx
interface EmployeeContentProps {
  state: { /* ... */ };
  actions: { /* ... */ };
  helpers: { /* ... */ };
}

const EmployeeContent: React.FC<EmployeeContentProps> = ({ state, actions, helpers }) => {
  // Pure UI rendering
};
```

---

## Hook Patterns

### 1. Data Hook (usePageNameData)

Handles data fetching with React Query:

```tsx
export const useEmployeeData = () => {
  const employeesQuery = useQuery({
    queryKey: ['employees'],
    queryFn: getEmployees,
  });

  return {
    employees: employeesQuery.data || [],
    isLoading: employeesQuery.isLoading,
    error: employeesQuery.error,
  };
};
```

### 2. Filters Hook (usePageNameFilters)

Handles search, filtering, and pagination:

```tsx
export const useEmployeeFilters = ({ employees }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    return employees.filter(/* filter logic */);
  }, [employees, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredData,
    pagination: { currentPage, setCurrentPage, /* ... */ }
  };
};
```

### 3. Actions Hook (usePageNameActions)

Handles mutations and side effects:

```tsx
export const useEmployeeActions = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: addEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee created!');
    },
  });

  return {
    create: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
};
```

### 4. Permissions Hook (usePageNamePermissions)

Centralizes permission checks:

```tsx
export const useEmployeePermissions = () => {
  const { hasPermission } = useAuth();

  return useMemo(() => ({
    canCreate: hasPermission('employees', 'create'),
    canExport: hasPermission('employees', 'exportPdf'),
  }), [hasPermission]);
};
```

### 5. Facade Hook (usePageNameManager)

Composes smaller hooks into a unified interface:

```tsx
export const useEmployeeManager = () => {
  const permissions = useEmployeePermissions();
  const { employees, isLoading, error } = useEmployeeData();
  const { searchTerm, setSearchTerm, filteredData } = useEmployeeFilters({ employees });
  const { create, isCreating } = useEmployeeActions();

  return {
    state: { employees, filteredData, isLoading, permissions },
    actions: { setSearchTerm, create },
  };
};
```

---

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Page folders | PascalCase + "Page" | `EmployeePage/` |
| Page components | PascalCase + "Page" | `EmployeePage.tsx` |
| Content components | PascalCase + "Content" | `EmployeeContent.tsx` |
| Hook files | camelCase with "use" prefix | `useEmployeeData.ts` |
| Utility files | camelCase + "Helpers/Utils" | `attendanceHelpers.ts` |
| Component files | PascalCase | `EmployeeTable.tsx` |
| Test files | Same name + `.test.ts` | `useEmployeeData.test.ts` |
| Generic folders | lowercase | `hooks/`, `components/`, `utils/` |
| Container folders | PascalCase + "Pages" suffix | `SuperAdminPages/`, `EntityPages/` |
| API services | Singular naming | `expenseService.ts` (not `expensesService.ts`) |
| Modal subfolders | Use `components/` | `components/` (not `sections/`) |
| Barrel exports | Every folder should have | `index.ts` |

---

## Testing Strategy

### Test Location

All tests are centralized in `tests/unit/` mirroring the source structure:

```
tests/unit/
├── pages/
│   ├── employee/
│   │   ├── useEmployeeData.test.ts
│   │   ├── useEmployeeFilters.test.ts
│   │   └── useEmployeeManager.test.ts
│   └── orders/
│       └── useOrderManager.test.ts
└── components/
    └── modals/
        └── product/
            └── useBulkUpload.test.ts
```

### What to Test

1. **Hooks** - Test business logic, filtering, calculations
2. **Utils** - Test pure functions
3. **API Services** - Test data transformation

### Test Structure

```tsx
describe('useEmployeeFilters', () => {
  describe('Search Filtering', () => {
    it('should filter by employee name', () => {
      // Arrange
      const { result } = renderHook(() => useEmployeeFilters({ employees }));

      // Act
      act(() => {
        result.current.setSearchTerm('John');
      });

      // Assert
      expect(result.current.filteredData).toHaveLength(1);
    });
  });
});
```

### Running Tests

```bash
npm test           # Watch mode
npm test -- --run  # Single run
npm run coverage   # With coverage
```

---

## State Management

### Server State (React Query)

All server data is managed with React Query:

```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ['employees'],
  queryFn: getEmployees,
  staleTime: 1000 * 60 * 5, // 5 minutes
});
```

### Client State (useState/useReducer)

Local UI state uses React hooks:

```tsx
const [searchTerm, setSearchTerm] = useState('');
const [isModalOpen, setIsModalOpen] = useState(false);
```

### Query Keys Convention

```tsx
// List queries
queryKey: ['employees']
queryKey: ['orders']

// Single item queries
queryKey: ['employee', employeeId]
queryKey: ['order', orderId]

// Filtered queries
queryKey: ['attendance', month, year]
```

---

## API Layer

### Service Structure

Each domain has a service file in `src/api/`:

```tsx
// src/api/employeeService.ts

// Types
export interface Employee {
  _id: string;
  name: string;
  email: string;
}

// API functions
export const getEmployees = async (): Promise<Employee[]> => {
  const response = await apiClient.get('/employees');
  return response.data;
};

export const addEmployee = async (data: FormData): Promise<Employee> => {
  const response = await apiClient.post('/employees', data);
  return response.data;
};
```

### Error Handling

Errors are handled at the mutation level with toast notifications:

```tsx
const mutation = useMutation({
  mutationFn: addEmployee,
  onError: (error) => {
    toast.error(error.message || 'Failed to create employee');
  },
});
```

---

## Quick Reference

### Adding a New Page

1. Create folder: `src/pages/NewFeaturePage/`
2. Create container: `NewFeaturePage.tsx`
3. Create content: `NewFeatureContent.tsx`
4. Create `index.ts` for barrel export
5. Create `types.ts` for page-specific types
6. Create hooks in `hooks/` folder (NOT in `components/`)
7. Create `hooks/index.ts` for hooks barrel export
8. Add route in `AppRoutes.tsx`
9. Add tests in `tests/unit/pages/newfeature/`

### Adding a New Hook

1. Create file: `useFeatureName.ts` in the page's `hooks/` folder
2. Export types if needed
3. Add export to `hooks/index.ts` barrel file
4. Create test: `tests/unit/.../useFeatureName.test.ts`
5. Import in facade hook if applicable

### Checklist for New Features

- [ ] Page follows Container/Content pattern
- [ ] Hooks are in `hooks/` folder (not `components/`)
- [ ] Barrel exports (`index.ts`) created for page and hooks
- [ ] Page-specific types in `types.ts`
- [ ] Hooks are split by responsibility
- [ ] Types are defined
- [ ] Tests are written
- [ ] Permissions are checked
- [ ] Loading states handled
- [ ] Error states handled

---

## Additional Resources

- [React Query Documentation](https://tanstack.com/query/latest)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
