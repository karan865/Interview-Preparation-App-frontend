import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExamPayload, ExamResultData, ExamMode, ExamDifficulty } from '../../types/exam';

export interface ExamState {
  currentExam: ExamPayload | null;
  mode: ExamMode;
  difficulty: ExamDifficulty;
  currentQuestionIndex: number;
  selectedAnswers: Record<string, 'A' | 'B' | 'C' | 'D'>;
  examResult: ExamResultData | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ExamState = {
  currentExam: null,
  mode: 'practice',
  difficulty: 'mixed',
  currentQuestionIndex: 0,
  selectedAnswers: {},
  examResult: null,
  isLoading: false,
  error: null,
};

export const examSlice = createSlice({
  name: 'exam',
  initialState,
  reducers: {
    startExam: (state, action: PayloadAction<ExamPayload>) => {
      state.currentExam = action.payload;
      state.mode = action.payload.mode || 'practice';
      state.difficulty = action.payload.difficulty || 'mixed';
      state.currentQuestionIndex = 0;
      state.selectedAnswers = {};
      state.examResult = null;
      state.error = null;
    },
    selectOption: (
      state,
      action: PayloadAction<{ questionId: string; optionId: 'A' | 'B' | 'C' | 'D' }>
    ) => {
      state.selectedAnswers[action.payload.questionId] = action.payload.optionId;
    },
    nextQuestion: (state) => {
      if (state.currentExam && state.currentQuestionIndex < state.currentExam.questions.length - 1) {
        state.currentQuestionIndex += 1;
      }
    },
    prevQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
      }
    },
    jumpToQuestion: (state, action: PayloadAction<number>) => {
      if (
        state.currentExam &&
        action.payload >= 0 &&
        action.payload < state.currentExam.questions.length
      ) {
        state.currentQuestionIndex = action.payload;
      }
    },
    setExamResult: (state, action: PayloadAction<ExamResultData>) => {
      state.examResult = action.payload;
    },
    resetExamSession: (state) => {
      state.currentExam = null;
      state.mode = 'practice';
      state.difficulty = 'mixed';
      state.currentQuestionIndex = 0;
      state.selectedAnswers = {};
      state.examResult = null;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  startExam,
  selectOption,
  nextQuestion,
  prevQuestion,
  jumpToQuestion,
  setExamResult,
  resetExamSession,
  setError,
  setLoading,
} = examSlice.actions;

export default examSlice.reducer;
