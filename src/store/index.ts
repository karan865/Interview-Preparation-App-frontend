import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import progressReducer from './slices/progressSlice';
import examReducer from './slices/examSlice';
import dailyChallengeReducer from './slices/dailyChallengeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    progress: progressReducer,
    exam: examReducer,
    dailyChallenge: dailyChallengeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
