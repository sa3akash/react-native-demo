/**
 * Network Connectivity Monitor abstraction using NetInfo with fallback state
 */

export interface NetworkState {
  isConnected: boolean;
  isInternetReachable: boolean;
}

type NetworkListener = (state: NetworkState) => void;

class NetworkMonitor {
  private listeners: Set<NetworkListener> = new Set();
  private currentState: NetworkState = {
    isConnected: true,
    isInternetReachable: true,
  };

  constructor() {
    try {
      const NetInfo = require("@react-native-community/netinfo");
      NetInfo.addEventListener((state: { isConnected?: boolean; isInternetReachable?: boolean }) => {
        const newState: NetworkState = {
          isConnected: state.isConnected ?? true,
          isInternetReachable: state.isInternetReachable ?? true,
        };
        this.currentState = newState;
        this.notifyListeners(newState);
      });
    } catch {
      // NetInfo native library fallback
    }
  }

  public getState(): NetworkState {
    return this.currentState;
  }

  public subscribe(listener: NetworkListener): () => void {
    this.listeners.add(listener);
    listener(this.currentState);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(state: NetworkState): void {
    this.listeners.forEach((listener) => listener(state));
  }
}

export const networkMonitor = new NetworkMonitor();
