// Activity Log Types
export interface ActivityLog {
  id: string;
  timestamp: string;
  performedBy: {
    id: string;
    name: string;
    role: "superadmin" | "Developer";
  };
  action: string;
  actionType: "create" | "update" | "delete" | "activate" | "deactivate" | "transfer" | "add" | "remove";
  targetType: "organization" | "user" | "system-user" | "subscription" | "settings";
  targetId: string;
  targetName: string;
  details?: string;
  changes?: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
}

export interface ActivityLogFilters {
  actionType?: string;
  targetType?: string;
  performedBy?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Mock data generation
const generateMockActivityLogs = (): ActivityLog[] => {
  const systemUsers = [
    { id: "su-001", name: "John Super", role: "superadmin" as const },
    { id: "su-002", name: "Sarah Developer", role: "Developer" as const },
    { id: "su-003", name: "Mike Admin", role: "superadmin" as const },
  ];

  const actions = [
    {
      action: "Created organization 'TechCorp Solutions'",
      actionType: "create" as const,
      targetType: "organization" as const,
      targetId: "org-001",
      targetName: "TechCorp Solutions",
      details: "New organization registered with owner John Anderson",
    },
    {
      action: "Updated organization 'Global Retail Inc'",
      actionType: "update" as const,
      targetType: "organization" as const,
      targetId: "org-002",
      targetName: "Global Retail Inc",
      details: "Changed address and phone number",
      changes: [
        { field: "address", oldValue: "123 Old St", newValue: "456 New Ave" },
        { field: "phone", oldValue: "+1234567890", newValue: "+1987654321" },
      ],
    },
    {
      action: "Deactivated organization 'ProSales Dynamics'",
      actionType: "deactivate" as const,
      targetType: "organization" as const,
      targetId: "org-003",
      targetName: "ProSales Dynamics",
      details: "Reason: Subscription expired - payment not received",
    },
    {
      action: "Added user to 'Apex Distribution'",
      actionType: "add" as const,
      targetType: "user" as const,
      targetId: "u-123",
      targetName: "Emily Davis",
      details: "Added new Manager to organization",
    },
    {
      action: "Removed user from 'Northwest Trading Co'",
      actionType: "remove" as const,
      targetType: "user" as const,
      targetId: "u-456",
      targetName: "Chris Martinez",
      details: "User access revoked by admin",
    },
    {
      action: "Updated subscription for 'Summit Logistics'",
      actionType: "update" as const,
      targetType: "subscription" as const,
      targetId: "org-004",
      targetName: "Summit Logistics",
      details: "Extended subscription by 12 months",
      changes: [
        { field: "subscriptionExpiry", oldValue: "2025-01-15", newValue: "2026-01-15" },
        { field: "subscriptionStatus", oldValue: "Expired", newValue: "Active" },
      ],
    },
    {
      action: "Activated organization 'Metro Sales Group'",
      actionType: "activate" as const,
      targetType: "organization" as const,
      targetId: "org-005",
      targetName: "Metro Sales Group",
      details: "Organization reactivated after payment confirmation",
    },
    {
      action: "Created system user 'Lisa Anderson'",
      actionType: "create" as const,
      targetType: "system-user" as const,
      targetId: "su-004",
      targetName: "Lisa Anderson",
      details: "New Developer added to system",
    },
    {
      action: "Transferred ownership of 'Pacific Commerce'",
      actionType: "transfer" as const,
      targetType: "organization" as const,
      targetId: "org-006",
      targetName: "Pacific Commerce",
      details: "Ownership transferred from Kevin O'Brien to Rachel Martinez",
    },
    {
      action: "Updated organization 'TechCorp Solutions'",
      actionType: "update" as const,
      targetType: "organization" as const,
      targetId: "org-001",
      targetName: "TechCorp Solutions",
      details: "Updated PAN/VAT number",
      changes: [
        { field: "panVat", oldValue: "123456789", newValue: "987654321" },
      ],
    },
  ];

  const logs: ActivityLog[] = [];
  const now = new Date();

  actions.forEach((action, index) => {
    const timestamp = new Date(now);
    timestamp.setHours(timestamp.getHours() - (index * 3));
    timestamp.setMinutes(timestamp.getMinutes() - (index * 15));

    logs.push({
      id: `log-${String(index + 1).padStart(3, '0')}`,
      timestamp: timestamp.toISOString(),
      performedBy: systemUsers[index % systemUsers.length],
      ...action,
    });
  });

  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const mockActivityLogs = generateMockActivityLogs();

// API Functions
export const getAllActivityLogs = async (): Promise<ActivityLog[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...mockActivityLogs];
};

export const getActivityLogsByFilter = async (filters: ActivityLogFilters): Promise<ActivityLog[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  let filtered = [...mockActivityLogs];

  if (filters.actionType) {
    filtered = filtered.filter(log => log.actionType === filters.actionType);
  }

  if (filters.targetType) {
    filtered = filtered.filter(log => log.targetType === filters.targetType);
  }

  if (filters.performedBy) {
    filtered = filtered.filter(log => log.performedBy.id === filters.performedBy);
  }

  if (filters.dateFrom) {
    filtered = filtered.filter(log => new Date(log.timestamp) >= new Date(filters.dateFrom!));
  }

  if (filters.dateTo) {
    filtered = filtered.filter(log => new Date(log.timestamp) <= new Date(filters.dateTo!));
  }

  return filtered;
};

export const addActivityLog = async (log: Omit<ActivityLog, "id" | "timestamp">): Promise<ActivityLog> => {
  await new Promise(resolve => setTimeout(resolve, 100));

  const newLog: ActivityLog = {
    ...log,
    id: `log-${String(mockActivityLogs.length + 1).padStart(3, '0')}`,
    timestamp: new Date().toISOString(),
  };

  mockActivityLogs.unshift(newLog);
  return { ...newLog };
};

export const getActivityLogsByOrganization = async (organizationId: string): Promise<ActivityLog[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockActivityLogs.filter(log => log.targetId === organizationId || log.details?.includes(organizationId));
};

export const getActivityLogsByUser = async (userId: string): Promise<ActivityLog[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockActivityLogs.filter(log => log.performedBy.id === userId);
};
