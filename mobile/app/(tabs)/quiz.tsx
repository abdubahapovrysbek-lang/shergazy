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

const QUIZ_CATEGORIES = [
  { id: '1', label: 'Algebra', icon: 'calculator', color: Colors.primary, count: 40 },
  { id: '2', label: 'Calculus', icon: 'trending-up', color: Colors.accent, count: 28 },
  { id: '3', label: 'Geometry', icon: 'triangle', color: Colors.success, count: 35 },
  { id: '4', label: 'Statistics', icon: 'bar-chart', color: Colors.info, count: 22 },
  { id: '5', label: 'Trig', icon: 'git-branch', color: Colors.warning, count: 30 },
  { id: '6', label: 'Mixed', icon: 'shuffle', color: Colors.textSecondary, count: 50 },
];

const ACTIVE_QUIZ = {
  title: 'Algebra — Chapter 3 Quiz',
  total: 10,
  completed: 4,
  timeLeft: '8:42',
  currentQuestion: {
    number: 5,
    question: 'Which of the following is the factored form of x² − 9?',
    options: ['(x − 3)²', '(x + 3)(x − 3)', '(x − 9)(x + 1)', '(x + 9)(x − 1)'],
    correct: 1,
  },
};

const PAST_RESULTS = [
  {
    id: '1',
    title: 'Algebra — Chapter 2',
    score: 85,
    total: 10,
    correct: 8,
    date: '2 days ago',
    subject: 'Algebra',
    color: Colors.primary,
  },
  {
    id: '2',
    title: 'Geometry Basics',
    score: 70,
    total: 10,
    correct: 7,
    date: '4 days ago',
    subject: 'Geometry',
    color: Colors.success,
  },
  {
    id: '3',
    title: 'Intro to Statistics',
    score: 100,
    total: 8,
    correct: 8,
    date: '1 week ago',
    subject: 'Statistics',
    color: Colors.info,
  },
];

function scoreColor(score: number) {
  if (score >= 90) return Colors.success;
  if (score >= 70) return Colors.warning;
  return Colors.accent;
}

