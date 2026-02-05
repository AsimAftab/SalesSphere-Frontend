import React from 'react';
import { type Expense } from "@/api/expensesService";
import { MobileCard, MobileCardList } from '@/components/ui';

interface MobileListProps {
  data: Expense[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onBadgeClick: (expense: Expense) => void;
  permissions: {
    canDelete: boolean;
    canViewDetail: boolean;
  };
}

const formatCurrency = (amount: number) => {
  return `₹ ${amount.toLocaleString('en-IN')}`;
};

export const ExpenseMobileList: React.FC<MobileListProps> = ({
  data,
  selectedIds,
  onToggle,
  onBadgeClick,
  permissions
}) => {
  return (
    <MobileCardList isEmpty={data.length === 0} emptyMessage="No expenses found">
      {data.map((exp, index) => {
        const isSelected = selectedIds.includes(exp.id);

        return (
          <MobileCard
            key={exp.id}
            id={exp.id}
            header={{
              selectable: permissions.canDelete,
              isSelected: isSelected,
              onToggleSelection: () => onToggle(exp.id),
              serialNumber: index + 1,
              title: exp.title,
              badge: {
                type: 'status',
                status: exp.status,
                onClick: () => onBadgeClick(exp),
              },
            }}
            details={[
              {
                label: 'Amount',
                value: formatCurrency(exp.amount),
                valueClassName: 'font-bold text-secondary',
              },
              {
                label: 'Category',
                value: exp.category,
              },
              {
                label: 'Date',
                value: exp.incurredDate,
              },
              {
                label: 'Submitted By',
                value: exp.createdBy?.name || 'Unknown',
              },
              {
                label: 'Reviewer',
                value: exp.approvedBy?.name || 'Pending',
                fullWidth: true,
              },
            ]}
            detailsLayout="grid"
            actions={[
              {
                label: 'View Details',
                href: `/expenses/${exp.id}`,
                variant: 'primary',
                visible: permissions.canViewDetail,
              },
            ]}
            actionsFullWidth={true}
          />
        );
      })}
    </MobileCardList>
  );
};
