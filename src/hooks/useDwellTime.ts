// Custom hook to track dwell time on a page
import { useEffect, useRef, useState } from 'react';

export function useDwellTime() {
  const [dwellTime, setDwellTime] = useState(0);
  const startTimeRef = useRef<number>(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Reset start time when component mounts
    startTimeRef.current = Date.now();

    // Update dwell time every second
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      setDwellTime(Math.floor(elapsed / 1000)); // Convert to seconds
    }, 1000);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Function to get final dwell time
  const getFinalDwellTime = () => {
    return Math.floor((Date.now() - startTimeRef.current) / 1000);
  };

  return { dwellTime, getFinalDwellTime };
}
