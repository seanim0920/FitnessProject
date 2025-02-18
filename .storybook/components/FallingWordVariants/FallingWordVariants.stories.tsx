import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StoryMeta } from "storybook/HelperTypes";
import { CollisionProvider } from "../CollisionContext/CollisionContext";
import { ThemedFallingWord, WordType } from "./FallingWordVariants";

export const FallingWordVariantsMeta: StoryMeta = {
  title: "FallingWordVariants",
};

export default FallingWordVariantsMeta;

export const Basic = () => {
  const [words, setWords] = useState<Array<{id: string, type: WordType}>>([]);
  const [score, setScore] = useState({ good: 0, bad: 0 });

  const addWord = (type: WordType) => {
    const id = Math.random().toString(36).substring(7);
    setWords(prev => [...prev, { id, type }]);
  };

  const handleWordExit = (id: string) => {
    setWords(prev => prev.filter(word => word.id !== id));
  };

  const handleCollision = (type: WordType) => {
    setScore(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
  };

  return (
    <CollisionProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.hud}>
          <Text style={styles.scoreText}>Good: {score.good}</Text>
          <Text style={styles.scoreText}>Bad: {score.bad}</Text>
        </View>

        <View style={styles.controls}>
          <Pressable 
            style={[styles.button, styles.goodButton]} 
            onPress={() => addWord('good')}
          >
            <Text style={styles.buttonText}>Spawn Good Word</Text>
          </Pressable>
          <View style={styles.buttonSpacer} />
          <Pressable 
            style={[styles.button, styles.badButton]} 
            onPress={() => addWord('bad')}
          >
            <Text style={styles.buttonText}>Spawn Bad Word</Text>
          </Pressable>
        </View>

        {words.map(({ id, type }) => (
          <ThemedFallingWord
            key={id}
            type={type}
            onCollide={() => handleCollision(type)}
            onExit={() => handleWordExit(id)}
          />
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
  controls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  buttonSpacer: {
    width: 16,
  },
  hud: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
    zIndex: 10,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    minWidth: 150,
    alignItems: 'center',
  },
  goodButton: {
    backgroundColor: '#38a169',
  },
  badButton: {
    backgroundColor: '#e53e3e',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  scoreText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
  },
});