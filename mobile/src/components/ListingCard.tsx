import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '../constants/Colors';
import { formatCurrency, getImageUrl, parseImages, truncate } from '../utils/helpers';

interface ListingCardProps {
  item: any;
  type: 'accommodation' | 'vehicle' | 'house';
  onPress: () => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ item, type, onPress }) => {
  const images = parseImages(item.images);
  const imageUrl = images.length > 0
    ? getImageUrl(images[0])
    : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800';

  const getTitle = () => {
    if (type === 'vehicle') return `${item.make} ${item.model}`;
    if (type === 'house') return item.title;
    return item.name;
  };

  const getPrice = () => {
    if (type === 'vehicle') {
      const p = item.purpose === 'rent' ? item.daily_rate : item.sale_price;
      return `${formatCurrency(p)}${item.purpose === 'rent' ? '/day' : ''}`;
    }
    if (type === 'house') return formatCurrency(item.price);
    const p = item.price_per_night || item.price_per_event || item.sale_price;
    return `${formatCurrency(p)}${item.price_per_night ? '/night' : ''}`;
  };

  const getSubtitle = () => {
    if (type === 'vehicle') return `${item.year} · ${item.fuel_type} · ${item.transmission}`;
    return `${item.district || ''}, ${item.city || ''}`;
  };

  const getTypeBadge = () => {
    if (type === 'accommodation') {
      return item.type?.replace(/_/g, ' ').toUpperCase() || 'ACCOMMODATION';
    }
    if (type === 'vehicle') return item.purpose === 'rent' ? 'FOR RENT' : 'FOR SALE';
    return item.purpose === 'rent' ? 'FOR RENT' : 'FOR SALE';
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>{getTypeBadge()}</Text>
        </View>
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>{getPrice()}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>{getTitle()}</Text>
        <View style={styles.subtitleRow}>
          <Ionicons
            name={type === 'vehicle' ? 'car-outline' : 'location-outline'}
            size={13}
            color={Colors.accentOrange}
          />
          <Text style={styles.subtitle} numberOfLines={1}>{getSubtitle()}</Text>
        </View>

        {type === 'accommodation' && (
          <View style={styles.amenitiesRow}>
            {!!item.wifi && <AmenityChip icon="wifi" label="WiFi" />}
            {!!item.parking && <AmenityChip icon="car" label="Parking" />}
            {!!item.gym && <AmenityChip icon="fitness" label="Gym" />}
          </View>
        )}

        <View style={styles.footer}>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Ionicons key={s} name="star" size={11} color={Colors.accentOrange} />
            ))}
          </View>
          <View style={styles.viewBtn}>
            <Text style={styles.viewBtnText}>View Details</Text>
            <Ionicons name="arrow-forward" size={14} color={Colors.white} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const AmenityChip = ({ icon, label }: { icon: any; label: string }) => (
  <View style={styles.amenityChip}>
    <Ionicons name={`${icon}-outline` as any} size={11} color={Colors.primaryDark} />
    <Text style={styles.amenityText}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xxl,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.gray100,
  },
  imageContainer: {
    height: 200,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  typeBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(15, 41, 77, 0.9)',
    borderRadius: Radius.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  typeBadgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  priceBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: Colors.accentOrange,
    borderRadius: Radius.lg,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  priceText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '800',
  },
  body: {
    padding: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.primaryDark,
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textLight,
    fontWeight: '600',
    flex: 1,
  },
  amenitiesRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.gray100,
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  amenityText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primaryDark,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.lg,
  },
  viewBtnText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

export default ListingCard;
