import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BrowseStackParamList } from './types';
import { BrowseTechnologiesScreen } from '../screens/browse/BrowseTechnologiesScreen';
import { BrowseTopicsScreen } from '../screens/browse/BrowseTopicsScreen';
import { BrowseLevelsScreen } from '../screens/browse/BrowseLevelsScreen';
import { BrowseQuestionsScreen } from '../screens/browse/BrowseQuestionsScreen';
import { THEME } from '../constants/theme';

const Stack = createNativeStackNavigator<BrowseStackParamList>();

export const BrowseStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="BrowseTechnologies"
      screenOptions={{
        headerStyle: {
          backgroundColor: THEME.colors.surface,
        },
        headerTintColor: THEME.colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 16,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="BrowseTechnologies"
        component={BrowseTechnologiesScreen}
        options={{ title: 'Explore Technologies' }}
      />
      <Stack.Screen
        name="BrowseTopics"
        component={BrowseTopicsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BrowseLevels"
        component={BrowseLevelsScreen}
        options={{ title: 'Target Level' }}
      />
      <Stack.Screen
        name="BrowseQuestions"
        component={BrowseQuestionsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
