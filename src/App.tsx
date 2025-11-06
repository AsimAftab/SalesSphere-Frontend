import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRoutes from './AppRoutes';
import ToastProvider from './components/UI/ToastProvider/ToastProvider';
import api from './api/api';



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

  useEffect(() => {
    const token = localStorage.getItem('authToken');

   
    if (token) {
      api
        .get('/users/me')
        .then(() => {
          console.log('✅ User session verified.');
        })
        .catch((error) => {
          console.warn('⚠️ Token invalid or backend offline:', error.message);

         
        });
    } 
  }, []); 
 

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
