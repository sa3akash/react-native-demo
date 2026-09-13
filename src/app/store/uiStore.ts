import { create } from 'zustand';

export interface ToastNotice {
  readonly id: string;
  readonly message: string;
  readonly type: 'success' | 'error' | 'info' | 'warning';
  readonly durationMs?: number;
}

interface UiState {
  readonly toasts: readonly ToastNotice[];
  readonly showToast: (toast: Omit<ToastNotice, 'id'>) => void;
  readonly dismissToast: (id: string) => void;
}

export const useUiStore = create<UiState>(set => ({
  toasts: [],

  showToast: toast => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastNotice = { ...toast, id };
    set(state => ({ toasts: [...state.toasts, newToast] }));
  },

  dismissToast: id => {
    set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }));
  },
}));
