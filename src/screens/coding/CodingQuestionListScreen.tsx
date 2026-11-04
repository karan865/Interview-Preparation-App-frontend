import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';
import { localDataService } from '../../services/localDataService';
import { CodingQuestion, CodingDifficulty } from '../../types/coding';

type NavProp = NativeStackNavigationProp<RootStackParamList>;
type ScreenRouteProp = RouteProp<RootStackParamList, 'CodingQuestionList'>;

const DIFFICULTY_THEMES: Record<
  CodingDifficulty,
  { label: string; color: string; bg: string; border: string }
> = {
  easy: {
    label: 'Easy',
    color: '#10B981',
    bg: '#064E3B',
    border: '#047857',
  },
  medium: {
    label: 'Medium',
    color: '#F59E0B',
    bg: '#78350F',
    border: '#B45309',
  },
  hard: {
    label: 'Hard',
    color: '#EF4444',
    bg: '#7F1D1D',
    border: '#B91C1C',
  },
};

export const CodingQuestionListScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<ScreenRouteProp>();
  const { isDark } = useTheme();

  const { difficulty } = route.params;
  const themeCfg = DIFFICULTY_THEMES[difficulty] || DIFFICULTY_THEMES.easy;

  const [searchQuery, setSearchQuery] = useState('');

  const allQuestions = useMemo(() => {
    return localDataService.getCodingQuestions(difficulty);
  }, [difficulty]);

  const filteredQuestions = useMemo(() => {
    if (!searchQuery.trim()) return allQuestions;
    const query = searchQuery.trim().toLowerCase();

    return allQuestions.filter((q) => {
      const matchNum = `q ${q.questionNumber}`.includes(query) || `${q.questionNumber}` === query;
      const matchTitle = q.title.toLowerCase().includes(query);
      const matchText = q.question.toLowerCase().includes(query);
      return matchNum || matchTitle || matchText;
    });
  }, [allQuestions, searchQuery]);

  const handleOpenQuestion = (item: CodingQuestion, index: number) => {
    navigation.navigate('CodingQuestionDetail', {
      questionId: item.id,
      questionsQueue: filteredQuestions,
      queueIndex: index,
    });
  };

  const renderItem = ({ item, index }: { item: CodingQuestion; index: number }) => {
    return (
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
            borderColor: isDark ? '#334155' : '#E2E8F0',
          },
        ]}
        activeOpacity={0.75}
        onPress={() => handleOpenQuestion(item, index)}
      >
        <View style={styles.cardHeaderRow}>
          {/* Question Number Badge */}
          <View style={[styles.qNumBadge, { backgroundColor: themeCfg.bg, borderColor: themeCfg.border }]}>
            <Text style={[styles.qNumText, { color: themeCfg.color }]}>
              Q {item.questionNumber < 10 ? `0${item.questionNumber}` : item.questionNumber}
            </Text>
          </View>

          {/* Difficulty Badge */}
          <View style={[styles.levelBadge, { backgroundColor: isDark ? '#0F172A' : '#F1F5F9' }]}>
            <Text style={[styles.levelBadgeText, { color: themeCfg.color }]}>
              {themeCfg.label}
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text style={[styles.cardTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]} numberOfLines={2}>
          {item.title}
        </Text>

        {/* Question preview */}
        {item.question && item.question !== item.title && (
          <Text
            style={[styles.cardPreview, { color: isDark ? '#94A3B8' : '#64748B' }]}
            numberOfLines={2}
          >
            {item.question.replace(/\n/g, ' ')}
          </Text>
        )}

        {/* Bottom row: language badges + arrow */}
        <View style={styles.cardFooterRow}>
          <View style={styles.langBadgesRow}>
            <Text style={[styles.langBadge, { color: '#F7DF1E' }]}>JS</Text>
            <Text style={styles.langSep}>•</Text>
            <Text style={[styles.langBadge, { color: '#38BDF8' }]}>PY</Text>
            <Text style={styles.langSep}>•</Text>
            <Text style={[styles.langBadge, { color: '#FB923C' }]}>JAVA</Text>
            <Text style={styles.langSep}>•</Text>
            <Text style={[styles.langBadge, { color: '#A855F7' }]}>C#</Text>
            <Text style={styles.langSep}>•</Text>
            <Text style={[styles.langBadge, { color: '#34D399' }]}>C++</Text>
          </View>

          <View style={styles.viewSolutionBtn}>
            <Text style={[styles.viewSolutionText, { color: themeCfg.color }]}>Solve</Text>
            <Ionicons name="arrow-forward" size={14} color={themeCfg.color} />
          </View>
        </View>
      </TouchableOpacity>
    );
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
          <Text style={styles.headerTitle}>
            {themeCfg.label} Coding Questions
          </Text>
          <Text style={styles.headerSubtitle}>
            {filteredQuestions.length} of {allQuestions.length} Problems
          </Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      {/* ─── Search Bar ─────────────────────────────────────────────────── */}
      <View style={styles.searchContainer}>
        <View
          style={[
            styles.searchBox,
            {
              backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
              borderColor: isDark ? '#334155' : '#E2E8F0',
            },
          ]}
        >
          <Ionicons name="search" size={18} color="#94A3B8" />
          <TextInput
            style={[styles.searchInput, { color: isDark ? '#F8FAFC' : '#0F172A' }]}
            placeholder={`Search ${themeCfg.label.toLowerCase()} questions...`}
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ─── Questions List ─────────────────────────────────────────────── */}
      <FlatList
        data={filteredQuestions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="code-working-outline" size={48} color="#64748B" />
            <Text style={[styles.emptyTitle, { color: isDark ? '#F1F5F9' : '#0F172A' }]}>
              No questions found
            </Text>
            <Text style={styles.emptySub}>
              Try searching with a different keyword or question number.
            </Text>
          </View>
        }
      />
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
    fontSize: 16.5,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 1,
  },

  // Search
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },

  // List
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  qNumBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  qNumText: {
    fontSize: 11.5,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  levelBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 15.5,
    fontWeight: '700',
    lineHeight: 22,
    marginBottom: 6,
  },
  cardPreview: {
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 12,
  },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.15)',
  },
  langBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  langBadge: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  langSep: {
    fontSize: 8,
    color: '#64748B',
  },
  viewSolutionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewSolutionText: {
    fontSize: 12.5,
    fontWeight: '700',
  },

  // Empty
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
  },
  emptySub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
});

