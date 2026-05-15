import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius } from '../../src/constants/Colors';
import { adminService } from '../../src/api/admin.service';
import StatusBadge from '../../src/components/StatusBadge';
import EmptyState from '../../src/components/EmptyState';
import LoadingSkeleton from '../../src/components/LoadingSkeleton';
import { formatCurrency, formatDate, getImageUrl } from '../../src/utils/helpers';
import * as DocumentPicker from 'expo-document-picker';
import Toast from 'react-native-toast-message';

export default function AdminPaymentsScreen() {
  const [commissions, setCommissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCommissions = async () => {
    try {
      const data = await adminService.getAllCommissions();
      setCommissions(data || []);
    } catch (error) { console.warn(error); }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetchCommissions(); }, []);

  const handlePaySeller = async (id: string) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'image/*' });
      if (!result.canceled && result.assets.length > 0) {
        Alert.alert('Confirm Payment', 'Mark this commission as paid?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Yes, Pay', onPress: async () => {
              const formData = new FormData();
              formData.append('payout_proof', {
                uri: result.assets[0].uri,
                name: result.assets[0].name || 'receipt.jpg',
                type: result.assets[0].mimeType || 'image/jpeg',
              } as any);
              await adminService.markCommissionPaid(id, formData);
              Toast.show({ type: 'success', text1: 'Payment marked as paid' });
              fetchCommissions();
            }
          }
        ]);
      }
    } catch (e) { console.warn(e); }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.date}>{formatDate(item.earned_at)}</Text>
        <StatusBadge status={item.status} size="sm" />
      </View>
      <Text style={styles.amount}>{formatCurrency(item.amount)}</Text>
      <Text style={styles.seller}>Seller ID: {item.seller_id}</Text>

      <View style={styles.actions}>
        {item.status === 'approved' && (
          <TouchableOpacity style={styles.payBtn} onPress={() => handlePaySeller(item.id)}>
            <Ionicons name="cash" size={16} color={Colors.white} />
            <Text style={styles.payText}>Pay Seller & Upload Receipt</Text>
          </TouchableOpacity>
        )}
        {item.payout_proof_path && (
          <TouchableOpacity style={styles.viewBtn} onPress={() => Linking.openURL(getImageUrl(item.payout_proof_path))}>
            <Text style={styles.viewText}>View Receipt</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={styles.headerTitle}>Commissions & Payouts</Text></View>
      {loading ? (
        <View style={{ padding: 20 }}><LoadingSkeleton type="list" count={4} /></View>
      ) : (
        <FlatList data={commissions} keyExtractor={(item) => item.id} renderItem={renderItem} contentContainerStyle={styles.list} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchCommissions(); }} />} ListEmptyComponent={<EmptyState title="No Payouts" />} />
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  date: { fontSize: 12, color: Colors.textLight },
  amount: { fontSize: 24, fontWeight: '800', color: Colors.success, marginBottom: 4 },
  seller: { fontSize: 12, color: Colors.textLight, fontFamily: 'monospace' },
  actions: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: Colors.gray100 },
  payBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primaryDark, padding: 12, borderRadius: Radius.lg, gap: 8 },
  payText: { color: Colors.white, fontSize: 12, fontWeight: '800' },
  viewBtn: { alignSelf: 'center', marginTop: 10 },
  viewText: { color: Colors.info, fontSize: 12, fontWeight: '700' },
});
