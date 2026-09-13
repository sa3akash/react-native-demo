import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook to debounce a fast-changing value (e.g. search input).
 * @param value The value to debounce.
 * @param delay Delay in milliseconds (default: 350ms).
 * @returns The debounced value.
 */
export function useDebounce<T>(value: T, delay: number = 350): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook to return a debounced callback function.
 * @param callback The function to debounce.
 * @param delay Delay in milliseconds.
 * @returns Debounced function.
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 350
): (...args: Parameters<T>) => void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const timeoutRef = useRef<any>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  );
}

/**
 * Hook to throttle function executions.
 * @param callback Function to throttle.
 * @param limit Time limit in milliseconds.
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  limit: number = 500
): (...args: Parameters<T>) => void {
  const lastRun = useRef(0);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastRun.current >= limit) {
        lastRun.current = now;
        callbackRef.current(...args);
      }
    },
    [limit]
  );
}
