import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius } from '../../src/constants/Colors';
import { useAuth } from '../../src/context/AuthContext';
import { sellerService } from '../../src/api/seller.service';
import StatCard from '../../src/components/StatCard';
import LoadingSkeleton from '../../src/components/LoadingSkeleton';
import { formatCurrency } from '../../src/utils/helpers';

export default function SellerDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    products: 0,
    bookings: 0,
    earnings: 0,
    pendingPayouts: 0,
  });

  // Determine number of columns based on screen width
  const numColumns = width < 400 ? 1 : width < 600 ? 2 : 2;

  const loadData = async () => {
    try {
      const [products, bookings, earnings] = await Promise.all([
        sellerService.getProducts(),
        sellerService.getBookings(),
        sellerService.getEarnings(),
      ]);
      
      const totalEarnings = earnings.reduce((sum, e) => sum + Number(e.amount), 0);
      const pendingEarnings = earnings.filter(e => e.status === 'approved').reduce((sum, e) => sum + Number(e.amount), 0);

      setStats({
        products: products.length,
        bookings: bookings.length,
        earnings: totalEarnings,
        pendingPayouts: pendingEarnings,
      });
    } catch (error) {
      console.warn(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  // Get full user name
  const getUserDisplayName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user?.name || user?.first_name || 'Partner';
  };

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} />}
    >
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Seller Portal</Text>
            <Text style={styles.name}>Hi, {getUserDisplayName()}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerIconBtn}
              onPress={() => router.push('/(seller)/notifications')}
            >
              <Ionicons name="notifications-outline" size={22} color={Colors.white} />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerIconBtn}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={22} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Approval Alert */}
        {user?.status && user.status !== 'active' && user.status !== 'approved' && (
          <View style={styles.alertBox}>
            <View style={styles.alertIconBox}>
              <Ionicons name="warning" size={24} color={Colors.warning} />
            </View>
            <View style={styles.alertTextBox}>
              <Text style={styles.alertTitle}>Approval Pending</Text>
              <Text style={styles.alertText}>
                Your account is waiting for admin approval. You cannot list properties yet.
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Statistics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          {loading ? (
            <LoadingSkeleton type="stat" count={4} />
          ) : (
            <View style={[styles.statsGrid, { marginHorizontal: -(20 - 8) }]}>
              <View style={styles.statItem}>
                <StatCard 
                  label="Total Products" 
                  value={stats.products} 
                  icon="cube-outline" 
                  color={Colors.info} 
                  bgColor={Colors.blue50} 
                  onPress={() => router.push('/(seller)/products')}
                />
              </View>
              <View style={styles.statItem}>
                <StatCard 
                  label="Total Bookings" 
                  value={stats.bookings} 
                  icon="calendar-outline" 
                  color={Colors.warning} 
                  bgColor={Colors.orange50} 
                  onPress={() => router.push('/(seller)/bookings')}
                />
              </View>
              <View style={styles.statItem}>
                <StatCard 
                  label="Total Earnings" 
                  value={formatCurrency(stats.earnings)} 
                  icon="cash-outline" 
                  color={Colors.success} 
                  bgColor={Colors.green50} 
                  onPress={() => router.push('/(seller)/earnings')}
                />
              </View>
              <View style={styles.statItem}>
                <StatCard 
                  label="Pending Payouts" 
                  value={formatCurrency(stats.pendingPayouts)} 
                  icon="time-outline" 
                  color={Colors.primaryDark} 
                  bgColor={Colors.gray100} 
                />
              </View>
            </View>
          )}
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Quick Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity 
            style={[styles.actionCard, user?.status !== 'active' && styles.actionCardDisabled]} 
            onPress={() => router.push('/(seller)/products/add')}
            disabled={user?.status !== 'active'}
            activeOpacity={0.75}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="add" size={28} color={Colors.white} />
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Add New Listing</Text>
              <Text style={styles.actionDesc}>List accommodation, car, or house</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.gray400} style={styles.actionChevron} />
          </TouchableOpacity>
        </View>

        {/* Secondary Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Manage</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity 
              style={styles.actionGridItem}
              onPress={() => router.push('/(seller)/products')}
              activeOpacity={0.8}
            >
              <View style={[styles.actionGridIcon, { backgroundColor: Colors.blue50 }]}>
                <Ionicons name="pricetags-outline" size={24} color={Colors.info} />
              </View>
              <Text style={styles.actionGridLabel}>Products</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionGridItem}
              onPress={() => router.push('/(seller)/bookings')}
              activeOpacity={0.8}
            >
              <View style={[styles.actionGridIcon, { backgroundColor: Colors.orange50 }]}>
                <Ionicons name="calendar-outline" size={24} color={Colors.warning} />
              </View>
              <Text style={styles.actionGridLabel}>Bookings</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionGridItem}
              onPress={() => router.push('/(seller)/earnings')}
              activeOpacity={0.8}
            >
              <View style={[styles.actionGridIcon, { backgroundColor: Colors.green50 }]}>
                <Ionicons name="wallet-outline" size={24} color={Colors.success} />
              </View>
              <Text style={styles.actionGridLabel}>Earnings</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionGridItem}
              onPress={() => router.push('/(seller)/notifications')}
              activeOpacity={0.8}
            >
              <View style={[styles.actionGridIcon, { backgroundColor: Colors.red50 }]}>
                <Ionicons name="notifications-outline" size={24} color={Colors.error} />
              </View>
              <Text style={styles.actionGridLabel}>Alerts</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.lightGray,
  },

  // Header Styles
  header: { 
    backgroundColor: Colors.primaryDark, 
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 55 : 35,
    paddingBottom: 20,
  },
  headerTop: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  headerIconBtn: { 
    width: 42, 
    height: 42, 
    borderRadius: Radius.full, 
    backgroundColor: 'rgba(255,255,255,0.15)', 
    alignItems: 'center', 
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
  },
  greeting: { 
    fontSize: 11, 
    fontWeight: '800', 
    color: Colors.accentOrange, 
    textTransform: 'uppercase', 
    letterSpacing: 0.8, 
    marginBottom: 3 
  },
  name: { 
    fontSize: 26, 
    fontWeight: '900', 
    color: Colors.white, 
    letterSpacing: -0.3,
  },

  // Alert Box Styles
  alertBox: { 
    flexDirection: 'row', 
    backgroundColor: '#fff7ed', 
    padding: 14, 
    borderRadius: Radius.xl, 
    alignItems: 'flex-start', 
    gap: 12, 
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
    marginTop: 16,
  },
  alertIconBox: { 
    backgroundColor: 'rgba(249,168,37,0.15)',
    padding: 10, 
    borderRadius: Radius.full,
    marginTop: 0,
  },
  alertTextBox: { 
    flex: 1,
    justifyContent: 'center',
  },
  alertTitle: { 
    fontSize: 13, 
    fontWeight: '800', 
    color: '#9a3412', 
    marginBottom: 3 
  },
  alertText: { 
    fontSize: 12, 
    color: '#c2410c', 
    fontWeight: '500', 
    lineHeight: 16 
  },

  // Content Styles
  content: { 
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30,
    backgroundColor: Colors.lightGray,
  },

  // Section Styles
  section: {
    marginBottom: 28,
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: '900', 
    color: Colors.primaryDark, 
    marginBottom: 14, 
    letterSpacing: -0.3,
  },

  // Stats Grid
  statsGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 12,
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    minWidth: '48%',
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: Colors.gray100,
    marginBottom: 20,
    marginTop: 8,
  },

  // Action Card Styles (Primary CTA)
  actionCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: Colors.white, 
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: Radius.xl, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 3 }, 
    shadowOpacity: 0.12, 
    shadowRadius: 8, 
    elevation: 5,
    borderWidth: 0,
    gap: 14,
  },
  actionCardDisabled: { 
    opacity: 0.4 
  },
  actionIcon: { 
    width: 52, 
    height: 52, 
    borderRadius: Radius.lg, 
    backgroundColor: Colors.accentOrange, 
    alignItems: 'center', 
    justifyContent: 'center',
    flexShrink: 0,
  },
  actionInfo: { 
    flex: 1, 
    minWidth: 0,
  },
  actionTitle: { 
    fontSize: 15, 
    fontWeight: '800', 
    color: Colors.primaryDark, 
    marginBottom: 2 
  },
  actionDesc: { 
    fontSize: 12.5, 
    color: '#718096',
    lineHeight: 16,
    fontWeight: '500',
  },
  actionChevron: {
    flexShrink: 0,
  },

  // Action Grid (Secondary CTAs)
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  actionGridItem: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 0,
  },
  actionGridIcon: {
    width: 52,
    height: 52,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionGridLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primaryDark,
    textAlign: 'center',
  },
});
