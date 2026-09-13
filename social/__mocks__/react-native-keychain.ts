const credentialsMap = new Map<string, { username: string; password: string }>();

export const ACCESSIBLE = {
  WHEN_UNLOCKED: 'AccessibleWhenUnlocked',
  WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'AccessibleWhenUnlockedThisDeviceOnly',
};

export const ACCESS_CONTROL = {
  BIOMETRY_ANY_OR_DEVICE_PASSCODE: 'BiometryAnyOrDevicePasscode',
};

export const SECURITY_LEVEL = {
  SECURE_HARDWARE: 'SECURE_HARDWARE',
};

export const setGenericPassword = jest.fn(async (username: string, password: string, options?: any) => {
  const service = options?.service || 'default';
  credentialsMap.set(service, { username, password });
  return { service, storage: 'keychain' };
});

export const getGenericPassword = jest.fn(async (options?: any) => {
  const service = options?.service || 'default';
  const creds = credentialsMap.get(service);
  if (creds) {
    return { service, username: creds.username, password: creds.password };
  }
  return false;
});

export const resetGenericPassword = jest.fn(async (options?: any) => {
  const service = options?.service || 'default';
  credentialsMap.delete(service);
  return true;
});

export const getSupportedBiometryType = jest.fn(async () => 'TouchID');
