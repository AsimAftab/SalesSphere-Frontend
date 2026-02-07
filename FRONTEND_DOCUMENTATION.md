# SalesSphere Frontend - Complete Repository Documentation

## Overview

**SalesSphere** is a comprehensive Sales Force Automation (SFA) and Field Force Management platform built with modern React and TypeScript. It provides enterprise-grade tools for sales teams, field force management, CRM, and real-time operations tracking.

### Core Capabilities
- **Real-time Tracking**: GPS-based employee tracking with Socket.io integration
- **Sales Management**: Complete order, invoice, and estimate lifecycle management
- **CRM**: Party (customer) and prospect management with conversion tracking
- **Field Operations**: Beat planning, tour planning, and route optimization
- **HR Management**: Attendance, leaves, expenses, and employee management
- **Analytics**: Comprehensive dashboards with Recharts visualizations
- **Multi-tenancy**: Organization-based isolation with subscription management
- **Role-based Access**: Granular permissions and feature-level access control

### Architecture Highlights
- **SPA Architecture**: Single Page Application with React Router v7
- **Type-safe**: Full TypeScript implementation with strict type checking
- **Modern Build**: Vite 7.1.7 with HMR and optimized production builds
- **Lazy Loading**: Code-splitting for improved performance
- **Real-time**: WebSocket integration via Socket.io for live updates
- **Responsive**: Mobile-first design with Tailwind CSS
- **Secure**: CSRF protection, JWT authentication, HTTP-only cookies

---

## Technology Stack

### Core Framework & Language
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.3 | UI library with concurrent features |
| **TypeScript** | 5.9.3 | Type-safe JavaScript with strict checking |
| **Vite** | 7.1.7 | Build tool with lightning-fast HMR |

### State Management & Data Fetching
| Technology | Version | Purpose |
|------------|---------|---------|
| **TanStack React Query** | 5.90.5 | Server state management with 5-min cache |
| **React Context API** | React 19 | Global state for modals, socket, auth |
| **Socket.io-client** | 4.8.1 | Real-time bidirectional communication |

### Routing & Navigation
| Technology | Version | Purpose |
|------------|---------|---------|
| **React Router DOM** | 7.9.6 | Declarative routing with nested routes |

### Styling & UI
| Technology | Version | Purpose |
|------------|---------|---------|
| **TailwindCSS** | 3.4.18 | Utility-first CSS framework |
| **Framer Motion** | 12.23.24 | Animation library for smooth transitions |
| **Radix UI** | Various | Accessible, unstyled component primitives |
| **Lucide React** | 0.545.0 | Primary icon library |
| **Heroicons** | 2.2.0 | Additional icons by Tailwind Labs |
| **React Icons** | 5.5.0 | Popular icon collections |

### Forms & Validation
| Technology | Version | Purpose |
|------------|---------|---------|
| **React Hook Form** | 7.55.0 | Performant form validation |
| **Zod** | 3.25.76 | TypeScript-first schema validation |
| **@hookform/resolvers** | 5.2.2 | Validation resolver integration |

### API & HTTP
| Technology | Version | Purpose |
|------------|---------|---------|
| **Axios** | 1.12.2 | HTTP client with interceptors |

### Data Visualization
| Technology | Version | Purpose |
|------------|---------|---------|
| **Recharts** | 3.2.1 | Composable React charts library |
| **@vis.gl/react-google-maps** | 1.7.0 | Google Maps integration |
| **React-Leaflet** | 5.0.0 | Leaflet maps for tracking |

### Document Generation
| Technology | Version | Purpose |
|------------|---------|---------|
| **@react-pdf/renderer** | 4.3.1 | React components for PDF creation |
| **jsPDF** | 4.0.0 | PDF generation library |
| **ExcelJS** | 4.4.0 | Excel file generation |
| **File-Saver** | 2.0.5 | Client-side file saving |

### UI Enhancement
| Technology | Version | Purpose |
|------------|---------|---------|
| **Sonner** | 2.0.3 | Toast notifications |
| **React Hot Toast** | 2.6.0 | Alternative toast library |
| **CMDK** | 1.1.1 | Command palette interface |
| **Vaul** | 1.1.2 | Drawer component |
| **React Loading Skeleton** | 3.5.0 | Loading states |
| **React Intersection Observer** | 10.0.0 | Lazy loading and visibility detection |

### Utility Libraries
| Technology | Version | Purpose |
|------------|---------|---------|
| **class-variance-authority** | 0.7.1 | CSS class management |
| **clsx** | 2.1.1 | Conditional class names |
| **tailwind-merge** | 2.5.5 | Merge Tailwind classes intelligently |

