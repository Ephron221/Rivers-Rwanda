import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Colors, Radius } from '../../src/constants/Colors';
import { sellerService } from '../../src/api/seller.service';
import StatusBadge from '../../src/components/StatusBadge';
import EmptyState from '../../src/components/EmptyState';
import LoadingSkeleton from '../../src/components/LoadingSkeleton';
import { formatCurrency, formatDate } from '../../src/utils/helpers';

export default function SellerBookingsScreen() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = async () => {
    try {
      const data = await sellerService.getBookings();
      setBookings(data || []);
    } catch (error) {
      console.warn('Error fetching bookings', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.refText}>Ref: {item.booking_reference}</Text>
        <StatusBadge status={item.booking_status} size="sm" />
      </View>
      <Text style={styles.propertyName}>{item.property_name || 'Listing'}</Text>
      
      <View style={styles.clientInfo}>
        <Text style={styles.clientLabel}>Client:</Text>
        <Text style={styles.clientName}>{item.client_name || 'Unknown'}</Text>
      </View>

      <View style={styles.infoRow}>
        <View>
          <Text style={styles.infoLabel}>Amount</Text>
          <Text style={styles.priceText}>{formatCurrency(item.total_amount)}</Text>
        </View>
        <View>
          <Text style={styles.infoLabel}>Date</Text>
          <Text style={styles.dateText}>{formatDate(item.created_at)}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Received Bookings</Text>
      </View>

      {loading ? (
        <View style={{ padding: 20 }}><LoadingSkeleton type="list" count={4} /></View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchBookings(); }} />}
          ListEmptyComponent={<EmptyState icon="calendar" title="No Bookings" subtitle="You haven't received any bookings yet." />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.lightGray },
  header: { padding: 24, paddingTop: 60, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: Colors.primaryDark },
  list: { padding: 20 },
  card: { backgroundColor: Colors.white, borderRadius: Radius.xl, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  refText: { fontSize: 11, color: Colors.textLight, fontFamily: 'monospace' },
  propertyName: { fontSize: 16, fontWeight: '800', color: Colors.primaryDark, marginBottom: 8 },
  clientInfo: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  clientLabel: { fontSize: 12, color: Colors.textLight },
  clientName: { fontSize: 13, fontWeight: '600', color: Colors.textDark },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: Colors.gray50, padding: 12, borderRadius: Radius.lg },
  infoLabel: { fontSize: 10, color: Colors.gray400, textTransform: 'uppercase', fontWeight: '700', marginBottom: 4 },
  priceText: { fontSize: 14, fontWeight: '800', color: Colors.accentOrange },
  dateText: { fontSize: 13, fontWeight: '700', color: Colors.primaryDark },
});
