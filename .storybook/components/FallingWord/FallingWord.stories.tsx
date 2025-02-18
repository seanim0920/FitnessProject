import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StoryMeta } from "storybook/HelperTypes";
import { CollisionProvider } from "../CollisionContext/CollisionContext";
import { FallingWord } from "./FallingWord";

export const FallingWordMeta: StoryMeta = {
  title: "FallingWord",
};

export default FallingWordMeta;

export const Basic = () => {
  const [words, setWords] = useState<Array<{id: string, text: string}>>([]);
  const [fallenWordCounter, setFallenWordCounter] = useState(0)

  const addWord = () => {
    const id = Math.random().toString(36).substring(7);
    const text = `Word ${words.length + 1}`;
    setWords(prev => [...prev, { id, text }]);
  };

  const handleWordExit = (id: string) => {
    setFallenWordCounter((prev) => prev + 1)
    setWords(prev => prev.filter(word => word.id !== id));
  };

  return (
    <CollisionProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.hud}>
          <Text style={styles.labelText}>{`Fallen words: ${fallenWordCounter}`}</Text>
        </View>

        <View style={styles.controls}>
          <Pressable 
            style={styles.button} 
            onPress={addWord}
          >
            <Text style={styles.buttonText}>Spawn Word</Text>
          </Pressable>
        </View>

        {words.map(({ id, text }) => (
          <FallingWord
            key={id}
            onCollide={() => console.log("colliding!")}
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
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  safeArea: {
    flex: 1,
    padding: 16,
  },
  controls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  hud: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    minWidth: 150,
    alignItems: 'center',
    backgroundColor: '#2196f3',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  labelText: {
    color: 'black',
    fontWeight: 'bold',
  },
});