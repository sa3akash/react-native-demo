import { storageService, secureStorageService } from '../src/core/storage/StorageService';
import { eventBus } from '../src/core/events/EventBus';
import { container } from '../src/core/di/Container';
import { APP_CONFIG } from '../src/core/config/appConfig';

describe('Core Services & DI Container', () => {
  beforeEach(() => {
    storageService.clear();
    eventBus.clearAll();
  });

  test('StorageService persists and retrieves typed objects', () => {
    const user = { id: 'usr_1', name: 'Alex Rivera' };
    storageService.setItem('user_session', user);

    const retrieved = storageService.getItem<{ id: string; name: string }>('user_session');
    expect(retrieved).toEqual(user);
  });

  test('DI Container correctly resolves registered singletons', () => {
    const resolvedStorage = container.get('storage');
    expect(resolvedStorage).toBe(storageService);

    const resolvedApi = container.get('api');
    expect(resolvedApi).toBeDefined();

    const resolvedKeychain = container.get('keychain');
    expect(resolvedKeychain).toBeDefined();
  });

  test('EventBus publishes and receives strongly-typed events', () => {
    let receivedPayload: any = null;

    const unsubscribe = eventBus.on('NOTIFICATION:BADGE_UPDATED', (payload) => {
      receivedPayload = payload;
    });

    eventBus.emit('NOTIFICATION:BADGE_UPDATED', { unreadCount: 5 });
    expect(receivedPayload).toEqual({ unreadCount: 5 });

    unsubscribe();
    eventBus.emit('NOTIFICATION:BADGE_UPDATED', { unreadCount: 10 });
    expect(receivedPayload).toEqual({ unreadCount: 5 }); // Should not update after unsubscribe
  });

  test('App configuration contains valid enterprise settings and feature flags', () => {
    expect(APP_CONFIG.features.enableReels).toBe(true);
    expect(APP_CONFIG.features.enableWebRTCCalling).toBe(true);
    expect(APP_CONFIG.limits.postCharacterLimit).toBeGreaterThan(0);
  });
});
