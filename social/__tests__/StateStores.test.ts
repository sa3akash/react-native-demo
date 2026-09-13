import { useAuthStore } from '../src/store/useAuthStore';
import { useFeedStore } from '../src/store/useFeedStore';
import { useChatStore } from '../src/store/useChatStore';

describe('Zustand State Stores', () => {
  test('useAuthStore initializes with mock user and supports profile updates', () => {
    const { user, updateProfile } = useAuthStore.getState();
    expect(user).toBeDefined();
    expect(user?.name).toBe('Alex Rivera');

    updateProfile({ headline: 'Staff Platform Engineer' });
    expect(useAuthStore.getState().user?.headline).toBe('Staff Platform Engineer');
  });

  test('useFeedStore supports 7 Facebook-style reactions with optimistic counting', () => {
    const { posts, reactToPost } = useFeedStore.getState();
    const firstPost = posts[0];
    const initialLoveCount = firstPost.reactionsCount.love || 0;

    reactToPost(firstPost.id, 'love');
    const updatedPost = useFeedStore.getState().posts.find((p) => p.id === firstPost.id);

    expect(updatedPost?.userReaction).toBe('love');
    expect(updatedPost?.reactionsCount.love).toBe(initialLoveCount + 1);
  });

  test('useChatStore creates and appends messages correctly', () => {
    const { sendMessage } = useChatStore.getState();
    sendMessage({
      conversationId: 'conv_1',
      content: 'Enterprise testing message',
      type: 'text',
    });

    const messages = useChatStore.getState().messages['conv_1'];
    const lastMsg = messages[messages.length - 1];
    expect(lastMsg.content).toBe('Enterprise testing message');
    expect(['sending', 'sent']).toContain(lastMsg.status);
  });
});
