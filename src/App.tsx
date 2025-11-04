import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRoutes from './AppRoutes';
import ToastProvider from './components/UI/ToastProvider/ToastProvider';
import api from './api/api';
import { clearAuthStorage } from '././components/auth/authutils';

// 1. Create a single QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    // ✅ Only check backend if token exists
    if (token) {
      api
        .get('/users/me')
        .then(() => {
          console.log('✅ User session verified.');
        })
        .catch((error) => {
          console.warn('⚠️ Token invalid or backend offline:', error.message);

          // ✅ Centralized cleanup for consistency
          clearAuthStorage();

          // Redirect to login if not already there
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        })
        .finally(() => setIsCheckingAuth(false));
    } else {
      setIsCheckingAuth(false);
    }
  }, []);

  if (isCheckingAuth) {
    // ✅ Minimal, accessible loader
    return (
      <div className="flex h-screen items-center justify-center text-gray-600">
        Checking session...
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-white text-gray-800">
        <ToastProvider />
        <AppRoutes />
      </div>
    </QueryClientProvider>
  );
}

export default App;
