import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Platform, Alert } from 'react-native';
import { Colors, Radius } from '../../src/constants/Colors';
import { bookingsService } from '../../src/api/bookings.service';
import StatusBadge from '../../src/components/StatusBadge';
import EmptyState from '../../src/components/EmptyState';
import Toast from 'react-native-toast-message';
import LoadingSkeleton from '../../src/components/LoadingSkeleton';
import { formatCurrency, formatDate } from '../../src/utils/helpers';
import { Ionicons } from '@expo/vector-icons';

export default function BookingsScreen() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = async () => {
    try {
      const data = await bookingsService.getMyBookings();
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

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const getIcon = (type: string) => {
    if (type.includes('house')) return 'home';
    if (type.includes('vehicle')) return 'car';
    return 'bed';
  };

  const handleCancel = (id: string) => {
    Alert.alert('Cancel Booking', 'Are you sure you want to cancel this booking?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, Cancel',
        style: 'destructive',
        onPress: async () => {
          try {
            await bookingsService.cancel(id);
            Toast.show({ type: 'success', text1: 'Booking cancelled successfully' });
            fetchBookings();
          } catch (error) {
            Toast.show({ type: 'error', text1: 'Failed to cancel booking' });
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.typeWrap}>
          <View style={styles.iconBox}>
            <Ionicons name={getIcon(item.booking_type) as any} size={16} color={Colors.primaryDark} />
          </View>
          <Text style={styles.typeText}>{item.booking_type.replace('_', ' ')}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <StatusBadge status={item.booking_status} />
          {item.payment_status && (
            <Text style={styles.paymentStatus}>
              {item.payment_status.replace('_', ' ').toUpperCase()}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.propertyName} numberOfLines={1}>
          {item.property_name || 'Property'}
        </Text>
        <Text style={styles.refText}>Ref: {item.booking_reference}</Text>

        <View style={styles.infoRow}>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Total Amount</Text>
            <Text style={styles.priceText}>{formatCurrency(item.total_amount)}</Text>
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Dates</Text>
            {item.start_date && item.end_date ? (
              <Text style={styles.dateText}>{formatDate(item.start_date)} - {formatDate(item.end_date)}</Text>
            ) : item.start_date ? (
              <Text style={styles.dateText}>From {formatDate(item.start_date)}</Text>
            ) : (
              <Text style={styles.dateText}>{formatDate(item.created_at)}</Text>
            )}
          </View>
        </View>
      </View>

      {item.booking_status === 'pending' && (
        <View style={styles.cardFooter}>
          <Text style={styles.pendingHint}>Awaiting confirmation</Text>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => handleCancel(item.id)}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>YOUR HISTORY</Text>
        <Text style={styles.headerTitle}>My Bookings</Text>
      </View>

      {loading ? (
        <View style={{ padding: 20 }}>
          <LoadingSkeleton type="list" count={4} />
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          scrollIndicatorInsets={{ bottom: 10 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.accentOrange]} />}
          ListEmptyComponent={
            <EmptyState
              icon="calendar-outline"
              title="No Bookings Yet"
              subtitle="You haven't made any bookings yet. Start exploring properties!"
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGray,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.accentOrange,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.primaryDark,
    letterSpacing: -0.5,
  },
  listContent: {
    padding: 20,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  typeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  paymentStatus: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.textLight,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  cardBody: {},
  propertyName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryDark,
    marginBottom: 4,
  },
  refText: {
    fontSize: 12,
    color: Colors.textLight,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.gray50,
    padding: 12,
    borderRadius: Radius.lg,
  },
  infoCol: {},
  infoLabel: {
    fontSize: 10,
    color: Colors.gray400,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginBottom: 4,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.accentOrange,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  cardFooter: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pendingHint: {
    fontSize: 11,
    color: Colors.warning,
    fontWeight: '600',
  },
  cancelBtn: {
    backgroundColor: Colors.red50,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.md,
  },
  cancelBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.error,
    textTransform: 'uppercase',
  },
});
