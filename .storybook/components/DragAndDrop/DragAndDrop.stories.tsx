import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { DragProvider } from '../DragContext/DragContext';
import { DraggableView } from '../DraggableView/DraggableView';
import { useDragAndDrop } from "./useDragAndDrop";

export const DragAndDropMeta = {
  title: "DragAndDrop",
};

export default DragAndDropMeta;

const DragAndDropSelectionExample = () => {
  const {Paris, London, Berlin, Madrid, token} = useDragAndDrop(["Paris", "London", "Berlin", "Madrid"])

  return (
    <>
      <Animated.View
        onLayout={Paris.onLayout}
        style={[
          styles.target,
          styles.blueTarget,
          { bottom: 300, left: '10%', marginLeft: -50 },
          token.isDragging && styles.tokenHovered,
          token.isDragging && Paris.isSelecting && styles.targetHovered,
          !token.isDragging && Paris.isSelecting && styles.targetSelected
        ]}
      />
      <Animated.View
        onLayout={London.onLayout}
        style={[
          styles.target,
          styles.blueTarget,
          { bottom: 300, left: '50%', marginLeft: -50 },
          token.isDragging && styles.tokenHovered,
          token.isDragging && London.isSelecting && styles.targetHovered,
          !token.isDragging && London.isSelecting && styles.targetSelected
        ]}
      />
      <Animated.View
        onLayout={Berlin.onLayout}
        style={[
          styles.target,
          styles.blueTarget,
          { bottom: 300, left: '90%', marginLeft: -50 },
          token.isDragging && styles.tokenHovered,
          token.isDragging && Berlin.isSelecting && styles.targetHovered,
          !token.isDragging && Berlin.isSelecting && styles.targetSelected
        ]}
      />
      <Animated.View
        onLayout={Madrid.onLayout}
        style={[
          styles.target,
          styles.blueTarget,
          { bottom: 500, left: '50%', marginLeft: -50 },
          token.isDragging && styles.tokenHovered,
          token.isDragging && Madrid.isSelecting && styles.targetHovered,
          !token.isDragging && Madrid.isSelecting && styles.targetSelected
        ]}
      />
      <DraggableView
        draggable={{panGesture: token.dragGesture, panPosition: token.tokenPosition}}
        style={[
          styles.target,
          styles.draggable,
          token.isDragging && styles.targetHovered,
          !token.isDragging && Madrid.isSelecting && styles.targetSelected,
        ]}
      >
        <Text>Drag me!</Text>
      </DraggableView>
    </>
  )
}

export const Basic = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <DragProvider>
        <View style={styles.content}>      
          <DragAndDropSelectionExample />
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
  draggable: {
    position: 'absolute',
    backgroundColor: '#e0e0e0',
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
  tokenHovered: {
    borderWidth: 2,
    borderColor: '#ff0',
  },
  targetHovered: {
    borderWidth: 2,
    borderColor: '#000',
  },
  targetSelected: {
    borderWidth: 2,
    borderColor: '#faf',
  },
  hoverIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  token: { 
    backgroundColor: '#fff',
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
  }
});