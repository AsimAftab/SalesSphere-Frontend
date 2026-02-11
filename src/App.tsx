import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRoutes from '@/AppRoutes';
import ToastProvider from '@/components/ui/ToastProvider/ToastProvider';

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
      <div className="bg-white text-gray-800">
        <ToastProvider />
        <AppRoutes />
      </div>
    </QueryClientProvider>
  );
}

export default App;
