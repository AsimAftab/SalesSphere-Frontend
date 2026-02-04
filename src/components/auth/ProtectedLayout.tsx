import { Outlet } from 'react-router-dom';
import { useAuth } from '@/api/authService';
import { useIdleTimer } from './UserIdleTimer';

const ProtectedLayout: React.FC = () => {
    const { isAuthenticated } = useAuth();
    useIdleTimer(isAuthenticated);
    return (
      <Outlet />
    );
};

export default ProtectedLayout;
