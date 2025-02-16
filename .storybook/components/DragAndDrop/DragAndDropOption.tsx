
import React from 'react';
import { DragTarget, DragTargetProps } from '../DragContext/DragTarget';
import { UseDragContextArgs } from '../DragContext/useDragContext';
import { useDragAndDropExtension } from './useDragAndDropExtension';

type DragAndDropTargetProps = DragTargetProps & {
  dragContextArgs?: UseDragContextArgs;
};

export const DragAndDropTarget = ({ dragContextArgs, ...props }: DragAndDropTargetProps) => {
  return (
    <DragTarget
      dragContextArgs={{
        dragContextExtension: useDragAndDropExtension,
        ...dragContextArgs
      }}
      {...props}
    />
  )
};