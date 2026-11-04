import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';
import { localDataService } from '../../services/localDataService';
import { CodingDifficulty } from '../../types/coding';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

interface DifficultyCardData {
  difficulty: CodingDifficulty;
  title: string;
  hindiTitle: string;
  count: number;
  description: string;
  gradient: [string, string];
  badgeBg: string;
  badgeTextColor: string;
  borderColor: string;
  iconName: keyof typeof Ionicons.glyphMap;
}

export const CodingPracticeScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { isDark } = useTheme();

  const stats = localDataService.getCodingStats();

  const difficultyCards: DifficultyCardData[] = [
    {
      difficulty: 'easy',
      title: 'Easy Problems',
      hindiTitle: 'सरल प्रश्न',
      count: stats.easy,
      description: 'Variables, loops, basic math, array transformations, and core logic.',
      gradient: ['#064E3B', '#047857'],
      badgeBg: '#D1FAE5',
      badgeTextColor: '#065F46',
      borderColor: '#10B981',
      iconName: 'flash-outline',
    },
    {
      difficulty: 'medium',
      title: 'Medium Problems',
      hindiTitle: 'मध्यम प्रश्न',
      count: stats.medium,
      description: 'Object mapping, string parsing, recursion, data structures, and edge cases.',
      gradient: ['#78350F', '#B45309'],
      badgeBg: '#FEF3C7',
      badgeTextColor: '#92400E',
      borderColor: '#F59E0B',
      iconName: 'hardware-chip-outline',
    },
    {
      difficulty: 'hard',
      title: 'Hard Problems',
      hindiTitle: 'कठिन प्रश्न',
      count: stats.hard,
      description: 'Algorithmic optimization, complex logic, deep transforms, and multi-step puzzles.',
      gradient: ['#7F1D1D', '#B91C1C'],
      badgeBg: '#FEE2E2',
      badgeTextColor: '#991B1B',
      borderColor: '#EF4444',
      iconName: 'flame-outline',
    },
  ];

  const handleSelectDifficulty = (difficulty: CodingDifficulty, title: string) => {
    navigation.navigate('CodingQuestionList', { difficulty, title });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#0B0F19' : '#F8FAFC' }]}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* ─── Top Header Bar ─────────────────────────────────────────────── */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="chevron-back" size={24} color="#F8FAFC" />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Coding Practice</Text>
          <Text style={styles.headerSubtitle}>Multi-Language Code Solutions</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Hero Overview Banner ─────────────────────────────────────── */}
        <LinearGradient
          colors={['#1E1B4B', '#312E81', '#4338CA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroBadgeRow}>
            <View style={styles.heroPill}>
              <Ionicons name="code-working" size={13} color="#FDE047" />
              <Text style={styles.heroPillText}>242 TOTAL PROBLEMS</Text>
            </View>
            <View style={styles.languagesPill}>
              <Text style={styles.languagesPillText}>JS • PY • JAVA • C# • C++</Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>Master Interview Coding</Text>
          <Text style={styles.heroDescription}>
            Solve practical programming challenges with full working solutions in 5 popular languages,
            tested terminal output, and clear Hindi & English explanations.
          </Text>

          {/* Quick Stats Pill Bar */}
          <View style={styles.heroStatsRow}>
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatValue}>{stats.easy}</Text>
              <Text style={styles.heroStatLabel}>Easy</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatValue}>{stats.medium}</Text>
              <Text style={styles.heroStatLabel}>Medium</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatValue}>{stats.hard}</Text>
              <Text style={styles.heroStatLabel}>Hard</Text>
            </View>
          </View>
        </LinearGradient>

        {/* ─── Section Header ───────────────────────────────────────────── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionHeading, { color: isDark ? '#F1F5F9' : '#0F172A' }]}>
            Select Difficulty Level
          </Text>
          <Text style={styles.sectionSubtitle}>Choose a level to start practicing</Text>
        </View>

        {/* ─── 3 Difficulty Level Cards ──────────────────────────────────── */}
        <View style={styles.cardsContainer}>
          {difficultyCards.map((item) => (
            <TouchableOpacity
              key={item.difficulty}
              activeOpacity={0.88}
              onPress={() => handleSelectDifficulty(item.difficulty, item.title)}
              style={styles.cardTouch}
            >
              <LinearGradient
                colors={item.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.difficultyCard, { borderColor: item.borderColor }]}
              >
                {/* Top Row: Icon + Badge */}
                <View style={styles.cardTopRow}>
                  <View style={styles.iconCircle}>
                    <Ionicons name={item.iconName} size={22} color="#FFFFFF" />
                  </View>

                  <View style={[styles.countBadge, { backgroundColor: item.badgeBg }]}>
                    <Text style={[styles.countBadgeText, { color: item.badgeTextColor }]}>
                      {item.count} Questions
                    </Text>
                  </View>
                </View>

                {/* Title & Hindi title */}
                <View style={styles.cardTitleRow}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardHindiTitle}>{item.hindiTitle}</Text>
                </View>

                {/* Description */}
                <Text style={styles.cardDesc}>{item.description}</Text>

                {/* Bottom Action Row */}
                <View style={styles.cardBottomRow}>
                  <View style={styles.languageTagsRow}>
                    <Text style={styles.tagText}>5 Languages</Text>
                    <Text style={styles.tagDot}>•</Text>
                    <Text style={styles.tagText}>VS Code View</Text>
                    <Text style={styles.tagDot}>•</Text>
                    <Text style={styles.tagText}>Hindi/Eng</Text>
                  </View>

                  <View style={styles.cardArrowCircle}>
                    <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* ─── Feature Highlights Footer ─────────────────────────────────── */}
        <View style={[styles.featureInfoCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
          <Text style={[styles.featureInfoTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
            ✨ Features Included
          </Text>

          <View style={styles.featureItemRow}>
            <Ionicons name="laptop-outline" size={18} color="#38BDF8" />
            <Text style={[styles.featureItemText, { color: isDark ? '#CBD5E1' : '#475569' }]}>
              <Text style={{ fontWeight: '700', color: isDark ? '#F1F5F9' : '#1E293B' }}>VS Code Viewer: </Text>
              Dark theme code editor with syntax colors & line numbers.
            </Text>
          </View>

          <View style={styles.featureItemRow}>
            <Ionicons name="swap-horizontal-outline" size={18} color="#A855F7" />
            <Text style={[styles.featureItemText, { color: isDark ? '#CBD5E1' : '#475569' }]}>
              <Text style={{ fontWeight: '700', color: isDark ? '#F1F5F9' : '#1E293B' }}>Instant Switch: </Text>
              Switch between JS, Python, Java, C#, and C++ in 1 click.
            </Text>
          </View>

          <View style={styles.featureItemRow}>
            <Ionicons name="terminal-outline" size={18} color="#34D399" />
            <Text style={[styles.featureItemText, { color: isDark ? '#CBD5E1' : '#475569' }]}>
              <Text style={{ fontWeight: '700', color: isDark ? '#F1F5F9' : '#1E293B' }}>Expected Output: </Text>
              Actual console output shown for every question.
            </Text>
          </View>

          <View style={styles.featureItemRow}>
            <Ionicons name="language-outline" size={18} color="#F59E0B" />
            <Text style={[styles.featureItemText, { color: isDark ? '#CBD5E1' : '#475569' }]}>
              <Text style={{ fontWeight: '700', color: isDark ? '#F1F5F9' : '#1E293B' }}>Bilingual Explanations: </Text>
              Easy English and simple Hindi (सरल हिंदी) explanations.
            </Text>
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerBar: {
    backgroundColor: '#0F172A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  backButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#1E293B',
  },
  headerTitleWrap: {
    alignItems: 'center',
  },
  headerTitle: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 1,
  },
  scrollContent: {
    padding: 16,
  },

  // Hero Card
  heroCard: {
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#4338CA',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  heroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 5,
  },
  heroPillText: {
    color: '#FDE047',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  languagesPill: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  languagesPillText: {
    color: '#E0E7FF',
    fontSize: 10.5,
    fontWeight: '700',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
  },
  heroDescription: {
    color: '#C7D2FE',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 16,
  },
  heroStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 12,
    paddingVertical: 10,
  },
  heroStatItem: {
    alignItems: 'center',
  },
  heroStatValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  heroStatLabel: {
    color: '#A5B4FC',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  heroStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },

  // Section Header
  sectionHeaderRow: {
    marginBottom: 14,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: '700',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },

  // Difficulty Cards
  cardsContainer: {
    gap: 14,
    marginBottom: 20,
  },
  cardTouch: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  difficultyCard: {
    borderRadius: 16,
    padding: 18,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countBadge: {
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 20,
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 4,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
  },
  cardHindiTitle: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 13,
    fontWeight: '600',
  },
  cardDesc: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 14,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
  },
  languageTagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tagText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11,
    fontWeight: '600',
  },
  tagDot: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 10,
  },
  cardArrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Feature Highlights Card
  featureInfoCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  featureInfoTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  featureItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  featureItemText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
  },
});

