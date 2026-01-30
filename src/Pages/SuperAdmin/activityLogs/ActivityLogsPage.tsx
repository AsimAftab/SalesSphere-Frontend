import { useState, useEffect } from 'react';
import { getAllActivityLogs } from '../../../api/SuperAdmin/activityLogService';
import type { ActivityLog } from '../../../api/SuperAdmin/activityLogService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/UI/SuperadminComponents/card';
import { Input } from '../../../components/UI/SuperadminComponents/input';
import { Loader2 } from 'lucide-react';


export default function ActivityLogsPage() {
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const data = await getAllActivityLogs();
            setLogs(data);
        } catch (error) {
            console.error("Error fetching logs:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredLogs = logs.filter(log =>
        log.action.toLowerCase().includes(filter.toLowerCase()) ||
        (log.details?.toLowerCase().includes(filter.toLowerCase()) ?? false) ||
        log.performedBy.name.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Activity Logs</h1>
                <p className="mt-2 text-sm text-gray-500">
                    Audit trail of all actions performed within the system.
                </p>
            </div>

            <div className="max-w-md">
                <Input
                    placeholder="Search logs..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Displaying {filteredLogs.length} records</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {filteredLogs.map((log) => (
                                <div key={log.id} className="flex items-start">
                                    <div className="mr-4 flex flex-col items-center">
                                        <div className="h-2 w-2 rounded-full bg-blue-500 ring-4 ring-blue-100" />
                                        <div className="h-full w-px bg-gray-200 my-1" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-gray-900">{log.action}</p>
                                            <span className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</span>
                                        </div>
                                        {log.details && (
                                            <p className="text-sm text-gray-500">{log.details}</p>
                                        )}
                                        <div className="flex items-center pt-1 text-xs text-muted-foreground">
                                            <span className="font-medium mr-2">{log.performedBy.name}</span>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                ${log.action === 'Login' ? 'bg-green-100 text-green-800' :
                                                    log.action === 'Logout' ? 'bg-gray-100 text-gray-800' :
                                                        'bg-blue-100 text-blue-800'}`}>
                                                {log.action}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
