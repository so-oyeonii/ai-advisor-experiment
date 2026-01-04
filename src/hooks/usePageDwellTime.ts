import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to track page dwell time
 * Returns time spent on page in seconds
 */
export function usePageDwellTime() {
  const [dwellTime, setDwellTime] = useState<number>(0);
  const startTimeRef = useRef<number | null>(null);
  const isActiveRef = useRef<boolean>(false);

  const startTimer = () => {
    if (!isActiveRef.current) {
      startTimeRef.current = Date.now();
      isActiveRef.current = true;
    }
  };

  const stopTimer = (): number => {
    if (isActiveRef.current && startTimeRef.current !== null) {
      const endTime = Date.now();
      const elapsedSeconds = (endTime - startTimeRef.current) / 1000;
      setDwellTime(elapsedSeconds);
      isActiveRef.current = false;
      return elapsedSeconds;
    }
    return dwellTime;
  };

  const getCurrentDwellTime = (): number => {
    if (isActiveRef.current && startTimeRef.current !== null) {
      return (Date.now() - startTimeRef.current) / 1000;
    }
    return dwellTime;
  };

  // Automatically start timer on mount
  useEffect(() => {
    startTimer();

    // Clean up on unmount
    return () => {
      if (isActiveRef.current) {
        stopTimer();
      }
    };
  }, []);

  // Handle page visibility changes (user switches tabs)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, pause timer
        if (isActiveRef.current && startTimeRef.current !== null) {
          const elapsed = (Date.now() - startTimeRef.current) / 1000;
          setDwellTime(prev => prev + elapsed);
        }
      } else {
        // Page is visible again, restart timer
        if (isActiveRef.current) {
          startTimeRef.current = Date.now();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return {
    startTimer,
    stopTimer,
    getCurrentDwellTime,
    dwellTime
  };
}
