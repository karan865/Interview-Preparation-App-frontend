import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { questionApi } from '../../api/question.api';
import { technologyApi } from '../../api/technology.api';
import { Question } from '../../types/question';
import { Technology } from '../../types/technology';
import { LoadingView } from '../../components/common/LoadingView';
import { ErrorView } from '../../components/common/ErrorView';
import { EmptyView } from '../../components/common/EmptyView';
import { RootStackParamList, BrowseStackParamList } from '../../navigation/types';
import { useProgress } from '../../hooks/useProgress';
import { useTheme } from '../../context/ThemeContext';
import { parseErrorMessage } from '../../utils/error';
import { MemoryCache, registerCache } from '../../utils/cacheManager';

type ScreenRouteProp = RouteProp<BrowseStackParamList, 'BrowseQuestions'>;
type RootNavProp = NativeStackNavigationProp<RootStackParamList>;

const PAGE_SIZE = 20;

// Module-level TTL-managed query cache: key -> { questions, total, totalPages }
const queryCache = registerCache(
  new MemoryCache<{ questions: Question[]; total: number; totalPages: number }>()
);

// Level filter options matching UI
const LEVEL_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Junior', value: 'junior', bg: '#DCFCE7', color: '#16A34A' },
  { label: 'Intermediate', value: 'intermediate', bg: '#FFEDD5', color: '#EA580C' },
  { label: 'Advanced', value: 'advanced', bg: '#FEE2E2', color: '#EF4444' },
];

// Question Type filter options matching UI
const QUESTION_TYPES = [
  { label: 'All', value: 'all' },
  { label: 'Conceptual', value: 'conceptual', bg: '#EFF6FF', color: '#2563EB', icon: 'bulb-outline' },
  { label: 'Code', value: 'code', bg: '#F3E8FF', color: '#9333EA', icon: 'code-slash' },
  { label: 'Comparison', value: 'comparison', bg: '#ECFDF5', color: '#059669', icon: 'git-compare-outline' },
  { label: 'Best Practices', value: 'best_practices', bg: '#FFFBEB', color: '#D97706', icon: 'bulb' },
];

// Accent color cycle for question cards (matching screenshot: purple, sky-blue, green, amber, pink)
const CARD_ACCENTS = [
  { bar: '#6366F1', badgeBg: '#EEF2FF', badgeText: '#6366F1' },
  { bar: '#0EA5E9', badgeBg: '#E0F2FE', badgeText: '#0284C7' },
  { bar: '#10B981', badgeBg: '#DCFCE7', badgeText: '#16A34A' },
  { bar: '#F59E0B', badgeBg: '#FEF3C7', badgeText: '#D97706' },
  { bar: '#EC4899', badgeBg: '#FCE7F3', badgeText: '#DB2777' },
];

