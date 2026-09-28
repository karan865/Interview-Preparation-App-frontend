import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { technologyApi } from '../../api/technology.api';
import { Technology } from '../../types/technology';
import { LoadingView } from '../../components/common/LoadingView';
import { ErrorView } from '../../components/common/ErrorView';
import { EmptyView } from '../../components/common/EmptyView';
import { THEME } from '../../constants/theme';
import { BrowseStackParamList } from '../../navigation/types';
import { parseErrorMessage } from '../../utils/error';
import { MemoryCache, registerCache } from '../../utils/cacheManager';
import { useTheme } from '../../context/ThemeContext';

type NavigationProp = NativeStackNavigationProp<BrowseStackParamList, 'BrowseTechnologies'>;

const technologiesCache = registerCache(new MemoryCache<Technology[]>());

const TECH_STYLES: Record<string, { icon: keyof typeof Ionicons.glyphMap; color: string; bg: string }> = {
  react: { icon: 'logo-react', color: '#61DAFB', bg: '#1A1A2E' },
  javascript: { icon: 'logo-javascript', color: '#1A1A1A', bg: '#F7DF1E' },
  typescript: { icon: 'code-slash', color: '#FFFFFF', bg: '#3178C6' },
  node: { icon: 'logo-nodejs', color: '#FFFFFF', bg: '#339933' },
  nodejs: { icon: 'logo-nodejs', color: '#FFFFFF', bg: '#339933' },
  html: { icon: 'logo-html5', color: '#FFFFFF', bg: '#E34F26' },
  css: { icon: 'logo-css3', color: '#FFFFFF', bg: '#264DE4' },
  git: { icon: 'git-branch-outline', color: '#FFFFFF', bg: '#F05032' },
  mongodb: { icon: 'leaf-outline', color: '#FFFFFF', bg: '#13AA52' },
  mongo: { icon: 'leaf-outline', color: '#FFFFFF', bg: '#13AA52' },
  sql: { icon: 'layers-outline', color: '#FFFFFF', bg: '#2D79C7' },
  python: { icon: 'code-slash', color: '#FFFFFF', bg: '#3776AB' },
  express: { icon: 'server-outline', color: '#FFFFFF', bg: '#2D2D2D' },
};

const CAT_COLORS: Record<string, { color: string; bg: string }> = {
  frontend: { color: '#60A5FA', bg: 'rgba(96,165,250,0.1)' },
  backend: { color: '#4ADE80', bg: 'rgba(74,222,128,0.1)' },
  database: { color: '#A78BFA', bg: 'rgba(167,139,250,0.1)' },
  devops: { color: '#FCD34D', bg: 'rgba(252,211,77,0.1)' },
};

function getTechStyle(slug: string, category: string) {
  const key = Object.keys(TECH_STYLES).find(k => slug.toLowerCase().includes(k));
  if (key) return TECH_STYLES[key];
  const catStyle = CAT_COLORS[category?.toLowerCase()];
  if (catStyle) return { icon: 'code-working-outline' as const, ...catStyle };
  return { icon: 'code-working-outline' as const, color: THEME.colors.primary, bg: THEME.colors.primaryLight };
}

const CATEGORIES = ['all', 'frontend', 'backend', 'database', 'tools'];
const CAT_LABEL: Record<string, string> = {
  all: 'All',
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Database',
  tools: 'DevOps & Tools',
};

