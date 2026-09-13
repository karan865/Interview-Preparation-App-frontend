import { apiClient } from './client';
import { ApiResponse } from '../types/api';
import { Question } from '../types/question';
import { ExamQuestion } from '../types/exam';

export interface DailyChallengeApiResponse {
  technologies: { id: string; name: string; slug: string }[];
  learningCount: number;
  testCount: number;
  learningQuestions: Question[];
  testQuestions: ExamQuestion[];
}

export interface RetryTestApiResponse {
  count: number;
  testQuestions: ExamQuestion[];
}

export const dailyChallengeApi = {
  async getDailyChallenge(params?: {
    technologies?: string[];
    learningCount?: number;
    testCount?: number;
    excludeIds?: string[];
  }): Promise<DailyChallengeApiResponse> {
    const query: Record<string, any> = {};
    if (params?.technologies && params.technologies.length > 0) {
      query.technologies = params.technologies.join(',');
    }
    if (params?.learningCount) {
      query.learningCount = params.learningCount;
    }
    if (params?.testCount) {
      query.testCount = params.testCount;
    }
    if (params?.excludeIds && params.excludeIds.length > 0) {
      query.excludeIds = params.excludeIds.join(',');
    }

    const res = await apiClient.get<ApiResponse<DailyChallengeApiResponse>>(
      '/questions/daily-challenge',
      query
    );
    return res.data;
  },

  async getRetryTest(params?: {
    technologies?: string[];
    count?: number;
    excludeIds?: string[];
  }): Promise<RetryTestApiResponse> {
    const query: Record<string, any> = {};
    if (params?.technologies && params.technologies.length > 0) {
      query.technologies = params.technologies.join(',');
    }
    if (params?.count) {
      query.count = params.count;
    }
    if (params?.excludeIds && params.excludeIds.length > 0) {
      query.excludeIds = params.excludeIds.join(',');
    }

    const res = await apiClient.get<ApiResponse<RetryTestApiResponse>>(
      '/questions/daily-challenge/retry-test',
      query
    );
    return res.data;
  },
};
