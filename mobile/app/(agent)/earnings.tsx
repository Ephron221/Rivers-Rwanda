import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { Colors, Radius } from '../../src/constants/Colors';
import { agentService } from '../../src/api/agent.service';
import { formatCurrency } from '../../src/utils/helpers';
import EmptyState from '../../src/components/EmptyState';
import StatusBadge from '../../src/components/StatusBadge';

export default function AgentEarningsScreen() {
  const [earnings, setEarnings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const data = await agentService.getEarnings();
      setEarnings(data || []);
    } catch (error) {
      console.warn('Error fetching earnings', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.clientName}>{item.client_name}</Text>
          <Text style={styles.bookingRef}>Ref: {item.booking_reference}</Text>
        </View>
        <StatusBadge status={item.status} />
      </View>
      <View style={styles.divider} />
      <View style={styles.cardFooter}>
        <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString()}</Text>
        <Text style={styles.amount}>+ Rwf {formatCurrency(item.amount)}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Earnings</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.accentOrange} />
        </View>
      ) : (
        <FlatList
          data={earnings}
          keyExtractor={(item, index) => item.id || index.toString()}
          contentContainerStyle={styles.list}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <EmptyState title="No Earnings Yet" subtitle="Commissions will appear here once your referred clients make bookings." />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.lightGray },
  header: {
    padding: 24, paddingTop: 60, backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.gray100,
  },
  headerTitle: { fontSize: 24, fontWeight: '800', color: Colors.primaryDark },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 20 },
  card: {
    backgroundColor: Colors.white, padding: 16, borderRadius: Radius.xl,
    marginBottom: 16, shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  clientName: { fontSize: 16, fontWeight: '800', color: Colors.primaryDark, marginBottom: 4 },
  bookingRef: { fontSize: 12, color: Colors.textLight, fontFamily: 'monospace' },
  divider: { height: 1, backgroundColor: Colors.gray100, marginVertical: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  date: { fontSize: 12, color: Colors.textLight, fontWeight: '600' },
  amount: { fontSize: 18, fontWeight: '900', color: Colors.success },
});
