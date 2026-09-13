import { offlineEngine } from '../src/core/offline/OfflineEngine';
import { useOfflineStore } from '../src/store/useOfflineStore';
import { apiClient } from '../src/core/network/apiClient';

describe('Enterprise Offline First Architecture Suite', () => {
  beforeEach(() => {
    offlineEngine.clearQueue();
    offlineEngine.setIsOnline(true);
    jest.spyOn(apiClient, 'post').mockResolvedValue({ data: { success: true } } as any);
    jest.spyOn(apiClient, 'put').mockResolvedValue({ data: { success: true } } as any);
    jest.spyOn(apiClient, 'delete').mockResolvedValue({ data: { success: true } } as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Enqueues optimistic mutations while offline (Feed Posts, Comments, Messages, Likes)', () => {
    offlineEngine.setIsOnline(false);

    // 1. Post creation mutation
    const postMut = offlineEngine.enqueue(
      'CREATE_POST',
      '/api/v1/posts',
      'POST',
      { content: 'Zero-copy offline message from React Native!' }
    );
    expect(postMut).toBeDefined();
    expect(postMut.type).toBe('CREATE_POST');
    expect(postMut.status).toBe('pending');

    // 2. Comment creation mutation
    const commentMut = offlineEngine.enqueue(
      'CREATE_COMMENT',
      '/api/v1/posts/post_1/comments',
      'POST',
      { text: 'Great point about MMKV zero-overhead persistence.' }
    );
    expect(commentMut).toBeDefined();

    // 3. Direct Message mutation
    const messageMut = offlineEngine.enqueue(
      'SEND_MESSAGE',
      '/api/v1/conversations/conv_1/messages',
      'POST',
      { text: 'Hey Alex, check out the offline sync engine!' }
    );
    expect(messageMut).toBeDefined();

    // 4. Like mutation
    const likeMut = offlineEngine.enqueue(
      'LIKE_POST',
      '/api/v1/posts/post_1/like',
      'POST',
      { reactionType: 'love' }
    );
    expect(likeMut).toBeDefined();

    const queue = offlineEngine.getQueue();
    expect(queue.length).toBe(4);
  });

  test('Processes queued mutations on network reconnection', async () => {
    offlineEngine.setIsOnline(false);
    offlineEngine.clearQueue();

    // Enqueue 2 mutations
    offlineEngine.enqueue('LIKE_POST', '/api/v1/posts/p1/like', 'POST', { reactionType: 'like' });
    offlineEngine.enqueue('BOOKMARK_POST', '/api/v1/posts/p1/bookmark', 'POST', {});

    expect(offlineEngine.getQueue().length).toBe(2);

    // Sync now
    const report = await useOfflineStore.getState().syncNow();
    expect(report.successCount).toBe(2);
    expect(report.failedCount).toBe(0);
    expect(offlineEngine.getQueue().length).toBe(0);
  });

  test('Handles mutation retry controls and clearing queue', async () => {
    offlineEngine.setIsOnline(false);
    offlineEngine.clearQueue();

    offlineEngine.enqueue('CREATE_POST', '/api/v1/posts', 'POST', { content: 'Test post' });
    expect(useOfflineStore.getState().queuedMutations.length).toBe(1);

    useOfflineStore.getState().clearQueue();
    expect(useOfflineStore.getState().queuedMutations.length).toBe(0);
  });
});
