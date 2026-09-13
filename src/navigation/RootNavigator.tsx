import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { MainTabNavigator } from './MainTabNavigator';
import { QuestionDetailScreen } from '../screens/question/QuestionDetailScreen';
import { QuickRevisionScreen } from '../screens/revision/QuickRevisionScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { ExamListScreen } from '../screens/exam/ExamListScreen';
import { ExamScreen } from '../screens/exam/ExamScreen';
import { ExamResultScreen } from '../screens/exam/ExamResultScreen';
import { ExamReviewScreen } from '../screens/exam/ExamReviewScreen';
import { DailyChallengeScreen } from '../screens/daily/DailyChallengeScreen';
import { useTheme } from '../context/ThemeContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { isDark, theme } = useTheme();

  const customNavTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.border,
      primary: theme.colors.primary,
    },
  };

  return (
    <NavigationContainer theme={customNavTheme}>
      <Stack.Navigator
        initialRouteName="MainTabs"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        <Stack.Screen
          name="QuestionDetail"
          component={QuestionDetailScreen}
          options={{ presentation: 'card' }}
        />
        <Stack.Screen
          name="QuickRevision"
          component={QuickRevisionScreen}
          options={{ presentation: 'card' }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ presentation: 'card' }}
        />
        <Stack.Screen
          name="ExamList"
          component={ExamListScreen}
          options={{ presentation: 'card' }}
        />
        <Stack.Screen
          name="Exam"
          component={ExamScreen}
          options={{ presentation: 'card', gestureEnabled: false }}
        />
        <Stack.Screen
          name="ExamResult"
          component={ExamResultScreen}
          options={{ presentation: 'card', gestureEnabled: false }}
        />
        <Stack.Screen
          name="ExamReview"
          component={ExamReviewScreen}
          options={{ presentation: 'card' }}
        />
        <Stack.Screen
          name="DailyChallenge"
          component={DailyChallengeScreen}
          options={{ presentation: 'card' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
