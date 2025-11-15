// src/context/SocketContext.tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

// (Interfaces are unchanged)
interface ISocketContext {
  socket: Socket | null;
  isConnected: boolean;
}
const SocketContext = createContext<ISocketContext>({
  socket: null,
  isConnected: false,
});
export const useSocket = () => {
  return useContext(SocketContext);
};
interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    
    // --- THIS BLOCK IS UPDATED ---
    const newSocket = io({
      // 1. This sends the httpOnly auth cookies
      withCredentials: true,
      transports: ['websocket'],

      // 2. This matches the 'path' in your server.js
      path: '/api/tracking', 
    });
    // --- END OF UPDATE ---

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('✅ Socket.IO connected:', newSocket.id);
      setIsConnected(true);
    });
    newSocket.on('disconnect', () => {
      console.log('❌ Socket.IO disconnected');
      setIsConnected(false);
    });
    newSocket.on('error', (error: Error) => {
      console.error('Socket.IO Error:', error.message);
    });

    return () => {
      console.log('🧹 Cleaning up socket connection...');
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};