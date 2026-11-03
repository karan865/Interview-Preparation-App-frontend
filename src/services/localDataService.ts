import AsyncStorage from '@react-native-async-storage/async-storage';
import { Technology } from '../types/technology';
import { Topic, PreparationLevel } from '../types/topic';
import { Question, QuestionFilterParams, QuestionDifficulty } from '../types/question';
import { ProgressStatus, UserQuestionProgress, MasteryStatus } from '../types/progress';
import {
  ExamSubject,
  ExamPayload,
  ExamQuestion,
  ExamOption,
  ExamSubmission,
  ExamDifficulty,
  ExamMode,
} from '../types/exam';
import { DailyChallengeApiResponse, RetryTestApiResponse } from '../api/dailyChallenge.api';
import { DashboardMetrics, TechnologyProgressItem, WeakTopicItem, RecentQuestionItem } from '../types/dashboard';
import { QuestionListResponse } from '../api/question.api';
import { SearchResponse, SearchParams } from '../api/search.api';
import { RevisionResponse, QuickRevisionParams, InterviewPrepParams } from '../types/revision';
import { WeakQuestionsResponse } from '../api/revision.api';
import { progressStorage } from './progressStorage';

// Static bundled data
const rawTechnologies: Technology[] = require('../data/technologies.json');
const rawTopics: Topic[] = require('../data/topics.json');
const rawPreparationLevels: PreparationLevel[] = require('../data/preparationLevels.json');
const rawQuestions: Question[] = require('../data/questions.json');

const EXAM_ATTEMPTS_STORAGE_KEY = '@interview_prep_exam_attempts_v1';

// Fast index lookups
const techById = new Map<string, Technology>();
const techBySlug = new Map<string, Technology>();
const topicById = new Map<string, Topic>();
const topicBySlug = new Map<string, Topic>();
const levelById = new Map<string, PreparationLevel>();
const levelBySlug = new Map<string, PreparationLevel>();
const questionById = new Map<string, Question>();

for (const tech of rawTechnologies) {
  techById.set(tech._id, tech);
  techBySlug.set(tech.slug, tech);
}
// Tech slug aliases
const nodeTech = techBySlug.get('nodejs');
if (nodeTech) techBySlug.set('node', nodeTech);
const expressTech = techBySlug.get('expressjs');
if (expressTech) techBySlug.set('express', expressTech);

for (const top of rawTopics) {
  topicById.set(top._id, top);
  topicBySlug.set(top.slug, top);
}

for (const lvl of rawPreparationLevels) {
  levelById.set(lvl._id, lvl);
  levelBySlug.set(lvl.slug, lvl);
}

