import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook to manage countdown timers (for OTP expiration, story progress, verify cooldowns).
 */
export function useCountdown(initialSeconds: number, onFinish?: () => void) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<any>(null);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback((newSeconds?: number) => {
    setIsRunning(false);
    setSecondsLeft(newSeconds !== undefined ? newSeconds : initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            onFinish?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, secondsLeft, onFinish]);

  const formattedTime = `${Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, '0')}:${(secondsLeft % 60).toString().padStart(2, '0')}`;

  return {
    secondsLeft,
    formattedTime,
    isRunning,
    start,
    pause,
    reset,
  };
}
