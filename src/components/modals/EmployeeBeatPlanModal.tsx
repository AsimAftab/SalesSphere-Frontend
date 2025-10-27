import { X, MapPin, Calendar, Store, AlertCircle, Navigation2 } from 'lucide-react';
import { Badge } from '../uix/badge';
import { Button } from '../uix/button';
import { Avatar, AvatarFallback, AvatarImage } from '../uix/avatar';

interface Shop {
  id: string;
  name: string;
  address: string;
  priority: 'high' | 'medium' | 'low';
  zone: string;
  visitTime?: string;
  status?: 'completed' | 'pending' | 'skipped';
}

interface BeatPlan {
  id: string;
  name: string;
  dateAssigned: string;
  status: 'active' | 'pending' | 'completed';
  totalShops: number;
  completedShops: number;
  assignedShops: Shop[];
}

interface Employee {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

interface EmployeeBeatPlanModalProps {
  employee: Employee;
  beatPlan: BeatPlan;
  onClose: () => void;
}

export function EmployeeBeatPlanModal({ employee, beatPlan, onClose }: EmployeeBeatPlanModalProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getShopStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'skipped':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden animate-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-2 border-white shadow-lg">
                <AvatarImage src={employee.avatar} />
                <AvatarFallback className="bg-white text-blue-600 text-xl">
                  {getInitials(employee.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-white text-2xl mb-1">{employee.name}</h2>
                <p className="text-blue-100">{employee.role}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6">
            {/* Beat Plan Overview */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 mb-6 border border-blue-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-gray-900 text-xl mb-2">{beatPlan.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Assigned: {beatPlan.dateAssigned}</span>
                  </div>
                </div>
                <Badge variant="outline" className={`${getStatusColor(beatPlan.status)} capitalize`}>
                  {beatPlan.status}
                </Badge>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Store className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total Shops</p>
                      <p className="text-xl text-gray-900">{beatPlan.totalShops}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-green-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Store className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Completed</p>
                      <p className="text-xl text-gray-900">{beatPlan.completedShops}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-yellow-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Store className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Remaining</p>
                      <p className="text-xl text-gray-900">
                        {beatPlan.totalShops - beatPlan.completedShops}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Assigned Route */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Navigation2 className="w-5 h-5 text-blue-600" />
                  <h3 className="text-gray-900">Assigned Route ({beatPlan.assignedShops.length} shops)</h3>
                </div>
              </div>

              {/* Shop Cards */}
              <div className="space-y-3">
                {beatPlan.assignedShops.map((shop, index) => (
                  <div
                    key={shop.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-4">
                      {/* Shop Number */}
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center">
                          <span className="text-sm">{index + 1}</span>
                        </div>
                      </div>

                      {/* Shop Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <h4 className="text-gray-900 mb-1">{shop.name}</h4>
                            <div className="flex items-start gap-2 text-sm text-gray-500">
                              <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                              <span className="text-xs">{shop.address}</span>
                            </div>
                          </div>
                          {shop.status && (
                            <Badge
                              variant="outline"
                              className={`${getShopStatusColor(shop.status)} capitalize text-xs`}
                            >
                              {shop.status}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                          <Badge
                            variant="outline"
                            className={`${getPriorityColor(shop.priority)} capitalize text-xs`}
                          >
                            {shop.priority} Priority
                          </Badge>
                          <span className="text-xs text-gray-500">{shop.zone}</span>
                          {shop.visitTime && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>Expected: {shop.visitTime}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Arrow to next */}
                      {index < beatPlan.assignedShops.length - 1 && (
                        <div className="flex-shrink-0 text-gray-300">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {beatPlan.assignedShops.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <Store className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 mb-1">No shops assigned yet</p>
                  <p className="text-sm text-gray-400">Shops will appear here once assigned to this route</p>
                </div>
              )}
            </div>

            {/* Priority Summary */}
            {beatPlan.assignedShops.length > 0 && (
              <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-700 mb-1">
                      <span className="font-medium">Route Summary:</span> Visit high-priority shops first for optimal results.
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span>
                        High Priority: {beatPlan.assignedShops.filter((s) => s.priority === 'high').length}
                      </span>
                      <span>
                        Medium Priority: {beatPlan.assignedShops.filter((s) => s.priority === 'medium').length}
                      </span>
                      <span>
                        Low Priority: {beatPlan.assignedShops.filter((s) => s.priority === 'low').length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600">
              View on Map
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Clock } from 'lucide-react';
