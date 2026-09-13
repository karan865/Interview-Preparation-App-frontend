import { apiClient } from './client';
import { ApiResponse, PaginatedResponse } from '../types/api';
import { Question } from '../types/question';
import { RevisionResponse, QuickRevisionParams, InterviewPrepParams } from '../types/revision';

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
    return apiClient.get<WeakQuestionsResponse>('/revision/weak', params);
  },

  async getQuickRevision(params?: QuickRevisionParams): Promise<RevisionResponse> {
    const res = await apiClient.get<ApiResponse<RevisionResponse>>('/revision/quick', params);
    return res.data;
  },

  async getInterviewPrep(params?: InterviewPrepParams): Promise<RevisionResponse> {
    const res = await apiClient.get<ApiResponse<RevisionResponse>>('/revision/interview-prep', params);
    return res.data;
  },
};
