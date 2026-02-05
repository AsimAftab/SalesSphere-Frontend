import { createContext, useContext, useEffect, useState, useRef, useCallback, type ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/api/authService';

// --- Types ---

interface ISocketContext {
  socket: Socket | null;
  isConnected: boolean;
}

interface SocketProviderProps {
  children: ReactNode;
}

// --- Context ---

const SocketContext = createContext<ISocketContext>({
  socket: null,
  isConnected: false,
});

// --- Custom Hook for Socket Access ---

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = (): ISocketContext => {
  return useContext(SocketContext);
};

// --- Socket Configuration ---

const SOCKET_CONFIG = {
  withCredentials: true,
  transports: ['websocket'] as ('websocket' | 'polling')[],
  path: '/api/tracking',
};

// --- Socket Provider Component ---

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  // Use ref to track socket instance for cleanup without causing re-renders
  const socketRef = useRef<Socket | null>(null);

  // Handler for connection events - memoized to prevent unnecessary re-renders
  const handleConnect = useCallback(() => {
    setIsConnected(true);
  }, []);

  const handleDisconnect = useCallback(() => {
    setIsConnected(false);
  }, []);

  const handleError = useCallback((error: Error) => {
    console.error('[Socket] Connection error:', error);
  }, []);

  // Cleanup function - disconnects socket safely
  const cleanupSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.off('connect', handleConnect);
      socketRef.current.off('disconnect', handleDisconnect);
      socketRef.current.off('error', handleError);
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setSocket(null);
    setIsConnected(false);
  }, [handleConnect, handleDisconnect, handleError]);

  // Effect for socket lifecycle management
  useEffect(() => {
    // Only create socket if user is authenticated
    if (!user) {
      cleanupSocket();
      return;
    }

    // Avoid creating duplicate connections
    if (socketRef.current?.connected) {
      return;
    }

    // Create new socket connection
    const newSocket = io(import.meta.env.VITE_API_BASE_URL, SOCKET_CONFIG);
    socketRef.current = newSocket;

    // Attach event listeners
    newSocket.on('connect', handleConnect);
    newSocket.on('disconnect', handleDisconnect);
    newSocket.on('error', handleError);

    setSocket(newSocket);

    // Cleanup on unmount or user change
    return () => {
      cleanupSocket();
    };
  }, [user, handleConnect, handleDisconnect, handleError, cleanupSocket]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
