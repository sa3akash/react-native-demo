import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastContainer } from '../../components/feedback/Toast';
import { queryClient } from '../../lib/queryClient';
import { ThemeProvider } from '../../theme/ThemeProvider';
import { useThemeStore } from '../store/themeStore';

interface RootProviderProps {
  readonly children: React.ReactNode;
}

export const RootProvider: React.FC<RootProviderProps> = ({ children }) => {
  const mode = useThemeStore(state => state.mode);
  const setMode = useThemeStore(state => state.setMode);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <ThemeProvider mode={mode} onModeChange={setMode}>
          <QueryClientProvider client={queryClient}>
            {children}
            <ToastContainer />
          </QueryClientProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
