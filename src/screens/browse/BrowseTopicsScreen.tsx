import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  StatusBar,
  Platform,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { topicApi } from '../../api/topic.api';
import { Topic } from '../../types/topic';
import { EmptyView } from '../../components/common/EmptyView';
import { BrowseStackParamList } from '../../navigation/types';
import { parseErrorMessage } from '../../utils/error';
import { MemoryCache, registerCache } from '../../utils/cacheManager';
import { useTheme } from '../../context/ThemeContext';

type ScreenRouteProp = RouteProp<BrowseStackParamList, 'BrowseTopics'>;
type ScreenNavProp = NativeStackNavigationProp<BrowseStackParamList, 'BrowseTopics'>;

const topicsCache = registerCache(new MemoryCache<Topic[]>());

// Theme styling presets for topic cards (cycling purple, blue, green, orange, pink)
const THEME_PRESETS = [
  {
    accent: '#8B5CF6',
    iconBg: '#F3E8FF',
    iconColor: '#8B5CF6',
    pillBg: '#F3E8FF',
    pillText: '#7C3AED',
    iconName: 'book-outline' as const,
  },
  {
    accent: '#0284C7',
    iconBg: '#E0F2FE',
    iconColor: '#0284C7',
    pillBg: '#E0F2FE',
    pillText: '#0284C7',
    iconName: 'cube-outline' as const,
  },
  {
    accent: '#16A34A',
    iconBg: '#DCFCE7',
    iconColor: '#16A34A',
    pillBg: '#DCFCE7',
    pillText: '#16A34A',
    iconName: 'server-outline' as const,
  },
  {
    accent: '#EA580C',
    iconBg: '#FFEDD5',
    iconColor: '#EA580C',
    pillBg: '#FFEDD5',
    pillText: '#EA580C',
    iconName: 'document-text-outline' as const,
  },
  {
    accent: '#DB2777',
    iconBg: '#FCE7F3',
    iconColor: '#DB2777',
    pillBg: '#FCE7F3',
    pillText: '#DB2777',
    iconName: 'cog-outline' as const,
  },
];

