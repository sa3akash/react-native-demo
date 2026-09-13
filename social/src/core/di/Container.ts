import { storageService, secureStorageService } from '../storage/StorageService';
import { keychainService } from '../security/KeychainService';
import { apiClient } from '../network/apiClient';
import { offlineSyncQueue } from '../network/offlineSyncQueue';
import { webSocketManager } from '../realtime/WebSocketManager';
import { webRTCManager } from '../realtime/WebRTCManager';
import { biometricsService } from '../security/BiometricsService';
import { securityService } from '../security/SecurityService';
import { analyticsService } from '../analytics/AnalyticsService';
import { eventBus } from '../events/EventBus';

export interface ServiceContainer {
  storage: typeof storageService;
  secureStorage: typeof secureStorageService;
  keychain: typeof keychainService;
  api: typeof apiClient;
  offlineQueue: typeof offlineSyncQueue;
  socket: typeof webSocketManager;
  rtc: typeof webRTCManager;
  biometrics: typeof biometricsService;
  security: typeof securityService;
  analytics: typeof analyticsService;
  events: typeof eventBus;
}

class DIContainer {
  private services: Partial<ServiceContainer> = {};

  public register<K extends keyof ServiceContainer>(key: K, instance: ServiceContainer[K]): void {
    this.services[key] = instance;
  }

  public get<K extends keyof ServiceContainer>(key: K): ServiceContainer[K] {
    const service = this.services[key];
    if (!service) {
      throw new Error(`Service "${key}" not registered in DI Container.`);
    }
    return service;
  }

  public initDefaults(): void {
    this.register('storage', storageService);
    this.register('secureStorage', secureStorageService);
    this.register('keychain', keychainService);
    this.register('api', apiClient);
    this.register('offlineQueue', offlineSyncQueue);
    this.register('socket', webSocketManager);
    this.register('rtc', webRTCManager);
    this.register('biometrics', biometricsService);
    this.register('security', securityService);
    this.register('analytics', analyticsService);
    this.register('events', eventBus);
  }
}

export const container = new DIContainer();
container.initDefaults();
