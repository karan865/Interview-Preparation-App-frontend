import { apiClient } from './client';
import { ApiResponse } from '../types/api';
import { ProgressStatus, UserQuestionProgress } from '../types/progress';

export const progressApi = {
  async updateStatus(questionId: string, status: ProgressStatus): Promise<UserQuestionProgress> {
    const res = await apiClient.post<ApiResponse<UserQuestionProgress>>(`/progress/${questionId}`, {
      status,
    });
    return res.data;
  },

  async resetProgress(questionId: string): Promise<{ message: string }> {
    const res = await apiClient.delete<ApiResponse<{ message: string }>>(`/progress/${questionId}`);
    return res.data;
  },
};
