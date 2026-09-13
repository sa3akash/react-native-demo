import { useInfiniteQuery, QueryKey } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { apiClient, ApiResponse } from '../../core/network/apiClient';

export interface PaginatedOptions<TItem> {
  queryKey: QueryKey;
  endpoint: string;
  pageSize?: number;
  initialData?: TItem[];
  enabled?: boolean;
}

export function usePaginatedQuery<TItem>({
  queryKey,
  endpoint,
  pageSize = 10,
  enabled = true,
}: PaginatedOptions<TItem>) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const query = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const res = await apiClient.get<TItem[]>(`${endpoint}?page=${pageParam}&limit=${pageSize}`);
        return {
          items: res.data || [],
          nextPage: (res.data?.length || 0) >= pageSize ? (pageParam as number) + 1 : undefined,
        };
      } catch {
        return {
          items: [],
          nextPage: undefined,
        };
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled,
  });

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await query.refetch();
    setIsRefreshing(false);
  }, [query]);

  const flatItems: TItem[] = query.data?.pages.flatMap((page) => page.items) || [];

  return {
    items: flatItems,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    refetch: query.refetch,
    isRefreshing,
    onRefresh,
  };
}