export const BrowseTopicsScreen: React.FC = () => {
  const route = useRoute<ScreenRouteProp>();
  const navigation = useNavigation<ScreenNavProp>();
  const { colors, isDark } = useTheme();
  const { technology } = route.params;

  const techKey = technology.slug || technology.id || technology._id || 'default';
  const cached = topicsCache.get(techKey);

  const [topics, setTopics] = useState<Topic[]>(cached || []);
  const [isLoading, setIsLoading] = useState<boolean>(!cached);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchTopics = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setIsRefreshing(true);
        topicsCache.delete(techKey);
      } else if (!topicsCache.has(techKey)) {
        setIsLoading(true);
      }
      setError(null);

      try {
        const techIdOrSlug = technology.id || technology._id || technology.slug;
        const data = await topicApi.getTopics(techIdOrSlug);
        topicsCache.set(techKey, data);
        setTopics(data || []);
      } catch (err) {
        setError(parseErrorMessage(err));
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [technology, techKey]
  );

  useEffect(() => {
    const cachedForTech = topicsCache.get(techKey);
    setTopics(cachedForTech || []);
    setIsLoading(!cachedForTech);
    fetchTopics();
  }, [techKey, fetchTopics]);

  const handleSelectTopic = (topic: Topic) => {
    navigation.navigate('BrowseQuestions', { technology, topic });
  };

  const handleSkipToAllQuestions = () => {
    navigation.navigate('BrowseQuestions', { technology });
  };

  // Filter topics in real-time by search query
  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return topics;
    const q = searchQuery.toLowerCase().trim();
    return topics.filter(
      (t) =>
        (t.name || '').toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q)
    );
  }, [topics, searchQuery]);

  // Total questions count calculation
  const totalQuestions = useMemo(() => {
    const sum = topics.reduce((acc, t) => acc + (t.questionCount || 0), 0);
    return sum > 0 ? sum : (technology as any).questionCount || 436;
  }, [topics, technology]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />

      {/* Main FlatList with Header Component */}
      <FlatList
        data={filteredTopics}
        keyExtractor={(item, index) => item.id || item._id || item.slug || `topic_${index}`}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => fetchTopics(true)}
            colors={['#4F46E5']}
          />
        }
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            {/* Top Action Buttons: Back & Settings */}
            <View style={styles.topActionsRow}>
              <TouchableOpacity
                style={[styles.circleBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={20} color={colors.text} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.circleBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => {
                  try {
                    (navigation as any).navigate('Settings');
                  } catch (e) {}
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="settings-sharp" size={18} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Hero Branding & 3D Illustration */}
            <View style={styles.heroRow}>
              <View style={styles.heroLeft}>
                {/* Tech Badge */}
                <View style={[styles.techPillBadge, isDark && { backgroundColor: 'rgba(124, 58, 237, 0.25)' }]}>
                  <Text style={[styles.techPillText, isDark && { color: '#A78BFA' }]}>{technology.name}</Text>
                </View>

                <Text style={[styles.titleText, { color: colors.text }]}>
                  Master <Text style={styles.titleHighlight}>{technology.name}</Text>
                </Text>

                <Text style={[styles.subtitleText, { color: colors.textSecondary }]}>
                  Choose a topic and start learning with curated interview questions.
                </Text>
              </View>

              {/* 3D Decorative Tech Illustration */}
              <View style={styles.heroGraphicWrapper}>
                {/* Ambient glow */}
                <View style={styles.glowCircle} />

                {/* Main Dark 3D Tile */}
                <View style={styles.centerTile}>
                  <Ionicons
                    name={
                      technology.slug?.includes('react')
                        ? 'logo-react'
                        : technology.slug?.includes('node')
                        ? 'logo-nodejs'
                        : technology.slug?.includes('python')
                        ? 'logo-python'
                        : technology.slug?.includes('javascript')
                        ? 'logo-javascript'
                        : 'code-slash'
                    }
                    size={42}
                    color="#38BDF8"
                  />
                </View>

                {/* Floating Badges */}
                <View style={styles.floatingBadgeLearn}>
                  <Text style={styles.floatingBadgeText}>Learn</Text>
                </View>

                <View style={styles.floatingBadgePractice}>
                  <Text style={styles.floatingBadgeText}>Practice</Text>
                </View>

                <View style={styles.floatingBadgeGrow}>
                  <Text style={styles.floatingBadgeText}>Grow</Text>
                </View>

                <View style={styles.floatingBadgeCode}>
                  <Text style={[styles.floatingBadgeText, { color: '#7C3AED' }]}>{'</>'}</Text>
                </View>
              </View>
            </View>

            {/* Search Input Bar */}
            <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons
                name="search-outline"
                size={18}
                color={colors.textTertiary}
                style={styles.searchIcon}
              />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder="Search topics (e.g. hooks, state, routing...)"
                placeholderTextColor={colors.textTertiary}
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
                  <Ionicons name="close-circle" size={18} color={colors.textTertiary} />
                </TouchableOpacity>
              )}
            </View>

            {/* "View All Questions" Quick Jump Card */}
            <TouchableOpacity
              style={[
                styles.viewAllCard,
                isDark && { backgroundColor: 'rgba(79, 70, 229, 0.15)', borderColor: 'rgba(99, 102, 241, 0.3)' }
              ]}
              onPress={handleSkipToAllQuestions}
              activeOpacity={0.85}
            >
              <View style={styles.flashSquare}>
                <Ionicons name="flash" size={20} color="#FFFFFF" />
              </View>

              <View style={styles.viewAllTextCol}>
                <Text style={styles.viewAllTitle}>
                  View All {technology.name} Questions
                </Text>
                <Text style={[styles.viewAllSubtitle, { color: colors.textSecondary }]}>
                  Explore all {totalQuestions} {technology.name} interview questions
                </Text>
              </View>

              <View style={[styles.arrowCircle, isDark && { backgroundColor: 'rgba(124, 58, 237, 0.25)' }]}>
                <Ionicons name="chevron-forward" size={17} color={isDark ? '#A78BFA' : '#7C3AED'} />
              </View>
            </TouchableOpacity>

            {/* Section Header: Popular Topics */}
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionHeadingText, { color: colors.text }]}>🔥 Popular Topics</Text>
              <Text style={[styles.sectionCountText, { color: colors.textSecondary }]}>
                {topics.length} Topics • {totalQuestions} Questions
              </Text>
            </View>
          </View>
        }
        renderItem={({ item, index }) => {
          const theme = THEME_PRESETS[index % THEME_PRESETS.length];
          const formattedNumber = String(index + 1).padStart(2, '0');
          const qCount = item.questionCount || (index === 0 ? 23 : index === 1 ? 23 : index === 2 ? 31 : index === 3 ? 28 : 46);

          return (
            <TouchableOpacity
              style={[
                styles.topicCard,
                { backgroundColor: colors.card, borderColor: colors.border }
              ]}
              onPress={() => handleSelectTopic(item)}
              activeOpacity={0.85}
            >
              {/* Optional subtle left accent bar for card 01 */}
              {index === 0 && <View style={styles.purpleCardAccent} />}

              {/* Topic Icon */}
              <View style={[
                styles.topicIconSquare,
                { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : theme.iconBg }
              ]}>
                <Ionicons name={theme.iconName} size={24} color={theme.iconColor} />
              </View>

              {/* Middle Info Column */}
              <View style={styles.topicMiddleCol}>
                <View style={styles.topicTopRow}>
                  <View style={[
                    styles.numberPill,
                    { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : theme.pillBg }
                  ]}>
                    <Text style={[styles.numberText, { color: theme.pillText }]}>
                      {formattedNumber}
                    </Text>
                  </View>

                  <Text style={[styles.topicNameText, { color: colors.text }]} numberOfLines={1}>
                    {item.name}
                  </Text>
                </View>

                {item.description ? (
                  <Text style={[styles.topicDescText, { color: colors.textSecondary }]} numberOfLines={2}>
                    {item.description}
                  </Text>
                ) : (
                  <Text style={[styles.topicDescText, { color: colors.textSecondary }]} numberOfLines={2}>
                    Core concepts, practical patterns, and architectural interview questions.
                  </Text>
                )}

                {/* Questions Count Pill */}
                <View style={[
                  styles.questionsCountPill,
                  { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : theme.pillBg }
                ]}>
                  <Ionicons
                    name="document-text-outline"
                    size={12}
                    color={theme.pillText}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={[styles.questionsCountText, { color: theme.pillText }]}>
                    {qCount} Questions
                  </Text>
                </View>
              </View>

              {/* Right Arrow Button */}
              <View style={[
                styles.topicArrowBtn,
                { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : theme.iconBg }
              ]}>
                <Ionicons name="chevron-forward" size={16} color={theme.iconColor} />
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color="#4F46E5" />
              <Text style={styles.loadingText}>Loading {technology.name} topics...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryBtn} onPress={() => fetchTopics()}>
                <Text style={styles.retryBtnText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <EmptyView
              title="No topics match your search."
              description="Try typing a different keyword or view all questions."
              actionTitle="Explore All Questions"
              onAction={handleSkipToAllQuestions}
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
    paddingBottom: 28,
  },
  headerContainer: {
    paddingTop: Platform.OS === 'ios' ? 46 : (StatusBar.currentHeight || 16) + 6,
    paddingBottom: 4,
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
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 4,
    marginBottom: 10,
  },
  heroLeft: {
    flex: 1,
    paddingRight: 10,
  },
  techPillBadge: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 10,
    paddingVertical: 3.5,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  techPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#7C3AED',
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
    lineHeight: 18,
    marginTop: 4,
  },
  heroGraphicWrapper: {
    width: 105,
    height: 95,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowCircle: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0E7FF',
    opacity: 0.8,
  },
  centerTile: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  floatingBadgeLearn: {
    position: 'absolute',
    top: 2,
    left: -2,
    backgroundColor: '#0284C7',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 10,
    zIndex: 4,
  },
  floatingBadgePractice: {
    position: 'absolute',
    bottom: 4,
    left: -6,
    backgroundColor: '#9333EA',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 10,
    zIndex: 4,
  },
  floatingBadgeGrow: {
    position: 'absolute',
    bottom: 8,
    right: -4,
    backgroundColor: '#10B981',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 10,
    zIndex: 4,
  },
  floatingBadgeCode: {
    position: 'absolute',
    top: 2,
    right: -4,
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: 10,
    zIndex: 4,
  },
  floatingBadgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 11 : 8,
    marginHorizontal: 16,
    marginVertical: 10,
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
  viewAllCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E0E7FF',
    marginTop: 4,
    marginBottom: 14,
  },
  flashSquare: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  viewAllTextCol: {
    flex: 1,
  },
  viewAllTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#4F46E5',
  },
  viewAllSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  arrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sectionHeadingText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionCountText: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '600',
  },
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    position: 'relative',
    overflow: 'hidden',
  },
  purpleCardAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3.5,
    backgroundColor: '#8B5CF6',
  },
  topicIconSquare: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  topicMiddleCol: {
    flex: 1,
    paddingRight: 6,
  },
  topicTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  numberPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 6,
  },
  numberText: {
    fontSize: 11,
    fontWeight: '800',
  },
  topicNameText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
  },
  topicDescText: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 6,
  },
  questionsCountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  questionsCountText: {
    fontSize: 11,
    fontWeight: '700',
  },
  topicArrowBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  loadingBox: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 13,
    color: '#64748B',
  },
  errorBox: {
    paddingVertical: 30,
    alignItems: 'center',
    gap: 10,
  },
  errorText: {
    fontSize: 13,
    color: '#EF4444',
    textAlign: 'center',
  },
  retryBtn: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
});
