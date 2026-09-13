import { useState, useCallback } from 'react';
import { useToast } from '../components/molecules/Toast';

export interface OptimisticMutationOptions<TData, TVariables> {
  onMutate: (variables: TVariables) => TData;
  mutationFn: (variables: TVariables) => Promise<any>;
  onSuccess?: (result: any, variables: TVariables) => void;
  onError?: (error: any, rollbackData: TData, variables: TVariables) => void;
  successMessage?: string;
  errorMessage?: string;
}

export function useOptimisticMutation<TData, TVariables>(
  options: OptimisticMutationOptions<TData, TVariables>
) {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const mutate = useCallback(
    async (variables: TVariables) => {
      setIsLoading(true);
      const rollbackData = options.onMutate(variables);

      try {
        const result = await options.mutationFn(variables);
        if (options.onSuccess) {
          options.onSuccess(result, variables);
        }
        if (options.successMessage) {
          showToast({ message: options.successMessage, type: 'success' });
        }
        return result;
      } catch (error) {
        if (options.onError) {
          options.onError(error, rollbackData, variables);
        }
        showToast({
          message: options.errorMessage || 'Action failed, changes reverted.',
          type: 'danger',
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [options, showToast]
  );

  return {
    mutate,
    isLoading,
  };
}
