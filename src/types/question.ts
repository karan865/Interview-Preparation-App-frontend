import { Technology } from './technology';
import { Topic, PreparationLevel } from './topic';
import { UserProgressSummary } from './progress';

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';
export type QuestionStatus = 'draft' | 'published' | 'archived';

export interface CodeExample {
  language: string;
  title?: string;
  code: string;
  explanation?: string;
}

export interface StepItem {
  stepNumber?: number;
  title: string;
  description?: string;
}

export interface Question {
  _id: string;
  id?: string;
  question: string;
  title?: string;
  technologyId: Technology | string;
  topicId: Topic | string;
  preparationLevels?: (PreparationLevel | string)[];
  difficulty: QuestionDifficulty;
  questionType: string;
  answer: string;
  explanation?: string;
  explanationHindi?: string;
  analogy?: string;
  importantPoints?: string[];
  codeExamples?: CodeExample[];
  comparisons?: any[];
  examples?: string[];
  steps?: StepItem[];
  interviewAnswer?: string;
  interviewTips?: string[];
  commonMistakes?: string[];
  followUpQuestions?: string[];
  relatedQuestions?: (Question | string)[];
  tags?: string[];
  isImportant?: boolean;
  mcq?: {
    enabled: boolean;
    options: { id: string; text: string }[];
    correctOption: string;
    explanation?: string;
  };
  source?: string;
  sourceReference?: string;
  status?: QuestionStatus;
  createdAt?: string;
  updatedAt?: string;
  userProgress?: UserProgressSummary;
}

export interface QuestionFilterParams {
  technology?: string;
  topic?: string;
  level?: string;
  difficulty?: QuestionDifficulty;
  questionType?: string;
  isImportant?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}
