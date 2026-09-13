import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { THEME } from '../../constants/theme';

export interface LoadingViewProps {
  message?: string;
  fullScreen?: boolean;
  style?: ViewStyle;
}

export const LoadingView: React.FC<LoadingViewProps> = ({
  message = 'Loading...',
  fullScreen = false,
  style,
}) => {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen, style]}>
      <ActivityIndicator size="large" color={THEME.colors.primary} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: THEME.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  message: {
    marginTop: THEME.spacing.md,
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.textSecondary,
    fontWeight: THEME.typography.fontWeight.medium,
  },
});
