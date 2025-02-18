import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PanGesture } from 'react-native-gesture-handler';
import Animated, { SharedValue } from 'react-native-reanimated';
import { useDragAndDrop } from "../DragAndDrop/useDragAndDrop";
import { DraggableView } from '../DraggableView/DraggableView';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type DragAndDropOption = {
  isSelecting: boolean;
  onLayout: () => void;
};

type DragAndDropToken = {
  isDragging: boolean;
  dragGesture: PanGesture;
  tokenPosition: {
    x: SharedValue<number>;
    y: SharedValue<number>;
  };
};

type DragAndDrop<T extends readonly string[]> = {
  [K in T[number]]: DragAndDropOption;
} & {
  token: DragAndDropToken;
};

type GameState = 'title' | 'playing' | 'game_over';

interface FallingObject {
  id: string;
  x: number;
  y: number;
  speed: number;
  type: 'enemy' | 'bonus';
}

interface CollisionRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const ShieldDefenseGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>("title");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);

  if (gameState === "title") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Shield Defense</Text>
        <Text style={styles.subtitle}>Protect yourself from falling objects!</Text>
        <TouchableOpacity style={styles.button} onPress={startGame}>
          <Text style={styles.buttonText}>Start Game</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (gameState === "game_over") {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, styles.gameOverTitle]}>Game Over</Text>
        <Text style={styles.scoreText}>Final Score: {score}</Text>
        <TouchableOpacity style={styles.button} onPress={startGame}>
          <Text style={styles.buttonText}>Play Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.gameContainer}>
      {/* HUD */}
      <View style={styles.hud}>
        <Text style={styles.hudText}>Score: {score}</Text>
        <Text style={styles.hudText}>Lives: {'❤️'.repeat(lives)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a202c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameContainer: {
    flex: 1,
    backgroundColor: '#1a202c',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#63b3ed',
    marginBottom: 20,
  },
  gameOverTitle: {
    color: '#fc8181',
  },
  subtitle: {
    fontSize: 20,
    color: 'white',
    marginBottom: 30,
  },
  scoreText: {
    fontSize: 24,
    color: 'white',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4299e1',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  hud: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  hudText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  fallingObject: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  shield: {
    position: 'absolute',
    width: 100,
    height: 100,
    backgroundColor: '#4299e1',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4299e1',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
    left: SCREEN_WIDTH / 2 - 50,
    bottom: SCREEN_HEIGHT * 0.1,
  },
  shieldText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ShieldDefenseGame;