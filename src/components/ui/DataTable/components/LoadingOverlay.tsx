import { Loader2 } from 'lucide-react';

export const LoadingOverlay: React.FC = () => (
  <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10 rounded-lg">
    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
  </div>
);

export default LoadingOverlay;
