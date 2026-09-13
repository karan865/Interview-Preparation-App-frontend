import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { resetExamSession } from '../../store/slices/examSlice';
import { useTheme } from '../../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export const ExamResultScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const dispatch = useAppDispatch();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const examResult = useAppSelector((state) => state.exam.examResult);

  if (!examResult) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Ionicons name="document-text-outline" size={48} color={colors.textSecondary} />
        <Text style={[styles.noResultText, { color: colors.text }]}>No recent exam result found.</Text>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('ExamList')}
        >
          <Text style={styles.primaryBtnText}>Go to Exams</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const {
    examTitle,
    score,
    totalQuestions,
    correctAnswers,
    wrongAnswers,
    percentage,
    performanceCategory,
    analysis,
  } = examResult;

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Excellent':
        return '#10B981';
      case 'Good':
        return '#3B82F6';
      case 'Needs Practice':
        return '#F59E0B';
      default:
        return '#EF4444';
    }
  };

  const categoryColor = getCategoryColor(performanceCategory);

  const handleReview = () => {
    navigation.navigate('ExamReview');
  };

  const handleRetake = () => {
    const targetMode = examResult.mode || 'practice';
    const targetDifficulty = examResult.difficulty || 'mixed';
    dispatch(resetExamSession());
    navigation.replace('Exam', {
      examType: examResult.examType,
      mode: targetMode,
      difficulty: targetDifficulty,
      technologySlug: examResult.technologySlug,
      technologyName: examResult.examTitle,
    });
  };

  const handleBackToExams = () => {
    dispatch(resetExamSession());
    navigation.navigate('ExamList');
  };

  const isExamMode = (examResult.mode || 'practice') === 'exam';

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: Math.max(insets.top, 16) }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Celebration Header */}
        <View style={styles.topSection}>
          <View style={[styles.trophyWrap, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#DCFCE7' }]}>
            <Ionicons name="ribbon" size={48} color={categoryColor} />
          </View>
          <Text style={[styles.examHeading, { color: colors.text }]}>
            {examTitle} Complete 🎉
          </Text>

          {/* Mode & Difficulty Badges */}
          <View style={styles.badgesRow}>
            <View style={[styles.modeBadge, { backgroundColor: isExamMode ? (isDark ? '#0C4A6E' : '#E0F2FE') : (isDark ? '#312E81' : '#EEF2FF') }]}>
              <Text style={[styles.modeBadgeText, { color: isExamMode ? (isDark ? '#38BDF8' : '#0284C7') : (isDark ? '#818CF8' : '#4F46E5') }]}>
                {isExamMode ? '📝 Exam Mode' : '🧠 Practice Mode'}
              </Text>
            </View>

            <View style={[styles.diffBadge, { backgroundColor: isDark ? '#1F2937' : '#F1F5F9' }]}>
              <Text style={[styles.diffBadgeText, { color: colors.text }]}>
                {(examResult.difficulty || 'mixed') === 'hard'
                  ? '🔴 Hard'
                  : (examResult.difficulty || 'mixed') === 'medium'
                  ? '🟡 Medium'
                  : (examResult.difficulty || 'mixed') === 'easy'
                  ? '🟢 Easy'
                  : '🎯 Mixed Difficulty'}
              </Text>
            </View>
          </View>

          <Text style={[styles.examSubheading, { color: colors.textSecondary }]}>
            Here is your technical interview readiness breakdown
          </Text>
        </View>

        {/* Big Score Card */}
        <View style={[styles.scoreCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.scoreRow}>
            <View>
              <Text style={[styles.scoreBig, { color: colors.text }]}>
                {score} <Text style={[styles.scoreTotal, { color: colors.textSecondary }]}>/ {totalQuestions}</Text>
              </Text>
              <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>
                {isExamMode ? 'Final Score' : 'Practice Score'}
              </Text>
            </View>

            <View style={[styles.percentageBadge, { backgroundColor: `${categoryColor}20` }]}>
              <Text style={[styles.percentageText, { color: categoryColor }]}>{percentage}%</Text>
            </View>
          </View>

          {/* Performance Progress Bar */}
          <View style={styles.performanceSection}>
            <View style={styles.perfLabelRow}>
              <Text style={[styles.perfLabel, { color: colors.textSecondary }]}>Performance Level</Text>
              <Text style={[styles.perfCategoryText, { color: categoryColor }]}>
                {performanceCategory}
              </Text>
            </View>

            <View style={[styles.barTrack, { backgroundColor: isDark ? '#374151' : '#E5E7EB' }]}>
              <View
                style={[
                  styles.barFill,
                  { width: `${percentage}%`, backgroundColor: categoryColor },
                ]}
              />
            </View>
          </View>

          {/* Performance Summary (Correct, Incorrect, Unanswered) */}
          <View style={[styles.statsGrid, { borderTopColor: colors.border }]}>
            <View style={styles.statBox}>
              <View style={[styles.statDot, { backgroundColor: '#10B981' }]} />
              <View>
                <Text style={[styles.statNum, { color: colors.text }]}>
                  {analysis?.overall.correct ?? correctAnswers}
                </Text>
                <Text style={[styles.statTitle, { color: colors.textSecondary }]}>Correct</Text>
              </View>
            </View>

            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />

            <View style={styles.statBox}>
              <View style={[styles.statDot, { backgroundColor: '#EF4444' }]} />
              <View>
                <Text style={[styles.statNum, { color: colors.text }]}>
                  {analysis?.overall.incorrect ?? wrongAnswers}
                </Text>
                <Text style={[styles.statTitle, { color: colors.textSecondary }]}>Incorrect</Text>
              </View>
            </View>

            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />

            <View style={styles.statBox}>
              <View style={[styles.statDot, { backgroundColor: '#64748B' }]} />
              <View>
                <Text style={[styles.statNum, { color: colors.text }]}>
                  {analysis?.overall.unanswered ?? 0}
                </Text>
                <Text style={[styles.statTitle, { color: colors.textSecondary }]}>Unanswered</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Difficulty Performance Breakdown */}
        {analysis?.difficulty && analysis.difficulty.length > 0 && (
          <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="speedometer-outline" size={20} color={colors.primary || '#6366F1'} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Difficulty Performance</Text>
            </View>

            <View style={styles.breakdownList}>
              {analysis.difficulty.map((d) => {
                const diffLabel = d.difficulty === 'easy' ? '🟢 Easy' : d.difficulty === 'medium' ? '🟡 Medium' : '🔴 Hard';
                const diffColor = d.difficulty === 'easy' ? '#10B981' : d.difficulty === 'medium' ? '#F59E0B' : '#EF4444';
                return (
                  <View key={d.difficulty} style={styles.breakdownItem}>
                    <View style={styles.breakdownLabelRow}>
                      <Text style={[styles.breakdownItemLabel, { color: colors.text }]}>{diffLabel}</Text>
                      <View style={styles.breakdownStatsWrap}>
                        <Text style={[styles.breakdownFraction, { color: colors.textSecondary }]}>
                          {d.correct}/{d.total}
                        </Text>
                        <Text style={[styles.breakdownPct, { color: diffColor }]}>
                          {d.percentage}%
                        </Text>
                      </View>
                    </View>
                    <View style={[styles.itemBarTrack, { backgroundColor: isDark ? '#374151' : '#E2E8F0' }]}>
                      <View style={[styles.itemBarFill, { width: `${d.percentage}%`, backgroundColor: diffColor }]} />
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Subject Performance Breakdown */}
        {analysis?.technologies && analysis.technologies.length > 0 && (
          <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="layers-outline" size={20} color={colors.primary || '#6366F1'} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Subject Performance</Text>
            </View>

            <View style={styles.breakdownList}>
              {analysis.technologies.map((t) => {
                const techColor = t.percentage >= 80 ? '#10B981' : t.percentage >= 60 ? '#3B82F6' : t.percentage >= 40 ? '#F59E0B' : '#EF4444';
                return (
                  <View key={t.technologyName} style={styles.breakdownItem}>
                    <View style={styles.breakdownLabelRow}>
                      <Text style={[styles.breakdownItemLabel, { color: colors.text }]} numberOfLines={1}>
                        {t.technologyName}
                      </Text>
                      <View style={styles.breakdownStatsWrap}>
                        <Text style={[styles.breakdownFraction, { color: colors.textSecondary }]}>
                          {t.correct}/{t.total}
                        </Text>
                        <Text style={[styles.breakdownPct, { color: techColor }]}>
                          {t.percentage}%
                        </Text>
                      </View>
                    </View>
                    <View style={[styles.itemBarTrack, { backgroundColor: isDark ? '#374151' : '#E2E8F0' }]}>
                      <View style={[styles.itemBarFill, { width: `${t.percentage}%`, backgroundColor: techColor }]} />
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* 🎯 Focus Next (Weak Topics) */}
        <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.focusNextEmoji}>🎯</Text>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Focus Next</Text>
          </View>

          {analysis?.weakTopics && analysis.weakTopics.length > 0 ? (
            <View style={styles.weakTopicsList}>
              {analysis.weakTopics.map((w, idx) => (
                <View
                  key={`${w.technologyName}-${w.topicName}-${idx}`}
                  style={[
                    styles.weakTopicRow,
                    {
                      backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : '#FEF2F2',
                      borderColor: isDark ? 'rgba(239, 68, 68, 0.25)' : '#FEE2E2',
                    },
                  ]}
                >
                  <View style={styles.weakTopicNumberBadge}>
                    <Text style={styles.weakTopicNumberText}>{idx + 1}</Text>
                  </View>
                  <View style={styles.weakTopicInfo}>
                    <Text style={[styles.weakTopicTitle, { color: colors.text }]} numberOfLines={1}>
                      {w.technologyName} → {w.topicName}
                    </Text>
                    <Text style={[styles.weakTopicDetails, { color: colors.textSecondary }]}>
                      {w.correct} of {w.total} correct
                    </Text>
                  </View>
                  <View style={styles.weakTopicAccuracyBadge}>
                    <Text style={styles.weakTopicAccuracyText}>{w.accuracy}%</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={[styles.noWeakAreasBox, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.1)' : '#F0FDF4' }]}>
              <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              <Text style={[styles.noWeakAreasText, { color: isDark ? '#34D399' : '#047857' }]}>
                No weak areas identified! Outstanding consistency across all topics.
              </Text>
            </View>
          )}
        </View>

        {/* Recommended Action Card */}
        <View
          style={[
            styles.recommendationCard,
            {
              backgroundColor: isDark
                ? (analysis?.weakTopics?.length ? '#2D1515' : '#132A20')
                : (analysis?.weakTopics?.length ? '#FFF5F5' : '#F0FDF4'),
              borderColor: isDark
                ? (analysis?.weakTopics?.length ? '#7F1D1D' : '#064E3B')
                : (analysis?.weakTopics?.length ? '#FED7D7' : '#BBF7D0'),
            },
          ]}
        >
          <View style={styles.recHeaderRow}>
            <Text style={styles.recIcon}>
              {analysis?.weakTopics?.length ? '💡' : '🔥'}
            </Text>
            <Text style={[styles.recMessage, { color: colors.text }]}>
              {analysis?.recommendation?.message ||
                (analysis?.weakTopics?.length
                  ? 'Review your weak areas before taking another test.'
                  : "Great performance! You're ready for another challenge.")}
            </Text>
          </View>

          {analysis?.weakTopics?.length ? (
            <TouchableOpacity
              style={[styles.primaryActionBtn, { backgroundColor: '#EF4444' }]}
              onPress={() => navigation.navigate('ExamReview', { filter: 'incorrect' })}
              activeOpacity={0.8}
            >
              <Ionicons name="search-outline" size={18} color="#FFFFFF" />
              <Text style={styles.primaryActionBtnText}>Review Weak Areas</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.primaryActionBtn, { backgroundColor: '#10B981' }]}
              onPress={handleBackToExams}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-forward-outline" size={18} color="#FFFFFF" />
              <Text style={styles.primaryActionBtnText}>Take Another Test</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Standard Navigation Action Buttons */}
        <View style={styles.actionList}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.reviewBtn]}
            onPress={handleReview}
            activeOpacity={0.8}
          >
            <Ionicons name="document-text-outline" size={20} color="#FFFFFF" />
            <Text style={styles.reviewBtnText}>Review All Answers</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.retakeBtn, { borderColor: colors.border, backgroundColor: colors.surface }]}
            onPress={handleRetake}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh-outline" size={20} color={colors.text} />
            <Text style={[styles.retakeBtnText, { color: colors.text }]}>Retake Test</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.backBtn]}
            onPress={handleBackToExams}
            activeOpacity={0.7}
          >
            <Text style={[styles.backBtnText, { color: colors.textSecondary }]}>Back to Exams</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
    padding: 24,
  },
  noResultText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 20,
  },
  primaryBtn: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 36,
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  trophyWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  examHeading: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    marginBottom: 8,
  },
  modeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  modeBadgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  diffBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  diffBadgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  examSubheading: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  scoreCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    marginBottom: 28,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreBig: {
    fontSize: 36,
    fontWeight: '900',
  },
  scoreTotal: {
    fontSize: 20,
    fontWeight: '600',
  },
  scoreLabel: {
    fontSize: 13,
    marginTop: 2,
  },
  percentageBadge: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
  },
  percentageText: {
    fontSize: 24,
    fontWeight: '900',
  },
  performanceSection: {
    marginBottom: 20,
  },
  perfLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  perfLabel: {
    fontSize: 13,
  },
  perfCategoryText: {
    fontSize: 15,
    fontWeight: '700',
  },
  barTrack: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  barFill: {
    height: 10,
    borderRadius: 5,
  },
  statsGrid: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 16,
  },
  statBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statNum: {
    fontSize: 18,
    fontWeight: '800',
  },
  statTitle: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    marginHorizontal: 12,
  },
  actionList: {
    gap: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  reviewBtn: {
    backgroundColor: '#7C3AED',
  },
  reviewBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  retakeBtn: {
    borderWidth: 1,
  },
  retakeBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
  backBtn: {
    paddingVertical: 10,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  focusNextEmoji: {
    fontSize: 18,
  },
  breakdownList: {
    gap: 12,
  },
  breakdownItem: {
    gap: 6,
  },
  breakdownLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownItemLabel: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  breakdownStatsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  breakdownFraction: {
    fontSize: 13,
    fontWeight: '500',
  },
  breakdownPct: {
    fontSize: 13,
    fontWeight: '700',
    minWidth: 38,
    textAlign: 'right',
  },
  itemBarTrack: {
    height: 7,
    borderRadius: 4,
    overflow: 'hidden',
  },
  itemBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  weakTopicsList: {
    gap: 10,
  },
  weakTopicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  weakTopicNumberBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weakTopicNumberText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  weakTopicInfo: {
    flex: 1,
    gap: 2,
  },
  weakTopicTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  weakTopicDetails: {
    fontSize: 12,
  },
  weakTopicAccuracyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  weakTopicAccuracyText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '800',
  },
  noWeakAreasBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 12,
  },
  noWeakAreasText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
    lineHeight: 18,
  },
  recommendationCard: {
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 18,
    marginBottom: 20,
    gap: 14,
  },
  recHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  recIcon: {
    fontSize: 22,
    lineHeight: 26,
  },
  recMessage: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    lineHeight: 20,
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  primaryActionBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
