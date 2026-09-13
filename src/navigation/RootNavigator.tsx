import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { Loading } from '../components/feedback/Loading';
import { useAuthStore } from '../features/auth/store/authStore';
import { SessionManager } from '../services/auth/SessionManager';
import { AppNavigator } from './AppNavigator';
import { AuthNavigator } from './AuthNavigator';
import { linking } from './linking';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const status = useAuthStore(state => state.status);

  useEffect(() => {
    SessionManager.restoreSession();
  }, []);

  if (status === 'loading') {
    return <Loading message="Initializing Enterprise Suite..." fullScreen />;
  }

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {status === 'authenticated' || status === 'refreshing' ? (
          <Stack.Screen name="App" component={AppNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
