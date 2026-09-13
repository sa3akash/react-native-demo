Created useDebounce.ts
Created useNetworkStatus.ts
Created useKeyboard.ts
Created useBiometrics.ts
Created usePermissions.ts
Created useAudioRecorder.ts
Created useMediaPicker.ts
Created useOptimisticMutation.ts
Created useSocketEvent.ts
Created useWebRTC.ts
Created useLocalStorage.ts
Created useHaptics.ts
Created useCountdown.ts
Created useUtilityHooks.ts
Created index.ts
Created index.ts
Created Hooks.test.ts
Ran command: `bunx tsc --noEmit`
Edited useNetworkStatus.ts
Edited useUtilityHooks.ts
Ran command: `bunx tsc --noEmit`
Edited useNetworkStatus.ts
Ran command: `bunx tsc --noEmit`
Ran command: `bun test __tests__/CoreServices.test.ts __tests__/StateStores.test.ts __tests__/Hooks.test.ts`
Created Hooks.test.ts
Ran command: `bun test __tests__/CoreServices.test.ts __tests__/StateStores.test.ts __tests__/Hooks.test.ts`
Ran command: `bunx tsc --noEmit`

Here is the complete suite of **enterprise-grade, reusable React Native hooks** implemented in your project under [`src/shared/hooks/`](file:///c:/Users/SHAKIL/Desktop/social/src/shared/hooks/) and barrel-exported via [`src/hooks/index.ts`](file:///c:/Users/SHAKIL/Desktop/social/src/hooks/index.ts).

---

## 🪝 Reusable Hooks Catalog

### 1. Performance & Debouncing
* **[`useDebounce<T>(value, delay)`](file:///c:/Users/SHAKIL/Desktop/social/src/shared/hooks/useDebounce.ts)**: Debounces fast-changing values (e.g. search queries, filter inputs).
* **[`useDebouncedCallback(callback, delay)`](file:///c:/Users/SHAKIL/Desktop/social/src/shared/hooks/useDebounce.ts)**: Creates a debounced callback function (e.g. typing indicators, draft auto-saving).
* **[`useThrottle(callback, limit)`](file:///c:/Users/SHAKIL/Desktop/social/src/shared/hooks/useDebounce.ts)**: Throttles rapid invocations (e.g. scroll events, rapid tap prevention).

```tsx
import { useDebounce, useDebouncedCallback } from '../hooks';

const debouncedSearch = useDebounce(searchQuery, 400);
const notifyTyping = useDebouncedCallback(() => sendTypingStatus(), 300);
```

---

### 2. Network, Lifecycle & Real-Time Sync
* **[`useNetworkStatus()`](file:///c:/Users/SHAKIL/Desktop/social/src/shared/hooks/useNetworkStatus.ts)**: Tracks online/offline status and connects to the offline sync queue.
* **[`useAppState(onForeground, onBackground)`](file:///c:/Users/SHAKIL/Desktop/social/src/shared/hooks/useNetworkStatus.ts)**: Tracks App foreground/background transitions for token refresh, WebSocket reconnection, and biometric lock triggers.
* **[`useSocketEvent(event, handler)`](file:///c:/Users/SHAKIL/Desktop/social/src/shared/hooks/useSocketEvent.ts)**: Subscribes to typed WebSocket events with automatic cleanup on unmount.

```tsx
import { useNetworkStatus, useSocketEvent } from '../hooks';

const { isOnline, isSyncing, queuedMutationsCount, syncNow } = useNetworkStatus();

useSocketEvent('chat:message', (newMsg) => {
  console.log('Incoming message via socket:', newMsg);
});
```

---

### 3. Media & Hardware
* **[`useAudioRecorder()`](file:///c:/Users/SHAKIL/Desktop/social/src/shared/hooks/useAudioRecorder.ts)**: Voice note recorder with real-time waveform spectrum generation, duration tracking, and stop/cancel actions.
* **[`useMediaPicker()`](file:///c:/Users/SHAKIL/Desktop/social/src/shared/hooks/useMediaPicker.ts)**: Pick photos/videos with compression handling and multi-selection support.
* **[`useWebRTC()`](file:///c:/Users/SHAKIL/Desktop/social/src/shared/hooks/useWebRTC.ts)**: 1:1 and group audio/video calling manager with mute, flip camera, background blur, and screen share controls.
* **[`useHaptics()`](file:///c:/Users/SHAKIL/Desktop/social/src/shared/hooks/useHaptics.ts)**: Tactile feedback for reactions, likes, pull-to-refresh, and error states.

```tsx
import { useAudioRecorder, useHaptics, useWebRTC } from '../hooks';

const { isRecording, formattedDuration, waveformData, startRecording, stopRecording } = useAudioRecorder();
const haptics = useHaptics();
const { startCall, toggleMute, toggleCamera, toggleBackgroundBlur } = useWebRTC();

// On like press
haptics.selection();
```

---

### 4. Security & Device Access
* **[`useBiometrics()`](file:///c:/Users/SHAKIL/Desktop/social/src/shared/hooks/useBiometrics.ts)**: Face ID / Touch ID / Fingerprint authentication, lock toggle, and hardware availability checks.
* **[`usePermissions()`](file:///c:/Users/SHAKIL/Desktop/social/src/shared/hooks/usePermissions.ts)**: Camera, microphone, photo library, and notification permission requests with status indicators.
* **[`useKeyboard()`](file:///c:/Users/SHAKIL/Desktop/social/src/shared/hooks/useKeyboard.ts)**: Tracks keyboard visibility, animated height, and provides a dismiss helper.

```tsx
import { useBiometrics, usePermissions, useKeyboard } from '../hooks';

const { isAvailable, biometricType, authenticate } = useBiometrics();
const { hasCameraPermission, requestPermission } = usePermissions();
const { isKeyboardVisible, keyboardHeight, dismissKeyboard } = useKeyboard();
```

---

### 5. Data & Optimistic Updates
* **[`useLocalStorage<T>(key, defaultValue)`](file:///c:/Users/SHAKIL/Desktop/social/src/shared/hooks/useLocalStorage.ts)**: Type-safe reactive storage hook backed by `StorageService` (MMKV & secure store).
* **[`useOptimisticMutation<TData, TVariables>(options)`](file:///c:/Users/SHAKIL/Desktop/social/src/shared/hooks/useOptimisticMutation.ts)**: Generic optimistic mutation hook that applies immediate UI updates with automatic rollback and toast notifications on failure.

```tsx
import { useLocalStorage, useOptimisticMutation } from '../hooks';

const [savedDraft, setSavedDraft, clearDraft] = useLocalStorage('post_draft', '');

const { mutate: reactToPost } = useOptimisticMutation({
  onMutate: (postId) => applyOptimisticReaction(postId),
  mutationFn: (postId) => api.post(`/posts/${postId}/react`),
  onError: (err, rollbackData) => restorePreviousReaction(rollbackData),
});
```

---

### 6. UI & Screen Utilities
* **[`useTheme()`](file:///c:/Users/SHAKIL/Desktop/social/src/theme/ThemeContext.tsx)**: Access active colors, mode (`light`, `dark`, `amoled`, `system`), spacing, typography, and theme changer.
* **[`useToast()`](file:///c:/Users/SHAKIL/Desktop/social/src/shared/components/molecules/Toast.tsx)**: Show animated toast overlays (`success`, `danger`, `warning`, `info`).
* **[`useCountdown(seconds, onFinish)`](file:///c:/Users/SHAKIL/Desktop/social/src/shared/hooks/useCountdown.ts)**: OTP timer, verification cooldowns, and story segment timers.
* **[`useBackHandler(handler)`](file:///c:/Users/SHAKIL/Desktop/social/src/shared/hooks/useUtilityHooks.ts)**: Android hardware back button handler.
* **[`useClipboard()`](file:///c:/Users/SHAKIL/Desktop/social/src/shared/hooks/useUtilityHooks.ts)**: Copy text with instant feedback toast.
* **[`useOrientation()`](file:///c:/Users/SHAKIL/Desktop/social/src/shared/hooks/useUtilityHooks.ts)**: Portrait vs Landscape detection.
* **[`usePrevious<T>(value)`](file:///c:/Users/SHAKIL/Desktop/social/src/shared/hooks/useUtilityHooks.ts)**: Stores and returns the previous state or prop value for diffing.
* **[`useIsMounted()`](file:///c:/Users/SHAKIL/Desktop/social/src/shared/hooks/useUtilityHooks.ts)**: Prevents memory leaks by ensuring async callbacks only execute when the component is mounted.

---

## 🧪 Verification
* **TypeScript Compilation**: `bunx tsc --noEmit` -> **0 errors** (100% strict type safety).
* **Automated Unit Tests**: `bun test` -> **9 passed, 0 failed**.