import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Colors, Radius } from '../constants/Colors';

interface LoadingSkeletonProps {
  type?: 'card' | 'list' | 'detail' | 'stat';
  count?: number;
}

const SkeletonBox = ({ width, height, borderRadius = Radius.md, style = {} }: any) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(animatedValue, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const opacity = animatedValue.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.9] });

  return (
    <Animated.View
      style={[{ width, height, borderRadius, backgroundColor: Colors.gray200, opacity }, style]}
    />
  );
};

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type = 'card', count = 3 }) => {
  if (type === 'card') {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <View key={i} style={styles.cardSkeleton}>
            <SkeletonBox width="100%" height={200} borderRadius={Radius.xl} />
            <View style={styles.cardBody}>
              <SkeletonBox width="70%" height={20} borderRadius={6} style={{ marginBottom: 8 }} />
              <SkeletonBox width="50%" height={14} borderRadius={6} style={{ marginBottom: 16 }} />
              <SkeletonBox width="100%" height={40} borderRadius={Radius.lg} />
            </View>
          </View>
        ))}
      </>
    );
  }

  if (type === 'list') {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <View key={i} style={styles.listSkeleton}>
            <SkeletonBox width={56} height={56} borderRadius={Radius.xl} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <SkeletonBox width="60%" height={16} borderRadius={6} style={{ marginBottom: 8 }} />
              <SkeletonBox width="40%" height={12} borderRadius={6} />
            </View>
            <SkeletonBox width={60} height={24} borderRadius={Radius.full} />
          </View>
        ))}
      </>
    );
  }

  if (type === 'stat') {
    return (
      <View style={styles.statsRow}>
        {Array.from({ length: count }).map((_, i) => (
          <View key={i} style={styles.statSkeleton}>
            <SkeletonBox width={44} height={44} borderRadius={Radius.lg} style={{ marginBottom: 12 }} />
            <SkeletonBox width="80%" height={10} borderRadius={4} style={{ marginBottom: 8 }} />
            <SkeletonBox width="60%" height={22} borderRadius={6} />
          </View>
        ))}
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  cardSkeleton: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xxl,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.gray100,
  },
  cardBody: {
    padding: 16,
  },
  listSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.gray100,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  statSkeleton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.gray100,
  },
});

export default LoadingSkeleton;
