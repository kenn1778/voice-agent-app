jest.mock('react-native-keychain', () => {
  const store: { password?: string } = {};
  return {
    setGenericPassword: jest.fn(async (_user: string, password: string) => {
      store.password = password;
      return true;
    }),
    getGenericPassword: jest.fn(async () => {
      if (!store.password) return false;
      return { password: store.password };
    }),
    resetGenericPassword: jest.fn(async () => {
      store.password = undefined;
      return true;
    }),
    getSupportedBiometryType: jest.fn().mockResolvedValue('FaceID'),
    ACCESS_CONTROL: {
      BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE: 'BiometryCurrentSetOrDevicePasscode',
    },
  };
});

import { storeTokens, getTokens, clearTokens } from '../src/auth/tokenStorage';

describe('tokenStorage', () => {
  it('stores and retrieves tokens', async () => {
    const tokens = { idToken: 'id1', accessToken: 'acc1', refreshToken: 'ref1' };
    await storeTokens(tokens);
    const retrieved = await getTokens();
    expect(retrieved).toEqual(tokens);
  });

  it('returns null when no tokens stored', async () => {
    await clearTokens();
    const retrieved = await getTokens();
    expect(retrieved).toBeNull();
  });
});
