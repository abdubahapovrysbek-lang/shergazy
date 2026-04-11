import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Card } from '../../components/Card';
import { ProgressBar } from '../../components/ProgressBar';
import SubscriptionModal from '../../components/SubscriptionModal';
import { useAuth } from '../../context/AuthContext';
import { UserProfile } from '../../types';

interface SettingRowProps {
  icon: string;
  iconColor: string;
  iconBg: string;
  label: string;
  value?: string;
  onPress?: () => void;
  showArrow?: boolean;
  children?: React.ReactNode;
}

function SettingRow({
  icon, iconColor, iconBg, label, value, onPress, showArrow = true, children,
}: SettingRowProps) {
  return (
    <TouchableOpacity style={styles.settingRow} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.settingIcon, { backgroundColor: iconBg }]}>
        <Ionicons name={icon as any} size={18} color={iconColor} />
      </View>
      <Text style={styles.settingLabel}>{label}</Text>
      <View style={styles.settingRight}>
        {value && <Text style={styles.settingValue}>{value}</Text>}
        {children}
        {showArrow && !children && (
          <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
        )}
      </View>
    </TouchableOpacity>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

function PlanBadge({ status }: { status: UserProfile['subscription_status'] }) {
  const map: Record<UserProfile['subscription_status'], { label: string; bg: string; color: string; icon: string }> = {
    free:    { label: 'Free Plan',    bg: Colors.surfaceSecondary, color: Colors.textSecondary, icon: 'person-outline' },
    trial:   { label: 'Trial',        bg: Colors.infoLight,        color: Colors.info,          icon: 'time-outline' },
    premium: { label: 'Premium',      bg: Colors.warningLight,     color: Colors.warning,       icon: 'star' },
    expired: { label: 'Trial Ended',  bg: Colors.accentLight,      color: Colors.accent,        icon: 'alert-circle-outline' },
  };
  const c = map[status];
  return (
    <View style={[planBadge.wrap, { backgroundColor: c.bg }]}>
      <Ionicons name={c.icon as any} size={12} color={c.color} />
      <Text style={[planBadge.text, { color: c.color }]}>{c.label}</Text>
    </View>
  );
}
const planBadge = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start' },
  text: { fontSize: 12, fontWeight: '700' },
});

const MATH_SUBJECTS = ['Algebra', 'Calculus', 'Geometry', 'Statistics', 'Trigonometry', 'Number Theory'];

