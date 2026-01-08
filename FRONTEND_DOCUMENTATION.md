# SalesSphere Frontend - Complete Repository Documentation

## Overview

**SalesSphere** is a comprehensive Sales Force Automation (SFA) and Field Force Management platform built with modern React.

---

## Technology Stack

| Category | Technology | Version |
|----------|------------|---------|
| **Framework** | React | 19.2.3 |
| **Build Tool** | Vite | 7.1.7 |
| **Language** | TypeScript | 5.9.3 |
| **Styling** | TailwindCSS | 3.4.18 |
| **State Management** | TanStack React Query | 5.90.5 |
| **Routing** | React Router DOM | 7.9.6 |
| **HTTP Client** | Axios | 1.12.2 |
| **Forms** | React Hook Form + Zod | 7.55.0 |
| **Animations** | Framer Motion | 12.23.24 |
| **Maps** | @vis.gl/react-google-maps | 1.7.0 |
| **Charts** | Recharts | 3.2.1 |
| **Real-time** | Socket.io-client | 4.8.1 |
| **UI Primitives** | Radix UI | Various |
| **Icons** | Lucide React, Heroicons, React Icons | Various |

---

## Directory Structure

```
SalesSphere-Frontend/
├── public/                 # Static assets
├── src/
│   ├── api/               # API service layer (27 files)
│   ├── assets/            # Images and icons (41 files)
│   ├── components/        # Reusable UI components (105 files)
│   ├── context/           # React context providers
│   ├── Pages/             # Page-level components (161 files)
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
| Expenses | expensesService.ts |
| Beat Plans | beatPlanService.ts |
| Tour Plans | tourPlanService.ts |
| Live Tracking | liveTrackingService.ts |
| Notes | notesService.ts |
| Misc Work | miscellaneousWorkService.ts |
| Maps | mapService.ts |
| Roles | roleService.ts |

### SuperAdmin Services (5 files)
| Service | Purpose |
|---------|---------|
| organizationService.ts | Manage organizations |
| systemUserService.ts | SuperAdmin users |
| activityLogService.ts | Activity logs |
| systemOverviewService.ts | System stats |
| subscriptionPlanService.ts | Plans |

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
| `/order-lists` | **SalesManagementPage** | Tabbed view of Invoices and Estimates. Filters, status badges, export. Handles both modules internally. | `invoices.viewList` OR `estimates.viewList` | → Order Details, Estimate Details, Create Transaction |
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

### CRM Entities

| Route | Page | Description | Permission | Links To |
|-------|------|-------------|------------|----------|
| `/parties` | **PartyPage** | Customer/client management. Add parties, assign types, view contact info. | `parties.viewList` | → Party Details |
| `/parties/:partyId` | **PartyDetailsPage** | Party profile with order history, collections, notes, contacts. | `parties.viewDetails` | ← Parties |
| `/prospects` | **ProspectPage** | Lead management. Track potential customers, interests, follow-ups. | `prospects.viewList` | → Prospect Details |
| `/prospects/:prospectId` | **ProspectDetailsPage** | Prospect profile with conversion tracking, activity log. Can convert to Party. | `prospects.viewDetails` | ← Prospects |
| `/sites` | **SitePage** | Location/site management for field operations. | `sites.viewList` | → Site Details |
| `/sites/:siteId` | **SiteDetailsPage** | Site profile with assigned users, activities, photos. | `sites.viewDetails` | ← Sites |

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
| `/settings` | **SettingsPage** | User personal settings and preferences. | — | — |
| `/admin-panel` | **AdminPanelPage** | Organization admin panel with 4 tabs: **Customization** (logo, colors), **User Role & Permission** (create/edit roles with granular permissions), **Role Hierarchy** (supervisor mapping), **Subscription** (plan details). | `settings.view` | — |

---

### SuperAdmin (Platform Owner)

| Route | Page | Description | Access | Links To |
|-------|------|-------------|--------|----------|
| `/system-admin` | **SuperAdminPage** | Platform-wide dashboard. Manage organizations, users, subscriptions, view activity logs, system stats. | SuperAdmin/Developer only | → User Profile |
| `/system-admin/users/:userId` | **SystemUserProfilePage** | System user (superadmin/developer) profile management. | SuperAdmin/Developer only | ← System Admin |

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

### Authentication
- CSRF token fetched on app init
- JWT stored in cookies (httpOnly)
- `useAuth()` hook provides: `hasPermission()`, `isFeatureEnabled()`, `isAdmin`, `isSuperAdmin`, `isDeveloper`

### State Management
- React Query for server state with 5-minute cache
- useState for local UI state
- Context for global state (Socket, Modals)

### Routing
- React Router v7 with nested routes
- Protected routes via `ProtectedRoutes` component
- Permission-based sidebar visibility

### Permissions
- Module-level: `isFeatureEnabled('moduleName')`
- Feature-level: `hasPermission('module', 'permission')`
- Aligned with backend `featureRegistry.js`

---

## Configuration Files

| File | Purpose |
|------|---------|
| package.json | Dependencies |
| vite.config.ts | Vite config |
| tailwind.config.js | Tailwind config |
| tsconfig.json | TypeScript config |
| eslint.config.js | ESLint rules |
| .env | Environment vars |

---

## File Statistics

| Category | Count |
|----------|-------|
| **Total src files** | 341 |
| **API Services** | 27 |
| **Pages** | 161 |
| **Components** | 105 |
| **Assets** | 41 |

---

*Generated: 2026-01-08*
