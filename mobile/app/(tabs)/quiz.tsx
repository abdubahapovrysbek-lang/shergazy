import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Dimensions, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { QUIZZES, QUIZ_SUBJECTS, type Quiz, type QuizQuestion } from '../../data/quizzes';

const { width } = Dimensions.get('window');

// ─── Helpers ──────────────────────────────────────────────────────────────────

type QuizView = 'catalog' | 'active' | 'results';

function diffColor(d: Quiz['difficulty']) {
  const m = { Easy: Colors.success, Medium: Colors.warning, Hard: Colors.accent, Advanced: Colors.primaryDark };
  return m[d];
}
function diffBg(d: Quiz['difficulty']) {
  const m = { Easy: Colors.successLight, Medium: Colors.warningLight, Hard: Colors.accentLight, Advanced: Colors.primaryLight };
  return m[d];
}

// ─── Quiz Catalog Card ────────────────────────────────────────────────────────

function QuizCard({ quiz, onStart }: { quiz: Quiz; onStart: () => void }) {
  return (
    <TouchableOpacity style={[styles.quizCard, { borderLeftColor: quiz.color, borderLeftWidth: 4 }]} onPress={onStart} activeOpacity={0.8}>
      <View style={styles.quizCardTop}>
        <View style={[styles.quizIconBox, { backgroundColor: quiz.color + '18' }]}>
          <Ionicons name={quiz.icon as any} size={22} color={quiz.color} />
        </View>
        <View style={[styles.diffBadge, { backgroundColor: diffBg(quiz.difficulty) }]}>
          <Text style={[styles.diffText, { color: diffColor(quiz.difficulty) }]}>{quiz.difficulty}</Text>
        </View>
      </View>
      <Text style={styles.quizTitle}>{quiz.title}</Text>
      <Text style={styles.quizDesc} numberOfLines={2}>{quiz.description}</Text>
      <View style={styles.quizMeta}>
        <Ionicons name="help-circle-outline" size={13} color={Colors.textTertiary} />
        <Text style={styles.quizMetaText}>{quiz.questions.length} questions</Text>
        <View style={styles.metaDot} />
        <Ionicons name="book-outline" size={13} color={Colors.textTertiary} />
        <Text style={styles.quizMetaText}>{quiz.subject}</Text>
      </View>
      <View style={styles.startRow}>
        <Text style={[styles.startText, { color: quiz.color }]}>Start Quiz</Text>
        <Ionicons name="arrow-forward-circle" size={18} color={quiz.color} />
      </View>
    </TouchableOpacity>
  );
}

// ─── Active Quiz ──────────────────────────────────────────────────────────────

