import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CelebrationAnimationProps {
  type: 'pass' | 'fail';
  title?: string;
  subtitle?: string;
  fullScreen?: boolean;
}

// Festive birthday/party confetti color palette
const PARTY_COLORS = [
  '#FF0055', // Neon Pink
  '#FFD700', // Gold
  '#00F5D4', // Electric Cyan
  '#7B2CBF', // Deep Purple
  '#FF7B00', // Bright Orange
  '#38BDF8', // Sky Blue
  '#10B981', // Emerald Green
  '#FFE600', // Lemon Yellow
  '#FF0A54', // Rose Red
  '#A855F7', // Violet
];

// Twinkling Party Lights positions
const PARTY_LIGHTS = [
  { x: SCREEN_WIDTH * 0.12, y: SCREEN_HEIGHT * 0.15, size: 24, color: '#FDE047' },
  { x: SCREEN_WIDTH * 0.85, y: SCREEN_HEIGHT * 0.18, size: 22, color: '#38BDF8' },
  { x: SCREEN_WIDTH * 0.22, y: SCREEN_HEIGHT * 0.32, size: 20, color: '#F43F5E' },
  { x: SCREEN_WIDTH * 0.78, y: SCREEN_HEIGHT * 0.38, size: 26, color: '#10B981' },
  { x: SCREEN_WIDTH * 0.15, y: SCREEN_HEIGHT * 0.52, size: 22, color: '#A855F7' },
  { x: SCREEN_WIDTH * 0.88, y: SCREEN_HEIGHT * 0.58, size: 20, color: '#F59E0B' },
  { x: SCREEN_WIDTH * 0.30, y: SCREEN_HEIGHT * 0.70, size: 24, color: '#00F5D4' },
  { x: SCREEN_WIDTH * 0.72, y: SCREEN_HEIGHT * 0.76, size: 22, color: '#FDE047' },
];

const NUM_LEFT_POPPERS = 28;
const NUM_RIGHT_POPPERS = 28;
const NUM_TOP_RAIN = 32;

