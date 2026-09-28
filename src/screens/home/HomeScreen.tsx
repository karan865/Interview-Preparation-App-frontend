import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { technologyApi } from '../../api/technology.api';
import { topicApi } from '../../api/topic.api';
import { Technology } from '../../types/technology';
import { Topic, PreparationLevel } from '../../types/topic';
import { RootStackParamList } from '../../navigation/types';
import { invalidateAllContentCaches } from '../../utils/cacheManager';
import { useTheme } from '../../context/ThemeContext';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { initDailyChallenge } from '../../store/slices/dailyChallengeSlice';

type RootNavProp = NativeStackNavigationProp<RootStackParamList>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Trending chips ────────────────────────────────────────────────────────
const TRENDING = ['useState', 'event loop', 'JWT', 'MongoDB indexing'];

// ─── Tech data with exact logo colors ─────────────────────────────────────
const TECH_DATA: {
  key: string;
  label: string;
  color: string;
  bg: string;
  icon: keyof typeof Ionicons.glyphMap;
  abbr?: string;
}[] = [
  { key: 'javascript', label: 'JavaScript', color: '#1A1A1A', bg: '#F7DF1E', icon: 'logo-javascript', abbr: 'JS' },
  { key: 'typescript', label: 'TypeScript', color: '#FFFFFF', bg: '#3178C6', icon: 'code-slash', abbr: 'TS' },
  { key: 'react', label: 'React', color: '#61DAFB', bg: '#1A1A2E', icon: 'logo-react' },
  { key: 'nodejs', label: 'Node.js', color: '#FFFFFF', bg: '#339933', icon: 'logo-nodejs' },
  { key: 'express', label: 'Express.js', color: '#FFFFFF', bg: '#2D2D2D', icon: 'server-outline', abbr: 'ex' },
  { key: 'mongodb', label: 'MongoDB', color: '#FFFFFF', bg: '#13AA52', icon: 'leaf-outline' },
  { key: 'sql', label: 'SQL', color: '#FFFFFF', bg: '#2D79C7', icon: 'layers-outline' },
  { key: 'git', label: 'Git', color: '#FFFFFF', bg: '#F05032', icon: 'git-branch-outline' },
  { key: 'advanced-questions-bank-1', label: 'Adv Q-Bank 1', color: '#FFFFFF', bg: '#7C3AED', icon: 'star-outline', abbr: 'Adv' },
];

