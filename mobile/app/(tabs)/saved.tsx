import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { AnalysisResult } from '../../components/AnalysisResult';
import { useSaved } from '../../context/SavedContext';
import type { SavedProblem } from '../../services/storage';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(ts: number): string {
  const diff = Date.now() - ts;
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins  < 2)  return 'Just now';
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days  < 7)  return `${days}d ago`;
  return new Date(ts).toLocaleDateString();
}

function subjectColor(subject: string): { text: string; bg: string } {
  const map: Record<string, { text: string; bg: string }> = {
    algebra:     { text: Colors.primary,      bg: Colors.primaryLight  },
    calculus:    { text: Colors.accent,       bg: Colors.accentLight   },
    geometry:    { text: Colors.success,      bg: Colors.successLight  },
    statistics:  { text: Colors.info,         bg: Colors.infoLight     },
    trigonometry:{ text: Colors.warning,      bg: Colors.warningLight  },
    trig:        { text: Colors.warning,      bg: Colors.warningLight  },
  };
  return map[subject.toLowerCase()] ?? { text: Colors.primary, bg: Colors.primaryLight };
}

function difficultyColor(d: string): { text: string; bg: string } {
  if (d === 'Easy')     return { text: Colors.success,     bg: Colors.successLight };
  if (d === 'Medium')   return { text: Colors.warning,     bg: Colors.warningLight };
  if (d === 'Hard')     return { text: Colors.accent,      bg: Colors.accentLight  };
  return { text: Colors.primaryDark, bg: Colors.primaryLight };
}

// ─── Expanded detail modal (inline) ──────────────────────────────────────────

function ProblemDetail({
  problem,
  onClose,
}: {
  problem: SavedProblem;
  onClose: () => void;
}) {
  const { remove } = useSaved();

  function confirmDelete() {
    Alert.alert('Delete Problem', 'Remove this problem from your saved collection?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await remove(problem.id);
          onClose();
        },
      },
    ]);
  }

  return (
    <View style={detailStyles.container}>
      {/* Header */}
      <View style={detailStyles.header}>
        <TouchableOpacity style={detailStyles.closeBtn} onPress={onClose}>
          <Ionicons name="arrow-back" size={20} color={Colors.text} />
        </TouchableOpacity>
        <Text style={detailStyles.headerTitle} numberOfLines={1}>Problem Detail</Text>
        <TouchableOpacity style={detailStyles.deleteBtn} onPress={confirmDelete}>
          <Ionicons name="trash-outline" size={18} color={Colors.accent} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={detailStyles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Photo thumbnail */}
        <Image
          source={{ uri: problem.imageUri }}
          style={detailStyles.image}
          resizeMode="cover"
        />

        {/* Meta */}
        <View style={detailStyles.meta}>
          <Text style={detailStyles.savedDate}>Saved {formatDate(problem.savedAt)}</Text>
        </View>

        {/* Full analysis */}
        <AnalysisResult
          analysis={problem.analysis}
          onDismiss={onClose}
        />

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const detailStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
    gap: 12,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: Colors.text },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { padding: 16 },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 14,
    marginBottom: 12,
    backgroundColor: Colors.surfaceSecondary,
  },
  meta: { marginBottom: 12 },
  savedDate: { fontSize: 12, color: Colors.textTertiary, fontWeight: '500' },
});

// ─── Problem card (list item) ─────────────────────────────────────────────────

function ProblemCard({
  problem,
  onPress,
  onDelete,
}: {
  problem: SavedProblem;
  onPress: () => void;
  onDelete: () => void;
}) {
  const sc = subjectColor(problem.analysis.subject);
  const dc = difficultyColor(problem.analysis.difficulty);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <Card style={cardStyles.card}>
        <View style={cardStyles.row}>
          {/* Thumbnail */}
          <Image
            source={{ uri: problem.imageUri }}
            style={cardStyles.thumb}
            resizeMode="cover"
          />

          {/* Content */}
          <View style={cardStyles.content}>
            <View style={cardStyles.badges}>
              <Badge label={problem.analysis.subject} color={sc.text} bgColor={sc.bg} />
              <Badge
                label={problem.analysis.difficulty}
                color={dc.text}
                bgColor={dc.bg}
              />
            </View>
            <Text style={cardStyles.question} numberOfLines={2}>
              {problem.analysis.detectedProblem}
            </Text>
            <View style={cardStyles.answerRow}>
              <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
              <Text style={cardStyles.answer} numberOfLines={1}>
                {problem.analysis.finalAnswer}
              </Text>
            </View>
            <Text style={cardStyles.time}>{formatDate(problem.savedAt)}</Text>
          </View>

          {/* Delete */}
          <TouchableOpacity
            style={cardStyles.deleteBtn}
            onPress={onDelete}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="trash-outline" size={16} color={Colors.accent} />
          </TouchableOpacity>
        </View>

        {/* Steps preview */}
        <View style={cardStyles.footer}>
          <Ionicons name="list-outline" size={13} color={Colors.textTertiary} />
          <Text style={cardStyles.footerText}>
            {problem.analysis.steps.length} solution steps
          </Text>
          <View style={cardStyles.footerDot} />
          <Ionicons name="bulb-outline" size={13} color={Colors.textTertiary} />
          <Text style={cardStyles.footerText}>
            {problem.analysis.keyConcepts.length} concepts
          </Text>
          <View style={{ flex: 1 }} />
          <Text style={cardStyles.openText}>Open  →</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const cardStyles = StyleSheet.create({
  card: { marginBottom: 12, padding: 12 },
  row: { flexDirection: 'row', gap: 12, marginBottom: 10 },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: 10,
    backgroundColor: Colors.surfaceSecondary,
    flexShrink: 0,
  },
  content: { flex: 1, gap: 4 },
  badges: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  question: { fontSize: 13, fontWeight: '600', color: Colors.text, lineHeight: 18 },
  answerRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  answer: { fontSize: 12, color: Colors.success, fontWeight: '600', flex: 1 },
  time: { fontSize: 11, color: Colors.textTertiary },
  deleteBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  footerText: { fontSize: 12, color: Colors.textTertiary },
  footerDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.textTertiary,
    marginHorizontal: 4,
  },
  openText: { fontSize: 12, fontWeight: '700', color: Colors.primary },
});

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <View style={emptyStyles.container}>
      <View style={emptyStyles.iconBg}>
        <Ionicons
          name={hasFilters ? 'search-outline' : 'bookmark-outline'}
          size={40}
          color={Colors.primary}
        />
      </View>
      <Text style={emptyStyles.title}>
        {hasFilters ? 'No matches found' : 'No saved problems yet'}
      </Text>
      <Text style={emptyStyles.subtitle}>
        {hasFilters
          ? 'Try adjusting your search or subject filter.'
          : 'Scan a homework problem on the Dashboard, analyse it with AI, then tap "Save to Collection".'}
      </Text>
    </View>
  );
}

