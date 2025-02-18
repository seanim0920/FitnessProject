import React, { useEffect, useState } from 'react';
import { StyleSheet, ViewProps } from 'react-native';
import { DraggableCollidingTarget } from '../CollisionContext/DraggableCollidingTarget';

const MIN_SIZE = 80;
const MAX_SIZE = 160;
const SIZE_INCREMENT = 20;
const GROWTH_THRESHOLD = 2; // Number of collisions before growing

export type GuardProps = ViewProps & {
  onMaxSizeReached?: () => void;
  initialPosition?: { x: number; y: number };
};

export const Guard = ({ 
  style,
  onMaxSizeReached,
  initialPosition = { x: 200, y: 500 },
  ...props 
}: GuardProps) => {
  const [size, setSize] = useState(MIN_SIZE);
  const [collisionCount, setCollisionCount] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (collisionCount >= GROWTH_THRESHOLD) {
      setCollisionCount(0);
      setSize(prevSize => {
        const newSize = Math.min(prevSize + SIZE_INCREMENT, MAX_SIZE);
        if (newSize === MAX_SIZE && onMaxSizeReached) {
          onMaxSizeReached();
        }
        return newSize;
      });
    }
  }, [collisionCount, onMaxSizeReached]);

  return (
    <DraggableCollidingTarget
      style={[
        styles.guard,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          opacity: isDragging ? 0.5 : 1,
          transform: [
            { translateX: initialPosition.x - size / 2 },
            { translateY: initialPosition.y - size / 2 }
          ]
        },
        style
      ]}
      onCollide={() => {
        if (!isDragging) {
          setCollisionCount(prev => prev + 1);
        }
      }}
      onGestureStart={() => setIsDragging(true)}
      onGestureEnd={() => setIsDragging(false)}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  guard: {
    position: 'absolute',
    backgroundColor: '#4299e1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});