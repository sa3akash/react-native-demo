import { useEffect, useRef } from 'react';
import { webSocketManager, SocketEventCallback } from '../../core/realtime/WebSocketManager';

/**
 * Hook to subscribe to a WebSocket event and automatically unsubscribe on unmount.
 * @param event The event topic to listen to.
 * @param handler The callback function.
 */
export function useSocketEvent(event: string, handler: SocketEventCallback) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const callback: SocketEventCallback = (data) => {
      handlerRef.current(data);
    };

    const unsubscribe = webSocketManager.subscribe(event, callback);

    return () => {
      unsubscribe();
    };
  }, [event]);
}
