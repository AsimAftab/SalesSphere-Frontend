import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRoutes from '@/AppRoutes';
import { SocketProvider } from '@/providers/SocketProvider';
import { ToastProvider } from '@/components/ui';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      
        <SocketProvider> 
          <div className="bg-white text-gray-800">
            <ToastProvider />
            <AppRoutes />
          </div>
        </SocketProvider> 
    </QueryClientProvider>
  );
}

export default App;