import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius } from '../../src/constants/Colors';
import { adminService } from '../../src/api/admin.service';
import StatusBadge from '../../src/components/StatusBadge';
import EmptyState from '../../src/components/EmptyState';
import LoadingSkeleton from '../../src/components/LoadingSkeleton';
import { formatCurrency, formatDate } from '../../src/utils/helpers';

export default function AdminBookingsScreen() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = async () => {
    try {
      const data = await adminService.getAllBookings();
      setBookings(data || []);
    } catch (error) { console.warn(error); } 
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetchBookings(); }, []);

  const updateStatus = (id: string, current: string) => {
    const nextStatus = current === 'pending' ? 'approved' : current === 'approved' ? 'completed' : 'pending';
    Alert.alert('Update Status', `Change status to ${nextStatus}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Yes', onPress: async () => {
          await adminService.updateBookingStatus(id, nextStatus);
          fetchBookings();
        } 
      }
    ]);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.refText}>Ref: {item.booking_reference}</Text>
        <StatusBadge status={item.booking_status} size="sm" />
      </View>
      <Text style={styles.propertyName}>{item.property_name || 'Listing'}</Text>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Client:</Text>
        <Text style={styles.infoValue}>{item.client_name}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Amount:</Text>
        <Text style={styles.priceValue}>{formatCurrency(item.total_amount)}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Date:</Text>
        <Text style={styles.infoValue}>{formatDate(item.created_at)}</Text>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => updateStatus(item.id, item.booking_status)}>
          <Text style={styles.actionText}>Change Status</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={styles.headerTitle}>All Bookings</Text></View>
      {loading ? (
        <View style={{ padding: 20 }}><LoadingSkeleton type="list" count={4} /></View>
      ) : (
        <FlatList data={bookings} keyExtractor={(item) => item.id} renderItem={renderItem} contentContainerStyle={styles.list} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchBookings(); }} />} ListEmptyComponent={<EmptyState title="No Bookings" />} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.lightGray },
  header: { padding: 24, paddingTop: 60, paddingBottom: 16, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: Colors.primaryDark },
  list: { padding: 20 },
  card: { backgroundColor: Colors.white, borderRadius: Radius.xl, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  refText: { fontSize: 11, color: Colors.textLight, fontFamily: 'monospace' },
  propertyName: { fontSize: 16, fontWeight: '800', color: Colors.primaryDark, marginBottom: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  infoLabel: { fontSize: 12, color: Colors.textLight },
  infoValue: { fontSize: 13, fontWeight: '600', color: Colors.textDark },
  priceValue: { fontSize: 13, fontWeight: '800', color: Colors.accentOrange },
  actions: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: Colors.gray100 },
  actionBtn: { backgroundColor: Colors.primaryDark, padding: 10, borderRadius: Radius.lg, alignItems: 'center' },
  actionText: { color: Colors.white, fontSize: 12, fontWeight: '700' },
});
