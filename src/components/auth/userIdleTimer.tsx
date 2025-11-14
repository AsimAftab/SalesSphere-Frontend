import { useEffect, useRef } from 'react';
import { logout } from '../../api/authService'; // Make sure this path is correct

const IDLE_TIMEOUT_MS = 15 * 60 * 1000; 

// 1. Accept an 'isEnabled' prop
export const useIdleTimer = (isEnabled: boolean) => { 
  const timerRef = useRef<number | null>(null);

  const onIdle = () => {
    console.warn("User is idle for 15 minutes. Logging out...");
    logout(); 
  };

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(onIdle, IDLE_TIMEOUT_MS);
  };

  useEffect(() => {
    // 2. If the hook is not enabled, do nothing and clear any timer
    if (!isEnabled) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      return; // Exit the effect early
    }

    // 3. If enabled, set up the listeners
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    resetTimer(); // Start the timer

    // 4. Cleanup function
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [isEnabled]); // 5. Add isEnabled as a dependency
                  // This will automatically start/stop the timer

  return null;
};