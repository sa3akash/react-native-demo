import { useMutation } from '@tanstack/react-query';
import { useUiStore } from '../../../app/store/uiStore';
import { tokenManager } from '../../../services/api/tokenManager';
import { authApi } from '../api/authApi';
import { LoginFormValues } from '../schemas/auth.schema';
import { useAuthStore } from '../store/authStore';

export const useLogin = () => {
  const setAuthenticated = useAuthStore(state => state.setAuthenticated);
  const showToast = useUiStore(state => state.showToast);

  return useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const data = await authApi.login(values);
      await tokenManager.setTokens(data.tokens.accessToken, data.tokens.refreshToken);
      setAuthenticated(data.user, data.tokens.accessToken);
      return data;
    },
    onSuccess: data => {
      showToast({
        message: `Welcome back, ${data.user.fullName}!`,
        type: 'success',
      });
    },
    onError: (error: Error) => {
      showToast({
        message: error.message || 'Login failed. Please check your credentials.',
        type: 'error',
      });
    },
  });
};
