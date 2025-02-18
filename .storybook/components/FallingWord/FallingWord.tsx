import React, { useEffect, useState } from 'react';
import { Text, TextStyle, useWindowDimensions, ViewStyle } from 'react-native';
import {
  cancelAnimation,
  Easing,
  runOnJS,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { AnimatedCollidingTarget } from '../CollisionContext/AnimatedCollidingTarget';
import { Target } from '../HoverContext/types';

const INITIAL_VELOCITY_RANGE = [0.25, 1];
const GRAVITY = 0.025;
const MAX_VELOCITY = 7.5;

export type FallingWordProps = {
  children: React.ReactNode;
  onExit?: () => void;
  onCollide?: (targets: Target[]) => void;
  startX?: number;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
};

export const FallingWord = ({ 
  children, 
  onExit,
  onCollide,
  startX,
  containerStyle,
  textStyle
}: FallingWordProps) => {
  const { height, width } = useWindowDimensions();
  const [isVisible, setIsVisible] = useState(true);
  
  const initialX = startX ?? Math.random() * (width - 100);
  const x = useSharedValue(initialX);
  const y = useSharedValue(-50);
  const velocity = useSharedValue(
    INITIAL_VELOCITY_RANGE[0] + 
    Math.random() * (INITIAL_VELOCITY_RANGE[1] - INITIAL_VELOCITY_RANGE[0])
  );
  const floatOffset = useSharedValue(0);
  const hasExited = useSharedValue(false);
  
  const position = useDerivedValue(() => {
    velocity.value = Math.min(velocity.value + GRAVITY, MAX_VELOCITY);
    y.value = y.value + velocity.value;
    
    if (y.value > height + 50 && !hasExited.value) {
      hasExited.value = true;
      runOnJS(setIsVisible)(false);
      onExit && runOnJS(onExit)();
    }

    return {
      x: x.value + floatOffset.value * 3,
      y: y.value
    };
  });

  useEffect(() => {
    floatOffset.value = withRepeat(
      withSequence(
        withTiming(1, { 
          duration: 1000 + Math.random() * 500,
          easing: Easing.inOut(Easing.sin)
        }),
        withTiming(-1, { 
          duration: 1000 + Math.random() * 500,
          easing: Easing.inOut(Easing.sin)
        })
      ),
      -1
    );

    return () => {
      cancelAnimation(floatOffset);
      cancelAnimation(position);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatedCollidingTarget
      style={{
        position: 'absolute',
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#1a202c',
        shadowColor: "#4299e1",
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 10,
        ...containerStyle
      }}
      animatedPosition={position}
      onCollide={onCollide}
    >
      <Text style={{
        color: '#f5fbff',
        fontWeight: '800',
        textShadowColor: 'rgba(66, 153, 225, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
        ...textStyle
      }}>
        {children}
      </Text>
    </AnimatedCollidingTarget>
  );
};