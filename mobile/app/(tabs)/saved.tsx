import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';

const FILTER_TABS = ['All', 'Problems', 'Notes', 'Formulas'];

const SAVED_ITEMS = [
  {
    id: '1',
    type: 'Problems',
    title: 'Solving Systems of Equations',
    preview: '2x + 3y = 12 and x − y = 1. Find x and y using substitution...',
    subject: 'Algebra',
    savedAt: '2 hours ago',
    icon: 'calculator-outline',
    color: Colors.primary,
  },
  {
    id: '2',
    type: 'Formulas',
    title: 'Quadratic Formula',
    preview: 'x = (−b ± √(b²−4ac)) / 2a — used to find roots of ax²+bx+c = 0',
    subject: 'Algebra',
    savedAt: 'Yesterday',
    icon: 'list-outline',
    color: Colors.warning,
  },
  {
    id: '3',
    type: 'Notes',
    title: 'Integration by Parts',
    preview: '∫u dv = uv − ∫v du. Choose u using LIATE rule: Logs, Inverse trig...',
    subject: 'Calculus',
    savedAt: '3 days ago',
    icon: 'document-text-outline',
    color: Colors.accent,
  },
  {
    id: '4',
    type: 'Problems',
    title: 'Circle Theorems Practice',
    preview: 'Prove that the angle in a semicircle is always 90°. Given a circle...',
    subject: 'Geometry',
    savedAt: '1 week ago',
    icon: 'calculator-outline',
    color: Colors.success,
  },
  {
    id: '5',
    type: 'Formulas',
    title: 'Trigonometric Identities',
    preview: 'sin²θ + cos²θ = 1, tan θ = sin θ / cos θ, sec²θ = 1 + tan²θ...',
    subject: 'Trigonometry',
    savedAt: '1 week ago',
    icon: 'list-outline',
    color: Colors.info,
  },
  {
    id: '6',
    type: 'Notes',
    title: 'Probability Basics',
    preview: 'P(A) = favorable outcomes / total outcomes. For independent events...',
    subject: 'Statistics',
    savedAt: '2 weeks ago',
    icon: 'document-text-outline',
    color: Colors.primary,
  },
];

export default function SavedScreen() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchText, setSearchText] = useState('');

  const filtered = SAVED_ITEMS.filter((item) => {
    const matchesFilter = activeFilter === 'All' || item.type === activeFilter;
    const matchesSearch =
      searchText === '' ||
      item.title.toLowerCase().includes(searchText.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchText.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Saved</Text>
        <TouchableOpacity style={styles.sortBtn}>
          <Ionicons name="funnel-outline" size={20} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <Ionicons name="search" size={18} color={Colors.textTertiary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search saved items..."
          placeholderTextColor={Colors.textTertiary}
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Ionicons name="close-circle" size={18} color={Colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {FILTER_TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.filterTab, activeFilter === tab && styles.filterTabActive]}
            onPress={() => setActiveFilter(tab)}
          >
            <Text style={[styles.filterLabel, activeFilter === tab && styles.filterLabelActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="bookmark-outline" size={64} color={Colors.border} />
            <Text style={styles.emptyTitle}>Nothing saved yet</Text>
            <Text style={styles.emptySubtitle}>
              Bookmark problems, notes, and formulas to review them later.
            </Text>
          </View>
        ) : (
          filtered.map((item) => (
            <TouchableOpacity key={item.id} activeOpacity={0.8}>
              <Card style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <View style={[styles.itemIcon, { backgroundColor: item.color + '18' }]}>
                    <Ionicons name={item.icon as any} size={18} color={item.color} />
                  </View>
                  <View style={styles.itemMeta}>
                    <Badge label={item.type} color={item.color} bgColor={item.color + '18'} />
                    <Text style={styles.itemTime}>{item.savedAt}</Text>
                  </View>
                  <TouchableOpacity>
                    <Ionicons name="bookmark" size={20} color={Colors.primary} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemPreview} numberOfLines={2}>{item.preview}</Text>
                <View style={styles.itemFooter}>
                  <Badge label={item.subject} />
                  <TouchableOpacity style={styles.openBtn}>
                    <Text style={styles.openBtnText}>Open</Text>
                    <Ionicons name="chevron-forward" size={14} color={Colors.primary} />
                  </TouchableOpacity>
                </View>
              </Card>
            </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  title: { fontSize: 28, fontWeight: '700', color: Colors.text },
  sortBtn: {
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
  filterRow: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterTabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterLabel: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  filterLabelActive: { color: Colors.white },
  scroll: { flex: 1 },
  list: { paddingHorizontal: 20 },
  itemCard: { marginBottom: 12 },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  itemIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemMeta: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  itemTime: { fontSize: 12, color: Colors.textTertiary, fontWeight: '500' },
  itemTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 6 },
  itemPreview: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18, marginBottom: 12 },
  itemFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  openBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  openBtnText: { fontSize: 14, fontWeight: '600', color: Colors.primary },
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 12,
    paddingHorizontal: 40,
  },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: Colors.text },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
