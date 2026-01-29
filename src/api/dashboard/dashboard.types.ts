export interface DashboardStats {
  totalPartiesToday: number;
  totalParties: number;
  totalSalesToday: string;
  totalOrdersToday: number;
  pendingOrders: number;
}

export interface TeamMemberPerformance {
  userId: string;
  avatarUrl?: string;
  role: string;
  customRole?: string;
  name: string;
  orders: number;
  sales: number;
}

export interface AttendanceSummary {
  teamStrength: number;
  present: number;
  absent: number;
  onLeave: number;
  halfDay: number;
  weeklyOff: number;
  attendanceRate: number;
}

export interface SalesTrendData {
  date: string;
  sales: number;
}

export interface LiveActivity {
  sessionId: string;
  beatPlan: {
    _id: string;
    name: string;
    status: string;
  };
  user: {
    _id: string;
    name: string;
    avatarUrl?: string;
    role: string;
    customRoleId?: {
      _id: string;
      name: string;
    };
  };
  currentLocation: {
    address?: {
      formattedAddress: string;
    };
  };
}

export interface FullDashboardData {
  stats: DashboardStats;
  teamPerformance: TeamMemberPerformance[];
  attendanceSummary: AttendanceSummary;
  salesTrend: SalesTrendData[];
  liveActivities: LiveActivity[];
}

export interface PartyDistributionItem {
  type: string;
  count: number;
}

export interface PartyDistributionData {
  distribution: PartyDistributionItem[];
  total: number;
}

export interface CollectionTrendItem {
  amount: number;
  partyName: string;
  paymentMethod: string;
}

export interface CollectionTrendData {
  date: string;
  amount: number;
  collections: CollectionTrendItem[];
}
