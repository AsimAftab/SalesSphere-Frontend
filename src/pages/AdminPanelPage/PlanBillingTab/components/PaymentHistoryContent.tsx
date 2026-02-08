import React from 'react';
import { IndianRupee, Hash, Calendar } from 'lucide-react';
import { StatCard, DataTable, dateColumn, currencyColumn, textColumn, EmptyState } from '@/components/ui';
import type { TableColumn } from '@/components/ui';
import type { OrgPaymentRecord } from '@/api/SuperAdmin/organizationService';
import type { PaymentSummary } from '../hooks/usePlanBillingTab';

interface PaymentHistoryContentProps {
  payments: OrgPaymentRecord[];
  summary: PaymentSummary;
  isLoading: boolean;
}

const columns: TableColumn<OrgPaymentRecord>[] = [
  dateColumn<OrgPaymentRecord>('dateReceived', 'Date Received', 'dateReceived'),
  currencyColumn<OrgPaymentRecord>('amount', 'Amount', 'amount'),
  textColumn<OrgPaymentRecord>('paymentMode', 'Payment Mode', 'paymentMode'),
];

const PaymentHistoryContent: React.FC<PaymentHistoryContentProps> = ({ payments, summary, isLoading }) => {
  const lastPaymentFormatted = summary.lastPaymentDate
    ? new Date(summary.lastPaymentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : 'N/A';

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title={'Total\nAmount'}
          value={`₹ ${summary.totalAmount.toLocaleString('en-IN')}`}
          icon={<IndianRupee className="h-6 w-6 text-green-600" />}
          iconBgColor="bg-green-100"
        />
        <StatCard
          title={'Payment\nCount'}
          value={summary.paymentCount}
          icon={<Hash className="h-6 w-6 text-blue-600" />}
          iconBgColor="bg-blue-100"
        />
        <StatCard
          title={'Last\nPayment'}
          value={lastPaymentFormatted}
          icon={<Calendar className="h-6 w-6 text-purple-600" />}
          iconBgColor="bg-purple-100"
        />
      </div>

      {/* Payments Table */}
      {payments.length === 0 && !isLoading ? (
        <EmptyState
          title="No Payments Found"
          description="No payment records are available for your organization yet."
        />
      ) : (
        <DataTable<OrgPaymentRecord>
          data={payments}
          columns={columns}
          keyExtractor={(p) => p._id}
          showSerialNumber
          loading={isLoading}
          emptyMessage="No payment records found"
          hideOnMobile={false}
        />
      )}
    </div>
  );
};

export default PaymentHistoryContent;
