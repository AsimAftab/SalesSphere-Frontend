import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/api/authService';

interface ISocketContext {
  socket: Socket | null;
  isConnected: boolean;
}
const SocketContext = createContext<ISocketContext>({
  socket: null,
  isConnected: false,
});
// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => {
  return useContext(SocketContext);
};
interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth(); 

  useEffect(() => {
    if (user) {
      
      const newSocket = io(import.meta.env.VITE_API_BASE_URL, { 
        withCredentials: true,
        transports: ['websocket'],
        path: '/api/tracking', 
      });

      setSocket(newSocket);

      newSocket.on('connect', () => {
        setIsConnected(true);
      });
      newSocket.on('disconnect', () => {
        setIsConnected(false);
      });
      newSocket.on('error', () => {
     
      });

      return () => {
        newSocket.disconnect();
      };
    } else {
      if (socket) {
        socket.disconnect();
      }
      setSocket(null);
      setIsConnected(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};