import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  StatusBar,
  Dimensions,
  BackHandler,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { examApi } from '../../api/exam.api';
import { ExamPayload, ExamQuestion, ExamResultData, ExamReviewItem, PerformanceCategory, ExamMode, ExamDifficulty, ExamAnalysis } from '../../types/exam';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  startExam,
  selectOption,
  nextQuestion,
  prevQuestion,
  setExamResult,
  resetExamSession,
} from '../../store/slices/examSlice';
import { useTheme } from '../../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type NavProp = NativeStackNavigationProp<RootStackParamList>;
type ScreenRouteProp = RouteProp<RootStackParamList, 'Exam'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function getPerformanceCategory(pct: number): PerformanceCategory {
  if (pct >= 80) return 'Excellent';
  if (pct >= 60) return 'Good';
  if (pct >= 40) return 'Needs Practice';
  return 'Needs Revision';
}

export const ExamScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<ScreenRouteProp>();
  const dispatch = useAppDispatch();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const { examType, mode = 'practice', difficulty = 'mixed', technologySlug, technologyName } = route.params;

  const { currentExam, currentQuestionIndex, selectedAnswers } = useAppSelector(
    (state) => state.exam
  );

  const scrollRef = useRef<ScrollView>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const handleExitPrompt = useCallback(() => {
    Alert.alert(
      'Exit this test?',
      'Your current answers will be lost.',
      [
        { text: 'Continue Test', style: 'cancel' },
        {
          text: 'Exit Test',
          style: 'destructive',
          onPress: () => {
            dispatch(resetExamSession());
            navigation.goBack();
          },
        },
      ]
    );
  }, [dispatch, navigation]);

  // Handle hardware Android back button
  useEffect(() => {
    const onBackPress = () => {
      handleExitPrompt();
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [handleExitPrompt]);

  const loadExam = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let payload: ExamPayload;
      if (examType === 'mern') {
        payload = await examApi.getMernExam(mode, difficulty);
      } else if (technologySlug) {
        payload = await examApi.getSubjectExam(technologySlug, mode, difficulty);
      } else {
        throw new Error('Invalid exam parameters.');
      }

      if (!payload || !payload.questions || payload.questions.length === 0) {
        throw new Error('No exam questions available.');
      }

      dispatch(startExam({ ...payload, mode, difficulty }));
    } catch (err: any) {
      console.warn('[ExamScreen] load error:', err);
      setError(err.message || 'Failed to load exam questions.');
    } finally {
      setLoading(false);
    }
  }, [examType, mode, difficulty, technologySlug, dispatch]);

  useEffect(() => {
    loadExam();
  }, [loadExam]);

  const questions: ExamQuestion[] = currentExam?.questions || [];
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex];

  const answeredCount = Object.keys(selectedAnswers).length;
  const unansweredCount = Math.max(0, totalQuestions - answeredCount);
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const handleSelectOption = (optionId: 'A' | 'B' | 'C' | 'D') => {
    if (!currentQuestion) return;
    const currentSelection = selectedAnswers[currentQuestion._id];
    // In Practice Mode, lock once chosen
    if (mode === 'practice' && currentSelection) return;

    dispatch(
      selectOption({
        questionId: currentQuestion._id,
        optionId,
      })
    );

    // In Practice Mode, smoothly scroll down so user sees immediate explanation
    if (mode === 'practice') {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 150);
    }
  };

  const handlePrev = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
    dispatch(prevQuestion());
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowSubmitModal(true);
    } else {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
      dispatch(nextQuestion());
    }
  };

  const handleConfirmSubmit = async () => {
    setShowSubmitModal(false);
    setSubmitting(true);

    try {
      const submissionQuestions = questions.map((q) => ({
        questionId: q._id,
        selectedOption: selectedAnswers[q._id] || '',
        options: q.options,
        correctOption: q.correctOption,
        explanation: q.explanation,
        explanationHindi: q.explanationHindi,
        technologyName: q.technologyName,
      }));

      let authoritativeResult: any = null;
      try {
        const res = await examApi.recordAttempt({
          examType,
          mode,
          difficulty,
          technologySlug,
          technologyName: technologyName || (examType === 'mern' ? 'Full Stack' : technologySlug),
          totalQuestions,
          questions: submissionQuestions,
        } as any);
        authoritativeResult = res;
      } catch (saveErr) {
        console.warn('[ExamScreen] Server submission error / offline fallback:', saveErr);
      }

      let reviewItems: ExamReviewItem[];
      let score: number;
      let correctAnswers: number;
      let wrongAnswers: number;
      let percentage: number;
      let performanceCategory: PerformanceCategory;

      if (authoritativeResult && authoritativeResult.reviewItems) {
        // Authoritative server-evaluated results
        reviewItems = authoritativeResult.reviewItems;
        score = authoritativeResult.score;
        correctAnswers = authoritativeResult.correctAnswers;
        wrongAnswers = authoritativeResult.wrongAnswers;
        percentage = authoritativeResult.percentage;
        performanceCategory = authoritativeResult.performanceCategory;
      } else {
        // Fallback for practice mode offline
        correctAnswers = 0;
        wrongAnswers = 0;
        reviewItems = questions.map((q, idx) => {
          const selected = selectedAnswers[q._id];
          const isCorrect = Boolean(selected && q.correctOption && selected === q.correctOption);
          if (isCorrect) correctAnswers += 1;
          else wrongAnswers += 1;
          return {
            questionId: q._id,
            questionIndex: idx + 1,
            question: q.question,
            options: q.options,
            selectedOption: selected,
            correctOption: q.correctOption || 'A',
            isCorrect,
            explanation: q.explanation,
            explanationHindi: q.explanationHindi,
            technologyName: q.technologyName,
          };
        });
        score = correctAnswers;
        percentage = Math.round((score / totalQuestions) * 100);
        performanceCategory = getPerformanceCategory(percentage);
      }

      let analysis: ExamAnalysis | undefined = authoritativeResult?.analysis;
      if (!analysis) {
        const answeredCount = Object.keys(selectedAnswers).filter((k) => selectedAnswers[k]).length;
        const unanswered = Math.max(0, totalQuestions - answeredCount);
        const incorrect = Math.max(0, totalQuestions - correctAnswers - unanswered);

        const diffMap: Record<string, { correct: number; total: number }> = {};
        for (const q of questions) {
          const d = q.difficulty || 'medium';
          if (!diffMap[d]) diffMap[d] = { correct: 0, total: 0 };
          diffMap[d].total += 1;
          if (selectedAnswers[q._id] && q.correctOption && selectedAnswers[q._id] === q.correctOption) {
            diffMap[d].correct += 1;
          }
        }
        const diffBreakdown = (['easy', 'medium', 'hard'] as const)
          .filter((d) => diffMap[d] && diffMap[d].total > 0)
          .map((d) => ({
            difficulty: d,
            correct: diffMap[d].correct,
            total: diffMap[d].total,
            percentage: Math.round((diffMap[d].correct / diffMap[d].total) * 100),
          }));

        const techMap: Record<string, { correct: number; total: number; slug?: string }> = {};
        for (const q of questions) {
          const tName = q.technologyName || 'General';
          if (!techMap[tName]) techMap[tName] = { correct: 0, total: 0, slug: q.technologySlug };
          techMap[tName].total += 1;
          if (selectedAnswers[q._id] && q.correctOption && selectedAnswers[q._id] === q.correctOption) {
            techMap[tName].correct += 1;
          }
        }
        const techBreakdown = Object.keys(techMap).map((tName) => ({
          technologyName: tName,
          technologySlug: techMap[tName].slug,
          correct: techMap[tName].correct,
          total: techMap[tName].total,
          percentage: Math.round((techMap[tName].correct / techMap[tName].total) * 100),
        }));

        analysis = {
          overall: {
            totalQuestions,
            correct: correctAnswers,
            incorrect,
            unanswered,
            percentage,
            performanceCategory,
          },
          difficulty: diffBreakdown,
          technologies: techBreakdown,
          weakTopics: [],
          recommendation: {
            type: 'take_another',
            message: "Great performance! You're ready for another challenge.",
            buttonText: 'Take Another Test',
          },
        };
      }

      const resultData: ExamResultData = {
        examTitle: currentExam?.title || (examType === 'mern' ? 'Full Stack & All-Subjects Test' : `${technologyName || technologySlug} Interview Test`),
        examType,
        mode,
        difficulty,
        technologySlug,
        score,
        totalQuestions,
        correctAnswers,
        wrongAnswers,
        percentage,
        performanceCategory,
        completedAt: new Date().toISOString(),
        reviewItems,
        analysis,
      };

      dispatch(setExamResult(resultData));
      navigation.replace('ExamResult');
    } catch (err: any) {
      Alert.alert('Submission Error', err.message || 'Could not complete exam submission.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || submitting) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <ActivityIndicator size="large" color="#7C3AED" />
        <Text style={[styles.loadingTitle, { color: colors.text }]}>
          {submitting ? 'Evaluating your answers...' : 'Preparing 25 Interview Questions...'}
        </Text>
        <Text style={[styles.loadingSubtitle, { color: colors.textSecondary }]}>
          {submitting ? 'Calculating score and review explanations' : 'Randomizing questions & option mappings'}
        </Text>
      </View>
    );
  }

  if (error || !currentQuestion) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background, padding: 24 }]}>
        <Ionicons name="alert-circle" size={48} color="#EF4444" />
        <Text style={[styles.errorHeading, { color: colors.text }]}>Unable to Start Exam</Text>
        <Text style={[styles.errorDetail, { color: colors.textSecondary }]}>{error}</Text>
        <TouchableOpacity style={styles.backHomeBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backHomeText}>Back to Exams</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const selectedForCurrent = selectedAnswers[currentQuestion._id];
  const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: Math.max(insets.top, 16) }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Top Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.exitBtn} onPress={handleExitPrompt}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={[styles.examTitle, { color: colors.text }]} numberOfLines={1}>
            {currentExam?.title || 'Technical Interview Test'}
          </Text>
          <View style={styles.headerMetaRow}>
            <View style={[styles.modeMiniBadge, { backgroundColor: mode === 'exam' ? (isDark ? '#0C4A6E' : '#E0F2FE') : (isDark ? '#312E81' : '#EEF2FF') }]}>
              <Text style={[styles.modeMiniBadgeText, { color: mode === 'exam' ? (isDark ? '#38BDF8' : '#0284C7') : (isDark ? '#818CF8' : '#4F46E5') }]}>
                {mode === 'exam' ? '📝 Exam' : '🧠 Practice'}
              </Text>
            </View>
            <View style={[styles.diffMiniBadge, { backgroundColor: isDark ? '#1F2937' : '#F1F5F9' }]}>
              <Text style={[styles.diffMiniBadgeText, { color: colors.text }]}>
                {difficulty === 'hard' ? '🔴 Hard' : difficulty === 'medium' ? '🟡 Medium' : difficulty === 'easy' ? '🟢 Easy' : '🎯 Mixed'}
              </Text>
            </View>
            <Text style={[styles.qCounter, { color: colors.textSecondary }]}>
              • Q {currentQuestionIndex + 1}/{totalQuestions}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.submitTopBtn}
          onPress={() => setShowSubmitModal(true)}
        >
          <Text style={styles.submitTopText}>Submit</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={[styles.progressTrack, { backgroundColor: isDark ? '#1F2937' : '#E5E7EB' }]}>
        <View style={[styles.progressBar, { width: `${progressPercent}%` }]} />
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollBody}
        showsVerticalScrollIndicator={false}
      >
        {/* Technology Tag */}
        {currentQuestion.technologyName && (
          <View style={styles.techTag}>
            <Ionicons name="code-slash" size={12} color="#7C3AED" />
            <Text style={styles.techTagText}>{currentQuestion.technologyName}</Text>
            {currentQuestion.difficulty && (
              <Text style={[styles.diffTagText, { color: colors.textSecondary }]}>
                • {currentQuestion.difficulty.toUpperCase()}
              </Text>
            )}
          </View>
        )}

        {/* Question Text Card */}
        <View style={[styles.questionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.questionText, { color: colors.text }]}>
            {currentQuestion.question}
          </Text>
        </View>

        {/* 4 MCQ Options */}
        <View style={styles.optionsList}>
          {currentQuestion.options.map((opt) => {
            const isSelected = selectedForCurrent === opt.id;
            const isAnswered = Boolean(selectedForCurrent);

            // Dynamic styles based on mode and answer status
            let cardBg = colors.surface;
            let cardBorder = colors.border;
            let borderWidth = 1;
            let badgeBg = isDark ? '#374151' : '#F3F4F6';
            let badgeText = colors.text;
            let textColor = colors.text;
            let opacity = 1;

            if (mode === 'practice') {
              const isCorrectOption = opt.id === currentQuestion.correctOption;
              if (isAnswered) {
                if (isCorrectOption) {
                  cardBg = isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5';
                  cardBorder = '#10B981';
                  borderWidth = 2;
                  badgeBg = '#10B981';
                  badgeText = '#FFFFFF';
                  textColor = isDark ? '#34D399' : '#065F46';
                } else if (isSelected && !isCorrectOption) {
                  cardBg = isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2';
                  cardBorder = '#EF4444';
                  borderWidth = 2;
                  badgeBg = '#EF4444';
                  badgeText = '#FFFFFF';
                  textColor = isDark ? '#F87171' : '#991B1B';
                } else {
                  opacity = 0.5;
                }
              } else if (isSelected) {
                cardBg = isDark ? '#312E81' : '#EEF2FF';
                cardBorder = '#6366F1';
                borderWidth = 2;
                badgeBg = '#4F46E5';
                badgeText = '#FFFFFF';
                textColor = isDark ? '#FFFFFF' : '#1E1B4B';
              }
            } else {
              // Exam Mode: Only show selected state without revealing correctness
              if (isSelected) {
                cardBg = isDark ? '#14253D' : '#F0F9FF';
                cardBorder = '#0284C7';
                borderWidth = 2;
                badgeBg = '#0284C7';
                badgeText = '#FFFFFF';
                textColor = isDark ? '#E0F2FE' : '#0369A1';
              }
            }

            return (
              <TouchableOpacity
                key={opt.id}
                activeOpacity={0.8}
                disabled={mode === 'practice' && isAnswered}
                onPress={() => handleSelectOption(opt.id)}
                style={[
                  styles.optionCard,
                  {
                    backgroundColor: cardBg,
                    borderColor: cardBorder,
                    borderWidth,
                    opacity,
                  },
                ]}
              >
                <View style={[styles.optBadge, { backgroundColor: badgeBg }]}>
                  <Text style={[styles.optBadgeText, { color: badgeText }]}>
                    {opt.id}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.optText,
                    {
                      color: textColor,
                      fontWeight: isSelected || (mode === 'practice' && isAnswered && opt.id === currentQuestion.correctOption) ? '600' : '400',
                    },
                  ]}
                >
                  {opt.text}
                </Text>

                <View style={styles.radioIndicator}>
                  {mode === 'practice' && isAnswered && opt.id === currentQuestion.correctOption ? (
                    <Ionicons name="checkmark-circle" size={22} color="#10B981" />
                  ) : mode === 'practice' && isAnswered && isSelected && opt.id !== currentQuestion.correctOption ? (
                    <Ionicons name="close-circle" size={22} color="#EF4444" />
                  ) : (
                    <View
                      style={[
                        styles.radioCircle,
                        { borderColor: isSelected ? (mode === 'exam' ? '#0284C7' : '#4F46E5') : colors.border },
                      ]}
                    >
                      {isSelected && (
                        <View
                          style={[
                            styles.radioDot,
                            mode === 'exam' && { backgroundColor: '#0284C7' },
                          ]}
                        />
                      )}
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Immediate Feedback & Explanation Card - ONLY in Practice Mode */}
        {mode === 'practice' && Boolean(selectedForCurrent) && (
          <View
            style={[
              styles.explanationCard,
              {
                backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
                borderColor:
                  selectedForCurrent === currentQuestion.correctOption
                    ? isDark
                      ? '#065F46'
                      : '#A7F3D0'
                    : isDark
                    ? '#7F1D1D'
                    : '#FECACA',
              },
            ]}
          >
            <View style={styles.explanationHeader}>
              <View
                style={[
                  styles.feedbackPill,
                  {
                    backgroundColor:
                      selectedForCurrent === currentQuestion.correctOption
                        ? isDark
                          ? 'rgba(16, 185, 129, 0.2)'
                          : '#DCFCE7'
                        : isDark
                        ? 'rgba(239, 68, 68, 0.2)'
                        : '#FEE2E2',
                  },
                ]}
              >
                <Ionicons
                  name={
                    selectedForCurrent === currentQuestion.correctOption
                      ? 'checkmark-circle'
                      : 'close-circle'
                  }
                  size={16}
                  color={
                    selectedForCurrent === currentQuestion.correctOption
                      ? '#10B981'
                      : '#EF4444'
                  }
                />
                <Text
                  style={[
                    styles.feedbackPillText,
                    {
                      color:
                        selectedForCurrent === currentQuestion.correctOption
                          ? isDark
                            ? '#34D399'
                            : '#15803D'
                          : isDark
                          ? '#F87171'
                          : '#B91C1C',
                    },
                  ]}
                >
                  {selectedForCurrent === currentQuestion.correctOption
                    ? 'Correct Answer!'
                    : 'Incorrect'}
                </Text>
              </View>

              <Text style={[styles.correctAnswerLabel, { color: colors.textSecondary }]}>
                Correct Option:{' '}
                <Text style={{ fontWeight: '800', color: '#10B981' }}>
                  {currentQuestion.correctOption}
                </Text>
              </Text>
            </View>

            <View
              style={[
                styles.explanationContent,
                { borderTopColor: isDark ? '#334155' : '#E2E8F0' },
              ]}
            >
              <View style={styles.explanationTitleRow}>
                <Ionicons name="bulb-outline" size={18} color="#8B5CF6" />
                <Text style={[styles.explanationHeading, { color: colors.text }]}>
                  Simple Explanation — English
                </Text>
              </View>
              <Text
                style={[
                  styles.explanationBodyText,
                  { color: isDark ? '#CBD5E1' : '#334155' },
                ]}
              >
                {currentQuestion.explanation?.trim() ||
                  (currentQuestion as any).answer?.trim() ||
                  `Option ${currentQuestion.correctOption} is the correct answer for this question.`}
              </Text>

              {currentQuestion.explanationHindi ? (
                <>
                  <View style={[styles.explanationTitleRow, { marginTop: 16 }]}>
                    <Ionicons name="language-outline" size={18} color="#8B5CF6" />
                    <Text style={[styles.explanationHeading, { color: colors.text }]}>
                      सरल व्याख्या — हिंदी
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.explanationBodyText,
                      { color: isDark ? '#CBD5E1' : '#334155' },
                    ]}
                  >
                    {currentQuestion.explanationHindi.trim()}
                  </Text>
                </>
              ) : null}
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Bar: Previous / Next */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            paddingBottom: Math.max(insets.bottom, 12),
            height: 60 + Math.max(insets.bottom, 12),
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.prevBtn, currentQuestionIndex === 0 && { opacity: 0.3 }]}
          disabled={currentQuestionIndex === 0}
          onPress={handlePrev}
        >
          <Ionicons name="chevron-back" size={20} color={colors.text} />
          <Text style={[styles.prevBtnText, { color: colors.text }]}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.nextBtn, isLastQuestion ? styles.submitBtnHighlight : null]}
          onPress={handleNext}
        >
          <Text style={styles.nextBtnText}>
            {isLastQuestion ? 'Submit Test' : 'Next'}
          </Text>
          <Ionicons
            name={isLastQuestion ? 'checkmark-circle' : 'chevron-forward'}
            size={20}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>

      {/* Submit Confirmation Modal */}
      <Modal visible={showSubmitModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
            <View style={styles.modalIconWrap}>
              <Ionicons
                name={unansweredCount > 0 ? 'alert-circle' : 'checkmark-circle'}
                size={36}
                color={unansweredCount > 0 ? '#F59E0B' : '#10B981'}
              />
            </View>

            <Text style={[styles.modalTitle, { color: colors.text }]}>Submit Exam?</Text>

            <View style={styles.statSummaryBox}>
              <Text style={[styles.summaryStatText, { color: colors.text }]}>
                You have answered <Text style={{ fontWeight: '800', color: '#10B981' }}>{answeredCount}</Text> of {totalQuestions} questions.
              </Text>

              {unansweredCount > 0 && (
                <Text style={styles.unansweredWarning}>
                  You still have <Text style={{ fontWeight: '800' }}>{unansweredCount}</Text> unanswered question{unansweredCount > 1 ? 's' : ''}. Submit anyway?
                </Text>
              )}
            </View>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={[styles.modalCancelBtn, { borderColor: colors.border }]}
                onPress={() => setShowSubmitModal(false)}
              >
                <Text style={[styles.modalCancelText, { color: colors.text }]}>Continue Test</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalSubmitBtn} onPress={handleConfirmSubmit}>
                <Text style={styles.modalSubmitText}>Submit Exam</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
  },
  loadingSubtitle: {
    fontSize: 13,
    marginTop: 6,
  },
  errorHeading: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
  },
  errorDetail: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  backHomeBtn: {
    marginTop: 24,
    backgroundColor: '#7C3AED',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  backHomeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  header: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  exitBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  examTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  headerMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  modeMiniBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  modeMiniBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  diffMiniBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  diffMiniBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  qCounter: {
    fontSize: 12,
  },
  submitTopBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#EDE9FE',
    borderRadius: 8,
  },
  submitTopText: {
    color: '#7C3AED',
    fontSize: 13,
    fontWeight: '700',
  },
  progressTrack: {
    height: 4,
    width: '100%',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#7C3AED',
  },
  scrollBody: {
    padding: 16,
  },
  techTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  techTagText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7C3AED',
  },
  diffTagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  questionCard: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  questionText: {
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 25,
  },
  optionsList: {
    gap: 12,
    marginBottom: 28,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
  },
  optBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optBadgeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  optText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 21,
  },
  radioIndicator: {
    marginLeft: 8,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4F46E5',
  },
  explanationCard: {
    marginTop: 16,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  feedbackPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  feedbackPillText: {
    fontSize: 13,
    fontWeight: '700',
  },
  correctAnswerLabel: {
    fontSize: 13,
  },
  explanationContent: {
    borderTopWidth: 1,
    paddingTop: 12,
  },
  explanationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  explanationHeading: {
    fontSize: 14,
    fontWeight: '700',
  },
  explanationBodyText: {
    fontSize: 14,
    lineHeight: 22,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderTopWidth: 1,
  },
  prevBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  prevBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 12,
  },
  submitBtnHighlight: {
    backgroundColor: '#10B981',
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  modalIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 16,
  },
  statSummaryBox: {
    width: '100%',
    backgroundColor: 'rgba(124, 58, 237, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    gap: 8,
  },
  summaryStatText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
  },
  unansweredWarning: {
    color: '#D97706',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 8,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    fontWeight: '600',
    fontSize: 14,
  },
  modalSubmitBtn: {
    flex: 1,
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSubmitText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
