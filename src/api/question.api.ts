import { PaginatedResponse } from '../types/api';
import { Question, QuestionFilterParams } from '../types/question';
import { localDataService } from '../services/localDataService';

export interface QuestionListResponse extends PaginatedResponse {
  questions: Question[];
}

export const questionApi = {
  async getQuestions(params?: QuestionFilterParams): Promise<QuestionListResponse> {
    return localDataService.getQuestions(params);
  },

  async getQuestionById(id: string): Promise<Question> {
    return localDataService.getQuestionById(id);
  },

  async saveQuestion(questionId: string): Promise<{ questionId: string; isSaved: boolean; message: string }> {
    return localDataService.saveQuestion(questionId);
  },

  async unsaveQuestion(questionId: string): Promise<{ questionId: string; isSaved: boolean; message: string }> {
    return localDataService.unsaveQuestion(questionId);
  },

  async getSavedQuestions(params?: { page?: number; limit?: number }): Promise<QuestionListResponse> {
    return localDataService.getSavedQuestions(params);
  },
};
