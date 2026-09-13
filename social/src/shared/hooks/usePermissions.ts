import { useState, useCallback, useEffect } from 'react';
import { PermissionsAndroid, Platform, Permission } from 'react-native';

export type AppPermission =
  | 'camera'
  | 'microphone'
  | 'photoLibrary'
  | 'location'
  | 'notifications';

export type PermissionStatus = 'granted' | 'denied' | 'never_ask_again' | 'unavailable';

const ANDROID_PERMISSION_MAP: Record<AppPermission, Permission | null> = {
  camera: PermissionsAndroid.PERMISSIONS.CAMERA,
  microphone: PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  photoLibrary:
    Platform.Version && Number(Platform.Version) >= 33
      ? (PermissionsAndroid.PERMISSIONS as any).READ_MEDIA_IMAGES || PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  location: PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  notifications:
    Platform.Version && Number(Platform.Version) >= 33
      ? (PermissionsAndroid.PERMISSIONS as any).POST_NOTIFICATIONS
      : null,
};

export function usePermissions() {
  const [permissions, setPermissions] = useState<Record<AppPermission, PermissionStatus>>({
    camera: 'granted',
    microphone: 'granted',
    photoLibrary: 'granted',
    location: 'granted',
    notifications: 'granted',
  });

  const checkPermission = useCallback(async (permission: AppPermission): Promise<PermissionStatus> => {
    if (Platform.OS === 'android') {
      const androidPerm = ANDROID_PERMISSION_MAP[permission];
      if (!androidPerm) return 'granted';

      try {
        const hasPermission = await PermissionsAndroid.check(androidPerm);
        const status: PermissionStatus = hasPermission ? 'granted' : 'denied';
        setPermissions((prev) => ({ ...prev, [permission]: status }));
        return status;
      } catch (err) {
        console.warn(`[usePermissions] Check failed for ${permission}:`, err);
        return 'denied';
      }
    } else {
      // iOS permission state
      return permissions[permission] || 'granted';
    }
  }, [permissions]);

  const requestPermission = useCallback(
    async (
      permission: AppPermission,
      rationale?: { title: string; message: string; buttonPositive?: string }
    ): Promise<PermissionStatus> => {
      if (Platform.OS === 'android') {
        const androidPerm = ANDROID_PERMISSION_MAP[permission];
        if (!androidPerm) return 'granted';

        try {
          const result = await PermissionsAndroid.request(
            androidPerm,
            rationale
              ? {
                  title: rationale.title,
                  message: rationale.message,
                  buttonPositive: rationale.buttonPositive || 'Allow',
                }
              : undefined
          );

          let status: PermissionStatus = 'denied';
          if (result === PermissionsAndroid.RESULTS.GRANTED) {
            status = 'granted';
          } else if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            status = 'never_ask_again';
          }

          setPermissions((prev) => ({ ...prev, [permission]: status }));
          return status;
        } catch (err) {
          console.warn(`[usePermissions] Request failed for ${permission}:`, err);
          return 'denied';
        }
      } else {
        // iOS request handling
        const status: PermissionStatus = 'granted';
        setPermissions((prev) => ({ ...prev, [permission]: status }));
        return status;
      }
    },
    []
  );

  const requestMultiple = useCallback(
    async (permissionList: AppPermission[]): Promise<Record<AppPermission, PermissionStatus>> => {
      if (Platform.OS === 'android') {
        const androidPerms = permissionList
          .map((p) => ANDROID_PERMISSION_MAP[p])
          .filter(Boolean) as Permission[];

        if (androidPerms.length === 0) {
          return permissions;
        }

        try {
          const results = await PermissionsAndroid.requestMultiple(androidPerms);
          const updated: Record<AppPermission, PermissionStatus> = { ...permissions };

          permissionList.forEach((p) => {
            const permKey = ANDROID_PERMISSION_MAP[p];
            if (permKey && results[permKey]) {
              const res = results[permKey];
              updated[p] =
                res === PermissionsAndroid.RESULTS.GRANTED
                  ? 'granted'
                  : res === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
                  ? 'never_ask_again'
                  : 'denied';
            }
          });

          setPermissions(updated);
          return updated;
        } catch (err) {
          console.warn('[usePermissions] Multiple request failed:', err);
          return permissions;
        }
      } else {
        return permissions;
      }
    },
    [permissions]
  );

  return {
    permissions,
    checkPermission,
    requestPermission,
    requestMultiple,
    hasCamera: permissions.camera === 'granted',
    hasMicrophone: permissions.microphone === 'granted',
    hasPhotoLibrary: permissions.photoLibrary === 'granted',
    hasLocation: permissions.location === 'granted',
    hasNotifications: permissions.notifications === 'granted',
  };
}
