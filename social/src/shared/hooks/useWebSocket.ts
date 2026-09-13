import { useState, useEffect, useCallback } from 'react';
import { webSocketManager, SocketEventCallback } from '../../core/realtime/WebSocketManager';

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(webSocketManager.isConnected);

  useEffect(() => {
    webSocketManager.connect();
    const interval = setInterval(() => {
      setIsConnected(webSocketManager.isConnected);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const send = useCallback((type: string, data: any) => {
    webSocketManager.send(type, data);
  }, []);

  const subscribe = useCallback((event: string, callback: SocketEventCallback) => {
    return webSocketManager.subscribe(event, callback);
  }, []);

  const joinRoom = useCallback((roomId: string) => {
    webSocketManager.send('room:join', { roomId });
  }, []);

  const leaveRoom = useCallback((roomId: string) => {
    webSocketManager.send('room:leave', { roomId });
  }, []);

  return {
    isConnected,
    send,
    subscribe,
    joinRoom,
    leaveRoom,
    reconnect: webSocketManager.connect.bind(webSocketManager),
    disconnect: webSocketManager.disconnect.bind(webSocketManager),
  };
}
