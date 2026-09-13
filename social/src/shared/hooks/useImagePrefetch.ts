import { useState, useEffect, useCallback } from 'react';
import { Image } from 'react-native';

export interface PrefetchStatus {
  total: number;
  completed: number;
  failed: number;
  isFinished: boolean;
}

export function useImagePrefetch(urls: string[] = []) {
  const [status, setStatus] = useState<PrefetchStatus>({
    total: urls.length,
    completed: 0,
    failed: 0,
    isFinished: false,
  });

  const prefetchImages = useCallback(async (imageUrls: string[]): Promise<boolean[]> => {
    setStatus({
      total: imageUrls.length,
      completed: 0,
      failed: 0,
      isFinished: false,
    });

    const results = await Promise.all(
      imageUrls.map(async (url) => {
        try {
          const success = await Image.prefetch(url);
          setStatus((prev) => ({
            ...prev,
            completed: prev.completed + (success ? 1 : 0),
            failed: prev.failed + (success ? 0 : 1),
          }));
          return success;
        } catch {
          setStatus((prev) => ({ ...prev, failed: prev.failed + 1 }));
          return false;
        }
      })
    );

    setStatus((prev) => ({ ...prev, isFinished: true }));
    return results;
  }, []);

  useEffect(() => {
    if (urls.length > 0) {
      prefetchImages(urls);
    }
  }, [urls, prefetchImages]);

  return {
    status,
    prefetchImages,
  };
}