### Development Tools
| Technology | Version | Purpose |
|------------|---------|---------|
| **ESLint** | 9.36.0 | Code linting and quality |
| **TypeScript ESLint** | 8.45.0 | TypeScript-specific linting |
| **PostCSS** | 8.5.6 | CSS processing |
| **Autoprefixer** | 10.4.21 | CSS vendor prefixing |

---

## Directory Structure

```
SalesSphere-Frontend/
├── public/                 # Static assets
├── src/
│   ├── api/               # API service layer (27 files)
│   │   └── SuperAdmin/    # SuperAdmin services with barrel exports (index.ts)
│   ├── assets/            # Images and icons (41 files)
│   ├── components/        # Reusable UI components (105 files)
│   ├── context/           # React context providers
│   ├── Pages/             # Page-level components (161 files)
│   │   ├── EntityPages/   # Entity management pages container
│   │   │   ├── PartyPage/
│   │   │   ├── ProspectPage/
│   │   │   └── SitePage/
│   │   ├── OdometerPages/ # Odometer-related pages container
│   │   └── SuperAdminPages/ # SuperAdmin pages container
│   ├── styles/            # Global CSS files
│   ├── App.tsx            # Root component
│   ├── AppRoutes.tsx      # Route definitions
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

### Standardized Page Structure
Each page follows this structure:
```
PageName/
├── hooks/                 # Feature-specific hooks
│   ├── usePageData.ts
│   └── index.ts           # Barrel export
├── components/            # Feature-specific components
├── types.ts               # Feature-specific types
└── index.ts               # Barrel export for the page
```

---

## Entry Points

### main.tsx
- Fetches CSRF token before rendering
- Wraps app in `StrictMode` and `BrowserRouter`

### App.tsx
- Configures `QueryClient` with 5min stale time
- Provides `SocketProvider` for real-time features
- Renders `ToastProvider` and `AppRoutes`

---

## API Services Layer (22 Services)

### Core Services
| Service | File | Purpose |
|---------|------|---------|
| **Auth** | authService.ts | Login, logout, JWT, permissions, CSRF |
| **API Base** | api.ts | Axios instance, interceptors |
| **Dashboard** | dashboardService.ts | Dashboard stats |
| **Analytics** | analyticsService.ts | Analytics data |
| **Settings** | settingService.ts | Org settings, roles |

### Entity Services
| Service | File |
|---------|------|
| Employees | employeeService.ts |
| Parties | partyService.ts |
| Prospects | prospectService.ts |
| Sites | siteService.ts |
| Products | productService.ts |

### Operational Services
| Service | File |
|---------|------|
| Orders/Invoices | orderService.ts |
| Estimates | estimateService.ts |
| Attendance | attendanceService.ts |
| Leaves | leaveService.ts |
| Expenses | expenseService.ts |
| Beat Plans | beatPlanService.ts |
| Tour Plans | tourPlanService.ts |
| Live Tracking | liveTrackingService.ts |
| Notes | notesService.ts |
| Misc Work | miscellaneousWorkService.ts |
| Maps | mapService.ts |
| Roles | roleService.ts |

### SuperAdmin Services (5 files + barrel export)
| Service | Purpose |
|---------|---------|
| organizationService.ts | Manage organizations |
| systemUserService.ts | SuperAdmin users |
| activityLogService.ts | Activity logs |
| systemOverviewService.ts | System stats |
| subscriptionPlanService.ts | Plans |
| index.ts | Barrel export for all SuperAdmin services |

---

## Pages - Detailed Description & Routing

### Public Pages (No Authentication Required)

| Route | Page | Description | Links To |
|-------|------|-------------|----------|
| `/` | **Homepage** | Marketing landing page with product features, pricing, and CTAs. Uses public Navbar/Footer. | → Login |
| `/login` | **LoginPage** | User authentication with email/password. Redirects authenticated users away. | → Dashboard, Forgot Password |
| `/forgot-password` | **ForgotPasswordPage** | Password reset request form | → Login |
| `/reset-password/:token` | **ResetPasswordPage** | Set new password using email token | → Login |
| `/contact-admin` | **ContactAdminPage** | Contact form for locked accounts | → Login |

---

### Dashboard & Analytics

| Route | Page | Description | Permission | Links To |
|-------|------|-------------|------------|----------|
| `/dashboard` | **DashboardPage** | Business overview with KPIs, sales trends, attendance summary, team performance cards. Entry point after login. | `dashboard.viewStats` | → All modules |
| `/analytics` | **AnalyticsPage** | Detailed charts: monthly revenue, category sales, top products, top parties. Uses Recharts. | `analytics.viewMonthlyOverview` | — |

---

### Live Tracking

| Route | Page | Description | Permission | Links To |
|-------|------|-------------|------------|----------|
| `/live-tracking` | **LiveTrackingPage** | Real-time Google Maps view of all tracked employees with location markers. Socket.io integration. | `liveTracking.viewLiveTracking` | → Session Details |
| `/live-tracking/session/:sessionId` | **EmployeeTrackingDetailsPage** | View specific tracking session with breadcrumb trail on map | `liveTracking.viewLiveTracking` | ← Live Tracking |
| `/tracking-history` | **TrackingHistoryPage** | Historical tracking session playback | `liveTracking.viewSessionHistory` | — |

---

### Products & Sales

| Route | Page | Description | Permission | Links To |
|-------|------|-------------|------------|----------|
| `/products` | **ProductsPage** | Product catalog with CRUD, bulk upload, search, export. Grid/list view. | `products.viewList` | — |
| `/order-lists` | **OrderListPage** | Tabbed view of Invoices and Estimates. Filters, status badges, export. Handles both modules internally. | `invoices.viewList` OR `estimates.viewList` | → Order Details, Estimate Details, Create Transaction |
| `/sales/create` | **CreateTransactionPage** | Create new invoice/estimate with party selection, product picker, quantities. | `invoices.create` | ← Order Lists |
| `/order/:orderId` | **OrderDetailsPage** | View/edit invoice details, line items, delivery status, PDF export. | `invoices.viewDetails` | ← Order Lists |
| `/estimate/:estimateId` | **EstimateDetailsPage** | View estimate details, convert to invoice. | `estimates.viewDetails` | ← Order Lists |

---

### Employee & HR Management

| Route | Page | Description | Permission | Links To |
|-------|------|-------------|------------|----------|
| `/employees` | **EmployeesPage** | Employee directory with search, filters, add/edit forms. Shows role, status, contact. | `employees.viewList` | → Employee Details |
| `/employees/:employeeId` | **EmployeeDetailsPage** | Full employee profile with personal info, attendance history, documents, hierarchy. Tabbed view. | `employees.viewDetails` | ← Employees |
| `/attendance` | **AttendancePage** | Attendance calendar/table view. Check-in/out times, status badges. Bulk update for admins. | `attendance.viewMyAttendance` | — |
| `/leaves` | **LeavePage** | Leave request management. Create/approve/reject leaves. Status filters. | `leaves.viewList` | — |

---

### CRM Entities (EntityPages/)

| Route | Page | Description | Permission | Links To |
|-------|------|-------------|------------|----------|
| `/parties` | **PartyPage** | Customer/client management. Add parties, assign types, view contact info. Located in `EntityPages/`. | `parties.viewList` | → Party Details |
| `/parties/:partyId` | **PartyDetailsPage** | Party profile with order history, collections, notes, contacts. Located in `EntityPages/`. | `parties.viewDetails` | ← Parties |
| `/prospects` | **ProspectPage** | Lead management. Track potential customers, interests, follow-ups. Located in `EntityPages/`. | `prospects.viewList` | → Prospect Details |
| `/prospects/:prospectId` | **ProspectDetailsPage** | Prospect profile with conversion tracking, activity log. Can convert to Party. Located in `EntityPages/`. | `prospects.viewDetails` | ← Prospects |
| `/sites` | **SitePage** | Location/site management for field operations. Located in `EntityPages/`. | `sites.viewList` | → Site Details |
| `/sites/:siteId` | **SiteDetailsPage** | Site profile with assigned users, activities, photos. Located in `EntityPages/`. | `sites.viewDetails` | ← Sites |

---

### Planning & Field Operations

| Route | Page | Description | Permission | Links To |
|-------|------|-------------|------------|----------|
| `/beat-plan` | **BeatPlanPage** | Sales routes/beat plans list. Shows assigned salespersons, parties to visit. | `beatPlan.viewList` | → Create/Edit Beat Plan |
| `/beat-plan/create` | **CreateBeatPlanPage** | Create new beat plan with party selection, route optimization. | `beatPlan.create` | ← Beat Plan |
| `/beat-plan/edit/:planId` | **EditBeatPlanPage** | Modify existing beat plan details. | `beatPlan.update` | ← Beat Plan |
| `/tour-plan` | **TourPlanPage** | Tour/travel request management. Create requests, track approvals. | `tourPlan.viewList` | → Tour Detail |
| `/tour-plan/:id` | **TourPlanDetailPage** | Tour request details with itinerary, expenses, approval status. | `tourPlan.viewDetails` | ← Tour Plan |

---

### Expenses & Claims

| Route | Page | Description | Permission | Links To |
|-------|------|-------------|------------|----------|
| `/expenses` | **ExpensesPage** | Expense claims list with categories, amounts, approval status. Create/submit claims. | `expenses.viewList` | → Expense Detail |
| `/expenses/:id` | **ExpenseDetailPage** | Single expense claim with receipts, comments, approval workflow. | `expenses.viewDetails` | ← Expenses |

---

### Notes & Miscellaneous

| Route | Page | Description | Permission | Links To |
|-------|------|-------------|------------|----------|
| `/notes` | **NotesPage** | Field notes/memos. Create notes with images, tags, locations. | `notes.viewList` | → Note Detail |
| `/notes/:id` | **NotesDetailPage** | View full note with images, metadata. | `notes.viewDetails` | ← Notes |
| `/miscellaneous-work` | **MiscellaneousWorkPage** | Track non-standard field activities. Log work with photos, descriptions. | `miscellaneousWork.viewList` | — |

---

### Admin & Settings

| Route | Page | Description | Permission | Links To |
|-------|------|-------------|------------|----------|
| `/settings` | **SettingsPage** | User personal settings and preferences. Located in `SettingsPage/` (renamed from `SettingPage/`). | — | — |
| `/admin-panel` | **AdminPanelPage** | Organization admin panel with 4 tabs: **Customization** (logo, colors), **User Role & Permission** (create/edit roles with granular permissions), **Role Hierarchy** (supervisor mapping), **Subscription** (plan details). | `settings.view` | — |

---

### SuperAdmin (Platform Owner) - SuperAdminPages/

| Route | Page | Description | Access | Links To |
|-------|------|-------------|--------|----------|
| `/system-admin` | **SuperAdminPage** | Platform-wide dashboard. Manage organizations, users, subscriptions, view activity logs, system stats. Located in `SuperAdminPages/`. | SuperAdmin/Developer only | → User Profile |
| `/system-admin/users/:userId` | **SystemUserProfilePage** | System user (superadmin/developer) profile management. Located in `SuperAdminPages/`. | SuperAdmin/Developer only | ← System Admin |

---

### Error Pages

| Route | Page | Description |
|-------|------|-------------|
| `*` | **NotFoundPage** | 404 page for non-existent routes |

---

## Components (10 Categories)

### Layout Components
| Component | Purpose |
|-----------|---------|
| Sidebar | Main navigation |
| Navbar | Top navigation |
| Footer | Footer |
| ProtectedLayout | Auth wrapper |

### Auth Components (5 files)
- **AuthGate** - Authentication check
- **PermissionGate** - Permission-based rendering
- **ProtectedRoutes** - Route protection
- **SystemAdminGate** - SuperAdmin access
- **userIdleTimer** - Session timeout

### Modals (22 files)
- **CRUD Modals**: AddProductModal, EditProductModal, EmployeeFormModal, ExpenseFormModal, NoteFormModal, TourPlanFormModal
- **Action Modals**: ConfirmationModal, AttendanceStatusModal, StatusUpdateModal
- **View Modals**: ImagePreviewModal, ViewImageModal, LocationInfoModal, BeatPlanDetailsModal
- **Bulk Modals**: BulkUploadProductsModal, AttendanceBulkUpdateModal
- **SuperAdmin Modals**: AddOrganizationModal, OrganizationDetailsModal, SubscriptionManagementModal, etc.

### UI Components
- **Button/** - Custom button component
- **DatePicker/** - Date selection
- **FilterDropDown/** - Filter controls
- **ToastProvider/** - Toast notifications
- **ProfileCard.tsx** - User profile display
- **statusBadge.tsx** - Status indicators
- **ExportActions.tsx** - Export buttons

### SuperadminComponents (15 Shadcn-style primitives)
alert, alert-dialog, badge, button, card, dialog, input, label, select, separator, table, tabs, textarea, tooltip, utils

### Card Components (6 categories)
- Analytics_cards, BeatPlan_cards, Dashboard_cards, EmployeeDetails_cards, EmployeeTracking_cards, SuperAdmin_cards

### Entity Components
- AddEntityModal, EditEntityModal, sections (shared entity sections)

---

## Key Architecture Patterns

### 1. Authentication & Authorization

#### JWT + HTTP-Only Cookies
- **Access Token**: Stored in HTTP-only cookie (secure, not accessible via JavaScript)
- **Refresh Token**: Stored in HTTP-only cookie with longer expiration
- **CSRF Protection**: Token fetched on app init, sent with state-changing requests
- **Auto-refresh**: Axios interceptor automatically refreshes expired tokens

#### Auth Flow
```
1. User logs in → Server sets HTTP-only cookies (access + refresh tokens)
2. Each API request → Axios attaches credentials automatically
3. Token expires (401) → Interceptor calls /auth/refresh
4. Refresh succeeds → Retry original request
5. Refresh fails → Redirect to /login
```

#### useAuth Hook
Located in `src/api/authService.ts`, provides:
- `user`: Current user object with permissions
- `isLoading`: Auth state loading indicator
- `isAuthenticated`: Boolean authentication status
- `hasPermission(module, feature)`: Check granular permissions
- `isPlanFeatureEnabled(module, feature)`: Check subscription features
- `isFeatureEnabled(module)`: Check if module is enabled
- `isAdmin`: Boolean for admin role check
- `isSuperAdmin`: Boolean for superadmin role
- `isDeveloper`: Boolean for developer role
- `logout()`: Logout function

#### Permission System
```typescript
// Granular permissions structure
permissions: {
  products: {
    view: true,
    create: true,
    update: true,
    delete: false,
    exportPdf: true,
    bulkImport: true
  },
  // ... other modules
}

