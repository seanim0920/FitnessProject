import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CollisionProvider } from '../CollisionContext/CollisionContext';
import { FallingWord } from '../FallingWord/FallingWord';
import { Guard } from './GuardComponent';

export const GuardMeta = {
  title: 'Guard',
};

export default GuardMeta;

export const Basic = () => {
  const [words, setWords] = useState<Array<{id: string, text: string}>>([]);
  const [score, setScore] = useState(0);
  const [maxSizeReached, setMaxSizeReached] = useState(false);

  const addWord = () => {
    const id = Math.random().toString(36).substring(7);
    const text = `Word ${words.length + 1}`;
    setWords(prev => [...prev, { id, text }]);
  };

  const handleWordExit = (id: string) => {
    setWords(prev => prev.filter(word => word.id !== id));
    setScore(prev => prev - 1);
  };

  const handleMaxSizeReached = () => {
    setMaxSizeReached(true);
  };

  return (
    <CollisionProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.hud}>
          <Text style={styles.scoreText}>Score: {score}</Text>
          {maxSizeReached && (
            <Text style={styles.maxSizeText}>Maximum guard size reached!</Text>
          )}
        </View>

        <Guard 
          onMaxSizeReached={handleMaxSizeReached}
          initialPosition={{ x: 200, y: 500 }}
        />

        <View style={styles.controls}>
          <Pressable 
            style={styles.button}
            onPress={addWord}
          >
            <Text style={styles.buttonText}>Drop Word</Text>
          </Pressable>
        </View>

        {words.map(({ id, text }) => (
          <FallingWord
            key={id}
            onCollide={() => setScore(prev => prev + 1)}
            onExit={() => handleWordExit(id)}
          >
            {text}
          </FallingWord>
        ))}
      </SafeAreaView>
    </CollisionProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 16,
  },
  hud: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  controls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  button: {
    backgroundColor: '#4299e1',
    padding: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  maxSizeText: {
    color: '#e53e3e',
    fontWeight: 'bold',
    fontSize: 18,
  },
});