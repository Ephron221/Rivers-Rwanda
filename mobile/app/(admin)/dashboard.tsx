import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius } from '../../src/constants/Colors';
import { useAuth } from '../../src/context/AuthContext';
import { adminService } from '../../src/api/admin.service';
import StatCard from '../../src/components/StatCard';
import LoadingSkeleton from '../../src/components/LoadingSkeleton';
import { formatCurrency } from '../../src/utils/helpers';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<any>(null);

  const loadData = async () => {
    try {
      const data = await adminService.getStats();
      setStats(data);
    } catch (error) {
      console.warn(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} />}
    >
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Admin Portal</Text>
            <Text style={styles.name}>System Overview</Text>
          </View>
          <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
            <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {loading || !stats ? (
          <LoadingSkeleton type="stat" count={6} />
        ) : (
          <View style={styles.statsGrid}>
            <StatCard label="Total Revenue" value={formatCurrency(stats.totalRevenue)} icon="cash-outline" color={Colors.success} bgColor={Colors.green50} onPress={() => router.push('/(admin)/payments')} />
            <StatCard label="Total Bookings" value={stats.totalBookings} icon="calendar-outline" color={Colors.primaryDark} bgColor={Colors.blue50} onPress={() => router.push('/(admin)/bookings')} />
            <StatCard label="Users" value={stats.totalUsers} icon="people-outline" color={Colors.info} bgColor={Colors.blue50} onPress={() => router.push('/(admin)/users')} />
            <StatCard label="Sellers" value={stats.totalSellers} icon="business-outline" color={Colors.warning} bgColor={Colors.orange50} onPress={() => router.push('/(admin)/users')} />
            <StatCard label="Accommodations" value={stats.totalAccommodations} icon="bed-outline" color={Colors.primaryDark} bgColor={Colors.gray100} />
            <StatCard label="Vehicles" value={stats.totalVehicles} icon="car-outline" color={Colors.primaryDark} bgColor={Colors.gray100} />
            <StatCard label="Houses" value={stats.totalHouses} icon="home-outline" color={Colors.primaryDark} bgColor={Colors.gray100} />
            <StatCard label="Pending Approvals" value={stats.pendingApprovals} icon="time-outline" color={Colors.error} bgColor='#fee2e2' onPress={() => router.push('/(admin)/users')} />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.lightGray },
  header: { backgroundColor: Colors.primaryDark, padding: 24, paddingTop: 60, paddingBottom: 40 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: 12, fontWeight: '800', color: Colors.accentOrange, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  name: { fontSize: 24, fontWeight: '800', color: Colors.white },
  logoutBtn: { width: 40, height: 40, borderRadius: Radius.full, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  content: { padding: 20, marginTop: -20, borderTopLeftRadius: Radius.xxl, borderTopRightRadius: Radius.xxl, backgroundColor: Colors.lightGray },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 16 },
});
