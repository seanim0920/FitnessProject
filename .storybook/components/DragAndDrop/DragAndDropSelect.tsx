import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { DraggableView } from '../DraggableView/DraggableView';
import { useDragAndDrop } from "./useDragAndDrop";

type DropOption = {
  id: string;
  label: string;
  isValid: boolean;
  position?: {
    bottom: number;
    left: number;
  };
};

type GenericDragAndDropProps = {
  options: DropOption[];
  columns?: number;
  spacing?: {
    vertical: number;
    horizontal: number;
  };
  draggableLabel?: string;
  onSelect?: (option?: DropOption) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
};

type StyleWithPosition = ViewStyle & {
  bottom: number;
  left: number | string;
  marginLeft: number;
};

export const DragAndDropSelect = ({
  options,
  columns = 3,
  spacing = { vertical: 200, horizontal: 40 },
  draggableLabel = "Drag me!",
  onSelect
}: GenericDragAndDropProps) => {
  const optionIds = options.map(opt => opt.id);
  const dropTargets = useDragAndDrop(optionIds, (id) => onSelect?.(id ? options.find(option => id === option.id) : undefined));
  const { token, ...targets } = dropTargets;

  const calculatePosition = (index: number): { bottom: number; left: string } => {
    if (options[index].position) {
      return {
        bottom: options[index].position!.bottom,
        left: `${options[index].position!.left}%`,
      };
    }

    const row = Math.floor(index / columns);
    const col = index % columns;
    
    return {
      bottom: 300 + (row * spacing.vertical),
      left: `${(100 / (columns + 1)) * (col + 1)}%`,
    };
  };

  return (
    <>
      {options.map((option, index) => {
        const position = calculatePosition(index);
        return (
          <Animated.View
            key={option.id}
            onLayout={targets[option.id].onLayout}
            style={[
              styles.target,
              styles.blueTarget,
              {
                bottom: position.bottom,
                left: position.left,
                marginLeft: -50,
              } as StyleWithPosition,
              token.isDragging && styles.tokenHovered,
              token.isDragging && targets[option.id].isSelecting && styles.targetHovered,
              !token.isDragging && targets[option.id].isSelecting && 
                (option.isValid ? styles.targetSelected : styles.targetInvalid)
            ]}
          >
            <View style={styles.targetInner}>
              <Text>{option.label}</Text>
            </View>
          </Animated.View>
        );
      })}
      
      <DraggableView
        draggable={{
          panGesture: token.dragGesture,
          panPosition: token.tokenPosition
        }}
        style={[
          styles.target,
          styles.draggable,
          token.isDragging && styles.targetHovered,
          {left: "50%", bottom: "10%"}
        ]}
      >
        <Text>{draggableLabel}</Text>
      </DraggableView>
    </>
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
  blueTarget: {
    backgroundColor: '#bbdefb',
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
  targetInvalid: {
    borderWidth: 2,
    borderColor: '#0af',
  },
});