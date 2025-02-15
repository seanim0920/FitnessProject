import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StoryMeta } from "storybook/HelperTypes";
import { DragAndDropSelect } from "./DragAndDropSelect";

export const DragAndDropSelectMeta: StoryMeta = {
  title: "DragAndDropSelect",
};

export default DragAndDropSelectMeta;

const myQuestion = {
  text: "What is the capital of France?",
  correctAnswer: "paris",
  options: [
    { id: "london", text: "London" },
    { id: "berlin", text: "Berlin" },
    { id: "paris", text: "Paris" },
    { id: "madrid", text: "Madrid" },
  ],
};


export const Basic = () => (
  <GestureHandlerRootView>
  <DragAndDropSelect 
    question={myQuestion}
    onAnswerSelected={(answerId) => console.log('Selected:', answerId)}
    onAnswerCorrect={() => console.log('Correct!')}
    onAnswerIncorrect={() => console.log('Try again!')}
  />
  </GestureHandlerRootView>
);
