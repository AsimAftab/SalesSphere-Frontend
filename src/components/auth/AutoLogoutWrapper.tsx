import React, { useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { logout } from '../../api/authService'; // Adjust path if needed

// 40 minutes in milliseconds
const SESSION_DURATION = 40 * 60 * 1000;
const LOGIN_TIME_KEY = 'loginTime';

const AutoLogoutWrapper: React.FC = () => {
const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Get the login time from storage
    const loginTimeString = localStorage.getItem(LOGIN_TIME_KEY);

    if (!loginTimeString) {
      // If there's no login time, something is wrong. Log out.
      console.error("No login time found. Forcing logout.");
      logout();
      return;
    }

    const loginTime = parseInt(loginTimeString, 10);
    const expiryTime = loginTime + SESSION_DURATION;
    
    // Calculate how much time is left
    const timeRemaining = expiryTime - Date.now();

    if (timeRemaining <= 0) {
      // If time is already up (e.g., user closed laptop and reopened), log out immediately
      console.log("Session already expired. Logging out.");
      logout();
    } else {
      // Otherwise, set a timer for the exact remaining duration
      timerRef.current = setTimeout(() => {
        console.log("Session reached 40 minutes. Logging out.");
        logout();
      }, timeRemaining);
    }

    // Cleanup function to clear the timer if the component unmounts
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };

  }, []); // The empty array [] ensures this effect runs ONLY ONCE when the user logs in.

  // Render the child routes
  return <Outlet />;
};

export default AutoLogoutWrapper;