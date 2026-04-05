import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Card } from './Card';
import { AnalysisResult } from './AnalysisResult';
import { analyzeMathImage, type MathAnalysis } from '../services/openai';

const { width } = Dimensions.get('window');
const PREVIEW_HEIGHT = 220;

type PickedImage = { uri: string; width: number; height: number };

type AnalysisState =
  | { status: 'idle' }
  | { status: 'analyzing' }
  | { status: 'done'; result: MathAnalysis }
  | { status: 'error'; message: string };

export function PhotoWidget() {
  const [image, setImage] = useState<PickedImage | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisState>({ status: 'idle' });

  // ── Permission helpers ───────────────────────────────────────────────────

  async function requestPermission(type: 'camera' | 'library') {
    if (type === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return status === 'granted';
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  }

  // ── Image picking ────────────────────────────────────────────────────────

  function applyAsset(asset: ImagePicker.ImagePickerAsset) {
    setImage({ uri: asset.uri, width: asset.width, height: asset.height });
    setAnalysis({ status: 'idle' });
  }

  async function handleCamera() {
    const granted = await requestPermission('camera');
    if (!granted) {
      Alert.alert('Camera Permission', 'Enable camera access in your device settings to take photos.');
      return;
    }
    setImageLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.85,
        allowsEditing: true,
        aspect: [4, 3],
      });
      if (!result.canceled && result.assets.length > 0) applyAsset(result.assets[0]);
    } finally {
      setImageLoading(false);
    }
  }

  async function handleGallery() {
    const granted = await requestPermission('library');
    if (!granted) {
      Alert.alert('Library Permission', 'Enable photo library access in your device settings to upload images.');
      return;
    }
    setImageLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.85,
        allowsEditing: true,
        aspect: [4, 3],
      });
      if (!result.canceled && result.assets.length > 0) applyAsset(result.assets[0]);
    } finally {
      setImageLoading(false);
    }
  }

  function handleRemove() {
    Alert.alert('Remove Photo', 'Remove this photo and its analysis?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          setImage(null);
          setAnalysis({ status: 'idle' });
        },
      },
    ]);
  }

  // ── OpenAI analysis ──────────────────────────────────────────────────────

  async function handleAnalyze() {
    if (!image) return;
    setAnalysis({ status: 'analyzing' });
    try {
      const result = await analyzeMathImage(image.uri);
      setAnalysis({ status: 'done', result });
    } catch (err: any) {
      const msg: string =
        err?.message?.includes('API key')
          ? 'Invalid API key. Check your .env file.'
          : err?.message?.includes('network') || err?.message?.includes('fetch')
          ? 'Network error. Check your internet connection.'
          : err?.message ?? 'Something went wrong. Please try again.';
      setAnalysis({ status: 'error', message: msg });
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────

  const isAnalyzing = analysis.status === 'analyzing';

  return (
    <Card style={styles.card}>
      {/* Widget header */}
      <View style={styles.widgetHeader}>
        <View style={styles.widgetTitleRow}>
          <View style={styles.widgetIconBg}>
            <Ionicons name="camera" size={16} color={Colors.primary} />
          </View>
          <Text style={styles.widgetTitle}>Scan a Problem</Text>
        </View>
        <Text style={styles.widgetSubtitle}>Upload or photograph your homework for an AI solution</Text>
      </View>

      {/* ── Image preview / placeholder ─────────────────────────────────── */}
      {imageLoading ? (
        <View style={styles.placeholder}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading image…</Text>
        </View>
      ) : image ? (
        <View style={styles.previewWrapper}>
          <Image source={{ uri: image.uri }} style={styles.preview} resizeMode="cover" />
          {/* Overlay controls */}
          <View style={styles.previewOverlay}>
            <TouchableOpacity style={styles.overlayBtn} onPress={handleCamera} disabled={isAnalyzing}>
              <Ionicons name="camera-reverse-outline" size={16} color={Colors.white} />
              <Text style={styles.overlayBtnText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.overlayBtn, styles.overlayBtnDanger]}
              onPress={handleRemove}
              disabled={isAnalyzing}
            >
              <Ionicons name="trash-outline" size={16} color={Colors.white} />
              <Text style={styles.overlayBtnText}>Remove</Text>
            </TouchableOpacity>
          </View>
          {/* Dimensions badge */}
          <View style={styles.dimBadge}>
            <Text style={styles.dimText}>{image.width} × {image.height}</Text>
          </View>
        </View>
      ) : (
        <TouchableOpacity style={styles.placeholder} onPress={handleGallery} activeOpacity={0.8}>
          <View style={styles.placeholderIcon}>
            <Ionicons name="image-outline" size={36} color={Colors.primary} />
          </View>
          <Text style={styles.placeholderTitle}>No photo yet</Text>
          <Text style={styles.placeholderHint}>Tap to upload, or use the buttons below</Text>
        </TouchableOpacity>
      )}

      {/* ── Upload / Camera buttons ─────────────────────────────────────── */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleCamera} activeOpacity={0.8} disabled={isAnalyzing}>
          <Ionicons name="camera-outline" size={20} color={Colors.primary} />
          <Text style={styles.actionBtnText}>Take Photo</Text>
        </TouchableOpacity>
        <View style={styles.actionDivider} />
        <TouchableOpacity style={styles.actionBtn} onPress={handleGallery} activeOpacity={0.8} disabled={isAnalyzing}>
          <Ionicons name="images-outline" size={20} color={Colors.primary} />
          <Text style={styles.actionBtnText}>Upload Photo</Text>
        </TouchableOpacity>
      </View>

      {/* ── Analyze button ──────────────────────────────────────────────── */}
      {image && analysis.status !== 'done' && (
        <TouchableOpacity
          style={[styles.analyzeBtn, isAnalyzing && styles.analyzeBtnLoading]}
          onPress={handleAnalyze}
          activeOpacity={0.85}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <ActivityIndicator size="small" color={Colors.white} />
              <Text style={styles.analyzeBtnText}>Analysing with AI…</Text>
            </>
          ) : (
            <>
              <Ionicons name="sparkles" size={18} color={Colors.white} />
              <Text style={styles.analyzeBtnText}>Analyze Problem</Text>
            </>
          )}
        </TouchableOpacity>
      )}

      {/* ── Analysis progress indicator ─────────────────────────────────── */}
      {isAnalyzing && (
        <View style={styles.analyzingBanner}>
          <View style={styles.analyzingDot} />
          <Text style={styles.analyzingText}>
            GPT-4o is reading your problem and building a step-by-step solution…
          </Text>
        </View>
      )}

      {/* ── Error state ─────────────────────────────────────────────────── */}
      {analysis.status === 'error' && (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle" size={18} color={Colors.accent} />
          <Text style={styles.errorText}>{analysis.message}</Text>
          <TouchableOpacity onPress={handleAnalyze}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Analysis result ─────────────────────────────────────────────── */}
      {analysis.status === 'done' && (
        <View style={styles.resultWrapper}>
          {/* Re-analyse / change photo strip */}
          <View style={styles.resultActions}>
            <TouchableOpacity style={styles.resultActionBtn} onPress={handleAnalyze}>
              <Ionicons name="refresh" size={14} color={Colors.primary} />
              <Text style={styles.resultActionText}>Re-analyse</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resultActionBtn} onPress={handleGallery}>
              <Ionicons name="swap-horizontal" size={14} color={Colors.textSecondary} />
              <Text style={[styles.resultActionText, { color: Colors.textSecondary }]}>Change photo</Text>
            </TouchableOpacity>
          </View>

          <AnalysisResult
            analysis={analysis.result}
            onDismiss={() => setAnalysis({ status: 'idle' })}
          />
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 24, padding: 0, overflow: 'hidden' },

  widgetHeader: { padding: 16, paddingBottom: 12 },
  widgetTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  widgetIconBg: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  widgetTitle: { fontSize: 16, fontWeight: '700', color: Colors.text },
  widgetSubtitle: { fontSize: 13, color: Colors.textSecondary, marginLeft: 36 },

  placeholder: {
    height: PREVIEW_HEIGHT,
    backgroundColor: Colors.primaryLight,
    marginHorizontal: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 6,
    borderWidth: 1.5,
    borderColor: Colors.primary + '30',
    borderStyle: 'dashed',
  },
  placeholderIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  placeholderTitle: { fontSize: 15, fontWeight: '600', color: Colors.text },
  placeholderHint: { fontSize: 13, color: Colors.textSecondary },
  loadingText: { fontSize: 14, color: Colors.textSecondary, marginTop: 8 },

  previewWrapper: {
    height: PREVIEW_HEIGHT,
    marginHorizontal: 16,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
  },
  preview: { width: '100%', height: '100%' },
  previewOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    gap: 8,
  },
  overlayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  overlayBtnDanger: { backgroundColor: 'rgba(220,50,50,0.75)' },
  overlayBtnText: { fontSize: 12, fontWeight: '600', color: Colors.white },
  dimBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  dimText: { fontSize: 11, color: Colors.white, fontWeight: '500' },

  actions: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    marginBottom: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
  },
  actionBtnText: { fontSize: 14, fontWeight: '600', color: Colors.primary },
  actionDivider: { width: 1, backgroundColor: Colors.border },

  analyzeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: Colors.primary,
  },
  analyzeBtnLoading: { backgroundColor: Colors.primaryDark, opacity: 0.85 },
  analyzeBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },

  analyzingBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: Colors.primaryLight,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 10,
    padding: 12,
  },
  analyzingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginTop: 4,
  },
  analyzingText: {
    flex: 1,
    fontSize: 13,
    color: Colors.primary,
    lineHeight: 18,
    fontWeight: '500',
  },

  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.accentLight,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 10,
    padding: 12,
  },
  errorText: { flex: 1, fontSize: 13, color: Colors.text, lineHeight: 18 },
  retryText: { fontSize: 13, fontWeight: '700', color: Colors.primary },

  resultWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  resultActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  resultActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  resultActionText: { fontSize: 13, fontWeight: '600', color: Colors.primary },
});