export const CelebrationAnimation: React.FC<CelebrationAnimationProps> = ({
  type,
}) => {
  // Fairy / Party lights twinkling animation values
  const lightsAnim = useRef(
    PARTY_LIGHTS.map(() => new Animated.Value(0))
  ).current;

  // Left Cannon Confetti (Shoots Up-Right from bottom-left corner ↗)
  const leftPoppers = useRef(
    Array.from({ length: NUM_LEFT_POPPERS }).map(() => ({
      anim: new Animated.Value(0),
      startX: 20,
      startY: SCREEN_HEIGHT * 0.78,
      apexX: SCREEN_WIDTH * (0.2 + Math.random() * 0.65),
      apexY: SCREEN_HEIGHT * (0.05 + Math.random() * 0.3),
      endX: SCREEN_WIDTH * (0.1 + Math.random() * 0.85),
      endY: SCREEN_HEIGHT + 60,
      color: PARTY_COLORS[Math.floor(Math.random() * PARTY_COLORS.length)],
      width: Math.floor(Math.random() * 6) + 8, // 8 - 14
      height: Math.floor(Math.random() * 10) + 14, // 14 - 24
      rotZ: (Math.random() > 0.5 ? 1 : -1) * (720 + Math.random() * 720),
      isCircle: Math.random() > 0.6,
      delay: Math.random() * 250,
    }))
  ).current;

  // Right Cannon Confetti (Shoots Up-Left from bottom-right corner ↖)
  const rightPoppers = useRef(
    Array.from({ length: NUM_RIGHT_POPPERS }).map(() => ({
      anim: new Animated.Value(0),
      startX: SCREEN_WIDTH - 20,
      startY: SCREEN_HEIGHT * 0.78,
      apexX: SCREEN_WIDTH * (0.15 + Math.random() * 0.65),
      apexY: SCREEN_HEIGHT * (0.05 + Math.random() * 0.3),
      endX: SCREEN_WIDTH * (0.05 + Math.random() * 0.85),
      endY: SCREEN_HEIGHT + 60,
      color: PARTY_COLORS[Math.floor(Math.random() * PARTY_COLORS.length)],
      width: Math.floor(Math.random() * 6) + 8,
      height: Math.floor(Math.random() * 10) + 14,
      rotZ: (Math.random() > 0.5 ? 1 : -1) * (720 + Math.random() * 720),
      isCircle: Math.random() > 0.6,
      delay: Math.random() * 250,
    }))
  ).current;

  // Top Sky Confetti Rain (Drifts down gracefully across the whole screen)
  const topRain = useRef(
    Array.from({ length: NUM_TOP_RAIN }).map(() => ({
      anim: new Animated.Value(0),
      startX: Math.random() * SCREEN_WIDTH,
      startY: -40 - Math.random() * 100,
      swayX: (Math.random() - 0.5) * 120,
      endY: SCREEN_HEIGHT + 80,
      color: PARTY_COLORS[Math.floor(Math.random() * PARTY_COLORS.length)],
      width: Math.floor(Math.random() * 5) + 7,
      height: Math.floor(Math.random() * 8) + 12,
      rotZ: (Math.random() > 0.5 ? 1 : -1) * (540 + Math.random() * 540),
      isCircle: Math.random() > 0.5,
      duration: 3200 + Math.random() * 1800,
      delay: Math.random() * 800,
    }))
  ).current;

  // Motivational floating icons for fail mode
  const failFloat = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (type === 'pass') {
      // 1. Twinkling Party Lights Animation (Looping sparkling lights)
      lightsAnim.forEach((val, i) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(i * 120),
            Animated.timing(val, {
              toValue: 1,
              duration: 450 + (i % 3) * 150,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(val, {
              toValue: 0.15,
              duration: 500 + (i % 2) * 200,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ])
        ).start();
      });

      // 2. Left Cannon Blast
      const leftAnims = leftPoppers.map((p) =>
        Animated.sequence([
          Animated.delay(p.delay),
          Animated.timing(p.anim, {
            toValue: 1,
            duration: 3400 + Math.random() * 800,
            easing: Easing.bezier(0.12, 0.8, 0.32, 1),
            useNativeDriver: true,
          }),
        ])
      );

      // 3. Right Cannon Blast
      const rightAnims = rightPoppers.map((p) =>
        Animated.sequence([
          Animated.delay(p.delay + 60),
          Animated.timing(p.anim, {
            toValue: 1,
            duration: 3400 + Math.random() * 800,
            easing: Easing.bezier(0.12, 0.8, 0.32, 1),
            useNativeDriver: true,
          }),
        ])
      );

      // 4. Top Confetti Rain
      const topAnims = topRain.map((p) =>
        Animated.sequence([
          Animated.delay(p.delay),
          Animated.timing(p.anim, {
            toValue: 1,
            duration: p.duration,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      );

      Animated.parallel([...leftAnims, ...rightAnims, ...topAnims]).start();
    } else {
      // Failure gentle motivational pulse
      Animated.loop(
        Animated.sequence([
          Animated.timing(failFloat, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(failFloat, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [type]);

  if (type === 'pass') {
    return (
      <View style={styles.fullScreenOverlay} pointerEvents="none">
        {/* ─── Twinkling Party Lights (Disco / Birthday Fairy Lights) ──── */}
        {PARTY_LIGHTS.map((light, idx) => (
          <Animated.View
            key={`light_${idx}`}
            style={[
              styles.partyLight,
              {
                left: light.x,
                top: light.y,
                transform: [
                  {
                    scale: lightsAnim[idx].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.6, 1.3],
                    }),
                  },
                ],
                opacity: lightsAnim[idx],
              },
            ]}
          >
            <Ionicons name="sparkles" size={light.size} color={light.color} />
          </Animated.View>
        ))}

        {/* ─── Left Popper Cannon Blast (Shooting ↗) ────────────────── */}
        {leftPoppers.map((p, idx) => {
          const translateX = p.anim.interpolate({
            inputRange: [0, 0.35, 1],
            outputRange: [p.startX, p.apexX, p.endX],
          });
          const translateY = p.anim.interpolate({
            inputRange: [0, 0.35, 1],
            outputRange: [p.startY, p.apexY, p.endY],
          });
          const rotate = p.anim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', `${p.rotZ}deg`],
          });
          const opacity = p.anim.interpolate({
            inputRange: [0, 0.1, 0.75, 1],
            outputRange: [0, 1, 1, 0],
          });

          return (
            <Animated.View
              key={`left_pop_${idx}`}
              style={[
                styles.confettiRibbon,
                {
                  backgroundColor: p.color,
                  width: p.isCircle ? p.width : p.width * 0.75,
                  height: p.isCircle ? p.width : p.height,
                  borderRadius: p.isCircle ? p.width / 2 : 3,
                  transform: [
                    { translateX },
                    { translateY },
                    { rotate },
                  ],
                  opacity,
                },
              ]}
            />
          );
        })}

        {/* ─── Right Popper Cannon Blast (Shooting ↖) ───────────────── */}
        {rightPoppers.map((p, idx) => {
          const translateX = p.anim.interpolate({
            inputRange: [0, 0.35, 1],
            outputRange: [p.startX, p.apexX, p.endX],
          });
          const translateY = p.anim.interpolate({
            inputRange: [0, 0.35, 1],
            outputRange: [p.startY, p.apexY, p.endY],
          });
          const rotate = p.anim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', `${p.rotZ}deg`],
          });
          const opacity = p.anim.interpolate({
            inputRange: [0, 0.1, 0.75, 1],
            outputRange: [0, 1, 1, 0],
          });

          return (
            <Animated.View
              key={`right_pop_${idx}`}
              style={[
                styles.confettiRibbon,
                {
                  backgroundColor: p.color,
                  width: p.isCircle ? p.width : p.width * 0.75,
                  height: p.isCircle ? p.width : p.height,
                  borderRadius: p.isCircle ? p.width / 2 : 3,
                  transform: [
                    { translateX },
                    { translateY },
                    { rotate },
                  ],
                  opacity,
                },
              ]}
            />
          );
        })}

        {/* ─── Top Sky Confetti Rain (Falling over the entire screen) ──── */}
        {topRain.map((p, idx) => {
          const translateX = p.anim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [p.startX, p.startX + p.swayX, p.startX - p.swayX * 0.5],
          });
          const translateY = p.anim.interpolate({
            inputRange: [0, 1],
            outputRange: [p.startY, p.endY],
          });
          const rotate = p.anim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', `${p.rotZ}deg`],
          });
          const opacity = p.anim.interpolate({
            inputRange: [0, 0.05, 0.8, 1],
            outputRange: [0, 1, 1, 0],
          });

          return (
            <Animated.View
              key={`top_rain_${idx}`}
              style={[
                styles.confettiRibbon,
                {
                  backgroundColor: p.color,
                  width: p.isCircle ? p.width : p.width * 0.8,
                  height: p.isCircle ? p.width : p.height,
                  borderRadius: p.isCircle ? p.width / 2 : 2,
                  transform: [
                    { translateX },
                    { translateY },
                    { rotate },
                  ],
                  opacity,
                },
              ]}
            />
          );
        })}
      </View>
    );
  }

  // ─── Fail / Need Practice Mode (Gentle Floating Motivation) ───────────────
  const floatY = failFloat.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -12],
  });

  return (
    <View style={styles.fullScreenOverlay} pointerEvents="none">
      {[
        { icon: 'bulb-outline', x: SCREEN_WIDTH * 0.15, y: SCREEN_HEIGHT * 0.22, color: '#F59E0B' },
        { icon: 'trending-up', x: SCREEN_WIDTH * 0.82, y: SCREEN_HEIGHT * 0.28, color: '#10B981' },
        { icon: 'school-outline', x: SCREEN_WIDTH * 0.18, y: SCREEN_HEIGHT * 0.45, color: '#38BDF8' },
        { icon: 'rocket-outline', x: SCREEN_WIDTH * 0.80, y: SCREEN_HEIGHT * 0.55, color: '#A855F7' },
        { icon: 'flame-outline', x: SCREEN_WIDTH * 0.25, y: SCREEN_HEIGHT * 0.68, color: '#EF4444' },
        { icon: 'book-outline', x: SCREEN_WIDTH * 0.75, y: SCREEN_HEIGHT * 0.72, color: '#F59E0B' },
      ].map((item, idx) => (
        <Animated.View
          key={`fail_icon_${idx}`}
          style={[
            styles.motivationalFloatItem,
            {
              left: item.x,
              top: item.y,
              transform: [{ translateY: floatY }],
              opacity: 0.7,
            },
          ]}
        >
          <Ionicons name={item.icon as any} size={28} color={item.color} />
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    zIndex: 99999,
    elevation: 99999,
  },
  confettiRibbon: {
    position: 'absolute',
    top: 0,
    left: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
  partyLight: {
    position: 'absolute',
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 6,
  },
  motivationalFloatItem: {
    position: 'absolute',
  },
});
