import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius } from '../../src/constants/Colors';
import { adminService } from '../../src/api/admin.service';
import StatusBadge from '../../src/components/StatusBadge';
import EmptyState from '../../src/components/EmptyState';
import LoadingSkeleton from '../../src/components/LoadingSkeleton';

export default function AdminUsersScreen() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState<'client' | 'seller'>('client');

  const fetchUsers = async () => {
    try {
      const data = tab === 'client' ? await adminService.getAllUsers() : await adminService.getAllSellers();
      setUsers(data || []);
    } catch (error) {
      console.warn(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchUsers();
  }, [tab]);

  const toggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    Alert.alert(`Confirm Action`, `Are you sure you want to change status to ${newStatus}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            if (tab === 'client') await adminService.updateUserStatus(id, newStatus);
            else await adminService.updateSellerStatus(id, newStatus);
            fetchUsers();
          } catch (e) { console.warn(e); }
        }
      }
    ]);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.avatarWrap}>
        <Text style={styles.avatarText}>{item.first_name?.[0] || 'U'}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.first_name} {item.last_name}</Text>
        <Text style={styles.email}>{item.email}</Text>
        <View style={styles.row}>
          <StatusBadge status={item.status} size="sm" />
          <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString()}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => toggleStatus(item.id, item.status)} style={styles.actionBtn}>
        <Ionicons name="swap-vertical" size={20} color={Colors.primaryDark} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>User Management</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, tab === 'client' && styles.activeTab]} onPress={() => setTab('client')}>
          <Text style={[styles.tabText, tab === 'client' && styles.activeTabText]}>Clients</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'seller' && styles.activeTab]} onPress={() => setTab('seller')}>
          <Text style={[styles.tabText, tab === 'seller' && styles.activeTabText]}>Sellers</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={{ padding: 20 }}><LoadingSkeleton type="list" count={5} /></View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchUsers(); }} />}
          ListEmptyComponent={<EmptyState title={`No ${tab}s found`} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.lightGray },
  header: { padding: 24, paddingTop: 60, paddingBottom: 16, backgroundColor: Colors.white },
  headerTitle: { fontSize: 24, fontWeight: '800', color: Colors.primaryDark },
  tabs: { flexDirection: 'row', backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 16, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: Colors.accentOrange },
  tabText: { fontSize: 13, fontWeight: '700', color: Colors.textLight },
  activeTabText: { color: Colors.primaryDark, fontWeight: '800' },
  list: { padding: 20 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, padding: 16, borderRadius: Radius.xl, marginBottom: 12, borderWidth: 1, borderColor: Colors.border },
  avatarWrap: { width: 48, height: 48, borderRadius: Radius.full, backgroundColor: Colors.blue50, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  avatarText: { fontSize: 18, fontWeight: '800', color: Colors.info },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '800', color: Colors.primaryDark, marginBottom: 2 },
  email: { fontSize: 12, color: Colors.textLight, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  date: { fontSize: 11, color: Colors.gray400 },
  actionBtn: { padding: 8, backgroundColor: Colors.gray50, borderRadius: Radius.md },
});
