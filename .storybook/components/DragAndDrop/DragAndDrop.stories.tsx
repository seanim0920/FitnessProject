import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DragProvider } from '../DragContext/DragContext';
import { DragAndDropTarget } from "./DragAndDropTarget";
import { DragAndDropToken } from "./DragAndDropToken";

export const DragAndDropMeta = {
  title: "DragAndDrop",
};

export default DragAndDropMeta;

export const Basic = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <DragProvider>
        <View style={styles.content}>      
          <DragAndDropTarget
            style={[
              styles.target,
              styles.redTarget,
              { top: 100, left: 50 },
            ]}
            activeStyle={styles.targetHovered}
          />

          <DragAndDropTarget
            style={[
              styles.target,
              styles.blueTarget,
              { top: 100, right: 50 },
            ]}
            activeStyle={styles.targetHovered}
          />

          <DragAndDropTarget
            style={[
              styles.target,
              styles.greenTarget,
              { bottom: 100, left: '50%', marginLeft: -50 },
            ]}
            activeStyle={styles.targetHovered}
          />

          <DragAndDropToken 
            style={styles.token}
          >
            <Text>Drag me!</Text>
          </DragAndDropToken>
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