import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import type { Lesson } from '../../data/courses';

interface Props {
  lesson: Lesson;
  courseTitle: string;
  courseColor: string;
  onBack: () => void;
}

function TypeBadge({ type, color }: { type: Lesson['type']; color: string }) {
  const label = type === 'theory' ? 'Theory' : type === 'example' ? 'Example' : 'Practice';
  const icon = type === 'theory' ? 'book-outline' : type === 'example' ? 'calculator-outline' : 'checkmark-done-outline';
  return (
    <View style={[badgeStyles.wrap, { backgroundColor: color + '22' }]}>
      <Ionicons name={icon as any} size={12} color={color} />
      <Text style={[badgeStyles.text, { color }]}>{label}</Text>
    </View>
  );
}
const badgeStyles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start' },
  text: { fontSize: 12, fontWeight: '700' },
});

function SectionTitle({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={sectionStyles.row}>
      <Ionicons name={icon as any} size={16} color={Colors.primary} />
      <Text style={sectionStyles.text}>{label}</Text>
    </View>
  );
}
const sectionStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 12, marginTop: 4 },
  text: { fontSize: 15, fontWeight: '700', color: Colors.text },
});

export default function LessonDetail({ lesson, courseTitle, courseColor, onBack }: Props) {
  const [expandedExample, setExpandedExample] = useState<number | null>(0);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.courseLabel} numberOfLines={1}>{courseTitle}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: courseColor }]}>
          <TypeBadge type={lesson.type} color={Colors.white} />
          <Text style={styles.heroTitle}>{lesson.title}</Text>
          <View style={styles.heroDuration}>
            <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.8)" />
            <Text style={styles.heroDurationText}>{lesson.duration}</Text>
          </View>
        </View>

        <View style={styles.body}>
          {/* Overview */}
          <SectionTitle icon="information-circle-outline" label="Overview" />
          <Text style={styles.overview}>{lesson.content.overview}</Text>

          {/* Key Formulas */}
          {lesson.content.keyFormulas && lesson.content.keyFormulas.length > 0 && (
            <View style={styles.section}>
              <SectionTitle icon="calculator-outline" label="Key Formulas" />
              {lesson.content.keyFormulas.map((f, i) => (
                <View key={i} style={styles.formulaCard}>
                  <Text style={styles.formulaName}>{f.name}</Text>
                  <View style={styles.formulaBox}>
                    <Text style={styles.formulaText}>{f.formula}</Text>
                  </View>
                  <Text style={styles.formulaDesc}>{f.description}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Worked Examples */}
          {lesson.content.workedExamples && lesson.content.workedExamples.length > 0 && (
            <View style={styles.section}>
              <SectionTitle icon="flask-outline" label="Worked Examples" />
              {lesson.content.workedExamples.map((ex, i) => (
                <View key={i} style={styles.exampleCard}>
                  <TouchableOpacity
                    style={styles.exampleHeader}
                    onPress={() => setExpandedExample(expandedExample === i ? null : i)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.exampleNumBadge}>
                      <Text style={styles.exampleNum}>Q{i + 1}</Text>
                    </View>
                    <Text style={styles.exampleProblem}>{ex.problem}</Text>
                    <Ionicons
                      name={expandedExample === i ? 'chevron-up' : 'chevron-down'}
                      size={16} color={Colors.textTertiary}
                    />
                  </TouchableOpacity>
                  {expandedExample === i && (
                    <View style={styles.exampleBody}>
                      <Text style={styles.stepsLabel}>Solution Steps</Text>
                      {ex.steps.map((step, si) => (
                        <View key={si} style={styles.stepRow}>
                          <View style={styles.stepCircle}>
                            <Text style={styles.stepNum}>{si + 1}</Text>
                          </View>
                          <Text style={styles.stepText}>{step}</Text>
                        </View>
                      ))}
                      <View style={styles.answerRow}>
                        <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
                        <Text style={styles.answerText}>Answer: {ex.answer}</Text>
                      </View>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Key Points */}
          {lesson.content.keyPoints.length > 0 && (
            <View style={styles.section}>
              <SectionTitle icon="list-outline" label="Key Points" />
              {lesson.content.keyPoints.map((pt, i) => (
                <View key={i} style={styles.keyPointRow}>
                  <Ionicons name="checkmark-circle" size={16} color={Colors.primary} style={{ marginTop: 2 }} />
                  <Text style={styles.keyPointText}>{pt}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Pro Tips */}
          {lesson.content.proTips && lesson.content.proTips.length > 0 && (
            <View style={styles.section}>
              <SectionTitle icon="bulb-outline" label="Pro Tips" />
              {lesson.content.proTips.map((tip, i) => (
                <View key={i} style={styles.tipCard}>
                  <Ionicons name="bulb" size={16} color={Colors.warning} />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={{ height: 32 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center', justifyContent: 'center',
  },
  courseLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  hero: { padding: 24, paddingTop: 20, gap: 10 },
  heroTitle: { fontSize: 22, fontWeight: '800', color: Colors.white, lineHeight: 30 },
  heroDuration: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  heroDurationText: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
  body: { padding: 20 },
  overview: { fontSize: 15, color: Colors.text, lineHeight: 24, marginBottom: 24 },
  section: { marginBottom: 24 },
  formulaCard: {
    borderRadius: 12, borderWidth: 1, borderColor: Colors.border,
    backgroundColor: Colors.surface, padding: 14, marginBottom: 10,
  },
  formulaName: { fontSize: 13, fontWeight: '700', color: Colors.text, marginBottom: 8 },
  formulaBox: {
    backgroundColor: Colors.primaryLight, borderRadius: 8,
    padding: 10, marginBottom: 8,
  },
  formulaText: { fontSize: 15, fontWeight: '700', color: Colors.primaryDark, fontFamily: 'monospace' as any },
  formulaDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  exampleCard: {
    borderRadius: 12, borderWidth: 1, borderColor: Colors.border,
    backgroundColor: Colors.surface, marginBottom: 10, overflow: 'hidden',
  },
  exampleHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 14 },
  exampleNumBadge: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  exampleNum: { fontSize: 11, fontWeight: '800', color: Colors.white },
  exampleProblem: { flex: 1, fontSize: 14, fontWeight: '600', color: Colors.text, lineHeight: 20 },
  exampleBody: { padding: 14, paddingTop: 0, borderTopWidth: 1, borderTopColor: Colors.borderLight },
  stepsLabel: { fontSize: 11, fontWeight: '700', color: Colors.textTertiary, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 10, marginTop: 4 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  stepCircle: {
    width: 22, height: 22, borderRadius: 11, backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
  },
  stepNum: { fontSize: 11, fontWeight: '700', color: Colors.primary },
  stepText: { flex: 1, fontSize: 14, color: Colors.text, lineHeight: 20 },
  answerRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.successLight, borderRadius: 10, padding: 10, marginTop: 4,
  },
  answerText: { fontSize: 14, fontWeight: '700', color: Colors.success },
  keyPointRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8 },
  keyPointText: { flex: 1, fontSize: 14, color: Colors.text, lineHeight: 21 },
  tipCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: Colors.warningLight, borderRadius: 10, padding: 12, marginBottom: 8,
  },
  tipText: { flex: 1, fontSize: 13, color: Colors.text, lineHeight: 19 },
});
