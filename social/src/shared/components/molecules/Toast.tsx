import React, { createContext, useContext, useState, useCallback, memo } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { Typography } from '../atoms/Typography';

export type ToastType = 'success' | 'danger' | 'warning' | 'info';

export interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

export interface ToastProps {
  message: string;
  type?: ToastType;
}

export const Toast: React.FC<ToastProps> = memo(({ message, type = 'info' }) => {
  const { colors, theme } = useTheme();

  return (
    <View
      style={[
        styles.toastBubble,
        {
          backgroundColor:
            type === 'success'
              ? colors.success
              : type === 'danger'
              ? colors.danger
              : type === 'warning'
              ? colors.warning
              : colors.surfaceElevated,
          borderRadius: theme.radius.full,
        },
      ]}
      accessible={true}
      accessibilityRole="alert"
    >
      <Typography variant="body2" color="#FFFFFF" bold>
        {message}
      </Typography>
    </View>
  );
});

interface ToastContextValue {
  showToast: (options: ToastOptions | string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  const showToast = useCallback(
    (options: ToastOptions | string) => {
      const message = typeof options === 'string' ? options : options.message;
      const type = typeof options === 'string' ? 'info' : options.type || 'info';
      const duration = typeof options === 'string' ? 3000 : options.duration || 3000;

      setToast({ message, type });

      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.delay(duration),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setToast(null);
      });
    },
    [fadeAnim]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.toastContainer,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Toast message={toast.message} type={toast.type} />
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 9999,
  },
  toastBubble: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
});
