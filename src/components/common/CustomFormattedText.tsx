import React from 'react';
import { View, Text, Platform, TextStyle, ViewStyle } from 'react-native';

export const formatAsPoints = (text: string) => {
  if (!text) return text;
  
  // If the text already has bullets, just ensure sentences are spaced out
  if (text.includes('- ') || text.includes('* ') || text.includes('->') || text.includes('• ')) {
    return text.replace(/\. /g, '.\n\n');
  }

  // Otherwise, automatically convert the dense paragraph into a beautiful bulleted list!
  return text
    .split(/\.\s+/)
    .map(sentence => sentence.trim())
    .filter(s => s.length > 0)
    .map(sentence => `• ${sentence}${sentence.endsWith('.') ? '' : '.'}`)
    .join('\n\n');
};

interface CustomFormattedTextProps {
  text: string;
  style?: TextStyle | TextStyle[];
  containerStyle?: ViewStyle | ViewStyle[];
  isDark: boolean;
  theme: any;
  autoFormat?: boolean;
}

export const CustomFormattedText: React.FC<CustomFormattedTextProps> = ({ 
  text, 
  style, 
  containerStyle,
  isDark, 
  theme, 
  autoFormat = false 
}) => {
  if (!text) return null;

  const processedText = autoFormat ? formatAsPoints(text) : text;
  const flatStyle = (Array.isArray(style) ? Object.assign({}, ...style) : style) as TextStyle || {};
  
  // First, let's parse the text into blocks (markdown code blocks vs normal text)
  const blocks: { type: 'text' | 'code'; content: string; language?: string }[] = [];
  const lines = processedText.split('\n');
  
  let inCodeBlock = false;
  let currentBlockContent: string[] = [];
  let currentLanguage = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        // End of code block
        blocks.push({ type: 'code', content: currentBlockContent.join('\n'), language: currentLanguage });
        currentBlockContent = [];
        inCodeBlock = false;
      } else {
        // Start of code block
        if (currentBlockContent.length > 0) {
          blocks.push({ type: 'text', content: currentBlockContent.join('\n') });
          currentBlockContent = [];
        }
        inCodeBlock = true;
        currentLanguage = line.trim().replace('```', '');
      }
    } else {
      currentBlockContent.push(line);
    }
  }
  
  if (currentBlockContent.length > 0) {
    blocks.push({ type: inCodeBlock ? 'code' : 'text', content: currentBlockContent.join('\n') });
  }

  // Render inline parts
  const renderInlineParts = (textToRender: string, keyPrefix: string | number) => {
    return textToRender.split(/(`[^`]+`)/).map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <Text
            key={`${keyPrefix}-inline-${i}`}
            style={[
              style,
              {
                fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
                backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : '#E2E8F0',
                color: isDark ? '#93C5FD' : '#1D4ED8',
                fontSize: (flatStyle.fontSize || 15) - 0.5,
                borderRadius: 4,
                overflow: 'hidden',
              },
            ]}
          >
            {' '}{part.substring(1, part.length - 1)}{' '}
          </Text>
        );
      }
      // Highlight **bold** text
      return part.split(/(\*\*.*?\*\*)/).map((subPart, j) => {
        if (subPart.startsWith('**') && subPart.endsWith('**')) {
          return <Text key={`${keyPrefix}-bold-${i}-${j}`} style={[style, { fontWeight: 'bold', color: theme.colors.text }]}>{subPart.substring(2, subPart.length - 2)}</Text>;
        }
        return <Text key={`${keyPrefix}-text-${i}-${j}`} style={style}>{subPart}</Text>;
      });
    });
  };

  return (
    <View style={[{ width: '100%' }, containerStyle]}>
      {blocks.map((block, blockIdx) => {
        if (block.type === 'code') {
          return (
            <View 
              key={`block-${blockIdx}`} 
              style={{ 
                backgroundColor: isDark ? '#1E293B' : '#F1F5F9', 
                padding: 16, 
                borderRadius: 12, 
                marginBottom: 16,
                marginTop: 8,
                borderWidth: 1,
                borderColor: isDark ? '#334155' : '#E2E8F0',
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <Text 
                style={{ 
                  fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', 
                  color: isDark ? '#E2E8F0' : '#0F172A', 
                  fontSize: 14,
                  lineHeight: 22
                }}
              >
                {block.content}
              </Text>
            </View>
          );
        }

        // It's a text block, process line by line for bullets, etc.
        return (
          <View key={`block-${blockIdx}`}>
            {block.content.split('\n').map((line, idx) => {
              const isEmpty = line.trim() === '';
              
              // Handle headers like ### 
              const isHeader = line.trim().startsWith('### ');
              
              const isArrow = line.trim().startsWith('->');
              const isBullet = !isArrow && !isHeader && (line.trim().startsWith('-') || line.trim().startsWith('*') || line.trim().startsWith('•'));
              
              if (isEmpty) {
                return <View key={`line-${idx}`} style={{ height: 12 }} />;
              }
              
              if (isHeader) {
                return (
                  <Text key={`line-${idx}`} style={[style, { fontSize: (flatStyle.fontSize || 16) + 2, fontWeight: 'bold', color: theme.colors.primary, marginTop: 12, marginBottom: 8 }]}>
                    {renderInlineParts(line.replace('### ', '').trim(), idx)}
                  </Text>
                );
              }

              if (isArrow) {
                return (
                  <View key={`line-${idx}`} style={{ flexDirection: 'row', marginBottom: 12, paddingLeft: 4, marginTop: 8 }}>
                    <Text style={[style, { marginRight: 8, fontSize: 16, color: theme.colors.primary, fontWeight: 'bold' }]}>➔</Text>
                    <Text style={[{ flex: 1 }, style]}>
                      {renderInlineParts(line.substring(line.indexOf('->') + 2).trim(), idx)}
                    </Text>
                  </View>
                );
              }

              if (isBullet) {
                return (
                  <View key={`line-${idx}`} style={{ flexDirection: 'row', marginBottom: 10, paddingLeft: 12 }}>
                    <Text style={[style, { marginRight: 10, fontSize: 20, lineHeight: 22, color: theme.colors.primary }]}>•</Text>
                    <Text style={[{ flex: 1 }, style]}>
                      {renderInlineParts(line.substring(line.indexOf(line.trim()[0]) + 1).trim(), idx)}
                    </Text>
                  </View>
                );
              }

              return (
                <Text key={`line-${idx}`} style={[style, { marginBottom: 10, lineHeight: 24 }]}>
                  {renderInlineParts(line, idx)}
                </Text>
              );
            })}
          </View>
        );
      })}
    </View>
  );
};
