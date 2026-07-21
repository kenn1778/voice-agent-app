import * as Keychain from 'react-native-keychain';

export type StoredTokens = {
  idToken: string;
  accessToken: string;
  refreshToken: string;
};

export async function storeTokens(tokens: StoredTokens): Promise<void> {
  await Keychain.setGenericPassword(
    'cognito_tokens',
    JSON.stringify(tokens),
    { service: 'com.voiceagent.cognito', accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE },
  );
}

export async function getTokens(): Promise<StoredTokens | null> {
  const credentials = await Keychain.getGenericPassword({ service: 'com.voiceagent.cognito' });
  if (!credentials) return null;
  return JSON.parse(credentials.password) as StoredTokens;
}

export async function clearTokens(): Promise<void> {
  await Keychain.resetGenericPassword({ service: 'com.voiceagent.cognito' });
}

export async function getBiometricType(): Promise<string | null> {
  const biometry = await Keychain.getSupportedBiometryType();
  return biometry;
}
