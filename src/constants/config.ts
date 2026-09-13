import { Platform, NativeModules } from 'react-native';
import Constants from 'expo-constants';

const LIVE_BACKEND_URL = 'https://interview-preparation-app-w3l5.onrender.com/api';

/**
 * Extracts candidate API base URLs in order of priority:
 * 1. Explicit EXPO_PUBLIC_API_URL or VITE_API_URL environment variable
 * 2. Default Live Cloud Backend (Render)
 * 3. Metro packager script URL hostname (where JS bundle actually loaded from)
 * 4. Expo Constants hostUri / debuggerHost
 * 5. Current Workstation LAN IP (192.168.0.105)
 * 6. Localhost (works on iOS, Web, and Android over USB via adb reverse)
 * 7. Android Emulator alias (10.0.2.2)
 */
export const getCandidateApiUrls = (): string[] => {
  const candidates: string[] = [];

  // 1. Explicit environment variable (Expo or Vite)
  const envUrl = process.env.EXPO_PUBLIC_API_URL || (process.env as any).VITE_API_URL;
  if (envUrl) {
    candidates.push(envUrl.replace(/\/$/, ''));
  } else {
    candidates.push(LIVE_BACKEND_URL);
  }

  // 2. Host from React Native SourceCode scriptURL
  const scriptURL: string | undefined = NativeModules?.SourceCode?.scriptURL;
  if (scriptURL) {
    const match = scriptURL.match(/^https?:\/\/([^:/]+)/);
    if (match && match[1] && match[1] !== 'localhost' && match[1] !== '127.0.0.1') {
      candidates.push(`http://${match[1]}:5000/api`);
    }
  }

  // 3. Expo Go / Metro hostUri
  const hostUri =
    Constants.expoConfig?.hostUri ||
    (Constants as any).manifest2?.extra?.expoGo?.debuggerHost ||
    (Constants as any).manifest?.debuggerHost;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
      candidates.push(`http://${ip}:5000/api`);
    }
  }

  // 4. Known development LAN IP
  candidates.push('http://192.168.0.105:5000/api');

  // 5. Localhost (reaches host if adb reverse tcp:5000 tcp:5000 is active, or iOS/Web)
  candidates.push('http://localhost:5000/api');
  candidates.push('http://127.0.0.1:5000/api');

  // 6. Android emulator loopback alias (only for emulators)
  if (Platform.OS === 'android') {
    candidates.push('http://10.0.2.2:5000/api');
  }

  // Deduplicate preserving order
  return candidates.filter((item, index) => candidates.indexOf(item) === index);
};

export const CONFIG = {
  API_BASE_URL:
    process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') ||
    (process.env as any).VITE_API_URL?.replace(/\/$/, '') ||
    LIVE_BACKEND_URL,
  REQUEST_TIMEOUT_MS: 20000,
  STORAGE_KEYS: {
    AUTH_TOKEN: 'dev_interview_auth_token',
    USER_PREFERENCES: 'dev_interview_user_preferences',
  },
} as const;