function ActiveQuiz({
  quiz,
  onFinish,
  onExit,
}: {
  quiz: Quiz;
  onFinish: (answers: (number | null)[]) => void;
  onExit: () => void;
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(quiz.questions.length).fill(null));
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;

  const question: QuizQuestion = quiz.questions[currentIdx];
  const total = quiz.questions.length;
  const isLast = currentIdx === total - 1;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: (currentIdx + 1) / total,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentIdx]);

  function handleSelect(idx: number) {
    if (confirmed) return;
    setSelected(idx);
  }

  function handleConfirm() {
    if (selected === null) return;
    const updated = [...answers];
    updated[currentIdx] = selected;
    setAnswers(updated);
    setConfirmed(true);
  }

  function handleNext() {
    if (isLast) {
      const updated = [...answers];
      if (updated[currentIdx] === null) updated[currentIdx] = selected;
      onFinish(updated);
    } else {
      setCurrentIdx(i => i + 1);
      setSelected(null);
      setConfirmed(false);
    }
  }

  const optionBg = (i: number) => {
    if (!confirmed) return selected === i ? Colors.primaryLight : Colors.surface;
    if (i === question.correctIndex) return Colors.successLight;
    if (i === selected && selected !== question.correctIndex) return Colors.accentLight;
    return Colors.surface;
  };
  const optionBorder = (i: number) => {
    if (!confirmed) return selected === i ? Colors.primary : Colors.border;
    if (i === question.correctIndex) return Colors.success;
    if (i === selected && selected !== question.correctIndex) return Colors.accent;
    return Colors.border;
  };
  const optionIcon = (i: number) => {
    if (!confirmed) return null;
    if (i === question.correctIndex) return <Ionicons name="checkmark-circle" size={18} color={Colors.success} />;
    if (i === selected && selected !== question.correctIndex) return <Ionicons name="close-circle" size={18} color={Colors.accent} />;
    return null;
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.activeHeader}>
        <TouchableOpacity style={styles.exitBtn} onPress={onExit}>
          <Ionicons name="close" size={20} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.activeHeaderCenter}>
          <Text style={styles.activeSubject}>{quiz.subject}</Text>
          <Text style={styles.activeCounter}>{currentIdx + 1} / {total}</Text>
        </View>
        <View style={[styles.diffBadge, { backgroundColor: diffBg(quiz.difficulty) }]}>
          <Text style={[styles.diffText, { color: diffColor(quiz.difficulty) }]}>{quiz.difficulty}</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <Animated.View
          style={[styles.progressFill, {
            backgroundColor: quiz.color,
            width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
          }]}
        />
      </View>

      <ScrollView contentContainerStyle={styles.activeBody} showsVerticalScrollIndicator={false}>
        {/* Question */}
        <View style={[styles.questionCard, { borderTopColor: quiz.color }]}>
          <View style={[styles.qNumBadge, { backgroundColor: quiz.color }]}>
            <Text style={styles.qNumText}>Q{currentIdx + 1}</Text>
          </View>
          <Text style={styles.questionText}>{question.question}</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {question.options.map((opt, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.option, { backgroundColor: optionBg(i), borderColor: optionBorder(i) }]}
              onPress={() => handleSelect(i)}
              activeOpacity={0.75}
              disabled={confirmed}
            >
              <View style={[styles.optionLetter, { backgroundColor: optionBorder(i) + '22', borderColor: optionBorder(i) }]}>
                <Text style={[styles.optionLetterText, { color: optionBorder(i) }]}>
                  {String.fromCharCode(65 + i)}
                </Text>
              </View>
              <Text style={[styles.optionText, confirmed && i === question.correctIndex && { color: Colors.success, fontWeight: '700' }]}>
                {opt}
              </Text>
              <View style={{ marginLeft: 'auto' }}>{optionIcon(i)}</View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Explanation (shown after confirming) */}
        {confirmed && (
          <View style={[styles.explanationCard, { borderLeftColor: selected === question.correctIndex ? Colors.success : Colors.accent }]}>
            <View style={styles.explanationHeader}>
              <Ionicons
                name={selected === question.correctIndex ? 'checkmark-circle' : 'information-circle'}
                size={18}
                color={selected === question.correctIndex ? Colors.success : Colors.accent}
              />
              <Text style={[styles.explanationTitle, { color: selected === question.correctIndex ? Colors.success : Colors.accent }]}>
                {selected === question.correctIndex ? 'Correct!' : 'Not quite — here\'s why:'}
              </Text>
            </View>
            <Text style={styles.explanationText}>{question.explanation}</Text>
          </View>
        )}

        {/* Action button */}
        {!confirmed ? (
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: selected !== null ? quiz.color : Colors.border }]}
            onPress={handleConfirm}
            disabled={selected === null}
          >
            <Text style={styles.actionBtnText}>Confirm Answer</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: quiz.color }]} onPress={handleNext}>
            <Text style={styles.actionBtnText}>{isLast ? 'See Results' : 'Next Question'}</Text>
            <Ionicons name={isLast ? 'trophy-outline' : 'arrow-forward'} size={18} color={Colors.white} />
          </TouchableOpacity>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Results Screen ───────────────────────────────────────────────────────────