// Usage in components
const { hasPermission, isPlanFeatureEnabled } = useAuth();

// Check role permission
if (hasPermission('products', 'create')) {
  // Show create button
}

// Check subscription plan feature
if (isPlanFeatureEnabled('products', 'bulkImport')) {
  // Show bulk import
}
```

#### Route Protection
- `<ProtectedRoutes>`: Wraps authenticated routes
- `<AuthGate>`: Redirects unauthenticated users
- `<SystemAdminGate>`: Restricts to superadmin/developer only
- `<PermissionGate>`: Conditional rendering based on permissions

---

### 2. State Management Strategy

#### Server State (React Query)
- **Cache Time**: 5 minutes stale time
- **Refetch**: Disabled on window focus
- **Auto-retry**: Automatic retry on failed requests
- **Optimistic Updates**: Used for critical user actions

```typescript
// QueryClient configuration (App.tsx)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});
```

#### Global State (React Context)
- **SocketContext**: WebSocket connection state
  - `socket`: Socket.io instance
  - `isConnected`: Connection status
  
- **ModalContext**: Modal state management
  - Used for various modal dialogs

#### Local State (useState)
- UI state (dropdowns, tabs, filters)
- Form state (React Hook Form)
- Component-specific state

---

### 3. API Layer Architecture

#### Centralized Axios Instance (`src/api/api.ts`)
```typescript
// Base configuration
baseURL: process.env.VITE_API_BASE_URL
timeout: 30000ms
withCredentials: true // Essential for cookies
```

#### Request Interceptor
- Adds CSRF token to POST/PUT/PATCH/DELETE requests
- Handles FormData content-type
- Attaches authentication credentials

#### Response Interceptor
- **Token Refresh**: Automatic retry on 401 errors
- **Request Queue**: Prevents multiple refresh attempts
- **Error Formatting**: Consistent error structure
- **Public Path Handling**: Prevents redirect loops on public pages

#### Service Layer Pattern
Each feature has dedicated service file:
```
src/api/
├── authService.ts          # Auth + useAuth hook
├── dashboardService.ts     # Dashboard data
├── employeeService.ts      # Employee CRUD
├── orderService.ts         # Order management
├── partyService.ts         # Customer management
└── ... (23 total services)
```

Service functions return typed promises:
```typescript
export const getEmployees = async (): Promise<Employee[]> => {
  const response = await api.get('/employees');
  return response.data;
};
```

---

### 4. Real-time Features (Socket.io)

#### WebSocket Setup
- **Connection**: Established on user authentication
- **Transport**: WebSocket (fallback to polling)
- **Path**: `/api/tracking`
- **Credentials**: Sent with connection

#### SocketProvider (`src/context/SocketContext.tsx`)
```typescript
// Auto-connects when user is authenticated
useEffect(() => {
  if (user) {
    const newSocket = io(VITE_API_BASE_URL, {
      withCredentials: true,
      transports: ['websocket'],
      path: '/api/tracking',
    });
    // Event handlers
  }
}, [user]);
```

#### Real-time Events
- **location-update**: Employee GPS coordinates
- **tracking-session-started**: New tracking session
- **tracking-session-ended**: Session completed
- **connect/disconnect**: Connection status

#### Usage Example
```typescript
const { socket, isConnected } = useSocket();