export default function QuizScreen() {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Quiz</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="trophy-outline" size={20} color={Colors.warning} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Active Quiz Card */}
        <Card variant="elevated" style={styles.activeQuizCard}>
          <View style={styles.activeQuizHeader}>
            <View>
              <Text style={styles.activeQuizLabel}>In Progress</Text>
              <Text style={styles.activeQuizTitle}>{ACTIVE_QUIZ.title}</Text>
            </View>
            <View style={styles.timerBadge}>
              <Ionicons name="time" size={14} color={Colors.accent} />
              <Text style={styles.timerText}>{ACTIVE_QUIZ.timeLeft}</Text>
            </View>
          </View>

          <ProgressBar
            progress={(ACTIVE_QUIZ.completed / ACTIVE_QUIZ.total) * 100}
            style={{ marginVertical: 14 }}
          />
          <Text style={styles.progressText}>
            Question {ACTIVE_QUIZ.completed + 1} of {ACTIVE_QUIZ.total}
          </Text>

          {/* Current Question */}
          <View style={styles.questionBox}>
            <Text style={styles.questionNum}>Q{ACTIVE_QUIZ.currentQuestion.number}</Text>
            <Text style={styles.questionText}>{ACTIVE_QUIZ.currentQuestion.question}</Text>
          </View>

          {/* Answer Options */}
          {ACTIVE_QUIZ.currentQuestion.options.map((opt, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.optionBtn,
                selectedAnswer === i && styles.optionBtnSelected,
              ]}
              onPress={() => setSelectedAnswer(i)}
              activeOpacity={0.7}
            >
              <View style={[styles.optionCircle, selectedAnswer === i && styles.optionCircleSelected]}>
                <Text style={[styles.optionLetter, selectedAnswer === i && styles.optionLetterSelected]}>
                  {String.fromCharCode(65 + i)}
                </Text>
              </View>
              <Text style={[styles.optionText, selectedAnswer === i && styles.optionTextSelected]}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[styles.submitBtn, selectedAnswer === null && styles.submitBtnDisabled]}
            disabled={selectedAnswer === null}
          >
            <Text style={styles.submitBtnText}>Submit Answer</Text>
            <Ionicons name="arrow-forward" size={16} color={Colors.white} />
          </TouchableOpacity>
        </Card>

        {/* Quiz Categories */}
        <SectionHeader title="Start a New Quiz" />
        <View style={styles.categoriesGrid}>
          {QUIZ_CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat.id} activeOpacity={0.8} style={styles.categoryWrapper}>
              <Card style={[styles.categoryCard, { borderTopColor: cat.color, borderTopWidth: 3 }]}>
                <View style={[styles.categoryIcon, { backgroundColor: cat.color + '18' }]}>
                  <Ionicons name={cat.icon as any} size={22} color={cat.color} />
                </View>
                <Text style={styles.categoryLabel}>{cat.label}</Text>
                <Text style={styles.categoryCount}>{cat.count} questions</Text>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Past Results */}
        <SectionHeader title="Past Results" actionLabel="History" />
        {PAST_RESULTS.map((result) => {
          const sc = scoreColor(result.score);
          return (
            <TouchableOpacity key={result.id} activeOpacity={0.8}>
              <Card variant="outlined" style={styles.resultCard}>
                <View style={styles.resultLeft}>
                  <View style={[styles.resultScore, { borderColor: sc }]}>
                    <Text style={[styles.resultScoreText, { color: sc }]}>{result.score}%</Text>
                  </View>
                </View>
                <View style={styles.resultInfo}>
                  <Text style={styles.resultTitle}>{result.title}</Text>
                  <View style={styles.resultMeta}>
                    <Badge
                      label={result.subject}
                      color={result.color}
                      bgColor={result.color + '18'}
                    />
                    <Text style={styles.resultDate}>{result.date}</Text>
                  </View>
                  <Text style={styles.resultDetails}>
                    {result.correct}/{result.total} correct
                  </Text>
                </View>
                <TouchableOpacity>
                  <Ionicons name="refresh" size={18} color={Colors.primary} />
                </TouchableOpacity>
              </Card>
            </TouchableOpacity>
          );
        })}

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
  headerRight: { flexDirection: 'row', gap: 8 },
  iconBtn: {
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

  activeQuizCard: { marginBottom: 24, padding: 20 },
  activeQuizHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  activeQuizLabel: { fontSize: 12, color: Colors.primary, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' },
  activeQuizTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginTop: 2 },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  timerText: { fontSize: 14, fontWeight: '700', color: Colors.accent },
  progressText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500', marginBottom: 12 },

  questionBox: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  questionNum: { fontSize: 11, color: Colors.primary, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 },
  questionText: { fontSize: 15, fontWeight: '600', color: Colors.text, lineHeight: 22 },

  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: 8,
    backgroundColor: Colors.surface,
  },
  optionBtnSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  optionCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  optionCircleSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  optionLetter: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary },
  optionLetterSelected: { color: Colors.white },
  optionText: { fontSize: 14, color: Colors.text, flex: 1 },
  optionTextSelected: { color: Colors.primary, fontWeight: '600' },

  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 6,
  },
  submitBtnDisabled: { backgroundColor: Colors.border },
  submitBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },

  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  categoryWrapper: { width: (width - 52) / 3 },
  categoryCard: { padding: 12, alignItems: 'center', gap: 6 },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: { fontSize: 13, fontWeight: '700', color: Colors.text },
  categoryCount: { fontSize: 11, color: Colors.textTertiary, textAlign: 'center' },

  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 10,
    padding: 14,
  },
  resultLeft: { alignItems: 'center' },
  resultScore: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultScoreText: { fontSize: 14, fontWeight: '800' },
  resultInfo: { flex: 1, gap: 4 },
  resultTitle: { fontSize: 14, fontWeight: '600', color: Colors.text },
  resultMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  resultDate: { fontSize: 12, color: Colors.textTertiary },
  resultDetails: { fontSize: 12, color: Colors.textSecondary },
});
