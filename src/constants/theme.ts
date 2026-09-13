// App Theme Tokens — Full Light Mode and Dark Mode support

export const LIGHT_COLORS = {
  // Brand
  primary: '#4F46E5',        // Royal Indigo
  primaryLight: '#EEF2FF',   // Soft light indigo bg
  primaryDark: '#3730A3',
  secondary: '#818CF8',      // Lavender accent
  accent: '#F59E0B',         // Amber
  accentLight: '#FEF3C7',

  // Status
  success: '#10B981',
  successBg: '#DCFCE7',
  successDim: '#16A34A',
  warning: '#F59E0B',
  warningBg: '#FFFBEB',
  danger: '#EF4444',
  dangerBg: '#FEE2E2',

  // Surfaces & Backgrounds
  background: '#F8F9FE',     // Clean modern pastel off-white
  surface: '#FFFFFF',        // Card surface
  card: '#FFFFFF',           // Alias for card surface
  surfaceLight: '#F1F5F9',   // Slightly elevated or pill bg
  surfaceMid: '#E2E8F0',
  surfaceGlass: 'rgba(255,255,255,0.85)',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  borderGlow: 'rgba(79,70,229,0.25)',

  // Hero section surfaces
  heroBg: '#EEF2FF',
  heroSurface: '#FFFFFF',
  heroBorder: '#E0E7FF',

  // Typography
  text: '#0F172A',           // Dark slate 900
  textSecondary: '#64748B',  // Muted slate 500
  textMuted: '#94A3B8',      // Slate 400
  textTertiary: '#94A3B8',   // Alias for muted slate
  textInverse: '#FFFFFF',
  textPurple: '#4F46E5',

  // Bottom Tab Bar
  tabBarBg: '#FFFFFF',
  tabBarBorder: '#F1F5F9',
  tabBarActiveBg: '#EDE9FE',
  tabBarActive: '#4F46E5',
  tabBarInactive: '#94A3B8',
};

export const DARK_COLORS = {
  // Brand
  primary: '#6366F1',        // Vibrant Indigo/Violet
  primaryLight: 'rgba(99,102,241,0.18)',
  primaryDark: '#4338CA',
  secondary: '#A5B4FC',
  accent: '#FBBF24',
  accentLight: 'rgba(251,191,36,0.18)',

  // Status
  success: '#34D399',
  successBg: 'rgba(52,211,153,0.14)',
  successDim: '#10B981',
  warning: '#FBBF24',
  warningBg: 'rgba(251,191,36,0.14)',
  danger: '#F87171',
  dangerBg: 'rgba(248,113,113,0.14)',

  // Surfaces & Backgrounds
  background: '#0B0F19',     // Deep Navy/Black
  surface: '#151D30',        // Elevated Card Surface
  card: '#151D30',           // Alias for card surface
  surfaceLight: '#1E293B',   // Slightly elevated pill/button bg
  surfaceMid: '#334155',
  surfaceGlass: 'rgba(21,29,48,0.85)',
  border: '#243048',         // Subtle card border
  borderLight: 'rgba(255,255,255,0.06)',
  borderGlow: 'rgba(99,102,241,0.4)',

  // Hero section surfaces
  heroBg: '#131A2D',
  heroSurface: '#192238',
  heroBorder: '#293552',

  // Typography
  text: '#F8FAFC',           // Pure bright slate 50
  textSecondary: '#94A3B8',  // Slate 400
  textMuted: '#64748B',      // Slate 500
  textTertiary: '#64748B',   // Alias for muted slate
  textInverse: '#0F172A',
  textPurple: '#818CF8',

  // Bottom Tab Bar
  tabBarBg: '#111728',
  tabBarBorder: '#1F293D',
  tabBarActiveBg: 'rgba(99,102,241,0.22)',
  tabBarActive: '#818CF8',
  tabBarInactive: '#64748B',
};

const COMMON_THEME = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
  },

  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    full: 9999,
  },

  typography: {
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
    },
    lineHeight: {
      xs: 16,
      sm: 20,
      base: 24,
      lg: 28,
      xl: 28,
      '2xl': 32,
      '3xl': 38,
    },
    fontWeight: {
      normal: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
      extrabold: '800' as const,
    },
  },

  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
    },
    glow: {
      shadowColor: '#4F46E5',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.35,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

export const LIGHT_THEME = {
  isDark: false,
  colors: LIGHT_COLORS,
  ...COMMON_THEME,
};

export const DARK_THEME = {
  isDark: true,
  colors: DARK_COLORS,
  ...COMMON_THEME,
};

// Default backwards compatibility export
export const THEME = LIGHT_THEME;

export type AppTheme = typeof LIGHT_THEME;
export type ThemeColors = typeof LIGHT_COLORS;
export type ThemeMode = 'light' | 'dark' | 'system';