useEffect(() => {
  if (socket) {
    socket.on('location-update', (data) => {
      // Update map markers
    });
  }
}, [socket]);
```

---

### 5. Routing Architecture

#### React Router v7
- **Nested Routes**: Supports complex route hierarchies
- **Lazy Loading**: All routes use React.lazy for code-splitting
- **Protected Routes**: Wrapped in authentication guards
- **Not Found**: Catch-all route for 404 handling

#### Route Structure
```typescript
<Routes>
  {/* Public Routes */}
  <Route element={<PublicLayout />}>
    <Route path="/" element={<Homepage />} />
    <Route path="/login" element={<LoginPage />} />
  </Route>

  {/* Protected Routes */}
  <Route element={<ProtectedRoutes />}>
    <Route element={<ProtectedLayout />}>
      <Route path="/dashboard" element={<DashboardPage />} />
      // ... more routes
    </Route>
  </Route>

  {/* SuperAdmin Routes */}
  <Route element={<SystemAdminGate />}>
    <Route path="/system-admin" element={<SuperAdminPage />} />
  </Route>
</Routes>
```

#### Layout Components
- **PublicLayout**: Navbar + Footer for marketing pages
- **ProtectedLayout**: Sidebar + Main content for app
- **Page Loading**: Suspense with custom spinner

---

### 6. Component Architecture

#### Component Categories

**1. Layout Components** (`src/components/layout/`)
- `Sidebar/`: Main navigation with permission-based menu
- `Navbar/`: Top bar for public pages
- `Footer/`: Footer for public pages
- `ProtectedLayout/`: Wrapper for authenticated views

**2. UI Components** (`src/components/UI/`)
- `Button/`: Reusable button component
- `DatePicker/`: Date selection
- `FilterDropDown/`: Filter controls
- `ToastProvider/`: Notification system
- `ProfileCard.tsx`: User profile display
- `statusBadge.tsx`: Status indicators
- `EmptyState/`: Empty state displays
- `Export/`: Export action buttons

**3. Auth Components** (`src/components/auth/`)
- `AuthGate.tsx`: Authentication check
- `PermissionGate.tsx`: Permission-based rendering
- `ProtectedRoutes.tsx`: Route protection wrapper
- `SystemAdminGate.tsx`: SuperAdmin access control
- `userIdleTimer.tsx`: Session timeout handler

**4. Modals** (`src/components/modals/`)
22 modal components for CRUD operations, confirmations, and data views

**5. Cards** (`src/components/cards/`)
Specialized card components for different pages:
- Analytics_cards/
- BeatPlan_cards/
- Dashboard_cards/
- EmployeeDetails_cards/
- EmployeeTracking_cards/
- SuperAdmin_cards/

**6. Sections** (`src/components/sections/`)
Reusable page sections for entity details

---

### 7. Form Handling

#### React Hook Form + Zod
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Schema definition
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// Form hook
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});
```

