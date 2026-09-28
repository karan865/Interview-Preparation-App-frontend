export type ExamMode = 'practice' | 'exam';
export type ExamDifficulty = 'easy' | 'medium' | 'hard' | 'mixed';

export interface ExamOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface ExamQuestion {
  _id: string;
  questionIndex: number;
  question: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionType: string;
  technologyId?: string;
  technologySlug?: string;
  technologyName?: string;
  topicId?: string;
  topicName?: string;
  options: ExamOption[];
  correctOption?: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
  explanationHindi?: string;
}

export interface ExamPayload {
  isAvailable: boolean;
  examType: 'subject' | 'mern';
  mode?: ExamMode;
  difficulty?: ExamDifficulty;
  technologyId?: string;
  technologySlug?: string;
  technologyName?: string;
  title: string;
  totalQuestions: number;
  questions: ExamQuestion[];
}

export interface ExamSubject {
  _id: string;
  name: string;
  slug: string;
  category?: string;
  icon?: string;
  totalMcqs: number;
  requiredQuestions: number;
  isAvailable: boolean;
}

export type PerformanceCategory = 'Excellent' | 'Good' | 'Needs Practice' | 'Needs Revision';

export interface ExamSubmissionAnswer {
  questionId: string;
  selectedOption?: string;
  correctOption?: string;
  isCorrect?: boolean;
  options?: ExamOption[];
  question?: string;
  explanation?: string;
  explanationHindi?: string;
  technologyName?: string;
}

export interface ExamSubmission {
  examType: 'subject' | 'mern';
  mode?: ExamMode;
  difficulty?: ExamDifficulty;
  technologyId?: string;
  technologySlug?: string;
  technologyName?: string;
  score?: number;
  totalQuestions?: number;
  correctAnswers?: number;
  wrongAnswers?: number;
  percentage?: number;
  performanceCategory?: PerformanceCategory;
  questions: ExamSubmissionAnswer[];
}

export interface DifficultyPerformanceItem {
  difficulty: 'easy' | 'medium' | 'hard';
  correct: number;
  total: number;
  percentage: number;
}

export interface TechnologyPerformanceItem {
  technologyName: string;
  technologySlug?: string;
  correct: number;
  total: number;
  percentage: number;
}

export interface WeakTopicItem {
  topicId?: string;
  topicName: string;
  technologyName: string;
  technologySlug?: string;
  correct: number;
  total: number;
  incorrect: number;
  accuracy: number;
}

export interface ExamRecommendation {
  type: 'review_weak' | 'take_another';
  message: string;
  buttonText: string;
}

export interface ExamAnalysis {
  overall: {
    totalQuestions: number;
    correct: number;
    incorrect: number;
    unanswered: number;
    percentage: number;
    performanceCategory: PerformanceCategory;
  };
  difficulty: DifficultyPerformanceItem[];
  technologies: TechnologyPerformanceItem[];
  weakTopics: WeakTopicItem[];
  recommendation: ExamRecommendation;
}

export interface ExamReviewItem {
  questionId: string;
  questionIndex: number;
  question: string;
  options: ExamOption[];
  selectedOption?: string;
  correctOption: string;
  isCorrect: boolean;
  explanation?: string;
  explanationHindi?: string;
  technologyName?: string;
  topicName?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface ExamResultData {
  examTitle: string;
  examType: 'subject' | 'mern';
  mode?: ExamMode;
  difficulty?: ExamDifficulty;
  technologySlug?: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  percentage: number;
  performanceCategory: PerformanceCategory;
  completedAt: string;
  reviewItems: ExamReviewItem[];
  analysis?: ExamAnalysis;
}
