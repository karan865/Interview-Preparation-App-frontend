import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import { THEME } from '../../constants/theme';

export const ProfileScreen: React.FC = () => {
  const { user, logout, isGuest } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      isGuest ? 'Reset Guest Session' : 'Sign Out',
      isGuest ? 'Do you want to reset your local guest session?' : 'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: isGuest ? 'Reset' : 'Sign Out', style: 'destructive', onPress: logout },
      ]
    );
  };

  return (
    <ScreenContainer scrollable contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile</Text>

      {/* User Info Card */}
      <Card variant="elevated" style={styles.userCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>
            {user?.name ? user.name.charAt(0).toUpperCase() : (isGuest ? 'G' : 'U')}
          </Text>
        </View>

        <Text style={styles.userName}>{user?.name || (isGuest ? 'Guest User' : 'User')}</Text>
        <Text style={styles.userEmail}>{user?.email || (isGuest ? 'Browsing as Guest' : '')}</Text>

        <View style={styles.badgeRow}>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{isGuest ? 'GUEST' : (user?.role?.toUpperCase() || 'USER')}</Text>
          </View>
        </View>
      </Card>

      {/* Preferences Preview Card */}
      <Card variant="outlined" style={styles.prefCard}>
        <View style={styles.sectionHeader}>
          <Ionicons name="options-outline" size={20} color={THEME.colors.primary} />
          <Text style={styles.sectionTitle}>Preparation Settings</Text>
        </View>

        <View style={styles.prefRow}>
          <Text style={styles.prefLabel}>Preparation Level</Text>
          <Text style={styles.prefValue}>
            {user?.selectedPreparationLevel && typeof user.selectedPreparationLevel === 'object'
              ? (user.selectedPreparationLevel as any).name
              : 'Not configured'}
          </Text>
        </View>

        <View style={styles.prefRow}>
          <Text style={styles.prefLabel}>Selected Technologies</Text>
          <Text style={styles.prefValue}>
            {user?.selectedTechnologies && user.selectedTechnologies.length > 0
              ? `${user.selectedTechnologies.length} selected`
              : 'None'}
          </Text>
        </View>
      </Card>

      {/* Logout Button */}
      <Button
        title="Sign Out"
        onPress={handleLogout}
        variant="outline"
        style={styles.logoutBtn}
        textStyle={{ color: THEME.colors.danger }}
        icon={<Ionicons name="log-out-outline" size={18} color={THEME.colors.danger} />}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: THEME.spacing['2xl'],
  },
  title: {
    fontSize: THEME.typography.fontSize['2xl'],
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text,
    marginBottom: THEME.spacing.lg,
  },
  userCard: {
    alignItems: 'center',
    padding: THEME.spacing.xl,
    marginBottom: THEME.spacing.lg,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.spacing.md,
    ...THEME.shadows.sm,
  },
  avatarText: {
    fontSize: THEME.typography.fontSize['2xl'],
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.textInverse,
  },
  userName: {
    fontSize: THEME.typography.fontSize.xl,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text,
    marginBottom: THEME.spacing.xs,
  },
  userEmail: {
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.textSecondary,
    marginBottom: THEME.spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: THEME.spacing.sm,
  },
  roleBadge: {
    backgroundColor: THEME.colors.primaryLight,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.xs,
    borderRadius: THEME.borderRadius.full,
  },
  roleText: {
    fontSize: THEME.typography.fontSize.xs,
    color: THEME.colors.primary,
    fontWeight: THEME.typography.fontWeight.semibold,
  },
  prefCard: {
    padding: THEME.spacing.lg,
    marginBottom: THEME.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
    marginBottom: THEME.spacing.md,
  },
  sectionTitle: {
    fontSize: THEME.typography.fontSize.base,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text,
  },
  prefRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: THEME.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.borderLight,
  },
  prefLabel: {
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.textSecondary,
  },
  prefValue: {
    fontSize: THEME.typography.fontSize.sm,
    fontWeight: THEME.typography.fontWeight.medium,
    color: THEME.colors.text,
  },
  logoutBtn: {
    borderColor: THEME.colors.danger,
  },
});
