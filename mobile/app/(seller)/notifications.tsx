import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius } from '../../src/constants/Colors';
import { notificationsService } from '../../src/api/notifications.service';
import EmptyState from '../../src/components/EmptyState';
import LoadingSkeleton from '../../src/components/LoadingSkeleton';
import { formatDateTime } from '../../src/utils/helpers';

export default function NotificationsScreen() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const res = await notificationsService.getMyNotifications();
      setData(res || []);
    } catch (error) {
      console.warn(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const markRead = async (id: string) => {
    await notificationsService.markRead(id);
    setData(data.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.card, !item.is_read && styles.unread]} 
      onPress={() => !item.is_read && markRead(item.id)}
    >
      <View style={styles.iconWrap}>
        <Ionicons name="notifications" size={20} color={!item.is_read ? Colors.accentOrange : Colors.gray400} />
      </View>
      <View style={styles.info}>
        <Text style={[styles.title, !item.is_read && styles.titleUnread]}>{item.title}</Text>
        <Text style={styles.msg}>{item.message}</Text>
        <Text style={styles.time}>{formatDateTime(item.created_at)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      {loading ? (
        <View style={{ padding: 20 }}><LoadingSkeleton type="list" count={5} /></View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} />}
          ListEmptyComponent={<EmptyState icon="notifications-off" title="All caught up" subtitle="You have no notifications." />}
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
  card: { flexDirection: 'row', backgroundColor: Colors.white, padding: 16, borderRadius: Radius.xl, marginBottom: 12, borderWidth: 1, borderColor: Colors.border },
  unread: { borderColor: Colors.accentOrange, backgroundColor: Colors.orange50 },
  iconWrap: { width: 40, height: 40, borderRadius: Radius.full, backgroundColor: Colors.gray50, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  info: { flex: 1 },
  title: { fontSize: 14, fontWeight: '700', color: Colors.textDark, marginBottom: 4 },
  titleUnread: { color: Colors.primaryDark, fontWeight: '800' },
  msg: { fontSize: 13, color: Colors.textLight, marginBottom: 8, lineHeight: 18 },
  time: { fontSize: 11, color: Colors.gray400, fontWeight: '500' },
});
