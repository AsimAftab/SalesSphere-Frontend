import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMyOrganization, fetchMyOrgPayments } from '@/api/SuperAdmin/organizationService';
import type { OrgPaymentRecord } from '@/api/SuperAdmin/organizationService';

export interface PaymentSummary {
  totalAmount: number;
  paymentCount: number;
  lastPaymentDate: string | null;
}

export const usePlanBillingTab = () => {
  const {
    data: orgResponse,
    isLoading: isLoadingOrg,
    error: orgError,
  } = useQuery({
    queryKey: ['my-organization'],
    queryFn: fetchMyOrganization,
  });

  const {
    data: payments = [],
    isLoading: isLoadingPayments,
    error: paymentsError,
  } = useQuery<OrgPaymentRecord[]>({
    queryKey: ['my-org-payments'],
    queryFn: fetchMyOrgPayments,
  });

  const orgData = orgResponse?.data;

  const summary = useMemo<PaymentSummary>(() => {
    if (!payments.length) {
      return { totalAmount: 0, paymentCount: 0, lastPaymentDate: null };
    }

    const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const sorted = [...payments].sort(
      (a, b) => new Date(b.dateReceived).getTime() - new Date(a.dateReceived).getTime()
    );
    const lastPaymentDate = sorted[0]?.dateReceived || null;

    return { totalAmount, paymentCount: payments.length, lastPaymentDate };
  }, [payments]);

  return {
    orgData,
    payments,
    summary,
    isLoadingOrg,
    isLoadingPayments,
    orgError,
    paymentsError,
  };
};
