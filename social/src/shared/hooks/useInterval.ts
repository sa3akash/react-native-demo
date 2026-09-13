import { useEffect, useRef, useCallback } from 'react';

/**
 * Declarative hook for setInterval that automatically cleans up on unmount or delay changes.
 * @param callback Function to invoke periodically.
 * @param delay Interval in ms. Pass null/undefined to pause.
 */
export function useInterval(callback: () => void, delay: number | null | undefined) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null || delay === undefined) {
      return;
    }

    const tick = () => {
      savedCallback.current();
    };

    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}

/**
 * Declarative hook for setTimeout that automatically cleans up on unmount.
 * @param callback Function to invoke.
 * @param delay Delay in ms.
 */
export function useTimeout(callback: () => void, delay: number | null | undefined) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null || delay === undefined) {
      return;
    }

    const id = setTimeout(() => {
      savedCallback.current();
    }, delay);

    return () => clearTimeout(id);
  }, [delay]);
}
