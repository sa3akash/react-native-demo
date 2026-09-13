export type EventPayloads = {
  'AUTH:LOGIN': { userId: string; token: string };
  'AUTH:LOGOUT': { reason?: string };
  'AUTH:SESSION_EXPIRED': { timestamp: number };
  'NETWORK:ONLINE': undefined;
  'NETWORK:OFFLINE': undefined;
  'NOTIFICATION:RECEIVED': { id: string; title: string; body: string; type: string; data?: any };
  'NOTIFICATION:BADGE_UPDATED': { unreadCount: number };
  'CHAT:NEW_MESSAGE': { messageId: string; conversationId: string; senderId: string; content: string };
  'CHAT:TYPING': { conversationId: string; userId: string; isTyping: boolean };
  'CALL:INCOMING': { callId: string; callerName: string; callerAvatar: string; isVideo: boolean; channelName: string };
  'CALL:CONNECTED': { callId: string; callType?: string };
  'CALL:OUTGOING_STARTED': { callId: string; participant: any };
  'CALL:ENDED': { callId: string | null; reason?: string };
  'CALL:RECORDING_STARTED': { callId: string };
  'CALL:RECORDING_PAUSED': { callId: string | null };
  'CALL:RECORDING_RESUMED': { callId: string | null };
  'CALL:RECORDING_TICK': { callId: string | null; durationSeconds: number };
  'CALL:RECORDING_SAVED': any;
  'WEBRTC:ICE_CANDIDATE': { peerId: string; candidate: any };
  'FEED:REFRESH_REQUESTED': undefined;
  'FEED:POST_CREATED': { postId: string; authorId: string };
  'FEED:POST_REPOSTED': { postId: string; quoteContent?: string };
  'FEED:REACTION_ADDED': { postId: string; reaction: string; userId: string };
  'OFFLINE:QUEUE_PROCESSED': { successCount: number; failedCount: number };
  'OFFLINE:QUEUE_UPDATED': { count: number };
  'OFFLINE:MUTATION_SYNCED': { id: string; type: string };
  'OFFLINE:SYNC_COMPLETED': any;
  'THEME:CHANGED': { mode: string };
};

type EventKey = keyof EventPayloads;
type EventHandler<K extends EventKey> = (payload: EventPayloads[K]) => void;

class TypedEventBus {
  private listeners: Map<EventKey, Set<EventHandler<any>>> = new Map();

  public on<K extends EventKey>(event: K, handler: EventHandler<K>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    const handlers = this.listeners.get(event)!;
    handlers.add(handler);

    return () => {
      this.off(event, handler);
    };
  }

  public off<K extends EventKey>(event: K, handler: EventHandler<K>): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  public emit<K extends EventKey>(event: K, payload: EventPayloads[K]): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(payload);
        } catch (error) {
          console.error(`[EventBus] Error in handler for event "${String(event)}":`, error);
        }
      });
    }
  }

  public clearAll(): void {
    this.listeners.clear();
  }
}

export const eventBus = new TypedEventBus();
