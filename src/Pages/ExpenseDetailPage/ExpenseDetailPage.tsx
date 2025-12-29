import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import ExpenseDetailContent from './ExpenseDetailContent';
import { getExpenseById } from '../../api/expensesService';

const ExpenseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Fetching data using TanStack Query
  const { data: expense, isLoading, error } = useQuery({
    queryKey: ['expense', id],
    queryFn: () => getExpenseById(id!),
    enabled: !!id,
  });

  return (
    <Sidebar>
        <ExpenseDetailContent 
          expense={expense || null} 
          loading={isLoading} 
          error={error ? (error as Error).message : null} 
          onStatusChange={() => {
          }}
        />
    </Sidebar>
  );
};

export default ExpenseDetailPage;