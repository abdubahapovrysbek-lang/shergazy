import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '../constants/Colors';
import { useAuth } from '../context/AuthContext';

type AuthMode = 'login' | 'signup';

export default function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing fields', 'Please enter your email and password.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak password', 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await signIn(email.trim(), password);
      } else {
        await signUp(email.trim(), password, fullName.trim() || undefined);
      }
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Brand */}
          <View style={styles.brand}>
            <View style={styles.logoBox}>
              <Ionicons name="calculator" size={36} color={Colors.white} />
            </View>
            <Text style={styles.appName}>Rysbek AI</Text>
            <Text style={styles.tagline}>Your AI-powered math tutor</Text>
          </View>

          {/* Mode toggle */}
          <View style={styles.modeToggle}>
            <TouchableOpacity
              style={[styles.modeBtn, mode === 'login' && styles.modeBtnActive]}
              onPress={() => setMode('login')}
            >
              <Text style={[styles.modeBtnText, mode === 'login' && styles.modeBtnTextActive]}>
                Sign In
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeBtn, mode === 'signup' && styles.modeBtnActive]}
              onPress={() => setMode('signup')}
            >
              <Text style={[styles.modeBtnText, mode === 'signup' && styles.modeBtnTextActive]}>
                Create Account
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {mode === 'signup' && (
              <View style={styles.inputWrap}>
                <Ionicons name="person-outline" size={18} color={Colors.textTertiary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full name (optional)"
                  placeholderTextColor={Colors.textTertiary}
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </View>
            )}

            <View style={styles.inputWrap}>
              <Ionicons name="mail-outline" size={18} color={Colors.textTertiary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor={Colors.textTertiary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color={Colors.textTertiary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.inputPassword]}
                placeholder="Password (min. 6 characters)"
                placeholderTextColor={Colors.textTertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
              />
              <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.eyeBtn}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={Colors.textTertiary}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color={Colors.white} size="small" />
              ) : (
                <Text style={styles.submitBtnText}>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Trial hint on signup */}
          {mode === 'signup' && (
            <View style={styles.trialHint}>
              <Ionicons name="gift-outline" size={16} color={Colors.success} />
              <Text style={styles.trialHintText}>
                New accounts include a 7-day free Premium trial
              </Text>
            </View>
          )}

          {/* Footer toggle */}
          <TouchableOpacity
            style={styles.footerToggle}
            onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}
          >
            <Text style={styles.footerText}>
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <Text style={styles.footerLink}>
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
    justifyContent: 'center',
  },

  brand: { alignItems: 'center', marginBottom: 40 },
  logoBox: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35, shadowRadius: 16, elevation: 10,
  },
  appName: { fontSize: 32, fontWeight: '800', color: Colors.text, letterSpacing: -0.5 },
  tagline: { fontSize: 15, color: Colors.textSecondary, marginTop: 4 },

  modeToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 14,
    padding: 4,
    marginBottom: 28,
  },
  modeBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 11, alignItems: 'center',
  },
  modeBtnActive: { backgroundColor: Colors.white, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  modeBtnText: { fontSize: 15, fontWeight: '600', color: Colors.textSecondary },
  modeBtnTextActive: { color: Colors.text },

  form: { gap: 14, marginBottom: 20 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: 14, paddingHorizontal: 14,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: Colors.text, paddingVertical: 14 },
  inputPassword: { paddingRight: 8 },
  eyeBtn: { padding: 4 },

  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14, paddingVertical: 16,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 6,
    marginTop: 4,
  },
  submitBtnDisabled: { opacity: 0.65 },
  submitBtnText: { fontSize: 16, fontWeight: '700', color: Colors.white },

  trialHint: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.successLight,
    borderRadius: 12, padding: 12, marginBottom: 20,
  },
  trialHintText: { fontSize: 13, color: Colors.success, fontWeight: '600', flex: 1 },

  footerToggle: { alignItems: 'center', paddingVertical: 8 },
  footerText: { fontSize: 14, color: Colors.textSecondary },
  footerLink: { color: Colors.primary, fontWeight: '700' },
});
