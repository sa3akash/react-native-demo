import { storageAdapter } from "../storage/storageAdapter";
import { networkMonitor } from "./networkMonitor";
import { logger } from "../logger/logger";

export interface PendingMutation {
  id: string;
  type: "ADD_TO_CART" | "TOGGLE_WISHLIST" | "SAVE_ADDRESS";
  payload: unknown;
  timestamp: number;
}

const STORAGE_KEY = "offline_pending_mutations";

class OfflineQueue {
  private queue: PendingMutation[] = [];

  constructor() {
    this.loadQueue();
    networkMonitor.subscribe((state) => {
      if (state.isConnected && state.isInternetReachable) {
        this.flushQueue();
      }
    });
  }

  private loadQueue(): void {
    const saved = storageAdapter.getObject<PendingMutation[]>(STORAGE_KEY);
    if (saved && Array.isArray(saved)) {
      this.queue = saved;
    }
  }

  private saveQueue(): void {
    storageAdapter.setObject(STORAGE_KEY, this.queue);
  }

  public enqueue(type: PendingMutation["type"], payload: unknown): void {
    const item: PendingMutation = {
      id: `mut_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type,
      payload,
      timestamp: Date.now(),
    };
    this.queue.push(item);
    this.saveQueue();
    logger.info(`[OfflineQueue] Enqueued mutation: ${type}`, item);

    // If online right now, try immediate flush
    if (networkMonitor.getState().isConnected) {
      this.flushQueue();
    }
  }

  public async flushQueue(): Promise<void> {
    if (this.queue.length === 0) return;

    logger.info(`[OfflineQueue] Flushing ${this.queue.length} pending mutations...`);
    const pending = [...this.queue];
    this.queue = [];
    this.saveQueue();

    for (const mutation of pending) {
      try {
        logger.info(`[OfflineQueue] Processing mutation ${mutation.type}`, mutation.payload);
        // Process offline mutation logic
      } catch (err) {
        logger.error(`[OfflineQueue] Failed to process mutation ${mutation.id}`, err);
      }
    }
  }

  public getQueueLength(): number {
    return this.queue.length;
  }
}

export const offlineQueue = new OfflineQueue();
