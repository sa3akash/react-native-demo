Viewed useWebRTC.ts:1-67
Created useWebRTC.ts
Created useWebSocket.ts
Created useRealtimeChat.ts
Created useRealtimePresence.ts
Created useRealtimeFeed.ts
Created useRealtimeCalls.ts
Created index.ts
Created RealtimeAndForms.test.ts
Ran command: `bunx tsc --noEmit`
Viewed useChatStore.ts:1-60
Created useRealtimeChat.ts
Ran command: `bunx tsc --noEmit`
Ran command: `bun run test`
Created walkthrough.md

We have unified all **Realtime Subsystems** (WebRTC, WebSocket, Chat, Presence, Feed Reactions, and Push Notifications) into a suite of **reusable, production-grade custom React hooks** under [`src/shared/hooks/`](file:///c:/Users/SHAKIL/Desktop/social/src/shared/hooks/) and exported through [`src/hooks/index.ts`](file:///c:/Users/SHAKIL/Desktop/social/src/hooks/index.ts).

---

## ⚡ Realtime Hooks Catalog

### 1. [`useWebRTC()`](file:///c:/Users/SHAKIL/Desktop/social/src/shared/hooks/useWebRTC.ts) (Audio, Video & Screen Share)
Provides full access to native WebRTC hardware media streams, track toggling, duration formatting, and P2P connection lifecycle:
* **Properties**: `session`, `isInCall`, `isConnected`, `isCalling`, `isRinging`, `localStream`, `remoteStream`, `durationSeconds`, `formattedDuration` (`"04:25"`), `isMuted`, `isCameraOff`, `isFrontCamera`, `isScreenSharing`, `isBackgroundBlur`.
* **Methods**: `startCall()`, `answerCall()`, `toggleMute()`, `toggleCamera()`, `flipCamera()`, `toggleBackgroundBlur()`, `toggleScreenSharing()`, `endCall()`.

```tsx
import { useWebRTC } from '../hooks';

function CallView() {
  const { 
    session, isConnected, localStream, remoteStream, formattedDuration,
    startCall, answerCall, toggleMute, toggleCamera, flipCamera, toggleScreenSharing, endCall 
  } = useWebRTC();
}
```

---

### 2. [`useRealtimeChat(conversationId)`](file:///c:/Users/SHAKIL/Desktop/social/src/shared/hooks/useRealtimeChat.ts) (Live Messaging & Typing)
Bi-directional real-time message stream with optimistic store synchronization and typing indicator debouncing:
* **Properties**: `messages`, `typingUsers`, `isTyping`, `typingIndicatorText`.
* **Methods**: `sendMessage(content, type, mediaUrl, voiceDuration)`, `sendTypingStatus(isTyping)`, `markAsRead()`.

```tsx
import { useRealtimeChat } from '../hooks';

function ChatRoom({ conversationId }) {
  const { 
    messages, isTyping, typingIndicatorText, 
    sendMessage, sendTypingStatus, markAsRead 
  } = useRealtimeChat(conversationId);

  // Send message over WebSocket + optimistic local store
  const onSend = () => sendMessage('Hey Sarah! Check out our new WebRTC stream!');
}
```

---

### 3. [`useRealtimePresence(userIds)`](file:///c:/Users/SHAKIL/Desktop/social/src/shared/hooks/useRealtimePresence.ts) (Online / Offline Status)
Subscribes to live presence updates, heartbeat signals, and returns user status:
* **Methods**: `isUserOnline(userId)`, `getLastActiveText(userId)` (`"Online"`, `"Active 5m ago"`), `presenceMap`.

```tsx
import { useRealtimePresence } from '../hooks';

function UserStatusBadge({ userId }) {
  const { isUserOnline, getLastActiveText } = useRealtimePresence([userId]);

  return (
    <Text>{isUserOnline(userId) ? '🟢 Online' : getLastActiveText(userId)}</Text>
  );
}
```

---

### 4. [`useRealtimeFeed(postId, streamId)`](file:///c:/Users/SHAKIL/Desktop/social/src/shared/hooks/useRealtimeFeed.ts) (Live Tickers & Gifts)
Listens to live post reaction bursts, live stream viewer counts, and animated gift events:
* **Properties**: `recentReactions`, `liveViewerCount`, `activeGifts`.
* **Methods**: `sendLiveGift({ icon: '💎', name: 'Diamond Sparkle' })`.

```tsx
import { useRealtimeFeed } from '../hooks';

function LiveStreamView({ streamId }) {
  const { liveViewerCount, activeGifts, sendLiveGift } = useRealtimeFeed(undefined, streamId);
}
```

---

### 5. [`useRealtimeCalls()`](file:///c:/Users/SHAKIL/Desktop/social/src/shared/hooks/useRealtimeCalls.ts) (Incoming Call Alerts)
Global call listener that catches incoming rings and triggers accept/decline popups across the entire app:
* **Properties**: `incomingCall`, `hasIncomingCall`.
* **Methods**: `acceptCall()`, `declineCall()`, `initiateCall(participant, isVideo)`.

---

### 6. [`useWebSocket()`](file:///c:/Users/SHAKIL/Desktop/social/src/shared/hooks/useWebSocket.ts) & [`usePushNotifications()`](file:///c:/Users/SHAKIL/Desktop/social/src/shared/hooks/usePushNotifications.ts)
* **`useWebSocket`**: Connection status, channel subscriptions, and raw message sending.
* **`usePushNotifications`**: Device FCM/APNs token registration, permission checks, and background tap routing.

---

## 🧪 Verification
* **TypeScript Compiler (`bunx tsc --noEmit`)**: **0 errors** (100% strict type safety).
* **Test Suite (`bun run test`)**: **6 passed, 6 total (18 unit tests passed)** in 2.65s.