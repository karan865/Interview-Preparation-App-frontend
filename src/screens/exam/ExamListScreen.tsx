import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../../navigation/types';
import { examApi } from '../../api/exam.api';
import { ExamSubject, ExamMode, ExamDifficulty } from '../../types/exam';
import { useTheme } from '../../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const TECH_META: Record<string, { icon: keyof typeof Ionicons.glyphMap; color: string; bg: string }> = {
  react: { icon: 'logo-react', color: '#61DAFB', bg: '#1E293B' },
  nodejs: { icon: 'logo-nodejs', color: '#4ADE80', bg: '#14532D' },
  express: { icon: 'server-outline', color: '#FACC15', bg: '#332701' },
  mongodb: { icon: 'leaf-outline', color: '#34D399', bg: '#064E3B' },
  javascript: { icon: 'logo-javascript', color: '#FCD34D', bg: '#78350F' },
  typescript: { icon: 'code-slash', color: '#60A5FA', bg: '#1E3A8A' },
  sql: { icon: 'layers-outline', color: '#93C5FD', bg: '#172554' },
  git: { icon: 'git-branch-outline', color: '#F87171', bg: '#7F1D1D' },
  html: { icon: 'globe-outline', color: '#FB923C', bg: '#7C2D12' },
  css: { icon: 'color-palette-outline', color: '#38BDF8', bg: '#0C4A6E' },
};

const DIFFICULTY_OPTIONS: {
  id: ExamDifficulty;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  bgLight: string;
  bgDark: string;
}[] = [
  {
    id: 'easy',
    title: 'Easy',
    subtitle: 'Build your fundamentals',
    emoji: '🟢',
    color: '#10B981',
    bgLight: '#ECFDF5',
    bgDark: '#064E3B',
  },
  {
    id: 'medium',
    title: 'Medium',
    subtitle: 'Interview-ready practice',
    emoji: '🟡',
    color: '#F59E0B',
    bgLight: '#FFFBEB',
    bgDark: '#451A03',
  },
  {
    id: 'hard',
    title: 'Hard',
    subtitle: 'Challenge yourself',
    emoji: '🔴',
    color: '#EF4444',
    bgLight: '#FEF2F2',
    bgDark: '#450A0A',
  },
  {
    id: 'mixed',
    title: 'Mixed',
    subtitle: 'Realistic interview mix',
    emoji: '🎯',
    color: '#8B5CF6',
    bgLight: '#F5F3FF',
    bgDark: '#2E1065',
  },
];

