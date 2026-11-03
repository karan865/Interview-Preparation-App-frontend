import { Question } from '../types/question';
import { ExamQuestion } from '../types/exam';
import { localDataService } from '../services/localDataService';

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
    return localDataService.getDailyChallenge(params);
  },

  async getRetryTest(params?: {
    technologies?: string[];
    count?: number;
    excludeIds?: string[];
  }): Promise<RetryTestApiResponse> {
    return localDataService.getRetryTest(params);
  },
};