for (const q of rawQuestions) {
  questionById.set(q._id, q);
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function normalizeSearchText(text: string): string {
  return (text || '').toLowerCase().trim();
}

function enrichQuestionWithProgress(q: Question): Question {
  const localProg = progressStorage.getProgressSync(q._id);
  const isSaved = progressStorage.isQuestionSavedSync(q._id);

  if (!localProg && !isSaved) {
    return q;
  }

  return {
    ...q,
    userProgress: {
      status: (localProg?.status || null) as ProgressStatus,
      isSaved,
      reviewCount: localProg?.reviewCount || 0,
      lastReviewedAt: localProg?.lastReviewedAt || null,
    },
  };
}

export const localDataService = {
  // ─── Technologies ──────────────────────────────────────────────────────────
  async getTechnologies(category?: string): Promise<Technology[]> {
    await progressStorage.init();
    if (!category) {
      return [...rawTechnologies].sort((a, b) => a.order - b.order);
    }
    return rawTechnologies
      .filter((t) => t.category === category)
      .sort((a, b) => a.order - b.order);
  },

  async getTechnologyByIdOrSlug(idOrSlug: string): Promise<Technology> {
    const tech = techById.get(idOrSlug) || techBySlug.get(idOrSlug);
    if (!tech) {
      throw new Error(`Technology not found: ${idOrSlug}`);
    }
    return tech;
  },

  // ─── Topics ────────────────────────────────────────────────────────────────
  async getTopics(technology?: string): Promise<Topic[]> {
    if (!technology) {
      return [...rawTopics].sort((a, b) => a.order - b.order);
    }

    const tech = techById.get(technology) || techBySlug.get(technology);
    if (!tech) return [];

    return rawTopics
      .filter((tp) => {
        const tId = typeof tp.technologyId === 'object' ? (tp.technologyId as any)._id : tp.technologyId;
        return tId === tech._id;
      })
      .sort((a, b) => a.order - b.order);
  },

  async getTopicByIdOrSlug(idOrSlug: string): Promise<Topic> {
    const top = topicById.get(idOrSlug) || topicBySlug.get(idOrSlug);
    if (!top) {
      throw new Error(`Topic not found: ${idOrSlug}`);
    }
    return top;
  },

  // ─── Preparation Levels ────────────────────────────────────────────────────
  async getPreparationLevels(): Promise<PreparationLevel[]> {
    return [...rawPreparationLevels].sort((a, b) => a.order - b.order);
  },

  // ─── Questions ─────────────────────────────────────────────────────────────
  async getQuestions(params?: QuestionFilterParams): Promise<QuestionListResponse> {
    await progressStorage.init();

    let filtered = [...rawQuestions];

    // Filter by technology
    if (params?.technology) {
      const tech = techById.get(params.technology) || techBySlug.get(params.technology);
      if (tech) {
        filtered = filtered.filter((q) => {
          const qTechId = typeof q.technologyId === 'object' ? (q.technologyId as any)._id : q.technologyId;
          const qTechSlug = typeof q.technologyId === 'object' ? (q.technologyId as any).slug : undefined;
          return qTechId === tech._id || qTechSlug === tech.slug;
        });
      }
    }

    // Filter by topic
    if (params?.topic) {
      const top = topicById.get(params.topic) || topicBySlug.get(params.topic);
      if (top) {
        filtered = filtered.filter((q) => {
          const qTopId = typeof q.topicId === 'object' ? (q.topicId as any)._id : q.topicId;
          const qTopSlug = typeof q.topicId === 'object' ? (q.topicId as any).slug : undefined;
          return qTopId === top._id || qTopSlug === top.slug;
        });
      }
    }

    // Filter by preparation level
    if (params?.level) {
      const lvl = levelById.get(params.level) || levelBySlug.get(params.level);
      const lvlSlug = lvl ? lvl.slug : params.level;
      filtered = filtered.filter((q) => {
        if (!q.preparationLevels || q.preparationLevels.length === 0) return true;
        return q.preparationLevels.some((pl) => {
          const plSlug = typeof pl === 'object' ? (pl as any).slug : pl;
          const plId = typeof pl === 'object' ? (pl as any)._id : pl;
          return plSlug === lvlSlug || (lvl && plId === lvl._id);
        });
      });
    }

    // Filter by difficulty
    if (params?.difficulty) {
      filtered = filtered.filter((q) => q.difficulty === params.difficulty);
    }

    // Filter by question type
    if (params?.questionType) {
      const qTypeLower = params.questionType.toLowerCase();
      filtered = filtered.filter((q) => (q.questionType || '').toLowerCase().includes(qTypeLower));
    }

    // Filter by isImportant
    if (params?.isImportant !== undefined) {
      filtered = filtered.filter((q) => !!q.isImportant === params.isImportant);
    }

    // Search query in text
    if (params?.search) {
      const term = normalizeSearchText(params.search);
      filtered = filtered.filter((q) => {
        const text = `${q.question} ${q.title || ''} ${(q.tags || []).join(' ')} ${q.answer || ''} ${q.explanation || ''}`.toLowerCase();
        return text.includes(term);
      });
    }

    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paged = filtered.slice(startIndex, startIndex + limit).map(enrichQuestionWithProgress);

    return {
      success: true,
      data: paged,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      questions: paged,
    };
  },

  async getQuestionById(id: string): Promise<Question> {
    await progressStorage.init();
    const q = questionById.get(id);
    if (!q) {
      throw new Error(`Question not found: ${id}`);
    }
    // Record recently viewed
    progressStorage.recordRecentlyViewed(id);
    return enrichQuestionWithProgress(q);
  },

  // ─── Save / Bookmark ───────────────────────────────────────────────────────
  async saveQuestion(questionId: string): Promise<{ questionId: string; isSaved: boolean; message: string }> {
    await progressStorage.init();
    const isSaved = await progressStorage.isQuestionSaved(questionId);
    if (!isSaved) {
      await progressStorage.toggleSaveQuestion(questionId);
    }
    return {
      questionId,
      isSaved: true,
      message: 'Question saved successfully',
    };
  },

  async unsaveQuestion(questionId: string): Promise<{ questionId: string; isSaved: boolean; message: string }> {
    await progressStorage.init();
    const isSaved = await progressStorage.isQuestionSaved(questionId);
    if (isSaved) {
      await progressStorage.toggleSaveQuestion(questionId);
    }
    return {
      questionId,
      isSaved: false,
      message: 'Question unsaved successfully',
    };
  },

  async getSavedQuestions(params?: { page?: number; limit?: number }): Promise<QuestionListResponse> {
    await progressStorage.init();
    const savedIds = await progressStorage.getSavedQuestionIds();
    const savedQuestions: Question[] = [];

    for (const id of savedIds) {
      const q = questionById.get(id);
      if (q) {
        savedQuestions.push(enrichQuestionWithProgress(q));
      }
    }

    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const total = savedQuestions.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paged = savedQuestions.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: paged,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      questions: paged,
    };
  },

  // ─── Search ────────────────────────────────────────────────────────────────
  async searchQuestions(params: SearchParams): Promise<SearchResponse> {
    await progressStorage.init();
    const res = await this.getQuestions({
      search: params.q,
      technology: params.technology,
      topic: params.topic,
      level: params.level,
      difficulty: params.difficulty as QuestionDifficulty,
      page: params.page,
      limit: params.limit,
    });

    return {
      success: true,
      query: params.q,
      questions: res.questions,
      pagination: res.pagination,
      data: res.questions,
    };
  },

  // ─── Revision ──────────────────────────────────────────────────────────────
  async getWeakQuestions(params?: {
    technology?: string;
    topic?: string;
    preparationLevel?: string;
    page?: number;
    limit?: number;
  }): Promise<WeakQuestionsResponse> {
    await progressStorage.init();
    const allProgress = await progressStorage.getAllProgress();
    const weakIds = Object.keys(allProgress).filter((id) => allProgress[id].status === 'weak');

    let weakQuestions: Question[] = [];
    for (const id of weakIds) {
      const q = questionById.get(id);
      if (!q) continue;

      if (params?.technology) {
        const tech = techById.get(params.technology) || techBySlug.get(params.technology);
        if (tech) {
          const qTechId = typeof q.technologyId === 'object' ? (q.technologyId as any)._id : q.technologyId;
          if (qTechId !== tech._id) continue;
        }
      }

      if (params?.topic) {
        const top = topicById.get(params.topic) || topicBySlug.get(params.topic);
        if (top) {
          const qTopId = typeof q.topicId === 'object' ? (q.topicId as any)._id : q.topicId;
          if (qTopId !== top._id) continue;
        }
      }

      weakQuestions.push(enrichQuestionWithProgress(q));
    }

    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const total = weakQuestions.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paged = weakQuestions.slice(startIndex, startIndex + limit);

    return {
      success: true,
      questions: paged,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  },

  async getQuickRevision(params?: QuickRevisionParams): Promise<RevisionResponse> {
    await progressStorage.init();
    const allProgress = await progressStorage.getAllProgress();
    const limit = params?.limit || 30;

    let candidates = [...rawQuestions];
    if (params?.technology) {
      const tech = techById.get(params.technology) || techBySlug.get(params.technology);
      if (tech) {
        candidates = candidates.filter((q) => {
          const qTechId = typeof q.technologyId === 'object' ? (q.technologyId as any)._id : q.technologyId;
          return qTechId === tech._id;
        });
      }
    }

    // Partition by status
    const weakList: Question[] = [];
    const reviewList: Question[] = [];
    const importantList: Question[] = [];
    const otherList: Question[] = [];

    for (const q of candidates) {
      const prog = allProgress[q._id];
      if (prog?.status === 'weak') weakList.push(q);
      else if (prog?.status === 'review') reviewList.push(q);
      else if (q.isImportant) importantList.push(q);
      else otherList.push(q);
    }

    const selected: Question[] = [];
    const pushFrom = (list: Question[], count: number) => {
      const shuffled = shuffleArray(list);
      for (const item of shuffled) {
        if (selected.length >= limit) break;
        if (!selected.some((s) => s._id === item._id)) {
          selected.push(enrichQuestionWithProgress(item));
        }
      }
    };

    // 40% weak, 30% review, 20% important, 10% other
    pushFrom(weakList, Math.ceil(limit * 0.4));
    pushFrom(reviewList, Math.ceil(limit * 0.3));
    pushFrom(importantList, Math.ceil(limit * 0.2));
    pushFrom(otherList, limit - selected.length);

    return {
      count: selected.length,
      limit,
      questions: selected,
    };
  },

  async getInterviewPrep(params?: InterviewPrepParams): Promise<RevisionResponse> {
    await progressStorage.init();
    const limit = params?.limit || 50;
    const allProgress = await progressStorage.getAllProgress();

    let candidates = [...rawQuestions];
    if (params?.technologies) {
      const techList = Array.isArray(params.technologies) ? params.technologies : [params.technologies];
      const matchIds = new Set<string>();
      for (const t of techList) {
        const found = techById.get(t) || techBySlug.get(t);
        if (found) matchIds.add(found._id);
      }
      if (matchIds.size > 0) {
        candidates = candidates.filter((q) => {
          const qTechId = typeof q.technologyId === 'object' ? (q.technologyId as any)._id : q.technologyId;
          return matchIds.has(qTechId);
        });
      }
    }

    // Priority: weak -> review -> important -> high difficulty
    const prioritized = candidates.sort((a, b) => {
      const progA = allProgress[a._id]?.status;
      const progB = allProgress[b._id]?.status;
      const score = (status?: string, isImp?: boolean) => {
        if (status === 'weak') return 4;
        if (status === 'review') return 3;
        if (isImp) return 2;
        return 1;
      };
      return score(progB, b.isImportant) - score(progA, a.isImportant);
    });

    const chosen = prioritized.slice(0, limit).map(enrichQuestionWithProgress);

    return {
      count: chosen.length,
      limit,
      questions: chosen,
    };
  },

  // ─── Daily Challenge ───────────────────────────────────────────────────────
  async getDailyChallenge(params?: {
    technologies?: string[];
    learningCount?: number;
    testCount?: number;
    excludeIds?: string[];
  }): Promise<DailyChallengeApiResponse> {
    await progressStorage.init();
    const learningTarget = params?.learningCount || 20;
    const testTarget = params?.testCount || 10;
    const excludeSet = new Set(params?.excludeIds || []);

    let pool = rawQuestions.filter((q) => !excludeSet.has(q._id));

    if (params?.technologies && params.technologies.length > 0) {
      const matchIds = new Set<string>();
      for (const t of params.technologies) {
        const tech = techById.get(t) || techBySlug.get(t);
        if (tech) matchIds.add(tech._id);
      }
      if (matchIds.size > 0) {
        pool = pool.filter((q) => {
          const qTechId = typeof q.technologyId === 'object' ? (q.technologyId as any)._id : q.technologyId;
          return matchIds.has(qTechId);
        });
      }
    }

    // Split into learning and mcqs
    const mcqPool = pool.filter((q) => q.mcq && q.mcq.enabled && q.mcq.options && q.mcq.options.length > 0);
    const learningPool = pool.filter((q) => q.answer && q.answer.length > 10);

    const shuffledLearning = shuffleArray(learningPool).slice(0, learningTarget).map(enrichQuestionWithProgress);
    const shuffledMcqs = shuffleArray(mcqPool).slice(0, testTarget);

    const testQuestions: ExamQuestion[] = shuffledMcqs.map((q, idx) => {
      const tech = typeof q.technologyId === 'object' ? (q.technologyId as any) : techById.get(q.technologyId as string);
      const top = typeof q.topicId === 'object' ? (q.topicId as any) : topicById.get(q.topicId as string);

      // Shuffle options and map to A, B, C, D
      const originalOptions = q.mcq!.options;
      const correctText = originalOptions.find((o) => o.id === q.mcq!.correctOption)?.text;
      const shuffledOpts = shuffleArray(originalOptions);
      const letterIds: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];

      let newCorrect: 'A' | 'B' | 'C' | 'D' = 'A';
      const examOptions: ExamOption[] = shuffledOpts.slice(0, 4).map((opt, oIdx) => {
        const letter = letterIds[oIdx];
        if (opt.text === correctText) {
          newCorrect = letter;
        }
        return {
          id: letter,
          text: opt.text,
        };
      });

      return {
        _id: q._id,
        questionIndex: idx,
        question: q.question,
        title: q.title || q.question,
        difficulty: q.difficulty,
        questionType: q.questionType,
        technologyId: tech?._id,
        technologySlug: tech?.slug,
        technologyName: tech?.name,
        topicId: top?._id,
        topicName: top?.name,
        options: examOptions,
        correctOption: newCorrect,
        explanation: q.mcq?.explanation || q.explanation,
        explanationHindi: q.explanationHindi,
      };
    });

    const activeTechs = (params?.technologies || []).map((t) => {
      const found = techById.get(t) || techBySlug.get(t);
      return found ? { id: found._id, name: found.name, slug: found.slug } : { id: t, name: t, slug: t };
    });

    return {
      technologies: activeTechs,
      learningCount: shuffledLearning.length,
      testCount: testQuestions.length,
      learningQuestions: shuffledLearning,
      testQuestions,
    };
  },

  async getRetryTest(params?: {
    technologies?: string[];
    count?: number;
    excludeIds?: string[];
  }): Promise<RetryTestApiResponse> {
    const dailyRes = await this.getDailyChallenge({
      technologies: params?.technologies,
      testCount: params?.count || 10,
      learningCount: 0,
      excludeIds: params?.excludeIds,
    });

    return {
      count: dailyRes.testQuestions.length,
      testQuestions: dailyRes.testQuestions,
    };
  },

  // ─── Exams ─────────────────────────────────────────────────────────────────
  async getExamSubjects(): Promise<ExamSubject[]> {
    const results: ExamSubject[] = [];

    for (const tech of rawTechnologies) {
      const mcqCount = rawQuestions.filter((q) => {
        const qTechId = typeof q.technologyId === 'object' ? (q.technologyId as any)._id : q.technologyId;
        return qTechId === tech._id && q.mcq && q.mcq.enabled;
      }).length;

      results.push({
        _id: tech._id,
        name: tech.name,
        slug: tech.slug,
        category: tech.category,
        icon: tech.icon,
        totalMcqs: mcqCount,
        requiredQuestions: 25,
        isAvailable: mcqCount >= 10, // Available if has at least 10 MCQs
      });
    }

    return results;
  },

  async generateSubjectExam(
    technologySlug: string,
    mode: ExamMode = 'practice',
    difficulty: ExamDifficulty = 'mixed'
  ): Promise<ExamPayload> {
    const tech = techBySlug.get(technologySlug) || techById.get(technologySlug);
    if (!tech) {
      throw new Error(`Subject technology not found: ${technologySlug}`);
    }

    let mcqs = rawQuestions.filter((q) => {
      const qTechId = typeof q.technologyId === 'object' ? (q.technologyId as any)._id : q.technologyId;
      return qTechId === tech._id && q.mcq && q.mcq.enabled;
    });

    if (difficulty !== 'mixed') {
      const filteredByDiff = mcqs.filter((q) => q.difficulty === difficulty);
      if (filteredByDiff.length >= 10) {
        mcqs = filteredByDiff;
      }
    }

    const chosen = shuffleArray(mcqs).slice(0, 25);
    const letterIds: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];

    const questions: ExamQuestion[] = chosen.map((q, idx) => {
      const top = typeof q.topicId === 'object' ? (q.topicId as any) : topicById.get(q.topicId as string);
      const originalOpts = q.mcq!.options;
      const correctText = originalOpts.find((o) => o.id === q.mcq!.correctOption)?.text;
      const shuffledOpts = shuffleArray(originalOpts);

      let newCorrect: 'A' | 'B' | 'C' | 'D' = 'A';
      const options: ExamOption[] = shuffledOpts.slice(0, 4).map((opt, oIdx) => {
        const letter = letterIds[oIdx];
        if (opt.text === correctText) newCorrect = letter;
        return { id: letter, text: opt.text };
      });

      return {
        _id: q._id,
        questionIndex: idx,
        question: q.question,
        title: q.title || q.question,
        difficulty: q.difficulty,
        questionType: q.questionType,
        technologyId: tech._id,
        technologySlug: tech.slug,
        technologyName: tech.name,
        topicId: top?._id,
        topicName: top?.name,
        options,
        correctOption: mode === 'practice' ? newCorrect : undefined,
        explanation: mode === 'practice' ? (q.mcq?.explanation || q.explanation) : undefined,
        explanationHindi: mode === 'practice' ? q.explanationHindi : undefined,
      };
    });

    return {
      isAvailable: questions.length > 0,
      examType: 'subject',
      mode,
      difficulty,
      technologyId: tech._id,
      technologySlug: tech.slug,
      technologyName: tech.name,
      title: `${tech.name} Exam`,
      totalQuestions: questions.length,
      questions,
    };
  },

  async generateMernExam(
    mode: ExamMode = 'practice',
    difficulty: ExamDifficulty = 'mixed'
  ): Promise<ExamPayload> {
    const mernSlugs = ['react', 'nodejs', 'expressjs', 'mongodb', 'javascript'];
    const mernTechIds = new Set<string>();
    for (const slug of mernSlugs) {
      const t = techBySlug.get(slug);
      if (t) mernTechIds.add(t._id);
    }

    let mcqs = rawQuestions.filter((q) => {
      const qTechId = typeof q.technologyId === 'object' ? (q.technologyId as any)._id : q.technologyId;
      return mernTechIds.has(qTechId) && q.mcq && q.mcq.enabled;
    });

    if (mcqs.length < 25) {
      mcqs = rawQuestions.filter((q) => q.mcq && q.mcq.enabled);
    }

    if (difficulty !== 'mixed') {
      const filtered = mcqs.filter((q) => q.difficulty === difficulty);
      if (filtered.length >= 10) mcqs = filtered;
    }

    const chosen = shuffleArray(mcqs).slice(0, 25);
    const letterIds: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];

    const questions: ExamQuestion[] = chosen.map((q, idx) => {
      const tech = typeof q.technologyId === 'object' ? (q.technologyId as any) : techById.get(q.technologyId as string);
      const top = typeof q.topicId === 'object' ? (q.topicId as any) : topicById.get(q.topicId as string);
      const originalOpts = q.mcq!.options;
      const correctText = originalOpts.find((o) => o.id === q.mcq!.correctOption)?.text;
      const shuffledOpts = shuffleArray(originalOpts);

      let newCorrect: 'A' | 'B' | 'C' | 'D' = 'A';
      const options: ExamOption[] = shuffledOpts.slice(0, 4).map((opt, oIdx) => {
        const letter = letterIds[oIdx];
        if (opt.text === correctText) newCorrect = letter;
        return { id: letter, text: opt.text };
      });

      return {
        _id: q._id,
        questionIndex: idx,
        question: q.question,
        title: q.title || q.question,
        difficulty: q.difficulty,
        questionType: q.questionType,
        technologyId: tech?._id,
        technologySlug: tech?.slug,
        technologyName: tech?.name,
        topicId: top?._id,
        topicName: top?.name,
        options,
        correctOption: mode === 'practice' ? newCorrect : undefined,
        explanation: mode === 'practice' ? (q.mcq?.explanation || q.explanation) : undefined,
        explanationHindi: mode === 'practice' ? q.explanationHindi : undefined,
      };
    });

    return {
      isAvailable: questions.length > 0,
      examType: 'mern',
      mode,
      difficulty,
      title: 'Full Stack MERN Exam',
      totalQuestions: questions.length,
      questions,
    };
  },

  async recordExamAttempt(submission: ExamSubmission): Promise<any> {
    const total = submission.questions.length;
    let correct = 0;
    let wrong = 0;

    for (const q of submission.questions) {
      if (q.selectedOption && q.selectedOption === q.correctOption) {
        correct++;
        q.isCorrect = true;
      } else {
        wrong++;
        q.isCorrect = false;
      }
    }

    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    let performanceCategory: 'Excellent' | 'Good' | 'Needs Practice' | 'Needs Revision' = 'Needs Revision';
    if (percentage >= 80) performanceCategory = 'Excellent';
    else if (percentage >= 60) performanceCategory = 'Good';
    else if (percentage >= 40) performanceCategory = 'Needs Practice';

    const attempt = {
      _id: `exam_${Date.now()}`,
      examType: submission.examType,
      mode: submission.mode || 'practice',
      difficulty: submission.difficulty || 'mixed',
      technologyId: submission.technologyId,
      technologySlug: submission.technologySlug,
      technologyName: submission.technologyName,
      score: correct,
      totalQuestions: total,
      correctAnswers: correct,
      wrongAnswers: wrong,
      percentage,
      performanceCategory,
      questions: submission.questions,
      createdAt: new Date().toISOString(),
    };

    try {
      const raw = await AsyncStorage.getItem(EXAM_ATTEMPTS_STORAGE_KEY);
      const list = raw ? JSON.parse(raw) : [];
      list.unshift(attempt);
      await AsyncStorage.setItem(EXAM_ATTEMPTS_STORAGE_KEY, JSON.stringify(list.slice(0, 50)));
    } catch (e) {
      console.warn('Failed to save exam attempt locally:', e);
    }

    return attempt;
  },

  async getUserExamAttempts(): Promise<any[]> {
    try {
      const raw = await AsyncStorage.getItem(EXAM_ATTEMPTS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  // ─── Dashboard ─────────────────────────────────────────────────────────────
  async getDashboard(): Promise<DashboardMetrics> {
    await progressStorage.init();
    const stats = await progressStorage.getProgressStats();
    const savedIds = await progressStorage.getSavedQuestionIds();
    const allProgress = await progressStorage.getAllProgress();
    const recentIds = await progressStorage.getRecentlyViewedIds(5);

    const totalQuestions = rawQuestions.length;
    const completedQuestions = stats.knownCount;
    const savedQuestions = savedIds.length;
    const weakQuestions = stats.weakCount;
    const reviewQuestions = stats.reviewCount;
    const overallProgressPercentage =
      totalQuestions > 0 ? Math.min(100, Math.round((completedQuestions / totalQuestions) * 100)) : 0;

    // Technology progress breakdown
    const technologyProgress: TechnologyProgressItem[] = rawTechnologies.map((tech) => {
      const techQuestions = rawQuestions.filter((q) => {
        const qTechId = typeof q.technologyId === 'object' ? (q.technologyId as any)._id : q.technologyId;
        return qTechId === tech._id;
      });

      let known = 0;
      let weak = 0;
      let review = 0;

      for (const tq of techQuestions) {
        const p = allProgress[tq._id];
        if (p?.status === 'known') known++;
        else if (p?.status === 'weak') weak++;
        else if (p?.status === 'review') review++;
      }

      const total = techQuestions.length;
      return {
        technologyId: tech._id,
        name: tech.name,
        slug: tech.slug,
        category: tech.category,
        icon: tech.icon,
        totalQuestions: total,
        known,
        weak,
        review,
        completionPercentage: total > 0 ? Math.round((known / total) * 100) : 0,
      };
    });

    // Weak topics
    const weakTopicMap = new Map<string, { count: number; topic: Topic; tech: Technology }>();
    for (const [qId, prog] of Object.entries(allProgress)) {
      if (prog.status === 'weak') {
        const q = questionById.get(qId);
        if (q && q.topicId) {
          const topId = typeof q.topicId === 'object' ? (q.topicId as any)._id : q.topicId;
          const top = topicById.get(topId);
          const techId = typeof q.technologyId === 'object' ? (q.technologyId as any)._id : q.technologyId;
          const tech = techById.get(techId);

          if (top && tech) {
            const current = weakTopicMap.get(topId) || { count: 0, topic: top, tech };
            current.count++;
            weakTopicMap.set(topId, current);
          }
        }
      }
    }

    const weakTopics: WeakTopicItem[] = Array.from(weakTopicMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)
      .map(({ count, topic, tech }) => ({
        topicId: topic._id,
        topicName: topic.name,
        topicSlug: topic.slug,
        technologyName: tech.name,
        technologySlug: tech.slug,
        weakCount: count,
      }));

    // Recent questions
    const recentQuestions: RecentQuestionItem[] = [];
    for (const id of recentIds) {
      const q = questionById.get(id);
      if (q) {
        const prog = allProgress[id];
        const tech = typeof q.technologyId === 'object' ? (q.technologyId as any) : techById.get(q.technologyId as string);
        const top = typeof q.topicId === 'object' ? (q.topicId as any) : topicById.get(q.topicId as string);

        recentQuestions.push({
          questionId: q._id,
          question: q.question,
          technology: tech?.name,
          topic: top?.name,
          status: prog?.status || 'unseen',
          isSaved: progressStorage.isQuestionSavedSync(id),
          difficulty: q.difficulty,
          isImportant: q.isImportant,
          lastReviewedAt: prog?.lastReviewedAt || new Date().toISOString(),
        });
      }
    }

    return {
      totalQuestions,
      completedQuestions,
      savedQuestions,
      weakQuestions,
      reviewQuestions,
      overallProgressPercentage,
      technologyProgress,
      weakTopics,
      recentQuestions,
    };
  },

  // ─── Progress ──────────────────────────────────────────────────────────────
  async updateProgress(questionId: string, status: ProgressStatus): Promise<UserQuestionProgress> {
    await progressStorage.init();
    const updated = await progressStorage.setProgress(questionId, status as MasteryStatus);
    const isSaved = progressStorage.isQuestionSavedSync(questionId);

    return {
      _id: `prog_${questionId}`,
      userId: 'local-user',
      questionId,
      status,
      isSaved,
      reviewCount: updated.reviewCount,
      lastReviewedAt: updated.lastReviewedAt,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  async resetProgress(questionId: string): Promise<{ message: string }> {
    await progressStorage.init();
    // Reset status back to undefined / null
    const all = await progressStorage.getAllProgress();
    if (all[questionId]) {
      delete all[questionId];
      try {
        await AsyncStorage.setItem('@interview_prep_progress', JSON.stringify(all));
      } catch (e) {
        console.warn('Failed to reset progress', e);
      }
    }
    return { message: 'Progress reset successfully' };
  },
};
