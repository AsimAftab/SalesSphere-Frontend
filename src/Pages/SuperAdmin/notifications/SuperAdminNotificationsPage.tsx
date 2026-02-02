import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/SuperAdminComponents/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/SuperAdminComponents/Card';
import { Input } from '../../../components/ui/SuperAdminComponents/Input';
import { Label } from '../../../components/ui/SuperAdminComponents/Label';
import { getSystemSettings, updateSystemSettings, type SystemSettings } from '../../../api/superAdmin/systemSettingsService';

export default function SuperAdminNotificationsPage() {
    const [systemSettings, setSystemSettings] = useState<SystemSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const data = await getSystemSettings();
            setSystemSettings(data);
        } catch (error) {
            console.error("Failed to load system settings", error);
            toast.error("Failed to load notification settings");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSystemSettings = async () => {
        if (!systemSettings) return;
        try {
            setSaving(true);
            await updateSystemSettings(systemSettings);
            toast.success("Notification settings saved successfully");
        } catch {
            toast.error("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    const updateNotifications = (field: string, value: boolean | string | number) => {
        if (!systemSettings) return;
        setSystemSettings({
            ...systemSettings,
            notifications: {
                ...systemSettings.notifications,
                [field]: value
            }
        });
    };

    if (loading && !systemSettings) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!systemSettings) return null;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Notifications & Alerts</h1>
                <p className="mt-2 text-sm text-gray-500">
                    Configure system-wide email notifications and automated reporting.
                </p>
            </div>

            <div className="space-y-6 max-w-5xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Email Notifications</CardTitle>
                        <CardDescription>Configure standard system email alerts.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="alert-email">Admin Alert Email</Label>
                            <Input
                                id="alert-email"
                                type="email"
                                value={systemSettings.notifications.alertEmail}
                                onChange={(e) => updateNotifications('alertEmail', e.target.value)}
                                placeholder="admin@example.com"
                            />
                            <p className="text-xs text-muted-foreground">All system alerts will be sent to this email.</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="emailNotifications"
                                checked={systemSettings.notifications.emailNotifications}
                                onChange={(e) => updateNotifications('emailNotifications', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <label htmlFor="emailNotifications" className="text-sm font-medium leading-none">
                                Enable Email Notifications
                            </label>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Alert Types</CardTitle>
                        <CardDescription>Select which events trigger an alert.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { key: 'newOrganizationAlert', label: 'New Organization Registration', desc: 'Get notified when a new organization signs up' },
                            { key: 'subscriptionExpiryAlert', label: 'Subscription Expiry Alerts', desc: 'Get notified 7 days before subscription expires' },
                            { key: 'systemErrorAlert', label: 'System Error Alerts', desc: 'Get notified when critical system errors occur' }
                        ].map((item) => (
                            <div key={item.key} className="flex items-start space-x-3">
                                <input
                                    type="checkbox"
                                    id={item.key}
                                    checked={!!systemSettings.notifications[item.key]}
                                    onChange={(e) => updateNotifications(item.key, e.target.checked)}
                                    className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <label htmlFor={item.key} className="text-sm font-medium leading-none">
                                        {item.label}
                                    </label>
                                    <p className="text-xs text-muted-foreground">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Automated Reports</CardTitle>
                        <CardDescription>Schedule automatic system reports.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { key: 'dailyReport', label: 'Daily Summary Report', desc: 'Receive daily activity summary at 11:59 PM' },
                            { key: 'weeklyReport', label: 'Weekly Performance Report', desc: 'Receive every Monday at 9:00 AM' },
                            { key: 'monthlyReport', label: 'Monthly Analytics Report', desc: 'Receive on the 1st of every month' }
                        ].map((item) => (
                            <div key={item.key} className="flex items-start space-x-3">
                                <input
                                    type="checkbox"
                                    id={item.key}
                                    checked={!!systemSettings.notifications[item.key]}
                                    onChange={(e) => updateNotifications(item.key, e.target.checked)}
                                    className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <label htmlFor={item.key} className="text-sm font-medium leading-none">
                                        {item.label}
                                    </label>
                                    <p className="text-xs text-muted-foreground">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button onClick={handleSaveSystemSettings} disabled={saving}>
                        {saving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                            </>
                        ) : (
                            'Save Notification Settings'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
