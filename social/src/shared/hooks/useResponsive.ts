import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { getResponsiveMetrics, ResponsiveMetrics } from '../../theme/responsive';

export function useResponsive(): ResponsiveMetrics {
  const [metrics, setMetrics] = useState<ResponsiveMetrics>(() => getResponsiveMetrics());

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', () => {
      setMetrics(getResponsiveMetrics());
    });
    return () => sub.remove();
  }, []);

  return metrics;
}
