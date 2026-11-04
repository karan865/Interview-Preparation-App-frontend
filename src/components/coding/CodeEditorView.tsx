import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { CodingLanguage, CodingSolutions } from '../../types/coding';

interface CodeEditorViewProps {
  solutions: CodingSolutions;
  initialLanguage?: CodingLanguage;
  onLanguageChange?: (lang: CodingLanguage) => void;
}

const LANGUAGES: {
  id: CodingLanguage;
  label: string;
  badge: string;
  filename: string;
  badgeColor: string;
}[] = [
  { id: 'javascript', label: 'JavaScript', badge: 'JS', filename: 'solution.js', badgeColor: '#F7DF1E' },
  { id: 'python', label: 'Python', badge: 'PY', filename: 'solution.py', badgeColor: '#38BDF8' },
  { id: 'java', label: 'Java', badge: 'JAVA', filename: 'Solution.java', badgeColor: '#FB923C' },
  { id: 'csharp', label: 'C# (.NET)', badge: 'C#', filename: 'Solution.cs', badgeColor: '#A855F7' },
  { id: 'cpp', label: 'C++', badge: 'C++', filename: 'solution.cpp', badgeColor: '#34D399' },
];

const MONO_FONT = Platform.OS === 'ios' ? 'Menlo' : 'monospace';

// Syntax colors (VS Code One Dark Pro / Catppuccin inspired)
const C_KEYWORD = '#C678DD';
const C_STRING = '#98C379';
const C_NUMBER = '#D19A66';
const C_COMMENT = '#7F849C';
const C_FUNCTION = '#61AFEF';
const C_TYPE = '#E5C07B';
const C_DEFAULT = '#ABB2BF';

const KEYWORDS = new Set([
  'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do',
  'break', 'continue', 'switch', 'case', 'default', 'try', 'catch', 'finally',
  'throw', 'class', 'extends', 'super', 'new', 'this', 'typeof', 'instanceof',
  'async', 'await', 'import', 'export', 'from', 'in', 'of', 'def', 'elif',
  'lambda', 'pass', 'with', 'as', 'except', 'raise', 'public', 'private',
  'protected', 'static', 'final', 'void', 'package', 'interface', 'implements',
  'namespace', 'using', 'auto', 'struct', 'typedef', 'template', 'typename',
  'true', 'false', 'null', 'undefined', 'None', 'True', 'False'
]);

const TYPES = new Set([
  'int', 'string', 'boolean', 'bool', 'char', 'float', 'double', 'long', 'short',
  'byte', 'void', 'int[]', 'String[]', 'vector', 'pair', 'map', 'set', 'unordered_map',
  'Array', 'Object', 'Number', 'String', 'Boolean', 'Promise', 'List', 'Map', 'Set'
]);

// Tokenize a single line for syntax highlighting
function highlightCodeLine(line: string, lang: CodingLanguage) {
  if (!line) return [<Text key="empty" style={{ color: C_DEFAULT }}> </Text>];

  const commentPrefix = (lang === 'python') ? '#' : '//';
  const commentIndex = line.indexOf(commentPrefix);

  let codePart = line;
  let commentPart = '';

  if (commentIndex !== -1) {
    codePart = line.substring(0, commentIndex);
    commentPart = line.substring(commentIndex);
  }

  // Regex tokenizer: matches strings, words (identifiers/keywords), numbers, punctuation
  const tokenRegex = /("[^"]*"|'[^']*'|`[^`]*`|\b[a-zA-Z_$][a-zA-Z0-9_$]*\b|\b\d+(?:\.\d+)?\b|[^\s\w]+|\s+)/g;
  const parts: React.ReactNode[] = [];
  let match;
  let keyIndex = 0;

  while ((match = tokenRegex.exec(codePart)) !== null) {
    const token = match[0];
    let color = C_DEFAULT;

    if (token.startsWith('"') || token.startsWith("'") || token.startsWith('`')) {
      color = C_STRING;
    } else if (/^\d+(?:\.\d+)?$/.test(token)) {
      color = C_NUMBER;
    } else if (KEYWORDS.has(token)) {
      color = C_KEYWORD;
    } else if (TYPES.has(token)) {
      color = C_TYPE;
    } else if (
      token === 'console' || token === 'log' || token === 'print' ||
      token === 'System' || token === 'out' || token === 'println' ||
      token === 'Console' || token === 'WriteLine' || token === 'cout' ||
      token === 'cin' || token === 'push' || token === 'pop' || token === 'map' ||
      token === 'filter' || token === 'reduce' || token === 'length' || token === 'size'
    ) {
      color = C_FUNCTION;
    }

    parts.push(
      <Text key={`tok_${keyIndex++}`} style={{ color, fontFamily: MONO_FONT }}>
        {token}
      </Text>
    );
  }

  if (commentPart) {
    parts.push(
      <Text
        key={`com_${keyIndex++}`}
        style={{ color: C_COMMENT, fontStyle: 'italic', fontFamily: MONO_FONT }}
      >
        {commentPart}
      </Text>
    );
  }

  return parts;
}

