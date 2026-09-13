import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Card } from '../../components/common/Card';
import { LoadingView } from '../../components/common/LoadingView';
import { ErrorView } from '../../components/common/ErrorView';
import { EmptyView } from '../../components/common/EmptyView';
import { technologyApi } from '../../api/technology.api';
import { Technology } from '../../types/technology';
import { THEME } from '../../constants/theme';
import { parseErrorMessage } from '../../utils/error';

export const TechnologiesScreen: React.FC = () => {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTechnologies = useCallback(async () => {
    try {
      setError(null);
      const data = await technologyApi.getTechnologies();
      setTechnologies(data);
    } catch (err) {
      setError(parseErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadTechnologies();
  }, [loadTechnologies]);

  const onRefresh = () => {
    setRefreshing(true);
    loadTechnologies();
  };

  if (loading) {
    return <LoadingView fullScreen message="Loading technologies..." />;
  }

  if (error) {
    return (
      <ScreenContainer>
        <ErrorView message={error} onRetry={loadTechnologies} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable refreshing={refreshing} onRefresh={onRefresh}>
      <Text style={styles.title}>Technologies</Text>
      <Text style={styles.subtitle}>Explore questions categorized by technology stack</Text>

      {technologies.length === 0 ? (
        <EmptyView
          title="No Technologies Available"
          message="No active technologies were found in the system."
          iconName="hardware-chip-outline"
        />
      ) : (
        <View style={styles.list}>
          {technologies.map((item) => (
            <Card key={item._id} variant="outlined" style={styles.card}>
              <View style={styles.cardContent}>
                <View style={styles.iconCircle}>
                  <Ionicons name="code-slash-outline" size={24} color={THEME.colors.primary} />
                </View>
                <View style={styles.info}>
                  <Text style={styles.techName}>{item.name}</Text>
                  <Text style={styles.categoryBadge}>{item.category.toUpperCase()}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={THEME.colors.textMuted} />
              </View>
            </Card>
          ))}
        </View>
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: THEME.typography.fontSize['2xl'],
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text,
    marginBottom: THEME.spacing.xs,
  },
  subtitle: {
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.textSecondary,
    marginBottom: THEME.spacing.lg,
  },
  list: {
    gap: THEME.spacing.sm,
  },
  card: {
    padding: THEME.spacing.md,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.spacing.md,
  },
  info: {
    flex: 1,
  },
  techName: {
    fontSize: THEME.typography.fontSize.base,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text,
    marginBottom: 2,
  },
  categoryBadge: {
    fontSize: 10,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.textSecondary,
    letterSpacing: 0.5,
  },
});
