import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius } from '../../src/constants/Colors';
import { sellerService } from '../../src/api/seller.service';
import EmptyState from '../../src/components/EmptyState';
import LoadingSkeleton from '../../src/components/LoadingSkeleton';
import StatusBadge from '../../src/components/StatusBadge';
import { formatCurrency, formatDate, getImageUrl } from '../../src/utils/helpers';
import Toast from 'react-native-toast-message';

export default function SellerEarningsScreen() {
  const [earnings, setEarnings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEarnings = async () => {
    try {
      const data = await sellerService.getEarnings();
      setEarnings(data || []);
    } catch (error) {
      console.warn(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  const handleAction = (id: string, action: 'confirm' | 'reject') => {
    Alert.alert(`Confirm ${action === 'confirm' ? 'Receipt' : 'Rejection'}`, 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            if (action === 'confirm') await sellerService.confirmPayoutReceipt(id);
            else await sellerService.rejectPayoutReceipt(id);
            Toast.show({ type: 'success', text1: 'Status updated' });
            fetchEarnings();
          } catch (e) {
            Toast.show({ type: 'error', text1: 'Failed to update status' });
          }
        }
      }
    ]);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.date}>{formatDate(item.earned_at)}</Text>
        <StatusBadge status={item.status} size="sm" />
      </View>

      <Text style={styles.amount}>{formatCurrency(item.amount)}</Text>
      <Text style={styles.bookingRef}>Booking Ref: {item.booking_id}</Text>

      {item.status === 'paid' && (
        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={styles.viewProofBtn} 
            onPress={() => item.payout_proof_path && Linking.openURL(getImageUrl(item.payout_proof_path))}
          >
            <Ionicons name="document-text" size={16} color={Colors.white} />
            <Text style={styles.btnText}>View Receipt</Text>
          </TouchableOpacity>
          <View style={styles.confirmBtns}>
            <TouchableOpacity style={styles.iconBtnC} onPress={() => handleAction(item.id, 'confirm')}>
              <Ionicons name="checkmark" size={18} color={Colors.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtnR} onPress={() => handleAction(item.id, 'reject')}>
              <Ionicons name="close" size={18} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Earnings & Payouts</Text>
      </View>

      {loading ? (
        <View style={{ padding: 20 }}><LoadingSkeleton type="list" count={4} /></View>
      ) : (
        <FlatList
          data={earnings}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchEarnings(); }} />}
          ListEmptyComponent={<EmptyState icon="wallet" title="No Earnings" subtitle="You haven't earned any commissions yet." />}
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
  date: { fontSize: 12, fontWeight: '600', color: Colors.textLight },
  amount: { fontSize: 24, fontWeight: '800', color: Colors.success, marginBottom: 4 },
  bookingRef: { fontSize: 12, color: Colors.gray400, fontFamily: 'monospace' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: Colors.gray100 },
  viewProofBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.info, paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.lg, gap: 6 },
  btnText: { color: Colors.white, fontSize: 11, fontWeight: '800' },
  confirmBtns: { flexDirection: 'row', gap: 8 },
  iconBtnC: { width: 32, height: 32, borderRadius: Radius.md, backgroundColor: Colors.success, alignItems: 'center', justifyContent: 'center' },
  iconBtnR: { width: 32, height: 32, borderRadius: Radius.md, backgroundColor: Colors.error, alignItems: 'center', justifyContent: 'center' },
});
