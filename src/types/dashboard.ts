export interface TechnologyProgressItem {
  technologyId: string;
  name: string;
  slug: string;
  category: string;
  icon?: string;
  totalQuestions: number;
  known: number;
  weak: number;
  review: number;
  completionPercentage: number;
}

export interface WeakTopicItem {
  topicId: string;
  topicName: string;
  topicSlug: string;
  technologyName: string;
  technologySlug: string;
  weakCount: number;
}

export interface RecentQuestionItem {
  questionId: string;
  question: string;
  technology?: string;
  topic?: string;
  status: string;
  isSaved: boolean;
  difficulty?: string;
  isImportant?: boolean;
  lastReviewedAt: string;
}

export interface DashboardMetrics {
  totalQuestions: number;
  completedQuestions: number;
  savedQuestions: number;
  weakQuestions: number;
  reviewQuestions: number;
  overallProgressPercentage: number;
  technologyProgress: TechnologyProgressItem[];
  weakTopics: WeakTopicItem[];
  recentQuestions: RecentQuestionItem[];
}
