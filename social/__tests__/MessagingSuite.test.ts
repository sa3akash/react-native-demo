import { useChatStore } from '../src/store/useChatStore';

describe('Enterprise Messaging & Real-time Chat System Suite', () => {
  beforeEach(() => {
    useChatStore.setState({
      activeConversationId: null,
      typingUsers: {},
    });
  });

  test('Creates Direct, Group, Channel, and Community conversations', () => {
    const directId = useChatStore.getState().createConversation({
      title: 'Elena Rostova',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
      type: 'direct',
      participants: [
        { id: 'usr_meta_998', name: 'Alex Rivera', avatarUrl: '', role: 'admin', isOnline: true },
        { id: 'usr_3', name: 'Elena Rostova', avatarUrl: '', isOnline: true },
      ],
    });

    const groupId = useChatStore.getState().createConversation({
      title: 'TypeScript Performance Guild',
      avatarUrl: '',
      type: 'group',
      description: 'Guild for optimizing compilation speed and type systems',
      participants: [
        { id: 'usr_meta_998', name: 'Alex Rivera', avatarUrl: '', role: 'admin', isOnline: true },
      ],
    });

    const channelId = useChatStore.getState().createConversation({
      title: 'Breaking Tech News',
      avatarUrl: '',
      type: 'channel',
      participants: [
        { id: 'usr_meta_998', name: 'Alex Rivera', avatarUrl: '', role: 'admin', isOnline: true },
      ],
    });

    const communityId = useChatStore.getState().createConversation({
      title: 'Web3 & Rust Engineers',
      avatarUrl: '',
      type: 'community',
      participants: [
        { id: 'usr_meta_998', name: 'Alex Rivera', avatarUrl: '', role: 'admin', isOnline: true },
      ],
    });

    const convs = useChatStore.getState().conversations;
    expect(convs.some((c) => c.id === directId && c.type === 'direct')).toBe(true);
    expect(convs.some((c) => c.id === groupId && c.type === 'group')).toBe(true);
    expect(convs.some((c) => c.id === channelId && c.type === 'channel')).toBe(true);
    expect(convs.some((c) => c.id === communityId && c.type === 'community')).toBe(true);
  });

  test('Sends various message types (Text, Media, Voice, File, Scheduled)', () => {
    const convId = 'conv_1';

    // 1. Text with Reply
    const textMsgId = useChatStore.getState().sendMessage({
      conversationId: convId,
      content: 'Benchmarking Hermes 0.87 JIT engine',
      type: 'text',
      replyToMessage: {
        id: 'msg_1',
        senderName: 'Sarah Jenkins',
        content: 'Hey Alex!',
      },
    });

    // 2. Voice Note
    const voiceMsgId = useChatStore.getState().sendMessage({
      conversationId: convId,
      content: 'Voice note (0:30)',
      type: 'voice',
      voiceDuration: '0:30',
    });

    // 3. Document File
    const fileMsgId = useChatStore.getState().sendMessage({
      conversationId: convId,
      content: 'Specification.pdf',
      type: 'file',
      fileName: 'Specification.pdf',
      fileSizeBytes: 2400000,
    });

    // 4. Scheduled message
    const schedMsgId = useChatStore.getState().sendMessage({
      conversationId: convId,
      content: 'Reminder for tomorrow meeting',
      type: 'text',
      scheduledFor: 'Tomorrow at 09:00 AM',
    });

    const messages = useChatStore.getState().messages[convId];
    expect(messages.some((m) => m.id === textMsgId && m.replyToMessage?.senderName === 'Sarah Jenkins')).toBe(true);
    expect(messages.some((m) => m.id === voiceMsgId && m.voiceDuration === '0:30')).toBe(true);
    expect(messages.some((m) => m.id === fileMsgId && m.fileName === 'Specification.pdf')).toBe(true);
    expect(messages.some((m) => m.id === schedMsgId && m.scheduledFor === 'Tomorrow at 09:00 AM')).toBe(true);
  });

  test('Handles message editing, reactions, pinning, and deletion', () => {
    const convId = 'conv_1';
    const msgId = useChatStore.getState().sendMessage({
      conversationId: convId,
      content: 'Initial typo message',
      type: 'text',
    });

    // Edit message
    useChatStore.getState().editMessage(convId, msgId, 'Corrected message content');
    let msg = useChatStore.getState().messages[convId].find((m) => m.id === msgId);
    expect(msg?.content).toBe('Corrected message content');
    expect(msg?.isEdited).toBe(true);

    // Add reactions
    useChatStore.getState().addReaction(convId, msgId, '🔥', 'usr_meta_998');
    useChatStore.getState().addReaction(convId, msgId, '❤️', 'usr_1');
    msg = useChatStore.getState().messages[convId].find((m) => m.id === msgId);
    expect(msg?.reactions?.['🔥']).toContain('usr_meta_998');
    expect(msg?.reactions?.['❤️']).toContain('usr_1');

    // Pin message
    useChatStore.getState().pinMessage(convId, msgId);
    msg = useChatStore.getState().messages[convId].find((m) => m.id === msgId);
    expect(msg?.isPinned).toBe(true);
    expect(useChatStore.getState().conversations.find((c) => c.id === convId)?.pinnedMessageId).toBe(msgId);

    // Unpin message
    useChatStore.getState().unpinMessage(convId);
    msg = useChatStore.getState().messages[convId].find((m) => m.id === msgId);
    expect(msg?.isPinned).toBe(false);

    // Delete message for everyone
    useChatStore.getState().deleteMessage(convId, msgId, 'everyone');
    msg = useChatStore.getState().messages[convId].find((m) => m.id === msgId);
    expect(msg?.isDeleted).toBe(true);
    expect(msg?.content).toContain('deleted');
  });

  test('Forwards messages to target conversation', () => {
    const sourceMsg = useChatStore.getState().messages['conv_1'][0];
    useChatStore.getState().forwardMessage('conv_2', sourceMsg);

    const destMessages = useChatStore.getState().messages['conv_2'];
    expect(destMessages.some((m) => m.forwardedFrom === sourceMsg.senderName)).toBe(true);
  });

  test('Real-time typing indicator & read receipt marking', () => {
    const convId = 'conv_1';

    // Typing user
    useChatStore.getState().setTyping(convId, 'Sarah Jenkins', true);
    expect(useChatStore.getState().typingUsers[convId]).toContain('Sarah Jenkins');

    useChatStore.getState().setTyping(convId, 'Sarah Jenkins', false);
    expect(useChatStore.getState().typingUsers[convId]).not.toContain('Sarah Jenkins');

    // Mark as read
    useChatStore.getState().markAsRead(convId);
    const conv = useChatStore.getState().conversations.find((c) => c.id === convId);
    expect(conv?.unreadCount).toBe(0);
  });
});
