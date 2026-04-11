import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Card } from './Card';
import { Badge } from './Badge';
import type { MathAnalysis } from '../services/openai';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function difficultyColor(d: MathAnalysis['difficulty']) {
  switch (d) {
    case 'Easy':     return { text: Colors.success,       bg: Colors.successLight };
    case 'Medium':   return { text: Colors.warning,       bg: Colors.warningLight };
    case 'Hard':     return { text: Colors.accent,        bg: Colors.accentLight  };
    case 'Advanced': return { text: Colors.primaryDark,   bg: Colors.primaryLight };
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionBlock({ icon, title, children }: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={blockStyles.wrapper}>
      <View style={blockStyles.header}>
        <Ionicons name={icon as any} size={16} color={Colors.primary} />
        <Text style={blockStyles.title}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

const blockStyles = StyleSheet.create({
  wrapper: { marginBottom: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  title: { fontSize: 14, fontWeight: '700', color: Colors.text, letterSpacing: 0.2 },
});

// ─── Step card ────────────────────────────────────────────────────────────────

function StepCard({ step }: { step: MathAnalysis['steps'][number] }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <View style={stepStyles.card}>
      <TouchableOpacity
        style={stepStyles.header}
        onPress={() => setExpanded((v) => !v)}
        activeOpacity={0.7}
      >
        <View style={stepStyles.badge}>
          <Text style={stepStyles.badgeText}>{step.stepNumber}</Text>
        </View>
        <Text style={stepStyles.title} numberOfLines={expanded ? undefined : 1}>
          {step.title}
        </Text>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={Colors.textTertiary}
        />
      </TouchableOpacity>

      {expanded && (
        <View style={stepStyles.body}>
          <Text style={stepStyles.explanation}>{step.explanation}</Text>

          {step.formula ? (
            <View style={stepStyles.formulaBox}>
              <Ionicons name="calculator-outline" size={14} color={Colors.primary} />
              <Text style={stepStyles.formula}>{step.formula}</Text>
            </View>
          ) : null}

          {step.tip ? (
            <View style={stepStyles.tipBox}>
              <Ionicons name="bulb-outline" size={14} color={Colors.warning} />
              <Text style={stepStyles.tip}>{step.tip}</Text>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
}

const stepStyles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    marginBottom: 10,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
  },
  badge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontSize: 12, fontWeight: '800', color: Colors.white },
  title: { flex: 1, fontSize: 14, fontWeight: '600', color: Colors.text },
  body: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    gap: 8,
  },
  explanation: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 21,
    paddingTop: 8,
  },
  formulaBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: Colors.primaryLight,
    borderRadius: 8,
    padding: 10,
  },
  formula: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryDark,
    fontFamily: 'monospace' as any,
    lineHeight: 20,
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: Colors.warningLight,
    borderRadius: 8,
    padding: 10,
  },
  tip: {
    flex: 1,
    fontSize: 13,
    color: Colors.text,
    lineHeight: 18,
  },
});

// ─── Pill list ────────────────────────────────────────────────────────────────

function PillList({ items, color, bg }: { items: string[]; color: string; bg: string }) {
  return (
    <View style={pillStyles.row}>
      {items.map((item, i) => (
        <View key={i} style={[pillStyles.pill, { backgroundColor: bg }]}>
          <Text style={[pillStyles.text, { color }]}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

const pillStyles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  text: { fontSize: 13, fontWeight: '600' },
});

// ─── Main component ───────────────────────────────────────────────────────────

interface AnalysisResultProps {
  analysis: MathAnalysis;
  onDismiss: () => void;
}

export function AnalysisResult({ analysis, onDismiss }: AnalysisResultProps) {
  const dc = difficultyColor(analysis.difficulty);

  return (
    <View style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <View style={styles.aiDot} />
          <Text style={styles.topBarLabel}>AI Analysis</Text>
        </View>
        <TouchableOpacity onPress={onDismiss} style={styles.dismissBtn}>
          <Ionicons name="close" size={18} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Detected problem */}
      <Card variant="outlined" style={styles.problemCard}>
        <Text style={styles.problemLabel}>DETECTED PROBLEM</Text>
        <Text style={styles.problemText}>{analysis.detectedProblem}</Text>
        <View style={styles.metaRow}>
          <Badge label={analysis.subject} />
          <Badge
            label={analysis.difficulty}
            color={dc.text}
            bgColor={dc.bg}
          />
        </View>
      </Card>

      {/* Final answer — hero */}
      <View style={styles.answerHero}>
        <View style={styles.answerHeroIcon}>
          <Ionicons name="checkmark-circle" size={28} color={Colors.success} />
        </View>
        <View style={styles.answerHeroText}>
          <Text style={styles.answerLabel}>Final Answer</Text>
          <Text style={styles.answerValue}>{analysis.finalAnswer}</Text>
        </View>
      </View>
      <Text style={styles.answerExplanation}>{analysis.answerExplanation}</Text>

      {/* Step-by-step breakdown */}
      {analysis.steps.length > 0 && (
        <SectionBlock icon="list-outline" title={`Step-by-Step Solution  (${analysis.steps.length} steps)`}>
          {analysis.steps.map((step) => (
            <StepCard key={step.stepNumber} step={step} />
          ))}
        </SectionBlock>
      )}

      {/* Key concepts */}
      {analysis.keyConcepts?.length > 0 && (
        <SectionBlock icon="book-outline" title="Key Concepts">
          <PillList items={analysis.keyConcepts} color={Colors.primary} bg={Colors.primaryLight} />
        </SectionBlock>
      )}

      {/* Common mistakes */}
      {analysis.commonMistakes && analysis.commonMistakes.length > 0 && (
        <SectionBlock icon="warning-outline" title="Common Mistakes to Avoid">
          <View style={styles.mistakesList}>
            {analysis.commonMistakes.map((m, i) => (
              <View key={i} style={styles.mistakeRow}>
                <Ionicons name="close-circle" size={15} color={Colors.accent} style={{ marginTop: 2 }} />
                <Text style={styles.mistakeText}>{m}</Text>
              </View>
            ))}
          </View>
        </SectionBlock>
      )}

      {/* Related topics */}
      {analysis.relatedTopics && analysis.relatedTopics.length > 0 && (
        <SectionBlock icon="compass-outline" title="Related Topics">
          <PillList items={analysis.relatedTopics} color={Colors.info} bg={Colors.infoLight} />
        </SectionBlock>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 4 },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  topBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  aiDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  topBarLabel: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary, letterSpacing: 0.4 },
  dismissBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  problemCard: { padding: 14, marginBottom: 16 },
  problemLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textTertiary,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  problemText: { fontSize: 15, fontWeight: '600', color: Colors.text, lineHeight: 22, marginBottom: 10 },
  metaRow: { flexDirection: 'row', gap: 8 },

  answerHero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.successLight,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
  },
  answerHeroIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  answerHeroText: { flex: 1 },
  answerLabel: { fontSize: 11, fontWeight: '700', color: Colors.success, letterSpacing: 0.5, textTransform: 'uppercase' },
  answerValue: { fontSize: 20, fontWeight: '800', color: Colors.text, marginTop: 2 },
  answerExplanation: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 20,
  },

  mistakesList: { gap: 8 },
  mistakeRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  mistakeText: { flex: 1, fontSize: 14, color: Colors.text, lineHeight: 20 },
});
