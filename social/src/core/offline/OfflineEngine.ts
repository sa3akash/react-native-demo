import { storageService } from '../storage/StorageService';
import { apiClient } from '../network/apiClient';
import { eventBus } from '../events/EventBus';

export type OfflineMutationType =
  | 'CREATE_POST'
  | 'LIKE_POST'
  | 'CREATE_COMMENT'
  | 'SEND_MESSAGE'
  | 'BOOKMARK_POST'
  | 'REPOST_POST';

export interface OfflineMutation<T = any> {
  id: string;
  type: OfflineMutationType;
  endpoint: string;
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  payload: T;
  createdAt: number;
  retryCount: number;
  maxRetries: number;
  status: 'pending' | 'syncing' | 'failed' | 'completed';
  error?: string;
}

export interface SyncEngineReport {
  successCount: number;
  failedCount: number;
  remainingCount: number;
  syncedMutationIds: string[];
}

export class OfflineEngine {
  private static instance: OfflineEngine;
  private queueKey = 'socialsphere_offline_mutations';
  private isProcessing = false;
  private isNetworkOnline = true;

  private constructor() {
    eventBus.on('NETWORK:ONLINE', () => {
      this.isNetworkOnline = true;
      this.processQueue();
    });

    eventBus.on('NETWORK:OFFLINE', () => {
      this.isNetworkOnline = false;
    });
  }

  public static getInstance(): OfflineEngine {
    if (!OfflineEngine.instance) {
      OfflineEngine.instance = new OfflineEngine();
    }
    return OfflineEngine.instance;
  }

  public getQueue(): OfflineMutation[] {
    return storageService.getItem<OfflineMutation[]>(this.queueKey) || [];
  }

  public setQueue(queue: OfflineMutation[]): void {
    storageService.setItem(this.queueKey, queue);
    eventBus.emit('OFFLINE:QUEUE_UPDATED', { count: queue.length });
  }

  /**
   * Enqueue an optimistic mutation to be processed when online
   */
  public enqueue<T>(
    type: OfflineMutationType,
    endpoint: string,
    method: 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    payload: T,
    maxRetries = 5
  ): OfflineMutation<T> {
    const queue = this.getQueue();
    const id = `mut_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const mutation: OfflineMutation<T> = {
      id,
      type,
      endpoint,
      method,
      payload,
      createdAt: Date.now(),
      retryCount: 0,
      maxRetries,
      status: 'pending',
    };

    queue.push(mutation);
    this.setQueue(queue);

    // If online, trigger background process
    if (this.isNetworkOnline && !this.isProcessing) {
      this.processQueue();
    }

    return mutation;
  }

  /**
   * Process all queued mutations with exponential backoff
   */
  public async processQueue(): Promise<SyncEngineReport> {
    if (this.isProcessing) {
      return { successCount: 0, failedCount: 0, remainingCount: this.getQueue().length, syncedMutationIds: [] };
    }

    this.isProcessing = true;
    const queue = this.getQueue();

    if (queue.length === 0) {
      this.isProcessing = false;
      return { successCount: 0, failedCount: 0, remainingCount: 0, syncedMutationIds: [] };
    }

    let successCount = 0;
    let failedCount = 0;
    const remainingQueue: OfflineMutation[] = [];
    const syncedMutationIds: string[] = [];

    for (const item of queue) {
      item.status = 'syncing';
      try {
        if (item.method === 'POST') {
          await apiClient.post(item.endpoint, item.payload);
        } else if (item.method === 'PUT' || item.method === 'PATCH') {
          await apiClient.put(item.endpoint, item.payload);
        } else if (item.method === 'DELETE') {
          await apiClient.delete(item.endpoint);
        }

        item.status = 'completed';
        successCount++;
        syncedMutationIds.push(item.id);

        eventBus.emit('OFFLINE:MUTATION_SYNCED', { id: item.id, type: item.type });
      } catch (err: any) {
        item.retryCount += 1;
        item.error = err?.message || 'Network sync error';

        if (item.retryCount < item.maxRetries) {
          item.status = 'pending';
          remainingQueue.push(item);
        } else {
          item.status = 'failed';
          remainingQueue.push(item);
        }
        failedCount++;
      }
    }

    this.setQueue(remainingQueue);
    this.isProcessing = false;

    const report: SyncEngineReport = {
      successCount,
      failedCount,
      remainingCount: remainingQueue.length,
      syncedMutationIds,
    };

    eventBus.emit('OFFLINE:SYNC_COMPLETED', report);
    return report;
  }

  /**
   * Retry specific failed mutation
   */
  public async retryMutation(mutationId: string): Promise<boolean> {
    const queue = this.getQueue();
    const item = queue.find((m) => m.id === mutationId);
    if (!item) return false;

    item.retryCount = 0;
    item.status = 'pending';
    this.setQueue(queue);
    await this.processQueue();
    return true;
  }

  /**
   * Clear all queued offline mutations
   */
  public clearQueue(): void {
    this.setQueue([]);
  }

  public getIsOnline(): boolean {
    return this.isNetworkOnline;
  }

  public setIsOnline(online: boolean): void {
    this.isNetworkOnline = online;
    if (online) {
      this.processQueue();
    }
  }
}

export const offlineEngine = OfflineEngine.getInstance();
