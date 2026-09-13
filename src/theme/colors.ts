export interface ColorPalette {
  readonly background: {
    readonly primary: string;
    readonly secondary: string;
    readonly elevated: string;
    readonly overlay: string;
  };
  readonly text: {
    readonly primary: string;
    readonly secondary: string;
    readonly muted: string;
    readonly inverse: string;
  };
  readonly border: {
    readonly default: string;
    readonly subtle: string;
    readonly focused: string;
  };
  readonly brand: {
    readonly primary: string;
    readonly secondary: string;
    readonly accent: string;
  };
  readonly status: {
    readonly success: string;
    readonly successBackground: string;
    readonly warning: string;
    readonly warningBackground: string;
    readonly error: string;
    readonly errorBackground: string;
    readonly info: string;
    readonly infoBackground: string;
  };
}

export const lightColors: ColorPalette = {
  background: {
    primary: '#FFFFFF',
    secondary: '#F8FAFC',
    elevated: '#FFFFFF',
    overlay: 'rgba(15, 23, 42, 0.4)',
  },
  text: {
    primary: '#0F172A',
    secondary: '#475569',
    muted: '#94A3B8',
    inverse: '#FFFFFF',
  },
  border: {
    default: '#E2E8F0',
    subtle: '#F1F5F9',
    focused: '#6366F1',
  },
  brand: {
    primary: '#6366F1',
    secondary: '#4F46E5',
    accent: '#818CF8',
  },
  status: {
    success: '#10B981',
    successBackground: '#ECFDF5',
    warning: '#F59E0B',
    warningBackground: '#FFFBEB',
    error: '#EF4444',
    errorBackground: '#FEF2F2',
    info: '#3B82F6',
    infoBackground: '#EFF6FF',
  },
};

export const darkColors: ColorPalette = {
  background: {
    primary: '#0F172A',
    secondary: '#1E293B',
    elevated: '#334155',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
  text: {
    primary: '#F8FAFC',
    secondary: '#CBD5E1',
    muted: '#64748B',
    inverse: '#0F172A',
  },
  border: {
    default: '#334155',
    subtle: '#1E293B',
    focused: '#818CF8',
  },
  brand: {
    primary: '#818CF8',
    secondary: '#6366F1',
    accent: '#A5B4FC',
  },
  status: {
    success: '#34D399',
    successBackground: 'rgba(52, 211, 153, 0.15)',
    warning: '#FBBF24',
    warningBackground: 'rgba(251, 191, 36, 0.15)',
    error: '#F87171',
    errorBackground: 'rgba(248, 113, 113, 0.15)',
    info: '#60A5FA',
    infoBackground: 'rgba(96, 165, 250, 0.15)',
  },
};
