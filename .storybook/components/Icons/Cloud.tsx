// Cloud.tsx
import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

type CloudProps = {
  color?: string;
  outlineColor?: string;
  style?: ViewStyle;
};

export const Cloud = ({ color = 'black', outlineColor = 'lightgray', style }: CloudProps) => (
  <Svg
    style={[styles.cloud, style]}
    viewBox="-1 -14.61 215.12 213.12"
  >
    {/* Outline path */}
    <Path
      d="M61.92,15.94c4.87-5,9.49-9.22,15.35-11.9C84.2.88,91.41-.68,99,.28a34.79,34.79,0,0,1,9,2.4,77.15,77.15,0,0,1,22.32,14.89c13.18-8.54,27.05-8.49,39.81-.9,12.46,7.41,21.49,18.21,20.36,34.46,2.76,1.45,5.23,2.83,7.78,4.06,5.65,2.75,9.57,7.23,12.49,12.61,3.07,5.67,3,11.66.55,17.45-1.59,3.84-2.94,7.45-.86,11.48a3.68,3.68,0,0,1,.39,1.66c-.21,8.61-.81,17.14-4.83,25a29.3,29.3,0,0,1-16.71,14.53c-.15,1.71-.37,3.35-.43,5-.34,8.27-3.43,15.58-7.94,22.36a27,27,0,0,1-19,12.08c-9.19,1.42-18.3,1.12-26.83-3.32l-4.17-2.13a53.1,53.1,0,0,0-4.75,3.31c-8.56,7.39-18.08,10.34-29.43,7.74-8.32-1.91-15.81-5-21.64-11.08-6.23-.37-12.21-.69-18.18-1.07-6.79-.42-12.67-3.36-18.33-6.82-6.27-3.83-9.17-10.07-11.47-16.61a73.71,73.71,0,0,1-4.4-25.79,62.39,62.39,0,0,0-7.34-4,17,17,0,0,1-8.46-7C2.46,103.4-.49,95.69.07,87.06a16.19,16.19,0,0,1,1.45-6.64c3.57-6.48,6.29-13.59,12.2-18.54C16,60,16.27,57.85,15.91,55c-1.72-13.6,4.41-23.95,14.64-31.93a34.57,34.57,0,0,1,25-7.44C57.5,15.82,59.5,15.83,61.92,15.94Z"
      stroke={outlineColor}
      strokeWidth={2} // Adjust width if necessary
      fill="white" // No fill for the outline
    />
  </Svg>
);

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  cloud: {
    position: 'absolute',
    top: 50,
    opacity: 0.5,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
