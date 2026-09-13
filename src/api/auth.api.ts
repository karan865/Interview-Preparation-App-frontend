import { apiClient } from './client';
import { ApiResponse } from '../types/api';
import { User, LoginCredentials, RegisterPayload, AuthResponse, UpdatePreferencesPayload } from '../types/auth';

export const authApi = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', payload, {
      skipAuth: true,
    });
    return res.data;
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials, {
      skipAuth: true,
    });
    return res.data;
  },

  async getMe(): Promise<User> {
    const res = await apiClient.get<ApiResponse<User>>('/auth/me');
    return res.data;
  },

  async updatePreferences(payload: UpdatePreferencesPayload): Promise<User> {
    const res = await apiClient.put<ApiResponse<User>>('/auth/preferences', payload);
    return res.data;
  },
};
