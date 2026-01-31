import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { Button } from '../../../components/UI/SuperadminComponents/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/UI/SuperadminComponents/card';
import { Input } from '../../../components/UI/SuperadminComponents/input';
import { Label } from '../../../components/UI/SuperadminComponents/label';
import { getSystemSettings, updateSystemSettings, type SystemSettings } from '../../../api/SuperAdmin/systemSettingsService';

export default function SuperAdminSecurityPage() {
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
            toast.error("Failed to load security settings");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSystemSettings = async () => {
        if (!systemSettings) return;
        try {
            setSaving(true);
            await updateSystemSettings(systemSettings);
            toast.success("Security settings saved successfully");
        } catch {
            toast.error("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    const updateSecurity = (field: string, value: boolean | string | number) => {
        if (!systemSettings) return;
        setSystemSettings({
            ...systemSettings,
            security: {
                ...systemSettings.security,
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
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Security Configuration</h1>
                <p className="mt-2 text-sm text-gray-500">
                    Manage global security policies including password requirements and login restrictions.
                </p>
            </div>

            <div className="space-y-6 max-w-5xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Password Policies</CardTitle>
                        <CardDescription>Set the requirements for user passwords.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="password-min-length">Minimum Password Length</Label>
                                <Input
                                    id="password-min-length"
                                    type="number"
                                    min={6}
                                    max={32}
                                    value={systemSettings.security.passwordMinLength}
                                    onChange={(e) => updateSecurity('passwordMinLength', parseInt(e.target.value))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password-expiry">Password Expiry (days)</Label>
                                <Input
                                    id="password-expiry"
                                    type="number"
                                    min={30}
                                    max={365}
                                    value={systemSettings.security.passwordExpiry}
                                    onChange={(e) => updateSecurity('passwordExpiry', parseInt(e.target.value))}
                                />
                            </div>
                            <div className="col-span-full space-y-3">
                                {[
                                    { key: 'requireUppercase', label: 'Require uppercase letters (A-Z)' },
                                    { key: 'requireLowercase', label: 'Require lowercase letters (a-z)' },
                                    { key: 'requireNumbers', label: 'Require numbers (0-9)' },
                                    { key: 'requireSpecialChars', label: 'Require special characters (!@#$%^&*)' }
                                ].map((item) => (
                                    <div key={item.key} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id={item.key}
                                            checked={!!systemSettings.security[item.key]}
                                            onChange={(e) => updateSecurity(item.key, e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <label htmlFor={item.key} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            {item.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Login Security</CardTitle>
                        <CardDescription>Manage login attempts and session policies.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
                                <Input
                                    id="max-login-attempts"
                                    type="number"
                                    min={3}
                                    max={10}
                                    value={systemSettings.security.maxLoginAttempts}
                                    onChange={(e) => updateSecurity('maxLoginAttempts', parseInt(e.target.value))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lockout-duration">Lockout Duration (minutes)</Label>
                                <Input
                                    id="lockout-duration"
                                    type="number"
                                    min={5}
                                    max={60}
                                    value={systemSettings.security.lockoutDuration}
                                    onChange={(e) => updateSecurity('lockoutDuration', parseInt(e.target.value))}
                                />
                            </div>
                            <div className="col-span-full space-y-3">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="requireMFA"
                                        checked={systemSettings.security.requireMFA}
                                        onChange={(e) => updateSecurity('requireMFA', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <label htmlFor="requireMFA" className="text-sm font-medium leading-none">
                                        Require Multi-Factor Authentication (MFA)
                                    </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="allowMultipleSessions"
                                        checked={systemSettings.security.allowMultipleSessions}
                                        onChange={(e) => updateSecurity('allowMultipleSessions', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <label htmlFor="allowMultipleSessions" className="text-sm font-medium leading-none">
                                        Allow users to have multiple active sessions
                                    </label>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button onClick={handleSaveSystemSettings} disabled={saving}>
                        {saving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                            </>
                        ) : (
                            'Save Security Settings'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
