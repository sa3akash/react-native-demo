import { QueryClient } from '@tanstack/react-query';
import { normalizeApiError } from '../services/api/apiError';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 15, // 15 minutes
      retry: (failureCount, error) => {
        const normalized = normalizeApiError(error);
        if (
          normalized.statusCode === 401 ||
          normalized.statusCode === 403 ||
          normalized.statusCode === 404
        ) {
          return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: false,
    },
  },
});
