import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  DailyChallengeSettings,
  DailyChallengeState,
  DailyStreakData,
  DailyHistoryEntry,
  DailyTestAttempt,
  DailyChallengeStatus,
} from '../../types/dailyChallenge';
import {
  dailyChallengeStorage,
  DEFAULT_DAILY_SETTINGS,
  DEFAULT_DAILY_STREAK,
} from '../../utils/dailyChallengeStorage';
import {
  getLocalDateString,
  computeUpdatedStreak,
} from '../../utils/dailyDateUtils';
import { dailyChallengeApi } from '../../api/dailyChallenge.api';
import { ExamReviewItem } from '../../types/exam';

interface DailyChallengeSliceState {
  settings: DailyChallengeSettings;
  todayState: DailyChallengeState | null;
  streak: DailyStreakData;
  history: DailyHistoryEntry[];
  loading: boolean;
  refreshing: boolean;
  submittingTest: boolean;
  retryingTest: boolean;
  error: string | null;
}

const initialState: DailyChallengeSliceState = {
  settings: DEFAULT_DAILY_SETTINGS,
  todayState: null,
  streak: DEFAULT_DAILY_STREAK,
  history: [],
  loading: false,
  refreshing: false,
  submittingTest: false,
  retryingTest: false,
  error: null,
};

/**
 * Thunk to initialize today's daily challenge.
 * Restores today's state if already exists; otherwise generates a fresh challenge for today's date.
 */
export const initDailyChallenge = createAsyncThunk(
  'dailyChallenge/init',
  async (forceRefresh: boolean = false, { getState, rejectWithValue }) => {
    try {
      const todayStr = getLocalDateString();
      const settings = await dailyChallengeStorage.loadSettings();
      const streak = await dailyChallengeStorage.loadStreak();
      const history = await dailyChallengeStorage.loadHistory();

      if (!forceRefresh) {
        const cachedState = await dailyChallengeStorage.loadTodayState();
        if (cachedState && cachedState.date === todayStr) {
          return {
            settings,
            streak,
            history,
            todayState: cachedState,
          };
        }
      }

      // Generate new challenge for today
      const apiRes = await dailyChallengeApi.getDailyChallenge({
        technologies: settings.technologyIds,
        learningCount: settings.learningQuestionCount,
        testCount: settings.testQuestionCount,
      });

      const dayNumber = Math.max(1, history.length + (history.some((h) => h.date === todayStr) ? 0 : 1));

      const newState: DailyChallengeState = {
        date: todayStr,
        dayNumber,
        status: 'NOT_STARTED',
        settingsSnapshot: settings,
        selectedTechSlugs: apiRes.technologies.map((t) => t.slug),
        selectedTechNames: apiRes.technologies.map((t) => t.name),
        learningQuestions: apiRes.learningQuestions,
        learnedQuestionIds: [],
        practiceAnswers: {},
        testQuestions: apiRes.testQuestions,
        currentAttempt: null,
        attempts: [],
        bestScore: 0,
        completed: false,
        completedAt: null,
      };

      await dailyChallengeStorage.saveTodayState(newState);

      return {
        settings,
        streak,
        history,
        todayState: newState,
      };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to initialize daily challenge');
    }
  }
);

/**
 * Thunk to update settings.
 * Persists immediately and applies to future daily challenges.
 */
export const saveDailyChallengeSettings = createAsyncThunk(
  'dailyChallenge/saveSettings',
  async (newSettings: DailyChallengeSettings) => {
    await dailyChallengeStorage.saveSettings(newSettings);
    return newSettings;
  }
);

/**
 * Thunk to submit today's daily test.
 * Evaluates correctness, updates attempt history, completion status, streak, and history.
 */
export const submitDailyTest = createAsyncThunk(
  'dailyChallenge/submitTest',
  async (answers: Record<string, string>, { getState, rejectWithValue }) => {
    try {
      const state = (getState() as any).dailyChallenge as DailyChallengeSliceState;
      const todayState = state.todayState;
      if (!todayState) {
        throw new Error('No active daily challenge');
      }

      const reviewItems: ExamReviewItem[] = todayState.testQuestions.map((q, idx) => {
        const selected = answers[q._id] || '';
        const isCorrect = selected === q.correctOption;
        return {
          questionId: q._id,
          questionIndex: idx + 1,
          question: q.question,
          options: q.options,
          selectedOption: selected,
          correctOption: q.correctOption || 'A',
          isCorrect,
          explanation: q.explanation || '',
          technologyName: q.technologyName,
          topicName: q.topicName,
          difficulty: q.difficulty as any,
        };
      });

      const score = reviewItems.filter((r) => r.isCorrect).length;
      const totalQuestions = todayState.testQuestions.length;
      const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
      const passed = percentage >= todayState.settingsSnapshot.passingScore;

      const attemptNumber = todayState.attempts.length + 1;
      const newAttempt: DailyTestAttempt = {
        attemptNumber,
        answers,
        score,
        totalQuestions,
        percentage,
        passed,
        submittedAt: new Date().toISOString(),
        reviewItems,
      };

      const updatedAttempts = [...todayState.attempts, newAttempt];
      const updatedBestScore = Math.max(todayState.bestScore, percentage);
      const isNewlyCompleted = passed && !todayState.completed;

      let updatedStreak = state.streak;
      if (passed) {
        updatedStreak = computeUpdatedStreak(
          state.streak.lastCompletedDate,
          todayState.date,
          state.streak.currentStreak,
          state.streak.longestStreak
        );
        await dailyChallengeStorage.saveStreak(updatedStreak);
      }

      const updatedState: DailyChallengeState = {
        ...todayState,
        status: passed ? 'PASSED' : 'FAILED',
        currentAttempt: newAttempt,
        attempts: updatedAttempts,
        bestScore: updatedBestScore,
        completed: todayState.completed || passed,
        completedAt: isNewlyCompleted ? new Date().toISOString() : todayState.completedAt,
      };

      await dailyChallengeStorage.saveTodayState(updatedState);

      // Append / update local history entry
      const historyEntry: DailyHistoryEntry = {
        date: todayState.date,
        completed: updatedState.completed,
        bestScore: updatedBestScore,
        totalQuestions,
        passingScore: todayState.settingsSnapshot.passingScore,
        attemptsCount: updatedAttempts.length,
        technologies: todayState.selectedTechNames,
      };
      await dailyChallengeStorage.appendHistory(historyEntry);
      const updatedHistory = await dailyChallengeStorage.loadHistory();

      return {
        todayState: updatedState,
        streak: updatedStreak,
        history: updatedHistory,
      };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to submit daily test');
    }
  }
);

