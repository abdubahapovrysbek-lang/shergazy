import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { ProgressBar } from '../../components/ProgressBar';
import { SectionHeader } from '../../components/SectionHeader';

const { width } = Dimensions.get('window');

const SUBJECT_TABS = ['All', 'Algebra', 'Calculus', 'Geometry', 'Statistics', 'Trig'];

const FEATURED_COURSE = {
  title: 'Mastering Calculus',
  subtitle: 'From limits to integration',
  lessons: 24,
  duration: '8 hrs',
  progress: 38,
  color: Colors.accent,
  icon: 'trending-up',
};

const COURSES = [
  {
    id: '1',
    title: 'Algebra Fundamentals',
    subject: 'Algebra',
    lessons: 18,
    duration: '5 hrs',
    progress: 72,
    icon: 'calculator',
    color: Colors.primary,
    level: 'Beginner',
  },
  {
    id: '2',
    title: 'Differential Calculus',
    subject: 'Calculus',
    lessons: 22,
    duration: '7 hrs',
    progress: 45,
    icon: 'trending-up',
    color: Colors.accent,
    level: 'Advanced',
  },
  {
    id: '3',
    title: 'Euclidean Geometry',
    subject: 'Geometry',
    lessons: 15,
    duration: '4 hrs',
    progress: 90,
    icon: 'triangle',
    color: Colors.success,
    level: 'Intermediate',
  },
  {
    id: '4',
    title: 'Descriptive Statistics',
    subject: 'Statistics',
    lessons: 12,
    duration: '3.5 hrs',
    progress: 0,
    icon: 'bar-chart',
    color: Colors.info,
    level: 'Beginner',
  },
  {
    id: '5',
    title: 'Trigonometry Essentials',
    subject: 'Trig',
    lessons: 16,
    duration: '5 hrs',
    progress: 20,
    icon: 'git-branch',
    color: Colors.warning,
    level: 'Intermediate',
  },
];

const RECENT_LESSONS = [
  {
    id: '1',
    title: 'The Chain Rule',
    course: 'Differential Calculus',
    duration: '12 min',
    completed: true,
    color: Colors.accent,
  },
  {
    id: '2',
    title: 'Factoring Polynomials',
    course: 'Algebra Fundamentals',
    duration: '18 min',
    completed: true,
    color: Colors.primary,
  },
  {
    id: '3',
    title: 'Angle Bisectors',
    course: 'Euclidean Geometry',
    duration: '10 min',
    completed: false,
    color: Colors.success,
  },
];

