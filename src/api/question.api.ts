import { apiClient } from './client';
import { ApiResponse, PaginatedResponse } from '../types/api';
import { Question, QuestionFilterParams } from '../types/question';

export interface QuestionListResponse extends PaginatedResponse {
  questions: Question[];
}

export const questionApi = {
  async getQuestions(params?: QuestionFilterParams): Promise<QuestionListResponse> {
    return apiClient.get<QuestionListResponse>('/questions', params);
  },

  async getQuestionById(id: string): Promise<Question> {
    const res = await apiClient.get<ApiResponse<Question>>(`/questions/${id}`);
    return res.data;
  },

  async saveQuestion(questionId: string): Promise<{ questionId: string; isSaved: boolean; message: string }> {
    const res = await apiClient.post<ApiResponse<{ questionId: string; isSaved: boolean; message: string }>>(
      `/questions/${questionId}/save`
    );
    return res.data;
  },

  async unsaveQuestion(questionId: string): Promise<{ questionId: string; isSaved: boolean; message: string }> {
    const res = await apiClient.delete<ApiResponse<{ questionId: string; isSaved: boolean; message: string }>>(
      `/questions/${questionId}/save`
    );
    return res.data;
  },

  async getSavedQuestions(params?: { page?: number; limit?: number }): Promise<QuestionListResponse> {
    return apiClient.get<QuestionListResponse>('/questions/saved', params);
  },
};
