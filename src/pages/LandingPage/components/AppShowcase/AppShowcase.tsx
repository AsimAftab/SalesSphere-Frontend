import { memo, useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MapPin, Calendar, ClipboardCheck, ShoppingCart, Users, TrendingUp, FileText, Navigation } from 'lucide-react';
import { cn } from '@/components/ui/utils';

interface AppShowcaseProps {
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const AUTO_ROTATE_INTERVAL = 3000;

// Phone screen components
const AttendanceScreen = () => (
  <div className="p-2 sm:p-3 h-full bg-gradient-to-b from-slate-50 to-white">
    <div className="text-[8px] sm:text-[10px] font-semibold text-gray-900 mb-2 sm:mb-3">GPS Attendance</div>
    <div className="bg-primary rounded-lg sm:rounded-xl p-2 sm:p-3 mb-2 sm:mb-3 text-white">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[6px] sm:text-[8px] opacity-80">Current Status</div>
          <div className="text-[10px] sm:text-sm font-semibold">On Field</div>
          <div className="text-[6px] sm:text-[10px] opacity-80">Since 9:00 AM</div>
        </div>
        <MapPin className="w-4 h-4 sm:w-6 sm:h-6 opacity-80" />
      </div>
    </div>
    <div className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-sm border border-gray-100 mb-2 sm:mb-3">
      <div className="text-[7px] sm:text-[9px] font-semibold text-gray-700 mb-1 sm:mb-2">Weekly Overview</div>
      <div className="flex justify-between">
        {['M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={`${day}-${i}`} className="text-center">
            <div className="text-[6px] sm:text-[8px] text-gray-400 mb-0.5 sm:mb-1">{day}</div>
            <div className={cn(
              'w-4 h-4 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[6px] sm:text-[8px]',
              i < 3 ? 'bg-green-100 text-green-600' : i === 3 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
            )}>
              {i < 3 ? '✓' : i === 3 ? '•' : '-'}
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="grid grid-cols-2 gap-1 sm:gap-2">
      <div className="bg-green-50 rounded-md sm:rounded-lg p-1.5 sm:p-2 text-center">
        <div className="text-sm sm:text-lg font-bold text-green-600">96%</div>
        <div className="text-[6px] sm:text-[8px] text-green-600">On Time</div>
      </div>
      <div className="bg-blue-50 rounded-md sm:rounded-lg p-1.5 sm:p-2 text-center">
        <div className="text-sm sm:text-lg font-bold text-blue-600">8.2h</div>
        <div className="text-[6px] sm:text-[8px] text-blue-600">Avg. Hours</div>
      </div>
    </div>
  </div>
);

const BeatPlanScreen = () => (
  <div className="p-2 sm:p-3 h-full bg-gradient-to-b from-slate-50 to-white">
    <div className="text-[8px] sm:text-[10px] font-semibold text-gray-900 mb-2 sm:mb-3">Route Planner</div>
    <div className="space-y-1 sm:space-y-2">
      {[
        { name: 'Sharma Electronics', status: 'completed', time: '9:30 AM' },
        { name: 'Gupta Traders', status: 'completed', time: '10:45 AM' },
        { name: 'Metro Wholesale', status: 'current', time: '11:30 AM' },
        { name: 'Singh Retail Hub', status: 'pending', time: '1:00 PM' },
        { name: 'Patel Distributors', status: 'pending', time: '2:30 PM' },
      ].map((visit, i) => (
        <div key={i} className={cn(
          'rounded-md sm:rounded-lg p-1.5 sm:p-2.5 border',
          visit.status === 'completed' ? 'bg-green-50 border-green-100' :
          visit.status === 'current' ? 'bg-primary/10 border-primary/20' :
          'bg-white border-gray-100'
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className={cn(
                'w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full',
                visit.status === 'completed' ? 'bg-green-500' :
                visit.status === 'current' ? 'bg-primary' : 'bg-gray-300'
              )} />
              <span className="text-[7px] sm:text-[9px] font-medium text-gray-800">{visit.name}</span>
            </div>
            <span className="text-[6px] sm:text-[8px] text-gray-500">{visit.time}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const OrdersScreen = () => (
  <div className="p-2 sm:p-3 h-full bg-gradient-to-b from-slate-50 to-white">
    <div className="flex items-center justify-between mb-2 sm:mb-3">
      <div className="text-[8px] sm:text-[10px] font-semibold text-gray-900">Order Management</div>
      <div className="bg-secondary text-white text-[6px] sm:text-[8px] px-1.5 sm:px-2 py-0.5 rounded-full">+ New</div>
    </div>
    <div className="grid grid-cols-2 gap-1 sm:gap-2 mb-2 sm:mb-3">
      <div className="bg-primary/10 rounded-md sm:rounded-lg p-1.5 sm:p-2 text-center">
        <div className="text-[10px] sm:text-sm font-bold text-primary">₹1.2L</div>
        <div className="text-[6px] sm:text-[8px] text-primary/70">Today's Value</div>
      </div>
      <div className="bg-secondary/10 rounded-md sm:rounded-lg p-1.5 sm:p-2 text-center">
        <div className="text-[10px] sm:text-sm font-bold text-secondary">12</div>
        <div className="text-[6px] sm:text-[8px] text-secondary/70">Orders Placed</div>
      </div>
    </div>
    <div className="text-[7px] sm:text-[9px] font-semibold text-gray-700 mb-1 sm:mb-2">Recent Activity</div>
    <div className="space-y-1 sm:space-y-2">
      {[
        { party: 'Sharma Electronics', amount: '₹32,500', status: 'Delivered' },
        { party: 'Metro Wholesale', amount: '₹48,200', status: 'Processing' },
        { party: 'Patel Distributors', amount: '₹25,000', status: 'Confirmed' },
      ].map((order, i) => (
        <div key={i} className="bg-white rounded-md sm:rounded-lg p-1.5 sm:p-2 border border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-[7px] sm:text-[9px] font-medium text-gray-800">{order.party}</div>
            <div className="text-[6px] sm:text-[8px] text-gray-500">{order.status}</div>
          </div>
          <div className="text-[8px] sm:text-[10px] font-semibold text-gray-900">{order.amount}</div>
        </div>
      ))}
    </div>
  </div>
);

const DashboardScreen = () => (
  <div className="p-2 sm:p-3 h-full bg-gradient-to-b from-slate-50 to-white">
    <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center">
        <span className="text-white font-bold text-[8px] sm:text-xs">RK</span>
      </div>
      <div>
        <div className="text-[8px] sm:text-[10px] font-semibold text-gray-900">Welcome Back!</div>
        <div className="text-[6px] sm:text-[8px] text-gray-500">Rahul Kumar</div>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-1 sm:gap-2 mb-2 sm:mb-3">
      <div className="bg-green-50 rounded-lg sm:rounded-xl p-1.5 sm:p-2.5">
        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 mb-0.5 sm:mb-1" />
        <div className="text-[6px] sm:text-[8px] text-green-600">Status</div>
        <div className="text-[8px] sm:text-xs font-bold text-green-700">On Field</div>
      </div>
      <div className="bg-blue-50 rounded-lg sm:rounded-xl p-1.5 sm:p-2.5">
        <ClipboardCheck className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 mb-0.5 sm:mb-1" />
        <div className="text-[6px] sm:text-[8px] text-blue-600">Visits Today</div>
        <div className="text-[8px] sm:text-xs font-bold text-blue-700">5 of 8</div>
      </div>
      <div className="bg-orange-50 rounded-lg sm:rounded-xl p-1.5 sm:p-2.5">
        <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600 mb-0.5 sm:mb-1" />
        <div className="text-[6px] sm:text-[8px] text-orange-600">Sales Today</div>
        <div className="text-[8px] sm:text-xs font-bold text-orange-700">₹85K</div>
      </div>
      <div className="bg-purple-50 rounded-lg sm:rounded-xl p-1.5 sm:p-2.5">
        <Users className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 mb-0.5 sm:mb-1" />
        <div className="text-[6px] sm:text-[8px] text-purple-600">Clients</div>
        <div className="text-[8px] sm:text-xs font-bold text-purple-700">24</div>
      </div>
    </div>
    <div className="bg-white rounded-lg sm:rounded-xl p-1.5 sm:p-2.5 border border-gray-100">
      <div className="text-[7px] sm:text-[9px] font-semibold text-gray-700 mb-1 sm:mb-2">Quick Actions</div>
      <div className="flex gap-1 sm:gap-2">
        <div className="flex-1 bg-primary text-white rounded-md sm:rounded-lg py-1.5 sm:py-2 text-center text-[6px] sm:text-[8px] font-medium">Start Visit</div>
        <div className="flex-1 bg-secondary text-white rounded-md sm:rounded-lg py-1.5 sm:py-2 text-center text-[6px] sm:text-[8px] font-medium">Create Order</div>
      </div>
    </div>
  </div>
);

const PartiesScreen = () => (
  <div className="p-2 sm:p-3 h-full bg-gradient-to-b from-slate-50 to-white">
    <div className="flex items-center justify-between mb-2 sm:mb-3">
      <div className="text-[8px] sm:text-[10px] font-semibold text-gray-900">Client Directory</div>
      <div className="bg-primary text-white text-[6px] sm:text-[8px] px-1.5 sm:px-2 py-0.5 rounded-full">+ Add</div>
    </div>
    <div className="space-y-1.5 sm:space-y-2">
      {[
        { name: 'Sharma Electronics', type: 'Premium', amount: '₹2.8L' },
        { name: 'Metro Wholesale', type: 'Enterprise', amount: '₹5.2L' },
        { name: 'Gupta Traders', type: 'Standard', amount: '₹1.5L' },
        { name: 'Patel Distributors', type: 'Premium', amount: '₹3.8L' },
      ].map((party, i) => (
        <div key={i} className="bg-white rounded-md sm:rounded-lg p-1.5 sm:p-2 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-[6px] sm:text-[8px] font-bold text-primary">{party.name.charAt(0)}</span>
              </div>
              <div>
                <div className="text-[7px] sm:text-[9px] font-medium text-gray-800">{party.name}</div>
                <div className="text-[6px] sm:text-[8px] text-gray-500">{party.type}</div>
              </div>
            </div>
            <div className="text-[8px] sm:text-[10px] font-semibold text-primary">{party.amount}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AnalyticsScreen = () => (
  <div className="p-2 sm:p-3 h-full bg-gradient-to-b from-slate-50 to-white">
    <div className="text-[8px] sm:text-[10px] font-semibold text-gray-900 mb-2 sm:mb-3">Performance Insights</div>
    <div className="bg-primary rounded-lg sm:rounded-xl p-2 sm:p-3 mb-2 sm:mb-3 text-white">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[6px] sm:text-[8px] opacity-80">Monthly Revenue</div>
          <div className="text-sm sm:text-lg font-bold">₹12.8L</div>
          <div className="text-[6px] sm:text-[8px] text-green-300">↑ 18% growth</div>
        </div>
        <TrendingUp className="w-5 h-5 sm:w-7 sm:h-7 opacity-80" />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-1 sm:gap-2 mb-2 sm:mb-3">
      <div className="bg-blue-50 rounded-md sm:rounded-lg p-1.5 sm:p-2 text-center">
        <div className="text-[10px] sm:text-sm font-bold text-blue-600">248</div>
        <div className="text-[6px] sm:text-[8px] text-blue-600">Total Orders</div>
      </div>
      <div className="bg-green-50 rounded-md sm:rounded-lg p-1.5 sm:p-2 text-center">
        <div className="text-[10px] sm:text-sm font-bold text-green-600">112%</div>
        <div className="text-[6px] sm:text-[8px] text-green-600">Target Hit</div>
      </div>
    </div>
    <div className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 border border-gray-100">
      <div className="text-[7px] sm:text-[9px] font-semibold text-gray-700 mb-1 sm:mb-2">Sales Trend</div>
      <div className="flex items-end justify-between h-10 sm:h-14 gap-1">
        {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
          <div key={i} className="flex-1 bg-primary/20 rounded-t" style={{ height: `${h}%` }}>
            <div className="w-full bg-primary rounded-t" style={{ height: '60%' }} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const EstimatesScreen = () => (
  <div className="p-2 sm:p-3 h-full bg-gradient-to-b from-slate-50 to-white">
    <div className="flex items-center justify-between mb-2 sm:mb-3">
      <div className="text-[8px] sm:text-[10px] font-semibold text-gray-900">Quotations</div>
      <div className="bg-secondary text-white text-[6px] sm:text-[8px] px-1.5 sm:px-2 py-0.5 rounded-full">+ Create</div>
    </div>
    <div className="space-y-1.5 sm:space-y-2">
      {[
        { id: 'QT-2024-001', party: 'Sharma Electronics', amount: '₹85,000', status: 'Approved' },
        { id: 'QT-2024-002', party: 'Metro Wholesale', amount: '₹1.2L', status: 'Review' },
        { id: 'QT-2024-003', party: 'Gupta Traders', amount: '₹42,000', status: 'Approved' },
        { id: 'QT-2024-004', party: 'Singh Retail Hub', amount: '₹28,000', status: 'Draft' },
      ].map((estimate, i) => (
        <div key={i} className="bg-white rounded-md sm:rounded-lg p-1.5 sm:p-2 border border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[6px] sm:text-[8px] text-gray-500">{estimate.id}</span>
            <span className={cn(
              'text-[5px] sm:text-[7px] px-1 sm:px-1.5 py-0.5 rounded-full font-medium',
              estimate.status === 'Approved' ? 'bg-green-100 text-green-600' :
              estimate.status === 'Draft' ? 'bg-gray-100 text-gray-600' :
              'bg-yellow-100 text-yellow-600'
            )}>{estimate.status}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[7px] sm:text-[9px] font-medium text-gray-800">{estimate.party}</span>
            <span className="text-[8px] sm:text-[10px] font-semibold text-gray-900">{estimate.amount}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const LiveTrackingScreen = () => (
  <div className="p-2 sm:p-3 h-full bg-gradient-to-b from-slate-50 to-white">
    <div className="text-[8px] sm:text-[10px] font-semibold text-gray-900 mb-2 sm:mb-3">Live Team Tracking</div>
    <div className="bg-blue-50 rounded-lg sm:rounded-xl p-2 sm:p-3 mb-2 sm:mb-3 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMyIgb3BhY2l0eT0iMC4yIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]" />
      </div>
      <div className="relative flex items-center justify-center h-16 sm:h-20">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary flex items-center justify-center animate-pulse">
          <Navigation className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
      </div>
    </div>
    <div className="space-y-1.5 sm:space-y-2">
      {[
        { name: 'Rahul Kumar', location: 'Sharma Electronics', time: 'Live' },
        { name: 'Priya Singh', location: 'Metro Wholesale', time: '3 min' },
        { name: 'Amit Verma', location: 'En Route', time: 'Live' },
      ].map((rep, i) => (
        <div key={i} className="bg-white rounded-md sm:rounded-lg p-1.5 sm:p-2 border border-gray-100 flex items-center gap-1.5 sm:gap-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-[6px] sm:text-[8px] font-bold text-primary">{rep.name.charAt(0)}</span>
          </div>
          <div className="flex-1">
            <div className="text-[7px] sm:text-[9px] font-medium text-gray-800">{rep.name}</div>
            <div className="text-[6px] sm:text-[8px] text-gray-500">{rep.location}</div>
          </div>
          <span className="text-[6px] sm:text-[8px] text-primary">{rep.time}</span>
        </div>
      ))}
    </div>
  </div>
);

const ReportsScreen = () => (
  <div className="p-2 sm:p-3 h-full bg-gradient-to-b from-slate-50 to-white">
    <div className="text-[8px] sm:text-[10px] font-semibold text-gray-900 mb-2 sm:mb-3">Reports & Analytics</div>
    <div className="space-y-1.5 sm:space-y-2">
      {[
        { name: 'Sales Performance', icon: TrendingUp, color: 'text-blue-600 bg-blue-50' },
        { name: 'Team Attendance', icon: Calendar, color: 'text-green-600 bg-green-50' },
        { name: 'Visit Summary', icon: MapPin, color: 'text-orange-600 bg-orange-50' },
        { name: 'Order Analytics', icon: FileText, color: 'text-purple-600 bg-purple-50' },
        { name: 'Client Insights', icon: Users, color: 'text-pink-600 bg-pink-50' },
      ].map((report, i) => {
        const Icon = report.icon;
        return (
          <div key={i} className="bg-white rounded-md sm:rounded-lg p-1.5 sm:p-2 border border-gray-100 flex items-center gap-1.5 sm:gap-2">
            <div className={cn('w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center', report.color.split(' ')[1])}>
              <Icon className={cn('w-3 h-3 sm:w-4 sm:h-4', report.color.split(' ')[0])} />
            </div>
            <span className="text-[7px] sm:text-[9px] font-medium text-gray-800">{report.name}</span>
          </div>
        );
      })}
    </div>
  </div>
);

const PHONE_SCREENS = [
  { id: 'dashboard', component: DashboardScreen },
  { id: 'attendance', component: AttendanceScreen },
  { id: 'beatplan', component: BeatPlanScreen },
  { id: 'orders', component: OrdersScreen },
  { id: 'parties', component: PartiesScreen },
  { id: 'analytics', component: AnalyticsScreen },
  { id: 'estimates', component: EstimatesScreen },
  { id: 'tracking', component: LiveTrackingScreen },
  { id: 'reports', component: ReportsScreen },
];

// Phone Frame component
interface PhoneFrameProps {
  ScreenComponent: React.FC;
  isActive: boolean;
  isVisible: boolean;
}

const PhoneFrame = memo<PhoneFrameProps>(({ ScreenComponent, isActive, isVisible }) => (
  <motion.div
    className="flex-shrink-0 w-[100px] sm:w-[120px] md:w-[140px] lg:w-[160px] xl:w-[180px]"
    animate={{
      scale: isActive ? 1 : 0.85,
      opacity: isVisible ? (isActive ? 1 : 0.6) : 0,
    }}
    transition={{
      duration: 0.3,
      ease: 'easeOut',
    }}
    style={{
      zIndex: isActive ? 10 : 1,
      visibility: isVisible ? 'visible' : 'hidden',
      willChange: 'transform, opacity',
    }}
  >
    <div className="relative bg-gray-900 shadow-xl rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] p-1 sm:p-1.5 lg:p-2">
      {/* Dynamic Island / Notch */}
      <div className="absolute left-1/2 -translate-x-1/2 bg-black rounded-full z-20 top-2 sm:top-2.5 lg:top-3.5 w-10 sm:w-12 lg:w-16 h-3 sm:h-3.5 lg:h-5" />

      {/* Screen */}
      <div className="relative bg-white overflow-hidden aspect-[9/19] rounded-[1.25rem] sm:rounded-[1.75rem] lg:rounded-[2.25rem]">
        {/* Status Bar */}
        <div className="absolute top-0 inset-x-0 bg-white z-10 flex items-center justify-between pt-0.5 sm:pt-1 h-5 sm:h-6 lg:h-8 px-3 sm:px-4 lg:px-6">
          <span className="font-medium text-gray-900 text-[6px] sm:text-[7px] lg:text-[9px]">9:41</span>
          <div className="flex items-center gap-0.5">
            <div className="border border-gray-900 rounded-[2px] w-2.5 sm:w-3 lg:w-4 h-1 sm:h-1.5 lg:h-2">
              <div className="h-full bg-gray-900 rounded-[1px] w-1.5 sm:w-2 lg:w-3" />
            </div>
          </div>
        </div>

        {/* Screen Content */}
        <div className="h-full pt-5 sm:pt-6 lg:pt-8">
          <ScreenComponent />
        </div>
      </div>
    </div>
  </motion.div>
));

PhoneFrame.displayName = 'PhoneFrame';

// For infinite loop - clone screens at start and end
const EXTENDED_SCREENS = [
  ...PHONE_SCREENS.map((s, i) => ({ ...s, id: `clone-start-${i}` })),
  ...PHONE_SCREENS,
  ...PHONE_SCREENS.map((s, i) => ({ ...s, id: `clone-end-${i}` })),
];
const CLONE_COUNT = PHONE_SCREENS.length;

const AppShowcase = memo<AppShowcaseProps>(({ className }) => {
  const navigate = useNavigate();
  // Start from middle of extended array (first real item + middle offset)
  const startIndex = CLONE_COUNT + Math.floor(PHONE_SCREENS.length / 2);
  const [activeIndex, setActiveIndex] = useState(startIndex);
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const phoneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isRepositioningRef = useRef(false);

  // Get real index for progress dots
  const getRealIndex = useCallback((extendedIndex: number) => {
    return ((extendedIndex - CLONE_COUNT) % PHONE_SCREENS.length + PHONE_SCREENS.length) % PHONE_SCREENS.length;
  }, []);

  // Scroll to center the active phone
  const scrollToIndex = useCallback((index: number, smooth = true) => {
    const container = scrollContainerRef.current;
    const phone = phoneRefs.current[index];
    if (!container || !phone) return;

    const containerWidth = container.offsetWidth;
    const phoneLeft = phone.offsetLeft;
    const phoneWidth = phone.offsetWidth;
    const targetScroll = phoneLeft - (containerWidth / 2) + (phoneWidth / 2);

    container.scrollTo({
      left: Math.max(0, targetScroll),
      behavior: smooth ? 'smooth' : 'auto',
    });
  }, []);

  // Handle infinite loop repositioning
  const checkAndReposition = useCallback((currentIndex: number) => {
    const firstRealIndex = CLONE_COUNT;
    const lastRealIndex = CLONE_COUNT + PHONE_SCREENS.length - 1;

    // If in end clones, jump to start
    if (currentIndex > lastRealIndex) {
      isRepositioningRef.current = true;
      const jumpTo = firstRealIndex + (currentIndex - lastRealIndex - 1);
      setTimeout(() => {
        setActiveIndex(jumpTo);
        scrollToIndex(jumpTo, false);
        setTimeout(() => { isRepositioningRef.current = false; }, 50);
      }, 350);
      return true;
    }

    // If in start clones, jump to end
    if (currentIndex < firstRealIndex) {
      isRepositioningRef.current = true;
      const jumpTo = lastRealIndex - (firstRealIndex - currentIndex - 1);
      setTimeout(() => {
        setActiveIndex(jumpTo);
        scrollToIndex(jumpTo, false);
        setTimeout(() => { isRepositioningRef.current = false; }, 50);
      }, 350);
      return true;
    }

    return false;
  }, [scrollToIndex]);

  const handlePrev = useCallback(() => {
    if (isRepositioningRef.current) return;
    const newIndex = activeIndex - 1;
    setActiveIndex(newIndex);
    scrollToIndex(newIndex);
    checkAndReposition(newIndex);
  }, [activeIndex, scrollToIndex, checkAndReposition]);

  const handleNext = useCallback(() => {
    if (isRepositioningRef.current) return;
    const newIndex = activeIndex + 1;
    setActiveIndex(newIndex);
    scrollToIndex(newIndex);
    checkAndReposition(newIndex);
  }, [activeIndex, scrollToIndex, checkAndReposition]);

  // Detect center phone while scrolling
  const handleScroll = useCallback(() => {
    if (isRepositioningRef.current) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    const containerCenter = container.scrollLeft + container.offsetWidth / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;

    phoneRefs.current.forEach((phone, index) => {
      if (!phone) return;
      const phoneCenter = phone.offsetLeft + phone.offsetWidth / 2;
      const distance = Math.abs(containerCenter - phoneCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== activeIndex) {
      setActiveIndex(closestIndex);
    }
  }, [activeIndex]);

  // Auto-rotate
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (isRepositioningRef.current) return;
      setActiveIndex((prev) => {
        const newIndex = prev + 1;
        scrollToIndex(newIndex);
        checkAndReposition(newIndex);
        return newIndex;
      });
    }, AUTO_ROTATE_INTERVAL);

    return () => clearInterval(interval);
  }, [isPaused, scrollToIndex, checkAndReposition]);

  // Initial scroll to center
  useEffect(() => {
    setTimeout(() => scrollToIndex(startIndex, false), 100);
  }, []);

  return (
    <section
      id="mobile-app"
      className={cn('relative py-12 sm:py-16 lg:py-20 bg-white overflow-hidden', className)}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 -left-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="relative"
      >
        {/* Title & Description */}
        <motion.div variants={itemVariants} className="text-center mb-8 sm:mb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Experience the{' '}
            <span className="text-primary">SalesSphere Mobile App</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            A complete field sales solution designed for modern teams. Track attendance,
            plan routes, manage orders, and gain real-time insights — all from your pocket.
          </p>
        </motion.div>

        {/* Phone Carousel */}
        <motion.div
          variants={itemVariants}
          className="relative max-w-7xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative flex items-center justify-center px-2 sm:px-4">
            {/* Left Arrow */}
            <button
              onClick={handlePrev}
              className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all z-30"
              aria-label="Previous screens"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>

            {/* Scrollable Phone Container */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-x-auto scrollbar-hide mx-3 sm:mx-4"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                scrollSnapType: 'x mandatory'
              }}
            >
              <div className="flex items-center gap-3 sm:gap-4 md:gap-5 py-4">
              {/* Left spacer for centering */}
              <div className="flex-shrink-0 w-[40vw] sm:w-[35vw] md:w-[30vw] lg:w-[25vw]" />
              {EXTENDED_SCREENS.map((screen, index) => {
                // Show 5 phones: 2 left, center, 2 right
                const distance = Math.abs(index - activeIndex);
                const isVisible = distance <= 2;

                return (
                  <div
                    key={screen.id}
                    ref={(el) => { phoneRefs.current[index] = el; }}
                    onClick={() => {
                      if (isRepositioningRef.current) return;
                      setActiveIndex(index);
                      scrollToIndex(index);
                      checkAndReposition(index);
                    }}
                    className="cursor-pointer flex-shrink-0"
                  >
                    <PhoneFrame
                      ScreenComponent={screen.component}
                      isActive={index === activeIndex}
                      isVisible={isVisible}
                    />
                  </div>
                );
              })}
              {/* Right spacer for centering */}
              <div className="flex-shrink-0 w-[40vw] sm:w-[35vw] md:w-[30vw] lg:w-[25vw]" />
            </div>
          </div>

            {/* Right Arrow */}
            <button
              onClick={handleNext}
              className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all z-30"
              aria-label="Next screens"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center items-center gap-1.5 sm:gap-2 mt-6 sm:mt-8">
            {PHONE_SCREENS.map((screen, index) => {
              const realActiveIndex = getRealIndex(activeIndex);
              return (
                <button
                  key={screen.id}
                  type="button"
                  aria-label={`Go to screen ${index + 1}`}
                  onClick={() => {
                    const targetIndex = CLONE_COUNT + index;
                    setActiveIndex(targetIndex);
                    scrollToIndex(targetIndex);
                  }}
                  className="p-1 group"
                >
                  <span
                    className={cn(
                      'block h-1.5 sm:h-2 rounded-full transition-all duration-300',
                      realActiveIndex === index
                        ? 'w-6 sm:w-8 bg-primary'
                        : 'w-1.5 sm:w-2 bg-gray-300 group-hover:bg-gray-400'
                    )}
                  />
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex justify-center gap-3 sm:gap-4 mt-8 sm:mt-10 px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/schedule-demo')}
            className="px-5 sm:px-6 py-2.5 sm:py-3 bg-secondary text-white font-semibold rounded-lg hover:bg-secondary/90 transition-colors text-sm sm:text-base"
          >
            Request a Demo
          </button>
          <button
            className="px-5 sm:px-6 py-2.5 sm:py-3 bg-white text-primary font-semibold rounded-lg border-2 border-primary hover:bg-primary/5 transition-colors text-sm sm:text-base"
          >
            Get the App
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
});

AppShowcase.displayName = 'AppShowcase';

export default AppShowcase;
