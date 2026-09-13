import { Technology } from './technology';
import { PreparationLevel } from './topic';

export type UserRole = 'user' | 'admin';

export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  selectedTechnologies?: (string | Technology)[];
  selectedPreparationLevel?: string | PreparationLevel | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  selectedTechnologies?: string[];
  selectedPreparationLevel?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface UpdatePreferencesPayload {
  selectedTechnologies?: string[];
  selectedPreparationLevel?: string | null;
}
