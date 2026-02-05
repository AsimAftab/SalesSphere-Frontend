import type { DashboardStats, AttendanceSummary } from './dashboard.types';

// Only map internal system role labels that aren't user-facing.
// All other roles are admin-defined custom names and displayed as-is.
const ROLE_MAP: Record<string, string> = {
  user: 'SalesPerson',
};

/**
 * Centralizes formatting and default state logic.
 * Ensures UI components, charts, and exports display data identically.
 */
export class DashboardMapper {
  static formatCurrency(value: string | number): string {
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numericValue)) return '₹0.00';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(numericValue);
  }

  static formatChartDate(dateString: string): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }

  static formatRate(rate: number): string {
    return `${rate}%`;
  }

  static getInitials(name: string): string {
    return name ? name.substring(0, 1).toUpperCase() : '';
  }

  static getDisplayRole(role: string, customRole?: string): string {
    if (customRole) return customRole;
    if (!role) return 'Staff';
    return ROLE_MAP[role.toLowerCase()] ?? role;
  }

  static formatPaymentMode(mode: string): string {
    const modeMap: Record<string, string> = {
      bank_transfer: 'Bank Transfer',
      cheque: 'Cheque',
      qr: 'QR Code',
      cash: 'Cash',
    };
    return modeMap[mode] || mode.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }

  // Fallback "Null Objects" for restricted or failed requests
  static readonly INITIAL_STATS: DashboardStats = {
    totalPartiesToday: 0,
    totalParties: 0,
    totalSalesToday: '0',
    totalOrdersToday: 0,
    pendingOrders: 0,
  };

  static readonly INITIAL_ATTENDANCE: AttendanceSummary = {
    teamStrength: 0,
    present: 0,
    absent: 0,
    onLeave: 0,
    halfDay: 0,
    weeklyOff: 0,
    attendanceRate: 0,
  };
}
