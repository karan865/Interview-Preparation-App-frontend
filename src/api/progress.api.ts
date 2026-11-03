import { ProgressStatus, UserQuestionProgress } from '../types/progress';
import { localDataService } from '../services/localDataService';

export const progressApi = {
  async updateStatus(questionId: string, status: ProgressStatus): Promise<UserQuestionProgress> {
    return localDataService.updateProgress(questionId, status);
  },

  async resetProgress(questionId: string): Promise<{ message: string }> {
    return localDataService.resetProgress(questionId);
  },
};
