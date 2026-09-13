import { Question } from './question';

export interface RevisionResponse {
  count: number;
  limit: number;
  questions: Question[];
}

export interface QuickRevisionParams {
  technology?: string;
  preparationLevel?: string;
  limit?: number;
}

export interface InterviewPrepParams {
  technologies?: string[] | string;
  preparationLevel?: string;
  limit?: number;
}
