import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { Colors, Radius } from '../../src/constants/Colors';
import { accommodationsService } from '../../src/api/accommodations.service';
import { bookingsService } from '../../src/api/bookings.service';
import { useAuth } from '../../src/context/AuthContext';
import { formatCurrency, parseImages } from '../../src/utils/helpers';
import ImageGallery from '../../src/components/ImageGallery';
import ThemedButton from '../../src/components/ThemedButton';
import LoadingSkeleton from '../../src/components/LoadingSkeleton';
import BookingModal from '../../src/components/BookingModal';

export default function AccommodationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await accommodationsService.getById(id!);
        setData(res);
      } catch (error) {
        console.warn(error);
        Toast.show({ type: 'error', text1: 'Error loading details' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleBookNow = () => {
    if (!user) {
      Toast.show({ type: 'info', text1: 'Please login to book' });
      router.push('/(auth)/login');
      return;
    }
    setIsBookingModalVisible(true);
  };

  if (loading) return <View style={{ flex: 1, padding: 20, paddingTop: 60 }}><LoadingSkeleton type="detail" /></View>;
  if (!data) return <View style={styles.center}><Text>Not found</Text></View>;

  const images = parseImages(data.images);
  const price = data.price_per_night || data.price_per_event || data.sale_price;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <View style={styles.galleryWrap}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.primaryDark} />
          </TouchableOpacity>
          <ImageGallery images={images} height={350} />
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.badgeRow}>
              <View style={styles.badge}><Text style={styles.badgeText}>{data.type.replace('_', ' ')} {data.sub_type ? `(${data.sub_type})` : ''}</Text></View>
              <View style={[styles.badge, data.status === 'available' ? styles.badgeSuccess : styles.badgeError]}>
                <Text style={[styles.badgeText, data.status === 'available' ? styles.textSuccess : styles.textError]}>{data.status.replace('_', ' ')}</Text>
              </View>
            </View>
            <Text style={styles.title}>{data.name}</Text>
            {data.room_name_number && (
              <Text style={styles.roomText}>Room: {data.room_name_number}</Text>
            )}
            <View style={styles.locationRow}>
              <Ionicons name="location" size={16} color={Colors.accentOrange} />
              <Text style={styles.locationText}>{data.street_address ? `${data.street_address}, ` : ''}{data.district}, {data.city}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <View style={styles.specsGrid}>
              {data.floor_number !== null && data.floor_number !== undefined && (
                <View style={styles.specItem}>
                  <View style={styles.specIcon}><Ionicons name="layers" size={20} color={Colors.primaryDark} /></View>
                  <View>
                    <Text style={styles.specLabel}>Floor</Text>
                    <Text style={styles.specValue}>{data.floor_number}</Text>
                  </View>
                </View>
              )}
              {data.bed_type && (
                <View style={styles.specItem}>
                  <View style={styles.specIcon}><Ionicons name="bed" size={20} color={Colors.primaryDark} /></View>
                  <View>
                    <Text style={styles.specLabel}>Bed Type</Text>
                    <Text style={styles.specValue}>{data.bed_type}</Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{data.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesGrid}>
              {[
                { key: 'wifi', icon: 'wifi', label: 'Free WiFi' },
                { key: 'parking', icon: 'car', label: 'Parking' },
                { key: 'gym', icon: 'barbell', label: 'Gym' },
                { key: 'swimming_pool', icon: 'water', label: 'Pool' },
                { key: 'kitchen', icon: 'restaurant', label: 'Kitchen' },
                { key: 'garden', icon: 'leaf', label: 'Garden' },
                { key: 'toilet', icon: 'water-outline', label: 'Bathroom' },
                { key: 'living_room', icon: 'tv', label: 'Living Room' },
                { key: 'decoration', icon: 'sparkles', label: 'Decoration' },
                { key: 'has_elevator', icon: 'business', label: 'Elevator' },
                { key: 'is_furnished', icon: 'cube', label: 'Furnished' },
              ].map(a => data[a.key] ? (
                <View key={a.key} style={styles.amenityItem}>
                  <Ionicons name={a.icon as any} size={20} color={Colors.primaryDark} />
                  <Text style={styles.amenityText}>{a.label}</Text>
                </View>
              ) : null)}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Booking Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceCol}>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.priceValue}>{formatCurrency(price)}</Text>
        </View>
        
        <View style={styles.actionCol}>
          <ThemedButton 
            title="Book Now" 
            onPress={handleBookNow} 
            style={{ flex: 1 }}
          />
        </View>
      </View>
      <BookingModal 
        visible={isBookingModalVisible} 
        onClose={() => setIsBookingModalVisible(false)} 
        item={data} 
        itemType="accommodation" 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { flex: 1 },
  galleryWrap: { position: 'relative' },
  backBtn: {
    position: 'absolute', top: 50, left: 20, zIndex: 10,
    backgroundColor: Colors.white, borderRadius: Radius.full, padding: 8,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 4,
  },
  content: { padding: 24, paddingBottom: 100 },
  header: { marginBottom: 24 },
  badgeRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  badge: { backgroundColor: Colors.blue50, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: Radius.full },
  badgeSuccess: { backgroundColor: Colors.green50 },
  badgeError: { backgroundColor: Colors.red50 },
  badgeText: { fontSize: 10, fontWeight: '800', color: Colors.info, textTransform: 'uppercase', letterSpacing: 1 },
  textSuccess: { color: Colors.success },
  textError: { color: Colors.error },
  title: { fontSize: 26, fontWeight: '800', color: Colors.primaryDark, marginBottom: 4 },
  roomText: { fontSize: 13, fontWeight: '800', color: Colors.accentOrange, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  locationText: { fontSize: 14, color: Colors.textLight, fontWeight: '600' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.primaryDark, marginBottom: 12 },
  specsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  specItem: { flexDirection: 'row', alignItems: 'center', gap: 12, width: '45%', marginBottom: 8 },
  specIcon: { width: 40, height: 40, borderRadius: Radius.lg, backgroundColor: Colors.gray50, alignItems: 'center', justifyContent: 'center' },
  specLabel: { fontSize: 11, color: Colors.textLight, fontWeight: '600', marginBottom: 2 },
  specValue: { fontSize: 14, color: Colors.textDark, fontWeight: '800', textTransform: 'uppercase' },
  description: { fontSize: 14, lineHeight: 24, color: Colors.textLight },
  amenitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  amenityItem: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.gray50, paddingHorizontal: 16, paddingVertical: 12, borderRadius: Radius.xl, width: '47%' },
  amenityText: { fontSize: 13, fontWeight: '600', color: Colors.textDark },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.gray100,
    paddingHorizontal: 24, paddingTop: 16, paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 20,
  },
  priceCol: { flex: 1 },
  priceLabel: { fontSize: 11, fontWeight: '700', color: Colors.textLight, textTransform: 'uppercase', marginBottom: 2 },
  priceValue: { fontSize: 22, fontWeight: '800', color: Colors.primaryDark },
  actionCol: { flex: 1.5, flexDirection: 'row', gap: 8 },
  uploadBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 2, borderColor: Colors.primaryDark, borderRadius: Radius.xl, height: 52,
  },
  uploadText: { fontSize: 13, fontWeight: '800', color: Colors.primaryDark, textTransform: 'uppercase' },
});
