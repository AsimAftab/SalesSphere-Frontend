
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // 👈 NEW IMPORT
import AppRoutes from './AppRoutes';
import ToastProvider from './components/UI/ToastProvider/ToastProvider';

// 1. Create a client instance outside of the component
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Set a sensible default for stale time (e.g., 5 minutes)
      staleTime: 1000 * 60 * 5, 
      // Do not refetch immediately when window is refocused unless data is stale
      refetchOnWindowFocus: false, 
    },
  },
});

function App() {
  return (
    // 2. Wrap the entire application in QueryClientProvider
    <QueryClientProvider client={queryClient}>
      <div className="bg-white text-gray-800">
        <ToastProvider />
        <AppRoutes /> {/* Your routes, which include protected routes */}
      </div>
    </QueryClientProvider>
  );
}

export default App;