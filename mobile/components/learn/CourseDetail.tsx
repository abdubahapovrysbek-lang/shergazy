import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import type { Course, Lesson } from '../../data/courses';

interface Props {
  course: Course;
  onBack: () => void;
  onSelectLesson: (lesson: Lesson) => void;
}

function LevelBadge({ level }: { level: Course['level'] }) {
  const map: Record<Course['level'], { text: string; bg: string }> = {
    Beginner:     { text: Colors.success,   bg: Colors.successLight },
    Intermediate: { text: Colors.warning,   bg: Colors.warningLight },
    Advanced:     { text: Colors.accent,    bg: Colors.accentLight },
    College:      { text: Colors.primaryDark, bg: Colors.primaryLight },
  };
  const c = map[level];
  return (
    <View style={[lb.wrap, { backgroundColor: c.bg }]}>
      <Text style={[lb.text, { color: c.text }]}>{level}</Text>
    </View>
  );
}
const lb = StyleSheet.create({
  wrap: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start' },
  text: { fontSize: 12, fontWeight: '700' },
});

function TypeIcon({ type }: { type: Lesson['type'] }) {
  const map = { theory: 'book-outline', example: 'calculator-outline', practice: 'checkmark-done-outline' };
  return <Ionicons name={map[type] as any} size={14} color={Colors.textTertiary} />;
}

export default function CourseDetail({ course, onBack, onSelectLesson }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle} numberOfLines={1}>{course.title}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: course.color }]}>
          <View style={styles.heroIcon}>
            <Ionicons name={course.icon as any} size={36} color={Colors.white} />
          </View>
          <LevelBadge level={course.level} />
          <Text style={styles.heroTitle}>{course.title}</Text>
          <Text style={styles.heroSubject}>{course.subject}</Text>
          <Text style={styles.heroDesc}>{course.description}</Text>
          <View style={styles.heroStats}>
            <View style={styles.heroStat}>
              <Ionicons name="play-circle-outline" size={15} color="rgba(255,255,255,0.85)" />
              <Text style={styles.heroStatText}>{course.lessons.length} lessons</Text>
            </View>
            <View style={styles.heroStat}>
              <Ionicons name="time-outline" size={15} color="rgba(255,255,255,0.85)" />
              <Text style={styles.heroStatText}>{course.totalDuration}</Text>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          {/* Skills */}
          <Text style={styles.sectionLabel}>SKILLS YOU'LL GAIN</Text>
          <View style={styles.pillRow}>
            {course.skills.map((s, i) => (
              <View key={i} style={[styles.pill, { backgroundColor: course.color + '18' }]}>
                <Text style={[styles.pillText, { color: course.color }]}>{s}</Text>
              </View>
            ))}
          </View>

          {/* Prerequisites */}
          {course.prerequisites.length > 0 && (
            <>
              <Text style={[styles.sectionLabel, { marginTop: 16 }]}>PREREQUISITES</Text>
              <View style={styles.pillRow}>
                {course.prerequisites.map((p, i) => (
                  <View key={i} style={styles.prereqPill}>
                    <Ionicons name="lock-closed-outline" size={12} color={Colors.textSecondary} />
                    <Text style={styles.prereqText}>{p}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Lessons */}
          <Text style={[styles.sectionLabel, { marginTop: 20 }]}>
            LESSONS  ({course.lessons.length})
          </Text>
          {course.lessons.map((lesson, idx) => {
            const done = idx < 2; // first 2 shown as completed for demo
            return (
              <TouchableOpacity
                key={lesson.id}
                style={styles.lessonRow}
                onPress={() => onSelectLesson(lesson)}
                activeOpacity={0.75}
              >
                <View style={[styles.lessonNum, { backgroundColor: done ? course.color : Colors.surfaceSecondary }]}>
                  {done
                    ? <Ionicons name="checkmark" size={14} color={Colors.white} />
                    : <Text style={[styles.lessonNumText, { color: course.color }]}>{idx + 1}</Text>
                  }
                </View>
                <View style={styles.lessonInfo}>
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>
                  <View style={styles.lessonMeta}>
                    <TypeIcon type={lesson.type} />
                    <Text style={styles.lessonMetaText}>{lesson.type}</Text>
                    <View style={styles.dot} />
                    <Ionicons name="time-outline" size={12} color={Colors.textTertiary} />
                    <Text style={styles.lessonMetaText}>{lesson.duration}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  topBar: {
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
  topBarTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: Colors.text },
  hero: { padding: 24, gap: 8 },
  heroIcon: {
    width: 64, height: 64, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  heroTitle: { fontSize: 24, fontWeight: '800', color: Colors.white },
  heroSubject: { fontSize: 13, color: 'rgba(255,255,255,0.75)', fontWeight: '600' },
  heroDesc: { fontSize: 14, color: 'rgba(255,255,255,0.9)', lineHeight: 21, marginTop: 4 },
  heroStats: { flexDirection: 'row', gap: 16, marginTop: 8 },
  heroStat: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  heroStatText: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '500' },
  body: { padding: 20 },
  sectionLabel: {
    fontSize: 11, fontWeight: '700', color: Colors.textTertiary,
    letterSpacing: 0.7, marginBottom: 10,
  },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  pillText: { fontSize: 13, fontWeight: '600' },
  prereqPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    backgroundColor: Colors.surfaceSecondary, borderWidth: 1, borderColor: Colors.border,
  },
  prereqText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  lessonRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.surface, borderRadius: 12,
    padding: 14, marginBottom: 8,
    borderWidth: 1, borderColor: Colors.border,
  },
  lessonNum: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  lessonNumText: { fontSize: 13, fontWeight: '700' },
  lessonInfo: { flex: 1 },
  lessonTitle: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 4 },
  lessonMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  lessonMetaText: { fontSize: 12, color: Colors.textTertiary },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: Colors.textTertiary, marginHorizontal: 2 },
});
