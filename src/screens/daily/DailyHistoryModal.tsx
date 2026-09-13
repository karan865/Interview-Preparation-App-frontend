import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAppSelector } from '../../store/hooks';
import { formatDisplayDate } from '../../utils/dailyDateUtils';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const DailyHistoryModal: React.FC<Props> = ({ visible, onClose }) => {
  const { colors, isDark } = useTheme();
  const { streak, history } = useAppSelector((state) => state.dailyChallenge);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={[s.container, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
          {/* Header */}
          <View style={s.header}>
            <View>
              <Text style={[s.title, { color: colors.text }]}>Daily Challenge History</Text>
              <Text style={[s.subtitle, { color: colors.textSecondary }]}>
                Track your local preparation consistency
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={s.closeBtn} activeOpacity={0.7}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Streak Banner */}
          <View style={[s.streakCard, { backgroundColor: isDark ? '#111827' : '#F9FAFB' }]}>
            <View style={s.streakItem}>
              <Text style={s.streakEmoji}>🔥</Text>
              <Text style={[s.streakValue, { color: '#F59E0B' }]}>{streak.currentStreak}</Text>
              <Text style={[s.streakLabel, { color: colors.textSecondary }]}>Current Streak</Text>
            </View>
            <View style={[s.divider, { backgroundColor: isDark ? '#374151' : '#E5E7EB' }]} />
            <View style={s.streakItem}>
              <Text style={s.streakEmoji}>🏆</Text>
              <Text style={[s.streakValue, { color: '#6366F1' }]}>{streak.longestStreak}</Text>
              <Text style={[s.streakLabel, { color: colors.textSecondary }]}>Longest Streak</Text>
            </View>
            <View style={[s.divider, { backgroundColor: isDark ? '#374151' : '#E5E7EB' }]} />
            <View style={s.streakItem}>
              <Text style={s.streakEmoji}>✅</Text>
              <Text style={[s.streakValue, { color: '#10B981' }]}>
                {history.filter((h) => h.completed).length}
              </Text>
              <Text style={[s.streakLabel, { color: colors.textSecondary }]}>Completed</Text>
            </View>
          </View>

          {/* History List */}
          <ScrollView style={s.list} showsVerticalScrollIndicator={false}>
            {history.length === 0 ? (
              <View style={s.emptyBox}>
                <Ionicons name="calendar-outline" size={48} color={colors.textSecondary} />
                <Text style={[s.emptyTitle, { color: colors.text }]}>No History Yet</Text>
                <Text style={[s.emptySub, { color: colors.textSecondary }]}>
                  Complete today's Daily Challenge to begin your interview preparation streak!
                </Text>
              </View>
            ) : (
              history.map((entry) => (
                <View
                  key={entry.date}
                  style={[
                    s.historyCard,
                    {
                      backgroundColor: isDark ? '#111827' : '#FFFFFF',
                      borderColor: isDark ? '#374151' : '#E5E7EB',
                    },
                  ]}
                >
                  <View style={s.cardTopRow}>
                    <View style={s.dateRow}>
                      <Ionicons
                        name={entry.completed ? 'checkmark-circle' : 'close-circle'}
                        size={18}
                        color={entry.completed ? '#10B981' : '#EF4444'}
                      />
                      <Text style={[s.dateText, { color: colors.text }]}>
                        {formatDisplayDate(entry.date)}
                      </Text>
                    </View>
                    <View
                      style={[
                        s.statusBadge,
                        {
                          backgroundColor: entry.completed
                            ? 'rgba(16, 185, 129, 0.15)'
                            : 'rgba(239, 68, 68, 0.15)',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          s.statusText,
                          { color: entry.completed ? '#10B981' : '#EF4444' },
                        ]}
                      >
                        {entry.completed ? 'Completed' : 'Not Completed'}
                      </Text>
                    </View>
                  </View>

                  <View style={s.cardDetailsRow}>
                    <Text style={[s.metricText, { color: colors.textSecondary }]}>
                      Score: <Text style={{ color: colors.text, fontWeight: '700' }}>{entry.bestScore}%</Text>
                    </Text>
                    <Text style={[s.metricDot, { color: colors.textSecondary }]}>•</Text>
                    <Text style={[s.metricText, { color: colors.textSecondary }]}>
                      Attempts: <Text style={{ color: colors.text, fontWeight: '600' }}>{entry.attemptsCount}</Text>
                    </Text>
                    <Text style={[s.metricDot, { color: colors.textSecondary }]}>•</Text>
                    <Text style={[s.metricText, { color: colors.textSecondary }]}>
                      Req: <Text style={{ color: colors.text, fontWeight: '600' }}>{entry.passingScore}%</Text>
                    </Text>
                  </View>

                  {entry.technologies && entry.technologies.length > 0 && (
                    <View style={s.techRow}>
                      {entry.technologies.map((t) => (
                        <View
                          key={t}
                          style={[
                            s.techChip,
                            { backgroundColor: isDark ? '#374151' : '#F3F4F6' },
                          ]}
                        >
                          <Text style={[s.techChipText, { color: colors.textSecondary }]}>{t}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))
            )}
            <View style={{ height: 28 }} />
          </ScrollView>
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
    maxHeight: '85%',
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
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 16,
  },
  streakItem: {
    alignItems: 'center',
    flex: 1,
  },
  streakEmoji: {
    fontSize: 18,
    marginBottom: 2,
  },
  streakValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  streakLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 36,
  },
  list: {
    paddingHorizontal: 20,
  },
  historyCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 15,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  metricText: {
    fontSize: 12,
  },
  metricDot: {
    fontSize: 12,
  },
  techRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  techChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  techChipText: {
    fontSize: 11,
    fontWeight: '500',
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginTop: 14,
  },
  emptySub: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
});
