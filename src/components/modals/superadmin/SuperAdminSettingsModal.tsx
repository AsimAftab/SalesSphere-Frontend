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
import { toast } from "sonner";
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
      toast.success("Settings saved successfully!", {
        description: "All changes have been applied to the system."
      });
      setIsSaving(false);
    }, 1000);
  };

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Password Policies</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Password Length
            </label>
            <input
              type="number"
              min="6"
              max="32"
              value={securitySettings.passwordMinLength}
              onChange={(e) => setSecuritySettings({...securitySettings, passwordMinLength: parseInt(e.target.value)})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password Expiry (days)
            </label>
            <input
              type="number"
              min="30"
              max="365"
              value={securitySettings.passwordExpiry}
              onChange={(e) => setSecuritySettings({...securitySettings, passwordExpiry: parseInt(e.target.value)})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">Users will be required to change password after this period</p>
          </div>

          <div className="md:col-span-2 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={securitySettings.requireUppercase}
                onChange={(e) => setSecuritySettings({...securitySettings, requireUppercase: e.target.checked})}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Require uppercase letters (A-Z)</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={securitySettings.requireLowercase}
                onChange={(e) => setSecuritySettings({...securitySettings, requireLowercase: e.target.checked})}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Require lowercase letters (a-z)</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={securitySettings.requireNumbers}
                onChange={(e) => setSecuritySettings({...securitySettings, requireNumbers: e.target.checked})}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Require numbers (0-9)</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={securitySettings.requireSpecialChars}
                onChange={(e) => setSecuritySettings({...securitySettings, requireSpecialChars: e.target.checked})}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Login Attempts
            </label>
            <input
              type="number"
              min="3"
              max="10"
              value={securitySettings.maxLoginAttempts}
              onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value)})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">Account will be locked after this many failed attempts</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lockout Duration (minutes)
            </label>
            <input
              type="number"
              min="5"
              max="60"
              value={securitySettings.lockoutDuration}
              onChange={(e) => setSecuritySettings({...securitySettings, lockoutDuration: parseInt(e.target.value)})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={securitySettings.requireMFA}
                onChange={(e) => setSecuritySettings({...securitySettings, requireMFA: e.target.checked})}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Require Multi-Factor Authentication (MFA) for all users</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={securitySettings.allowMultipleSessions}
                onChange={(e) => setSecuritySettings({...securitySettings, allowMultipleSessions: e.target.checked})}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Alert Email
            </label>
            <input
              type="email"
              value={notificationSettings.alertEmail}
              onChange={(e) => setNotificationSettings({...notificationSettings, alertEmail: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">All system alerts will be sent to this email</p>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.emailNotifications}
                onChange={(e) => setNotificationSettings({...notificationSettings, emailNotifications: e.target.checked})}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 font-medium">Enable Email Notifications</span>
            </label>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Alert Types</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notificationSettings.newOrganizationAlert}
              onChange={(e) => setNotificationSettings({...notificationSettings, newOrganizationAlert: e.target.checked})}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div className="flex-1">
              <span className="text-sm text-gray-700 font-medium">New Organization Registration</span>
              <p className="text-xs text-gray-500">Get notified when a new organization signs up</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notificationSettings.subscriptionExpiryAlert}
              onChange={(e) => setNotificationSettings({...notificationSettings, subscriptionExpiryAlert: e.target.checked})}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div className="flex-1">
              <span className="text-sm text-gray-700 font-medium">Subscription Expiry Alerts</span>
              <p className="text-xs text-gray-500">Get notified 7 days before subscription expires</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notificationSettings.systemErrorAlert}
              onChange={(e) => setNotificationSettings({...notificationSettings, systemErrorAlert: e.target.checked})}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notificationSettings.dailyReport}
              onChange={(e) => setNotificationSettings({...notificationSettings, dailyReport: e.target.checked})}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div className="flex-1">
              <span className="text-sm text-gray-700 font-medium">Daily Summary Report</span>
              <p className="text-xs text-gray-500">Receive daily activity summary at 11:59 PM</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notificationSettings.weeklyReport}
              onChange={(e) => setNotificationSettings({...notificationSettings, weeklyReport: e.target.checked})}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div className="flex-1">
              <span className="text-sm text-gray-700 font-medium">Weekly Performance Report</span>
              <p className="text-xs text-gray-500">Receive every Monday at 9:00 AM</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notificationSettings.monthlyReport}
              onChange={(e) => setNotificationSettings({...notificationSettings, monthlyReport: e.target.checked})}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
                    onClick={() => setActiveTab(tab.id)}
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
