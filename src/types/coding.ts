export type CodingDifficulty = 'easy' | 'medium' | 'hard';

export type CodingLanguage = 'javascript' | 'python' | 'java' | 'csharp' | 'cpp';

export interface CodingSolutions {
  javascript: string;
  python: string;
  java: string;
  csharp: string;
  cpp: string;
}

export interface CodingQuestion {
  id: string;
  questionNumber: number;
  originalNumber?: number;
  title: string;
  difficulty: CodingDifficulty;
  question: string;
  solutions: CodingSolutions;
  expectedOutput?: string;
  explanationEnglish?: string;
  explanationHindi?: string;
  howToSolve?: string;
}

export interface CodingStats {
  easy: number;
  medium: number;
  hard: number;
  total: number;
}

