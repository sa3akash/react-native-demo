import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from './types';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['myapp://', 'https://myapp.example.com'],
  config: {
    screens: {
      Auth: {
        screens: {
          Login: 'login',
          Register: 'register',
          ForgotPassword: 'forgot-password',
        },
      },
      App: {
        screens: {
          MainTabs: {
            screens: {
              HomeTab: 'home',
              ProfileTab: 'profile/:userId?',
              SettingsTab: 'settings',
            },
          },
          ProductDetail: 'product/:productId',
        },
      },
    },
  },
};