#### Form Pattern
1. Define Zod schema for validation
2. Initialize useForm with zodResolver
3. Connect inputs with register()
4. Handle submission with API service
5. Display errors and success states

---

### 8. Data Export Features

#### PDF Export
- **Library**: @react-pdf/renderer, jsPDF
- **Use cases**: Invoices, reports, employee details
- **Pattern**: React components → PDF document

#### Excel Export
- **Library**: ExcelJS
- **Use cases**: Data tables, attendance records
- **Features**: Styling, formulas, multiple sheets

#### CSV Export
- **Library**: File-Saver
- **Use cases**: Simple data exports
- **Implementation**: Convert data to CSV string

---

### 9. Performance Optimizations

#### Code Splitting
- All routes lazy-loaded with React.lazy
- Vite manual chunks for vendors (react, pdf, excel)
- Reduces initial bundle size

#### Image Optimization
- Lazy loading with React Intersection Observer
- Proper image formats and sizes
- Loading skeletons for better UX

#### API Optimization
- React Query caching (5-min stale time)
- Request deduplication
- Pagination for large datasets

#### Build Optimization
```javascript
// vite.config.ts
build: {
  chunkSizeWarningLimit: 2000,
  sourcemap: true,
  rollupOptions: {
    output: {
      manualChunks: {
        react: ['react', 'react-dom'],
        pdf: ['@react-pdf/renderer'],
        excel: ['exceljs'],
      },
    },
  },
}
```

