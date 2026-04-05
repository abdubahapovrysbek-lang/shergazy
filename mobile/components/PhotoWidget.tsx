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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Card } from './Card';

const { width } = Dimensions.get('window');
const PREVIEW_HEIGHT = 220;

type PickedImage = { uri: string; width: number; height: number };

export function PhotoWidget() {
  const [image, setImage] = useState<PickedImage | null>(null);
  const [loading, setLoading] = useState(false);

  async function requestPermission(type: 'camera' | 'library') {
    if (type === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return status === 'granted';
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  }

  async function handleCamera() {
    const granted = await requestPermission('camera');
    if (!granted) {
      Alert.alert(
        'Camera Permission',
        'Camera access is required to take a photo. Please enable it in your device settings.',
      );
      return;
    }
    setLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.85,
        allowsEditing: true,
        aspect: [4, 3],
      });
      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        setImage({ uri: asset.uri, width: asset.width, height: asset.height });
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGallery() {
    const granted = await requestPermission('library');
    if (!granted) {
      Alert.alert(
        'Photo Library Permission',
        'Photo library access is required to pick an image. Please enable it in your device settings.',
      );
      return;
    }
    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.85,
        allowsEditing: true,
        aspect: [4, 3],
      });
      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        setImage({ uri: asset.uri, width: asset.width, height: asset.height });
      }
    } finally {
      setLoading(false);
    }
  }

  function handleRemove() {
    Alert.alert('Remove Photo', 'Are you sure you want to remove this photo?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => setImage(null) },
    ]);
  }

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
        <Text style={styles.widgetSubtitle}>Upload or photograph your homework</Text>
      </View>

      {/* Preview or empty state */}
      {loading ? (
        <View style={styles.placeholder}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading image…</Text>
        </View>
      ) : image ? (
        <View style={styles.previewWrapper}>
          <Image
            source={{ uri: image.uri }}
            style={styles.preview}
            resizeMode="cover"
          />
          {/* Overlay actions */}
          <View style={styles.previewOverlay}>
            <TouchableOpacity style={styles.overlayBtn} onPress={handleCamera}>
              <Ionicons name="camera-reverse-outline" size={18} color={Colors.white} />
              <Text style={styles.overlayBtnText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.overlayBtn, styles.overlayBtnDanger]} onPress={handleRemove}>
              <Ionicons name="trash-outline" size={18} color={Colors.white} />
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

      {/* Action buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleCamera} activeOpacity={0.8}>
          <Ionicons name="camera-outline" size={20} color={Colors.primary} />
          <Text style={styles.actionBtnText}>Take Photo</Text>
        </TouchableOpacity>
        <View style={styles.actionDivider} />
        <TouchableOpacity style={styles.actionBtn} onPress={handleGallery} activeOpacity={0.8}>
          <Ionicons name="images-outline" size={20} color={Colors.primary} />
          <Text style={styles.actionBtnText}>Upload Photo</Text>
        </TouchableOpacity>
      </View>

      {image && (
        <TouchableOpacity style={styles.analyzeBtn} activeOpacity={0.85}>
          <Ionicons name="sparkles" size={18} color={Colors.white} />
          <Text style={styles.analyzeBtnText}>Analyze Problem</Text>
        </TouchableOpacity>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 24, padding: 0, overflow: 'hidden' },

  widgetHeader: { padding: 16, paddingBottom: 12 },
  widgetTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
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
  preview: {
    width: '100%',
    height: '100%',
  },
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
  analyzeBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },
});
