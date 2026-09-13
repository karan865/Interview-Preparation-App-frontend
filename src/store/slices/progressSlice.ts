import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  progressStorage,
  LocalQuestionProgress,
  ProgressStats,
  LastOpenedQuestion,
} from '../../services/progressStorage';
import { MasteryStatus } from '../../types/progress';

export interface ProgressState {
  progressMap: Record<string, LocalQuestionProgress>;
  savedIds: string[];
  recentlyViewedIds: string[];
  lastOpenedQuestion: LastOpenedQuestion | null;
  stats: ProgressStats;
  isInitialized: boolean;
}

const initialState: ProgressState = {
  progressMap: {},
  savedIds: [],
  recentlyViewedIds: [],
  lastOpenedQuestion: null,
  stats: {
    totalReviewed: 0,
    knownCount: 0,
    reviewCount: 0,
    weakCount: 0,
  },
  isInitialized: false,
};

export const loadProgressState = createAsyncThunk('progress/load', async () => {
  await progressStorage.init();
  const [stats, savedIds, recentlyViewedIds, allProgress, lastOpened] = await Promise.all([
    progressStorage.getProgressStats(),
    progressStorage.getSavedQuestionIds(),
    progressStorage.getRecentlyViewedIds(10),
    progressStorage.getAllProgress(),
    progressStorage.getLastOpened(),
  ]);

  return {
    stats,
    savedIds,
    recentlyViewedIds,
    progressMap: allProgress,
    lastOpenedQuestion: lastOpened,
  };
});

export const updateQuestionProgress = createAsyncThunk(
  'progress/updateStatus',
  async ({ questionId, status }: { questionId: string; status: MasteryStatus }) => {
    const updated = await progressStorage.setProgress(questionId, status);
    const stats = await progressStorage.getProgressStats();
    return { questionId, progress: updated, stats };
  }
);

export const toggleSaveQuestion = createAsyncThunk(
  'progress/toggleSave',
  async (questionId: string) => {
    const isSaved = await progressStorage.toggleSaveQuestion(questionId);
    const savedIds = await progressStorage.getSavedQuestionIds();
    return { questionId, isSaved, savedIds };
  }
);

export const recordQuestionView = createAsyncThunk(
  'progress/recordView',
  async (questionId: string) => {
    await progressStorage.recordRecentlyViewed(questionId);
    const recentlyViewedIds = await progressStorage.getRecentlyViewedIds(10);
    return recentlyViewedIds;
  }
);

export const recordLastOpenedQuestion = createAsyncThunk(
  'progress/recordLastOpened',
  async (meta: LastOpenedQuestion) => {
    await progressStorage.recordLastOpened(meta);
    return meta;
  }
);

export const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Load
      .addCase(loadProgressState.fulfilled, (state, action) => {
        state.stats = action.payload.stats;
        state.savedIds = action.payload.savedIds;
        state.recentlyViewedIds = action.payload.recentlyViewedIds;
        state.lastOpenedQuestion = action.payload.lastOpenedQuestion;
        state.progressMap = action.payload.progressMap;
        state.isInitialized = true;
      })
      // Update status
      .addCase(updateQuestionProgress.fulfilled, (state, action) => {
        state.progressMap[action.payload.questionId] = action.payload.progress;
        state.stats = action.payload.stats;
      })
      // Toggle save
      .addCase(toggleSaveQuestion.fulfilled, (state, action) => {
        state.savedIds = action.payload.savedIds;
      })
      // Record view
      .addCase(recordQuestionView.fulfilled, (state, action) => {
        state.recentlyViewedIds = action.payload;
      })
      // Record last opened
      .addCase(recordLastOpenedQuestion.fulfilled, (state, action) => {
        state.lastOpenedQuestion = action.payload;
      });
  },
});

export default progressSlice.reducer;
