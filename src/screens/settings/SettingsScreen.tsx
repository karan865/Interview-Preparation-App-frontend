import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { ThemeMode } from '../../constants/theme';
import { invalidateAllContentCaches } from '../../utils/cacheManager';
import { useAppSelector } from '../../store/hooks';
import { DailyChallengeSettingsModal } from '../daily/DailyChallengeSettingsModal';
import { apiClient } from '../../api/client';
import { CONFIG } from '../../constants/config';

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { mode, isDark, theme, setMode } = useTheme();
  const settings = useAppSelector((state) => state.dailyChallenge.settings);
  const [showDailySettings, setShowDailySettings] = React.useState(false);

  const handleSelectMode = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  const handleClearCache = () => {
    invalidateAllContentCaches();
    Alert.alert('Cache Cleared', 'All local temporary caches have been invalidated.');
  };

  const modes: {
    key: ThemeMode;
    label: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
  }[] = [
    {
      key: 'light',
      label: 'Light Mode',
      description: 'Clean, crisp white and pastel aesthetics',
      icon: 'sunny',
      color: '#F59E0B',
    },
    {
      key: 'dark',
      label: 'Dark Mode',
      description: 'Sleek, eye-friendly deep slate theme',
      icon: 'moon',
      color: '#818CF8',
    },
    {
      key: 'system',
      label: 'System Default',
      description: 'Automatically matches your device settings',
      icon: 'phone-portrait-outline',
      color: '#10B981',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />

      {/* Top Header */}
      <View style={[styles.topBar, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity
          style={[
            styles.circleBtn,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
        </TouchableOpacity>

        <Text style={[styles.topTitle, { color: theme.colors.text }]}>
          Appearance & Settings
        </Text>

        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Section: Appearance */}
        <View style={styles.sectionHeaderWrap}>
          <Ionicons name="color-palette-outline" size={18} color={theme.colors.primary} />
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Theme & Appearance
          </Text>
        </View>

        <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
          Choose how the interview preparation platform looks to you.
        </Text>

        {/* Theme Cards List */}
        <View style={styles.modesContainer}>
          {modes.map((item) => {
            const isSelected = mode === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.modeCard,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                  },
                  isSelected && {
                    borderWidth: 2,
                    elevation: 3,
                    shadowColor: theme.colors.primary,
                    shadowOpacity: isDark ? 0.3 : 0.1,
                  },
                ]}
                onPress={() => handleSelectMode(item.key)}
                activeOpacity={0.8}
              >
                {/* Icon square */}
                <View
                  style={[
                    styles.modeIconBox,
                    {
                      backgroundColor: isDark
                        ? 'rgba(255,255,255,0.06)'
                        : theme.colors.surfaceLight,
                    },
                  ]}
                >
                  <Ionicons name={item.icon} size={22} color={item.color} />
                </View>

                {/* Text Info */}
                <View style={styles.modeInfoCol}>
                  <Text style={[styles.modeTitle, { color: theme.colors.text }]}>
                    {item.label}
                  </Text>
                  <Text style={[styles.modeDesc, { color: theme.colors.textSecondary }]}>
                    {item.description}
                  </Text>
                </View>

                {/* Radio Indicator */}
                <View
                  style={[
                    styles.radioCircle,
                    {
                      borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                      backgroundColor: isSelected ? theme.colors.primary : 'transparent',
                    },
                  ]}
                >
                  {isSelected && <Ionicons name="checkmark" size={13} color="#FFFFFF" />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Section: Daily Challenge */}
        <View style={[styles.sectionHeaderWrap, { marginTop: 24 }]}>
          <Ionicons name="flame-outline" size={18} color="#F59E0B" />
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Daily Challenge Routine
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.actionCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
          onPress={() => setShowDailySettings(true)}
          activeOpacity={0.8}
        >
          <View style={styles.actionLeft}>
            <View style={[styles.actionIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.12)' }]}>
              <Ionicons name="options-outline" size={18} color="#F59E0B" />
            </View>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={[styles.actionTitle, { color: theme.colors.text }]}>
                Configure Challenge Settings
              </Text>
              <Text style={[styles.actionSubtitle, { color: theme.colors.textSecondary }]}>
                {settings.learningQuestionCount} Learning • {settings.testQuestionCount} Test MCQs • {settings.passingScore}% Pass
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        {/* Section: Storage & Cache */}
        <View style={[styles.sectionHeaderWrap, { marginTop: 24 }]}>
          <Ionicons name="cloud-outline" size={18} color={theme.colors.primary} />
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Data & Cache
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.actionCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
          onPress={handleClearCache}
          activeOpacity={0.8}
        >
          <View style={styles.actionLeft}>
            <View style={[styles.actionIconBox, { backgroundColor: 'rgba(239,68,68,0.1)' }]}>
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
            </View>
            <View>
              <Text style={[styles.actionTitle, { color: theme.colors.text }]}>
                Clear Cache
              </Text>
              <Text style={[styles.actionSubtitle, { color: theme.colors.textSecondary }]}>
                Purge question and topic local caches
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
        </TouchableOpacity>

        {/* Section: About */}
        <View style={[styles.sectionHeaderWrap, { marginTop: 24 }]}>
          <Ionicons name="information-circle-outline" size={18} color={theme.colors.primary} />
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            About
          </Text>
        </View>

        <View
          style={[
            styles.aboutCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.aboutRow}>
            <Text style={[styles.aboutLabel, { color: theme.colors.textSecondary }]}>
              App Version
            </Text>
            <Text style={[styles.aboutValue, { color: theme.colors.text }]}>
              1.0.0 (Production)
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

          <View style={styles.aboutRow}>
            <Text style={[styles.aboutLabel, { color: theme.colors.textSecondary }]}>
              Question Library
            </Text>
            <Text style={[styles.aboutValue, { color: theme.colors.primary }]}>
              2,133+ Verified Questions
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

          <View style={styles.aboutRow}>
            <Text style={[styles.aboutLabel, { color: theme.colors.textSecondary }]}>
              Backend Server
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' }} />
              <Text style={[styles.aboutValue, { color: '#10B981', fontWeight: '600' }]}>
                {apiClient.getBaseUrl().includes('onrender.com') ? 'Render Live Cloud' : 'Active Connected'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <DailyChallengeSettingsModal
        visible={showDailySettings}
        onClose={() => setShowDailySettings(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 46 : (StatusBar.currentHeight || 16) + 6,
    paddingBottom: 10,
  },
  circleBtn: {
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
  topTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  sectionHeaderWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  sectionSubtitle: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 14,
  },
  modesContainer: {
    gap: 10,
  },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
  },
  modeIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  modeInfoCol: {
    flex: 1,
    paddingRight: 8,
  },
  modeTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  modeDesc: {
    fontSize: 11.5,
    lineHeight: 16,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 8,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  actionSubtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  aboutCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 8,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  aboutLabel: {
    fontSize: 12.5,
    fontWeight: '500',
  },
  aboutValue: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
});
