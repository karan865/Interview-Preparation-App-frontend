import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, LoginCredentials, RegisterPayload, AuthResponse, UpdatePreferencesPayload } from '../types/auth';

const LOCAL_USER_KEY = '@interview_prep_local_user_profile';

export const authApi = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const user: User = {
      _id: `user_${Date.now()}`,
      name: payload.name,
      email: payload.email,
      role: 'user',
      selectedTechnologies: payload.selectedTechnologies || [],
      selectedPreparationLevel: payload.selectedPreparationLevel,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const token = `local_token_${Date.now()}`;
    await AsyncStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
    return { token, user };
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const raw = await AsyncStorage.getItem(LOCAL_USER_KEY);
    let user: User;
    if (raw) {
      user = JSON.parse(raw);
      user.email = credentials.email;
    } else {
      user = {
        _id: `user_${Date.now()}`,
        name: credentials.email.split('@')[0],
        email: credentials.email,
        role: 'user',
        selectedTechnologies: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
    }
    const token = `local_token_${Date.now()}`;
    return { token, user };
  },

  async getMe(): Promise<User> {
    const raw = await AsyncStorage.getItem(LOCAL_USER_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
    const defaultUser: User = {
      _id: 'local_default_user',
      name: 'Interview Candidate',
      email: 'candidate@interview.app',
      role: 'user',
      selectedTechnologies: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(LOCAL_USER_KEY, JSON.stringify(defaultUser));
    return defaultUser;
  },

  async updatePreferences(payload: UpdatePreferencesPayload): Promise<User> {
    const current = await this.getMe();
    const updated: User = {
      ...current,
      selectedTechnologies: payload.selectedTechnologies || current.selectedTechnologies,
      selectedPreparationLevel: payload.selectedPreparationLevel || current.selectedPreparationLevel,
      updatedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(LOCAL_USER_KEY, JSON.stringify(updated));
    return updated;
  },
};
