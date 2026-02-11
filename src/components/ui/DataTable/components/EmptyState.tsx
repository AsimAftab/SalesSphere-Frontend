interface TableEmptyStateProps {
  message: string;
}

export const TableEmptyState: React.FC<TableEmptyStateProps> = ({ message }) => (
  <div className="text-center py-12 text-gray-500">
    {message}
  </div>
);

export default TableEmptyState;
