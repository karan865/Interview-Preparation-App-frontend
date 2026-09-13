import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { saveDailyChallengeSettings } from '../../store/slices/dailyChallengeSlice';
import {
  DailyLearningCount,
  DailyTestCount,
  DailyPassingScore,
  DailyChallengeSettings,
} from '../../types/dailyChallenge';
import { technologyApi } from '../../api/technology.api';
import { Technology } from '../../types/technology';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const DailyChallengeSettingsModal: React.FC<Props> = ({ visible, onClose }) => {
  const { colors, isDark } = useTheme();
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.dailyChallenge.settings);

  const [learningCount, setLearningCount] = useState<DailyLearningCount>(settings.learningQuestionCount);
  const [testCount, setTestCount] = useState<DailyTestCount>(settings.testQuestionCount);
  const [passingScore, setPassingScore] = useState<DailyPassingScore>(settings.passingScore);
  const [selectedTechIds, setSelectedTechIds] = useState<string[]>(settings.technologyIds || []);

  const [allTechs, setAllTechs] = useState<Technology[]>([]);
  const [loadingTechs, setLoadingTechs] = useState(false);

  useEffect(() => {
    if (visible) {
      setLearningCount(settings.learningQuestionCount);
      setTestCount(settings.testQuestionCount);
      setPassingScore(settings.passingScore);
      setSelectedTechIds(settings.technologyIds || []);

      setLoadingTechs(true);
      technologyApi
        .getTechnologies()
        .then((res) => {
          setAllTechs(res || []);
        })
        .catch(() => {})
        .finally(() => setLoadingTechs(false));
    }
  }, [visible, settings]);

  const toggleTech = (techId: string) => {
    setSelectedTechIds((prev) =>
      prev.includes(techId) ? prev.filter((id) => id !== techId) : [...prev, techId]
    );
  };

  const handleSave = () => {
    const updated: DailyChallengeSettings = {
      learningQuestionCount: learningCount,
      testQuestionCount: testCount,
      passingScore: passingScore,
      technologyIds: selectedTechIds,
    };
    dispatch(saveDailyChallengeSettings(updated));
    onClose();
  };

  const LEARNING_OPTIONS: DailyLearningCount[] = [10, 20, 30];
  const TEST_OPTIONS: DailyTestCount[] = [10, 20, 30];
  const PASSING_OPTIONS: DailyPassingScore[] = [70, 80];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={[s.container, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
          {/* Header */}
          <View style={s.header}>
            <View>
              <Text style={[s.title, { color: colors.text }]}>Daily Challenge Settings</Text>
              <Text style={[s.subtitle, { color: colors.textSecondary }]}>
                Customize your daily interview routine
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={s.closeBtn} activeOpacity={0.7}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={s.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Notice */}
            <View style={[s.noticeBox, { backgroundColor: isDark ? 'rgba(99, 102, 241, 0.15)' : '#EEF2FF' }]}>
              <Ionicons name="information-circle-outline" size={18} color="#6366F1" style={{ marginRight: 6 }} />
              <Text style={[s.noticeText, { color: isDark ? '#C7D2FE' : '#4338CA' }]}>
                Changes will automatically take effect starting from your next Daily Challenge.
              </Text>
            </View>

            {/* Section 1: Daily Learning Questions */}
            <View style={s.section}>
              <Text style={[s.sectionLabel, { color: colors.text }]}>📚 Daily Learning Questions</Text>
              <Text style={[s.sectionDesc, { color: colors.textSecondary }]}>
                Number of comprehensive interview questions to review each day
              </Text>
              <View style={s.chipRow}>
                {LEARNING_OPTIONS.map((val) => {
                  const isSelected = learningCount === val;
                  return (
                    <TouchableOpacity
                      key={val}
                      onPress={() => setLearningCount(val)}
                      style={[
                        s.chip,
                        {
                          backgroundColor: isSelected
                            ? '#6366F1'
                            : isDark
                            ? '#374151'
                            : '#F3F4F6',
                          borderColor: isSelected ? '#6366F1' : 'transparent',
                        },
                      ]}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          s.chipText,
                          { color: isSelected ? '#FFFFFF' : colors.text },
                        ]}
                      >
                        {val} Questions{val === 20 ? ' (Default)' : ''}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Section 2: Daily Test Questions */}
            <View style={s.section}>
              <Text style={[s.sectionLabel, { color: colors.text }]}>📝 Daily Test MCQs</Text>
              <Text style={[s.sectionDesc, { color: colors.textSecondary }]}>
                Number of multiple-choice questions in the daily evaluation test
              </Text>
              <View style={s.chipRow}>
                {TEST_OPTIONS.map((val) => {
                  const isSelected = testCount === val;
                  return (
                    <TouchableOpacity
                      key={val}
                      onPress={() => setTestCount(val)}
                      style={[
                        s.chip,
                        {
                          backgroundColor: isSelected
                            ? '#6366F1'
                            : isDark
                            ? '#374151'
                            : '#F3F4F6',
                          borderColor: isSelected ? '#6366F1' : 'transparent',
                        },
                      ]}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          s.chipText,
                          { color: isSelected ? '#FFFFFF' : colors.text },
                        ]}
                      >
                        {val} MCQs{val === 10 ? ' (Default)' : ''}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Section 3: Passing Score */}
            <View style={s.section}>
              <Text style={[s.sectionLabel, { color: colors.text }]}>🎯 Required Passing Score</Text>
              <Text style={[s.sectionDesc, { color: colors.textSecondary }]}>
                Minimum score percentage required to pass the test and extend your streak
              </Text>
              <View style={s.chipRow}>
                {PASSING_OPTIONS.map((val) => {
                  const isSelected = passingScore === val;
                  return (
                    <TouchableOpacity
                      key={val}
                      onPress={() => setPassingScore(val)}
                      style={[
                        s.chip,
                        {
                          backgroundColor: isSelected
                            ? '#10B981'
                            : isDark
                            ? '#374151'
                            : '#F3F4F6',
                          borderColor: isSelected ? '#10B981' : 'transparent',
                        },
                      ]}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          s.chipText,
                          { color: isSelected ? '#FFFFFF' : colors.text },
                        ]}
                      >
                        {val}% Score{val === 80 ? ' (Default)' : ''}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Section 4: Daily Technologies */}
            <View style={s.section}>
              <View style={s.techHeaderRow}>
                <Text style={[s.sectionLabel, { color: colors.text }]}>🛠️ Daily Technologies</Text>
                {selectedTechIds.length > 0 && (
                  <TouchableOpacity onPress={() => setSelectedTechIds([])}>
                    <Text style={s.resetTechsText}>Select All</Text>
                  </TouchableOpacity>
                )}
              </View>
              <Text style={[s.sectionDesc, { color: colors.textSecondary }]}>
                {selectedTechIds.length === 0
                  ? 'All active subjects included by default. Tap to restrict to specific technologies:'
                  : `${selectedTechIds.length} technologies selected:`}
              </Text>

              {loadingTechs ? (
                <ActivityIndicator size="small" color="#6366F1" style={{ marginVertical: 12 }} />
              ) : (
                <View style={s.techList}>
                  {allTechs.map((tech) => {
                    const isChecked = selectedTechIds.includes(tech._id);
                    return (
                      <TouchableOpacity
                        key={tech._id}
                        onPress={() => toggleTech(tech._id)}
                        style={[
                          s.techRowItem,
                          {
                            backgroundColor: isChecked
                              ? isDark
                                ? 'rgba(99, 102, 241, 0.2)'
                                : '#F5F3FF'
                              : isDark
                              ? '#374151'
                              : '#F9FAFB',
                            borderColor: isChecked ? '#6366F1' : isDark ? '#4B5563' : '#E5E7EB',
                          },
                        ]}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name={isChecked ? 'checkbox' : 'square-outline'}
                          size={20}
                          color={isChecked ? '#6366F1' : colors.textSecondary}
                        />
                        <Text
                          style={[
                            s.techItemName,
                            { color: isChecked ? (isDark ? '#E0E7FF' : '#4338CA') : colors.text },
                          ]}
                        >
                          {tech.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
            <View style={{ height: 24 }} />
          </ScrollView>

          {/* Footer Save CTA */}
          <View style={[s.footer, { borderTopColor: isDark ? '#374151' : '#E5E7EB' }]}>
            <TouchableOpacity onPress={handleSave} style={s.saveBtn} activeOpacity={0.85}>
              <Text style={s.saveBtnText}>Save Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingTop: 20,
    paddingBottom: 28,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '500',
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 10,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  techHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resetTechsText: {
    color: '#6366F1',
    fontSize: 12,
    fontWeight: '600',
  },
  techList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  techRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  techItemName: {
    fontSize: 13,
    fontWeight: '500',
  },
  footer: {
    paddingTop: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
  },
  saveBtn: {
    backgroundColor: '#6366F1',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
