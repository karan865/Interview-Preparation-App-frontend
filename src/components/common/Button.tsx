import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { THEME } from '../../constants/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = true,
  disabled,
  style,
  textStyle,
  icon,
  ...rest
}) => {
  const isActionDisabled = disabled || loading;

  const buttonStyles = [
    styles.base,
    styles[size],
    styles[variant],
    fullWidth && styles.fullWidth,
    isActionDisabled && styles.disabled,
    style,
  ];

  const labelStyles = [
    styles.baseText,
    styles[`${size}Text`],
    styles[`${variant}Text`],
    isActionDisabled && styles.disabledText,
    textStyle,
  ];

  const getIndicatorColor = () => {
    if (variant === 'outline' || variant === 'ghost') {
      return THEME.colors.primary;
    }
    return THEME.colors.textInverse;
  };

  return (
    <TouchableOpacity
      style={buttonStyles}
      disabled={isActionDisabled}
      activeOpacity={0.8}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getIndicatorColor()} />
      ) : (
        <>
          {icon ? icon : null}
          <Text style={labelStyles}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: THEME.borderRadius.md,
    gap: THEME.spacing.sm,
  },
  fullWidth: {
    width: '100%',
  },

  // Sizes
  sm: {
    paddingVertical: THEME.spacing.xs + 2,
    paddingHorizontal: THEME.spacing.md,
    minHeight: 36,
  },
  md: {
    paddingVertical: THEME.spacing.sm + 4,
    paddingHorizontal: THEME.spacing.lg,
    minHeight: 48,
  },
  lg: {
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.xl,
    minHeight: 56,
  },

  // Variants
  primary: {
    backgroundColor: THEME.colors.primary,
  },
  secondary: {
    backgroundColor: THEME.colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: THEME.colors.primary,
  },
  danger: {
    backgroundColor: THEME.colors.danger,
  },
  ghost: {
    backgroundColor: 'transparent',
  },

  // Disabled State
  disabled: {
    opacity: 0.5,
  },

  // Typography
  baseText: {
    fontWeight: THEME.typography.fontWeight.semibold,
    textAlign: 'center',
  },
  smText: {
    fontSize: THEME.typography.fontSize.xs,
  },
  mdText: {
    fontSize: THEME.typography.fontSize.base,
  },
  lgText: {
    fontSize: THEME.typography.fontSize.lg,
  },

  primaryText: {
    color: THEME.colors.textInverse,
  },
  secondaryText: {
    color: THEME.colors.textInverse,
  },
  outlineText: {
    color: THEME.colors.primary,
  },
  dangerText: {
    color: THEME.colors.textInverse,
  },
  ghostText: {
    color: THEME.colors.primary,
  },
  disabledText: {
    opacity: 0.8,
  },
});
