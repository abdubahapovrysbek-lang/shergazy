import React, { useState } from 'react';
import {
  View, Text, Modal, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { useAuth } from '../context/AuthContext';
import { initiateSubscriptionPayment, activateTrial } from '../services/paybox';
import { UserProfile } from '../types';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const PREMIUM_FEATURES = [
  { icon: 'scan-outline',        text: 'Unlimited AI math scans' },
  { icon: 'book-outline',        text: 'All courses & lessons' },
  { icon: 'help-circle-outline', text: 'All quiz categories' },
  { icon: 'bookmark-outline',    text: 'Unlimited saved problems' },
  { icon: 'flash-outline',       text: 'Priority AI processing' },
];

function StatusBadge({ status }: { status: UserProfile['subscription_status'] }) {
  const map = {
    free:    { label: 'Free',    bg: Colors.surfaceSecondary, color: Colors.textSecondary },
    trial:   { label: 'Trial',   bg: Colors.infoLight,        color: Colors.info },
    premium: { label: 'Premium', bg: Colors.warningLight,     color: Colors.warning },
    expired: { label: 'Expired', bg: Colors.accentLight,      color: Colors.accent },
  };
  const c = map[status];
  return (
    <View style={[badge.wrap, { backgroundColor: c.bg }]}>
      <Text style={[badge.text, { color: c.color }]}>{c.label}</Text>
    </View>
  );
}
const badge = StyleSheet.create({
  wrap: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: 'center' },
  text: { fontSize: 12, fontWeight: '700' },
});

