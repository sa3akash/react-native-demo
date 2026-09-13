import { APP_CONFIG } from '../config/appConfig';
import { eventBus } from '../events/EventBus';
import { storageService } from '../storage/StorageService';

export type SocketEventCallback = (data: any) => void;

class WebSocketManager {
  private socket: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectInterval = 3000;
  private pingInterval: any = null;
  private listeners: Map<string, Set<SocketEventCallback>> = new Map();
  public isConnected = false;

  constructor() {
    this.url = APP_CONFIG.wsBaseUrl;
  }

  public connect(): void {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const token = storageService.getItem<string>('auth_token');
    const wsUrlWithAuth = token ? `${this.url}?token=${encodeURIComponent(token)}` : this.url;

    try {
      this.socket = new WebSocket(wsUrlWithAuth);

      this.socket.onopen = () => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.startHeartbeat();
        eventBus.emit('NETWORK:ONLINE', undefined);
      };

      this.socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          const { type, data } = payload;

          // Dispatch to topic listeners
          if (type && this.listeners.has(type)) {
            this.listeners.get(type)!.forEach((cb) => cb(data));
          }

          // Forward to global event bus
          if (type === 'chat:message') {
            eventBus.emit('CHAT:NEW_MESSAGE', data);
          } else if (type === 'notification:new') {
            eventBus.emit('NOTIFICATION:RECEIVED', data);
          } else if (type === 'call:incoming') {
            eventBus.emit('CALL:INCOMING', data);
          }
        } catch (err) {
          console.error('[WebSocket] Failed to parse message:', err);
        }
      };

      this.socket.onerror = (err) => {
        console.warn('[WebSocket] Error:', err);
      };

      this.socket.onclose = () => {
        this.isConnected = false;
        this.stopHeartbeat();
        this.scheduleReconnect();
      };
    } catch (e) {
      console.warn('[WebSocket] Connect error:', e);
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(this.reconnectInterval * Math.pow(1.5, this.reconnectAttempts), 30000);
      setTimeout(() => {
        this.connect();
      }, delay);
    }
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.pingInterval = setInterval(() => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.send('ping', { timestamp: Date.now() });
      }
    }, 25000);
  }

  private stopHeartbeat() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  public subscribe(event: string, callback: SocketEventCallback): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    return () => {
      const set = this.listeners.get(event);
      if (set) {
        set.delete(callback);
        if (set.size === 0) {
          this.listeners.delete(event);
        }
      }
    };
  }

  public publish(event: string, data: any): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach((cb) => cb(data));
    }
  }

  public send(type: string, data: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, data }));
    }
  }

  public disconnect(): void {
    this.stopHeartbeat();
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.isConnected = false;
  }
}

export const webSocketManager = new WebSocketManager();
