import { apiClient } from './client';
import { PaginatedResponse } from '../types/api';
import { Question } from '../types/question';

export interface SearchResponse extends PaginatedResponse {
  query: string;
  questions: Question[];
}

export interface SearchParams {
  q: string;
  technology?: string;
  topic?: string;
  level?: string;
  difficulty?: string;
  page?: number;
  limit?: number;
}

export const searchApi = {
  async searchQuestions(params: SearchParams): Promise<SearchResponse> {
    return apiClient.get<SearchResponse>('/search', params);
  },
};
