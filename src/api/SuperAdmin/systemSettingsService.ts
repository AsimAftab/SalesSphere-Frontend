

export interface SecuritySettings {
    [key: string]: boolean | string | number;
    passwordMinLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    passwordExpiry: number;
    maxLoginAttempts: number;
    lockoutDuration: number;
    requireMFA: boolean;
    allowMultipleSessions: boolean;
}

export interface NotificationSettings {
    [key: string]: boolean | string | number;
    emailNotifications: boolean;
    newOrganizationAlert: boolean;
    subscriptionExpiryAlert: boolean;
    systemErrorAlert: boolean;
    dailyReport: boolean;
    weeklyReport: boolean;
    monthlyReport: boolean;
    alertEmail: string;
}

export interface SystemSettings {
    security: SecuritySettings;
    notifications: NotificationSettings;
}

export const getSystemSettings = async (): Promise<SystemSettings> => {
    // Mock response
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                security: {
                    passwordMinLength: 8,
                    requireUppercase: true,
                    requireLowercase: true,
                    requireNumbers: true,
                    requireSpecialChars: true,
                    passwordExpiry: 90,
                    maxLoginAttempts: 5,
                    lockoutDuration: 15,
                    requireMFA: false,
                    allowMultipleSessions: true,
                },
                notifications: {
                    emailNotifications: true,
                    newOrganizationAlert: true,
                    subscriptionExpiryAlert: true,
                    systemErrorAlert: true,
                    dailyReport: false,
                    weeklyReport: true,
                    monthlyReport: true,
                    alertEmail: "admin@salessphere.com",
                }
            });
        }, 500);
    });
};

export const updateSystemSettings = async (settings: SystemSettings): Promise<SystemSettings> => {
    // Mock update
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(settings);
        }, 800);
    });
};
