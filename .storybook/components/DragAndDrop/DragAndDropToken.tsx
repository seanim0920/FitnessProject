
import React from 'react';
import { ViewProps } from 'react-native';
import { DraggableView } from "../DraggableView/DraggableView";
import { DragAndDropTarget } from './DragAndDropOption';

export const DragAndDropToken = (props: ViewProps) => {
  return (
    <DragAndDropTarget>
      <DraggableView {...props}/>
    </DragAndDropTarget>
  )
};
