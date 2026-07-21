import { useState, useCallback } from 'react';
import { Platform, PermissionsAndroid, Alert, Linking } from 'react-native';

export function useMicrophonePermission() {
  const [hasPermission, setHasPermission] = useState(false);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, {
        title: 'Microphone Permission',
        message: 'Voice Agent needs access to your microphone to record voice conversations.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Deny',
        buttonPositive: 'Allow',
      });
      const allowed = granted === PermissionsAndroid.RESULTS.GRANTED;
      setHasPermission(allowed);
      if (!allowed) {
        Alert.alert('Microphone Required', 'Please enable microphone access in Settings to use voice features.', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]);
      }
      return allowed;
    }
    setHasPermission(true);
    return true;
  }, []);

  return { hasPermission, requestPermission };
}
