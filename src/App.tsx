import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './AppRoutes';

// Create a single QueryClient instance
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
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            style: {
              padding: '16px',
              fontWeight: 500,
              fontSize: '15px',
              borderRadius: '8px',
            },
          }}
        />
        <AppRoutes />
      </div>
    </QueryClientProvider>
  );
}

export default App;
