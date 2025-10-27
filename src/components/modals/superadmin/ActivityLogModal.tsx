import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "../../uix/dialog";
import { Badge } from "../../uix/badge";
import CustomButton from "../../UI/Button/Button";
import { Input } from "../../uix/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../uix/table";
import {
  Activity,
  Clock,
  User,
  Building2,
  UserCog,
  RefreshCw,
  Plus,
  Trash2,
  Edit,
  Power,
  CreditCard,
  Loader2,
  Search,
  X as XIcon
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "../../uix/tabs";
import {
  getAllActivityLogs,
  type ActivityLog
} from "../../../api/services/superadmin/activityLogService";
import { Card, CardContent } from "../../uix/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../uix/tooltip";

interface ActivityLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ActivityLogModal({ isOpen, onClose }: ActivityLogModalProps) {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");

  useEffect(() => {
    if (isOpen) {
      fetchLogs();
    }
  }, [isOpen]);

  useEffect(() => {
    applyFilters();
  }, [logs, searchQuery, activeFilter]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await getAllActivityLogs();
      setLogs(data);
    } catch (err) {
      console.error("Error fetching activity logs:", err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...logs];

    // Apply type filter
    if (activeFilter !== "all") {
      filtered = filtered.filter(log => log.actionType === activeFilter);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(log =>
        log.action.toLowerCase().includes(query) ||
        log.performedBy.name.toLowerCase().includes(query) ||
        log.targetName.toLowerCase().includes(query) ||
        log.details?.toLowerCase().includes(query)
      );
    }

    setFilteredLogs(filtered);
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case "create":
        return <Plus className="w-4 h-4" />;
      case "update":
        return <Edit className="w-4 h-4" />;
      case "delete":
        return <Trash2 className="w-4 h-4" />;
      case "activate":
        return <Power className="w-4 h-4" />;
      case "deactivate":
        return <Power className="w-4 h-4" />;
      case "transfer":
        return <RefreshCw className="w-4 h-4" />;
      case "add":
        return <Plus className="w-4 h-4" />;
      case "remove":
        return <Trash2 className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActionBadgeColor = (actionType: string) => {
    switch (actionType) {
      case "create":
      case "add":
        return "bg-green-100 text-green-700 border-green-200";
      case "update":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "delete":
      case "remove":
        return "bg-red-100 text-red-700 border-red-200";
      case "activate":
        return "bg-green-100 text-green-700 border-green-200";
      case "deactivate":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "transfer":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getTargetTypeIcon = (targetType: string) => {
    switch (targetType) {
      case "organization":
        return <Building2 className="w-3 h-3" />;
      case "user":
        return <User className="w-3 h-3" />;
      case "system-user":
        return <UserCog className="w-3 h-3" />;
      case "subscription":
        return <CreditCard className="w-3 h-3" />;
      default:
        return <Activity className="w-3 h-3" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    return role === "Super Admin"
      ? "bg-blue-600 text-white"
      : "bg-green-600 text-white";
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
  };

  const formatFullTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!w-[96vw] !max-w-[96vw] !h-[96vh] overflow-hidden flex flex-col p-6">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-slate-900 flex items-center gap-3">
                Activity Logs
                <Badge variant="outline" className="text-indigo-700 border-indigo-500">
                  {filteredLogs.length} {filteredLogs.length === 1 ? 'Activity' : 'Activities'}
                </Badge>
              </DialogTitle>
              <DialogDescription className="mt-1">
                Track all system changes and user activities
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Filters Section */}
        <div className="space-y-4 mt-4 flex-shrink-0">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search by action, user, or target..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <XIcon className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Action Type Tabs */}
          <Tabs value={activeFilter} onValueChange={setActiveFilter}>
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="create">Create</TabsTrigger>
              <TabsTrigger value="update">Update</TabsTrigger>
              <TabsTrigger value="delete">Delete</TabsTrigger>
              <TabsTrigger value="activate">Activate</TabsTrigger>
              <TabsTrigger value="deactivate">Deactivate</TabsTrigger>
              <TabsTrigger value="transfer">Transfer</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Activity Logs Table */}
        <div className="mt-4 overflow-y-auto flex-1 border rounded-lg">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
          ) : filteredLogs.length === 0 ? (
            <Card className="m-4">
              <CardContent className="py-12 text-center">
                <Activity className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No activity logs found</p>
                <p className="text-slate-400 text-sm mt-2">Try adjusting your filters or search query</p>
              </CardContent>
            </Card>
          ) : (
            <Table>
              <TableHeader className="sticky top-0 bg-slate-50 z-10">
                <TableRow>
                  <TableHead className="py-3">Timestamp</TableHead>
                  <TableHead className="py-3">Performed By</TableHead>
                  <TableHead className="py-3">Action</TableHead>
                  <TableHead className="py-3">Target</TableHead>
                  <TableHead className="py-3">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-slate-50">
                    <TableCell className="py-3">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 text-slate-600 cursor-help">
                              <Clock className="w-4 h-4 text-slate-400" />
                              <span className="text-sm">{formatTimestamp(log.timestamp)}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">{formatFullTimestamp(log.timestamp)}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="py-3">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 cursor-help">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                {log.performedBy.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-900">{log.performedBy.name}</p>
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-xs">
                              <Badge className={getRoleBadgeColor(log.performedBy.role)}>
                                {log.performedBy.role}
                              </Badge>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge variant="outline" className={`${getActionBadgeColor(log.actionType)} flex items-center gap-1 w-fit`}>
                        {getActionIcon(log.actionType)}
                        <span className="capitalize">{log.actionType}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-slate-600">
                          {getTargetTypeIcon(log.targetType)}
                          <span className="text-xs capitalize">{log.targetType}</span>
                        </div>
                        <span className="text-sm font-medium text-slate-900">{log.targetName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="space-y-1">
                        <p className="text-sm text-slate-600">{log.details}</p>
                        {log.changes && log.changes.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {log.changes.map((change, idx) => (
                              <div key={idx} className="text-xs text-slate-500 bg-slate-50 rounded px-2 py-1">
                                <span className="font-medium">{change.field}:</span>{' '}
                                <span className="text-red-600 line-through">{change.oldValue}</span>{' '}
                                <span className="text-green-600">{change.newValue}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-4 pt-4 border-t flex-shrink-0">
          <CustomButton variant="outline" onClick={onClose}>
            Close
          </CustomButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