export default function LearnScreen() {
  const [activeSubject, setActiveSubject] = useState('All');

  const filteredCourses = COURSES.filter(
    (c) => activeSubject === 'All' || c.subject === activeSubject
  );

  const levelColor = (level: string) => {
    if (level === 'Beginner') return { text: Colors.success, bg: Colors.successLight };
    if (level === 'Intermediate') return { text: Colors.warning, bg: Colors.warningLight };
    return { text: Colors.accent, bg: Colors.accentLight };
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Learn</Text>
          <TouchableOpacity style={styles.searchBtn}>
            <Ionicons name="search-outline" size={20} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {/* Featured Course Banner */}
        <TouchableOpacity activeOpacity={0.9}>
          <View style={[styles.featuredCard, { backgroundColor: FEATURED_COURSE.color }]}>
            <Badge label="Featured Course" color={Colors.white} bgColor="rgba(255,255,255,0.25)" />
            <Text style={styles.featuredTitle}>{FEATURED_COURSE.title}</Text>
            <Text style={styles.featuredSubtitle}>{FEATURED_COURSE.subtitle}</Text>
            <View style={styles.featuredStats}>
              <View style={styles.featuredStat}>
                <Ionicons name="play-circle-outline" size={16} color="rgba(255,255,255,0.85)" />
                <Text style={styles.featuredStatText}>{FEATURED_COURSE.lessons} lessons</Text>
              </View>
              <View style={styles.featuredStat}>
                <Ionicons name="time-outline" size={16} color="rgba(255,255,255,0.85)" />
                <Text style={styles.featuredStatText}>{FEATURED_COURSE.duration}</Text>
              </View>
            </View>
            <View style={styles.featuredProgressRow}>
              <ProgressBar
                progress={FEATURED_COURSE.progress}
                color={Colors.white}
                trackColor="rgba(255,255,255,0.25)"
                height={6}
                style={{ flex: 1 }}
              />
              <Text style={styles.featuredProgressText}>{FEATURED_COURSE.progress}%</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Subject Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.subjectRow}
        >
          {SUBJECT_TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.subjectTab, activeSubject === tab && styles.subjectTabActive]}
              onPress={() => setActiveSubject(tab)}
            >
              <Text style={[styles.subjectLabel, activeSubject === tab && styles.subjectLabelActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Courses Grid */}
        <SectionHeader title="Courses" actionLabel="See all" />
        <View style={styles.coursesGrid}>
          {filteredCourses.map((course) => {
            const lc = levelColor(course.level);
            return (
              <TouchableOpacity key={course.id} activeOpacity={0.8} style={styles.courseCardWrapper}>
                <Card style={styles.courseCard}>
                  <View style={[styles.courseIcon, { backgroundColor: course.color + '18' }]}>
                    <Ionicons name={course.icon as any} size={24} color={course.color} />
                  </View>
                  <Badge label={course.level} color={lc.text} bgColor={lc.bg} style={{ marginTop: 10 }} />
                  <Text style={styles.courseTitle} numberOfLines={2}>{course.title}</Text>
                  <View style={styles.courseMeta}>
                    <Ionicons name="play-circle-outline" size={13} color={Colors.textTertiary} />
                    <Text style={styles.courseMetaText}>{course.lessons} lessons</Text>
                  </View>
                  {course.progress > 0 ? (
                    <>
                      <ProgressBar
                        progress={course.progress}
                        color={course.color}
                        trackColor={course.color + '18'}
                        height={5}
                        style={{ marginTop: 10 }}
                      />
                      <Text style={[styles.courseProgress, { color: course.color }]}>
                        {course.progress}% complete
                      </Text>
                    </>
                  ) : (
                    <TouchableOpacity style={[styles.startBtn, { backgroundColor: course.color }]}>
                      <Text style={styles.startBtnText}>Start</Text>
                    </TouchableOpacity>
                  )}
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Recent Lessons */}
        <SectionHeader title="Recently Viewed" />
        {RECENT_LESSONS.map((lesson) => (
          <TouchableOpacity key={lesson.id} activeOpacity={0.8}>
            <Card style={styles.lessonCard} variant="outlined">
              <View style={[styles.lessonPlay, { backgroundColor: lesson.color + '18' }]}>
                <Ionicons
                  name={lesson.completed ? 'checkmark-circle' : 'play-circle'}
                  size={28}
                  color={lesson.completed ? Colors.success : lesson.color}
                />
              </View>
              <View style={styles.lessonInfo}>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                <Text style={styles.lessonCourse}>{lesson.course}</Text>
              </View>
              <View style={styles.lessonRight}>
                <Ionicons name="time-outline" size={13} color={Colors.textTertiary} />
                <Text style={styles.lessonDuration}>{lesson.duration}</Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 8 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    marginBottom: 16,
  },
  title: { fontSize: 28, fontWeight: '700', color: Colors.text },
  searchBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },

  featuredCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  featuredTitle: { fontSize: 22, fontWeight: '800', color: Colors.white, marginTop: 10 },
  featuredSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4, marginBottom: 12 },
  featuredStats: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  featuredStat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  featuredStatText: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '500' },
  featuredProgressRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featuredProgressText: { fontSize: 13, fontWeight: '700', color: Colors.white },

  subjectRow: { paddingBottom: 16, gap: 8 },
  subjectTab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  subjectTabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  subjectLabel: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  subjectLabelActive: { color: Colors.white },

  coursesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  courseCardWrapper: { width: (width - 52) / 2 },
  courseCard: { padding: 14 },
  courseIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  courseMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  courseMetaText: { fontSize: 12, color: Colors.textTertiary },
  courseProgress: { fontSize: 11, fontWeight: '600', marginTop: 4 },
  startBtn: {
    marginTop: 10,
    paddingVertical: 7,
    borderRadius: 10,
    alignItems: 'center',
  },
  startBtnText: { fontSize: 13, fontWeight: '700', color: Colors.white },

  lessonCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, padding: 14, gap: 12 },
  lessonPlay: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonInfo: { flex: 1 },
  lessonTitle: { fontSize: 14, fontWeight: '600', color: Colors.text },
  lessonCourse: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  lessonRight: { alignItems: 'center', gap: 2 },
  lessonDuration: { fontSize: 11, color: Colors.textTertiary, fontWeight: '500' },
});