export const ExamListScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { theme, colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const [subjects, setSubjects] = useState<ExamSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mode & Difficulty Selection Modal state
  const [pendingExam, setPendingExam] = useState<{
    examType: 'subject' | 'mern';
    technologySlug?: string;
    technologyName?: string;
    title: string;
  } | null>(null);
  const [modalStep, setModalStep] = useState<'mode' | 'difficulty'>('mode');
  const [chosenMode, setChosenMode] = useState<ExamMode>('practice');
  const [chosenDifficulty, setChosenDifficulty] = useState<ExamDifficulty>('mixed');

  const fetchSubjects = useCallback(async () => {
    try {
      setError(null);
      const data = await examApi.getSubjects();
      setSubjects(data);
    } catch (err: any) {
      console.warn('[ExamListScreen] fetch error:', err);
      setError('Unable to load available exams. Please check your connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchSubjects();
  };

  const handleStartMern = () => {
    setPendingExam({
      examType: 'mern',
      title: 'Full Stack & All-Subjects Test',
    });
    setModalStep('mode');
    setChosenMode('practice');
    setChosenDifficulty('mixed');
  };

  const handleStartSubject = (subject: ExamSubject) => {
    if (!subject.isAvailable) return;
    setPendingExam({
      examType: 'subject',
      technologySlug: subject.slug,
      technologyName: subject.name,
      title: `${subject.name} Interview Test`,
    });
    setModalStep('mode');
    setChosenMode('practice');
    setChosenDifficulty('mixed');
  };

  const handleSelectMode = (mode: ExamMode) => {
    setChosenMode(mode);
    setModalStep('difficulty');
  };

  const handleStartExam = () => {
    if (!pendingExam) return;
    const target = { ...pendingExam };
    const mode = chosenMode;
    const difficulty = chosenDifficulty;
    setPendingExam(null);
    navigation.navigate('Exam', {
      examType: target.examType,
      mode,
      difficulty,
      technologySlug: target.technologySlug,
      technologyName: target.technologyName,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: Math.max(insets.top, 16) }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* App Bar */}
      <View style={[styles.headerBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Interview Exams</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7C3AED" />}
      >
        {/* Intro */}
        <View style={styles.introBox}>
          <Text style={[styles.introH1, { color: colors.text }]}>Test Your Interview Readiness</Text>
          <Text style={[styles.introSub, { color: colors.textSecondary }]}>
            Timed technical interview simulations with 25 curated MCQs, scoring, and comprehensive explanations.
          </Text>
        </View>

        {/* Featured Card: MERN STACK TEST */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleStartMern}
          style={styles.mernCardWrapper}
        >
          <LinearGradient
            colors={['#1E1B4B', '#3730A3', '#312E81']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.mernCard}
          >
            <View style={styles.mernTopRow}>
              <View style={styles.mernBadge}>
                <Ionicons name="flash" size={14} color="#FBBF24" />
                <Text style={styles.mernBadgeText}>ALL-SUBJECTS SIMULATION</Text>
              </View>
              <View style={styles.qCountBadge}>
                <Text style={styles.qCountText}>25 Questions</Text>
              </View>
            </View>

            <Text style={styles.mernTitle}>Full Stack & All-Subjects Test</Text>
            <Text style={styles.mernDesc}>
              Comprehensive mixed interview simulation covering all core technologies: JavaScript, React, Node.js, Express.js, MongoDB, and more.
            </Text>

            <View style={styles.techPillRow}>
              <View style={styles.techPill}>
                <Ionicons name="logo-javascript" size={12} color="#FBBF24" />
                <Text style={styles.techPillText}>JavaScript</Text>
              </View>
              <View style={styles.techPill}>
                <Ionicons name="logo-react" size={12} color="#61DAFB" />
                <Text style={styles.techPillText}>React</Text>
              </View>
              <View style={styles.techPill}>
                <Ionicons name="logo-nodejs" size={12} color="#4ADE80" />
                <Text style={styles.techPillText}>Node.js</Text>
              </View>
              <View style={styles.techPill}>
                <Ionicons name="server-outline" size={12} color="#FACC15" />
                <Text style={styles.techPillText}>Express</Text>
              </View>
              <View style={styles.techPill}>
                <Ionicons name="leaf-outline" size={12} color="#34D399" />
                <Text style={styles.techPillText}>MongoDB</Text>
              </View>
              <View style={styles.techPill}>
                <Ionicons name="code-slash" size={12} color="#C084FC" />
                <Text style={styles.techPillText}>All Core Tech</Text>
              </View>
            </View>

            <View style={styles.startRow}>
              <Text style={styles.startText}>Start All-Subjects Test</Text>
              <View style={styles.arrowCircle}>
                <Ionicons name="arrow-forward" size={16} color="#4F46E5" />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Section: Subject Tests */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Subject Tests</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            25 Questions • Pure technology-specific tests without mixing
          </Text>
        </View>

        {loading ? (
          <View style={styles.centerLoading}>
            <ActivityIndicator size="large" color="#7C3AED" />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading available exams...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={32} color="#EF4444" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={fetchSubjects}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.subjectList}>
            {subjects.map((subject) => {
              const meta = TECH_META[subject.slug.toLowerCase()] || {
                icon: 'code-slash' as keyof typeof Ionicons.glyphMap,
                color: '#7C3AED',
                bg: '#4C1D95',
              };

              return (
                <TouchableOpacity
                  key={subject._id}
                  activeOpacity={subject.isAvailable ? 0.75 : 1}
                  onPress={() => handleStartSubject(subject)}
                  style={[
                    styles.subjectCard,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      opacity: subject.isAvailable ? 1 : 0.65,
                    },
                  ]}
                >
                  <View style={[styles.techIconWrap, { backgroundColor: isDark ? meta.bg : '#F3F4F6' }]}>
                    <Ionicons name={meta.icon} size={24} color={meta.color} />
                  </View>

                  <View style={styles.subjectInfo}>
                    <View style={styles.subjectTitleRow}>
                      <Text style={[styles.subjectName, { color: colors.text }]}>{subject.name} Test</Text>
                      {subject.isAvailable ? (
                        <View style={styles.readyBadge}>
                          <Text style={styles.readyText}>Ready</Text>
                        </View>
                      ) : (
                        <View style={styles.comingSoonBadge}>
                          <Text style={styles.comingSoonText}>{subject.totalMcqs}/25 MCQs</Text>
                        </View>
                      )}
                    </View>

                    <Text style={[styles.subjectMeta, { color: colors.textSecondary }]}>
                      {subject.isAvailable
                        ? `25 Questions • ${subject.name} only`
                        : `Needs 25 MCQs to unlock (${subject.totalMcqs} available)`}
                    </Text>
                  </View>

                  <View style={styles.cardAction}>
                    <Ionicons
                      name={subject.isAvailable ? 'chevron-forward' : 'lock-closed-outline'}
                      size={20}
                      color={subject.isAvailable ? '#7C3AED' : colors.textSecondary}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Mode & Difficulty Selection Modal */}
      <Modal
        visible={Boolean(pendingExam)}
        transparent
        animationType="fade"
        onRequestClose={() => setPendingExam(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {modalStep === 'mode' ? (
              <>
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.modalTitle, { color: colors.text }]}>{pendingExam?.title}</Text>
                    <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                      25 Questions • Step 1 of 2
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setPendingExam(null)}
                    style={[styles.modalCloseBtn, { backgroundColor: isDark ? '#374151' : '#F3F4F6' }]}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="close" size={20} color={colors.text} />
                  </TouchableOpacity>
                </View>

                <Text style={[styles.modalSectionLabel, { color: colors.textSecondary }]}>
                  Choose how you want to practice
                </Text>

                {/* Practice Mode Option */}
                <View style={[styles.modeCard, { backgroundColor: isDark ? '#1E1B4B' : '#EEF2FF', borderColor: '#818CF8' }]}>
                  <View style={styles.modeCardHeader}>
                    <Text style={styles.modeIcon}>🧠</Text>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={[styles.modeName, { color: isDark ? '#E0E7FF' : '#312E81' }]}>Practice Mode</Text>
                      <Text style={[styles.modeTagline, { color: isDark ? '#A5B4FC' : '#4338CA' }]}>
                        Learn while you practice
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.modeDescription, { color: isDark ? '#C7D2FE' : '#4B5563' }]}>
                    Instant feedback + explanations after selecting each answer.
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={[styles.modeActionBtn, { backgroundColor: '#6366F1' }]}
                    onPress={() => handleSelectMode('practice')}
                  >
                    <Text style={styles.modeActionBtnText}>Select Practice Mode</Text>
                    <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
                  </TouchableOpacity>
                </View>

                {/* Exam Mode Option */}
                <View style={[styles.modeCard, { backgroundColor: isDark ? '#14253D' : '#F0F9FF', borderColor: '#38BDF8', marginTop: 14 }]}>
                  <View style={styles.modeCardHeader}>
                    <Text style={styles.modeIcon}>📝</Text>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={[styles.modeName, { color: isDark ? '#E0F2FE' : '#0369A1' }]}>Exam Mode</Text>
                      <Text style={[styles.modeTagline, { color: isDark ? '#7DD3FC' : '#0284C7' }]}>
                        Test yourself like a real interview
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.modeDescription, { color: isDark ? '#BAE6FD' : '#4B5563' }]}>
                    Realistic simulation. No feedback or explanations until final submission.
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={[styles.modeActionBtn, { backgroundColor: '#0284C7' }]}
                    onPress={() => handleSelectMode('exam')}
                  >
                    <Text style={styles.modeActionBtnText}>Select Exam Mode</Text>
                    <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                {/* Step 2: Difficulty Selection */}
                <View style={styles.modalHeader}>
                  <TouchableOpacity
                    onPress={() => setModalStep('mode')}
                    style={[styles.modalStepBackBtn, { backgroundColor: isDark ? '#374151' : '#F3F4F6' }]}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="chevron-back" size={20} color={colors.text} />
                  </TouchableOpacity>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.modalTitle, { color: colors.text }]} numberOfLines={1}>
                      {pendingExam?.title}
                    </Text>
                    <View style={[styles.modeIndicatorPill, { backgroundColor: chosenMode === 'exam' ? (isDark ? '#0C4A6E' : '#E0F2FE') : (isDark ? '#312E81' : '#EEF2FF') }]}>
                      <Text style={[styles.modeIndicatorText, { color: chosenMode === 'exam' ? (isDark ? '#38BDF8' : '#0284C7') : (isDark ? '#818CF8' : '#4F46E5') }]}>
                        {chosenMode === 'exam' ? '📝 Exam Mode' : '🧠 Practice Mode'}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => setPendingExam(null)}
                    style={[styles.modalCloseBtn, { backgroundColor: isDark ? '#374151' : '#F3F4F6' }]}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="close" size={20} color={colors.text} />
                  </TouchableOpacity>
                </View>

                <Text style={[styles.modalSectionLabel, { color: colors.textSecondary }]}>
                  Choose Exam Difficulty
                </Text>

                {/* 4 Difficulty Options */}
                <View style={{ gap: 8 }}>
                  {DIFFICULTY_OPTIONS.map((opt) => {
                    const isSelected = chosenDifficulty === opt.id;
                    return (
                      <TouchableOpacity
                        key={opt.id}
                        activeOpacity={0.85}
                        onPress={() => setChosenDifficulty(opt.id)}
                        style={[
                          styles.diffCard,
                          {
                            backgroundColor: isSelected
                              ? (isDark ? opt.bgDark : opt.bgLight)
                              : (isDark ? '#1E293B' : '#F9FAFB'),
                            borderColor: isSelected ? opt.color : (isDark ? '#334155' : '#E5E7EB'),
                          },
                        ]}
                      >
                        <View style={styles.diffCardLeft}>
                          <Text style={styles.diffEmoji}>{opt.emoji}</Text>
                          <View>
                            <Text style={[styles.diffTitle, { color: colors.text }]}>{opt.title}</Text>
                            <Text style={[styles.diffSubtitle, { color: colors.textSecondary }]}>
                              {opt.subtitle}
                            </Text>
                          </View>
                        </View>
                        <Ionicons
                          name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                          size={20}
                          color={isSelected ? opt.color : colors.textSecondary}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Start Exam Button */}
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[
                    styles.startExamBtn,
                    { backgroundColor: chosenMode === 'exam' ? '#0284C7' : '#6366F1' },
                  ]}
                  onPress={handleStartExam}
                >
                  <Text style={styles.startExamBtnText}>
                    {chosenMode === 'exam' ? 'Start Exam' : 'Start Practice'}
                  </Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
  },
  introBox: {
    marginBottom: 20,
  },
  introH1: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  introSub: {
    fontSize: 14,
    lineHeight: 20,
  },
  mernCardWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 28,
    elevation: 4,
    shadowColor: '#3730A3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  mernCard: {
    padding: 20,
    borderRadius: 20,
  },
  mernTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mernBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mernBadgeText: {
    color: '#FBBF24',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  qCountBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  qCountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  mernTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  mernDesc: {
    fontSize: 13,
    color: '#C7D2FE',
    lineHeight: 18,
    marginBottom: 16,
  },
  techPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },
  techPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  techPillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  startRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  startText: {
    color: '#312E81',
    fontSize: 15,
    fontWeight: '700',
  },
  arrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
  },
  subjectList: {
    gap: 12,
  },
  subjectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  techIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '700',
  },
  readyBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  readyText: {
    color: '#16A34A',
    fontSize: 10,
    fontWeight: '700',
  },
  comingSoonBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  comingSoonText: {
    color: '#D97706',
    fontSize: 10,
    fontWeight: '700',
  },
  subjectMeta: {
    fontSize: 12,
  },
  cardAction: {
    marginLeft: 8,
  },
  centerLoading: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  errorBox: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 440,
    borderRadius: 24,
    borderWidth: 1,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  modalSectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  modeCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
  },
  modeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  modeIcon: {
    fontSize: 24,
  },
  modeName: {
    fontSize: 17,
    fontWeight: '700',
  },
  modeTagline: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },
  modeDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },
  modeActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  modeActionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  modalStepBackBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  modeIndicatorPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 3,
  },
  modeIndicatorText: {
    fontSize: 11,
    fontWeight: '700',
  },
  diffCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  diffCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  diffEmoji: {
    fontSize: 22,
    marginRight: 12,
  },
  diffTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  diffSubtitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  startExamBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 12,
    marginTop: 14,
  },
  startExamBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
