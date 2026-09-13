import { eventBus } from '../events/EventBus';

export type UploadStatus = 'queued' | 'compressing' | 'uploading' | 'paused' | 'completed' | 'failed';

export interface MediaFile {
  id: string;
  uri: string;
  name: string;
  type: 'image' | 'video' | 'audio';
  sizeBytes: number;
  durationSeconds?: number;
}

export interface UploadTask {
  id: string;
  file: MediaFile;
  status: UploadStatus;
  progress: number; // 0 to 100
  totalChunks: number;
  uploadedChunks: number;
  originalSizeBytes: number;
  compressedSizeBytes: number;
  remoteUrl?: string;
  error?: string;
  retryCount: number;
}

const CHUNK_SIZE_BYTES = 1024 * 1024; // 1MB chunks
const MAX_RETRIES = 3;

export class MediaUploadService {
  private static tasks: Map<string, UploadTask> = new Map();
  private static isProcessing = false;

  /**
   * Compress a media file to reduce upload size by 40-70%
   */
  public static async compressMedia(file: MediaFile): Promise<{ compressedSize: number; compressedUri: string }> {
    // Simulate compression ratio
    const compressionRatio = file.type === 'video' ? 0.45 : file.type === 'image' ? 0.35 : 0.6;
    const compressedSize = Math.round(file.sizeBytes * compressionRatio);
    return {
      compressedSize,
      compressedUri: file.uri,
    };
  }

  /**
   * Enqueue a new media file for chunked background upload
   */
  public static async enqueueUpload(
    file: MediaFile,
    onProgress?: (progress: number) => void
  ): Promise<UploadTask> {
    const taskId = `upload_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const totalChunks = Math.max(1, Math.ceil(file.sizeBytes / CHUNK_SIZE_BYTES));

    const task: UploadTask = {
      id: taskId,
      file,
      status: 'queued',
      progress: 0,
      totalChunks,
      uploadedChunks: 0,
      originalSizeBytes: file.sizeBytes,
      compressedSizeBytes: file.sizeBytes,
      retryCount: 0,
    };

    this.tasks.set(taskId, task);
    this.processTask(taskId, onProgress);
    return task;
  }

  /**
   * Execute task: Compress -> Chunk Upload -> Finalize
   */
  private static async processTask(
    taskId: string,
    onProgress?: (progress: number) => void
  ): Promise<void> {
    const task = this.tasks.get(taskId);
    if (!task) return;

    try {
      // 1. Compression Stage
      task.status = 'compressing';
      task.progress = 10;
      onProgress?.(10);

      const compressionResult = await this.compressMedia(task.file);
      task.compressedSizeBytes = compressionResult.compressedSize;
      task.totalChunks = Math.max(1, Math.ceil(compressionResult.compressedSize / CHUNK_SIZE_BYTES));

      // 2. Chunk Upload Stage
      task.status = 'uploading';
      for (let i = 1; i <= task.totalChunks; i++) {
        // Simulate chunk upload delay
        await new Promise((r) => setTimeout(() => r(undefined), 150));

        task.uploadedChunks = i;
        const currentProgress = 10 + Math.round((i / task.totalChunks) * 85);
        task.progress = Math.min(95, currentProgress);
        onProgress?.(task.progress);
      }

      // 3. Finalize & Generate Remote URL
      task.progress = 100;
      task.status = 'completed';
      task.remoteUrl = `https://cdn.socialsphere.io/media/${taskId}_${task.file.name}`;
      onProgress?.(100);

      eventBus.emit('NOTIFICATION:RECEIVED', {
        id: `notif_${Date.now()}`,
        title: 'Upload Completed',
        body: `Your ${task.file.type} has been uploaded and processed.`,
        type: 'MEDIA_UPLOAD',
      });
    } catch (err: any) {
      if (task.retryCount < MAX_RETRIES) {
        task.retryCount += 1;
        task.status = 'queued';
        // Exponential backoff
        setTimeout(() => this.processTask(taskId, onProgress), 1000 * Math.pow(2, task.retryCount));
      } else {
        task.status = 'failed';
        task.error = err?.message || 'Upload failed after retries';
      }
    }
  }

  public static getTask(taskId: string): UploadTask | undefined {
    return this.tasks.get(taskId);
  }

  public static getAllTasks(): UploadTask[] {
    return Array.from(this.tasks.values());
  }

  public static cancelTask(taskId: string): void {
    const task = this.tasks.get(taskId);
    if (task) {
      task.status = 'failed';
      task.error = 'Upload cancelled by user';
    }
  }
}

export const mediaUploadService = MediaUploadService;
