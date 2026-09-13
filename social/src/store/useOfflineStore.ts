import { create } from 'zustand';
import { produce } from 'immer';
import { offlineEngine, OfflineMutation, SyncEngineReport } from '../core/offline/OfflineEngine';
import { eventBus } from '../core/events/EventBus';

interface OfflineState {
  isOnline: boolean;
  isSyncing: boolean;
  queuedMutations: OfflineMutation[];
  queuedMutationsCount: number;
  lastSyncedAt: number | null;
  lastSyncReport: SyncEngineReport | null;

  setIsOnline: (online: boolean) => void;
  syncNow: () => Promise<SyncEngineReport>;
  retryMutation: (id: string) => Promise<boolean>;
  clearQueue: () => void;
  updateQueue: () => void;
}

export const useOfflineStore = create<OfflineState>((set, get) => {
  eventBus.on('OFFLINE:QUEUE_UPDATED', () => {
    get().updateQueue();
  });

  eventBus.on('OFFLINE:SYNC_COMPLETED', (report: any) => {
    set({
      lastSyncReport: report,
      lastSyncedAt: Date.now(),
      queuedMutations: offlineEngine.getQueue(),
      queuedMutationsCount: offlineEngine.getQueue().length,
    });
  });

  return {
    isOnline: offlineEngine.getIsOnline(),
    isSyncing: false,
    queuedMutations: offlineEngine.getQueue(),
    queuedMutationsCount: offlineEngine.getQueue().length,
    lastSyncedAt: Date.now(),
    lastSyncReport: null,

    setIsOnline: (online) => {
      offlineEngine.setIsOnline(online);
      set({ isOnline: online });
    },

    syncNow: async () => {
      if (get().isSyncing) {
        return {
          successCount: 0,
          failedCount: 0,
          remainingCount: offlineEngine.getQueue().length,
          syncedMutationIds: [],
        };
      }

      set({ isSyncing: true });
      try {
        const report = await offlineEngine.processQueue();
        set({
          lastSyncedAt: Date.now(),
          lastSyncReport: report,
        });
        return report;
      } finally {
        set({
          isSyncing: false,
          queuedMutations: offlineEngine.getQueue(),
        });
      }
    },

    retryMutation: async (id) => {
      set({ isSyncing: true });
      try {
        const success = await offlineEngine.retryMutation(id);
        return success;
      } finally {
        set({
          isSyncing: false,
          queuedMutations: offlineEngine.getQueue(),
        });
      }
    },

    clearQueue: () => {
      offlineEngine.clearQueue();
      set({ queuedMutations: [] });
    },

    updateQueue: () => {
      set({ queuedMutations: offlineEngine.getQueue() });
    },
  };
});
