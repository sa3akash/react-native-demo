import { webSocketManager } from '../src/core/realtime/WebSocketManager';
import { webRTCManager } from '../src/core/realtime/WebRTCManager';
import { pushNotificationManager } from '../src/core/realtime/PushNotificationManager';
import { useWebSocket } from '../src/shared/hooks/useWebSocket';
import { useRealtimePresence } from '../src/shared/hooks/useRealtimePresence';
import { useRealtimeFeed } from '../src/shared/hooks/useRealtimeFeed';
import { useRealtimeCalls } from '../src/shared/hooks/useRealtimeCalls';
import {
  loginSchema,
  registerSchema,
  createPostSchema,
  createPollSchema,
} from '../src/shared/validation/schemas';

describe('Realtime & Form Validation Suite', () => {
  test('WebSocketManager connects and handles subscriptions', () => {
    let received = false;
    const unsub = webSocketManager.subscribe('chat:test', () => {
      received = true;
    });

    webSocketManager.publish('chat:test', { test: true });
    expect(received).toBe(true);

    unsub();
  });

  test('WebRTCManager creates and toggles call sessions', async () => {
    const session = await webRTCManager.startCall({
      participant: { userId: 'usr_1', userName: 'Sarah Jenkins', avatarUrl: '' },
      isVideo: true,
    });

    expect(session.callId).toBeDefined();
    expect(session.status).toBe('calling');
    expect(webRTCManager.toggleMute()).toBe(true);
    expect(webRTCManager.toggleCamera()).toBe(true);

    webRTCManager.endCall();
    expect(webRTCManager.getSession()?.status).toBe('ended');
  });

  test('PushNotificationManager registers token and dispatches notifications', async () => {
    const token = await pushNotificationManager.registerForPushNotifications();
    expect(token).toMatch(/^fcm_tok_/);

    let receivedNotif: any = null;
    const unsub = pushNotificationManager.subscribe((n) => {
      receivedNotif = n;
    });

    pushNotificationManager.handleIncomingNotification({
      id: 'notif_1',
      title: 'New Message',
      body: 'Alex sent you a message',
      category: 'message',
      timestamp: Date.now(),
    });

    expect(receivedNotif).toBeDefined();
    expect(receivedNotif.id).toBe('notif_1');
    unsub();
  });

  test('Realtime hooks are valid exportable hook functions', () => {
    expect(typeof useWebSocket).toBe('function');
    expect(typeof useRealtimePresence).toBe('function');
    expect(typeof useRealtimeFeed).toBe('function');
    expect(typeof useRealtimeCalls).toBe('function');
  });

  test('Zod Schemas correctly validate and reject invalid inputs', () => {
    // Valid login
    const validLogin = loginSchema.safeParse({
      emailOrUsername: 'alex.rivera@metaverse.io',
      password: 'Password123',
      rememberMe: true,
    });
    expect(validLogin.success).toBe(true);

    // Invalid login (missing uppercase & number)
    const invalidLogin = loginSchema.safeParse({
      emailOrUsername: 'al',
      password: 'password',
    });
    expect(invalidLogin.success).toBe(false);

    // Valid Post
    const validPost = createPostSchema.safeParse({
      content: 'Hello World from SocialSphere!',
      privacy: 'public',
    });
    expect(validPost.success).toBe(true);

    // Invalid Poll (less than 2 options)
    const invalidPoll = createPollSchema.safeParse({
      question: 'Short?',
      options: [{ text: 'Single Option' }],
    });
    expect(invalidPoll.success).toBe(false);
  });
});