export default function SettingsScreen() {
  const { user, profile, signOut } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [soundEffects, setSoundEffects] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState(['Algebra', 'Calculus', 'Geometry']);
  const [showSubModal, setShowSubModal] = useState(false);

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject],
    );
  };

  async function handleSignOut() {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/auth');
          },
        },
      ],
    );
  }

  const subscriptionStatus = profile?.subscription_status ?? 'free';
  const isPremiumOrTrial = subscriptionStatus === 'premium' || subscriptionStatus === 'trial';

  // Derive initials from email or full name
  const displayName = profile?.full_name ?? user?.email ?? 'User';
  const initials = displayName
    .split(' ')
    .map((w: string) => w[0] ?? '')
    .join('')
    .toUpperCase()
    .slice(0, 2);

  let trialDaysLeft = 0;
  if (subscriptionStatus === 'trial' && profile?.subscription_end_date) {
    const diff = new Date(profile.subscription_end_date).getTime() - Date.now();
    trialDaysLeft = Math.max(0, Math.ceil(diff / 86400000));
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* Profile Card */}
        <Card variant="elevated" style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials || 'U'}</Text>
            {isPremiumOrTrial && (
              <View style={styles.avatarBadge}>
                <Ionicons name="star" size={10} color={Colors.white} />
              </View>
            )}
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName} numberOfLines={1}>{displayName}</Text>
            <Text style={styles.profileEmail} numberOfLines={1}>{user?.email ?? ''}</Text>
            <PlanBadge status={subscriptionStatus} />
          </View>
          <TouchableOpacity style={styles.editProfileBtn}>
            <Text style={styles.editProfileText}>Edit</Text>
          </TouchableOpacity>
        </Card>

        {/* Subscription Card */}
        {!isPremiumOrTrial ? (
          <TouchableOpacity style={styles.upgradeCard} onPress={() => setShowSubModal(true)} activeOpacity={0.88}>
            <View style={styles.upgradeLeft}>
              <Ionicons name="star" size={22} color={Colors.warning} />
              <View>
                <Text style={styles.upgradeTitle}>Upgrade to Premium</Text>
                <Text style={styles.upgradeSubtitle}>
                  {!profile?.has_used_trial
                    ? '7-day free trial · then $0.99/month'
                    : '$0.99/month · Cancel any time'}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.warning} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.premiumCard} onPress={() => setShowSubModal(true)} activeOpacity={0.88}>
            <Ionicons name="star" size={22} color={Colors.warning} />
            <View style={{ flex: 1 }}>
              <Text style={styles.premiumTitle}>
                {subscriptionStatus === 'trial' ? `Trial Active — ${trialDaysLeft} day${trialDaysLeft !== 1 ? 's' : ''} left` : 'Premium Active'}
              </Text>
              <Text style={styles.premiumSubtitle}>Tap to manage your subscription</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.warning} />
          </TouchableOpacity>
        )}

        {/* XP Progress */}
        <Card style={styles.xpCard} variant="outlined">
          <View style={styles.xpHeader}>
            <Ionicons name="trophy" size={18} color={Colors.warning} />
            <Text style={styles.xpTitle}>Level 5 — Scholar</Text>
            <Text style={styles.xpPoints}>840 / 1000 XP</Text>
          </View>
          <ProgressBar progress={84} color={Colors.warning} trackColor={Colors.warningLight} />
          <Text style={styles.xpNote}>160 XP to reach Level 6 — Expert</Text>
        </Card>

        {/* Preferred Subjects */}
        <SectionTitle title="My Subjects" />
        <Card style={styles.subjectsCard}>
          <Text style={styles.subjectsHint}>Tap to toggle — affects your feed and recommendations</Text>
          <View style={styles.subjectsWrap}>
            {MATH_SUBJECTS.map((subject) => {
              const active = selectedSubjects.includes(subject);
              return (
                <TouchableOpacity
                  key={subject}
                  style={[styles.subjectChip, active && styles.subjectChipActive]}
                  onPress={() => toggleSubject(subject)}
                >
                  <Text style={[styles.subjectChipText, active && styles.subjectChipTextActive]}>
                    {subject}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* Notifications */}
        <SectionTitle title="Notifications" />
        <Card style={styles.settingsGroup}>
          <SettingRow
            icon="notifications" iconColor={Colors.primary} iconBg={Colors.primaryLight}
            label="Push Notifications" showArrow={false}
          >
            <Switch value={notifications} onValueChange={setNotifications}
              trackColor={{ true: Colors.primary, false: Colors.border }} thumbColor={Colors.white} />
          </SettingRow>
          <View style={styles.rowDivider} />
          <SettingRow
            icon="alarm" iconColor={Colors.success} iconBg={Colors.successLight}
            label="Daily Reminder" showArrow={false}
          >
            <Switch value={dailyReminder} onValueChange={setDailyReminder}
              trackColor={{ true: Colors.primary, false: Colors.border }} thumbColor={Colors.white} />
          </SettingRow>
          <View style={styles.rowDivider} />
          <SettingRow
            icon="time-outline" iconColor={Colors.warning} iconBg={Colors.warningLight}
            label="Reminder Time" value="8:00 AM" onPress={() => {}} />
        </Card>

        {/* Appearance */}
        <SectionTitle title="Appearance" />
        <Card style={styles.settingsGroup}>
          <SettingRow
            icon="moon" iconColor={Colors.info} iconBg={Colors.infoLight}
            label="Dark Mode" showArrow={false}
          >
            <Switch value={darkMode} onValueChange={setDarkMode}
              trackColor={{ true: Colors.primary, false: Colors.border }} thumbColor={Colors.white} />
          </SettingRow>
          <View style={styles.rowDivider} />
          <SettingRow
            icon="volume-high" iconColor={Colors.accent} iconBg={Colors.accentLight}
            label="Sound Effects" showArrow={false}
          >
            <Switch value={soundEffects} onValueChange={setSoundEffects}
              trackColor={{ true: Colors.primary, false: Colors.border }} thumbColor={Colors.white} />
          </SettingRow>
          <View style={styles.rowDivider} />
          <SettingRow
            icon="text" iconColor={Colors.textSecondary} iconBg={Colors.surfaceSecondary}
            label="Font Size" value="Medium" onPress={() => {}} />
        </Card>

        {/* Study Preferences */}
        <SectionTitle title="Study Preferences" />
        <Card style={styles.settingsGroup}>
          <SettingRow
            icon="speedometer" iconColor={Colors.warning} iconBg={Colors.warningLight}
            label="Difficulty Level" value="Medium" onPress={() => {}} />
          <View style={styles.rowDivider} />
          <SettingRow
            icon="language" iconColor={Colors.info} iconBg={Colors.infoLight}
            label="Language" value="English" onPress={() => {}} />
          <View style={styles.rowDivider} />
          <SettingRow
            icon="repeat" iconColor={Colors.success} iconBg={Colors.successLight}
            label="Daily Goal" value="10 problems" onPress={() => {}} />
        </Card>

        {/* Account */}
        <SectionTitle title="Account" />
        <Card style={styles.settingsGroup}>
          <SettingRow
            icon="lock-closed" iconColor={Colors.primary} iconBg={Colors.primaryLight}
            label="Change Password" onPress={() => {}} />
          <View style={styles.rowDivider} />
          <SettingRow
            icon="shield-checkmark" iconColor={Colors.success} iconBg={Colors.successLight}
            label="Privacy Settings" onPress={() => {}} />
          <View style={styles.rowDivider} />
          <SettingRow
            icon="help-circle" iconColor={Colors.info} iconBg={Colors.infoLight}
            label="Help & Support" onPress={() => {}} />
          <View style={styles.rowDivider} />
          <SettingRow
            icon="information-circle" iconColor={Colors.textSecondary} iconBg={Colors.surfaceSecondary}
            label="App Version" value="1.0.0" showArrow={false} />
        </Card>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={18} color={Colors.accent} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>

      <SubscriptionModal visible={showSubModal} onClose={() => setShowSubModal(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 8 },
  header: { paddingTop: 12, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '700', color: Colors.text },

  profileCard: { padding: 20, marginBottom: 12, flexDirection: 'row', alignItems: 'flex-start', gap: 16 },
  avatar: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 20, fontWeight: '800', color: Colors.white },
  avatarBadge: {
    position: 'absolute', bottom: 0, right: 0,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: Colors.warning,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.white,
  },
  profileInfo: { flex: 1, gap: 4 },
  profileName: { fontSize: 17, fontWeight: '700', color: Colors.text },
  profileEmail: { fontSize: 12, color: Colors.textSecondary, marginBottom: 4 },
  editProfileBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1.5, borderColor: Colors.primary },
  editProfileText: { fontSize: 13, fontWeight: '600', color: Colors.primary },

  upgradeCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.warningLight,
    borderRadius: 16, padding: 16, marginBottom: 16,
    borderWidth: 1.5, borderColor: Colors.warning + '40',
  },
  upgradeLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  upgradeTitle: { fontSize: 15, fontWeight: '700', color: Colors.text },
  upgradeSubtitle: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  premiumCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.warningLight,
    borderRadius: 16, padding: 16, marginBottom: 16,
    borderWidth: 1.5, borderColor: Colors.warning + '50',
  },
  premiumTitle: { fontSize: 15, fontWeight: '700', color: Colors.text },
  premiumSubtitle: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },

  xpCard: { marginBottom: 20, padding: 14 },
  xpHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  xpTitle: { flex: 1, fontSize: 14, fontWeight: '700', color: Colors.text },
  xpPoints: { fontSize: 13, fontWeight: '600', color: Colors.warning },
  xpNote: { fontSize: 12, color: Colors.textSecondary, marginTop: 6 },

  sectionTitle: {
    fontSize: 12, fontWeight: '700', color: Colors.textSecondary,
    letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8, marginTop: 8,
  },

  subjectsCard: { marginBottom: 20, padding: 14 },
  subjectsHint: { fontSize: 12, color: Colors.textTertiary, marginBottom: 12 },
  subjectsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  subjectChip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
    backgroundColor: Colors.surfaceSecondary, borderWidth: 1.5, borderColor: Colors.border,
  },
  subjectChipActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  subjectChipText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  subjectChipTextActive: { color: Colors.primary },

  settingsGroup: { marginBottom: 20, padding: 0, overflow: 'hidden' },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  settingIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  settingLabel: { flex: 1, fontSize: 15, fontWeight: '500', color: Colors.text },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  settingValue: { fontSize: 14, color: Colors.textSecondary },
  rowDivider: { height: 1, backgroundColor: Colors.borderLight, marginLeft: 62 },

  signOutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 14, borderRadius: 14,
    borderWidth: 1.5, borderColor: Colors.accentLight,
    backgroundColor: Colors.accentLight, marginTop: 4,
  },
  signOutText: { fontSize: 15, fontWeight: '700', color: Colors.accent },
});
