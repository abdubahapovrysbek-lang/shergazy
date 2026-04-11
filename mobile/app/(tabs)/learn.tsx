import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, TextInput, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { COURSES, SUBJECTS, type Course, type Lesson } from '../../data/courses';
import CourseDetail from '../../components/learn/CourseDetail';
import LessonDetail from '../../components/learn/LessonDetail';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 52) / 2;

type View_ = 'catalog' | 'course' | 'lesson';

function LevelBadge({ level }: { level: Course['level'] }) {
  const map: Record<Course['level'], { text: string; bg: string }> = {
    Beginner:     { text: Colors.success,    bg: Colors.successLight },
    Intermediate: { text: Colors.warning,    bg: Colors.warningLight },
    Advanced:     { text: Colors.accent,     bg: Colors.accentLight },
    College:      { text: Colors.primaryDark, bg: Colors.primaryLight },
  };
  const c = map[level];
  return (
    <View style={[lbS.wrap, { backgroundColor: c.bg }]}>
      <Text style={[lbS.text, { color: c.text }]}>{level}</Text>
    </View>
  );
}
const lbS = StyleSheet.create({
  wrap: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12, alignSelf: 'flex-start' },
  text: { fontSize: 11, fontWeight: '700' },
});

function CourseCard({ course, onPress }: { course: Course; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.courseCard, { borderTopColor: course.color }]} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.courseIconBox, { backgroundColor: course.color + '18' }]}>
        <Ionicons name={course.icon as any} size={26} color={course.color} />
      </View>
      <LevelBadge level={course.level} />
      <Text style={styles.courseTitle} numberOfLines={2}>{course.title}</Text>
      <Text style={styles.courseSubject}>{course.subject}</Text>
      <View style={styles.courseMeta}>
        <Ionicons name="play-circle-outline" size={12} color={Colors.textTertiary} />
        <Text style={styles.courseMetaText}>{course.lessons.length} lessons</Text>
        <View style={styles.metaDot} />
        <Ionicons name="time-outline" size={12} color={Colors.textTertiary} />
        <Text style={styles.courseMetaText}>{course.totalDuration}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function LearnScreen() {
  const [view, setView] = useState<View_>('catalog');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [search, setSearch] = useState('');
  const [activeSubject, setActiveSubject] = useState('All');

  const subjectTabs = ['All', ...SUBJECTS];

  const filteredCourses = useMemo(() => {
    return COURSES.filter(c => {
      const matchSubject = activeSubject === 'All' || c.subject === activeSubject;
      const q = search.toLowerCase();
      const matchSearch = q === '' || c.title.toLowerCase().includes(q) || c.subject.toLowerCase().includes(q) || c.level.toLowerCase().includes(q);
      return matchSubject && matchSearch;
    });
  }, [search, activeSubject]);

  if (view === 'lesson' && selectedLesson && selectedCourse) {
    return (
      <LessonDetail
        lesson={selectedLesson}
        courseTitle={selectedCourse.title}
        courseColor={selectedCourse.color}
        onBack={() => setView('course')}
      />
    );
  }

  if (view === 'course' && selectedCourse) {
    return (
      <CourseDetail
        course={selectedCourse}
        onBack={() => setView('catalog')}
        onSelectLesson={(lesson) => { setSelectedLesson(lesson); setView('lesson'); }}
      />
    );
  }

  // ── Catalog ──
  const beginnerCount = COURSES.filter(c => c.level === 'Beginner').length;
  const advancedCount = COURSES.filter(c => c.level === 'Advanced' || c.level === 'College').length;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Learn</Text>
          <Text style={styles.subtitle}>{COURSES.length} courses · {SUBJECTS.length} subjects</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <Ionicons name="search" size={17} color={Colors.textTertiary} style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search courses, subjects, levels…"
          placeholderTextColor={Colors.textTertiary}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={17} color={Colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: Colors.successLight }]}>
            <Text style={[styles.statNum, { color: Colors.success }]}>{beginnerCount}</Text>
            <Text style={[styles.statLabel, { color: Colors.success }]}>Beginner</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: Colors.warningLight }]}>
            <Text style={[styles.statNum, { color: Colors.warning }]}>{COURSES.filter(c => c.level === 'Intermediate').length}</Text>
            <Text style={[styles.statLabel, { color: Colors.warning }]}>Intermediate</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: Colors.accentLight }]}>
            <Text style={[styles.statNum, { color: Colors.accent }]}>{advancedCount}</Text>
            <Text style={[styles.statLabel, { color: Colors.accent }]}>Adv / College</Text>
          </View>
        </View>

        {/* Subject Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
          {subjectTabs.map(s => (
            <TouchableOpacity
              key={s}
              style={[styles.tab, activeSubject === s && styles.tabActive]}
              onPress={() => setActiveSubject(s)}
            >
              <Text style={[styles.tabText, activeSubject === s && styles.tabTextActive]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Results header */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsText}>
            {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
            {activeSubject !== 'All' ? ` in ${activeSubject}` : ''}
          </Text>
        </View>

        {/* Grid */}
        {filteredCourses.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={Colors.border} />
            <Text style={styles.emptyTitle}>No courses found</Text>
            <Text style={styles.emptySubtitle}>Try a different search or subject filter.</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {filteredCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                onPress={() => { setSelectedCourse(course); setView('course'); }}
              />
            ))}
          </View>
        )}
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4 },
  title: { fontSize: 28, fontWeight: '700', color: Colors.text },
  subtitle: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  searchRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surface, marginHorizontal: 20, marginVertical: 12,
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: Colors.border,
  },
  searchInput: { flex: 1, fontSize: 15, color: Colors.text },
  statsRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginBottom: 16 },
  statCard: { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center', gap: 2 },
  statNum: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 11, fontWeight: '600' },
  tabsRow: { paddingHorizontal: 20, gap: 8, paddingBottom: 16 },
  tab: {
    paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
  },
  tabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tabText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  tabTextActive: { color: Colors.white },
  resultsHeader: { paddingHorizontal: 20, marginBottom: 12 },
  resultsText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 12 },
  courseCard: {
    width: CARD_WIDTH, backgroundColor: Colors.surface,
    borderRadius: 14, padding: 14, gap: 8,
    borderTopWidth: 3, borderWidth: 1, borderColor: Colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  courseIconBox: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  courseTitle: { fontSize: 13, fontWeight: '700', color: Colors.text, lineHeight: 18 },
  courseSubject: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  courseMeta: { flexDirection: 'row', alignItems: 'center', gap: 3, flexWrap: 'wrap' },
  courseMetaText: { fontSize: 11, color: Colors.textTertiary },
  metaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: Colors.textTertiary, marginHorizontal: 2 },
  emptyState: { alignItems: 'center', paddingTop: 64, gap: 10, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
  emptySubtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },
});
