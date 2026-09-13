import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { questionApi } from '../../api/question.api';
import { Question } from '../../types/question';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { LoadingView } from '../../components/common/LoadingView';
import { ErrorView } from '../../components/common/ErrorView';
import { EmptyView } from '../../components/common/EmptyView';
import { THEME } from '../../constants/theme';
import { RootStackParamList } from '../../navigation/types';
import { progressStorage } from '../../services/progressStorage';
import { parseErrorMessage } from '../../utils/error';

type ScreenRouteProp = RouteProp<RootStackParamList, 'QuickRevision'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const QuickRevisionScreen: React.FC = () => {
  const route = useRoute<ScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { technologyId } = route.params || {};

  const [revisionQueue, setRevisionQueue] = useState<Question[]>([]);
  const [composition, setComposition] = useState({ weak: 0, review: 0, important: 0, newQ: 0 });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const prepareQueue = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Fetch available questions
      const params: Record<string, string> = { limit: '100' };
      if (technologyId) params.technology = technologyId;

      const response = await questionApi.getQuestions(params);
      const allQuestions = response.questions || [];

      if (allQuestions.length === 0) {
        setRevisionQueue([]);
        setIsLoading(false);
        return;
      }

      // 2. Load local progress
      const localProgress = await progressStorage.getAllProgress();

      // 3. Partition into priority buckets
      const weakBucket: Question[] = [];
      const reviewBucket: Question[] = [];
      const importantBucket: Question[] = [];
      const unpracticedBucket: Question[] = [];

      allQuestions.forEach((q) => {
        const id = q.id || q._id || '';
        const progress = localProgress[id];

        if (progress?.status === 'weak') {
          weakBucket.push(q);
        } else if (progress?.status === 'review') {
          reviewBucket.push(q);
        } else if (q.isImportant) {
          importantBucket.push(q);
        } else if (!progress) {
          unpracticedBucket.push(q);
        }
      });

      // 4. Assemble balanced session (Target: ~10 questions)
      // Priorities: Weak (up to 4) -> Review (up to 3) -> Important (up to 2) -> Unpracticed (remainder)
      const selected: Question[] = [
        ...weakBucket.slice(0, 4),
        ...reviewBucket.slice(0, 3),
        ...importantBucket.slice(0, 2),
      ];

      const remainingNeeded = Math.max(0, 10 - selected.length);
      selected.push(...unpracticedBucket.slice(0, remainingNeeded));

      // If still fewer than 10, fill from remaining questions
      if (selected.length < 10) {
        const selectedIds = new Set(selected.map((q) => q.id || q._id));
        const extras = allQuestions.filter((q) => !selectedIds.has(q.id || q._id));
        selected.push(...extras.slice(0, 10 - selected.length));
      }

      setRevisionQueue(selected);
      setComposition({
        weak: Math.min(weakBucket.length, 4),
        review: Math.min(reviewBucket.length, 3),
        important: Math.min(importantBucket.length, 2),
        newQ: selected.length - (Math.min(weakBucket.length, 4) + Math.min(reviewBucket.length, 3) + Math.min(importantBucket.length, 2)),
      });
    } catch (err) {
      setError(parseErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [technologyId]);

  useEffect(() => {
    prepareQueue();
  }, [prepareQueue]);

  const handleStartRevision = () => {
    if (revisionQueue.length === 0) return;
    const firstQ = revisionQueue[0];
    navigation.navigate('QuestionDetail', {
      questionId: firstQ.id || firstQ._id || '',
      question: firstQ,
      questionsQueue: revisionQueue,
      queueIndex: 0,
    });
  };

  if (isLoading) {
    return <LoadingView fullScreen message="Building today's revision queue..." />;
  }

  if (error) {
    return <ErrorView fullScreen message={error} onRetry={prepareQueue} />;
  }

  if (revisionQueue.length === 0) {
    return (
      <EmptyView
        fullScreen
        title="No Questions for Revision"
        description="Browse questions to start tracking your revision progress."
        actionTitle="Browse Topics"
        onAction={() => navigation.goBack()}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={THEME.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daily Quick Revision</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {/* Sprint Hero Card */}
        <Card variant="elevated" style={styles.heroCard}>
          <View style={styles.iconCircle}>
            <Ionicons name="flash" size={32} color={THEME.colors.accent} />
          </View>
          <Text style={styles.heroTitle}>Today's 10-Question Workout</Text>
          <Text style={styles.heroSubtitle}>
            A smart revision blend targeting your weakest areas first, followed by high-yield interview topics.
          </Text>
        </Card>

        {/* Composition Breakdown */}
        <Card variant="outlined" style={styles.breakdownCard}>
          <Text style={styles.breakdownTitle}>Queue Composition</Text>

          <View style={styles.statRow}>
            <View style={[styles.statDot, { backgroundColor: THEME.colors.danger }]} />
            <Text style={styles.statLabel}>Weak Questions to Strengthen</Text>
            <Text style={styles.statVal}>{composition.weak}</Text>
          </View>

          <View style={styles.statRow}>
            <View style={[styles.statDot, { backgroundColor: THEME.colors.warning }]} />
            <Text style={styles.statLabel}>Items Needing Periodic Review</Text>
            <Text style={styles.statVal}>{composition.review}</Text>
          </View>

          <View style={styles.statRow}>
            <View style={[styles.statDot, { backgroundColor: THEME.colors.primary }]} />
            <Text style={styles.statLabel}>High-Yield Interview Questions</Text>
            <Text style={styles.statVal}>{composition.important}</Text>
          </View>

          <View style={styles.statRow}>
            <View style={[styles.statDot, { backgroundColor: THEME.colors.success }]} />
            <Text style={styles.statLabel}>Fresh Practice Questions</Text>
            <Text style={styles.statVal}>{Math.max(0, composition.newQ)}</Text>
          </View>
        </Card>

        {/* Start Button */}
        <Button
          title={`Start Revision (${revisionQueue.length} Questions)`}
          onPress={handleStartRevision}
          variant="primary"
          size="lg"
          style={styles.startBtn}
          icon={<Ionicons name="play" size={20} color="#FFF" />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.md,
    backgroundColor: THEME.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.borderLight,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: THEME.typography.fontSize.base,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text,
  },
  content: {
    padding: THEME.spacing.lg,
    flex: 1,
    justifyContent: 'center',
  },
  heroCard: {
    alignItems: 'center',
    padding: THEME.spacing.xl,
    marginBottom: THEME.spacing.lg,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: THEME.colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.spacing.md,
  },
  heroTitle: {
    fontSize: THEME.typography.fontSize.lg,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: THEME.typography.fontSize.xs,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  breakdownCard: {
    padding: THEME.spacing.lg,
    marginBottom: THEME.spacing.xl,
  },
  breakdownTitle: {
    fontSize: THEME.typography.fontSize.sm,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text,
    marginBottom: THEME.spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.borderLight,
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: THEME.spacing.sm,
  },
  statLabel: {
    flex: 1,
    fontSize: THEME.typography.fontSize.xs,
    color: THEME.colors.textSecondary,
  },
  statVal: {
    fontSize: THEME.typography.fontSize.sm,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text,
  },
  startBtn: {
    width: '100%',
  },
});