export const CodeEditorView: React.FC<CodeEditorViewProps> = ({
  solutions,
  initialLanguage = 'javascript',
  onLanguageChange,
}) => {
  const [activeLang, setActiveLang] = useState<CodingLanguage>(initialLanguage);
  const [copied, setCopied] = useState(false);

  const currentConfig = LANGUAGES.find((l) => l.id === activeLang) || LANGUAGES[0];
  const currentCode = (solutions[activeLang] || '').trim();
  const lines = currentCode ? currentCode.split('\n') : ['// No solution available'];

  const handleSelectLang = (lang: CodingLanguage) => {
    setActiveLang(lang);
    setCopied(false);
    onLanguageChange?.(lang);
  };

  const handleCopyCode = async () => {
    if (!currentCode) return;
    await Clipboard.setStringAsync(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <View style={styles.container}>
      {/* ─── Top Language Switcher Tabs ─────────────────────────────────── */}
      <View style={styles.tabBarContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScrollContent}
        >
          {LANGUAGES.map((lang) => {
            const isActive = activeLang === lang.id;
            return (
              <TouchableOpacity
                key={lang.id}
                style={[
                  styles.tabButton,
                  isActive && styles.tabButtonActive,
                ]}
                onPress={() => handleSelectLang(lang.id)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.tabBadge,
                    { backgroundColor: isActive ? lang.badgeColor : '#334155' },
                  ]}
                >
                  <Text
                    style={[
                      styles.tabBadgeText,
                      { color: isActive && lang.id === 'javascript' ? '#000000' : '#FFFFFF' },
                    ]}
                  >
                    {lang.badge}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.tabLabel,
                    isActive ? styles.tabLabelActive : styles.tabLabelInactive,
                  ]}
                >
                  {lang.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ─── VS Code Editor Window ────────────────────────────────────────── */}
      <View style={styles.editorCard}>
        {/* VS Code Window Header */}
        <View style={styles.editorHeader}>
          {/* macOS 3 dots */}
          <View style={styles.windowDots}>
            <View style={[styles.dot, { backgroundColor: '#FF5F56' }]} />
            <View style={[styles.dot, { backgroundColor: '#FFBD2E' }]} />
            <View style={[styles.dot, { backgroundColor: '#27C93F' }]} />
          </View>

          {/* Active File Tab */}
          <View style={styles.fileTab}>
            <Ionicons name="code-slash" size={13} color={currentConfig.badgeColor} />
            <Text style={styles.fileName}>{currentConfig.filename}</Text>
          </View>

          {/* Copy Button */}
          <TouchableOpacity
            style={styles.copyButton}
            onPress={handleCopyCode}
            activeOpacity={0.7}
          >
            <Ionicons
              name={copied ? 'checkmark-circle' : 'copy-outline'}
              size={14}
              color={copied ? '#34D399' : '#94A3B8'}
            />
            <Text style={[styles.copyText, copied && { color: '#34D399' }]}>
              {copied ? 'Copied!' : 'Copy'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Code Content with Line Numbers */}
        <ScrollView
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={true}
          style={styles.codeScrollHorizontal}
        >
          <View style={styles.codeRowContainer}>
            {/* Line Numbers Column */}
            <View style={styles.lineNumbersColumn}>
              {lines.map((_, idx) => (
                <Text key={`line_num_${idx}`} style={styles.lineNumberText}>
                  {idx + 1}
                </Text>
              ))}
            </View>

            {/* Code Lines Column */}
            <View style={styles.codeLinesColumn}>
              {lines.map((line, idx) => (
                <View key={`code_line_${idx}`} style={styles.codeLineWrapper}>
                  <Text style={styles.codeLineText}>
                    {highlightCodeLine(line, activeLang)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  // Tab Bar
  tabBarContainer: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 4,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  tabScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 2,
    gap: 6,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 11,
    borderRadius: 10,
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  tabBadge: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    fontFamily: MONO_FONT,
  },
  tabLabel: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: '#F8FAFC',
    fontWeight: '700',
  },
  tabLabelInactive: {
    color: '#94A3B8',
  },

  // VS Code Box
  editorCard: {
    backgroundColor: '#181A20',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#282C34',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  editorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#21252B',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#181A20',
  },
  windowDots: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  fileTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#181A20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 6,
  },
  fileName: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: MONO_FONT,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 9,
    backgroundColor: '#282C34',
    borderRadius: 6,
  },
  copyText: {
    fontSize: 11.5,
    color: '#94A3B8',
    fontWeight: '600',
  },

  // Code Area
  codeScrollHorizontal: {
    backgroundColor: '#181A20',
  },
  codeRowContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingRight: 20,
    minWidth: '100%',
  },
  lineNumbersColumn: {
    paddingLeft: 10,
    paddingRight: 14,
    borderRightWidth: 1,
    borderRightColor: '#282C34',
    alignItems: 'flex-end',
    userSelect: 'none',
  },
  lineNumberText: {
    fontSize: 12.5,
    lineHeight: 20,
    color: '#4B5263',
    fontFamily: MONO_FONT,
    textAlign: 'right',
  },
  codeLinesColumn: {
    paddingLeft: 14,
    paddingRight: 20,
  },
  codeLineWrapper: {
    height: 20,
    justifyContent: 'center',
  },
  codeLineText: {
    fontSize: 12.5,
    lineHeight: 20,
    fontFamily: MONO_FONT,
  },
});