/**
 * Thunk to retry today's test.
 * Pulls a fresh set of MCQs excluding previously tested questions when possible.
 */
export const retryDailyTest = createAsyncThunk(
  'dailyChallenge/retryTest',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = (getState() as any).dailyChallenge as DailyChallengeSliceState;
      const todayState = state.todayState;
      if (!todayState) {
        throw new Error('No active daily challenge');
      }

      const usedIds = todayState.testQuestions.map((q) => q._id);

      const retryRes = await dailyChallengeApi.getRetryTest({
        technologies: todayState.selectedTechSlugs,
        count: todayState.settingsSnapshot.testQuestionCount,
        excludeIds: usedIds,
      });

      const updatedState: DailyChallengeState = {
        ...todayState,
        status: 'TESTING',
        testQuestions: retryRes.testQuestions,
      };

      await dailyChallengeStorage.saveTodayState(updatedState);

      return updatedState;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to generate retry test questions');
    }
  }
);

export const dailyChallengeSlice = createSlice({
  name: 'dailyChallenge',
  initialState,
  reducers: {
    markQuestionLearned(state, action: PayloadAction<string>) {
      if (!state.todayState) return;
      const qId = action.payload;
      if (!state.todayState.learnedQuestionIds.includes(qId)) {
        state.todayState.learnedQuestionIds.push(qId);
      }
      if (state.todayState.status === 'NOT_STARTED') {
        state.todayState.status = 'LEARNING';
      }
      dailyChallengeStorage.saveTodayState(state.todayState);
    },

    setPracticeAnswer(
      state,
      action: PayloadAction<{ questionId: string; selectedOption: string }>
    ) {
      if (!state.todayState) return;
      const { questionId, selectedOption } = action.payload;
      state.todayState.practiceAnswers[questionId] = selectedOption;
      if (['NOT_STARTED', 'LEARNING'].includes(state.todayState.status)) {
        state.todayState.status = 'PRACTICE';
      }
      dailyChallengeStorage.saveTodayState(state.todayState);
    },

    setDailyStatus(state, action: PayloadAction<DailyChallengeStatus>) {
      if (!state.todayState) return;
      state.todayState.status = action.payload;
      dailyChallengeStorage.saveTodayState(state.todayState);
    },
  },
  extraReducers: (builder) => {
    // initDailyChallenge
    builder.addCase(initDailyChallenge.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(initDailyChallenge.fulfilled, (state, action) => {
      state.loading = false;
      state.settings = action.payload.settings;
      state.streak = action.payload.streak;
      state.history = action.payload.history;
      state.todayState = action.payload.todayState;
    });
    builder.addCase(initDailyChallenge.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || 'Error loading daily challenge';
    });

    // saveDailyChallengeSettings
    builder.addCase(saveDailyChallengeSettings.fulfilled, (state, action) => {
      state.settings = action.payload;
    });

    // submitDailyTest
    builder.addCase(submitDailyTest.pending, (state) => {
      state.submittingTest = true;
      state.error = null;
    });
    builder.addCase(submitDailyTest.fulfilled, (state, action) => {
      state.submittingTest = false;
      state.todayState = action.payload.todayState;
      state.streak = action.payload.streak;
      state.history = action.payload.history;
    });
    builder.addCase(submitDailyTest.rejected, (state, action) => {
      state.submittingTest = false;
      state.error = (action.payload as string) || 'Error submitting test';
    });

    // retryDailyTest
    builder.addCase(retryDailyTest.pending, (state) => {
      state.retryingTest = true;
      state.error = null;
    });
    builder.addCase(retryDailyTest.fulfilled, (state, action) => {
      state.retryingTest = false;
      state.todayState = action.payload;
    });
    builder.addCase(retryDailyTest.rejected, (state, action) => {
      state.retryingTest = false;
      state.error = (action.payload as string) || 'Error retrying test';
    });
  },
});

export const { markQuestionLearned, setPracticeAnswer, setDailyStatus } =
  dailyChallengeSlice.actions;
export default dailyChallengeSlice.reducer;
