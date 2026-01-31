import { useEffect, useRef } from 'react';
import { logout } from '../../api/authService';

const IDLE_TIMEOUT_MS = 15 * 60 * 1000; // 15 Minutes
const ACTIVITY_CHANNEL = 'user_activity_channel';

/**
 * Enterprise Idle Timer Hook
 * Features: Multi-tab synchronization and activity broadcasting.
 */
export const useIdleTimer = (isEnabled: boolean) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);

  const onIdle = () => {
    console.warn("User session timed out due to inactivity.");
    logout();
  };

  const resetTimer = (isExternal: boolean = false) => {
    // 1. Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // 2. Set new timeout
    timerRef.current = setTimeout(onIdle, IDLE_TIMEOUT_MS);

    // 3. Broadcast activity to other tabs (if the event originated in this tab)
    if (!isExternal && channelRef.current) {
      channelRef.current.postMessage('active');
    }
  };

  useEffect(() => {
    if (!isEnabled) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    // Initialize BroadcastChannel for cross-tab sync
    channelRef.current = new BroadcastChannel(ACTIVITY_CHANNEL);
    channelRef.current.onmessage = () => resetTimer(true);

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

    const handleUserActivity = () => resetTimer(false);

    // Add listeners with passive: true for performance
    events.forEach((event) => {
      window.addEventListener(event, handleUserActivity, { passive: true });
    });

    // Initial start
    resetTimer(false);

    // Cleanup
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (channelRef.current) {
        channelRef.current.close();
      }
      events.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnabled]);

  return null;
};