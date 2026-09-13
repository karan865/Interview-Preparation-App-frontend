import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { topicApi } from '../../api/topic.api';
import { PreparationLevel } from '../../types/topic';
import { Card } from '../../components/common/Card';
import { LoadingView } from '../../components/common/LoadingView';
import { ErrorView } from '../../components/common/ErrorView';
import { THEME } from '../../constants/theme';
import { BrowseStackParamList } from '../../navigation/types';
import { parseErrorMessage } from '../../utils/error';

type ScreenRouteProp = RouteProp<BrowseStackParamList, 'BrowseLevels'>;
type ScreenNavProp = NativeStackNavigationProp<BrowseStackParamList, 'BrowseLevels'>;

export const BrowseLevelsScreen: React.FC = () => {
  const route = useRoute<ScreenRouteProp>();
  const navigation = useNavigation<ScreenNavProp>();
  const { technology, topic } = route.params;

  const [levels, setLevels] = useState<PreparationLevel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLevels = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError(null);

    try {
      const data = await topicApi.getPreparationLevels();
      setLevels(data);
    } catch (err) {
      setError(parseErrorMessage(err));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLevels();
  }, [fetchLevels]);

  const handleSelectLevel = (level?: PreparationLevel) => {
    navigation.navigate('BrowseQuestions', { technology, topic, level });
  };

  if (isLoading && !isRefreshing) {
    return <LoadingView fullScreen message="Loading preparation levels..." />;
  }

  if (error && levels.length === 0) {
    return <ErrorView fullScreen message={error} onRetry={() => fetchLevels()} />;
  }

  return (
    <View style={styles.container}>
      {/* Context Breadcrumb */}
      <View style={styles.breadcrumbHeader}>
        <Text style={styles.breadcrumbText}>
          {technology.name} <Ionicons name="chevron-forward" size={12} color={THEME.colors.textMuted} /> {topic.name}
        </Text>
        <Text style={styles.headerTitle}>Select Target Level</Text>
        <Text style={styles.headerSubtitle}>Choose questions based on your experience or role target</Text>
      </View>

      {/* Option: All Levels */}
      <View style={styles.allLevelsContainer}>
        <TouchableOpacity style={styles.allLevelsBtn} onPress={() => handleSelectLevel(undefined)}>
          <View style={styles.allLevelsIconCircle}>
            <Ionicons name="sparkles" size={18} color={THEME.colors.primary} />
          </View>
          <View style={styles.allLevelsTextContainer}>
            <Text style={styles.allLevelsTitle}>All Preparation Levels</Text>
            <Text style={styles.allLevelsSubtitle}>Practice full progression from basics to advanced</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={THEME.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Levels List */}
      <FlatList
        data={levels}
        keyExtractor={(item) => item.id || item._id || item.slug}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => fetchLevels(true)} />}
        renderItem={({ item }) => (
          <Card
            variant="elevated"
            style={styles.levelCard}
            onPress={() => handleSelectLevel(item)}
          >
            <View style={styles.levelRow}>
              <View style={styles.levelBadge}>
                <Text style={styles.levelBadgeText}>{item.order || '•'}</Text>
              </View>
              <View style={styles.levelDetails}>
                <Text style={styles.levelName}>{item.name}</Text>
                {item.description ? (
                  <Text style={styles.levelDesc} numberOfLines={2}>
                    {item.description}
                  </Text>
                ) : null}
              </View>
              <Ionicons name="chevron-forward" size={18} color={THEME.colors.textMuted} />
            </View>
          </Card>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  breadcrumbHeader: {
    padding: THEME.spacing.lg,
    backgroundColor: THEME.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.borderLight,
  },
  breadcrumbText: {
    fontSize: THEME.typography.fontSize.xs,
    color: THEME.colors.primary,
    fontWeight: THEME.typography.fontWeight.semibold,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: THEME.typography.fontSize.lg,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text,
  },
  headerSubtitle: {
    fontSize: THEME.typography.fontSize.xs,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  allLevelsContainer: {
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.md,
  },
  allLevelsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.spacing.md,
    backgroundColor: THEME.colors.primaryLight,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
    gap: THEME.spacing.md,
  },
  allLevelsIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  allLevelsTextContainer: {
    flex: 1,
  },
  allLevelsTitle: {
    fontSize: THEME.typography.fontSize.sm,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.primary,
  },
  allLevelsSubtitle: {
    fontSize: THEME.typography.fontSize.xs,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  listContent: {
    padding: THEME.spacing.lg,
    gap: THEME.spacing.sm,
  },
  levelCard: {
    padding: THEME.spacing.md,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.md,
  },
  levelBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelBadgeText: {
    fontSize: THEME.typography.fontSize.sm,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text,
  },
  levelDetails: {
    flex: 1,
  },
  levelName: {
    fontSize: THEME.typography.fontSize.sm,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text,
  },
  levelDesc: {
    fontSize: THEME.typography.fontSize.xs,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
});
