import { useState, useEffect, useCallback } from 'react';
import { Linking } from 'react-native';
import { useToast } from '../components/molecules/Toast';

export interface ParsedDeepLink {
  rawUrl: string;
  scheme?: string;
  host?: string;
  path?: string;
  queryParams: Record<string, string>;
}

export function useDeepLinking(onLinkReceived?: (parsed: ParsedDeepLink) => void) {
  const [initialUrl, setInitialUrl] = useState<string | null>(null);
  const [latestUrl, setLatestUrl] = useState<string | null>(null);
  const { showToast } = useToast();

  const parseUrl = useCallback((url: string): ParsedDeepLink => {
    try {
      const parsed = new URL(url);
      const queryParams: Record<string, string> = {};
      parsed.searchParams.forEach((val, key) => {
        queryParams[key] = val;
      });

      return {
        rawUrl: url,
        scheme: parsed.protocol.replace(':', ''),
        host: parsed.host,
        path: parsed.pathname,
        queryParams,
      };
    } catch {
      return {
        rawUrl: url,
        queryParams: {},
      };
    }
  }, []);

  useEffect(() => {
    // Initial launch URL check
    Linking.getInitialURL().then((url) => {
      if (url) {
        setInitialUrl(url);
        const parsed = parseUrl(url);
        onLinkReceived?.(parsed);
      }
    });

    // Event listener for incoming universal links while app is open
    const sub = Linking.addEventListener('url', ({ url }) => {
      setLatestUrl(url);
      const parsed = parseUrl(url);
      onLinkReceived?.(parsed);
    });

    return () => {
      sub.remove();
    };
  }, [parseUrl, onLinkReceived]);

  const openUrl = useCallback(
    async (url: string) => {
      try {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
          return true;
        } else {
          showToast({ message: `Cannot open link: ${url}`, type: 'warning' });
          return false;
        }
      } catch (err: any) {
        showToast({ message: err?.message || 'Failed to open URL', type: 'danger' });
        return false;
      }
    },
    [showToast]
  );

  return {
    initialUrl,
    latestUrl,
    parseUrl,
    openUrl,
  };
}
