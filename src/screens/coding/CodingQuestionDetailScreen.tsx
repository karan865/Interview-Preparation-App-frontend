import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';
import { localDataService } from '../../services/localDataService';
import { CodingQuestion, CodingLanguage, CodingDifficulty } from '../../types/coding';
import { CodeEditorView } from '../../components/coding/CodeEditorView';

type NavProp = NativeStackNavigationProp<RootStackParamList>;
type ScreenRouteProp = RouteProp<RootStackParamList, 'CodingQuestionDetail'>;

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

const MONO_FONT = Platform.OS === 'ios' ? 'Menlo' : 'monospace';

export const CodingQuestionDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<ScreenRouteProp>();
  const { isDark } = useTheme();

  const { questionId, questionsQueue = [], queueIndex = 0 } = route.params;

  const [currentIndex, setCurrentIndex] = useState(queueIndex);
  const [showSolution, setShowSolution] = useState(false);
  const [selectedLang, setSelectedLang] = useState<CodingLanguage>('javascript');

  // Load question
  const currentQuestion: CodingQuestion | undefined =
    questionsQueue.length > 0
      ? questionsQueue[currentIndex]
      : localDataService.getCodingQuestionById(questionId);

  // If questionId changes externally, update index
  useEffect(() => {
    if (questionsQueue.length > 0) {
      const idx = questionsQueue.findIndex((q) => q.id === questionId);
      if (idx !== -1) {
        setCurrentIndex(idx);
      }
    }
  }, [questionId, questionsQueue]);

  if (!currentQuestion) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#0B0F19' : '#F8FAFC' }]}>
        <View style={styles.errorContainer}>
          <Text style={{ color: isDark ? '#FFF' : '#000', fontSize: 16 }}>
            Question not found.
          </Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={{ color: '#38BDF8', marginTop: 12 }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const themeCfg =
    DIFFICULTY_THEMES[currentQuestion.difficulty] || DIFFICULTY_THEMES.easy;

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < questionsQueue.length - 1;

  const handlePrev = () => {
    if (hasPrev) {
      setCurrentIndex((prev) => prev - 1);
      setShowSolution(false);
      setSelectedLang('javascript');
    }
  };

  const handleNext = () => {
    if (hasNext) {
      setCurrentIndex((prev) => prev + 1);
      setShowSolution(false);
      setSelectedLang('javascript');
    }
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
            Question {currentQuestion.questionNumber}
          </Text>
          <Text style={styles.headerSubtitle}>
            {questionsQueue.length > 0
              ? `${currentIndex + 1} of ${questionsQueue.length} (${themeCfg.label})`
              : themeCfg.label}
          </Text>
        </View>

        {/* Difficulty Pill */}
        <View
          style={[
            styles.difficultyPill,
            { backgroundColor: themeCfg.bg, borderColor: themeCfg.border },
          ]}
        >
          <Text style={[styles.difficultyPillText, { color: themeCfg.color }]}>
            {themeCfg.label}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Problem Statement Card ─────────────────────────────────────── */}
        <View
          style={[
            styles.problemCard,
            {
              backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
              borderColor: isDark ? '#334155' : '#E2E8F0',
            },
          ]}
        >
          <View style={styles.problemHeaderRow}>
            <View style={[styles.qIndexBox, { backgroundColor: themeCfg.bg }]}>
              <Text style={[styles.qIndexText, { color: themeCfg.color }]}>
                Q {currentQuestion.questionNumber}
              </Text>
            </View>
            <View style={styles.statementTag}>
              <Ionicons name="document-text-outline" size={13} color="#94A3B8" />
              <Text style={styles.statementTagText}>Problem Statement</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={[styles.problemTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
            {currentQuestion.title}
          </Text>

          {/* Full Question Text */}
          {currentQuestion.question && currentQuestion.question !== currentQuestion.title && (
            <View style={[styles.questionBox, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
              <Text style={[styles.questionText, { color: isDark ? '#E2E8F0' : '#334155' }]}>
                {currentQuestion.question}
              </Text>
            </View>
          )}

          {/* Languages Available Row */}
          <View style={styles.availableLangsRow}>
            <Text style={[styles.availableLangsLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              Languages:
            </Text>
            {['JavaScript', 'Python', 'Java', 'C#', 'C++'].map((lng) => (
              <View key={lng} style={[styles.langChip, { backgroundColor: isDark ? '#334155' : '#E2E8F0' }]}>
                <Text style={[styles.langChipText, { color: isDark ? '#CBD5E1' : '#334155' }]}>
                  {lng}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ─── Show / Hide Answer Toggle Button ──────────────────────────── */}
        <TouchableOpacity
          style={[
            styles.toggleAnswerBtn,
            showSolution
              ? styles.toggleAnswerBtnActive
              : { backgroundColor: isDark ? '#1E293B' : '#0F172A' },
          ]}
          onPress={() => setShowSolution((prev) => !prev)}
          activeOpacity={0.85}
        >
          <Ionicons
            name={showSolution ? 'eye-off-outline' : 'code-slash-outline'}
            size={18}
            color="#FFFFFF"
          />
          <Text style={styles.toggleAnswerBtnText}>
            {showSolution ? 'Hide Solution & Code' : 'Show Answer & Solution'}
          </Text>
          <Ionicons
            name={showSolution ? 'chevron-up' : 'chevron-down'}
            size={18}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        {/* ─── Revealed Solution Section ─────────────────────────────────── */}
        {showSolution && (
          <View style={styles.solutionSection}>
            {/* Section label */}
            <View style={styles.solutionSectionHeader}>
              <Ionicons name="terminal-outline" size={16} color="#38BDF8" />
              <Text style={[styles.solutionSectionTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                Solution Code (VS Code Editor)
              </Text>
            </View>

            {/* VS Code Dark Editor with Language Tabs */}
            <CodeEditorView
              solutions={currentQuestion.solutions}
              initialLanguage={selectedLang}
              onLanguageChange={setSelectedLang}
            />

            {/* ─── Expected Output Terminal Box ──────────────────────────── */}
            {Boolean(currentQuestion.expectedOutput) && (
              <View style={styles.terminalCard}>
                <View style={styles.terminalHeader}>
                  <View style={styles.terminalDots}>
                    <View style={[styles.termDot, { backgroundColor: '#EF4444' }]} />
                    <View style={[styles.termDot, { backgroundColor: '#F59E0B' }]} />
                    <View style={[styles.termDot, { backgroundColor: '#10B981' }]} />
                  </View>
                  <Text style={styles.terminalTitle}>Expected Output</Text>
                  <View style={{ width: 36 }} />
                </View>
                <ScrollView horizontal nestedScrollEnabled showsHorizontalScrollIndicator={false}>
                  <Text style={styles.terminalOutputText}>
                    {currentQuestion.expectedOutput}
                  </Text>
                </ScrollView>
              </View>
            )}

            {/* ─── Simple English Explanation Card ───────────────────────── */}
            {Boolean(currentQuestion.explanationEnglish) && (
              <View
                style={[
                  styles.explanationCard,
                  {
                    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                    borderColor: '#38BDF8',
                  },
                ]}
              >
                <View style={styles.explanationHeader}>
                  <View style={[styles.langIconBox, { backgroundColor: '#0284C7' }]}>
                    <Text style={styles.langIconText}>EN</Text>
                  </View>
                  <Text style={[styles.explanationCardTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                    Explanation (Simple English)
                  </Text>
                </View>
                <Text style={[styles.explanationText, { color: isDark ? '#E2E8F0' : '#334155' }]}>
                  {currentQuestion.explanationEnglish}
                </Text>
              </View>
            )}

            {/* ─── Simple Hindi Explanation Card ─────────────────────────── */}
            {Boolean(currentQuestion.explanationHindi) && (
              <View
                style={[
                  styles.explanationCard,
                  {
                    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                    borderColor: '#F59E0B',
                  },
                ]}
              >
                <View style={styles.explanationHeader}>
                  <View style={[styles.langIconBox, { backgroundColor: '#D97706' }]}>
                    <Text style={styles.langIconText}>HI</Text>
                  </View>
                  <Text style={[styles.explanationCardTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                    सरल व्याख्या (Simple Hindi)
                  </Text>
                </View>
                <Text style={[styles.explanationText, { color: isDark ? '#E2E8F0' : '#334155' }]}>
                  {currentQuestion.explanationHindi}
                </Text>
              </View>
            )}

            {/* ─── How to Solve This Problem Card ────────────────────────── */}
            {Boolean(currentQuestion.howToSolve) && (
              <View
                style={[
                  styles.explanationCard,
                  {
                    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                    borderColor: '#10B981',
                  },
                ]}
              >
                <View style={styles.explanationHeader}>
                  <View style={[styles.langIconBox, { backgroundColor: '#059669' }]}>
                    <Ionicons name="bulb-outline" size={14} color="#FFFFFF" />
                  </View>
                  <Text style={[styles.explanationCardTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                    How to Solve This Type of Problem
                  </Text>
                </View>
                <Text style={[styles.explanationText, { color: isDark ? '#E2E8F0' : '#334155' }]}>
                  {currentQuestion.howToSolve}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* ─── Next / Prev Navigation Buttons ────────────────────────────── */}
        {questionsQueue.length > 1 && (
          <View style={styles.navButtonsRow}>
            <TouchableOpacity
              style={[
                styles.navBtn,
                !hasPrev && styles.navBtnDisabled,
                { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' },
              ]}
              onPress={handlePrev}
              disabled={!hasPrev}
              activeOpacity={0.7}
            >
              <Ionicons
                name="chevron-back"
                size={18}
                color={hasPrev ? (isDark ? '#F8FAFC' : '#0F172A') : '#64748B'}
              />
              <Text
                style={[
                  styles.navBtnText,
                  { color: hasPrev ? (isDark ? '#F8FAFC' : '#0F172A') : '#64748B' },
                ]}
              >
                Previous
              </Text>
            </TouchableOpacity>

            <View style={styles.queueCounterBox}>
              <Text style={[styles.queueCounterText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                {currentIndex + 1} / {questionsQueue.length}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.navBtn,
                !hasNext && styles.navBtnDisabled,
                { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' },
              ]}
              onPress={handleNext}
              disabled={!hasNext}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.navBtnText,
                  { color: hasNext ? (isDark ? '#F8FAFC' : '#0F172A') : '#64748B' },
                ]}
              >
                Next
              </Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={hasNext ? (isDark ? '#F8FAFC' : '#0F172A') : '#64748B'}
              />
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
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
  difficultyPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  difficultyPillText: {
    fontSize: 11.5,
    fontWeight: '800',
  },

  scrollContent: {
    padding: 16,
  },

  // Problem Card
  problemCard: {
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  problemHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  qIndexBox: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 6,
  },
  qIndexText: {
    fontSize: 12,
    fontWeight: '800',
    fontFamily: MONO_FONT,
  },
  statementTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statementTagText: {
    fontSize: 11.5,
    color: '#94A3B8',
    fontWeight: '600',
  },
  problemTitle: {
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 26,
    marginBottom: 12,
  },
  questionBox: {
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
  },
  questionText: {
    fontSize: 14,
    lineHeight: 22,
  },
  availableLangsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  availableLangsLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  langChip: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  langChipText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // Toggle Button
  toggleAnswerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    gap: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  toggleAnswerBtnActive: {
    backgroundColor: '#047857',
  },
  toggleAnswerBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  // Solution Section
  solutionSection: {
    marginBottom: 20,
  },
  solutionSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  solutionSectionTitle: {
    fontSize: 14.5,
    fontWeight: '700',
  },

  // Terminal Output
  terminalCard: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 14,
  },
  terminalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  terminalDots: {
    flexDirection: 'row',
    gap: 5,
  },
  termDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  terminalTitle: {
    color: '#94A3B8',
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  terminalOutputText: {
    color: '#34D399',
    fontFamily: MONO_FONT,
    fontSize: 12.5,
    padding: 14,
    lineHeight: 18,
  },

  // Explanation Cards
  explanationCard: {
    borderRadius: 14,
    padding: 16,
    borderLeftWidth: 4,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  langIconBox: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  langIconText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    fontFamily: MONO_FONT,
  },
  explanationCardTitle: {
    fontSize: 14.5,
    fontWeight: '700',
  },
  explanationText: {
    fontSize: 13.5,
    lineHeight: 21,
  },

  // Nav Buttons
  navButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 20,
    gap: 10,
  },
  navBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 6,
  },
  navBtnDisabled: {
    opacity: 0.4,
  },
  navBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  queueCounterBox: {
    paddingHorizontal: 10,
  },
  queueCounterText: {
    fontSize: 12,
    fontWeight: '700',
  },
});

