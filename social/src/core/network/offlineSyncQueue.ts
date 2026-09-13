import { storageService } from '../storage/StorageService';
import { apiClient } from './apiClient';
import { eventBus } from '../events/EventBus';

export interface QueuedMutation {
  id: string;
  type: 'LIKE_POST' | 'CREATE_COMMENT' | 'SEND_MESSAGE' | 'CREATE_POST' | 'BOOKMARK_POST' | 'REPOST_POST';
  endpoint: string;
  method: 'POST' | 'PUT' | 'DELETE';
  payload: any;
  createdAt: number;
  retryCount: number;
}

class OfflineSyncQueue {
  private queueKey = 'offline_mutations_queue';
  private isProcessing = false;

  constructor() {
    eventBus.on('NETWORK:ONLINE', () => {
      this.processQueue();
    });
  }

  public getQueue(): QueuedMutation[] {
    return storageService.getItem<QueuedMutation[]>(this.queueKey) || [];
  }

  public enqueue(mutation: Omit<QueuedMutation, 'id' | 'createdAt' | 'retryCount'>): string {
    const queue = this.getQueue();
    const id = `mut_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const newEntry: QueuedMutation = {
      ...mutation,
      id,
      createdAt: Date.now(),
      retryCount: 0,
    };
    queue.push(newEntry);
    storageService.setItem(this.queueKey, queue);
    return id;
  }

  public async processQueue(): Promise<{ successCount: number; failedCount: number }> {
    if (this.isProcessing) return { successCount: 0, failedCount: 0 };
    this.isProcessing = true;

    const queue = this.getQueue();
    if (queue.length === 0) {
      this.isProcessing = false;
      return { successCount: 0, failedCount: 0 };
    }

    let successCount = 0;
    let failedCount = 0;
    const remainingQueue: QueuedMutation[] = [];

    for (const item of queue) {
      try {
        if (item.method === 'POST') {
          await apiClient.post(item.endpoint, item.payload);
        } else if (item.method === 'PUT') {
          await apiClient.put(item.endpoint, item.payload);
        } else if (item.method === 'DELETE') {
          await apiClient.delete(item.endpoint);
        }
        successCount++;
      } catch (err) {
        item.retryCount += 1;
        if (item.retryCount < 5) {
          remainingQueue.push(item);
        }
        failedCount++;
      }
    }

    storageService.setItem(this.queueKey, remainingQueue);
    this.isProcessing = false;

    eventBus.emit('OFFLINE:QUEUE_PROCESSED', { successCount, failedCount });
    return { successCount, failedCount };
  }

  public clearQueue(): void {
    storageService.setItem(this.queueKey, []);
  }
}

export const offlineSyncQueue = new OfflineSyncQueue();