export const BrowseTechnologiesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors, isDark } = useTheme();
  const cached = technologiesCache.get('all');
  const [technologies, setTechnologies] = useState<Technology[]>(cached || []);
  const [isLoading, setIsLoading] = useState<boolean>(!cached);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const fetchTechnologies = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
      technologiesCache.clear();
    } else if (!technologiesCache.has('all')) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const data = await technologyApi.getTechnologies();
      technologiesCache.set('all', data);
      setTechnologies(data);
    } catch (err) {
      setError(parseErrorMessage(err));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTechnologies();
  }, [fetchTechnologies]);

  const filteredTechnologies = technologies.filter((tech) => {
    if (selectedCategory === 'all') return true;
    const cat = (tech.category || '').toLowerCase();
    if (selectedCategory === 'tools') {
      return cat === 'devops' || cat === 'tools' || cat === 'other';
    }
    return cat === selectedCategory;
  });

  const handleSelectTech = (tech: Technology) => {
    navigation.navigate('BrowseQuestions', { technology: tech });
  };

  if (isLoading && !isRefreshing && technologies.length === 0) {
    return <LoadingView fullScreen message="Loading technologies..." />;
  }

  if (error && technologies.length === 0) {
    return <ErrorView fullScreen message={error} onRetry={() => fetchTechnologies()} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Technologies</Text>
          <Text style={[styles.headerSub, { color: colors.textSecondary }]}>
            {filteredTechnologies.length} available
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.settingsBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
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

      {/* Category Filter */}
      <View style={styles.filterSection}>
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
          keyExtractor={(item) => item}
          renderItem={({ item: cat }) => {
            const isActive = selectedCategory === cat;
            return (
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  isActive && styles.filterChipActive,
                ]}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    { color: colors.textSecondary },
                    isActive && styles.filterChipTextActive,
                  ]}
                >
                  {CAT_LABEL[cat]}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Technology List */}
      <FlatList
        data={filteredTechnologies}
        keyExtractor={(item) => item.id || item._id || item.slug}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => fetchTechnologies(true)}
            tintColor="#7C3AED"
          />
        }
        ListEmptyComponent={
          <EmptyView
            title="No Technologies Found"
            description="No technologies available for this category yet."
            icon={<Ionicons name="folder-open-outline" size={48} color={colors.textTertiary} />}
          />
        }
        renderItem={({ item }) => {
          const { icon, color, bg } = getTechStyle(item.slug, item.category);
          const hasCount = typeof item.questionCount === 'number';
          const catColor = CAT_COLORS[item.category?.toLowerCase()]?.color || colors.textSecondary;

          return (
            <TouchableOpacity
              style={[styles.techCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => handleSelectTech(item)}
              activeOpacity={0.75}
            >
              {/* Left: Icon */}
              <View style={[styles.iconWrap, { backgroundColor: bg }]}>
                <Ionicons name={icon} size={26} color={color} />
              </View>

              {/* Center: Info */}
              <View style={styles.techInfo}>
                <View style={styles.nameRow}>
                  <Text style={[styles.techName, { color: colors.text }]}>{item.name}</Text>
                  {item.category && (
                    <View style={[styles.catBadge, { backgroundColor: catColor + '18', borderColor: catColor + '44' }]}>
                      <Text style={[styles.catBadgeText, { color: catColor }]}>
                        {item.category.toUpperCase()}
                      </Text>
                    </View>
                  )}
                </View>
                {item.description && (
                  <Text style={[styles.techDesc, { color: colors.textSecondary }]} numberOfLines={1}>
                    {item.description}
                  </Text>
                )}
                {typeof item.questionCount === 'number' ? (
                  <View style={styles.countRow}>
                    <Ionicons name="help-circle-outline" size={13} color={color} />
                    <Text style={[styles.countText, { color }]}>
                      {item.questionCount === 1 ? '1 Question' : `${item.questionCount.toLocaleString()} Questions`}
                    </Text>
                  </View>
                ) : null}
              </View>

              {/* Right: Arrow */}
              <View style={[styles.arrowWrap, { borderColor: color + '30' }]}>
                <Ionicons name="chevron-forward" size={16} color={color} />
              </View>
            </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.md,
    paddingBottom: 4,
  },
  settingsBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: THEME.colors.text,
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 13,
    color: THEME.colors.textMuted,
    fontWeight: '600',
  },
  filterSection: {
    height: 52,
    marginVertical: 4,
    justifyContent: 'center',
  },
  filterRow: {
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: 4,
    gap: 8,
    alignItems: 'center',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterChipActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  filterChipText: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    fontWeight: '600',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: THEME.spacing.xl,
    gap: THEME.spacing.sm,
  },
  techCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    padding: THEME.spacing.md,
    gap: THEME.spacing.md,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  techInfo: {
    flex: 1,
    gap: 3,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  techName: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.text,
    letterSpacing: -0.2,
  },
  catBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
    borderWidth: 1,
  },
  catBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  techDesc: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    lineHeight: 17,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
  },
  arrowWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
