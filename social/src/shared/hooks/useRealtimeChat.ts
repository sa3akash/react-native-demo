import { useState, useEffect, useCallback, useRef } from 'react';
import { webSocketManager } from '../../core/realtime/WebSocketManager';
import { useChatStore, ChatMessage } from '../../store/useChatStore';
import { useHaptics } from './useHaptics';

export function useRealtimeChat(conversationId: string) {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const { messages, sendMessage: storeSendMessage, markAsRead } = useChatStore();
  const haptics = useHaptics();
  const typingTimerRef = useRef<any>(null);

  // Filter messages for active conversation
  const activeMessages = messages[conversationId] || [];

  // Listen to incoming real-time socket messages & typing events
  useEffect(() => {
    // Join chat room over WebSocket
    webSocketManager.send('chat:join', { conversationId });

    // Incoming Message listener
    const unsubMsg = webSocketManager.subscribe(`chat:message:${conversationId}`, (msg: ChatMessage) => {
      storeSendMessage({
        conversationId,
        content: msg.content,
        type: msg.type,
        mediaUrl: msg.mediaUrl,
        voiceDuration: msg.voiceDuration,
      });
      haptics.light();
    });

    // Typing Indicator listener
    const unsubTyping = webSocketManager.subscribe(`chat:typing:${conversationId}`, (data: { userId: string; userName: string; isTyping: boolean }) => {
      setTypingUsers((prev) => {
        if (data.isTyping) {
          return prev.includes(data.userName) ? prev : [...prev, data.userName];
        } else {
          return prev.filter((name) => name !== data.userName);
        }
      });
    });

    return () => {
      webSocketManager.send('chat:leave', { conversationId });
      unsubMsg();
      unsubTyping();
    };
  }, [conversationId, storeSendMessage, haptics]);

  // Send message
  const sendMessage = useCallback(
    (text: string, type: ChatMessage['type'] = 'text', mediaUrl?: string, voiceDuration?: string) => {
      if (!text.trim() && !mediaUrl) return;

      storeSendMessage({
        conversationId,
        content: text,
        type,
        mediaUrl,
        voiceDuration,
      });

      haptics.selection();
    },
    [conversationId, storeSendMessage, haptics]
  );

  // Broadcast typing status with auto-stop debouncing
  const sendTypingStatus = useCallback(
    (isTyping: boolean) => {
      webSocketManager.send('chat:typing', {
        conversationId,
        userId: 'usr_meta_998',
        userName: 'Alex',
        isTyping,
      });

      if (isTyping) {
        if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
        typingTimerRef.current = setTimeout(() => {
          webSocketManager.send('chat:typing', {
            conversationId,
            userId: 'usr_meta_998',
            userName: 'Alex',
            isTyping: false,
          });
        }, 2500);
      }
    },
    [conversationId]
  );

  return {
    messages: activeMessages,
    typingUsers,
    isTyping: typingUsers.length > 0,
    typingIndicatorText: typingUsers.length > 0 ? `${typingUsers.join(', ')} is typing...` : null,
    sendMessage,
    sendTypingStatus,
    markAsRead: () => markAsRead(conversationId),
  };
}
