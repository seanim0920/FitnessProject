import React, { useEffect, useState } from 'react';
import { Text, useWindowDimensions } from 'react-native';
import {
  Easing,
  runOnJS,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';
import { AnimatedCollidingTarget } from '../CollisionContext/AnimatedCollidingTarget';

// Physics constants
const INITIAL_VELOCITY_RANGE = [1, 3]; // Units per second
const GRAVITY = 0.15; // Acceleration
const MAX_VELOCITY = 15;
const MIN_READABLE_TIME = 800; // Minimum time (ms) word should be readable at top

export type FallingWordProps = {
  text: string;
  onCollide?: () => void;
  onExit?: () => void;
  startX?: number;
  style?: any;
};

export const FallingWord = ({ 
  text, 
  onCollide, 
  onExit,
  startX,
  style 
}: FallingWordProps) => {
  const { height, width } = useWindowDimensions();
  const [isVisible, setIsVisible] = useState(true);
  
  // Random X position if not provided
  const initialX = startX ?? Math.random() * (width - 100);
  
  // Animation values
  const x = useSharedValue(initialX);
  const y = useSharedValue(-50); // Start above screen
  const velocity = useSharedValue(
    INITIAL_VELOCITY_RANGE[0] + 
    Math.random() * (INITIAL_VELOCITY_RANGE[1] - INITIAL_VELOCITY_RANGE[0])
  );

  // Add subtle float effect
  const floatOffset = useSharedValue(0);
  
  useEffect(() => {
    // Add floating motion
    floatOffset.value = withRepeat(
      withTiming(1, { 
        duration: 1000 + Math.random() * 500,
        easing: Easing.inOut(Easing.sin)
      }),
      -1,
      true
    );

    // Gravity simulation
    const interval = setInterval(() => {
      if (y.value > height + 50) {
        clearInterval(interval);
        runOnJS(setIsVisible)(false);
        onExit?.();
        return;
      }

      velocity.value = Math.min(velocity.value + GRAVITY, MAX_VELOCITY);
      y.value = y.value + velocity.value;
      x.value = initialX + floatOffset.value * 5; // Subtle horizontal float
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatedCollidingTarget
      style={[{
        position: 'absolute',
        padding: 8,
        borderRadius: 4,
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        transform: [
          { scale: withTiming(1 / (velocity.value * 0.2 + 0.8), { duration: 100 }) }
        ]
      }, style]}
      animatedPosition={{ x: x.value, y: y.value }}
      onCollide={onCollide}
    >
      <Text style={{
        opacity: withTiming(Math.max(1 - velocity.value / MAX_VELOCITY, 0.3), { duration: 100 })
      }}>{text}</Text>
    </AnimatedCollidingTarget>
  );
};

// Lists of words
const encouragingWords = [
  "Amazing!",
  "Excellent!",
  "Great job!",
  "Fantastic!",
  "Brilliant!",
  "Outstanding!",
  "Wonderful!",
  "Superb!",
  "Magnificent!",
  "Perfect!"
];

const discouragingWords = [
  "Missed",
  "Wrong",
  "Nope",
  "Failed",
  "Incorrect",
  "Off target",
  "Not quite",
  "Try again",
  "Too slow",
  "Oops"
];

// Variant components
export const GoodFallingWord = (props: Omit<FallingWordProps, 'text' | 'style'>) => {
  const randomWord = encouragingWords[Math.floor(Math.random() * encouragingWords.length)];
  return (
    <FallingWord 
      {...props}
      text={randomWord}
      style={{
        backgroundColor: '#e8f5e9',
        borderColor: '#4caf50',
        borderWidth: 1,
      }}
    />
  );
};

export const BadFallingWord = (props: Omit<FallingWordProps, 'text' | 'style'>) => {
  const randomWord = discouragingWords[Math.floor(Math.random() * discouragingWords.length)];
  return (
    <FallingWord 
      {...props}
      text={randomWord}
      style={{
        backgroundColor: '#ffebee',
        borderColor: '#f44336',
        borderWidth: 1,
      }}
    />
  );
};