export default function SubscriptionModal({ visible, onClose }: Props) {
  const { user, profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState<'trial' | 'subscribe' | null>(null);

  const status = profile?.subscription_status ?? 'free';
  const isPremium = status === 'premium';
  const isTrial = status === 'trial';
  const canUseTrial = !profile?.has_used_trial && status === 'free';

  let trialDaysLeft = 0;
  if (isTrial && profile?.subscription_end_date) {
    const diff = new Date(profile.subscription_end_date).getTime() - Date.now();
    trialDaysLeft = Math.max(0, Math.ceil(diff / 86400000));
  }

  async function handleStartTrial() {
    if (!user) return;
    setLoading('trial');
    try {
      await activateTrial(user.id);
      await refreshProfile();
      Alert.alert('Trial activated!', 'Your 7-day free Premium trial has started. Enjoy!');
      onClose();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(null);
    }
  }

  async function handleSubscribe() {
    if (!user || !profile) return;
    setLoading('subscribe');
    try {
      const result = await initiateSubscriptionPayment(user.id, profile.email);
      if (result.type === 'success') {
        // PayBox webhook updates the DB; realtime pushes the change to the app
        await refreshProfile();
        Alert.alert('Success!', 'Your Premium subscription is now active. Thank you!');
        onClose();
      } else {
        Alert.alert('Payment cancelled', 'You can subscribe any time from Settings.');
      }
    } catch (err: any) {
      Alert.alert('Payment error', err.message);
    } finally {
      setLoading(null);
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Handle + close */}
        <View style={styles.handle} />
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Ionicons name="close" size={22} color={Colors.textSecondary} />
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Hero */}
          <View style={styles.hero}>
            <View style={styles.crownBox}>
              <Ionicons name="star" size={32} color={Colors.white} />
            </View>
            <Text style={styles.heroTitle}>Rysbek AI Premium</Text>
            <StatusBadge status={status} />
          </View>

          {/* Active trial banner */}
          {isTrial && (
            <View style={styles.trialBanner}>
              <Ionicons name="time-outline" size={18} color={Colors.info} />
              <Text style={styles.trialBannerText}>
                {trialDaysLeft} day{trialDaysLeft !== 1 ? 's' : ''} left in your free trial
              </Text>
            </View>
          )}

          {/* Premium active banner */}
          {isPremium && (
            <View style={[styles.trialBanner, { backgroundColor: Colors.warningLight }]}>
              <Ionicons name="checkmark-circle" size={18} color={Colors.warning} />
              <Text style={[styles.trialBannerText, { color: Colors.warning }]}>
                Premium is active — all features unlocked
              </Text>
            </View>
          )}

          {/* Features list */}
          <Text style={styles.featuresTitle}>What you get with Premium</Text>
          <View style={styles.featuresList}>
            {PREMIUM_FEATURES.map((f) => (
              <View key={f.text} style={styles.featureRow}>
                <View style={styles.featureIconWrap}>
                  <Ionicons name={f.icon as any} size={18} color={Colors.primary} />
                </View>
                <Text style={styles.featureText}>{f.text}</Text>
              </View>
            ))}
          </View>

          {/* Price card */}
          {!isPremium && (
            <View style={styles.priceCard}>
              <View style={styles.priceRow}>
                <Text style={styles.priceAmount}>$0.99</Text>
                <Text style={styles.pricePeriod}> / month</Text>
              </View>
              <Text style={styles.priceNote}>Billed monthly · Cancel any time · USD</Text>
            </View>
          )}

          {/* CTAs */}
          {!isPremium && !isTrial && (
            <View style={styles.ctaGroup}>
              {canUseTrial && (
                <TouchableOpacity
                  style={[styles.trialBtn, loading === 'trial' && styles.btnDisabled]}
                  onPress={handleStartTrial}
                  disabled={loading !== null}
                  activeOpacity={0.85}
                >
                  {loading === 'trial' ? (
                    <ActivityIndicator color={Colors.primary} size="small" />
                  ) : (
                    <>
                      <Ionicons name="gift-outline" size={18} color={Colors.primary} />
                      <Text style={styles.trialBtnText}>Start 7-Day Free Trial</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.subscribeBtn, loading === 'subscribe' && styles.btnDisabled]}
                onPress={handleSubscribe}
                disabled={loading !== null}
                activeOpacity={0.85}
              >
                {loading === 'subscribe' ? (
                  <ActivityIndicator color={Colors.white} size="small" />
                ) : (
                  <Text style={styles.subscribeBtnText}>
                    {canUseTrial ? 'Subscribe Now — $0.99/mo' : 'Upgrade to Premium — $0.99/mo'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Trial → subscribe prompt */}
          {isTrial && (
            <View style={styles.ctaGroup}>
              <TouchableOpacity
                style={[styles.subscribeBtn, loading === 'subscribe' && styles.btnDisabled]}
                onPress={handleSubscribe}
                disabled={loading !== null}
                activeOpacity={0.85}
              >
                {loading === 'subscribe' ? (
                  <ActivityIndicator color={Colors.white} size="small" />
                ) : (
                  <Text style={styles.subscribeBtnText}>Continue with Premium — $0.99/mo</Text>
                )}
              </TouchableOpacity>
              <Text style={styles.trialSubNote}>
                Subscribe before your trial ends to keep Premium access
              </Text>
            </View>
          )}

          <Text style={styles.legal}>
            Payment processed by PayBox (FreedomPay). Subscription renews monthly at $0.99 USD.
            Cancel any time through your account settings.
          </Text>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingHorizontal: 24 },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: Colors.border, alignSelf: 'center', marginTop: 12, marginBottom: 8,
  },
  closeBtn: {
    alignSelf: 'flex-end', padding: 8,
    backgroundColor: Colors.surfaceSecondary, borderRadius: 20,
  },

  hero: { alignItems: 'center', paddingVertical: 28, gap: 12 },
  crownBox: {
    width: 72, height: 72, borderRadius: 22,
    backgroundColor: Colors.warning,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.warning,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 14, elevation: 8,
  },
  heroTitle: { fontSize: 26, fontWeight: '800', color: Colors.text },

  trialBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.infoLight,
    borderRadius: 12, padding: 14, marginBottom: 20,
  },
  trialBannerText: { fontSize: 14, fontWeight: '600', color: Colors.info, flex: 1 },

  featuresTitle: {
    fontSize: 13, fontWeight: '700', color: Colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 14,
  },
  featuresList: {
    backgroundColor: Colors.surface,
    borderRadius: 16, padding: 4,
    borderWidth: 1, borderColor: Colors.border,
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingVertical: 13, paddingHorizontal: 14,
  },
  featureIconWrap: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  featureText: { fontSize: 15, fontWeight: '500', color: Colors.text },

  priceCard: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 16, padding: 20, alignItems: 'center',
    marginBottom: 24, borderWidth: 1.5, borderColor: Colors.primary + '30',
  },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end' },
  priceAmount: { fontSize: 42, fontWeight: '800', color: Colors.primary },
  pricePeriod: { fontSize: 18, fontWeight: '600', color: Colors.primary, marginBottom: 6 },
  priceNote: { fontSize: 13, color: Colors.textSecondary, marginTop: 4 },

  ctaGroup: { gap: 12, marginBottom: 16 },
  trialBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 15, borderRadius: 14,
    borderWidth: 2, borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  trialBtnText: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  subscribeBtn: {
    paddingVertical: 16, borderRadius: 14,
    backgroundColor: Colors.primary, alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 6,
  },
  subscribeBtnText: { fontSize: 16, fontWeight: '700', color: Colors.white },
  btnDisabled: { opacity: 0.6 },

  trialSubNote: { fontSize: 12, color: Colors.textSecondary, textAlign: 'center' },

  legal: {
    fontSize: 11, color: Colors.textTertiary,
    textAlign: 'center', lineHeight: 16,
  },
});
