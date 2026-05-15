import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { Colors, Radius } from '../../src/constants/Colors';
import { vehiclesService } from '../../src/api/vehicles.service';
import { bookingsService } from '../../src/api/bookings.service';
import { useAuth } from '../../src/context/AuthContext';
import { formatCurrency, parseImages } from '../../src/utils/helpers';
import ImageGallery from '../../src/components/ImageGallery';
import ThemedButton from '../../src/components/ThemedButton';
import LoadingSkeleton from '../../src/components/LoadingSkeleton';
import BookingModal from '../../src/components/BookingModal';

export default function CarDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await vehiclesService.getById(id!);
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
  const price = data.purpose === 'rent' ? data.daily_rate : data.sale_price;

  const SpecItem = ({ icon, label, value }: any) => (
    <View style={styles.specItem}>
      <View style={styles.specIcon}><Ionicons name={icon} size={20} color={Colors.primaryDark} /></View>
      <View>
        <Text style={styles.specLabel}>{label}</Text>
        <Text style={styles.specValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <View style={styles.galleryWrap}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.primaryDark} />
          </TouchableOpacity>
          <ImageGallery images={images} height={300} />
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>FOR {data.purpose.toUpperCase()}</Text>
              </View>
              <View style={[styles.badge, data.status === 'available' ? styles.badgeSuccess : styles.badgeError]}>
                <Text style={[styles.badgeText, data.status === 'available' ? styles.textSuccess : styles.textError]}>{data.status.replace('_', ' ')}</Text>
              </View>
            </View>
            <Text style={styles.title}>{data.make} {data.model}</Text>
            <Text style={styles.yearText}>{data.year} Model</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Specifications</Text>
            <View style={styles.specsGrid}>
              <SpecItem icon="color-palette" label="Color" value={data.color || 'N/A'} />
              <SpecItem icon="people" label="Seats" value={data.seating_capacity || data.seats || 'N/A'} />
              <SpecItem icon="speedometer" label="Transmission" value={data.transmission} />
              <SpecItem icon="water" label="Fuel" value={data.fuel_type} />
              <SpecItem icon="car" label="Type" value={data.vehicle_type || 'N/A'} />
            </View>
          </View>

          {data.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{data.description}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Booking Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceCol}>
          <Text style={styles.priceLabel}>Price {data.purpose === 'rent' ? 'per day' : ''}</Text>
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
        itemType="vehicle" 
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
  badge: { backgroundColor: Colors.orange50, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: Radius.full },
  badgeSuccess: { backgroundColor: Colors.green50 },
  badgeError: { backgroundColor: Colors.red50 },
  badgeText: { fontSize: 10, fontWeight: '800', color: Colors.accentOrange, letterSpacing: 1, textTransform: 'uppercase' },
  textSuccess: { color: Colors.success },
  textError: { color: Colors.error },
  title: { fontSize: 26, fontWeight: '800', color: Colors.primaryDark, marginBottom: 4 },
  yearText: { fontSize: 16, color: Colors.textLight, fontWeight: '600' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.primaryDark, marginBottom: 16 },
  specsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  specItem: { flexDirection: 'row', alignItems: 'center', gap: 12, width: '45%', marginBottom: 8 },
  specIcon: { width: 40, height: 40, borderRadius: Radius.lg, backgroundColor: Colors.gray50, alignItems: 'center', justifyContent: 'center' },
  specLabel: { fontSize: 11, color: Colors.textLight, fontWeight: '600', marginBottom: 2 },
  specValue: { fontSize: 14, color: Colors.textDark, fontWeight: '800', textTransform: 'capitalize' },
  description: { fontSize: 14, lineHeight: 24, color: Colors.textLight },
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
