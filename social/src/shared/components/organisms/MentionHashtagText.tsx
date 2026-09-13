import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';

export interface MentionHashtagTextProps {
  content: string;
  onMentionPress?: (mention: string) => void;
  onHashtagPress?: (hashtag: string) => void;
  onUrlPress?: (url: string) => void;
  style?: TextStyle;
  numberOfLines?: number;
}

export const MentionHashtagText: React.FC<MentionHashtagTextProps> = ({
  content,
  onMentionPress,
  onHashtagPress,
  onUrlPress,
  style,
  numberOfLines,
}) => {
  const { colors, theme } = useTheme();

  const regex = /(@\w+|#\w+|https?:\/\/[^\s]+)/g;
  const parts = content.split(regex);

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        {
          color: colors.text,
          fontSize: theme.typography.body1.fontSize,
          lineHeight: theme.typography.body1.lineHeight,
        },
        style,
      ]}
    >
      {parts.map((part, index) => {
        if (!part) return null;

        if (part.startsWith('@')) {
          return (
            <Text
              key={index}
              style={{ color: colors.primary, fontWeight: '600' }}
              onPress={() => onMentionPress?.(part.substring(1))}
            >
              {part}
            </Text>
          );
        }

        if (part.startsWith('#')) {
          return (
            <Text
              key={index}
              style={{ color: colors.primary, fontWeight: '600' }}
              onPress={() => onHashtagPress?.(part.substring(1))}
            >
              {part}
            </Text>
          );
        }

        if (part.startsWith('http://') || part.startsWith('https://')) {
          return (
            <Text
              key={index}
              style={{ color: colors.info, textDecorationLine: 'underline' }}
              onPress={() => onUrlPress?.(part)}
            >
              {part}
            </Text>
          );
        }

        return <Text key={index}>{part}</Text>;
      })}
    </Text>
  );
};
