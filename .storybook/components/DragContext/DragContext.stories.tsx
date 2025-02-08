import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DragProvider } from './DragContext';
import { DragTarget } from './DragTarget';

export const DragTargetMeta = {
  title: "DragTarget",
};

export default DragTargetMeta;

export const Basic = () => {
  const [hoveredStates, setHoveredStates] = useState({
    red: false,
    blue: false,
    green: false,
  });

  const handleHoverChange = (color: keyof typeof hoveredStates) => (isHovered: boolean) => {
    setHoveredStates(prev => ({
      ...prev,
      [color]: isHovered,
    }));
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <DragProvider>
        <View style={styles.content}>
          <DragTarget
            style={[
              styles.target,
              styles.redTarget,
              { top: 100, left: 50 },
              hoveredStates.red && styles.targetHovered,
            ]}
            onHoverChange={handleHoverChange('red')}
          >
            <View style={styles.targetInner}>
              {hoveredStates.red && <View style={styles.hoverIndicator} />}
            </View>
          </DragTarget>

          <DragTarget
            style={[
              styles.target,
              styles.blueTarget,
              { top: 100, right: 50 },
              hoveredStates.blue && styles.targetHovered,
            ]}
            onHoverChange={handleHoverChange('blue')}
          >
            <View style={styles.targetInner}>
              {hoveredStates.blue && <View style={styles.hoverIndicator} />}
            </View>
          </DragTarget>

          <DragTarget
            style={[
              styles.target,
              styles.greenTarget,
              { bottom: 100, left: '50%', marginLeft: -50 },
              hoveredStates.green && styles.targetHovered,
            ]}
            onHoverChange={handleHoverChange('green')}
          >
            <View style={styles.targetInner}>
              {hoveredStates.green && <View style={styles.hoverIndicator} />}
            </View>
          </DragTarget>
        </View>
      </DragProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  target: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  targetInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  redTarget: {
    backgroundColor: '#ffcdd2',
  },
  blueTarget: {
    backgroundColor: '#bbdefb',
  },
  greenTarget: {
    backgroundColor: '#c8e6c9',
  },
  targetHovered: {
    borderWidth: 2,
    borderColor: '#000',
  },
  hoverIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});