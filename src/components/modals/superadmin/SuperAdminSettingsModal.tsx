import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../uix/dialog";
import {
  ShieldCheckIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import toast from "react-hot-toast";
import Button from "../../UI/Button/Button";

interface SuperAdminSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'security' | 'notifications';

export function SuperAdminSettingsModal({ isOpen, onClose }: SuperAdminSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('security');
  const [isSaving, setIsSaving] = useState(false);

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
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
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newOrganizationAlert: true,
    subscriptionExpiryAlert: true,
    systemErrorAlert: true,
    dailyReport: false,
    weeklyReport: true,
    monthlyReport: true,
    alertEmail: "admin@salessphere.com",
  });

  const tabs = [
    { id: 'security' as TabType, label: 'Security', icon: ShieldCheckIcon },
    { id: 'notifications' as TabType, label: 'Notifications', icon: BellIcon },
  ];

  const handleSaveSettings = async () => {
    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("Settings saved successfully!");
      setIsSaving(false);
    }, 1000);
  };

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Password Policies</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="password-min-length" className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Password Length
            </label>
            <input
              id="password-min-length"
              type="number"
              min="6"
              max="32"
              value={securitySettings.passwordMinLength}
              onChange={(e) => setSecuritySettings({...securitySettings, passwordMinLength: parseInt(e.target.value)})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Minimum Password Length"
              title="Set minimum password length (6-32 characters)"
            />
          </div>

          <div>
            <label htmlFor="password-expiry" className="block text-sm font-medium text-gray-700 mb-2">
              Password Expiry (days)
            </label>
            <input
              id="password-expiry"
              type="number"
              min="30"
              max="365"
              value={securitySettings.passwordExpiry}
              onChange={(e) => setSecuritySettings({...securitySettings, passwordExpiry: parseInt(e.target.value)})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Password Expiry in days"
              title="Set password expiry period (30-365 days)"
            />
            <p className="mt-1 text-xs text-gray-500">Users will be required to change password after this period</p>
          </div>

          <div className="md:col-span-2 space-y-3">
            <label htmlFor="require-uppercase" className="flex items-center gap-3 cursor-pointer">
              <input
                id="require-uppercase"
                type="checkbox"
                checked={securitySettings.requireUppercase}
                onChange={(e) => setSecuritySettings({...securitySettings, requireUppercase: e.target.checked})}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                aria-label="Require uppercase letters"
                title="Require uppercase letters (A-Z)"
              />
              <span className="text-sm text-gray-700">Require uppercase letters (A-Z)</span>
            </label>

            <label htmlFor="require-lowercase" className="flex items-center gap-3 cursor-pointer">
              <input
                id="require-lowercase"
                type="checkbox"
                checked={securitySettings.requireLowercase}
                onChange={(e) => setSecuritySettings({...securitySettings, requireLowercase: e.target.checked})}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                aria-label="Require lowercase letters"
                title="Require lowercase letters (a-z)"
              />
              <span className="text-sm text-gray-700">Require lowercase letters (a-z)</span>
            </label>

            <label htmlFor="require-numbers" className="flex items-center gap-3 cursor-pointer">
              <input
                id="require-numbers"
                type="checkbox"
                checked={securitySettings.requireNumbers}
                onChange={(e) => setSecuritySettings({...securitySettings, requireNumbers: e.target.checked})}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                aria-label="Require numbers"
                title="Require numbers (0-9)"
              />
              <span className="text-sm text-gray-700">Require numbers (0-9)</span>
            </label>

            <label htmlFor="require-special-chars" className="flex items-center gap-3 cursor-pointer">
              <input
                id="require-special-chars"
                type="checkbox"
                checked={securitySettings.requireSpecialChars}
                onChange={(e) => setSecuritySettings({...securitySettings, requireSpecialChars: e.target.checked})}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                aria-label="Require special characters"
                title="Require special characters (!@#$%^&*)"
              />
              <span className="text-sm text-gray-700">Require special characters (!@#$%^&*)</span>
            </label>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Login Security</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="max-login-attempts" className="block text-sm font-medium text-gray-700 mb-2">
              Max Login Attempts
            </label>
            <input
              id="max-login-attempts"
              type="number"
              min="3"
              max="10"
              value={securitySettings.maxLoginAttempts}
              onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value)})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Maximum login attempts"
              title="Set maximum login attempts (3-10)"
            />
            <p className="mt-1 text-xs text-gray-500">Account will be locked after this many failed attempts</p>
          </div>

          <div>
            <label htmlFor="lockout-duration" className="block text-sm font-medium text-gray-700 mb-2">
              Lockout Duration (minutes)
            </label>
            <input
              id="lockout-duration"
              type="number"
              min="5"
              max="60"
              value={securitySettings.lockoutDuration}
              onChange={(e) => setSecuritySettings({...securitySettings, lockoutDuration: parseInt(e.target.value)})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Lockout duration in minutes"
              title="Set lockout duration (5-60 minutes)"
            />
          </div>

          <div className="md:col-span-2 space-y-3">
            <label htmlFor="require-mfa" className="flex items-center gap-3 cursor-pointer">
              <input
                id="require-mfa"
                type="checkbox"
                checked={securitySettings.requireMFA}
                onChange={(e) => setSecuritySettings({...securitySettings, requireMFA: e.target.checked})}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                aria-label="Require Multi-Factor Authentication"
                title="Require Multi-Factor Authentication (MFA) for all users"
              />
              <span className="text-sm text-gray-700">Require Multi-Factor Authentication (MFA) for all users</span>
            </label>

            <label htmlFor="allow-multiple-sessions" className="flex items-center gap-3 cursor-pointer">
              <input
                id="allow-multiple-sessions"
                type="checkbox"
                checked={securitySettings.allowMultipleSessions}
                onChange={(e) => setSecuritySettings({...securitySettings, allowMultipleSessions: e.target.checked})}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                aria-label="Allow multiple active sessions"
                title="Allow users to have multiple active sessions"
              />
              <span className="text-sm text-gray-700">Allow users to have multiple active sessions</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="admin-alert-email" className="block text-sm font-medium text-gray-700 mb-2">
              Admin Alert Email
            </label>
            <input
              id="admin-alert-email"
              type="email"
              value={notificationSettings.alertEmail}
              onChange={(e) => setNotificationSettings({...notificationSettings, alertEmail: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Admin Alert Email"
              title="Enter admin alert email address"
              placeholder="admin@example.com"
            />
            <p className="mt-1 text-xs text-gray-500">All system alerts will be sent to this email</p>
          </div>

          <div className="space-y-3">
            <label htmlFor="enable-email-notifications" className="flex items-center gap-3 cursor-pointer">
              <input
                id="enable-email-notifications"
                type="checkbox"
                checked={notificationSettings.emailNotifications}
                onChange={(e) => setNotificationSettings({...notificationSettings, emailNotifications: e.target.checked})}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                aria-label="Enable Email Notifications"
                title="Enable or disable all email notifications"
              />
              <span className="text-sm text-gray-700 font-medium">Enable Email Notifications</span>
            </label>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Alert Types</h3>
        <div className="space-y-3">
          <label htmlFor="new-org-alert" className="flex items-center gap-3 cursor-pointer">
            <input
              id="new-org-alert"
              type="checkbox"
              checked={notificationSettings.newOrganizationAlert}
              onChange={(e) => setNotificationSettings({...notificationSettings, newOrganizationAlert: e.target.checked})}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              aria-label="New Organization Registration Alert"
              title="Get notified when a new organization signs up"
            />
            <div className="flex-1">
              <span className="text-sm text-gray-700 font-medium">New Organization Registration</span>
              <p className="text-xs text-gray-500">Get notified when a new organization signs up</p>
            </div>
          </label>

          <label htmlFor="subscription-expiry-alert" className="flex items-center gap-3 cursor-pointer">
            <input
              id="subscription-expiry-alert"
              type="checkbox"
              checked={notificationSettings.subscriptionExpiryAlert}
              onChange={(e) => setNotificationSettings({...notificationSettings, subscriptionExpiryAlert: e.target.checked})}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              aria-label="Subscription Expiry Alert"
              title="Get notified 7 days before subscription expires"
            />
            <div className="flex-1">
              <span className="text-sm text-gray-700 font-medium">Subscription Expiry Alerts</span>
              <p className="text-xs text-gray-500">Get notified 7 days before subscription expires</p>
            </div>
          </label>

          <label htmlFor="system-error-alert" className="flex items-center gap-3 cursor-pointer">
            <input
              id="system-error-alert"
              type="checkbox"
              checked={notificationSettings.systemErrorAlert}
              onChange={(e) => setNotificationSettings({...notificationSettings, systemErrorAlert: e.target.checked})}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              aria-label="System Error Alert"
              title="Get notified when critical system errors occur"
            />
            <div className="flex-1">
              <span className="text-sm text-gray-700 font-medium">System Error Alerts</span>
              <p className="text-xs text-gray-500">Get notified when critical system errors occur</p>
            </div>
          </label>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Automated Reports</h3>
        <div className="space-y-3">
          <label htmlFor="daily-report" className="flex items-center gap-3 cursor-pointer">
            <input
              id="daily-report"
              type="checkbox"
              checked={notificationSettings.dailyReport}
              onChange={(e) => setNotificationSettings({...notificationSettings, dailyReport: e.target.checked})}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              aria-label="Daily Summary Report"
              title="Receive daily activity summary at 11:59 PM"
            />
            <div className="flex-1">
              <span className="text-sm text-gray-700 font-medium">Daily Summary Report</span>
              <p className="text-xs text-gray-500">Receive daily activity summary at 11:59 PM</p>
            </div>
          </label>

          <label htmlFor="weekly-report" className="flex items-center gap-3 cursor-pointer">
            <input
              id="weekly-report"
              type="checkbox"
              checked={notificationSettings.weeklyReport}
              onChange={(e) => setNotificationSettings({...notificationSettings, weeklyReport: e.target.checked})}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              aria-label="Weekly Performance Report"
              title="Receive every Monday at 9:00 AM"
            />
            <div className="flex-1">
              <span className="text-sm text-gray-700 font-medium">Weekly Performance Report</span>
              <p className="text-xs text-gray-500">Receive every Monday at 9:00 AM</p>
            </div>
          </label>

          <label htmlFor="monthly-report" className="flex items-center gap-3 cursor-pointer">
            <input
              id="monthly-report"
              type="checkbox"
              checked={notificationSettings.monthlyReport}
              onChange={(e) => setNotificationSettings({...notificationSettings, monthlyReport: e.target.checked})}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              aria-label="Monthly Analytics Report"
              title="Receive on the 1st of every month"
            />
            <div className="flex-1">
              <span className="text-sm text-gray-700 font-medium">Monthly Analytics Report</span>
              <p className="text-xs text-gray-500">Receive on the 1st of every month</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!w-[96vw] !max-w-[1400px] !h-[96vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-gray-200">
          <DialogTitle className="text-2xl font-bold text-slate-900">
            Super Admin Settings
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">Manage global security and notification settings</p>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar with Tabs */}
          <div className="w-64 border-r border-gray-200 bg-gray-50 overflow-y-auto flex-shrink-0">
            <nav className="p-4 space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    aria-label={`Switch to ${tab.label} tab`}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {activeTab === 'security' && renderSecuritySettings()}
              {activeTab === 'notifications' && renderNotificationSettings()}
            </div>
          </div>
        </div>

        {/* Footer with Save Button */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveSettings}
              variant="primary"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save All Settings"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
