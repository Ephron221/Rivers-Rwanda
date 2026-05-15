import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius } from '../../src/constants/Colors';
import { agentService } from '../../src/api/agent.service';
import EmptyState from '../../src/components/EmptyState';

export default function AgentClientsScreen() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const data = await agentService.getClients();
      setClients(data || []);
    } catch (error) {
      console.warn('Error fetching clients', error);
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
    <View style={styles.clientCard}>
      <View style={styles.clientAvatar}>
        <Text style={styles.clientInitials}>
          {item.first_name?.[0] || ''}{item.last_name?.[0] || ''}
        </Text>
      </View>
      <View style={styles.clientInfo}>
        <Text style={styles.clientName}>{item.first_name} {item.last_name}</Text>
        <Text style={styles.clientEmail}>{item.email}</Text>
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={12} color={Colors.textLight} />
          <Text style={styles.clientDate}>Referred: {new Date(item.referred_at).toLocaleDateString()}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Referred Clients</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{clients.length} Total</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.accentOrange} />
        </View>
      ) : (
        <FlatList
          data={clients}
          keyExtractor={(item, index) => item.id || index.toString()}
          contentContainerStyle={styles.list}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <EmptyState title="No Clients Yet" subtitle="Share your referral code to start earning!" />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.lightGray },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 24, paddingTop: 60, backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.gray100,
  },
  headerTitle: { fontSize: 24, fontWeight: '800', color: Colors.primaryDark },
  badge: { backgroundColor: Colors.orange50, paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full },
  badgeText: { fontSize: 12, fontWeight: '800', color: Colors.accentOrange },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 20 },
  clientCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, padding: 16, borderRadius: Radius.xl,
    marginBottom: 12, shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  clientAvatar: {
    width: 50, height: 50, borderRadius: Radius.full,
    backgroundColor: Colors.gray100, alignItems: 'center', justifyContent: 'center', marginRight: 16,
  },
  clientInitials: { fontSize: 18, fontWeight: '800', color: Colors.primaryDark },
  clientInfo: { flex: 1 },
  clientName: { fontSize: 16, fontWeight: '800', color: Colors.primaryDark, marginBottom: 2 },
  clientEmail: { fontSize: 13, color: Colors.textLight, marginBottom: 6 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  clientDate: { fontSize: 11, color: Colors.textLight, fontWeight: '600' },
});
