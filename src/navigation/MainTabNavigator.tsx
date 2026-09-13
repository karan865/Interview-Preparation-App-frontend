import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { MainTabParamList } from './types';
import { HomeScreen } from '../screens/home/HomeScreen';
import { BrowseStackNavigator } from './BrowseStackNavigator';
import { SearchScreen } from '../screens/search/SearchScreen';
import { SavedScreen } from '../screens/saved/SavedScreen';
import { useTheme } from '../context/ThemeContext';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator: React.FC = () => {
  const { theme, isDark } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.tabBarActive,
        tabBarInactiveTintColor: theme.colors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: theme.colors.tabBarBg,
          borderTopWidth: 1,
          borderTopColor: theme.colors.tabBarBorder,
          height: Platform.OS === 'ios' ? 84 : 62,
          paddingBottom: Platform.OS === 'ios' ? 26 : 8,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: isDark ? 0.3 : 0.06,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: -2,
        },
        tabBarIcon: ({ color, focused }) => {
          let icon: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Home') icon = focused ? 'home' : 'home-outline';
          else if (route.name === 'Browse') icon = focused ? 'book' : 'book-outline';
          else if (route.name === 'Search') icon = focused ? 'search' : 'search-outline';
          else if (route.name === 'Saved') icon = focused ? 'bookmark' : 'bookmark-outline';

          return (
            <View
              style={[
                styles.iconWrap,
                focused && { backgroundColor: theme.colors.tabBarActiveBg },
              ]}
            >
              <Ionicons name={icon} size={22} color={color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Browse" component={BrowseStackNavigator} options={{ tabBarLabel: 'Browse' }} />
      <Tab.Screen name="Search" component={SearchScreen} options={{ tabBarLabel: 'Search' }} />
      <Tab.Screen name="Saved" component={SavedScreen} options={{ tabBarLabel: 'Saved' }} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconWrap: {
    width: 36,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
