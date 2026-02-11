/**
* Centralized API Endpoints
* Single source of truth for all API path strings used across the application.
*/
export const API_ENDPOINTS = {
  // --- Auth ---
  auth: {
    CSRF_TOKEN: '/csrf-token',
    CHECK_STATUS: '/auth/check-status',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgotpassword',
    RESET_PASSWORD: (token: string) => `/auth/resetpassword/${token}`,
    CONTACT_ADMIN: '/auth/contact-admin',
    REGISTER: '/auth/register',
    REGISTER_SUPERADMIN: '/auth/register/superadmin',
    REGISTER_SYSTEM_ADMIN: '/auth/register/systemadmin',
    REFRESH: '/auth/refresh',
  },

  // --- Users / Employees ---
  users: {
    BASE: '/users',
    ME: '/users/me',
    ME_PASSWORD: '/users/me/password',
    ME_PROFILE_IMAGE: '/users/me/profile-image',
    ME_DOCUMENTS: '/users/me/documents',
    DETAIL: (id: string) => `/users/${id}`,
    DOCUMENTS: (userId: string) => `/users/${userId}/documents`,
    DOCUMENT_DETAIL: (userId: string, docId: string) => `/users/${userId}/documents/${docId}`,
    SUPERVISORS: (userId: string) => `/users/${userId}/supervisors`,
    ATTENDANCE_SUMMARY: (userId: string) => `/users/${userId}/attendance-summary`,
    ORG_HIERARCHY: '/users/org-hierarchy',
    SYSTEM_OVERVIEW: '/users/system-overview',
    SYSTEM_USER: '/users/system-users',
    SYSTEM_USER_DETAIL: (id: string) => `/users/system-users/${id}`,
    PASSWORD: (userId: string) => `/users/${userId}/password`,

    // System Users (Superadmin/Developer)
    SYSTEM_USERS: {
      BASE: '/users/system-users',
      CREATE: '/users/system-users',
      DETAIL: (id: string) => `/users/system-users/${id}`,
      DOCUMENTS: (userId: string) => `/users/system-users/${userId}/documents`,
      DOCUMENT_DETAIL: (userId: string, docId: string) => `/users/system-users/${userId}/documents/${docId}`,
    }
  },

  // --- Attendance ---
  attendance: {
    REPORT: '/attendance/report',
    ADMIN_MARK: '/attendance/admin/mark',
    ADMIN_MARK_HOLIDAY: '/attendance/admin/mark-holiday',
    EMPLOYEE_RECORD: (id: string, date: string) => `/attendance/employee/${id}/date/${date}`,
    CHECK_IN: '/attendance/check-in',
    CHECK_OUT: '/attendance/check-out',
    STATUS_TODAY: '/attendance/status/today',
  },

  // --- Beat Plans ---
  beatPlans: {
    BASE: '/beat-plans',
    COUNTS: '/beat-plans/stats',
    LISTS: '/beat-plan-lists',
    ASSIGN: '/beat-plans/assign',
    DIRECTORIES: '/beat-plans/available-directories',
    DETAIL: (id: string) => `/beat-plans/${id}`,
    LIST_DETAIL: (id: string) => `/beat-plan-lists/${id}`,
    HISTORY: '/beat-plans/history',
    HISTORY_DETAIL: (id: string) => `/beat-plans/history/${id}`,
    TRACKING_ACTIVE: '/beat-plans/tracking/active',
    TRACKING_COMPLETED: '/beat-plans/tracking/completed',
    TRACKING_SESSION_SUMMARY: (sessionId: string) => `/beat-plans/tracking/session/${sessionId}/summary`,
    TRACKING_SESSION_BREADCRUMBS: (sessionId: string) => `/beat-plans/tracking/session/${sessionId}/breadcrumbs`,
    TRACKING_ARCHIVED: (sessionId: string) => `/beat-plans/tracking/archived/${sessionId}`,
  },

  // --- Invoices / Orders ---
  invoices: {
    BASE: '/invoices',
    DETAIL: (id: string) => `/invoices/${id}`,
    STATUS: (id: string) => `/invoices/${id}/status`,
    PARTY_STATS: (partyId: string) => `/invoices/parties/${partyId}/stats`,
    ESTIMATES_BASE: '/invoices/estimates',
    ESTIMATE_DETAIL: (id: string) => `/invoices/estimates/${id}`,
    ESTIMATE_CONVERT: (id: string) => `/invoices/estimates/${id}/convert`,
    ESTIMATES_BULK_DELETE: '/invoices/estimates/bulk-delete',
  },

  // --- Products ---
  products: {
    BASE: '/products',
    DETAIL: (id: string) => `/products/${id}`,
    BULK_IMPORT: '/products/bulk-import',
    BULK_DELETE: '/products/bulk-delete',
    CATEGORIES: '/categories',
    CATEGORY_DETAIL: (id: string) => `/categories/${id}`,
  },

  // --- Parties ---
  parties: {
    BASE: '/parties',
    DETAIL: (id: string) => `/parties/${id}`,
    IMAGE: (id: string) => `/parties/${id}/image`,
    TYPES: '/parties/types',
    TYPE_DETAIL: (id: string) => `/parties/types/${id}`,
    BULK_IMPORT: '/parties/bulk-import',
    DETAILS_ALL: '/parties/details',
    ASSIGN: (id: string) => `/parties/${id}/assign`,
    ORG_BULK_IMPORT: (orgId: string) => `/organizations/${orgId}/parties/bulk-import`,
  },

  // --- Prospects ---
  prospects: {
    BASE: '/prospects',
    DETAIL: (id: string) => `/prospects/${id}`,
    TRANSFER: (id: string) => `/prospects/${id}/transfer`,
    CATEGORIES: '/prospects/categories',
    DETAILS_ALL: '/prospects/details',
    IMAGE_BASE: (id: string) => `/prospects/${id}/images`,
    IMAGE_SPECIFIC: (id: string, num: number) => `/prospects/${id}/images/${num}`,
    ASSIGN: (id: string) => `/prospects/${id}/assign`,
  },

  // --- Sites ---
  sites: {
    BASE: '/sites',
    DETAIL: (id: string) => `/sites/${id}`,
    CATEGORIES: '/sites/categories',
    SUB_ORGS: '/sites/sub-organizations',
    SUB_ORG_DETAIL: (id: string) => `/sites/sub-organizations/${id}`,
    IMAGES: (id: string) => `/sites/${id}/images`,
    IMAGE_SPECIFIC: (id: string, num: number) => `/sites/${id}/images/${num}`,
    ASSIGN: (id: string) => `/sites/${id}/assign`,
    TECHNICIANS: '/sites/technicians',
  },

  // --- Leaves ---
  leaves: {
    BASE: '/leave-requests',
    DETAIL: (id: string) => `/leave-requests/${id}`,
    STATUS: (id: string) => `/leave-requests/${id}/status`,
    BULK_DELETE: '/leave-requests/bulk-delete',
  },

  // --- Notes ---
  notes: {
    BASE: '/notes',
    MY_NOTES: '/notes/my-notes',
    DETAIL: (id: string) => `/notes/${id}`,
    IMAGES: (id: string) => `/notes/${id}/images`,
    IMAGE_DETAIL: (id: string, num: number) => `/notes/${id}/images/${num}`,
    BULK_DELETE: '/notes/bulk-delete',
  },

  // --- Expenses ---
  expenses: {
    BASE: '/expense-claims',
    BULK_DELETE: '/expense-claims/bulk-delete',
    CATEGORIES: '/expense-claims/categories',
    CATEGORY_DETAIL: (id: string) => `/expense-claims/categories/${id}`,
    STATUS: (id: string) => `/expense-claims/${id}/status`,
    RECEIPT: (id: string) => `/expense-claims/${id}/receipt`,
    DETAIL: (id: string) => `/expense-claims/${id}`,
  },

  // --- Odometer ---
  odometer: {
    REPORT: '/odometer/report',
    DETAIL: (id: string) => `/odometer/${id}`,
  },

  // --- Miscellaneous Work ---
  miscWork: {
    BASE: '/miscellaneous-work',
    MASS_DELETE: '/miscellaneous-work/bulk-delete',
    DETAIL: (id: string) => `/miscellaneous-work/${id}`,
  },

  // --- Tour Plans ---
  tourPlans: {
    BASE: '/tour-plans',
    DETAIL: (id: string) => `/tour-plans/${id}`,
    STATUS: (id: string) => `/tour-plans/${id}/status`,
    BULK_DELETE: '/tour-plans/bulk-delete',
  },

  // --- Collections ---
  collections: {
    BASE: '/collections',
    DETAIL: (id: string) => `/collections/${id}`,
    CHEQUE_STATUS: (id: string) => `/collections/${id}/cheque-status`,
    BULK_DELETE: '/collections/bulk-delete',
    IMAGE_BASE: (id: string) => `/collections/${id}/images`,
    IMAGE_SPECIFIC: (id: string, num: number) => `/collections/${id}/images/${num}`,
    BANK_NAMES: '/collections/utils/bank-names',
    BANK_NAME_DETAIL: (id: string) => `/collections/utils/bank-names/${id}`,
  },

  // --- Map ---
  map: {
    LOCATIONS: '/map/locations',
  },

  // --- Roles ---
  roles: {
    BASE: '/roles',
    DETAIL: (id: string) => `/roles/${id}`,
    MODULES: '/roles/modules',
    ASSIGN: (roleId: string, userId: string) => `/roles/${roleId}/assign/${userId}`,
    REMOVE_ASSIGN: (userId: string) => `/roles/assign/${userId}`,
  },

  // --- Settings (User profile) ---
  // Uses users.ME, users.ME_PASSWORD, users.ME_PROFILE_IMAGE, users.ME_DOCUMENTS

  // --- Sales Dashboard / Analytics ---
  analytics: {
    MONTHLY_OVERVIEW: '/analytics/monthly-overview',
    SALES_TREND: '/analytics/sales-trend',
    PRODUCTS_BY_CATEGORY: '/analytics/products-by-category',
    TOP_PRODUCTS: '/analytics/top-products',
    TOP_PARTIES: '/analytics/top-parties',
  },

  // --- Prospect Dashboard ---
  prospectDashboard: {
    STATS: '/prospect-dashboard/stats',
    CATEGORY_BRANDS: '/prospect-dashboard/category-brands',
    BRAND_PROSPECTS: '/prospect-dashboard/brand-prospects',
  },

  // --- Sites Dashboard ---
  sitesDashboard: {
    STATS: '/sites-dashboard/stats',
    CATEGORY_BRANDS: '/sites-dashboard/category-brands',
    BRAND_SITES: '/sites-dashboard/brand-sites',
    SUB_ORG_SITES: '/sites-dashboard/sub-organization-sites',
  },

  // --- Main Dashboard ---
  dashboard: {
    STATS: '/dashboard/stats',
    TEAM_PERFORMANCE: '/dashboard/team-performance',
    ATTENDANCE_SUMMARY: '/dashboard/attendance-summary',
    SALES_TREND: '/dashboard/sales-trend',
    PARTY_DISTRIBUTION: '/dashboard/party-distribution',
    COLLECTION_TREND: '/dashboard/collection-trend',
  },

  // --- Super Admin: Organizations ---
  organizations: {
    BASE: '/organizations',
    DETAIL: (id: string) => `/organizations/${id}`,
    MY_ORG: '/organizations/my-organization',
    MY_ORG_PAYMENTS: '/organizations/my-organization/payments',
    REACTIVATE: (id: string) => `/organizations/${id}/reactivate`,
    DEACTIVATE: (id: string) => `/organizations/${id}/deactivate`,
    EXTEND_SUBSCRIPTION: (id: string) => `/organizations/${id}/extend-subscription`,
    MAX_EMPLOYEES: (id: string) => `/organizations/${id}/max-employees`,
    ALL: '/organizations/all',
    STATS: '/organizations/stats',
    USERS: (id: string) => `/organizations/${id}/users`,
    DEACTIVATE_USER: (orgId: string, userId: string) => `/organizations/${orgId}/users/${userId}`,
    REACTIVATE_USER: (orgId: string, userId: string) => `/organizations/${orgId}/users/${userId}/reactivate`,
    // Organization Payments
    PAYMENTS: (orgId: string) => `/organizations/${orgId}/payments`,
    PAYMENT_DETAIL: (orgId: string, paymentId: string) => `/organizations/${orgId}/payments/${paymentId}`,
    PAYMENT_IMAGES: (orgId: string, paymentId: string) => `/organizations/${orgId}/payments/${paymentId}/images`,
    PAYMENT_IMAGE_DETAIL: (orgId: string, paymentId: string, imageNum: number) => `/organizations/${orgId}/payments/${paymentId}/images/${imageNum}`,
  },

  // --- Super Admin: Subscription Plans ---
  subscriptions: {
    PLANS: '/subscriptions/plans',
    PLAN_DETAIL: (id: string) => `/subscriptions/plans/${id}`,
    PLANS_CUSTOM: '/subscriptions/plans/custom',
  },

  // --- Newsletter ---
  newsletter: {
    SUBSCRIBE: '/newsletter/subscribe',
    UNSUBSCRIBE: (email: string) => `/newsletter/unsubscribe/${encodeURIComponent(email)}`,
    RESUBSCRIBE: (email: string) => `/newsletter/resubscribe/${encodeURIComponent(email)}`,
    SUBSCRIBERS: '/newsletter/subscribers',
    SEND: '/newsletter/send',
  },

  // --- Demo Requests ---
  demoRequests: {
    SUBMIT: '/auth/schedule-demo',
  },

  // --- Blogs ---
  blogs: {
    BASE: '/blogs',
    DETAIL: (id: string) => `/blogs/${id}`,
    BY_SLUG: (slug: string) => `/blogs/${slug}`,
    ADMIN: '/blogs/system/all',
    ADMIN_DETAIL: (id: string) => `/blogs/system/${id}`,
    UPLOAD_IMAGE: (id: string) => `/blogs/${id}/upload-image`,
  },
} as const;
