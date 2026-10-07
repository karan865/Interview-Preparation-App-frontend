import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useAppSelector } from '../../store/hooks';
import { ExamReviewItem } from '../../types/exam';
import { useTheme } from '../../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProgress } from '../../hooks/useProgress';

type NavProp = NativeStackNavigationProp<RootStackParamList>;
type ReviewRouteProp = RouteProp<RootStackParamList, 'ExamReview'>;
type FilterType = 'all' | 'incorrect' | 'correct';

export const ExamReviewScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<ReviewRouteProp>();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { savedIds, toggleSave } = useProgress();

  const examResult = useAppSelector((state) => state.exam.examResult);
  const initialFilter = route.params?.filter || 'all';
  const [filter, setFilter] = useState<FilterType>(initialFilter);

  const reviewItems: ExamReviewItem[] = examResult?.reviewItems || [];

  const correctCount = reviewItems.filter((item) => item.isCorrect).length;
  const incorrectCount = reviewItems.filter((item) => !item.isCorrect).length;

  const filteredItems = reviewItems.filter((item) => {
    if (filter === 'correct') return item.isCorrect;
    if (filter === 'incorrect') return !item.isCorrect;
    return true;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: Math.max(insets.top, 16) }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header Bar */}
      <View style={[styles.headerBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Review Answers</Text>
          <View style={[styles.modeReviewBadge, { backgroundColor: (examResult?.mode || 'practice') === 'exam' ? (isDark ? '#0C4A6E' : '#E0F2FE') : (isDark ? '#312E81' : '#EEF2FF') }]}>
            <Text style={[styles.modeReviewBadgeText, { color: (examResult?.mode || 'practice') === 'exam' ? (isDark ? '#38BDF8' : '#0284C7') : (isDark ? '#818CF8' : '#4F46E5') }]}>
              {`${(examResult?.difficulty || 'mixed') === 'hard' ? 'Hard' : (examResult?.difficulty || 'mixed') === 'medium' ? 'Medium' : (examResult?.difficulty || 'mixed') === 'easy' ? 'Easy' : 'Mixed'} • ${(examResult?.mode || 'practice') === 'exam' ? 'Exam Mode' : 'Practice Mode'}`}
            </Text>
          </View>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Filter Tabs */}
      <View style={[styles.filterBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.filterChip, filter === 'all' && styles.filterChipActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterChipText, filter === 'all' && styles.filterChipTextActive]}>
            All ({reviewItems.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChip, filter === 'incorrect' && styles.filterChipActiveIncorrect]}
          onPress={() => setFilter('incorrect')}
        >
          <Text
            style={[
              styles.filterChipText,
              filter === 'incorrect' && styles.filterChipTextActiveIncorrect,
            ]}
          >
            Incorrect ({incorrectCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChip, filter === 'correct' && styles.filterChipActiveCorrect]}
          onPress={() => setFilter('correct')}
        >
          <Text
            style={[
              styles.filterChipText,
              filter === 'correct' && styles.filterChipTextActiveCorrect,
            ]}
          >
            Correct ({correctCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Questions Review List */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filteredItems.map((item) => {
          const selectedOptionObj = item.options.find((o) => o.id === item.selectedOption);
          const correctOptionObj = item.options.find((o) => o.id === item.correctOption);

          return (
            <View
              key={item.questionId}
              style={[
                styles.reviewCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: item.isCorrect ? (isDark ? '#065F46' : '#BBF7D0') : (isDark ? '#991B1B' : '#FECACA'),
                },
              ]}
            >
              {/* Question Header */}
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <View
                    style={[
                      styles.statusPill,
                      {
                        backgroundColor: item.isCorrect
                          ? isDark
                            ? '#064E3B'
                            : '#DCFCE7'
                          : isDark
                          ? '#450A0A'
                          : '#FEE2E2',
                      },
                    ]}
                  >
                    <Ionicons
                      name={item.isCorrect ? 'checkmark-circle' : 'close-circle'}
                      size={14}
                      color={item.isCorrect ? '#16A34A' : '#DC2626'}
                    />
                    <Text
                      style={[
                        styles.statusPillText,
                        { color: item.isCorrect ? '#16A34A' : '#DC2626' },
                      ]}
                    >
                      {item.isCorrect ? 'Correct' : item.selectedOption ? 'Incorrect' : 'Unanswered'}
                    </Text>
                  </View>

                  <Text style={[styles.qNum, { color: colors.textSecondary }]}>
                    Question {item.questionIndex} of {reviewItems.length}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  {item.technologyName && (
                    <Text style={styles.techBadge}>{item.technologyName}</Text>
                  )}
                  <TouchableOpacity
                    onPress={() => toggleSave(item.questionId)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons
                      name={savedIds.includes(item.questionId) ? 'bookmark' : 'bookmark-outline'}
                      size={20}
                      color={savedIds.includes(item.questionId) ? '#6366F1' : colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Question Text */}
              <Text style={[styles.qText, { color: colors.text }]}>{item.question}</Text>

              {/* User Selected Answer */}
              <View
                style={[
                  styles.answerBox,
                  {
                    backgroundColor: item.isCorrect
                      ? isDark
                        ? '#064E3B20'
                        : '#F0FDF4'
                      : isDark
                      ? '#450A0A20'
                      : '#FEF2F2',
                    borderColor: item.isCorrect ? '#86EFAC' : '#FCA5A5',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.answerLabel,
                    { color: item.isCorrect ? '#16A34A' : '#DC2626' },
                  ]}
                >
                  Your answer:
                </Text>
                <Text style={[styles.answerText, { color: colors.text }]}>
                  {selectedOptionObj
                    ? `${selectedOptionObj.id}. ${selectedOptionObj.text}`
                    : 'No answer selected (Skipped)'}
                </Text>
              </View>

              {/* Correct Answer (if user got it wrong or skipped) */}
              {!item.isCorrect && correctOptionObj && (
                <View
                  style={[
                    styles.answerBox,
                    {
                      backgroundColor: isDark ? '#064E3B20' : '#F0FDF4',
                      borderColor: '#86EFAC',
                      marginTop: 8,
                    },
                  ]}
                >
                  <Text style={[styles.answerLabel, { color: '#16A34A' }]}>
                    Correct answer:
                  </Text>
                  <Text style={[styles.answerText, { color: colors.text }]}>
                    {correctOptionObj.id}. {correctOptionObj.text}
                  </Text>
                </View>
              )}

              {/* Explanation Section */}
              {item.explanation ? (
                <View style={[styles.explanationBox, { backgroundColor: isDark ? '#1E293B' : '#F8FAFC' }]}>
                  <View style={styles.explanationHeader}>
                    <Ionicons name="bulb-outline" size={16} color="#7C3AED" />
                    <Text style={styles.explanationTitle}>Simple Explanation — English:</Text>
                  </View>
                  <Text style={[styles.explanationText, { color: colors.textSecondary }]}>
                    {item.explanation}
                  </Text>
                </View>
              ) : null}

              {/* Hindi Explanation Section */}
              {item.explanationHindi ? (
                <View style={[styles.explanationBox, { backgroundColor: isDark ? '#1E293B' : '#F8FAFC', marginTop: 12 }]}>
                  <View style={styles.explanationHeader}>
                    <Ionicons name="language-outline" size={16} color="#7C3AED" />
                    <Text style={styles.explanationTitle}>सरल व्याख्या — हिंदी:</Text>
                  </View>
                  <Text style={[styles.explanationText, { color: colors.textSecondary }]}>
                    {item.explanationHindi}
                  </Text>
                </View>
              ) : null}
            </View>
          );
        })}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modeReviewBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  modeReviewBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  filterChipActive: {
    backgroundColor: '#7C3AED',
  },
  filterChipActiveIncorrect: {
    backgroundColor: '#EF4444',
  },
  filterChipActiveCorrect: {
    backgroundColor: '#10B981',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  filterChipTextActiveIncorrect: {
    color: '#FFFFFF',
  },
  filterChipTextActiveCorrect: {
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  reviewCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  qNum: {
    fontSize: 12,
    fontWeight: '500',
  },
  techBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C3AED',
  },
  qText: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 23,
    marginBottom: 14,
  },
  answerBox: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  answerLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  answerText: {
    fontSize: 14,
    lineHeight: 20,
  },
  explanationBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  explanationTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7C3AED',
  },
  explanationText: {
    fontSize: 13,
    lineHeight: 19,
  },
});
