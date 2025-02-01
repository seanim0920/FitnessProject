import React, { useEffect } from 'react';
import { useWindowDimensions, ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';


interface Position {
  x: number;
  y: number;
}

interface DraggableViewProps {
  onGrab?: (position: Position) => void;
  onDrag?: (position: Position) => void;
  onRelease?: (position: Position) => void;
  children?: React.ReactNode;
  style?: ViewStyle;
  initialPosition?: Position | 'center';
}

export const DraggableView = ({
  onGrab,
  onDrag,
  onRelease,
  children,
  style,
  initialPosition = 'center',
}: DraggableViewProps) => {
  const { width, height } = useWindowDimensions();
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const context = useSharedValue({ x: 0, y: 0 });

  // Set initial position immediately without animation for first render
  useEffect(() => {
    if (initialPosition === 'center') {
      translateX.value = width / 2 - 50;
      translateY.value = height / 2 - 50;
    } else {
      translateX.value = initialPosition.x;
      translateY.value = initialPosition.y;
    }
  }, []);

  const panGesture = Gesture.Pan()
    .onBegin((event) => {
      context.value = {
        x: translateX.value,
        y: translateY.value,
      };
      if (onGrab) {
        runOnJS(onGrab)({
          x: event.absoluteX,
          y: event.absoluteY,
        });
      }
    })
    .onUpdate((event) => {
      translateX.value = context.value.x + event.translationX;
      translateY.value = context.value.y + event.translationY;
      if (onDrag) {
        runOnJS(onDrag)({
          x: translateX.value,
          y: translateY.value,
        });
      }
    })
    .onFinalize(() => {
      if (onRelease) {
        runOnJS(onRelease)({
          x: translateX.value,
          y: translateY.value,
        });
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View 
        style={[
          {
            position: 'absolute',
            backgroundColor: '#e0e0e0', // Debug background
            padding: 20,
            borderRadius: 8,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          },
          style,
          animatedStyle
        ]}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  );
};