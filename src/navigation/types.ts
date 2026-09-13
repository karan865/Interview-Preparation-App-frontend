import { NavigatorScreenParams } from '@react-navigation/native';
import { Technology } from '../types/technology';
import { Topic, PreparationLevel } from '../types/topic';
import { Question } from '../types/question';

export type BrowseStackParamList = {
  BrowseTechnologies: undefined;
  BrowseTopics: { technology: Technology };
  BrowseLevels: { technology: Technology; topic: Topic };
  BrowseQuestions: {
    technology?: Technology;
    topic?: Topic;
    level?: PreparationLevel;
    levelSlug?: string;
    levelName?: string;
  };
};

export type MainTabParamList = {
  Home: undefined;
  Browse: NavigatorScreenParams<BrowseStackParamList>;
  Search: { initialQuery?: string } | undefined;
  Saved: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  QuestionDetail: {
    questionId: string;
    question?: Question;
    questionsQueue?: Question[];
    queueIndex?: number;
  };
  QuickRevision: {
    technologyId?: string;
  };
  Settings: undefined;
  ExamList: undefined;
  Exam: {
    examType: 'subject' | 'mern';
    mode: 'practice' | 'exam';
    difficulty?: 'easy' | 'medium' | 'hard' | 'mixed';
    technologySlug?: string;
    technologyName?: string;
  };
  ExamResult: undefined;
  ExamReview: { filter?: 'all' | 'incorrect' | 'correct' } | undefined;
  DailyChallenge: undefined;
};
