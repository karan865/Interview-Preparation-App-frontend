export type ProgressStatus = 'known' | 'review' | 'weak';
export type MasteryStatus = ProgressStatus;

export interface UserProgressSummary {
  status: ProgressStatus | null;
  isSaved: boolean;
  reviewCount: number;
  lastReviewedAt: string | null;
}

export interface UserQuestionProgress {
  _id: string;
  userId: string;
  questionId: string;
  status: ProgressStatus | null;
  isSaved: boolean;
  reviewCount: number;
  lastReviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}
