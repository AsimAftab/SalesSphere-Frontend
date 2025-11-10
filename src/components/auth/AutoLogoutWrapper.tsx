import React, { useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { logout } from '../../api/authService'; 


const SESSION_DURATION = 40 * 60 * 1000;
const LOGIN_TIME_KEY = 'loginTime';

const AutoLogoutWrapper: React.FC = () => {
const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const loginTimeString = localStorage.getItem(LOGIN_TIME_KEY);

    if (!loginTimeString) {
      console.error("No login time found. Forcing logout.");
      logout();
      return;
    }

    const loginTime = parseInt(loginTimeString, 10);
    const expiryTime = loginTime + SESSION_DURATION;
    
    const timeRemaining = expiryTime - Date.now();

    if (timeRemaining <= 0) {
     
      console.log("Session already expired. Logging out.");
      logout();
    } else {
    
      timerRef.current = setTimeout(() => {
        console.log("Session reached 40 minutes. Logging out.");
        logout();
      }, timeRemaining);
    }

    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };

  }, []); 
  return <Outlet />;
};

export default AutoLogoutWrapper;