const emptyStyles = StyleSheet.create({
  container: { alignItems: 'center', paddingTop: 72, paddingHorizontal: 40, gap: 12 },
  iconBg: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: { fontSize: 20, fontWeight: '700', color: Colors.text, textAlign: 'center' },
  subtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },
});

// ─── Main screen ──────────────────────────────────────────────────────────────

const SUBJECT_FILTERS = ['All', 'Algebra', 'Calculus', 'Geometry', 'Statistics', 'Trigonometry'];

export default function SavedScreen() {
  const { problems, loading, remove, clearAll } = useSaved();
  const [search, setSearch] = useState('');
  const [activeSubject, setActiveSubject] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Derive subjects that actually have saved problems
  const usedSubjects = ['All', ...Array.from(
    new Set(problems.map((p) => p.analysis.subject))
  )];

  const filtered = problems.filter((p) => {
    const matchSubject =
      activeSubject === 'All' ||
      p.analysis.subject.toLowerCase() === activeSubject.toLowerCase();
    const matchSearch =
      search === '' ||
      p.analysis.detectedProblem.toLowerCase().includes(search.toLowerCase()) ||
      p.analysis.subject.toLowerCase().includes(search.toLowerCase()) ||
      p.analysis.finalAnswer.toLowerCase().includes(search.toLowerCase());
    return matchSubject && matchSearch;
  });

  function confirmDelete(id: string) {
    Alert.alert('Delete Problem', 'Remove this problem from your saved collection?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => remove(id) },
    ]);
  }

  function confirmClearAll() {
    if (problems.length === 0) return;
    Alert.alert(
      'Clear All',
      `Delete all ${problems.length} saved problem${problems.length === 1 ? '' : 's'}? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: () => clearAll() },
      ],
    );
  }

  // Show expanded detail view
  const expandedProblem = expandedId ? problems.find((p) => p.id === expandedId) ?? null : null;
  if (expandedProblem) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ProblemDetail problem={expandedProblem} onClose={() => setExpandedId(null)} />
      </SafeAreaView>
    );
  }

  const hasFilters = search !== '' || activeSubject !== 'All';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Saved</Text>
          {problems.length > 0 && (
            <Text style={styles.subtitle}>{problems.length} problem{problems.length === 1 ? '' : 's'} saved</Text>
          )}
        </View>
        {problems.length > 0 && (
          <TouchableOpacity style={styles.clearBtn} onPress={confirmClearAll}>
            <Ionicons name="trash-outline" size={16} color={Colors.accent} />
            <Text style={styles.clearBtnText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <Ionicons name="search" size={18} color={Colors.textTertiary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search problems, subjects, answers…"
          placeholderTextColor={Colors.textTertiary}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={Colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Subject filter — only shows subjects that exist in saved problems */}
      {problems.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {usedSubjects.map((subject) => (
            <TouchableOpacity
              key={subject}
              style={[styles.filterTab, activeSubject === subject && styles.filterTabActive]}
              onPress={() => setActiveSubject(subject)}
            >
              <Text style={[styles.filterLabel, activeSubject === subject && styles.filterLabelActive]}>
                {subject}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* List */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={emptyStyles.container}>
            <Text style={emptyStyles.subtitle}>Loading saved problems…</Text>
          </View>
        ) : filtered.length === 0 ? (
          <EmptyState hasFilters={hasFilters} />
        ) : (
          filtered.map((problem) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              onPress={() => setExpandedId(problem.id)}
              onDelete={() => confirmDelete(problem.id)}
            />
          ))
        )}
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,
  },
  title: { fontSize: 28, fontWeight: '700', color: Colors.text },
  subtitle: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.accentLight,
    marginTop: 4,
  },
  clearBtnText: { fontSize: 13, fontWeight: '600', color: Colors.accent },

  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: Colors.text },

  filterRow: { paddingHorizontal: 20, paddingBottom: 14, gap: 8 },
  filterTab: {
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterTabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterLabel: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  filterLabelActive: { color: Colors.white },

  scroll: { flex: 1 },
  list: { paddingHorizontal: 20 },
});
