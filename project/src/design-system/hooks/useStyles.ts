/**
 * GoSeat - Bus Ticket Booking UI Kit / budhi design lab
 * Advanced & Clean Style Hook (`useStyles` & `makeStyles`)
 * Evaluates theme style factories once in O(1) time and caches results across re-renders.
 */

import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Theme } from '../theme/types';

export type StyleFactory<T extends StyleSheet.NamedStyles<T>> = (theme: Theme) => T;

// Global O(1) style cache keyed by (factory -> theme -> styles)
const cache = new WeakMap<StyleFactory<any>, Map<Theme, any>>();

/**
 * Consumes theme styles cleanly with automatic O(1) caching and zero re-render overhead.
 */
export function useStyles<T extends StyleSheet.NamedStyles<T>>(factory: StyleFactory<T>): T {
  const { theme } = useTheme();

  return useMemo(() => {
    let themeMap = cache.get(factory);
    if (!themeMap) {
      themeMap = new Map();
      cache.set(factory, themeMap);
    }

    let styles = themeMap.get(theme);
    if (!styles) {
      styles = factory(theme);
      themeMap.set(theme, styles);
    }

    return styles;
  }, [factory, theme]);
}

/**
 * Creates a bound, reusable custom hook for component styling.
 */
export function makeStyles<T extends StyleSheet.NamedStyles<T>>(factory: StyleFactory<T>) {
  return () => useStyles(factory);
}
