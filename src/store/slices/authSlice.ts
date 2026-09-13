import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, LoginCredentials, RegisterPayload } from '../../types/auth';
import { authApi } from '../../api/auth.api';
import { storage } from '../../utils/storage';
import { parseErrorMessage } from '../../utils/error';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isGuest: true,
  isLoading: false,
  error: null,
};

export const bootstrapAuth = createAsyncThunk('auth/bootstrap', async (_, { rejectWithValue }) => {
  try {
    const savedToken = await storage.getAuthToken();
    // Clear out any legacy dev tokens if they were previously persisted
    if (savedToken === 'dev-bypass-token') {
      await storage.clearAuthToken();
      return { token: null, user: null };
    }

    if (savedToken) {
      try {
        const profile = await authApi.getMe();
        return { token: savedToken, user: profile };
      } catch {
        await storage.clearAuthToken();
        return { token: null, user: null };
      }
    }
    return { token: null, user: null };
  } catch (err) {
    return rejectWithValue(parseErrorMessage(err));
  }
});

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      await storage.setAuthToken(response.token);
      return response;
    } catch (err) {
      return rejectWithValue(parseErrorMessage(err));
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const response = await authApi.register(payload);
      await storage.setAuthToken(response.token);
      return response;
    } catch (err) {
      return rejectWithValue(parseErrorMessage(err));
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await storage.clearAuthToken();
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Bootstrap
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = Boolean(action.payload.token && action.payload.user);
        state.isGuest = !state.isAuthenticated;
        state.isLoading = false;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isGuest = false;
        state.isLoading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isGuest = false;
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isGuest = true;
        state.error = null;
      });
  },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
