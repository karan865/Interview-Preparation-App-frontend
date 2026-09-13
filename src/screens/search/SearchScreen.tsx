import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { searchApi } from '../../api/search.api';
import { technologyApi } from '../../api/technology.api';
import { Question } from '../../types/question';
import { Technology } from '../../types/technology';
import { Card } from '../../components/common/Card';
import { EmptyView } from '../../components/common/EmptyView';
import { THEME } from '../../constants/theme';
import { RootStackParamList, MainTabParamList } from '../../navigation/types';

type RootNavProp = NativeStackNavigationProp<RootStackParamList>;
type SearchRouteProp = RouteProp<MainTabParamList, 'Search'>;

const SUGGESTIONS = [
  'useState',
  'event loop',
  'JWT',
  'MongoDB indexing',
  'Git rebase',
  'React performance',
];

const LEVEL_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Junior', value: 'junior' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Advanced', value: 'advanced' },
];

const DIFFICULTY_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Easy', value: 'easy' },
  { label: 'Medium', value: 'medium' },
  { label: 'Hard', value: 'hard' },
];

export const SearchScreen: React.FC = () => {
  const navigation = useNavigation<RootNavProp>();
  const route = useRoute<SearchRouteProp>();

  const initialQuery = route.params?.initialQuery || '';

  const [query, setQuery] = useState<string>(initialQuery);
  const [results, setResults] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  // Filter states
  const [selectedTech, setSelectedTech] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [technologies, setTechnologies] = useState<Technology[]>([]);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load technology list for simple search filter
  useEffect(() => {
    technologyApi
      .getTechnologies()
      .then((data) => setTechnologies(data))
      .catch((err) => console.warn('[SearchScreen] Tech load failed:', err));
  }, []);

  const performSearch = useCallback(
    async (
      searchQuery: string,
      tech = selectedTech,
      lvl = selectedLevel,
      diff = selectedDifficulty
    ) => {
      const trimmed = searchQuery.trim();
      if (!trimmed) {
        setResults([]);
        setIsLoading(false);
        setHasSearched(false);
        return;
      }

      setIsLoading(true);
      setHasSearched(true);
      try {
        const params: any = { q: trimmed, limit: 40 };
        if (tech !== 'all') params.technology = tech;
        if (lvl !== 'all') params.level = lvl;
        if (diff !== 'all') params.difficulty = diff;

        const res = await searchApi.searchQuestions(params);
        setResults(res.questions || []);
      } catch (err) {
        console.warn('[SearchScreen] Search request failed:', err);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedTech, selectedLevel, selectedDifficulty]
  );

  // Handle initial query if passed via route
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      performSearch(initialQuery);
    }
  }, [initialQuery, performSearch]);

  const handleChangeText = (text: string) => {
    setQuery(text);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!text.trim()) {
      setResults([]);
      setHasSearched(false);
      setIsLoading(false);
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      performSearch(text);
    }, 350);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
    setIsLoading(false);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    performSearch(suggestion);
  };

  // When a filter is selected, trigger search immediately if query is non-empty
  const handleFilterTech = (techSlug: string) => {
    setSelectedTech(techSlug);
    if (query.trim()) {
      performSearch(query, techSlug, selectedLevel, selectedDifficulty);
    }
  };

  const handleFilterLevel = (lvl: string) => {
    setSelectedLevel(lvl);
    if (query.trim()) {
      performSearch(query, selectedTech, lvl, selectedDifficulty);
    }
  };

  const handleFilterDifficulty = (diff: string) => {
    setSelectedDifficulty(diff);
    if (query.trim()) {
      performSearch(query, selectedTech, selectedLevel, diff);
    }
  };

  const handleOpenQuestion = (question: Question, index: number) => {
    navigation.navigate('QuestionDetail', {
      questionId: question.id || question._id || '',
      question,
      questionsQueue: results,
      queueIndex: index,
    });
  };

  const getDisplayLevel = (q: Question): 'Junior' | 'Intermediate' | 'Advanced' => {
    if (!q.preparationLevels || q.preparationLevels.length === 0) return 'Intermediate';
    const raw = q.preparationLevels[0];
    const name = (
      typeof raw === 'object' && raw !== null
        ? (raw as any).name || (raw as any).slug
        : String(raw)
    ).toLowerCase();

    if (name.includes('junior') || name.includes('foundation') || name.includes('beginner')) {
      return 'Junior';
    }
    if (name.includes('advanced') || name.includes('expert') || name.includes('senior')) {
      return 'Advanced';
    }
    return 'Intermediate';
  };

  const renderLevelBadge = (level: 'Junior' | 'Intermediate' | 'Advanced') => {
    let color = '#B45309';
    let bg = '#FEF3C7';

    if (level === 'Junior') {
      color = '#047857';
      bg = '#D1FAE5';
    } else if (level === 'Advanced') {
      color = '#4338CA';
      bg = '#E0E7FF';
    }

    return (
      <View style={[styles.badge, { backgroundColor: bg }]}>
        <Text style={[styles.badgeText, { color }]}>{level}</Text>
      </View>
    );
  };

  const renderDifficultyBadge = (diff?: string) => {
    const d = (diff || 'medium').toLowerCase();
    let color: string = THEME.colors.warning;
    let bg: string = THEME.colors.warningBg;
    if (d === 'easy') {
      color = THEME.colors.success;
      bg = THEME.colors.successBg;
    } else if (d === 'hard') {
      color = THEME.colors.danger;
      bg = THEME.colors.dangerBg;
    }

    return (
      <View style={[styles.badge, { backgroundColor: bg }]}>
        <Text style={[styles.badgeText, { color }]}>
          {d.charAt(0).toUpperCase() + d.slice(1)}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 1. SEARCH HEADER */}
      <View style={styles.searchHeader}>
        <Text style={styles.headerTitle}>Search Questions</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="search" size={20} color={THEME.colors.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="Search interview questions..."
            placeholderTextColor={THEME.colors.textMuted}
            value={query}
            onChangeText={handleChangeText}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 ? (
            <TouchableOpacity onPress={handleClear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={18} color={THEME.colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Suggested Queries Chips */}
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsLabel}>Try:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionRow}>
            {SUGGESTIONS.map((sug) => (
              <TouchableOpacity
                key={sug}
                style={styles.suggestionChip}
                onPress={() => handleSelectSuggestion(sug)}
                activeOpacity={0.7}
              >
                <Text style={styles.suggestionText}>{sug}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 3. SEARCH FILTERS (Technology, Level, Difficulty) */}
        <View style={styles.filtersWrapper}>
          {/* Technology Filter */}
          {technologies.length > 0 ? (
            <View style={styles.filterRow}>
              <Text style={styles.filterRowLabel}>Tech:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                <TouchableOpacity
                  style={[styles.filterChip, selectedTech === 'all' && styles.filterChipActive]}
                  onPress={() => handleFilterTech('all')}
                >
                  <Text style={[styles.filterChipText, selectedTech === 'all' && styles.filterChipTextActive]}>
                    All
                  </Text>
                </TouchableOpacity>
                {technologies.map((t) => (
                  <TouchableOpacity
                    key={t.slug}
                    style={[styles.filterChip, selectedTech === t.slug && styles.filterChipActive]}
                    onPress={() => handleFilterTech(t.slug)}
                  >
                    <Text style={[styles.filterChipText, selectedTech === t.slug && styles.filterChipTextActive]}>
                      {t.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ) : null}

          {/* Level Filter */}
          <View style={styles.filterRow}>
            <Text style={styles.filterRowLabel}>Level:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
              {LEVEL_FILTERS.map((lvl) => (
                <TouchableOpacity
                  key={lvl.value}
                  style={[styles.filterChip, selectedLevel === lvl.value && styles.filterChipActive]}
                  onPress={() => handleFilterLevel(lvl.value)}
                >
                  <Text style={[styles.filterChipText, selectedLevel === lvl.value && styles.filterChipTextActive]}>
                    {lvl.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Difficulty Filter */}
          <View style={styles.filterRow}>
            <Text style={styles.filterRowLabel}>Diff:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
              {DIFFICULTY_FILTERS.map((diff) => (
                <TouchableOpacity
                  key={diff.value}
                  style={[styles.filterChipSmall, selectedDifficulty === diff.value && styles.filterChipSmallActive]}
                  onPress={() => handleFilterDifficulty(diff.value)}
                >
                  <Text style={[styles.filterChipSmallText, selectedDifficulty === diff.value && styles.filterChipSmallTextActive]}>
                    {diff.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>

      {/* 2. SEARCH RESULTS & 8. EMPTY SEARCH */}
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color={THEME.colors.primary} />
          <Text style={styles.loaderText}>Searching interview questions...</Text>
        </View>
      ) : hasSearched && results.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={48} color={THEME.colors.textMuted} />
          <Text style={styles.emptyTitle}>No interview questions found.</Text>
          <Text style={styles.emptyDesc}>
            Try another keyword or remove filters to find questions.
          </Text>
          <View style={styles.emptySuggestionsRow}>
            {SUGGESTIONS.slice(0, 3).map((s) => (
              <TouchableOpacity
                key={s}
                style={styles.suggestionChip}
                onPress={() => handleSelectSuggestion(s)}
              >
                <Text style={styles.suggestionText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : !hasSearched ? (
        <View style={styles.initialStateContainer}>
          <View style={styles.initialIconCircle}>
            <Ionicons name="search-outline" size={32} color={THEME.colors.primary} />
          </View>
          <Text style={styles.initialTitle}>Search Question Bank</Text>
          <Text style={styles.initialDesc}>
            Type any programming concept, keyword, or interview topic above to find questions across all technologies.
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item, index) => item.id || item._id || `s_${index}`}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={() => performSearch(query)}
              colors={[THEME.colors.primary]}
              tintColor={THEME.colors.primary}
            />
          }
          renderItem={({ item, index }) => {
            const formattedNumber = String(index + 1).padStart(2, '0');
            const levelTier = getDisplayLevel(item);
            const techName =
              typeof item.technologyId === 'object' && item.technologyId
                ? (item.technologyId as any).name
                : '';
            const topicName =
              typeof item.topicId === 'object' && item.topicId
                ? (item.topicId as any).name
                : '';

            return (
              <Card
                variant="elevated"
                style={styles.resultCard}
                onPress={() => handleOpenQuestion(item, index)}
              >
                {/* Top Row: 01 Question Number */}
                <View style={styles.cardTopRow}>
                  <View style={styles.numberBadge}>
                    <Text style={styles.numberText}>{formattedNumber}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={THEME.colors.textMuted} />
                </View>

                {/* Question Text */}
                <Text style={styles.questionTitle} numberOfLines={2}>
                  {item.title || item.question}
                </Text>

                {/* Technology • Topic */}
                <View style={styles.techTopicRow}>
                  <Text style={styles.techTopicText} numberOfLines={1}>
                    {techName}
                    {topicName ? ` • ${topicName}` : ''}
                  </Text>
                </View>

                {/* Badges: [Level] [Difficulty] */}
                <View style={styles.badgesRow}>
                  {renderLevelBadge(levelTier)}
                  {renderDifficultyBadge(item.difficulty)}
                </View>
              </Card>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  searchHeader: {
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: THEME.spacing.md,
    paddingTop: THEME.spacing.md,
    paddingBottom: THEME.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.borderLight,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text,
    marginBottom: THEME.spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceLight,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: 9,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.borderLight,
    gap: THEME.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.text,
    padding: 0,
  },
  suggestionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  suggestionsLabel: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    fontWeight: '600',
  },
  suggestionRow: {
    gap: 6,
  },
  suggestionChip: {
    backgroundColor: THEME.colors.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.full,
    borderWidth: 1,
    borderColor: THEME.colors.borderLight,
  },
  suggestionText: {
    fontSize: 11,
    color: THEME.colors.primary,
    fontWeight: THEME.typography.fontWeight.medium,
  },
  filtersWrapper: {
    marginTop: 8,
    gap: 4,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.borderLight,
    paddingTop: 6,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterRowLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textMuted,
    width: 38,
  },
  filterScroll: {
    gap: 6,
    paddingVertical: 2,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.full,
    backgroundColor: THEME.colors.surfaceLight,
    borderWidth: 1,
    borderColor: THEME.colors.borderLight,
  },
  filterChipActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  filterChipText: {
    fontSize: 10,
    color: THEME.colors.textSecondary,
    fontWeight: THEME.typography.fontWeight.medium,
  },
  filterChipTextActive: {
    color: '#FFF',
    fontWeight: THEME.typography.fontWeight.bold,
  },
  filterChipSmall: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: THEME.borderRadius.full,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.borderLight,
  },
  filterChipSmallActive: {
    backgroundColor: '#374151',
    borderColor: '#374151',
  },
  filterChipSmallText: {
    fontSize: 9,
    color: THEME.colors.textMuted,
    fontWeight: THEME.typography.fontWeight.medium,
  },
  filterChipSmallTextActive: {
    color: '#FFF',
    fontWeight: THEME.typography.fontWeight.bold,
  },
  listContent: {
    padding: THEME.spacing.md,
    gap: THEME.spacing.sm,
    paddingBottom: THEME.spacing.xl,
  },
  resultCard: {
    padding: THEME.spacing.md,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  numberBadge: {
    backgroundColor: THEME.colors.surfaceLight,
    borderWidth: 1,
    borderColor: THEME.colors.borderLight,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
  },
  numberText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: THEME.colors.primary,
  },
  questionTitle: {
    fontSize: 14,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text,
    lineHeight: 20,
    marginBottom: 4,
  },
  techTopicRow: {
    marginBottom: 6,
  },
  techTopicText: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    fontWeight: THEME.typography.fontWeight.medium,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: THEME.typography.fontWeight.bold,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loaderText: {
    fontSize: THEME.typography.fontSize.xs,
    color: THEME.colors.textMuted,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: THEME.spacing.xl,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text,
    marginTop: 8,
  },
  emptyDesc: {
    fontSize: THEME.typography.fontSize.xs,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
  },
  emptySuggestionsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 12,
  },
  initialStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: THEME.spacing.xl,
  },
  initialIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: THEME.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.spacing.md,
  },
  initialTitle: {
    fontSize: THEME.typography.fontSize.base,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text,
    marginBottom: 4,
  },
  initialDesc: {
    fontSize: THEME.typography.fontSize.xs,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: THEME.spacing.md,
  },
});
