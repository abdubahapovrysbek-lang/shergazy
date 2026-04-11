import React from 'react';
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
import { PhotoWidget } from '../../components/PhotoWidget';

const { width } = Dimensions.get('window');

const STREAK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const STREAK_ACTIVE = [true, true, true, true, false, false, false];

const RECENT_TOPICS = [
  { id: '1', title: 'Quadratic Equations', subject: 'Algebra', progress: 72, icon: 'calculator', color: Colors.primary },
  { id: '2', title: 'Derivatives', subject: 'Calculus', progress: 45, icon: 'trending-up', color: Colors.accent },
  { id: '3', title: 'Pythagorean Theorem', subject: 'Geometry', progress: 90, icon: 'triangle', color: Colors.success },
];

const QUICK_ACTIONS = [
  { id: '1', label: 'Solve Problem', icon: 'bulb', color: Colors.primary, bg: Colors.primaryLight },
  { id: '2', label: 'Practice Quiz', icon: 'checkmark-done', color: Colors.accent, bg: Colors.accentLight },
  { id: '3', label: 'Study Guide', icon: 'book', color: Colors.success, bg: Colors.successLight },
  { id: '4', label: 'Formulas', icon: 'list', color: Colors.warning, bg: Colors.warningLight },
];

const DAILY_CHALLENGES = [
  {
    id: '1',
    question: 'Simplify: (x² + 5x + 6) / (x + 2)',
    difficulty: 'Medium',
    subject: 'Algebra',
    points: 50,
  },
  {
    id: '2',
    question: 'Find the derivative of f(x) = 3x³ − 2x + 7',
    difficulty: 'Hard',
    subject: 'Calculus',
    points: 80,
  },
];

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.name}>Alex 👋</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={22} color={Colors.text} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        {/* Stats Banner */}
        <Card style={styles.statsBanner} variant="elevated">
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>840</Text>
              <Text style={styles.statLabel}>XP Points</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>34</Text>
              <Text style={styles.statLabel}>Problems</Text>
            </View>
          </View>
          {/* Weekly Streak */}
          <View style={styles.streakRow}>
            {STREAK_DAYS.map((day, i) => (
              <View key={i} style={styles.streakDay}>
                <View style={[styles.streakCircle, STREAK_ACTIVE[i] && styles.streakCircleActive]}>
                  <Ionicons
                    name={STREAK_ACTIVE[i] ? 'flame' : 'flame-outline'}
                    size={14}
                    color={STREAK_ACTIVE[i] ? Colors.white : Colors.textTertiary}
                  />
                </View>
                <Text style={[styles.streakDayLabel, STREAK_ACTIVE[i] && styles.streakDayLabelActive]}>
                  {day}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Quick Actions */}
        <SectionHeader title="Quick Actions" />
        <View style={styles.quickActions}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity key={action.id} style={styles.quickAction} activeOpacity={0.7}>
              <View style={[styles.quickActionIcon, { backgroundColor: action.bg }]}>
                <Ionicons name={action.icon as any} size={22} color={action.color} />
              </View>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Photo Upload Widget */}
        <SectionHeader title="Scan Homework" />
        <PhotoWidget />

        {/* Continue Learning */}
        <SectionHeader title="Continue Learning" actionLabel="See all" />
        {RECENT_TOPICS.map((topic) => (
          <TouchableOpacity key={topic.id} activeOpacity={0.8}>
            <Card style={styles.topicCard}>
              <View style={styles.topicRow}>
                <View style={[styles.topicIcon, { backgroundColor: topic.color + '20' }]}>
                  <Ionicons name={topic.icon as any} size={20} color={topic.color} />
                </View>
                <View style={styles.topicInfo}>
                  <Text style={styles.topicTitle}>{topic.title}</Text>
                  <Badge label={topic.subject} color={topic.color} bgColor={topic.color + '18'} />
                </View>
                <View style={styles.topicRight}>
                  <Text style={[styles.topicPercent, { color: topic.color }]}>{topic.progress}%</Text>
                </View>
              </View>
              <ProgressBar
                progress={topic.progress}
                color={topic.color}
                trackColor={topic.color + '18'}
                style={{ marginTop: 12 }}
              />
            </Card>
          </TouchableOpacity>
        ))}

        {/* Daily Challenges */}
        <SectionHeader title="Daily Challenges" actionLabel="View all" />
        {DAILY_CHALLENGES.map((challenge) => (
          <TouchableOpacity key={challenge.id} activeOpacity={0.8}>
            <Card variant="outlined" style={styles.challengeCard}>
              <View style={styles.challengeTop}>
                <Badge
                  label={challenge.difficulty}
                  color={challenge.difficulty === 'Hard' ? Colors.accent : Colors.warning}
                  bgColor={challenge.difficulty === 'Hard' ? Colors.accentLight : Colors.warningLight}
                />
                <View style={styles.pointsBadge}>
                  <Ionicons name="star" size={12} color={Colors.warning} />
                  <Text style={styles.pointsText}>{challenge.points} pts</Text>
                </View>
              </View>
              <Text style={styles.challengeQuestion}>{challenge.question}</Text>
              <View style={styles.challengeFooter}>
                <Badge label={challenge.subject} />
                <TouchableOpacity style={styles.solveBtn}>
                  <Text style={styles.solveBtnText}>Solve Now</Text>
                  <Ionicons name="arrow-forward" size={14} color={Colors.primary} />
                </TouchableOpacity>
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
    marginBottom: 20,
    paddingTop: 8,
  },
  greeting: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500' },
  name: { fontSize: 24, fontWeight: '700', color: Colors.text },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  notifDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
    borderWidth: 1.5,
    borderColor: Colors.surface,
  },

  statsBanner: {
    marginBottom: 24,
    padding: 20,
    backgroundColor: Colors.primary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '800', color: Colors.white },
  statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2, fontWeight: '500' },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },

  streakRow: { flexDirection: 'row', justifyContent: 'space-between' },
  streakDay: { alignItems: 'center', gap: 4 },
  streakCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakCircleActive: { backgroundColor: Colors.warning },
  streakDayLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: '600' },
  streakDayLabelActive: { color: Colors.white },

  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickAction: { alignItems: 'center', gap: 8, width: (width - 64) / 4 },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  topicCard: { marginBottom: 12 },
  topicRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  topicIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicInfo: { flex: 1, gap: 4 },
  topicTitle: { fontSize: 15, fontWeight: '600', color: Colors.text },
  topicRight: { alignItems: 'flex-end' },
  topicPercent: { fontSize: 16, fontWeight: '700' },

  challengeCard: { marginBottom: 12, padding: 16 },
  challengeTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  pointsBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  pointsText: { fontSize: 13, fontWeight: '700', color: Colors.warning },
  challengeQuestion: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text,
    lineHeight: 22,
    marginBottom: 12,
  },
  challengeFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  solveBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  solveBtnText: { fontSize: 14, fontWeight: '600', color: Colors.primary },
});