---

### 10. Development Patterns & Best Practices

#### TypeScript Usage
- Strict mode enabled
- Interface definitions for all data structures
- Type annotations for function parameters and returns
- No implicit any

#### Component Patterns
```typescript
// Functional components with TypeScript
interface Props {
  title: string;
  onSubmit: (data: FormData) => void;
}

const MyComponent: React.FC<Props> = ({ title, onSubmit }) => {
  // Component logic
};
```

#### Custom Hooks
- `useAuth()`: Authentication state and helpers
- `useSocket()`: WebSocket connection
- `useTableSelection()`: Table row selection logic

#### Error Handling
- Try-catch blocks for async operations
- Toast notifications for user feedback
- Error boundaries for component errors
- Axios interceptor for API errors

#### File Organization
```
src/
├── api/              # API services (isolated by feature)
├── components/       # Reusable components (by type)
├── Pages/            # Page components (by feature)
├── context/          # React Context providers
├── assets/           # Static assets
├── styles/           # Global styles
└── types/            # TypeScript type definitions
```

---

## Configuration Files

### package.json
**Location**: Root directory  
**Purpose**: Project dependencies and npm scripts

#### Key Scripts
| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `vite` | Start development server with HMR |
| `build` | `tsc -b && vite build` | Type-check and build for production |
| `lint` | `eslint .` | Run ESLint code quality checks |
| `preview` | `vite preview` | Preview production build locally |

