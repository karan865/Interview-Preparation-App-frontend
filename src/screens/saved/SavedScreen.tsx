import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { questionApi } from '../../api/question.api';
import { Question } from '../../types/question';
import { Card } from '../../components/common/Card';
import { LoadingView } from '../../components/common/LoadingView';
import { EmptyView } from '../../components/common/EmptyView';
import { THEME } from '../../constants/theme';
import { RootStackParamList } from '../../navigation/types';
import { useProgress } from '../../hooks/useProgress';

type RootNavProp = NativeStackNavigationProp<RootStackParamList>;

export const SavedScreen: React.FC = () => {
  const navigation = useNavigation<RootNavProp>();
  const { savedIds, toggleSave } = useProgress();

  const [savedQuestions, setSavedQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const loadSavedQuestions = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      if (savedIds.length === 0) {
        setSavedQuestions([]);
        return;
      }

      // Fetch questions corresponding to saved IDs
      const promises = savedIds.map(async (id) => {
        try {
          return await questionApi.getQuestionById(id);
        } catch {
          return null;
        }
      });

      const results = await Promise.all(promises);
      const validQuestions = results.filter((q): q is Question => q !== null);
      setSavedQuestions(validQuestions);
    } catch (err) {
      console.warn('[SavedScreen] Failed to load questions:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [savedIds]);

  useEffect(() => {
    loadSavedQuestions();
  }, [loadSavedQuestions]);

  const handleOpenQuestion = (question: Question, index: number) => {
    navigation.navigate('QuestionDetail', {
      questionId: question.id || question._id || '',
      question,
      questionsQueue: savedQuestions,
      queueIndex: index,
    });
  };

  if (isLoading && !isRefreshing) {
    return <LoadingView fullScreen message="Loading saved questions..." />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved Questions</Text>
        <Text style={styles.headerSubtitle}>
          {savedQuestions.length} bookmarked for quick revision
        </Text>
      </View>

      {/* List of Saved Questions */}
      <FlatList
        data={savedQuestions}
        keyExtractor={(item) => item.id || item._id || item.question}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={() => loadSavedQuestions(true)} />
        }
        ListEmptyComponent={
          <EmptyView
            title="No Saved Questions"
            description="Tap the bookmark icon on any question to save it here for quick access."
            icon={<Ionicons name="bookmark-outline" size={48} color={THEME.colors.textMuted} />}
          />
        }
        renderItem={({ item, index }) => {
          const qId = item.id || item._id || '';

          return (
            <Card
              variant="elevated"
              style={styles.card}
              onPress={() => handleOpenQuestion(item, index)}
            >
              <View style={styles.cardHeader}>
                <View style={styles.badgeGroup}>
                  {item.difficulty ? (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{item.difficulty.toUpperCase()}</Text>
                    </View>
                  ) : null}
                  {typeof item.technologyId === 'object' && item.technologyId ? (
                    <View style={[styles.badge, styles.techBadge]}>
                      <Text style={styles.techBadgeText}>{(item.technologyId as any).name}</Text>
                    </View>
                  ) : null}
                </View>

                {/* Remove bookmark */}
                <TouchableOpacity
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  onPress={() => toggleSave(qId)}
                >
                  <Ionicons name="bookmark" size={20} color={THEME.colors.primary} />
                </TouchableOpacity>
              </View>

              <Text style={styles.questionText} numberOfLines={3}>
                {item.title || item.question}
              </Text>
            </Card>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.md,
    paddingBottom: THEME.spacing.sm,
    backgroundColor: THEME.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.borderLight,
  },
  headerTitle: {
    fontSize: THEME.typography.fontSize.xl,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text,
  },
  headerSubtitle: {
    fontSize: THEME.typography.fontSize.xs,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  listContent: {
    padding: THEME.spacing.lg,
    gap: THEME.spacing.md,
  },
  card: {
    padding: THEME.spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.xs,
  },
  badgeGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.borderRadius.sm,
    backgroundColor: THEME.colors.surfaceLight,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: THEME.colors.textSecondary,
  },
  techBadge: {
    backgroundColor: THEME.colors.primaryLight,
  },
  techBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: THEME.colors.primary,
  },
  questionText: {
    fontSize: THEME.typography.fontSize.sm,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text,
    marginTop: 4,
    lineHeight: 20,
  },
  answerText: {
    fontSize: THEME.typography.fontSize.xs,
    color: THEME.colors.textSecondary,
    marginTop: 4,
    lineHeight: 16,
  },
});
