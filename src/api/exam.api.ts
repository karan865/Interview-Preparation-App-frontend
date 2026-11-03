import { ExamSubject, ExamPayload, ExamSubmission, ExamDifficulty, ExamMode } from '../types/exam';
import { localDataService } from '../services/localDataService';

export const examApi = {
  async getSubjects(): Promise<ExamSubject[]> {
    return localDataService.getExamSubjects();
  },

  async getSubjectExam(
    technologySlug: string,
    mode: ExamMode = 'practice',
    difficulty: ExamDifficulty = 'mixed'
  ): Promise<ExamPayload> {
    return localDataService.generateSubjectExam(technologySlug, mode, difficulty);
  },

  async getMernExam(
    mode: ExamMode = 'practice',
    difficulty: ExamDifficulty = 'mixed'
  ): Promise<ExamPayload> {
    return localDataService.generateMernExam(mode, difficulty);
  },

  async recordAttempt(submission: ExamSubmission): Promise<any> {
    return localDataService.recordExamAttempt(submission);
  },

  async getUserAttempts(): Promise<any[]> {
    return localDataService.getUserExamAttempts();
  },
};