// ─── Level config matching the image exactly ───────────────────────────────
const LEVELS = [
  {
    slug: 'junior' as const,
    label: 'Junior',
    desc: 'Build your fundamentals and strong basics.',
    icon: 'school' as const,
    iconColor: '#22C55E',
    iconBg: '#DCFCE7',
    cardBg: '#F0FDF4',
    borderColor: '#BBF7D0',
    countColor: '#22C55E',
    arrowBg: '#22C55E',
  },
  {
    slug: 'intermediate' as const,
    label: 'Intermediate',
    desc: 'Prepare for real-world interview questions and scenarios.',
    icon: 'bar-chart' as const,
    iconColor: '#F59E0B',
    iconBg: '#FEF3C7',
    cardBg: '#FFFBEB',
    borderColor: '#FDE68A',
    countColor: '#F59E0B',
    arrowBg: '#F59E0B',
  },
  {
    slug: 'advanced' as const,
    label: 'Advanced',
    desc: 'Deep technical, architecture and system design questions.',
    icon: 'rocket' as const,
    iconColor: '#7C3AED',
    iconBg: '#EDE9FE',
    cardBg: '#F5F3FF',
    borderColor: '#DDD6FE',
    countColor: '#7C3AED',
    arrowBg: '#7C3AED',
  },
];

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<RootNavProp>();
  const { colors, isDark } = useTheme();
  const dispatch = useAppDispatch();
  const { todayState, streak } = useAppSelector((state) => state.dailyChallenge);

  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [prepLevels, setPrepLevels] = useState<PreparationLevel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState<number | null>(null);
  const [totalTopics, setTotalTopics] = useState<number | null>(null);

  useEffect(() => {
    dispatch(initDailyChallenge(false));
  }, [dispatch]);

  const loadHomeData = useCallback(async () => {
    dispatch(initDailyChallenge(true));
    try {
      const [techList, allTopics, levels] = await Promise.all([
        technologyApi.getTechnologies(),
        topicApi.getTopics().catch(() => [] as Topic[]),
        topicApi.getPreparationLevels().catch(() => [] as PreparationLevel[]),
      ]);
      setTechnologies(techList);
      setPrepLevels(levels);

      // Calculate total questions from technologies
      const total = techList.reduce((sum, t) => sum + (typeof t.questionCount === 'number' ? t.questionCount : 0), 0);
      setTotalQuestions(total);
      setTotalTopics(allTopics.length);
    } catch (err) {
      console.warn('[HomeScreen] load error:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => { loadHomeData(); }, [loadHomeData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    invalidateAllContentCaches();
    loadHomeData();
  };

  const goToBrowse = () =>
    navigation.navigate('MainTabs', { screen: 'Browse', params: { screen: 'BrowseTechnologies' } } as any);

  const goToSearch = (q?: string) =>
    navigation.navigate('MainTabs', { screen: 'Search', params: q ? { initialQuery: q } : undefined } as any);

  const goToLevel = (levelSlug: 'junior' | 'intermediate' | 'advanced', levelName: string) =>
    navigation.navigate('MainTabs', {
      screen: 'Browse',
      params: { screen: 'BrowseQuestions', params: { levelSlug, levelName } },
    } as any);

  const goToTech = (tech: Technology) =>
    navigation.navigate('MainTabs', {
      screen: 'Browse',
      params: { screen: 'BrowseQuestions', params: { technology: tech } },
    } as any);

  const getLevelCount = (slug: string) =>
    prepLevels.find(l => l.slug === slug)?.questionCount;

  // Match tech name to our data for display
  const matchedTechs = TECH_DATA.map(td => ({
    ...td,
    tech: technologies.find(t =>
      t.slug.toLowerCase().includes(td.key) || t.name.toLowerCase().includes(td.key)
    ),
  }));

  const STATS = [
    { icon: 'book-outline' as const, value: totalQuestions !== null ? `${totalQuestions.toLocaleString()}` : '0', label: 'Questions', color: '#7C3AED' },
    { icon: 'layers-outline' as const, value: String(technologies.length), label: 'Technologies', color: '#7C3AED' },
    { icon: 'grid-outline' as const, value: String(totalTopics !== null ? totalTopics : 0), label: 'Topics', color: '#7C3AED' },
    { icon: 'people-outline' as const, value: 'All Levels', label: 'Junior • Intermediate • Advanced', color: '#22C55E', isLevels: true },
  ];

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="#1E1B4B" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor="#7C3AED" />
        }
      >
        {/* ══════════════════════════════════════════════
            HERO — gradient dark section
        ══════════════════════════════════════════════ */}
        <LinearGradient
          colors={['#1E1B4B', '#2D2570', '#1E1B4B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.hero}
        >
          {/* App Bar */}
          <View style={s.appBar}>
            <View style={s.logoRow}>
              <Image
                source={require('../../../assets/logo.png')}
                style={s.logoImage}
                resizeMode="cover"
              />
              <View>
                <View style={s.logoTitleRow}>
                  <Text style={s.logoText}>Interview </Text>
                  <Text style={[s.logoText, { color: '#818CF8' }]}>Prep</Text>
                </View>
                <Text style={s.logoSub}>Learn • Practice • Grow</Text>
              </View>
            </View>
            <View style={s.appBarRight}>
              <TouchableOpacity
                style={s.iconBtn}
                onPress={() => {
                  try {
                    (navigation as any).navigate('Settings');
                  } catch (e) {}
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="settings-outline" size={20} color="#fff" />
              </TouchableOpacity>
              <View style={s.avatar}>
                <Text style={s.avatarText}>A</Text>
              </View>
            </View>
          </View>

          {/* Hero Content Row */}
          <View style={s.heroBody}>
            {/* Left: Headline */}
            <View style={s.heroLeft}>
              <Text style={s.heroH1}>
                Turn Preparation{'\n'}Into{' '}
                <Text style={s.heroHighlight}>Confidence</Text>
              </Text>
              <Text style={s.heroSub}>
                Practice real interview questions, improve your skills, and get ready for your dream job.
              </Text>
            </View>

            {/* Right: Code Visual */}
            <View style={s.heroRight}>
              {/* Floating tech chips */}
              <View style={[s.floatChip, s.chipReact]}>
                <Ionicons name="logo-react" size={12} color="#61DAFB" />
                <Text style={s.chipText}>React</Text>
              </View>
              <View style={[s.floatChip, s.chipNode]}>
                <Ionicons name="logo-nodejs" size={12} color="#4ADE80" />
                <Text style={s.chipTextDark}>Node.js</Text>
              </View>
              <View style={[s.floatChip, s.chipTs]}>
                <Text style={s.chipTextTs}>TS</Text>
                <Text style={s.chipText}>TypeScript</Text>
              </View>

              {/* Laptop + code icon */}
              <View style={s.laptopWrap}>
                <View style={s.laptop}>
                  <View style={s.laptopScreen}>
                    <Text style={s.codeTag}>{'</>'}</Text>
                  </View>
                  <View style={s.laptopBase} />
                </View>
              </View>

              <Text style={s.heroCaption}>Better Developers{'\n'}Brighter Futures</Text>
            </View>
          </View>

          {/* Search Bar */}
          <TouchableOpacity style={s.searchBar} onPress={() => goToSearch()} activeOpacity={0.9}>
            <Ionicons name="search-outline" size={18} color="#9CA3AF" />
            <Text style={s.searchPlaceholder}>Search interview questions, topics, or technologies...</Text>
            <Ionicons name="options-outline" size={18} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Trending chips */}
          <View style={s.trendingRow}>
            <View style={s.trendingLabel}>
              <Text style={s.fireEmoji}>🔥</Text>
              <Text style={s.trendingText}>Trending</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.trendingScroll}>
              {TRENDING.map(t => (
                <TouchableOpacity key={t} style={s.trendChip} onPress={() => goToSearch(t)} activeOpacity={0.7}>
                  <Text style={s.trendChipText}>{t}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </LinearGradient>

        {/* ══════════════════════════════════════════════
            STATS ROW
        ══════════════════════════════════════════════ */}
        <View style={[s.statsCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: isDark ? 1 : 0 }]}>
          {STATS.map((st, i) => (
            <React.Fragment key={st.label}>
              <View style={s.statItem}>
                <Ionicons name={st.icon} size={22} color={st.color} />
                <Text style={[s.statValue, st.isLevels && { fontSize: 13 }, { color: colors.text }]}>{st.value}</Text>
                <Text style={s.statLabel}>{st.label}</Text>
              </View>
              {i < STATS.length - 1 && <View style={[s.statDivider, { backgroundColor: colors.border }]} />}
            </React.Fragment>
          ))}
        </View>

        {/* ══════════════════════════════════════════════
            DAILY INTERVIEW CHALLENGE CARD
        ══════════════════════════════════════════════ */}
        <View style={s.section}>
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => (navigation as any).navigate('DailyChallenge')}
            style={s.dailyCard}
          >
            <LinearGradient
              colors={
                todayState?.completed
                  ? ['#064E3B', '#065F46', '#047857']
                  : ['#312E81', '#4338CA', '#6366F1']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.dailyCardGrad}
            >
              <View style={s.dailyCardLeft}>
                <View style={s.dailyBadgeRow}>
                  <View
                    style={[
                      s.dailyBadge,
                      { backgroundColor: todayState?.completed ? 'rgba(52, 211, 153, 0.25)' : 'rgba(253, 224, 71, 0.25)' },
                    ]}
                  >
                    <Text style={s.dailyBadgeIcon}>{todayState?.completed ? '🎉' : '🔥'}</Text>
                    <Text
                      style={[
                        s.dailyBadgeText,
                        { color: todayState?.completed ? '#34D399' : '#FDE047' },
                      ]}
                    >
                      {todayState?.completed ? 'CHALLENGE COMPLETED' : `DAY ${todayState?.dayNumber || 1} CHALLENGE`}
                    </Text>
                  </View>

                  {streak.currentStreak > 0 && (
                    <View style={s.streakPillHome}>
                      <Text style={s.streakPillHomeText}>🔥 {streak.currentStreak} Day Streak</Text>
                    </View>
                  )}
                </View>

                <Text style={s.dailyTitle}>
                  {todayState?.completed ? "Today's Challenge Complete!" : 'Daily Interview Challenge'}
                </Text>

                <Text style={s.dailySub}>
                  {todayState?.completed
                    ? `Score: ${todayState?.bestScore}% • All daily tasks finished. Keep up your streak!`
                    : `${todayState?.settingsSnapshot.learningQuestionCount || 20} Learning • ${todayState?.settingsSnapshot.testQuestionCount || 10} Test MCQs • ${todayState?.settingsSnapshot.passingScore || 80}% Required`}
                </Text>

                {/* Progress bar if not completed */}
                {!todayState?.completed && (
                  <View style={s.dailyProgressWrap}>
                    <View style={s.dailyProgressRow}>
                      <Text style={s.dailyProgressLabel}>Progress:</Text>
                      <Text style={s.dailyProgressCount}>
                        {todayState?.learnedQuestionIds.length || 0} / {todayState?.learningQuestions.length || 20} Learned
                      </Text>
                    </View>
                    <View style={s.dailyProgressBarBg}>
                      <View
                        style={[
                          s.dailyProgressBarFill,
                          {
                            width: `${Math.min(
                              100,
                              (((todayState?.learnedQuestionIds.length || 0)) /
                                Math.max(1, todayState?.learningQuestions.length || 20)) *
                                100
                            )}%`,
                          },
                        ]}
                      />
                    </View>
                  </View>
                )}

                <View style={s.dailyActionBtn}>
                  <Text style={s.dailyActionBtnText}>
                    {todayState?.completed
                      ? "Review Today's Challenge"
                      : (todayState?.learnedQuestionIds.length || 0) > 0
                      ? 'Continue Challenge'
                      : 'Start Challenge'}
                  </Text>
                  <Ionicons
                    name={todayState?.completed ? 'checkmark-circle' : 'arrow-forward'}
                    size={14}
                    color="#312E81"
                  />
                </View>
              </View>

              <View style={s.dailyIconBox}>
                <Ionicons
                  name={todayState?.completed ? 'trophy' : 'flame'}
                  size={46}
                  color={todayState?.completed ? '#34D399' : '#FCD34D'}
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* ══════════════════════════════════════════════
            INTERVIEW EXAMS BANNER
        ══════════════════════════════════════════════ */}
        <View style={s.section}>
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => (navigation as any).navigate('ExamList')}
            style={s.examBannerCard}
          >
            <LinearGradient
              colors={['#1E1B4B', '#3730A3', '#4338CA']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.examBannerGrad}
            >
              <View style={s.examBannerLeft}>
                <View style={s.examBannerBadge}>
                  <Ionicons name="ribbon" size={12} color="#FDE047" />
                  <Text style={s.examBannerBadgeText}>INTERVIEW EXAM MODE</Text>
                </View>
                <Text style={s.examBannerTitle}>Interview Exams</Text>
                <Text style={s.examBannerSub}>
                  Take 25-question Subject and MERN assessments to test real technical readiness.
                </Text>
                <View style={s.examBannerBtn}>
                  <Text style={s.examBannerBtnText}>Take an Exam</Text>
                  <Ionicons name="arrow-forward" size={14} color="#312E81" />
                </View>
              </View>

              <View style={s.examBannerIconBox}>
                <Ionicons name="document-text" size={42} color="#818CF8" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* ══════════════════════════════════════════════
            CHOOSE YOUR LEVEL
        ══════════════════════════════════════════════ */}
        <View style={s.section}>
          <Text style={[s.sectionTitle, { color: colors.text }]}>Choose Your Level</Text>
          <Text style={s.sectionSub}>Targeted interview preparation for every stage of your career</Text>

          <View style={s.levelRow}>
            {LEVELS.map(lvl => {
              const count = getLevelCount(lvl.slug);
              const cardBg = isDark
                ? (lvl.slug === 'junior' ? '#064E3B' : lvl.slug === 'intermediate' ? '#451A03' : '#3B0764')
                : lvl.cardBg;
              const borderColor = isDark
                ? (lvl.slug === 'junior' ? '#059669' : lvl.slug === 'intermediate' ? '#D97706' : '#7C3AED')
                : lvl.borderColor;

              return (
                <TouchableOpacity
                  key={lvl.slug}
                  style={[s.levelCard, { backgroundColor: cardBg, borderColor }]}
                  onPress={() => goToLevel(lvl.slug, lvl.label)}
                  activeOpacity={0.8}
                >
                  {/* Icon */}
                  <View style={[s.levelIconWrap, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : lvl.iconBg }]}>
                    <Ionicons name={lvl.icon} size={22} color={lvl.iconColor} />
                  </View>

                  {/* Label */}
                  <Text style={[s.levelName, { color: isDark ? '#F9FAFB' : '#111827' }]}>{lvl.label}</Text>

                  {/* Count */}
                  {typeof count === 'number' ? (
                    <Text style={[s.levelCount, { color: lvl.countColor }]}>
                      {count.toLocaleString()} Questions
                    </Text>
                  ) : isLoading ? (
                    <ActivityIndicator size="small" color={lvl.countColor} style={{ marginVertical: 4 }} />
                  ) : null}

                  {/* Desc */}
                  <Text style={[s.levelDesc, { color: isDark ? '#CBD5E1' : '#6B7280' }]}>{lvl.desc}</Text>

                  {/* Arrow */}
                  <View style={[s.levelArrow, { backgroundColor: lvl.arrowBg }]}>
                    <Ionicons name="chevron-forward" size={16} color="#fff" />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ══════════════════════════════════════════════
            POPULAR TECHNOLOGIES
        ══════════════════════════════════════════════ */}
        <View style={[s.section, { paddingBottom: 8 }]}>
          <View style={s.sectionHeader}>
            <Text style={[s.sectionTitle, { color: colors.text }]}>Popular Technologies</Text>
            <TouchableOpacity onPress={goToBrowse} style={s.seeAllRow}>
              <Text style={s.seeAll}>See All</Text>
              <Ionicons name="arrow-forward" size={14} color="#7C3AED" />
            </TouchableOpacity>
          </View>

          {/* Rows of 4 */}
          {[0, 4, 8].map(offset => (
            <View key={offset} style={s.techRow}>
              {matchedTechs.slice(offset, offset + 4).map(td => (
                <TouchableOpacity
                  key={td.key}
                  style={[s.techCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: isDark ? 1 : 0 }]}
                  onPress={() => td.tech ? goToTech(td.tech) : goToBrowse()}
                  activeOpacity={0.75}
                >
                  {/* Logo */}
                  <View style={[s.techLogo, { backgroundColor: td.bg }]}>
                    {td.abbr ? (
                      <Text style={[s.techAbbr, { color: td.color }]}>{td.abbr}</Text>
                    ) : (
                      <Ionicons name={td.icon} size={26} color={td.color} />
                    )}
                  </View>
                  <Text style={[s.techName, { color: colors.text }]}>{td.label}</Text>
                  {td.tech && typeof td.tech.questionCount === 'number' ? (
                    <Text style={[s.techCount, { color: colors.textSecondary }]}>{td.tech.questionCount} Questions</Text>
                  ) : null}
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
};

// ─── Styles ────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

  // ── Hero ──────────────────────────────────────────────────────────────────
  hero: {
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  // App Bar
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoImage: {
    width: 38,
    height: 38,
    borderRadius: 10,
  },
  logoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  logoSub: {
    fontSize: 11,
    color: '#A5B4FC',
    marginTop: 1,
  },
  appBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  // Hero Body
  heroBody: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 22,
    gap: 8,
  },
  heroLeft: {
    flex: 1,
  },
  heroH1: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 34,
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  heroHighlight: {
    color: '#818CF8',
    fontWeight: '800',
  },
  heroSub: {
    fontSize: 13,
    color: '#A5B4FC',
    lineHeight: 20,
  },

  // Hero right: Laptop + floating chips
  heroRight: {
    width: 140,
    height: 150,
    position: 'relative',
  },
  floatChip: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  chipReact: {
    backgroundColor: '#1E3A5F',
    top: 4,
    right: 0,
  },
  chipNode: {
    backgroundColor: '#14532D',
    top: 4,
    left: 0,
  },
  chipTs: {
    backgroundColor: '#1E3A8A',
    bottom: 50,
    left: 0,
  },
  chipText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  chipTextDark: {
    color: '#4ADE80',
    fontSize: 10,
    fontWeight: '600',
  },
  chipTextTs: {
    color: '#60A5FA',
    fontSize: 10,
    fontWeight: '700',
  },

  // Laptop
  laptopWrap: {
    position: 'absolute',
    bottom: 40,
    right: 10,
    left: 20,
    alignItems: 'center',
  },
  laptop: {
    alignItems: 'center',
  },
  laptopScreen: {
    width: 80,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#312E81',
    borderWidth: 3,
    borderColor: '#4338CA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeTag: {
    color: '#A78BFA',
    fontSize: 20,
    fontWeight: '800',
  },
  laptopBase: {
    width: 100,
    height: 8,
    backgroundColor: '#4338CA',
    borderRadius: 2,
    marginTop: 2,
  },
  heroCaption: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    fontSize: 9,
    color: '#818CF8',
    textAlign: 'right',
    lineHeight: 13,
    fontStyle: 'italic',
  },

  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 10,
    marginBottom: 14,
  },
  searchPlaceholder: {
    flex: 1,
    color: '#9CA3AF',
    fontSize: 13,
  },

  // Trending
  trendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    marginBottom: 4,
  },
  trendingLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  fireEmoji: {
    fontSize: 14,
  },
  trendingText: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: '700',
  },
  trendingScroll: {
    flexDirection: 'row',
    gap: 6,
  },
  trendChip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  trendChipText: {
    color: '#E0E7FF',
    fontSize: 12,
    fontWeight: '500',
    includeFontPadding: false,
  },

  // ── Stats Card ────────────────────────────────────────────────────────────
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 18,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 24,
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.3,
  },
  statLabel: {
    fontSize: 10,
    color: '#7C3AED',
    fontWeight: '600',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
  },

  // ── Section ───────────────────────────────────────────────────────────────
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 12,
    color: '#7C3AED',
    marginBottom: 14,
  },
  seeAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7C3AED',
  },

  // ── Level Cards ───────────────────────────────────────────────────────────
  levelRow: {
    flexDirection: 'row',
    gap: 8,
  },
  levelCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 12,
    gap: 6,
    minHeight: 190,
  },
  levelIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  levelName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  levelCount: {
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 14,
  },
  levelDesc: {
    fontSize: 10,
    color: '#6B7280',
    lineHeight: 15,
    flex: 1,
  },
  levelArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },

  // ── Tech Grid ─────────────────────────────────────────────────────────────
  techRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  techCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  techLogo: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  techAbbr: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -1,
  },
  techName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  techCount: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },

  // ── Exam Banner ───────────────────────────────────────────────────────────
  examBannerCard: {
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#3730A3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  examBannerGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    borderRadius: 18,
  },
  examBannerLeft: {
    flex: 1,
    paddingRight: 10,
  },
  examBannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(253, 224, 71, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  examBannerBadgeText: {
    color: '#FDE047',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  examBannerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  examBannerSub: {
    color: '#C7D2FE',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 12,
  },
  examBannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  examBannerBtnText: {
    color: '#312E81',
    fontSize: 13,
    fontWeight: '700',
  },
  examBannerIconBox: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Daily Challenge Card ──────────────────────────────────────────────────
  dailyCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 8,
  },
  dailyCardGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    borderRadius: 20,
  },
  dailyCardLeft: {
    flex: 1,
    paddingRight: 8,
  },
  dailyBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  dailyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  dailyBadgeIcon: {
    fontSize: 10,
  },
  dailyBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  streakPillHome: {
    backgroundColor: 'rgba(254, 243, 199, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  streakPillHomeText: {
    color: '#FDE047',
    fontSize: 10,
    fontWeight: '800',
  },
  dailyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  dailySub: {
    color: '#E0E7FF',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 10,
  },
  dailyProgressWrap: {
    marginBottom: 12,
  },
  dailyProgressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  dailyProgressLabel: {
    color: '#C7D2FE',
    fontSize: 11,
    fontWeight: '600',
  },
  dailyProgressCount: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  dailyProgressBarBg: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  dailyProgressBarFill: {
    height: '100%',
    backgroundColor: '#34D399',
    borderRadius: 3,
  },
  dailyActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  dailyActionBtnText: {
    color: '#312E81',
    fontSize: 13,
    fontWeight: '700',
  },
  dailyIconBox: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
