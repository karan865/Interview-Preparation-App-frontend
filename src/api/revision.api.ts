import { PaginatedResponse } from '../types/api';
import { Question } from '../types/question';
import { RevisionResponse, QuickRevisionParams, InterviewPrepParams } from '../types/revision';
import { localDataService } from '../services/localDataService';

export interface WeakQuestionsResponse extends PaginatedResponse {
  questions: Question[];
}

export const revisionApi = {
  async getWeakQuestions(params?: {
    technology?: string;
    topic?: string;
    preparationLevel?: string;
    page?: number;
    limit?: number;
  }): Promise<WeakQuestionsResponse> {
    return localDataService.getWeakQuestions(params);
  },

  async getQuickRevision(params?: QuickRevisionParams): Promise<RevisionResponse> {
    return localDataService.getQuickRevision(params);
  },

  async getInterviewPrep(params?: InterviewPrepParams): Promise<RevisionResponse> {
    return localDataService.getInterviewPrep(params);
  },
};