export const BrowseQuestionsScreen: React.FC = () => {
  const { theme, isDark } = useTheme();
  const route = useRoute<ScreenRouteProp>();
  const navigation = useNavigation<RootNavProp>();
  const {
    technology: initialTech,
    topic,
    level: initialLevel,
    levelSlug: initialLevelSlug,
  } = route.params || {};

  const { savedIds, toggleSave } = useProgress();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [techList, setTechList] = useState<Technology[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Filter states
  const [selectedTechSlug, setSelectedTechSlug] = useState<string>(
    initialTech?.slug || 'all'
  );
  const [selectedLevel, setSelectedLevel] = useState<string>(
    initialLevelSlug || initialLevel?.slug?.toLowerCase() || 'all'
  );
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isFetchingRef = useRef<boolean>(false);

  // Sync route params if changed
  useEffect(() => {
    if (initialTech?.slug && initialTech.slug !== selectedTechSlug) {
      setSelectedTechSlug(initialTech.slug);
    }
  }, [initialTech?.slug]);

  useEffect(() => {
    const targetLvl = initialLevelSlug || initialLevel?.slug?.toLowerCase();
    if (targetLvl && targetLvl !== selectedLevel) {
      setSelectedLevel(targetLvl);
    }
  }, [initialLevelSlug, initialLevel?.slug]);

  // Load technologies for horizontal pill selector
  useEffect(() => {
    technologyApi
      .getTechnologies()
      .then((data) => setTechList(data || []))
      .catch((err) => console.warn('[BrowseQuestions] Tech list load failed:', err));
  }, []);

  const topicKey = topic?.slug || topic?.id || topic?._id || '';

  const getCacheKey = (p: number, tech: string, lvl: string, type: string) => {
    return `${tech}_${topicKey}_${lvl}_${type}_p${p}`;
  };

  const fetchQuestions = useCallback(
    async (targetPage: number, isRefresh = false) => {
      if (isFetchingRef.current && !isRefresh) return;
      isFetchingRef.current = true;

      const cacheKey = getCacheKey(targetPage, selectedTechSlug, selectedLevel, selectedType);

      if (!isRefresh && queryCache.has(cacheKey)) {
        const cached = queryCache.get(cacheKey)!;
        setTotalCount(cached.total);
        setHasMore(targetPage < cached.totalPages);
        if (targetPage === 1) {
          setQuestions(cached.questions);
        } else {
          setQuestions((prev) => {
            const existingIds = new Set(prev.map((q) => q.id || q._id));
            const newUnique = cached.questions.filter((q) => !existingIds.has(q.id || q._id));
            return [...prev, ...newUnique];
          });
        }
        setPage(targetPage);
        setIsLoading(false);
        setIsLoadingMore(false);
        isFetchingRef.current = false;
        return;
      }

      if (isRefresh || targetPage === 1) {
        if (!isRefresh) {
          setIsLoading(true);
          setQuestions([]);
        }
      } else {
        setIsLoadingMore(true);
      }
      setError(null);

      try {
        const params: Record<string, any> = {
          page: targetPage,
          limit: PAGE_SIZE,
        };

        if (selectedTechSlug !== 'all') {
          params.technology = selectedTechSlug;
        }
        if (topic) {
          params.topic = topicKey;
        }
        if (selectedLevel !== 'all') {
          params.level = selectedLevel;
        }
        if (selectedType !== 'all') {
          params.questionType = selectedType;
        }

        const response = await questionApi.getQuestions(params);
        const incoming = response.questions || [];
        const total =
          (response as any).pagination?.totalItems ??
          (response as any).pagination?.total ??
          incoming.length;
        const totalPages = (response as any).pagination?.totalPages ?? 1;

        queryCache.set(cacheKey, {
          questions: incoming,
          total,
          totalPages,
        });

        setTotalCount(total);
        setHasMore(targetPage < totalPages && incoming.length > 0);

        if (targetPage === 1 || isRefresh) {
          setQuestions(incoming);
        } else {
          setQuestions((prev) => {
            const existingIds = new Set(prev.map((q) => q.id || q._id));
            const newUnique = incoming.filter((q) => !existingIds.has(q.id || q._id));
            return [...prev, ...newUnique];
          });
        }
        setPage(targetPage);
      } catch (err) {
        setError(parseErrorMessage(err));
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
        setIsRefreshing(false);
        isFetchingRef.current = false;
      }
    },
    [selectedTechSlug, topic, topicKey, selectedLevel, selectedType]
  );

  useEffect(() => {
    setPage(1);
    fetchQuestions(1, false);
  }, [fetchQuestions]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    const prefix = `${selectedTechSlug}_${topicKey}_${selectedLevel}_${selectedType}_`;
    queryCache.deletePrefix(prefix);
    fetchQuestions(1, true);
  };

  const handleLoadMore = () => {
    if (!hasMore || isLoading || isLoadingMore || isRefreshing || isFetchingRef.current) {
      return;
    }
    fetchQuestions(page + 1, false);
  };

  const handleClearFilters = () => {
    if (!initialTech) setSelectedTechSlug('all');
    setSelectedLevel('all');
    setSelectedType('all');
    setSearchQuery('');
  };

  const handleOpenQuestion = (question: Question, index: number) => {
    navigation.navigate('QuestionDetail', {
      questionId: question.id || question._id || '',
      question,
      questionsQueue: questions,
      queueIndex: index,
    });
  };

  // Helper to extract clean summary snippet without markdown tags
  const getQuestionSnippet = (q: Question) => {
    const raw = (q as any).summary || q.explanation || q.interviewAnswer || q.answer || '';
    const clean = raw
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/[#*>\-_[\]()]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (!clean) return 'Understand the core concepts, common edge cases, and practical trade-offs.';
    return clean.length > 120 ? clean.slice(0, 120) + '...' : clean;
  };

  // Normalized display level
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

  // Filter questions client-side if searchQuery is typed
  const filteredQuestions = useMemo(() => {
    if (!searchQuery.trim()) return questions;
    const query = searchQuery.toLowerCase().trim();
    return questions.filter((q) => {
      const title = (q.title || q.question || '').toLowerCase();
      const answer = (q.answer || '').toLowerCase();
      return title.includes(query) || answer.includes(query);
    });
  }, [questions, searchQuery]);

  // Tech Brand Badge Icon
  const renderTechIcon = (slug: string, name: string) => {
    const s = slug.toLowerCase();
    if (s.includes('javascript') || s === 'js') {
      return (
        <View style={[styles.techIconBadge, { backgroundColor: '#F7DF1E' }]}>
          <Text style={[styles.techIconText, { color: '#000000' }]}>JS</Text>
        </View>
      );
    }
    if (s.includes('typescript') || s === 'ts') {
      return (
        <View style={[styles.techIconBadge, { backgroundColor: '#3178C6' }]}>
          <Text style={[styles.techIconText, { color: '#FFFFFF' }]}>TS</Text>
        </View>
      );
    }
    if (s.includes('react')) {
      return <Ionicons name="logo-react" size={17} color="#06B6D4" style={{ marginRight: 5 }} />;
    }
    if (s.includes('node')) {
      return <Ionicons name="logo-nodejs" size={17} color="#16A34A" style={{ marginRight: 5 }} />;
    }
    if (s.includes('python')) {
      return <Ionicons name="logo-python" size={17} color="#3B82F6" style={{ marginRight: 5 }} />;
    }
    if (s.includes('git')) {
      return <Ionicons name="git-branch-outline" size={16} color="#F97316" style={{ marginRight: 5 }} />;
    }
    return (
      <View style={[styles.techIconBadge, { backgroundColor: '#EEF2FF' }]}>
        <Text style={[styles.techIconText, { color: '#4F46E5' }]}>
          {name.slice(0, 2).toUpperCase()}
        </Text>
      </View>
    );
  };

  const isFilterActive =
    selectedTechSlug !== 'all' ||
    selectedLevel !== 'all' ||
    selectedType !== 'all' ||
    searchQuery.trim().length > 0;

  const currentTechObj = techList.find((t) => t.slug === selectedTechSlug) || initialTech;
  const currentTechName = currentTechObj ? currentTechObj.name : 'Git';

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />

      {/* Main Scrollable Content */}
      <FlatList
        data={filteredQuestions}
        keyExtractor={(item, index) => item.id || item._id || `q_${index}`}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            {/* Top Navigation Row: Back Button & Settings Gear */}
            <View style={styles.topActionsRow}>
              <TouchableOpacity
                style={[
                  styles.circleBtn,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
              >
                <Ionicons name="chevron-back" size={20} color={theme.colors.text} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.circleBtn,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}
                onPress={() => {
                  try {
                    (navigation as any).navigate('Settings');
                  } catch (e) {
                    // Fallback
                  }
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="settings-sharp" size={18} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            {/* Title & Decorative Hero Illustration Row */}
            <View style={styles.heroRow}>
              <View style={styles.heroLeft}>
                <Text style={[styles.titleText, { color: theme.colors.text }]}>
                  Interview <Text style={styles.titleHighlight}>Questions</Text>
                </Text>
                <Text style={[styles.subtitleText, { color: theme.colors.textSecondary }]}>
                  Prepare smarter. Crack your next interview.
                </Text>
              </View>

              {/* Illustration & Questions Pill */}
              <View style={styles.heroIllustrationContainer}>
                {/* Background pastel glow */}
                <View
                  style={[
                    styles.glowCircle,
                    { backgroundColor: isDark ? 'rgba(99,102,241,0.2)' : '#EEF2FF' },
                  ]}
                />

                {/* Light bulb graphic on left */}
                <View style={styles.bulbGraphic}>
                  <Ionicons name="bulb" size={24} color="#F59E0B" />
                </View>

                {/* Clipboard document graphic with code tags */}
                <View
                  style={[
                    styles.docGraphic,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.border,
                    },
                  ]}
                >
                  <View style={styles.docHeader} />
                  <View style={styles.docCodeWrap}>
                    <Text style={styles.docCodeText}>{'</>'}</Text>
                  </View>
                  <View
                    style={[
                      styles.docLine1,
                      { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0' },
                    ]}
                  />
                  <View
                    style={[
                      styles.docLine2,
                      { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0' },
                    ]}
                  />
                </View>

                {/* Floating pill badge: e.g. 436 Questions */}
                <View style={styles.floatingQuestionsBadge}>
                  <Text style={styles.badgeNumText}>
                    {totalCount}
                  </Text>
                  <Text style={styles.badgeLabelText}>Questions</Text>
                </View>
              </View>
            </View>

            {/* Search Input Bar */}
            <View
              style={[
                styles.searchBar,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Ionicons
                name="search-outline"
                size={18}
                color={theme.colors.textMuted}
                style={styles.searchIcon}
              />
              <TextInput
                style={[styles.searchInput, { color: theme.colors.text }]}
                placeholder="Search questions, topics or keywords..."
                placeholderTextColor={theme.colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
                clearButtonMode="while-editing"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery('')}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name="close-circle"
                    size={18}
                    color={theme.colors.textMuted}
                    style={{ marginRight: 8 }}
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => {
                  try {
                    (navigation as any).navigate('Settings');
                  } catch (e) {}
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="options-outline" size={19} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Section 1: Technology */}
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleLeft}>
                <Ionicons name="layers-outline" size={17} color={theme.colors.primary} />
                <Text style={[styles.sectionTitleText, { color: theme.colors.text }]}>
                  Technology
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  try {
                    (navigation as any).navigate('BrowseTechnologies');
                  } catch (e) {}
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.seeAllText}>See All →</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsScrollContent}
            >
              {/* All Tech Pill */}
              <TouchableOpacity
                style={[
                  styles.pillChip,
                  selectedTechSlug === 'all'
                    ? styles.activePillChip
                    : [styles.inactivePillChip, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }],
                ]}
                onPress={() => setSelectedTechSlug('all')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.pillChipText,
                    selectedTechSlug === 'all'
                      ? styles.activePillChipText
                      : [styles.inactivePillChipText, { color: theme.colors.textSecondary }],
                  ]}
                >
                  All Tech
                </Text>
              </TouchableOpacity>

              {/* Technologies with Brand Badges */}
              {techList.map((t) => {
                const isActive = selectedTechSlug === t.slug;
                return (
                  <TouchableOpacity
                    key={t.slug || t._id}
                    style={[
                      styles.pillChip,
                      isActive
                        ? styles.activePillChip
                        : [styles.inactivePillChip, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }],
                    ]}
                    onPress={() => setSelectedTechSlug(t.slug)}
                    activeOpacity={0.8}
                  >
                    {!isActive && renderTechIcon(t.slug, t.name)}
                    <Text
                      style={[
                        styles.pillChipText,
                        isActive
                          ? styles.activePillChipText
                          : [styles.inactivePillChipText, { color: theme.colors.textSecondary }],
                      ]}
                    >
                      {t.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Removed Difficulty and Question Type filters */}

            {/* Summary / Stats Banner */}
            <View
              style={[
                styles.statsBanner,
                {
                  backgroundColor: isDark ? 'rgba(99,102,241,0.12)' : '#EEF2FF',
                  borderColor: isDark ? 'rgba(99,102,241,0.3)' : '#E0E7FF',
                },
              ]}
            >
              <View style={[styles.targetIconWrap, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.targetInnerCircle}>
                  <Ionicons name="locate-outline" size={22} color="#E11D48" />
                </View>
              </View>

              <View style={styles.statsBannerTextWrap}>
                <Text style={[styles.statsTitle, { color: theme.colors.text }]}>
                  <Text style={{ color: theme.colors.primary }}>{totalCount}</Text> Interview Questions
                </Text>
                <Text style={[styles.statsSubtitle, { color: theme.colors.textSecondary }]}>
                  Across <Text style={{ fontWeight: '700', color: theme.colors.text }}>{techList.length}</Text> Technologies
                </Text>
              </View>

              <View style={styles.levelUpBadge}>
                <Text style={styles.levelUpText}>Level up</Text>
                <Text style={styles.levelUpText}>your career! 🚀</Text>
              </View>
            </View>
          </View>
        }
        renderItem={({ item, index }) => {
          const qId = item.id || item._id || '';
          const isSaved = savedIds.includes(qId);
          const levelTier = getDisplayLevel(item);
          const formattedNumber = String(index + 1).padStart(2, '0');

          // Cycling accent scheme
          const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];

          const techName =
            typeof item.technologyId === 'object' && item.technologyId !== null
              ? (item.technologyId as any).name
              : currentTechName;

          const topicName =
            typeof item.topicId === 'object' && item.topicId !== null
              ? (item.topicId as any).name
              : topic?.name || '';

          const snippet = getQuestionSnippet(item);

          return (
            <TouchableOpacity
              style={[
                styles.cardContainer,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
              onPress={() => handleOpenQuestion(item, index)}
              activeOpacity={0.88}
            >
              {/* Left Accent Bar */}
              <View style={[styles.cardAccentBar, { backgroundColor: accent.bar }]} />

              {/* Main Card Content */}
              <View style={styles.cardMainContent}>
                {/* Top Row: Title + Bookmark */}
                <View style={styles.cardTopRow}>

                  <Text
                    style={[styles.cardQuestionTitle, { color: theme.colors.text }]}
                    numberOfLines={2}
                  >
                    {item.title || item.question}
                  </Text>

                  <TouchableOpacity
                    style={styles.bookmarkButton}
                    onPress={() => toggleSave(qId)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons
                      name={isSaved ? 'bookmark' : 'bookmark-outline'}
                      size={20}
                      color={isSaved ? theme.colors.primary : theme.colors.textMuted}
                    />
                  </TouchableOpacity>
                </View>

                {/* Removed Badges Row */}

                {/* Question Summary / Snippet */}
                <Text
                  style={[styles.cardSnippetText, { color: theme.colors.textSecondary }]}
                  numberOfLines={2}
                >
                  {snippet}
                </Text>

                {/* Card Footer: Folder + Tech/Topic & View Question Button */}
                <View
                  style={[
                    styles.cardFooterRow,
                    { borderTopColor: isDark ? 'rgba(255,255,255,0.06)' : '#F8FAFC' },
                  ]}
                >
                  <View style={styles.folderLeftWrap}>
                    <Ionicons name="folder-outline" size={13} color={theme.colors.textMuted} />
                    <Text
                      style={[styles.folderText, { color: theme.colors.textSecondary }]}
                      numberOfLines={1}
                    >
                      {techName}
                      {topicName ? ` • ${topicName}` : ''}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.viewQuestionBtn,
                      {
                        backgroundColor: isDark ? 'rgba(99,102,241,0.2)' : '#EEF2FF',
                      },
                    ]}
                    onPress={() => handleOpenQuestion(item, index)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[styles.viewQuestionBtnText, { color: theme.colors.primary }]}
                    >
                      View Question →
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListFooterComponent={
          isLoadingMore ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color="#4F46E5" />
              <Text style={styles.footerLoaderText}>Loading more questions...</Text>
            </View>
          ) : hasMore && filteredQuestions.length > 0 ? (
            <View style={{ height: 28 }} />
          ) : filteredQuestions.length > 0 ? (
            <View style={styles.endOfListContainer}>
              <Text style={styles.endOfListText}>All questions loaded</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.emptyContainer}>
              <ActivityIndicator size="large" color="#4F46E5" />
              <Text style={styles.emptyText}>Loading interview questions...</Text>
            </View>
          ) : error ? (
            <ErrorView fullScreen={false} message={error} onRetry={() => fetchQuestions(1, false)} />
          ) : (
            <EmptyView
              title="No questions found."
              description="No questions match your current search or filter criteria."
              actionTitle="Clear Filters"
              onAction={handleClearFilters}
              icon={<Ionicons name="filter-outline" size={44} color="#94A3B8" />}
            />
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FE',
  },
  listContent: {
    paddingBottom: 24,
  },
  headerContainer: {
    paddingTop: Platform.OS === 'ios' ? 46 : (StatusBar.currentHeight || 16) + 8,
    paddingBottom: 10,
  },
  topActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  circleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 4,
    marginBottom: 12,
  },
  heroLeft: {
    flex: 1,
    paddingRight: 10,
  },
  titleText: {
    fontSize: 25,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  titleHighlight: {
    color: '#4F46E5',
  },
  subtitleText: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 4,
  },
  heroIllustrationContainer: {
    width: 100,
    height: 78,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowCircle: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEF2FF',
    opacity: 0.8,
  },
  bulbGraphic: {
    position: 'absolute',
    left: 2,
    bottom: 8,
    zIndex: 3,
  },
  docGraphic: {
    width: 48,
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 4,
    elevation: 3,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    alignItems: 'center',
    marginLeft: 6,
  },
  docHeader: {
    width: '100%',
    height: 10,
    backgroundColor: '#818CF8',
    borderRadius: 4,
    marginBottom: 4,
  },
  docCodeWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
  },
  docCodeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#A855F7',
    letterSpacing: 0.5,
  },
  docLine1: {
    width: '80%',
    height: 2.5,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    marginVertical: 2,
  },
  docLine2: {
    width: '55%',
    height: 2.5,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
  },
  floatingQuestionsBadge: {
    position: 'absolute',
    right: 0,
    bottom: 2,
    backgroundColor: '#4F46E5',
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    zIndex: 5,
  },
  badgeNumText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 11.5,
    lineHeight: 14,
  },
  badgeLabelText: {
    color: '#E0E7FF',
    fontWeight: '600',
    fontSize: 8,
    lineHeight: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 11 : 8,
    marginHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 12.5,
    color: '#0F172A',
    paddingVertical: 0,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
  },
  chipsScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
  },
  pillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    justifyContent: 'center',
  },
  activePillChip: {
    backgroundColor: '#4F46E5',
    borderWidth: 0,
  },
  inactivePillChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeBorderPill: {
    borderWidth: 1.5,
    borderColor: '#4F46E5',
  },
  pillChipText: {
    fontSize: 12,
    fontWeight: '600',
    includeFontPadding: false,
  },
  activePillChipText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  inactivePillChipText: {
    color: '#334155',
  },
  techIconBadge: {
    width: 17,
    height: 17,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  techIconText: {
    fontSize: 9,
    fontWeight: '800',
  },
  statsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  targetIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FDA4AF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  targetInnerCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsBannerTextWrap: {
    flex: 1,
  },
  statsTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  statsSubtitle: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
  },
  levelUpBadge: {
    backgroundColor: 'rgba(79, 70, 229, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: 'flex-end',
  },
  levelUpText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#4F46E5',
    lineHeight: 13,
  },
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  cardAccentBar: {
    width: 4,
    height: '100%',
  },
  cardMainContent: {
    flex: 1,
    padding: 12,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  cardNumberBadge: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginTop: 1,
  },
  cardNumberText: {
    fontSize: 12,
    fontWeight: '800',
  },
  cardQuestionTitle: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 19,
    marginRight: 6,
  },
  bookmarkButton: {
    padding: 2,
    marginTop: 1,
  },
  cardBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 12,
  },
  tagBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  cardSnippetText: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 8,
  },
  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  folderLeftWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
    gap: 4,
  },
  folderText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  viewQuestionBtn: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 12,
  },
  viewQuestionBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
    gap: 6,
  },
  footerLoaderText: {
    fontSize: 11,
    color: '#64748B',
  },
  endOfListContainer: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  endOfListText: {
    fontSize: 11,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 10,
  },
  emptyText: {
    fontSize: 13,
    color: '#64748B',
  },
});