#### Dependencies Highlights
- **Production**: 45+ packages for UI, data, and functionality
- **Development**: 12 packages for tooling and type definitions
- **Key**: React 19, TypeScript 5.9, Vite 7.1, TailwindCSS 3.4

---

### vite.config.ts
**Location**: Root directory  
**Purpose**: Vite build tool configuration

```typescript
{
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: ['salessphere360.com', 'www.salessphere360.com']
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 2000,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          pdf: ['@react-pdf/renderer'],
          excel: ['exceljs'],
          html2canvas: ['html2canvas']
        }
      }
    }
  }
}
```

**Key Features**:
- Manual chunk splitting for better caching
- Sourcemaps enabled for debugging
- Increased chunk size warning limit (2MB)
- Host configuration for production domain

---

### tailwind.config.js
**Location**: Root directory  
**Purpose**: TailwindCSS configuration

**Custom Theme Extensions**:
- **Colors**: Primary (#163355), Secondary (#197ADC), Shadcn UI colors
- **Animations**: Custom enter/leave animations for toasts
- **Border Radius**: CSS variable-based radius system
- **Fonts**: Arimo as default sans-serif font

**Content Paths**:
```javascript
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}"
]
```

---

### tsconfig.json
**Location**: Root directory  
**Purpose**: TypeScript compiler configuration

**Project Structure**:
- `tsconfig.json`: Base configuration (references app & node configs)
- `tsconfig.app.json`: Application-specific settings
- `tsconfig.node.json`: Node/build tool settings

**Key Settings**:
- Target: ES2020+
- Module: ESNext
- Strict mode: Enabled
- JSX: react-jsx (React 17+ transform)

---

### eslint.config.js
**Location**: Root directory  
**Purpose**: ESLint code quality configuration

**Plugins**:
- `@eslint/js`: Core ESLint rules
- `typescript-eslint`: TypeScript-specific linting
- `eslint-plugin-react-hooks`: React Hooks rules
- `eslint-plugin-react-refresh`: React Fast Refresh support

---

### postcss.config.js
**Location**: Root directory  
**Purpose**: PostCSS configuration for TailwindCSS

```javascript
{
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
}
```

---

### .env
**Location**: Root directory (gitignored)  
**Purpose**: Environment variables

**Required Variables**:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

**Important Notes**:
- All Vite env vars must be prefixed with `VITE_`
- Never commit `.env` to version control
- Create `.env.local` for local overrides
- Different `.env` files for different environments

---

### index.html
**Location**: Root directory  
**Purpose**: HTML entry point

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SalesSphere - Sales Force Automation</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**Features**:
- Single root div for React mounting
- Module script for modern ES imports
- Vite processes and injects dependencies

---

## File Statistics

| Category | Count | Details |
|----------|-------|---------|
| **Total Source Files** | 434 | All files in src/ directory |
| **API Services** | 23 | 22 services + 1 SuperAdmin folder (5 files) |
| **Pages** | 32 | Top-level page directories with 242 files total |
| **Components** | 113 | 10 component categories |
| **Assets** | 45 | Images in src/assets/Image/ |
| **Context Providers** | 1 | SocketContext for real-time features |
| **Configuration Files** | 9 | package.json, vite.config, tailwind, typescript, eslint, etc. |

### Detailed Breakdown

#### API Services (27 total files)
- Core Services: api.ts, authService.ts, dashboardService.ts, analyticsService.ts, settingService.ts
- Entity Services: employeeService, partyService, prospectService, siteService, productService
- Operational: orderService, estimateService, attendanceService, leaveService, expensesService
- Planning: beatPlanService, tourPlanService, liveTrackingService
- Utilities: notesService, miscellaneousWorkService, mapService, roleService
- SuperAdmin Folder: 5 services (organizationService, systemUserService, activityLogService, systemOverviewService, subscriptionPlanService)

#### Components (113 files in 10 categories)
1. **UI/** (30 files): Button, DatePicker, EmptyState, ErrorBoundary, Export, FilterDropDown, Page, SearchBar, SuperadminComponents (15 primitives), ToastProvider, ProfileCard, statusBadge
2. **modals/** (36 files): CRUD modals, action modals, view modals, bulk modals, superadmin modals
3. **cards/** (13 files): Analytics, BeatPlan, Dashboard, EmployeeDetails, EmployeeTracking, SuperAdmin cards
4. **layout/** (4 files): Sidebar, Navbar, Footer, ProtectedLayout
5. **auth/** (5 files): AuthGate, PermissionGate, ProtectedRoutes, SystemAdminGate, userIdleTimer
6. **sections/** (9 files): Reusable entity sections
7. **Entities/** (13 files): Entity management components
8. **maps/** (1 file): Map components
9. **hooks/** (1 file): useTableSelection
10. **common/** (1 file): Common utilities

#### Pages (242 files in 32 directories)
Major page categories:
- Dashboard, Analytics, LiveTracking
- Employee Management (EmployeePage, EmployeeDetailsPage, AttendancePage, LeavePage)
- Sales Management (OrderListPage, OrderDetailsPage, ProductsPage)
- CRM (PartyPage, ProspectPage, SitePage + detail pages)
- Field Operations (BeatPlanPage, TourPlanPage, MiscellaneousWorkPage)
- Expenses & Notes (ExpensesPage, NotesPage + detail pages)
- Admin (AdminPanelPage, SettingPage, SuperAdminPage)
- Public (HomePage, LoginPage, AboutUsPage, PrivacyPolicyPage, TermsAndConditionsPage)

---

## Development Workflow

### Getting Started

#### 1. Environment Setup
```bash
# Clone repository
git clone https://github.com/AsimAftab/SalesSphere-Frontend.git
cd SalesSphere-Frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API base URL
```

#### 2. Development Server
```bash
# Start dev server (http://localhost:5173)
npm run dev

# Server features:
# - Hot Module Replacement (HMR)
# - Instant page reload on changes
# - Vite lightning-fast builds
```

#### 3. Code Quality
```bash
# Run linter
npm run lint

# TypeScript type checking (automatically runs during build)
tsc --noEmit
```

---

### Building for Production

```bash
# Build production bundle
npm run build

# Output: dist/ directory
# - Optimized bundle with code splitting
# - Minified JavaScript and CSS
# - Source maps for debugging
# - Hashed filenames for caching

# Preview production build locally
npm run preview
```

---

### Project Conventions

#### Naming Conventions
- **Components**: PascalCase (e.g., `EmployeeCard.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Services**: camelCase with Service suffix (e.g., `employeeService.ts`)

#### File Structure Conventions
```
Feature/
├── FeaturePage.tsx        # Main page component
├── FeatureContent.tsx     # Content component
├── index.ts               # Barrel export
├── types.ts               # Feature-specific types
├── components/            # Feature-specific components
│   ├── FeatureCard.tsx
│   ├── FeatureTable.tsx
│   └── FeatureExportService.tsx
├── hooks/                 # Feature-specific hooks (NOT in components/)
│   ├── useFeatureData.ts
│   ├── useFeatureManager.ts
│   └── index.ts
└── utils/                 # Feature-specific utilities
```

#### Import Order
1. React and React-related imports
2. Third-party library imports
3. Internal API/service imports
4. Component imports
5. Type imports
6. Style imports

```typescript
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getEmployees } from '@/api/employeeService';
import EmployeeCard from './components/EmployeeCard';
import type { Employee } from '@/types/employee';
import './EmployeePage.css';
```

---

### Common Development Tasks

#### Adding a New Page
1. Create page directory in `src/Pages/`
2. Create main page component
3. Add route in `AppRoutes.tsx`
4. Add lazy import
5. Configure permissions if needed
6. Add to sidebar navigation

#### Adding a New API Service
1. Create service file in `src/api/`
2. Import api instance
3. Define TypeScript interfaces
4. Export async functions
5. Use in components with React Query

#### Adding a New Component
1. Create component file in appropriate directory
2. Define TypeScript props interface
3. Implement component logic
4. Export component
5. Add to index file if needed

---

*Last Updated: 2026-02-07*  
*Version: 2.0*  
*Documentation Maintainer: Development Team*