function ResultsScreen({
  quiz,
  answers,
  onRetry,
  onBack,
}: {
  quiz: Quiz;
  answers: (number | null)[];
  onRetry: () => void;
  onBack: () => void;
}) {
  const correct = answers.filter((a, i) => a === quiz.questions[i].correctIndex).length;
  const total = quiz.questions.length;
  const score = Math.round((correct / total) * 100);

  const scoreColor = score >= 80 ? Colors.success : score >= 60 ? Colors.warning : Colors.accent;
  const scoreBg = score >= 80 ? Colors.successLight : score >= 60 ? Colors.warningLight : Colors.accentLight;
  const scoreLabel = score >= 90 ? 'Excellent!' : score >= 75 ? 'Great job!' : score >= 60 ? 'Good effort!' : 'Keep practising!';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.resultsHeader}>
        <TouchableOpacity style={styles.exitBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.resultsHeaderTitle}>Results</Text>
        <TouchableOpacity style={[styles.retryBtn, { backgroundColor: quiz.color + '18' }]} onPress={onRetry}>
          <Ionicons name="refresh" size={16} color={quiz.color} />
          <Text style={[styles.retryText, { color: quiz.color }]}>Retry</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.resultsBody} showsVerticalScrollIndicator={false}>
        {/* Score hero */}
        <View style={[styles.scoreHero, { backgroundColor: scoreBg }]}>
          <Text style={[styles.scoreNum, { color: scoreColor }]}>{score}%</Text>
          <Text style={[styles.scoreLabel, { color: scoreColor }]}>{scoreLabel}</Text>
          <Text style={styles.scoreDetail}>{correct} of {total} correct</Text>
          <View style={styles.scoreStatsRow}>
            <View style={styles.scoreStat}>
              <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
              <Text style={styles.scoreStatText}>{correct} Correct</Text>
            </View>
            <View style={styles.scoreStat}>
              <Ionicons name="close-circle" size={18} color={Colors.accent} />
              <Text style={styles.scoreStatText}>{total - correct} Wrong</Text>
            </View>
            <View style={styles.scoreStat}>
              <Ionicons name="book-outline" size={18} color={Colors.info} />
              <Text style={styles.scoreStatText}>{quiz.subject}</Text>
            </View>
          </View>
        </View>

        {/* Question review */}
        <Text style={styles.reviewTitle}>Answer Review</Text>
        {quiz.questions.map((q, i) => {
          const userAnswer = answers[i];
          const isCorrect = userAnswer === q.correctIndex;
          return (
            <View key={q.id} style={[styles.reviewCard, { borderLeftColor: isCorrect ? Colors.success : Colors.accent }]}>
              {/* Question row */}
              <View style={styles.reviewTop}>
                <View style={[styles.reviewNum, { backgroundColor: isCorrect ? Colors.successLight : Colors.accentLight }]}>
                  <Text style={[styles.reviewNumText, { color: isCorrect ? Colors.success : Colors.accent }]}>{i + 1}</Text>
                </View>
                <Text style={styles.reviewQuestion}>{q.question}</Text>
                <Ionicons
                  name={isCorrect ? 'checkmark-circle' : 'close-circle'}
                  size={20}
                  color={isCorrect ? Colors.success : Colors.accent}
                  style={{ flexShrink: 0 }}
                />
              </View>

              {/* User answer */}
              {!isCorrect && userAnswer !== null && (
                <View style={styles.reviewAnswerRow}>
                  <Text style={styles.reviewAnswerLabel}>Your answer: </Text>
                  <Text style={[styles.reviewAnswerVal, { color: Colors.accent }]}>{q.options[userAnswer]}</Text>
                </View>
              )}

              {/* Correct answer */}
              <View style={styles.reviewAnswerRow}>
                <Text style={styles.reviewAnswerLabel}>Correct answer: </Text>
                <Text style={[styles.reviewAnswerVal, { color: Colors.success }]}>{q.options[q.correctIndex]}</Text>
              </View>

              {/* Explanation */}
              <View style={styles.reviewExplBox}>
                <Ionicons name="bulb-outline" size={14} color={Colors.warning} style={{ marginTop: 1 }} />
                <Text style={styles.reviewExplText}>{q.explanation}</Text>
              </View>
            </View>
          );
        })}

        {/* Bottom CTA */}
        <View style={styles.resultsCTARow}>
          <TouchableOpacity style={[styles.ctaBtn, { backgroundColor: quiz.color }]} onPress={onRetry}>
            <Ionicons name="refresh" size={18} color={Colors.white} />
            <Text style={styles.ctaBtnText}>Retry Quiz</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.ctaBtn, styles.ctaBtnOutline]} onPress={onBack}>
            <Ionicons name="grid-outline" size={18} color={Colors.primary} />
            <Text style={[styles.ctaBtnText, { color: Colors.primary }]}>All Quizzes</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Main Screen (Catalog) ────────────────────────────────────────────────────

