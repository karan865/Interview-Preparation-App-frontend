import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Speech from 'expo-speech';
import { Question } from '../../types/question';
import { questionApi } from '../../api/question.api';
import { LoadingView } from '../../components/common/LoadingView';
import { ErrorView } from '../../components/common/ErrorView';
import { RootStackParamList } from '../../navigation/types';
import { useProgress } from '../../hooks/useProgress';
import { useTheme } from '../../context/ThemeContext';
import { parseErrorMessage } from '../../utils/error';

type ScreenRouteProp = RouteProp<RootStackParamList, 'QuestionDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const formatAsPoints = (text: string) => {
  if (!text) return text;
  
  // If the text already has bullets, just ensure sentences are spaced out
  if (text.includes('- ') || text.includes('* ') || text.includes('->') || text.includes('• ')) {
    return text.replace(/\. /g, '.\n\n');
  }

  // Otherwise, automatically convert the dense paragraph into a beautiful bulleted list!
  return text
    .split(/\.\s+/)
    .map(sentence => sentence.trim())
    .filter(s => s.length > 0)
    .map(sentence => `• ${sentence}${sentence.endsWith('.') ? '' : '.'}`)
    .join('\n\n');
};

// Helper to render text with basic markdown-like formatting (bullet points, inline code)
const CustomFormattedText = ({ text, style, isDark, theme, autoFormat = false }: { text: string; style: any; isDark: boolean; theme: any; autoFormat?: boolean }) => {
  if (!text) return null;

  const processedText = autoFormat ? formatAsPoints(text) : text;

  return (
    <View style={{ width: '100%' }}>
      {processedText.split('\n').map((line, idx) => {
        const isEmpty = line.trim() === '';
        
        // Differentiate between bullet "-", "*", "•" and arrow "->"
        const isArrow = line.trim().startsWith('->');
        const isBullet = !isArrow && (line.trim().startsWith('-') || line.trim().startsWith('*') || line.trim().startsWith('•'));
        
        const isCodeBlock = line.startsWith(' ') || line.trim().startsWith('function') || line.trim().startsWith('const') || line.trim().startsWith('let');

        // Parse inline code with backticks
        const parts = line.split(/(`[^`]+`)/);

        const renderParts = (textToRender: string) => {
          return textToRender.split(/(`[^`]+`)/).map((part, i) => {
            if (part.startsWith('`') && part.endsWith('`')) {
              return (
                <Text
                  key={i}
                  style={[
                    style,
                    {
                      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
                      backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#F1F5F9',
                      color: isDark ? '#60A5FA' : '#2563EB',
                      fontSize: (style?.fontSize || 15) - 0.5,
                    },
                  ]}
                >
                  {part.substring(1, part.length - 1)}
                </Text>
              );
            }
            return <Text key={i} style={style}>{part}</Text>;
          });
        };

        if (isEmpty) {
          return <View key={idx} style={{ height: 12 }} />;
        }

        if (isArrow) {
          return (
            <View key={idx} style={{ flexDirection: 'row', marginBottom: 12, paddingLeft: 4, marginTop: 8 }}>
              <Text style={[style, { marginRight: 8, fontSize: 16, color: theme.colors.primary, fontWeight: 'bold' }]}>➔</Text>
              <Text style={[{ flex: 1 }, style]}>
                {renderParts(line.substring(line.indexOf('->') + 2).trim())}
              </Text>
            </View>
          );
        }

        if (isBullet) {
          return (
            <View key={idx} style={{ flexDirection: 'row', marginBottom: 10, paddingLeft: 12 }}>
              <Text style={[style, { marginRight: 10, fontSize: 20, lineHeight: 22, color: theme.colors.primary }]}>•</Text>
              <Text style={[{ flex: 1 }, style]}>
                {renderParts(line.substring(line.indexOf(line.trim()[0]) + 1).trim())}
              </Text>
            </View>
          );
        }

        if (isCodeBlock) {
          return (
            <View key={idx} style={{ backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : '#F8FAFC', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6, marginBottom: 4, borderLeftWidth: 2, borderLeftColor: theme.colors.border }}>
              <Text style={[{ fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', color: isDark ? '#93C5FD' : '#2563EB', fontSize: 14 }]}>
                {line}
              </Text>
            </View>
          );
        }

        return (
          <Text key={idx} style={[style, { marginBottom: 10, lineHeight: 24 }]}>
            {renderParts(line)}
          </Text>
        );
      })}
    </View>
  );
};

export const QuestionDetailScreen: React.FC = () => {
  const { theme, isDark } = useTheme();
  const route = useRoute<ScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { questionId, question: initialQuestion, questionsQueue, queueIndex = 0 } = route.params;

  const { savedIds, toggleSave, viewQuestion, saveLastOpened } = useProgress();
  const [question, setQuestion] = useState<Question | null>(initialQuestion || null);
  const [isLoading, setIsLoading] = useState<boolean>(!initialQuestion);
  const [error, setError] = useState<string | null>(null);

  // Audio Text-to-Speech State
  const [isSpeakingMain, setIsSpeakingMain] = useState<boolean>(false);
  const [isSpeakingInterview, setIsSpeakingInterview] = useState<boolean>(false);
  const [copiedQuestion, setCopiedQuestion] = useState<boolean>(false);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  // Collapsible Dropdown States
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    explanation: false,
    explanationHindi: false,
    importantPoints: false,
    interviewAnswer: false,
    code: false,
    analogy: false,
    comparisons: false,
    mistakes: false,
    followUp: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const loadQuestion = useCallback(async () => {
    if (!questionId) return;

    viewQuestion(questionId);

    if (initialQuestion) {
      setQuestion(initialQuestion);
      setIsLoading(false);

      const techName =
        typeof initialQuestion.technologyId === 'object' && initialQuestion.technologyId
          ? (initialQuestion.technologyId as any).name
          : 'Git';
      const topName =
        typeof initialQuestion.topicId === 'object' && initialQuestion.topicId
          ? (initialQuestion.topicId as any).name
          : undefined;

      saveLastOpened({
        questionId,
        title: initialQuestion.title || initialQuestion.question,
        technologyName: techName,
        topicName: topName,
        openedAt: new Date().toISOString(),
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await questionApi.getQuestionById(questionId);
      setQuestion(data);

      const techName =
        typeof data.technologyId === 'object' && data.technologyId
          ? (data.technologyId as any).name
          : 'Git';
      const topName =
        typeof data.topicId === 'object' && data.topicId
          ? (data.topicId as any).name
          : undefined;

      saveLastOpened({
        questionId,
        title: data.title || data.question,
        technologyName: techName,
        topicName: topName,
        openedAt: new Date().toISOString(),
      });
    } catch (err) {
      setError(parseErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [questionId, initialQuestion, viewQuestion, saveLastOpened]);

  const stopAllSpeech = async () => {
    try {
      await Speech.stop();
    } catch (e) {}
    setIsSpeakingMain(false);
    setIsSpeakingInterview(false);
  };

  useEffect(() => {
    stopAllSpeech();
    loadQuestion();
    return () => {
      stopAllSpeech();
    };
  }, [loadQuestion]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      stopAllSpeech();
    });
    return unsubscribe;
  }, [navigation]);

  const qId = question?.id || question?._id || questionId;
  const isSaved = savedIds.includes(qId);

  // Text-to-Speech: Main Question & Answer
  const handleToggleMainSpeech = async () => {
    if (!question) return;

    if (isSpeakingMain) {
      await stopAllSpeech();
    } else {
      await stopAllSpeech();
      setIsSpeakingMain(true);
      const textToSpeak = `${question.title || question.question}. Answer: ${question.answer || ''}`;
      Speech.speak(textToSpeak, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.95,
        onDone: () => setIsSpeakingMain(false),
        onStopped: () => setIsSpeakingMain(false),
        onError: () => setIsSpeakingMain(false),
      });
    }
  };

  // Text-to-Speech: Interview Answer
  const handleToggleInterviewSpeech = async () => {
    if (!question || !question.interviewAnswer) return;

    if (isSpeakingInterview) {
      await stopAllSpeech();
    } else {
      await stopAllSpeech();
      setIsSpeakingInterview(true);
      const textToSpeak = `Here is how to answer in an interview: ${question.interviewAnswer}`;
      Speech.speak(textToSpeak, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.95,
        onDone: () => setIsSpeakingInterview(false),
        onStopped: () => setIsSpeakingInterview(false),
        onError: () => setIsSpeakingInterview(false),
      });
    }
  };

  // Copy Question
  const handleCopyQuestion = async () => {
    if (!question) return;
    try {
      const text = `${question.title || question.question}\n\nAnswer:\n${question.answer}`;
      await Clipboard.setStringAsync(text);
      setCopiedQuestion(true);
      setTimeout(() => setCopiedQuestion(false), 2000);
    } catch (e) {
      console.warn('Failed to copy question:', e);
    }
  };

  // Queue navigation
  const totalInQueue = questionsQueue ? questionsQueue.length : 20;
  const currentNum = queueIndex + 1;
  const hasPrevious = Boolean(questionsQueue && queueIndex > 0);
  const hasNext = Boolean(questionsQueue && queueIndex < (questionsQueue?.length || 0) - 1);
  const completionPercent = Math.min(100, Math.round((currentNum / totalInQueue) * 100));

  const handlePreviousQuestion = () => {
    stopAllSpeech();
    if (questionsQueue && queueIndex > 0) {
      const prevIndex = queueIndex - 1;
      const prevQ = questionsQueue[prevIndex];
      const prevId = prevQ.id || prevQ._id || '';

      navigation.replace('QuestionDetail', {
        questionId: prevId,
        question: prevQ,
        questionsQueue,
        queueIndex: prevIndex,
      });
    }
  };

  const handleNextQuestion = () => {
    stopAllSpeech();
    if (questionsQueue && queueIndex < (questionsQueue?.length || 0) - 1) {
      const nextIndex = queueIndex + 1;
      const nextQ = questionsQueue[nextIndex];
      const nextId = nextQ.id || nextQ._id || '';

      navigation.replace('QuestionDetail', {
        questionId: nextId,
        question: nextQ,
        questionsQueue,
        queueIndex: nextIndex,
      });
    } else {
      Alert.alert(
        "You're done with this set! 🎉",
        'Great job completing this interview question set.',
        [{ text: 'Back to Questions', onPress: () => navigation.goBack() }]
      );
    }
  };

  const handleCopyCode = async (code: string, index: number) => {
    try {
      await Clipboard.setStringAsync(code);
      setCopiedCodeIndex(index);
      setTimeout(() => setCopiedCodeIndex(null), 2500);
    } catch (err) {
      console.warn('Failed to copy code:', err);
    }
  };

  const getDisplayLevel = (q: Question): 'Junior' | 'Intermediate' | 'Advanced' => {
    if (!q.preparationLevels || q.preparationLevels.length === 0) return 'Junior';
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

  if (isLoading) {
    return <LoadingView fullScreen message="Loading interview question..." />;
  }

  if (error || !question) {
    return (
      <ErrorView
        fullScreen
        message={error || 'Unable to load question details.'}
        onRetry={loadQuestion}
      />
    );
  }

  const techTitle =
    typeof question.technologyId === 'object' && question.technologyId
      ? (question.technologyId as any).name
      : 'Git';
      
  const getTechIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('react')) return 'logo-react';
    if (n.includes('node') || n.includes('express')) return 'logo-nodejs';
    if (n.includes('java') || n.includes('js')) return 'logo-javascript';
    if (n.includes('css')) return 'logo-css3';
    if (n.includes('html')) return 'logo-html5';
    if (n.includes('python')) return 'logo-python';
    if (n.includes('sql') || n.includes('mongo')) return 'server-outline';
    return 'git-branch';
  };
  const techIcon = getTechIcon(techTitle);

  const topicTitle =
    typeof question.topicId === 'object' && question.topicId
      ? (question.topicId as any).name
      : 'Git Fundamentals';

  const levelTier = getDisplayLevel(question);
  const diffLabel = (question.difficulty || 'Easy').charAt(0).toUpperCase() + (question.difficulty || 'Easy').slice(1);

  // Field presence checks
  const hasExplanation = Boolean(
    question.explanation &&
      question.explanation.trim() !== '' &&
      question.explanation.trim() !== question.answer?.trim()
  );
  const hasExplanationHindi = Boolean(
    question.explanationHindi && question.explanationHindi.trim() !== ''
  );
  const hasImportantPoints = Boolean(
    question.importantPoints && question.importantPoints.length > 0
  );
  const hasInterviewAnswer = Boolean(
    question.interviewAnswer && question.interviewAnswer.trim() !== ''
  );
  const hasCodeExamples = Boolean(question.codeExamples && question.codeExamples.length > 0);
  const hasAnalogy = Boolean(question.analogy && question.analogy.trim() !== '');
  const hasComparisons = Boolean(question.comparisons && question.comparisons.length > 0);
  const hasMistakes = Boolean(question.commonMistakes && question.commonMistakes.length > 0);
  const hasFollowUp = Boolean(
    question.followUpQuestions && question.followUpQuestions.length > 0
  );

  // Subtitle snippet under question title
  const questionSubtitle =
    question.analogy ||
    (question as any).summary ||
    null;

  return (
    <View style={[styles.screenContainer, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />

      {/* 1. TOP HEADER BAR */}
      <View style={[styles.topBar, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity
          style={[
            styles.circleButton,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
          onPress={() => {
            stopAllSpeech();
            navigation.goBack();
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
        </TouchableOpacity>

        <View style={styles.topCenterTitleWrap}>
          <Text style={styles.topBreadcrumbText} numberOfLines={1}>
            <Text style={styles.topTechText}>{techTitle}</Text>
            <Text style={styles.topTopicText}> • {topicTitle}</Text>
          </Text>
          <Text style={[styles.topSubtitleText, { color: theme.colors.textSecondary }]}>
            Master version control, one question at a time
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.circleButton,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
          onPress={() => toggleSave(qId)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isSaved ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={isSaved ? theme.colors.primary : theme.colors.text}
          />
        </TouchableOpacity>
      </View>

      {/* Main Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. QUESTION HERO CARD */}
        <View
          style={[
            styles.questionCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          {/* Top Row: Question 03 of 20 & Badges */}
          <View style={styles.questionCardTopRow}>
            <View
              style={[
                styles.questionIndexPill,
                { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9', flexShrink: 0 },
              ]}
            >
              <Text style={[styles.questionIndexText, { color: theme.colors.textSecondary }]}>
                Q{String(currentNum).padStart(2, '0')}
              </Text>
            </View>

            <View style={[styles.questionBadgesWrap, { flexShrink: 1 }]}>
              <View style={[styles.badgeJunior, { flexShrink: 0 }]}>
                <Ionicons name="bar-chart" size={12} color="#16A34A" style={{ marginRight: 3 }} />
                <Text style={styles.badgeJuniorText}>{levelTier}</Text>
              </View>

              <View style={[styles.badgeEasy, { flexShrink: 1 }]}>
                <Ionicons name={techIcon as any} size={13} color="#0284C7" style={{ marginRight: 3, flexShrink: 0 }} />
                <Text style={[styles.badgeEasyText, { flexShrink: 1 }]} numberOfLines={1} ellipsizeMode="tail">
                  {techTitle}
                </Text>
              </View>
            </View>
          </View>

          {/* Headline Composition */}
          <View style={styles.questionTitleRow}>
            <View style={[styles.questionTextCol, { width: '100%', paddingRight: 0 }]}>
              <Text style={[styles.questionHeadline, { color: theme.colors.text }]}>
                {question.title || question.question}
              </Text>
              {questionSubtitle ? (
                <Text style={[styles.questionSubheadline, { color: theme.colors.textSecondary }]}>
                  {questionSubtitle}
                </Text>
              ) : null}
            </View>
          </View>

          {/* Action Buttons: Listen Answer | Settings */}
          <View style={styles.questionActionsRow}>
            <TouchableOpacity
              style={[
                styles.listenAnswerBtn,
                isSpeakingMain && styles.listenAnswerBtnActive,
              ]}
              onPress={handleToggleMainSpeech}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isSpeakingMain ? 'stop' : 'volume-high'}
                size={14}
                color="#FFFFFF"
                style={{ marginRight: 5 }}
              />
              <Text style={styles.listenAnswerBtnText}>
                {isSpeakingMain ? 'Stop Playing' : 'Listen Answer'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.gearIconBtn,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
              onPress={() => {
                try {
                  (navigation as any).navigate('Settings');
                } catch (e) {}
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="settings-outline" size={18} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
        </View>



        {/* 3. ANSWER SECTIONS (Matches Markdown exactly) */}
        <View style={styles.dropdownsContainer}>
          
          {/* Section 1: My PDF Answer */}
          <View
            style={[
              styles.accordionCard,
              { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, padding: 16 },
            ]}
          >
            <Text style={[styles.accordionTitle, { color: theme.colors.primary, marginBottom: 12 }]}>
              My PDF Answer -
            </Text>
            <CustomFormattedText theme={theme} isDark={isDark} text={question.answer} style={[styles.answerBodyText, { color: theme.colors.text }]} />
          </View>

          {/* Section 2: Simple Explanation — English */}
          {hasExplanation ? (
            <View
              style={[
                styles.accordionCard,
                { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, padding: 16, marginTop: 12 },
              ]}
            >
              <Text style={[styles.accordionTitle, { color: theme.colors.primary, marginBottom: 12 }]}>
                Simple Explanation — English
              </Text>
              <CustomFormattedText theme={theme} isDark={isDark} text={question.explanation!} style={[styles.answerBodyText, { color: theme.colors.text }]} autoFormat={true} />
            </View>
          ) : null}

          {/* Section 3: Simple Explanation — Hindi */}
          {hasExplanationHindi ? (
            <View
              style={[
                styles.accordionCard,
                { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, padding: 16, marginTop: 12 },
              ]}
            >
              <Text style={[styles.accordionTitle, { color: theme.colors.primary, marginBottom: 12 }]}>
                Simple Explanation — Hindi
              </Text>
              <CustomFormattedText theme={theme} isDark={isDark} text={question.explanationHindi!} style={[styles.answerBodyText, { color: theme.colors.text }]} autoFormat={true} />
            </View>
          ) : null}

        </View>

        {/* Padding for sticky bottom bar */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* 5. STICKY BOTTOM NAVIGATION BAR */}
      <View
        style={[
          styles.bottomBarContainer,
          {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.border,
          },
        ]}
      >
        {/* Progress Tracker Row */}
        <View style={styles.progressRow}>
          <TouchableOpacity
            style={[
              styles.circleSmallBackBtn,
              {
                backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F8FAFC',
                borderColor: theme.colors.border,
              },
            ]}
            onPress={handlePreviousQuestion}
            disabled={!hasPrevious}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back"
              size={16}
              color={hasPrevious ? theme.colors.text : theme.colors.textMuted}
            />
          </TouchableOpacity>

          <View style={styles.progressCenterWrap}>
            <View style={styles.progressLabelsRow}>
              <Text style={[styles.progressQuestionTitle, { color: theme.colors.text }]}>
                Question {currentNum} of {totalInQueue}
              </Text>
              <Text style={[styles.progressPercentText, { color: theme.colors.textSecondary }]}>
                {completionPercent}% Complete
              </Text>
            </View>

            {/* Progress Bar Track & Fill */}
            <View
              style={[
                styles.progressTrack,
                { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#EEF2FF' },
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.max(5, completionPercent)}%`,
                    backgroundColor: theme.colors.primary,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Buttons Row: Previous | Next */}
        <View style={styles.navButtonsRow}>
          <TouchableOpacity
            style={[
              styles.prevButton,
              {
                backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#EEF2FF',
              },
              !hasPrevious && styles.buttonDisabled,
            ]}
            onPress={handlePreviousQuestion}
            disabled={!hasPrevious}
            activeOpacity={0.75}
          >
            <Ionicons
              name="chevron-back"
              size={16}
              color={hasPrevious ? theme.colors.text : theme.colors.textMuted}
              style={{ marginRight: 4 }}
            />
            <Text
              style={[
                styles.prevButtonText,
                { color: hasPrevious ? theme.colors.text : theme.colors.textMuted },
              ]}
            >
              Previous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.nextButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={handleNextQuestion}
            activeOpacity={0.85}
          >
            <Text style={styles.nextButtonText}>
              {hasNext ? 'Next' : 'Finish'}
            </Text>
            <Ionicons
              name="chevron-forward"
              size={17}
              color="#FFFFFF"
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#F8F9FE',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 46 : (StatusBar.currentHeight || 16) + 6,
    paddingBottom: 8,
    backgroundColor: '#F8F9FE',
  },
  circleButton: {
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
  topCenterTitleWrap: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  topBreadcrumbText: {
    fontSize: 14.5,
    fontWeight: '800',
  },
  topTechText: {
    color: '#4338CA',
  },
  topTopicText: {
    color: '#C026D3',
  },
  topSubtitleText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    elevation: 3,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  questionCardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  questionIndexPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  questionIndexText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  questionBadgesWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgeJunior: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 14,
  },
  badgeJuniorText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#16A34A',
  },
  badgeEasy: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 14,
  },
  badgeEasyText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0284C7',
  },
  questionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  questionTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  questionHeadline: {
    fontSize: 17.5,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 25,
    letterSpacing: -0.3,
  },
  questionSubheadline: {
    fontSize: 12.5,
    color: '#64748B',
    lineHeight: 18,
    marginTop: 6,
  },
  graphicStack: {
    width: 68,
    height: 72,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  folderLayer3: {
    position: 'absolute',
    top: 4,
    right: 2,
    width: 52,
    height: 58,
    borderRadius: 10,
    backgroundColor: '#DDD6FE',
    transform: [{ rotate: '12deg' }],
  },
  folderLayer2: {
    position: 'absolute',
    top: 2,
    right: 6,
    width: 54,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#BAE6FD',
    transform: [{ rotate: '6deg' }],
  },
  folderLayer1: {
    width: 56,
    height: 62,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  gitLogoDiamond: {
    width: 32,
    height: 32,
    backgroundColor: '#F97316',
    borderRadius: 6,
    transform: [{ rotate: '45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  listenAnswerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    paddingHorizontal: 12,
    paddingVertical: 6.5,
    borderRadius: 14,
  },
  listenAnswerBtnActive: {
    backgroundColor: '#EF4444',
  },
  listenAnswerBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  copyQuestionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 9.5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  copyQuestionBtnText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#334155',
  },
  gearIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
  },
  answerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
  },
  answerHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  answerHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bulbCircleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerHeaderTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F766E',
  },
  conciseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 14,
  },
  conciseBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A34A',
  },
  answerBodyText: {
    fontSize: 13.5,
    color: '#334155',
    lineHeight: 21,
  },
  inShortBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    padding: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  inShortTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#1D4ED8',
    marginBottom: 2,
  },
  inShortContent: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
  },
  dropdownsContainer: {
    gap: 10,
  },
  accordionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  accordionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  accordionIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accordionTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  accordionSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  accordionBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  paragraphText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 20,
    marginBottom: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletSymbolAmber: {
    color: '#D97706',
    fontSize: 16,
    marginRight: 8,
    marginTop: -2,
  },
  bulletSymbolRed: {
    marginRight: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    color: '#334155',
    lineHeight: 19,
  },
  interviewListenBar: {
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  interviewSpeechBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  interviewSpeechBtnActive: {
    backgroundColor: '#FEE2E2',
  },
  interviewSpeechBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#059669',
  },
  interviewAnswerText: {
    fontSize: 13,
    color: '#065F46',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  codeBlockWrap: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  codeBlockTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    paddingBottom: 6,
  },
  codeLangText: {
    color: '#94A3B8',
    fontSize: 10.5,
    fontWeight: '700',
  },
  copyCodeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  copyCodeText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  codeSnippet: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 12,
    color: '#38BDF8',
    lineHeight: 18,
  },
  codeExplainText: {
    color: '#94A3B8',
    fontSize: 11.5,
    marginTop: 8,
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  circleSmallBackBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCenterWrap: {
    flex: 1,
  },
  progressLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressQuestionTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#334155',
  },
  progressPercentText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  progressTrack: {
    height: 5,
    backgroundColor: '#EEF2FF',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 3,
  },
  navButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  prevButton: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#EEF2FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prevButtonText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  nextButton: {
    flex: 1.2,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#6366F1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  nextButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
