import { apiClient } from './client';
import { ApiResponse } from '../types/api';
import { ExamSubject, ExamPayload, ExamSubmission, ExamDifficulty, ExamMode } from '../types/exam';

export const examApi = {
  async getSubjects(): Promise<ExamSubject[]> {
    const res = await apiClient.get<ApiResponse<ExamSubject[]>>('/exams/subjects');
    return res.data;
  },

  async getSubjectExam(
    technologySlug: string,
    mode: ExamMode = 'practice',
    difficulty: ExamDifficulty = 'mixed'
  ): Promise<ExamPayload> {
    const res = await apiClient.get<ApiResponse<ExamPayload>>(
      `/exams/subject/${technologySlug}?mode=${mode}&difficulty=${difficulty}`
    );
    return res.data;
  },

  async getMernExam(
    mode: ExamMode = 'practice',
    difficulty: ExamDifficulty = 'mixed'
  ): Promise<ExamPayload> {
    const res = await apiClient.get<ApiResponse<ExamPayload>>(
      `/exams/mern?mode=${mode}&difficulty=${difficulty}`
    );
    return res.data;
  },

  async recordAttempt(submission: ExamSubmission): Promise<any> {
    const res = await apiClient.post<ApiResponse<any>>('/exams/attempts', submission);
    return res.data;
  },

  async getUserAttempts(): Promise<any[]> {
    const res = await apiClient.get<ApiResponse<any[]>>('/exams/attempts');
    return res.data;
  },
};
