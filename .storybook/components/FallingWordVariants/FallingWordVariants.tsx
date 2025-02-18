import React, { useCallback, useState } from 'react';
import { Text } from 'react-native';
import { FallingWord, FallingWordProps } from '../FallingWord/FallingWord';
import { Target } from '../HoverContext/types';
import { CHALLENGING_WORDS, GOOD_WORDS } from "./WordList";

export type WordType = 'good' | 'bad';

export const getRandomWord = (type: WordType): string => {
  const wordList = type === 'good' ? GOOD_WORDS : CHALLENGING_WORDS;
  return wordList[Math.floor(Math.random() * wordList.length)];
};

type ThemedFallingWordProps = Omit<FallingWordProps, 'children'> & {
  type: WordType;
  onCollide?: (targets: Target[]) => void;
};

export const ThemedFallingWord = ({ 
  type,
  onCollide,
  ...props 
}: ThemedFallingWordProps) => {
  // Store the word in state to keep it stable across re-renders
  const [text] = useState(() => getRandomWord(type));
  // Track if this word has already triggered a collision
  const [hasCollided, setHasCollided] = useState(false);
  
  const handleCollision = useCallback((targets: Target[]) => {
    if (!hasCollided) {
      setHasCollided(true);
      onCollide?.(targets);
    }
  }, [hasCollided, onCollide]);
  
  const getStyles = (type: WordType) => {
    if (type === 'good') {
      return {
        text: {
          color: '#9ae6b4',
          textShadowRadius: 10,
        }
      };
    } else {
      return {
        text: {
          color: '#cce8fc',
          textShadowRadius: 10,
        }
      };
    }
  };

  const styles = getStyles(type);

  return (
    <FallingWord
      {...props}
      textStyle={styles.text}
      onCollide={handleCollision}
    >
      <Text style={styles.text}>{text}</Text>
    </FallingWord>
  );
};