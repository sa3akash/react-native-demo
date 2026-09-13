import { useState, useEffect, useCallback, useRef } from 'react';
import { webSocketManager } from '../../core/realtime/WebSocketManager';
import { ReactionType } from '../components/organisms/ReactionPicker';

export interface LiveReactionEvent {
  postId: string;
  reaction: ReactionType;
  userName: string;
  timestamp: number;
}

export interface LiveStreamGiftEvent {
  streamId: string;
  senderName: string;
  giftIcon: string;
  giftName: string;
}

export function useRealtimeFeed(targetPostId?: string, targetStreamId?: string) {
  const [recentReactions, setRecentReactions] = useState<LiveReactionEvent[]>([]);
  const [liveViewerCount, setLiveViewerCount] = useState(1420);
  const [activeGifts, setActiveGifts] = useState<LiveStreamGiftEvent[]>([]);

  // High-throughput buffering to eliminate UI thread jitter & re-render spam
  const reactionsBuffer = useRef<LiveReactionEvent[]>([]);
  const batchTimeoutRef = useRef<any>(null);

  useEffect(() => {
    // Micro-batched reaction ingestion
    const unsubReactions = webSocketManager.subscribe('feed:reaction', (event: LiveReactionEvent) => {
      if (!targetPostId || event.postId === targetPostId) {
        reactionsBuffer.current.push(event);

        if (!batchTimeoutRef.current) {
          batchTimeoutRef.current = setTimeout(() => {
            if (reactionsBuffer.current.length > 0) {
              const incoming = [...reactionsBuffer.current];
              reactionsBuffer.current = [];
              setRecentReactions((prev) => [...incoming.slice(-5), ...prev].slice(0, 10));
            }
            batchTimeoutRef.current = null;
          }, 120); // 120ms frame batching window
        }
      }
    });

    // Listen to live stream metrics
    const unsubViewers = webSocketManager.subscribe('live:viewers', (data: { streamId: string; count: number }) => {
      if (!targetStreamId || data.streamId === targetStreamId) {
        setLiveViewerCount(data.count);
      }
    });

    // Listen to live gifts
    const unsubGifts = webSocketManager.subscribe('live:gift', (gift: LiveStreamGiftEvent) => {
      if (!targetStreamId || gift.streamId === targetStreamId) {
        setActiveGifts((prev) => [...prev.slice(-5), gift]);
      }
    });

    return () => {
      unsubReactions();
      unsubViewers();
      unsubGifts();
      if (batchTimeoutRef.current) {
        clearTimeout(batchTimeoutRef.current);
      }
    };
  }, [targetPostId, targetStreamId]);

  const sendLiveGift = useCallback(
    (gift: { icon: string; name: string }) => {
      if (!targetStreamId) return;

      const giftEvent: LiveStreamGiftEvent = {
        streamId: targetStreamId,
        senderName: 'You',
        giftIcon: gift.icon,
        giftName: gift.name,
      };

      webSocketManager.send('live:gift', giftEvent);
      setActiveGifts((prev) => [...prev.slice(-5), giftEvent]);
    },
    [targetStreamId]
  );

  return {
    recentReactions,
    liveViewerCount,
    activeGifts,
    sendLiveGift,
  };
}