export default function QuizScreen() {
  const [view, setView] = useState<QuizView>('catalog');
  const [activeSubject, setActiveSubject] = useState('All');
  const [activeDiff, setActiveDiff] = useState<string>('All');
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [finalAnswers, setFinalAnswers] = useState<(number | null)[]>([]);

  const difficulties = ['All', 'Easy', 'Medium', 'Hard', 'Advanced'];
  const subjectTabs = ['All', ...QUIZ_SUBJECTS];

  const filtered = QUIZZES.filter(q => {
    const ms = activeSubject === 'All' || q.subject === activeSubject;
    const md = activeDiff === 'All' || q.difficulty === activeDiff;
    return ms && md;
  });

  function startQuiz(quiz: Quiz) {
    setSelectedQuiz(quiz);
    setFinalAnswers([]);
    setView('active');
  }

  function handleFinish(answers: (number | null)[]) {
    setFinalAnswers(answers);
    setView('results');
  }

  function handleRetry() {
    setFinalAnswers([]);
    setView('active');
  }

  if (view === 'active' && selectedQuiz) {
    return (
      <ActiveQuiz
        quiz={selectedQuiz}
        onFinish={handleFinish}
        onExit={() => setView('catalog')}
      />
    );
  }

  if (view === 'results' && selectedQuiz) {
    return (
      <ResultsScreen
        quiz={selectedQuiz}
        answers={finalAnswers}
        onRetry={handleRetry}
        onBack={() => setView('catalog')}
      />
    );
  }

  // ── Catalog ──
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.catalogHeader}>
        <View>
          <Text style={styles.catalogTitle}>Quiz</Text>
          <Text style={styles.catalogSubtitle}>{QUIZZES.length} quizzes · test your skills</Text>
        </View>
        <View style={styles.trophyBtn}>
          <Ionicons name="trophy" size={20} color={Colors.warning} />
        </View>
      </View>

      {/* Difficulty filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {difficulties.map(d => (
          <TouchableOpacity
            key={d}
            style={[styles.filterTab, activeDiff === d && styles.filterTabActive]}
            onPress={() => setActiveDiff(d)}
          >
            <Text style={[styles.filterTabText, activeDiff === d && styles.filterTabTextActive]}>{d}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Subject filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.filterRow, { paddingTop: 0 }]}>
        {subjectTabs.map(s => (
          <TouchableOpacity
            key={s}
            style={[styles.subjectTab, activeSubject === s && styles.subjectTabActive]}
            onPress={() => setActiveSubject(s)}
          >
            <Text style={[styles.subjectTabText, activeSubject === s && styles.subjectTabTextActive]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.catalogBody} showsVerticalScrollIndicator={false}>
        <Text style={styles.resultCount}>{filtered.length} quiz{filtered.length !== 1 ? 'zes' : ''} available</Text>

        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="help-circle-outline" size={52} color={Colors.border} />
            <Text style={styles.emptyTitle}>No quizzes match</Text>
            <Text style={styles.emptySubtitle}>Try changing the subject or difficulty filter.</Text>
          </View>
        ) : (
          filtered.map(quiz => (
            <QuizCard key={quiz.id} quiz={quiz} onStart={() => startQuiz(quiz)} />
          ))
        )}
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  // Catalog
  catalogHeader: {
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 10,
  },
  catalogTitle: { fontSize: 28, fontWeight: '700', color: Colors.text },
  catalogSubtitle: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  trophyBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.warningLight,
    alignItems: 'center', justifyContent: 'center',
  },
  filterRow: { paddingHorizontal: 20, paddingVertical: 8, gap: 8 },
  filterTab: {
    paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
  },
  filterTabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterTabText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  filterTabTextActive: { color: Colors.white },
  subjectTab: {
    paddingHorizontal: 14, paddingVertical: 5, borderRadius: 16,
    backgroundColor: Colors.surfaceSecondary, borderWidth: 1, borderColor: Colors.border,
  },
  subjectTabActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  subjectTabText: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
  subjectTabTextActive: { color: Colors.primary },
  catalogBody: { paddingHorizontal: 20, paddingTop: 4 },
  resultCount: { fontSize: 13, color: Colors.textSecondary, marginBottom: 12, fontWeight: '500' },
  quizCard: {
    backgroundColor: Colors.surface, borderRadius: 14, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: Colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  quizCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  quizIconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  diffBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  diffText: { fontSize: 12, fontWeight: '700' },
  quizTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 5 },
  quizDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18, marginBottom: 10 },
  quizMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },
  quizMetaText: { fontSize: 12, color: Colors.textTertiary },
  metaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: Colors.textTertiary, marginHorizontal: 3 },
  startRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  startText: { fontSize: 14, fontWeight: '700' },

  // Active quiz
  activeHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.border, backgroundColor: Colors.surface,
  },
  exitBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center', justifyContent: 'center',
  },
  activeHeaderCenter: { flex: 1 },
  activeSubject: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  activeCounter: { fontSize: 15, fontWeight: '700', color: Colors.text },
  progressTrack: { height: 4, backgroundColor: Colors.borderLight },
  progressFill: { height: 4, borderRadius: 2 },
  activeBody: { padding: 20 },
  questionCard: {
    backgroundColor: Colors.surface, borderRadius: 14, padding: 18, marginBottom: 20,
    borderWidth: 1, borderColor: Colors.border, borderTopWidth: 3, gap: 12,
  },
  qNumBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, alignSelf: 'flex-start' },
  qNumText: { fontSize: 12, fontWeight: '700', color: Colors.white },
  questionText: { fontSize: 16, fontWeight: '600', color: Colors.text, lineHeight: 24 },
  optionsContainer: { gap: 10, marginBottom: 20 },
  option: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderRadius: 12, borderWidth: 1.5, padding: 14,
  },
  optionLetter: {
    width: 30, height: 30, borderRadius: 15, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  optionLetterText: { fontSize: 13, fontWeight: '700' },
  optionText: { flex: 1, fontSize: 14, color: Colors.text, lineHeight: 20 },
  explanationCard: {
    borderLeftWidth: 3, borderRadius: 10,
    backgroundColor: Colors.surface, padding: 14, marginBottom: 16,
    borderWidth: 1, borderColor: Colors.border, gap: 8,
  },
  explanationHeader: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  explanationTitle: { fontSize: 14, fontWeight: '700' },
  explanationText: { fontSize: 14, color: Colors.text, lineHeight: 21 },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 15, borderRadius: 14,
  },
  actionBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },

  // Results
  resultsHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.border, backgroundColor: Colors.surface,
  },
  resultsHeaderTitle: { flex: 1, fontSize: 18, fontWeight: '700', color: Colors.text },
  retryBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  retryText: { fontSize: 13, fontWeight: '700' },
  resultsBody: { padding: 20 },
  scoreHero: {
    borderRadius: 16, padding: 24, alignItems: 'center', gap: 6, marginBottom: 24,
  },
  scoreNum: { fontSize: 56, fontWeight: '900' },
  scoreLabel: { fontSize: 20, fontWeight: '700' },
  scoreDetail: { fontSize: 14, color: Colors.textSecondary },
  scoreStatsRow: { flexDirection: 'row', gap: 20, marginTop: 8 },
  scoreStat: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  scoreStatText: { fontSize: 13, fontWeight: '600', color: Colors.text },
  reviewTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 14 },
  reviewCard: {
    backgroundColor: Colors.surface, borderRadius: 12, padding: 14, marginBottom: 12,
    borderWidth: 1, borderColor: Colors.border, borderLeftWidth: 3, gap: 8,
  },
  reviewTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  reviewNum: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  reviewNumText: { fontSize: 12, fontWeight: '700' },
  reviewQuestion: { flex: 1, fontSize: 14, fontWeight: '600', color: Colors.text, lineHeight: 20 },
  reviewAnswerRow: { flexDirection: 'row', alignItems: 'flex-start', paddingLeft: 36 },
  reviewAnswerLabel: { fontSize: 13, color: Colors.textSecondary },
  reviewAnswerVal: { fontSize: 13, fontWeight: '700', flex: 1 },
  reviewExplBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 7,
    backgroundColor: Colors.warningLight, borderRadius: 8, padding: 10, marginTop: 2,
  },
  reviewExplText: { flex: 1, fontSize: 13, color: Colors.text, lineHeight: 18 },
  resultsCTARow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  ctaBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 7, paddingVertical: 14, borderRadius: 12,
  },
  ctaBtnOutline: { backgroundColor: Colors.primaryLight, borderWidth: 1, borderColor: Colors.primary },
  ctaBtnText: { fontSize: 14, fontWeight: '700', color: Colors.white },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 10, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
  emptySubtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },
});
