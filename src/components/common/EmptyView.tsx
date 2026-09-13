import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';
import { Button } from './Button';

export interface EmptyViewProps {
  title?: string;
  message?: string;
  description?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  icon?: React.ReactNode;
  actionTitle?: string;
  onAction?: () => void;
  fullScreen?: boolean;
  style?: ViewStyle;
}

export const EmptyView: React.FC<EmptyViewProps> = ({
  title = 'No items found',
  message,
  description,
  iconName = 'file-tray-outline',
  icon,
  actionTitle,
  onAction,
  fullScreen = false,
  style,
}) => {
  const displayMessage = description || message || 'There is no content to display at the moment.';

  return (
    <View style={[styles.container, fullScreen && styles.fullScreen, style]}>
      <View style={styles.iconCircle}>
        {icon ? icon : <Ionicons name={iconName} size={36} color={THEME.colors.textSecondary} />}
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{displayMessage}</Text>

      {actionTitle && onAction ? (
        <Button
          title={actionTitle}
          onPress={onAction}
          variant="primary"
          size="sm"
          fullWidth={false}
          style={styles.button}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: THEME.spacing['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: THEME.colors.surfaceMid,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.spacing.md,
  },
  title: {
    fontSize: THEME.typography.fontSize.lg,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text,
    textAlign: 'center',
    marginBottom: THEME.spacing.xs,
  },
  message: {
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    lineHeight: THEME.typography.lineHeight.sm,
    marginBottom: THEME.spacing.lg,
  },
  button: {
    minWidth: 140,
  },
});
