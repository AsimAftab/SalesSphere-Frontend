import React from 'react';
import { Crown, Users, CalendarClock, Building2, User, Phone, Mail, MapPin, Globe, Clock, CalendarOff, FileText, MapPinned } from 'lucide-react';
import { StatCard, InfoBlock } from '@/components/ui';

 
interface YourPlanContentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  orgData: Record<string, any>;
}

const YourPlanContent: React.FC<YourPlanContentProps> = ({ orgData }) => {
  const planName = orgData.subscriptionPlanId?.name || orgData.subscriptionType || 'N/A';
  const userCount = orgData.userCount ?? 0;
  const maxEmployees = orgData.maxEmployees?.effective ?? orgData.maxEmployeesOverride ?? '?';
  const rawCycle = orgData.billingCycle || orgData.subscriptionType || orgData.subscriptionDuration;
  const subscriptionDuration = rawCycle === '12months' ? 'Yearly' : rawCycle === '6months' ? 'Half Yearly' : rawCycle || 'N/A';
  const formatDate = (date: string | undefined) =>
    date ? new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';

  const startDate = formatDate(orgData.subscriptionStartDate);
  const expiryDate = formatDate(orgData.subscriptionEndDate);

  const orgInfoItems = [
    { icon: Building2, label: 'Organization', value: orgData.name, className: 'sm:col-span-2' },
    { icon: User, label: 'Owner', value: orgData.owner?.name || orgData.ownerName },
    { icon: Phone, label: 'Phone', value: orgData.phone },
    { icon: Mail, label: 'Email', value: orgData.owner?.email || orgData.email },
    { icon: FileText, label: 'PAN / VAT', value: orgData.panVatNumber },
    { icon: MapPin, label: 'Address', value: orgData.address, className: 'sm:col-span-2' },
  ];

  const accountItems = [
    { icon: CalendarClock, label: 'Billing Cycle', value: subscriptionDuration },
    { icon: Globe, label: 'Country', value: orgData.country },
    { icon: Globe, label: 'Timezone', value: orgData.timezone },
    { icon: CalendarOff, label: 'Weekly Off', value: orgData.weeklyOffDay },
    { icon: Clock, label: 'Check-in Time', value: orgData.checkInTime },
    { icon: Clock, label: 'Check-out Time', value: orgData.checkOutTime },
    { icon: Clock, label: 'Half Day Out', value: orgData.halfDayCheckOutTime },
    { icon: MapPinned, label: 'Geo Fencing', value: orgData.enableGeoFencingAttendance ? 'Enabled' : 'Disabled' },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Plan"
          value={planName}
          icon={<Crown className="h-6 w-6 text-amber-600" />}
          iconBgColor="bg-amber-100"
        />
        <StatCard
          title="Users"
          value={`${userCount} / ${maxEmployees}`}
          icon={<Users className="h-6 w-6 text-blue-600" />}
          iconBgColor="bg-blue-100"
        />
        <StatCard
          title={'Started\nOn'}
          value={startDate}
          icon={<CalendarClock className="h-6 w-6 text-green-600" />}
          iconBgColor="bg-green-100"
        />
        <StatCard
          title={'Valid\nUntil'}
          value={expiryDate}
          icon={<CalendarClock className="h-6 w-6 text-purple-600" />}
          iconBgColor="bg-purple-100"
        />
      </div>

      {/* Detail Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Organization Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-blue-600" />
            </div>
            Organization Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            {orgInfoItems.map((item, idx) => (
              <InfoBlock key={idx} icon={item.icon} label={item.label} value={item.value} className={item.className} />
            ))}
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
              <Crown className="w-4 h-4 text-amber-600" />
            </div>
            Account Settings
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            {accountItems.map((item, idx) => (
              <InfoBlock key={idx} icon={item.icon} label={item.label} value={item.value} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourPlanContent;
