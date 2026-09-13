import { Question } from './question';
import { ExamQuestion, ExamReviewItem } from './exam';

export type DailyLearningCount = 10 | 20 | 30;
export type DailyTestCount = 10 | 20 | 30;
export type DailyPassingScore = 70 | 80;

export interface DailyChallengeSettings {
  learningQuestionCount: DailyLearningCount;
  testQuestionCount: DailyTestCount;
  passingScore: DailyPassingScore;
  technologyIds: string[]; // empty array = all active technologies
}

export type DailyChallengeStatus =
  | 'NOT_STARTED'
  | 'LEARNING'
  | 'PRACTICE'
  | 'TEST_READY'
  | 'TESTING'
  | 'FAILED'
  | 'PASSED';

export interface DailyTestAttempt {
  attemptNumber: number;
  answers: Record<string, string>; // questionId -> selectedOption ('A' | 'B' | 'C' | 'D')
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  submittedAt: string;
  reviewItems: ExamReviewItem[];
}

export interface DailyChallengeState {
  date: string; // 'YYYY-MM-DD'
  dayNumber: number;
  status: DailyChallengeStatus;
  settingsSnapshot: DailyChallengeSettings;
  selectedTechSlugs: string[];
  selectedTechNames: string[];
  learningQuestions: Question[];
  learnedQuestionIds: string[];
  practiceAnswers: Record<string, string>;
  testQuestions: ExamQuestion[];
  currentAttempt: DailyTestAttempt | null;
  attempts: DailyTestAttempt[];
  bestScore: number;
  completed: boolean;
  completedAt: string | null;
}

export interface DailyHistoryEntry {
  date: string; // 'YYYY-MM-DD'
  completed: boolean;
  bestScore: number;
  totalQuestions: number;
  passingScore: number;
  attemptsCount: number;
  technologies: string[];
}

export interface DailyStreakData {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null; // 'YYYY-MM-DD'
}
