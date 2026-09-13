import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  loadProgressState,
  updateQuestionProgress,
  toggleSaveQuestion,
  recordQuestionView,
  recordLastOpenedQuestion,
} from '../store/slices/progressSlice';
import { MasteryStatus } from '../types/progress';
import { LastOpenedQuestion } from '../services/progressStorage';

export const useProgress = () => {
  const dispatch = useAppDispatch();
  const stats = useAppSelector((state) => state.progress.stats);
  const savedIds = useAppSelector((state) => state.progress.savedIds);
  const recentlyViewedIds = useAppSelector((state) => state.progress.recentlyViewedIds);
  const lastOpenedQuestion = useAppSelector((state) => state.progress.lastOpenedQuestion);
  const isInitialized = useAppSelector((state) => state.progress.isInitialized);

  useEffect(() => {
    if (!isInitialized) {
      dispatch(loadProgressState());
    }
  }, [dispatch, isInitialized]);

  const reloadData = useCallback(async () => {
    await dispatch(loadProgressState());
  }, [dispatch]);

  const markQuestion = useCallback(
    async (questionId: string, status: MasteryStatus) => {
      const res = await dispatch(updateQuestionProgress({ questionId, status })).unwrap();
      return res.progress;
    },
    [dispatch]
  );

  const toggleSave = useCallback(
    async (questionId: string) => {
      const res = await dispatch(toggleSaveQuestion(questionId)).unwrap();
      return res.isSaved;
    },
    [dispatch]
  );

  const viewQuestion = useCallback(
    async (questionId: string) => {
      await dispatch(recordQuestionView(questionId));
    },
    [dispatch]
  );

  const saveLastOpened = useCallback(
    async (meta: LastOpenedQuestion) => {
      await dispatch(recordLastOpenedQuestion(meta));
    },
    [dispatch]
  );

  return {
    stats,
    savedIds,
    recentlyViewedIds,
    lastOpenedQuestion,
    isLoading: !isInitialized,
    reloadData,
    markQuestion,
    toggleSave,
    viewQuestion,
    saveLastOpened,
  };
};
