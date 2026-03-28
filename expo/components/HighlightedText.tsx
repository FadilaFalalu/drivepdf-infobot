import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface HighlightedTextProps {
  text: string;
  style?: any;
  highlightStyle?: any;
}

export default function HighlightedText({ text, style, highlightStyle }: HighlightedTextProps) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  
  return (
    <Text style={style}>
      {parts.map((part, index) => {
        if (index % 2 === 1) {
          return (
            <Text key={index} style={[styles.highlight, highlightStyle]}>
              {part}
            </Text>
          );
        }
        return part;
      })}
    </Text>
  );
}

const styles = StyleSheet.create({
  highlight: {
    backgroundColor: '#fff3cd',
    color: '#856404',
    fontWeight: '600',
    paddingHorizontal: 2,
    borderRadius: 2,
  },
});