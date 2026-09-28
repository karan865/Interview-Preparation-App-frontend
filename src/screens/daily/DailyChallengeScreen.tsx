import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { useTheme } from '../../context/ThemeContext';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  initDailyChallenge,
  markQuestionLearned,
  setPracticeAnswer,
  submitDailyTest,
  retryDailyTest,
} from '../../store/slices/dailyChallengeSlice';
import { RootStackParamList } from '../../navigation/types';
import { formatDisplayDate } from '../../utils/dailyDateUtils';
import { DailyChallengeSettingsModal } from './DailyChallengeSettingsModal';
import { DailyHistoryModal } from './DailyHistoryModal';
import { Question } from '../../types/question';
import { ExamQuestion } from '../../types/exam';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

type ActiveTab = 'learn' | 'practice' | 'test' | 'results';

export const DailyChallengeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors, isDark } = useTheme();
  const dispatch = useAppDispatch();

  const {
    todayState,
    streak,
    loading,
    submittingTest,
    retryingTest,
    error,
  } = useAppSelector((state) => state.dailyChallenge);

  const [activeTab, setActiveTab] = useState<ActiveTab>('learn');
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Learn state
  const [learnIndex, setLearnIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Practice state
  const [practiceIndex, setPracticeIndex] = useState(0);

  // Test state
  const [testIndex, setTestIndex] = useState(0);
  const [testAnswers, setTestAnswers] = useState<Record<string, string>>({});
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // Mistake review filter
  const [reviewFilter, setReviewFilter] = useState<'all' | 'mistakes'>('mistakes');

  const scrollRef = useRef<ScrollView>(null);

  // On mount, initialize challenge
  useEffect(() => {
    dispatch(initDailyChallenge(false));
  }, [dispatch]);

  // Sync tab with todayState status
  useEffect(() => {
    if (!todayState) return;
    if (todayState.completed || todayState.status === 'PASSED' || todayState.status === 'FAILED') {
      setActiveTab('results');
    } else if (todayState.status === 'TESTING') {
      setActiveTab('test');
    } else if (todayState.status === 'PRACTICE') {
      setActiveTab('practice');
    } else {
      setActiveTab('learn');
    }
  }, [todayState?.status, todayState?.completed]);

  // Stop speech when unmounting or switching questions
  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

// Cache the best voice identifier so we don't query it every time
let cachedBestVoiceId: string | null = null;

const getBestVoiceId = async () => {
  if (cachedBestVoiceId !== null) return cachedBestVoiceId || undefined;
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    const englishVoices = voices.filter(v => v.language.toLowerCase().startsWith('en'));
    
    // Prioritize high-quality neural/network voices which sound like Gemini/Alexa
    let best = englishVoices.find(v => 
      v.name.toLowerCase().includes('network') || // Google's cloud-based highly realistic voices
      v.name.toLowerCase().includes('premium') || // Apple's premium voices
      v.name.toLowerCase().includes('siri') ||
      (v as any).quality === Speech.VoiceQuality?.Enhanced
    );
    
    if (!best) best = englishVoices[0];
    
    cachedBestVoiceId = best?.identifier || '';
    return cachedBestVoiceId || undefined;
  } catch (e) {
    cachedBestVoiceId = '';
    return undefined;
  }
};

  const handleToggleSpeech = async (text: string) => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const bestVoice = await getBestVoiceId();
      Speech.speak(text, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.95,
        voice: bestVoice,
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    }
  };

  // ─── Learn Navigation ───────────────────────────────────────────────────
  const currentLearnQ: Question | undefined = todayState?.learningQuestions[learnIndex];

  const handleNextLearn = () => {
    if (!todayState) return;
    if (currentLearnQ) {
      dispatch(markQuestionLearned(currentLearnQ._id));
    }
    Speech.stop();
    setIsSpeaking(false);
    setShowAnswer(false);

    if (learnIndex < todayState.learningQuestions.length - 1) {
      setLearnIndex((i) => i + 1);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    } else {
      // All learned
      Alert.alert(
        'Learning Complete! 🧠',
        "You have completed today's learning questions. Ready to practice what you learned?",
        [
          { text: 'Review Again', style: 'cancel' },
          {
            text: 'Go to Practice',
            onPress: () => {
              setActiveTab('practice');
              scrollRef.current?.scrollTo({ y: 0, animated: true });
            },
          },
        ]
      );
    }
  };

  const handlePrevLearn = () => {
    Speech.stop();
    setIsSpeaking(false);
    setShowAnswer(false);
    if (learnIndex > 0) {
      setLearnIndex((i) => i - 1);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  // ─── Practice Selection ──────────────────────────────────────────────────
  const currentPracticeQ: Question | undefined = todayState?.learningQuestions[practiceIndex];

  const handlePracticeSelect = (optionId: string) => {
    if (!currentPracticeQ) return;
    dispatch(
      setPracticeAnswer({
        questionId: currentPracticeQ._id,
        selectedOption: optionId,
      })
    );
  };

  const handleNextPractice = () => {
    if (!todayState) return;
    if (practiceIndex < todayState.learningQuestions.length - 1) {
      setPracticeIndex((i) => i + 1);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    } else {
      Alert.alert(
        'Practice Complete! 📝',
        "You're ready for today's Daily Test. Do you want to start the test now?",
        [
          { text: 'Stay Here', style: 'cancel' },
          {
            text: 'Start Test',
            onPress: () => {
              setActiveTab('test');
              setTestIndex(0);
              setTestAnswers({});
              scrollRef.current?.scrollTo({ y: 0, animated: true });
            },
          },
        ]
      );
    }
  };

  const handlePrevPractice = () => {
    if (practiceIndex > 0) {
      setPracticeIndex((i) => i - 1);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  // ─── Test Actions ────────────────────────────────────────────────────────
  const currentTestQ: ExamQuestion | undefined = todayState?.testQuestions[testIndex];

  const handleSelectTestOption = (optionId: string) => {
    if (!currentTestQ) return;
    setTestAnswers((prev) => ({
      ...prev,
      [currentTestQ._id]: optionId,
    }));
  };

  const handleConfirmSubmitTest = () => {
    setShowSubmitConfirm(false);
    dispatch(submitDailyTest(testAnswers));
    setActiveTab('results');
  };

  const handleRetryTestPress = () => {
    dispatch(retryDailyTest())
      .unwrap()
      .then(() => {
        setTestIndex(0);
        setTestAnswers({});
        setActiveTab('test');
        scrollRef.current?.scrollTo({ y: 0, animated: true });
      })
      .catch((err) => {
        Alert.alert('Error', err || 'Could not generate retry test');
      });
  };

  if (loading && !todayState) {
    return (
      <View style={[s.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={[s.loadingText, { color: colors.textSecondary }]}>
          Loading Today's Interview Challenge...
        </Text>
      </View>
    );
  }

  if (error && !todayState) {
    return (
      <View style={[s.centerContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text style={[s.errorTitle, { color: colors.text }]}>Unable to Load Challenge</Text>
        <Text style={[s.errorSub, { color: colors.textSecondary }]}>{error}</Text>
        <TouchableOpacity
          style={s.retryBtn}
          onPress={() => dispatch(initDailyChallenge(true))}
          activeOpacity={0.8}
        >
          <Text style={s.retryBtnText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const learnedCount = todayState?.learnedQuestionIds.length || 0;
  const totalLearning = todayState?.learningQuestions.length || 20;
  const totalTest = todayState?.testQuestions.length || 10;
  const answeredTestCount = Object.keys(testAnswers).length;
  const latestAttempt = todayState?.currentAttempt;

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Top App Bar */}
      <View style={[s.appBar, { backgroundColor: isDark ? '#111827' : '#FFFFFF', borderBottomColor: isDark ? '#374151' : '#E5E7EB' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>

        <View style={s.appBarTitleBox}>
          <View style={s.titleRow}>
            <Text style={[s.appBarTitle, { color: colors.text }]}>Daily Challenge</Text>
            <View style={s.dayPill}>
              <Text style={s.dayPillText}>Day {todayState?.dayNumber || 1}</Text>
            </View>
          </View>
          <Text style={[s.appBarDate, { color: colors.textSecondary }]}>
            {formatDisplayDate(todayState?.date || '')}
          </Text>
        </View>

        <View style={s.appBarActions}>
          <TouchableOpacity onPress={() => setShowHistory(true)} style={s.actionIconBtn} activeOpacity={0.7}>
            <View style={s.streakPill}>
              <Text style={s.streakPillText}>🔥 {streak.currentStreak}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowSettings(true)} style={s.actionIconBtn} activeOpacity={0.7}>
            <Ionicons name="settings-outline" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Target Technologies Tags */}
      {todayState?.selectedTechNames && todayState.selectedTechNames.length > 0 && (
        <View style={[s.techTagsRow, { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' }]}>
          <Text style={[s.focusLabel, { color: colors.textSecondary }]}>Focus:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.techTagsScroll}>
            {todayState.selectedTechNames.map((name) => (
              <View key={name} style={[s.techTag, { backgroundColor: isDark ? '#374151' : '#EEF2FF' }]}>
                <Text style={[s.techTagText, { color: isDark ? '#C7D2FE' : '#4338CA' }]}>{name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Phase Segmented Tabs */}
      <View style={[s.tabBar, { backgroundColor: isDark ? '#111827' : '#FFFFFF', borderBottomColor: isDark ? '#374151' : '#E5E7EB' }]}>
        <TouchableOpacity
          onPress={() => setActiveTab('learn')}
          style={[s.tabItem, activeTab === 'learn' && s.tabItemActive]}
          activeOpacity={0.75}
        >
          <Text style={[s.tabLabel, { color: activeTab === 'learn' ? '#6366F1' : colors.textSecondary }]}>
            📚 Learn
          </Text>
          <Text style={[s.tabSub, { color: activeTab === 'learn' ? '#6366F1' : colors.textSecondary }]}>
            {learnedCount}/{totalLearning}
          </Text>
          {activeTab === 'learn' && <View style={s.activeTabIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('practice')}
          style={[s.tabItem, activeTab === 'practice' && s.tabItemActive]}
          activeOpacity={0.75}
        >
          <Text style={[s.tabLabel, { color: activeTab === 'practice' ? '#6366F1' : colors.textSecondary }]}>
            🧠 Practice
          </Text>
          <Text style={[s.tabSub, { color: activeTab === 'practice' ? '#6366F1' : colors.textSecondary }]}>
            {Object.keys(todayState?.practiceAnswers || {}).length}/{totalLearning}
          </Text>
          {activeTab === 'practice' && <View style={s.activeTabIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('test')}
          style={[s.tabItem, activeTab === 'test' && s.tabItemActive]}
          activeOpacity={0.75}
        >
          <Text style={[s.tabLabel, { color: activeTab === 'test' ? '#6366F1' : colors.textSecondary }]}>
            📝 Daily Test
          </Text>
          <Text style={[s.tabSub, { color: activeTab === 'test' ? '#6366F1' : colors.textSecondary }]}>
            {totalTest} MCQs
          </Text>
          {activeTab === 'test' && <View style={s.activeTabIndicator} />}
        </TouchableOpacity>

        {(todayState?.attempts && todayState.attempts.length > 0) && (
          <TouchableOpacity
            onPress={() => setActiveTab('results')}
            style={[s.tabItem, activeTab === 'results' && s.tabItemActive]}
            activeOpacity={0.75}
          >
            <Text style={[s.tabLabel, { color: activeTab === 'results' ? (todayState.completed ? '#10B981' : '#EF4444') : colors.textSecondary }]}>
              {todayState.completed ? '🎉 Result' : '❌ Result'}
            </Text>
            <Text style={[s.tabSub, { color: activeTab === 'results' ? (todayState.completed ? '#10B981' : '#EF4444') : colors.textSecondary }]}>
              {todayState.bestScore}%
            </Text>
            {activeTab === 'results' && (
              <View style={[s.activeTabIndicator, { backgroundColor: todayState.completed ? '#10B981' : '#EF4444' }]} />
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Main Scrollable Content */}
      <ScrollView ref={scrollRef} style={s.content} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* ══════════════════════════════════════════════════════════════════
            PHASE 1: LEARN
        ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'learn' && currentLearnQ && (
          <View style={s.phaseContainer}>
            {/* Progress Bar */}
            <View style={s.progressBarBg}>
              <View style={[s.progressBarFill, { width: `${Math.min(100, ((learnIndex + 1) / totalLearning) * 100)}%` }]} />
            </View>

            {/* Question Card */}
            <View style={[s.card, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF', borderColor: isDark ? '#374151' : '#E5E7EB' }]}>
              <View style={s.cardMetaRow}>
                <View style={s.indexPill}>
                  <Text style={s.indexPillText}>
                    Question {learnIndex + 1} of {totalLearning}
                  </Text>
                </View>
                <View style={[s.diffPill, { backgroundColor: isDark ? '#374151' : '#F3F4F6' }]}>
                  <Text style={[s.diffPillText, { color: colors.textSecondary }]}>
                    {currentLearnQ.difficulty ? currentLearnQ.difficulty.toUpperCase() : 'MEDIUM'}
                  </Text>
                </View>
              </View>

              <Text style={[s.questionTitle, { color: colors.text }]}>
                {currentLearnQ.title || currentLearnQ.question}
              </Text>

              {currentLearnQ.title && currentLearnQ.question !== currentLearnQ.title && (
                <Text style={[s.questionStatement, { color: colors.textSecondary }]}>
                  {currentLearnQ.question}
                </Text>
              )}

              {/* Code snippets if present */}
              {currentLearnQ.codeExamples && currentLearnQ.codeExamples.length > 0 && (
                <View style={[s.codeBox, { backgroundColor: isDark ? '#111827' : '#1E1E2E' }]}>
                  <Text style={s.codeLang}>{currentLearnQ.codeExamples[0].language || 'javascript'}</Text>
                  <Text style={s.codeText}>{currentLearnQ.codeExamples[0].code}</Text>
                </View>
              )}

              {/* Reveal Answer Toggle */}
              <TouchableOpacity
                onPress={() => setShowAnswer((v) => !v)}
                style={[s.revealBtn, { backgroundColor: isDark ? '#374151' : '#F3F4F6' }]}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showAnswer ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color="#6366F1"
                />
                <Text style={s.revealBtnText}>
                  {showAnswer ? 'Hide Answer' : 'Reveal Answer & Explanation'}
                </Text>
              </TouchableOpacity>

              {/* Answer Content */}
              {showAnswer && (
                <View style={s.answerSection}>
                  {/* TTS Speak Action */}
                  <TouchableOpacity
                    onPress={() => handleToggleSpeech(`${currentLearnQ.title || currentLearnQ.question}. ${currentLearnQ.answer}`)}
                    style={[s.ttsBtn, { backgroundColor: isSpeaking ? '#EF4444' : '#6366F1' }]}
                    activeOpacity={0.8}
                  >
                    <Ionicons name={isSpeaking ? 'stop' : 'volume-high'} size={18} color="#FFFFFF" />
                    <Text style={s.ttsBtnText}>{isSpeaking ? 'Stop Playing' : 'Listen Answer'}</Text>
                  </TouchableOpacity>

                  <Text style={[s.answerHeading, { color: colors.text }]}>💡 Definition:</Text>
                  <Text style={[s.answerText, { color: colors.text }]}>{currentLearnQ.answer}</Text>

                  {currentLearnQ.importantPoints && currentLearnQ.importantPoints.length > 0 && (
                    <View style={s.pointsBox}>
                      <Text style={[s.pointsHeading, { color: colors.text }]}>Key Interview Points:</Text>
                      {currentLearnQ.importantPoints.map((pt, i) => (
                        <View key={i} style={s.bulletRow}>
                          <Text style={s.bulletDot}>•</Text>
                          <Text style={[s.bulletText, { color: colors.text }]}>{pt}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {currentLearnQ.explanation && (
                    <View style={[s.explanationCard, { backgroundColor: isDark ? 'rgba(99, 102, 241, 0.1)' : '#EEF2FF' }]}>
                      <Text style={[s.explanationHeading, { color: isDark ? '#C7D2FE' : '#4338CA' }]}>
                        Simple Explanation — English:
                      </Text>
                      <Text style={[s.explanationText, { color: isDark ? '#E0E7FF' : '#3730A3' }]}>
                        {currentLearnQ.explanation}
                      </Text>
                    </View>
                  )}

                  {currentLearnQ.explanationHindi && (
                    <View style={[s.explanationCard, { backgroundColor: isDark ? 'rgba(99, 102, 241, 0.1)' : '#EEF2FF', marginTop: 12 }]}>
                      <Text style={[s.explanationHeading, { color: isDark ? '#C7D2FE' : '#4338CA' }]}>
                        सरल व्याख्या — हिंदी:
                      </Text>
                      <Text style={[s.explanationText, { color: isDark ? '#E0E7FF' : '#3730A3' }]}>
                        {currentLearnQ.explanationHindi}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>

            {/* Bottom Controls */}
            <View style={s.navRow}>
              <TouchableOpacity
                onPress={handlePrevLearn}
                disabled={learnIndex === 0}
                style={[s.navBtn, learnIndex === 0 && s.navBtnDisabled, { borderColor: colors.border }]}
                activeOpacity={0.7}
              >
                <Ionicons name="chevron-back" size={18} color={learnIndex === 0 ? '#9CA3AF' : colors.text} />
                <Text style={[s.navBtnText, { color: learnIndex === 0 ? '#9CA3AF' : colors.text }]}>
                  Previous
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleNextLearn}
                style={[s.navBtnPrimary, { backgroundColor: '#6366F1' }]}
                activeOpacity={0.85}
              >
                <Text style={s.navBtnPrimaryText}>
                  {learnIndex === totalLearning - 1 ? 'Finish Learning' : 'Next Question'}
                </Text>
                <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            PHASE 2: PRACTICE
        ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'practice' && currentPracticeQ && (
          <View style={s.phaseContainer}>
            <View style={s.practiceBanner}>
              <Text style={s.practiceBannerText}>
                🧠 Instant Feedback Practice • Question {practiceIndex + 1} of {totalLearning}
              </Text>
            </View>

            <View style={[s.card, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF', borderColor: isDark ? '#374151' : '#E5E7EB' }]}>
              <Text style={[s.questionTitle, { color: colors.text }]}>
                {currentPracticeQ.title || currentPracticeQ.question}
              </Text>

              {/* MCQ Options if available, else flashcard answer */}
              {currentPracticeQ.mcq?.enabled && currentPracticeQ.mcq.options ? (
                <View style={s.optionsContainer}>
                  {currentPracticeQ.mcq.options.map((opt) => {
                    const selected = todayState?.practiceAnswers[currentPracticeQ._id];
                    const isSelected = selected === opt.id;
                    const isCorrect = opt.id === currentPracticeQ.mcq?.correctOption;
                    const hasAnswered = !!selected;

                    let bg = isDark ? '#374151' : '#F9FAFB';
                    let border = isDark ? '#4B5563' : '#E5E7EB';
                    let textColor = colors.text;

                    if (hasAnswered) {
                      if (isCorrect) {
                        bg = 'rgba(16, 185, 129, 0.15)';
                        border = '#10B981';
                        textColor = '#10B981';
                      } else if (isSelected && !isCorrect) {
                        bg = 'rgba(239, 68, 68, 0.15)';
                        border = '#EF4444';
                        textColor = '#EF4444';
                      }
                    }

                    return (
                      <TouchableOpacity
                        key={opt.id}
                        onPress={() => handlePracticeSelect(opt.id)}
                        disabled={hasAnswered}
                        style={[s.optionItem, { backgroundColor: bg, borderColor: border }]}
                        activeOpacity={0.7}
                      >
                        <View style={[s.optionIdBadge, { backgroundColor: border }]}>
                          <Text style={s.optionIdText}>{opt.id}</Text>
                        </View>
                        <Text style={[s.optionText, { color: textColor }]}>{opt.text}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : (
                <View style={s.flashcardPractice}>
                  <Text style={[s.answerHeading, { color: colors.text }]}>Answer:</Text>
                  <Text style={[s.answerText, { color: colors.text }]}>{currentPracticeQ.answer}</Text>
                </View>
              )}

              {/* Practice Explanation */}
              {todayState?.practiceAnswers[currentPracticeQ._id] && (
                <View style={[s.explanationCard, { backgroundColor: isDark ? 'rgba(99, 102, 241, 0.1)' : '#EEF2FF' }]}>
                  <Text style={[s.explanationHeading, { color: isDark ? '#C7D2FE' : '#4338CA' }]}>
                    Explanation:
                  </Text>
                  <Text style={[s.explanationText, { color: isDark ? '#E0E7FF' : '#3730A3' }]}>
                    {currentPracticeQ.mcq?.explanation || currentPracticeQ.explanation || currentPracticeQ.answer}
                  </Text>
                </View>
              )}
            </View>

            <View style={s.navRow}>
              <TouchableOpacity
                onPress={handlePrevPractice}
                disabled={practiceIndex === 0}
                style={[s.navBtn, practiceIndex === 0 && s.navBtnDisabled, { borderColor: colors.border }]}
                activeOpacity={0.7}
              >
                <Ionicons name="chevron-back" size={18} color={practiceIndex === 0 ? '#9CA3AF' : colors.text} />
                <Text style={[s.navBtnText, { color: practiceIndex === 0 ? '#9CA3AF' : colors.text }]}>
                  Previous
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleNextPractice}
                style={[s.navBtnPrimary, { backgroundColor: '#6366F1' }]}
                activeOpacity={0.85}
              >
                <Text style={s.navBtnPrimaryText}>
                  {practiceIndex === totalLearning - 1 ? 'Ready for Test' : 'Next Practice'}
                </Text>
                <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            PHASE 3: DAILY TEST
        ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'test' && currentTestQ && (
          <View style={s.phaseContainer}>
            {/* Test Header */}
            <View style={s.testHeaderRow}>
              <View style={s.indexPill}>
                <Text style={s.indexPillText}>
                  Question {testIndex + 1} of {totalTest}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowSubmitConfirm(true)}
                style={s.submitTestTopBtn}
                activeOpacity={0.8}
              >
                <Text style={s.submitTestTopBtnText}>Submit Test ({answeredTestCount}/{totalTest})</Text>
              </TouchableOpacity>
            </View>

            <View style={[s.card, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF', borderColor: isDark ? '#374151' : '#E5E7EB' }]}>
              <Text style={[s.questionTitle, { color: colors.text }]}>
                {currentTestQ.question}
              </Text>

              {/* Neutral Radio Options */}
              <View style={s.optionsContainer}>
                {currentTestQ.options.map((opt) => {
                  const isSelected = testAnswers[currentTestQ._id] === opt.id;
                  return (
                    <TouchableOpacity
                      key={opt.id}
                      onPress={() => handleSelectTestOption(opt.id)}
                      style={[
                        s.optionItem,
                        {
                          backgroundColor: isSelected
                            ? isDark
                              ? 'rgba(99, 102, 241, 0.2)'
                              : '#EEF2FF'
                            : isDark
                            ? '#374151'
                            : '#F9FAFB',
                          borderColor: isSelected ? '#6366F1' : isDark ? '#4B5563' : '#E5E7EB',
                        },
                      ]}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          s.radioCircle,
                          { borderColor: isSelected ? '#6366F1' : colors.textSecondary },
                        ]}
                      >
                        {isSelected && <View style={s.radioInnerCircle} />}
                      </View>
                      <Text
                        style={[
                          s.optionText,
                          { color: isSelected ? (isDark ? '#E0E7FF' : '#4338CA') : colors.text },
                        ]}
                      >
                        {opt.text}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Test Navigation */}
            <View style={s.navRow}>
              <TouchableOpacity
                onPress={() => setTestIndex((i) => Math.max(0, i - 1))}
                disabled={testIndex === 0}
                style={[s.navBtn, testIndex === 0 && s.navBtnDisabled, { borderColor: colors.border }]}
                activeOpacity={0.7}
              >
                <Ionicons name="chevron-back" size={18} color={testIndex === 0 ? '#9CA3AF' : colors.text} />
                <Text style={[s.navBtnText, { color: testIndex === 0 ? '#9CA3AF' : colors.text }]}>Previous</Text>
              </TouchableOpacity>

              {testIndex < totalTest - 1 ? (
                <TouchableOpacity
                  onPress={() => setTestIndex((i) => i + 1)}
                  style={[s.navBtnPrimary, { backgroundColor: '#6366F1' }]}
                  activeOpacity={0.85}
                >
                  <Text style={s.navBtnPrimaryText}>Next</Text>
                  <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => setShowSubmitConfirm(true)}
                  style={[s.navBtnPrimary, { backgroundColor: '#10B981' }]}
                  activeOpacity={0.85}
                >
                  <Text style={s.navBtnPrimaryText}>Finish & Submit</Text>
                  <Ionicons name="checkmark-done" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            PHASE 4: RESULTS & MISTAKE REVIEW
        ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'results' && latestAttempt && (
          <View style={s.phaseContainer}>
            {/* Celebration or Failure Banner */}
            <LinearGradient
              colors={
                latestAttempt.passed
                  ? ['#065F46', '#047857', '#059669']
                  : ['#991B1B', '#B91C1C', '#DC2626']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.resultBanner}
            >
              <View style={s.resultBannerContent}>
                <Text style={s.resultBannerEmoji}>
                  {latestAttempt.passed ? '🎉' : '❌'}
                </Text>
                <Text style={s.resultBannerTitle}>
                  {latestAttempt.passed ? 'Daily Challenge Completed!' : 'Daily Challenge Not Completed'}
                </Text>
                <Text style={s.resultBannerSub}>
                  {latestAttempt.passed
                    ? `Awesome work! You scored ${latestAttempt.percentage}% (${todayState?.settingsSnapshot.passingScore}% required).`
                    : `You scored ${latestAttempt.percentage}%. ${todayState?.settingsSnapshot.passingScore}% is required to pass today's challenge.`}
                </Text>

                {latestAttempt.passed && (
                  <View style={s.streakBadgeBox}>
                    <Text style={s.streakBadgeText}>🔥 {streak.currentStreak} Day Streak Active!</Text>
                  </View>
                )}
              </View>
            </LinearGradient>

            {/* Score Metrics Grid */}
            <View style={[s.metricsCard, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF', borderColor: isDark ? '#374151' : '#E5E7EB' }]}>
              <View style={s.metricBox}>
                <Text style={[s.metricBoxVal, { color: '#6366F1' }]}>{latestAttempt.score}/{latestAttempt.totalQuestions}</Text>
                <Text style={[s.metricBoxLbl, { color: colors.textSecondary }]}>Score</Text>
              </View>
              <View style={s.metricBox}>
                <Text style={[s.metricBoxVal, { color: latestAttempt.passed ? '#10B981' : '#EF4444' }]}>{latestAttempt.percentage}%</Text>
                <Text style={[s.metricBoxLbl, { color: colors.textSecondary }]}>Accuracy</Text>
              </View>
              <View style={s.metricBox}>
                <Text style={[s.metricBoxVal, { color: colors.text }]}>{todayState?.attempts.length || 1}</Text>
                <Text style={[s.metricBoxLbl, { color: colors.textSecondary }]}>Attempts</Text>
              </View>
              <View style={s.metricBox}>
                <Text style={[s.metricBoxVal, { color: '#F59E0B' }]}>{todayState?.bestScore}%</Text>
                <Text style={[s.metricBoxLbl, { color: colors.textSecondary }]}>Best Score</Text>
              </View>
            </View>

            {/* If Failed: Action Buttons to Retry */}
            {!latestAttempt.passed && (
              <View style={s.retryActionBox}>
                <TouchableOpacity
                  onPress={handleRetryTestPress}
                  disabled={retryingTest}
                  style={s.retryTestBtn}
                  activeOpacity={0.85}
                >
                  {retryingTest ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons name="refresh" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                      <Text style={s.retryTestBtnText}>Retry Test (Fresh Questions)</Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setActiveTab('learn');
                    setLearnIndex(0);
                    scrollRef.current?.scrollTo({ y: 0, animated: true });
                  }}
                  style={[s.reviewLearnBtn, { borderColor: colors.border }]}
                  activeOpacity={0.8}
                >
                  <Text style={[s.reviewLearnBtnText, { color: colors.text }]}>
                    Review Learning Material
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Mistake Review Header */}
            <View style={s.mistakeSectionHeader}>
              <Text style={[s.mistakeHeading, { color: colors.text }]}>
                Review Answers ({latestAttempt.reviewItems.length})
              </Text>
              <View style={s.filterRow}>
                <TouchableOpacity
                  onPress={() => setReviewFilter('mistakes')}
                  style={[s.filterChip, reviewFilter === 'mistakes' && s.filterChipActive]}
                >
                  <Text style={[s.filterChipText, reviewFilter === 'mistakes' && s.filterChipTextActive]}>
                    Mistakes ({latestAttempt.reviewItems.filter((r) => !r.isCorrect).length})
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setReviewFilter('all')}
                  style={[s.filterChip, reviewFilter === 'all' && s.filterChipActive]}
                >
                  <Text style={[s.filterChipText, reviewFilter === 'all' && s.filterChipTextActive]}>
                    All ({latestAttempt.reviewItems.length})
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* List of Review Items */}
            {latestAttempt.reviewItems
              .filter((item) => (reviewFilter === 'mistakes' ? !item.isCorrect : true))
              .map((item, idx) => (
                <View
                  key={item.questionId}
                  style={[
                    s.reviewItemCard,
                    {
                      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                      borderColor: item.isCorrect ? '#10B981' : '#EF4444',
                    },
                  ]}
                >
                  <View style={s.reviewCardHeader}>
                    <View
                      style={[
                        s.resultPill,
                        {
                          backgroundColor: item.isCorrect
                            ? 'rgba(16, 185, 129, 0.15)'
                            : 'rgba(239, 68, 68, 0.15)',
                        },
                      ]}
                    >
                      <Ionicons
                        name={item.isCorrect ? 'checkmark-circle' : 'close-circle'}
                        size={14}
                        color={item.isCorrect ? '#10B981' : '#EF4444'}
                      />
                      <Text
                        style={[
                          s.resultPillText,
                          { color: item.isCorrect ? '#10B981' : '#EF4444' },
                        ]}
                      >
                        {item.isCorrect ? 'Correct' : 'Mistake'}
                      </Text>
                    </View>
                    {item.technologyName && (
                      <Text style={[s.reviewTechName, { color: colors.textSecondary }]}>
                        {item.technologyName}
                      </Text>
                    )}
                  </View>

                  <Text style={[s.reviewQText, { color: colors.text }]}>{item.question}</Text>

                  {/* Chosen vs Correct Answer */}
                  <View style={s.answerComparisonBox}>
                    <View style={s.answerCompRow}>
                      <Text style={s.answerCompLabel}>Your Answer:</Text>
                      <Text style={[s.answerCompVal, { color: item.isCorrect ? '#10B981' : '#EF4444' }]}>
                        Option {item.selectedOption || 'None (Unanswered)'}
                      </Text>
                    </View>
                    {!item.isCorrect && (
                      <View style={s.answerCompRow}>
                        <Text style={s.answerCompLabel}>Correct Answer:</Text>
                        <Text style={[s.answerCompVal, { color: '#10B981' }]}>
                          Option {item.correctOption}
                        </Text>
                      </View>
                    )}
                  </View>

                  {item.explanation && (
                    <View style={[s.reviewExpBox, { backgroundColor: isDark ? '#111827' : '#F3F4F6' }]}>
                      <Text style={[s.reviewExpTitle, { color: colors.text }]}>💡 Explanation:</Text>
                      <Text style={[s.reviewExpText, { color: colors.textSecondary }]}>
                        {item.explanation}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
          </View>
        )}
      </ScrollView>

      {/* Submit Confirmation Modal */}
      <Modal visible={showSubmitConfirm} transparent animationType="fade" onRequestClose={() => setShowSubmitConfirm(false)}>
        <View style={s.modalOverlay}>
          <View style={[s.modalBox, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
            <Ionicons name="help-circle-outline" size={42} color="#6366F1" style={{ marginBottom: 12 }} />
            <Text style={[s.modalTitle, { color: colors.text }]}>Submit Daily Test?</Text>
            <Text style={[s.modalSub, { color: colors.textSecondary }]}>
              You have answered {answeredTestCount} of {totalTest} questions.
              {answeredTestCount < totalTest && '\nUnanswered questions will be counted as incorrect.'}
            </Text>
            <View style={s.modalBtnRow}>
              <TouchableOpacity
                onPress={() => setShowSubmitConfirm(false)}
                style={[s.modalBtn, { borderColor: colors.border }]}
              >
                <Text style={[s.modalBtnText, { color: colors.text }]}>Continue Test</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirmSubmitTest}
                style={[s.modalBtnPrimary, { backgroundColor: '#6366F1' }]}
              >
                {submittingTest ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={s.modalBtnPrimaryText}>Submit Now</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Settings Modal */}
      <DailyChallengeSettingsModal visible={showSettings} onClose={() => setShowSettings(false)} />

      {/* History Modal */}
      <DailyHistoryModal visible={showHistory} onClose={() => setShowHistory(false)} />
    </View>
  );
};

const s = StyleSheet.create({
  root: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 14,
    fontSize: 15,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
  },
  errorSub: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 44 : 52,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: 6,
    marginRight: 8,
  },
  appBarTitleBox: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  appBarTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  dayPill: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  dayPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  appBarDate: {
    fontSize: 11,
    marginTop: 1,
  },
  appBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionIconBtn: {
    padding: 4,
  },
  streakPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  streakPillText: {
    color: '#D97706',
    fontSize: 12,
    fontWeight: '800',
  },
  techTagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  focusLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginRight: 6,
  },
  techTagsScroll: {
    flexDirection: 'row',
    gap: 6,
  },
  techTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  techTagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    position: 'relative',
  },
  tabItemActive: {},
  tabLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  tabSub: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: '500',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: '60%',
    backgroundColor: '#6366F1',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  phaseContainer: {
    width: '100%',
  },
  progressBarBg: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 2,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
  },
  cardMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  indexPill: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  indexPillText: {
    color: '#6366F1',
    fontSize: 12,
    fontWeight: '700',
  },
  diffPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  diffPillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 25,
    marginBottom: 10,
  },
  questionStatement: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },
  codeBox: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  codeLang: {
    color: '#9CA3AF',
    fontSize: 10,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginBottom: 4,
  },
  codeText: {
    color: '#F9FAFB',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
    lineHeight: 18,
  },
  revealBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    marginTop: 6,
  },
  revealBtnText: {
    color: '#6366F1',
    fontSize: 14,
    fontWeight: '700',
  },
  answerSection: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(156, 163, 175, 0.2)',
    paddingTop: 16,
  },
  ttsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 14,
  },
  ttsBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  answerHeading: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  answerText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 14,
  },
  pointsBox: {
    marginBottom: 14,
  },
  pointsHeading: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  bulletDot: {
    color: '#6366F1',
    fontSize: 16,
    lineHeight: 18,
    marginRight: 6,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
  },
  explanationCard: {
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
  },
  explanationHeading: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  explanationText: {
    fontSize: 13,
    lineHeight: 19,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  navBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  navBtnDisabled: {
    opacity: 0.4,
  },
  navBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  navBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
  },
  navBtnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  practiceBanner: {
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  practiceBannerText: {
    color: '#6366F1',
    fontSize: 12,
    fontWeight: '700',
  },
  optionsContainer: {
    gap: 10,
    marginTop: 10,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    gap: 12,
  },
  optionIdBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIdText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  flashcardPractice: {
    marginTop: 12,
  },
  testHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  submitTestTopBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  submitTestTopBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInnerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6366F1',
  },
  resultBanner: {
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
  },
  resultBannerContent: {
    alignItems: 'center',
    textAlign: 'center',
  },
  resultBannerEmoji: {
    fontSize: 42,
    marginBottom: 6,
  },
  resultBannerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
  },
  resultBannerSub: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 12,
  },
  streakBadgeBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  streakBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  metricsCard: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 14,
    marginBottom: 16,
  },
  metricBox: {
    flex: 1,
    alignItems: 'center',
  },
  metricBoxVal: {
    fontSize: 18,
    fontWeight: '800',
  },
  metricBoxLbl: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  retryActionBox: {
    gap: 10,
    marginBottom: 20,
  },
  retryTestBtn: {
    backgroundColor: '#6366F1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
  },
  retryTestBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  reviewLearnBtn: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  reviewLearnBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  mistakeSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mistakeHeading: {
    fontSize: 16,
    fontWeight: '700',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 6,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(156, 163, 175, 0.2)',
  },
  filterChipActive: {
    backgroundColor: '#6366F1',
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  reviewItemCard: {
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 14,
    marginBottom: 12,
  },
  reviewCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  resultPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  reviewTechName: {
    fontSize: 11,
    fontWeight: '500',
  },
  reviewQText: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 21,
    marginBottom: 10,
  },
  answerComparisonBox: {
    backgroundColor: 'rgba(156, 163, 175, 0.1)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    gap: 4,
  },
  answerCompRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  answerCompLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  answerCompVal: {
    fontSize: 12,
    fontWeight: '700',
  },
  reviewExpBox: {
    borderRadius: 8,
    padding: 10,
  },
  reviewExpTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  reviewExpText: {
    fontSize: 12,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalBox: {
    width: '100%',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  modalSub: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalBtnPrimary: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalBtnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
