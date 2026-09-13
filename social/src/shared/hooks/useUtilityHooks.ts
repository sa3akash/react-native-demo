import { useEffect, useRef, useState, useCallback } from 'react';
import { BackHandler, Dimensions, ScaledSize } from 'react-native';
import { useToast } from '../components/molecules/Toast';

/**
 * Hook to handle Android hardware back button events.
 * @param handler Function returning true if handled, false to invoke default back action.
 */
export function useBackHandler(handler: () => boolean) {
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', handler);
    return () => {
      sub.remove();
    };
  }, [handler]);
}

/**
 * Hook for copying text to clipboard and providing feedback.
 */
export function useClipboard() {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const { showToast } = useToast();

  const copy = useCallback((text: string, feedbackMessage = 'Copied to clipboard!') => {
    setCopiedText(text);
    showToast({ message: feedbackMessage, type: 'success' });
  }, [showToast]);

  return {
    copiedText,
    copy,
  };
}

/**
 * Hook to detect screen orientation (Portrait vs Landscape).
 */
export function useOrientation() {
  const [dimensions, setDimensions] = useState(() => Dimensions.get('window'));

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ window }: { window: ScaledSize }) => {
      setDimensions(window);
    });
    return () => sub.remove();
  }, []);

  const isPortrait = dimensions.height >= dimensions.width;

  return {
    isPortrait,
    isLandscape: !isPortrait,
    width: dimensions.width,
    height: dimensions.height,
  };
}

/**
 * Hook to store and track the previous value of a state or prop.
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

/**
 * Hook to prevent memory leaks by checking if a component is still mounted.
 */
export function useIsMounted(): () => boolean {
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return useCallback(() => isMountedRef.current, []);
}
