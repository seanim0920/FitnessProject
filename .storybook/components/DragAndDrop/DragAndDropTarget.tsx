
// import React from 'react';
// import { DragTarget, DragTargetProps } from '../DragContext/DragTarget';
// import { UseDragContextArgs } from '../DragContext/useDragContext';
// import { useDragAndDropContext, UseDragAndDropContextProps } from './useDragAndDropExtension';

// type DragAndDropTargetProps = DragTargetProps & {
//   dragAndDropArgs?: UseDragAndDropContextProps;
//   dragContextArgs?: UseDragContextArgs;
// };

// export const DragAndDropTarget = ({ dragAndDropArgs, dragContextArgs, ...props }: DragAndDropTargetProps) => {
//   return (
//     <DragTarget
//       dragContextArgs={{
//         useDragContextExtension: useDragAndDropContext(dragAndDropArgs),
//         ...dragContextArgs
//       }}
//       {...props}
//     />
//   )
// };