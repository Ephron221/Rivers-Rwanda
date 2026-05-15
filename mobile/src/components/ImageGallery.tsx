import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Text,
  FlatList,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius } from '../constants/Colors';
import { getImageUrl } from '../utils/helpers';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ImageGalleryProps {
  images: string[];
  height?: number;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, height = 260 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreenVisible, setFullscreenVisible] = useState(false);

  const placeholderImage = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800';

  const displayImages = images.length > 0
    ? images.map(img => getImageUrl(img))
    : [placeholderImage];

  return (
    <View style={[styles.container, { height }]}>
      <FlatList
        data={displayImages}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setCurrentIndex(idx);
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setFullscreenVisible(true)}
            activeOpacity={0.95}
          >
            <Image
              source={{ uri: item }}
              style={[styles.image, { width: SCREEN_WIDTH, height }]}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
      />

      {/* Dot indicators */}
      {displayImages.length > 1 && (
        <View style={styles.dots}>
          {displayImages.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, index === currentIndex && styles.dotActive]}
            />
          ))}
        </View>
      )}

      {/* Image count badge */}
      {displayImages.length > 1 && (
        <View style={styles.countBadge}>
          <Ionicons name="images-outline" size={12} color={Colors.white} />
          <Text style={styles.countText}>{currentIndex + 1}/{displayImages.length}</Text>
        </View>
      )}

      {/* Fullscreen Modal */}
      <Modal visible={fullscreenVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setFullscreenVisible(false)}
          >
            <Ionicons name="close" size={24} color={Colors.white} />
          </TouchableOpacity>
          <FlatList
            data={displayImages}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={styles.fullImage}
                resizeMode="contain"
              />
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: Colors.gray100,
  },
  image: {},
  dots: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  dotActive: {
    backgroundColor: Colors.accentOrange,
    width: 18,
  },
  countBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  countText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 999,
    padding: 10,
  },
  fullImage: {
    width: SCREEN_WIDTH,
    height: '100%',
  },
});

export default ImageGallery;
