import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';
import { Colors, Radius } from '../../src/constants/Colors';
import { agentService } from '../../src/api/agent.service';
import { formatCurrency } from '../../src/utils/helpers';
import { useAuth } from '../../src/context/AuthContext';

export default function AgentDashboardScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ paid: 0, approved: 0, pending: 0 });
  const [referralCode, setReferralCode] = useState('');
  const [recentClients, setRecentClients] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsData, codeData, clientsData] = await Promise.all([
        agentService.getStats(),
        agentService.getReferralCode(),
        agentService.getClients()
      ]);
      
      setStats({
        paid: statsData.paid || 0,
        approved: statsData.approved || 0,
        pending: statsData.pending || 0
      });
      setReferralCode(codeData.referral_code || '');
      setRecentClients(clientsData.slice(0, 5) || []);
    } catch (error) {
      console.warn('Error fetching agent dashboard', error);
      Toast.show({ type: 'error', text1: 'Failed to load dashboard data' });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (referralCode) {
      await Clipboard.setStringAsync(referralCode);
      Toast.show({ type: 'success', text1: 'Referral code copied!' });
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.accentOrange} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Agent Dashboard</Text>
          <Text style={styles.welcomeText}>Welcome back, {user?.first_name || 'Agent'}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color={Colors.error} />
        </TouchableOpacity>
      </View>

      {/* Referral Code Card */}
      <View style={styles.referralCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.referralLabel}>YOUR REFERRAL CODE</Text>
          <Text style={styles.referralCode}>{referralCode || 'N/A'}</Text>
        </View>
        <TouchableOpacity style={styles.copyBtn} onPress={copyToClipboard}>
          <Ionicons name="copy-outline" size={24} color={Colors.textLight} />
        </TouchableOpacity>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <View style={[styles.iconWrap, { backgroundColor: Colors.green50 }]}>
            <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
          </View>
          <Text style={styles.statLabel}>PAID</Text>
          <Text style={styles.statValue}>Rwf {formatCurrency(stats.paid)}</Text>
        </View>

        <View style={styles.statBox}>
          <View style={[styles.iconWrap, { backgroundColor: Colors.blue50 }]}>
            <Ionicons name="wallet" size={24} color={Colors.info} />
          </View>
          <Text style={styles.statLabel}>APPROVED</Text>
          <Text style={styles.statValue}>Rwf {formatCurrency(stats.approved)}</Text>
        </View>

        <View style={styles.statBox}>
          <View style={[styles.iconWrap, { backgroundColor: Colors.orange50 }]}>
            <Ionicons name="time" size={24} color={Colors.accentOrange} />
          </View>
          <Text style={styles.statLabel}>PENDING</Text>
          <Text style={styles.statValue}>Rwf {formatCurrency(stats.pending)}</Text>
        </View>
      </View>

      {/* Recent Clients */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="people" size={20} color={Colors.accentOrange} />
            <Text style={styles.sectionTitle}>Recent Clients</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(agent)/clients')}>
            <Text style={styles.viewAllBtn}>VIEW ALL</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          {recentClients.length === 0 ? (
            <Text style={styles.emptyText}>No clients referred yet.</Text>
          ) : (
            recentClients.map((client, idx) => (
              <View key={idx} style={[styles.clientRow, idx !== recentClients.length - 1 && styles.borderBottom]}>
                <View style={styles.clientAvatar}>
                  <Text style={styles.clientInitials}>
                    {client.first_name?.[0] || ''}{client.last_name?.[0] || ''}
                  </Text>
                </View>
                <View style={styles.clientInfo}>
                  <Text style={styles.clientName}>{client.first_name} {client.last_name}</Text>
                  <Text style={styles.clientEmail}>{client.email}</Text>
                </View>
                <Text style={styles.clientDate}>{new Date(client.referred_at).toLocaleDateString()}</Text>
              </View>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.lightGray },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 24, paddingTop: 60, backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.gray100,
  },
  greeting: { fontSize: 24, fontWeight: '800', color: Colors.primaryDark },
  welcomeText: { fontSize: 14, color: Colors.textLight, marginTop: 4, fontWeight: '500' },
  logoutBtn: { padding: 8, backgroundColor: Colors.red50, borderRadius: Radius.full },
  
  referralCard: {
    margin: 20, padding: 20, backgroundColor: Colors.white, borderRadius: Radius.xl,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderColor: Colors.gray100,
  },
  referralLabel: { fontSize: 10, fontWeight: '800', color: Colors.textLight, letterSpacing: 1, marginBottom: 4 },
  referralCode: { fontSize: 22, fontWeight: '800', color: Colors.accentOrange, letterSpacing: 2 },
  copyBtn: { padding: 12, backgroundColor: Colors.gray50, borderRadius: Radius.lg },
  
  statsContainer: { paddingHorizontal: 20, gap: 16 },
  statBox: {
    backgroundColor: Colors.white, borderRadius: Radius.xl, padding: 20,
    flexDirection: 'column', borderWidth: 1, borderColor: Colors.gray100,
  },
  iconWrap: { width: 48, height: 48, borderRadius: Radius.xl, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  statLabel: { fontSize: 10, fontWeight: '800', color: Colors.textLight, letterSpacing: 1, marginBottom: 4 },
  statValue: { fontSize: 24, fontWeight: '800', color: Colors.primaryDark },
  
  section: { padding: 20, paddingBottom: 40 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.primaryDark, textTransform: 'uppercase' },
  viewAllBtn: { fontSize: 10, fontWeight: '800', color: Colors.accentOrange, letterSpacing: 1 },
  
  card: { backgroundColor: Colors.white, borderRadius: Radius.xl, padding: 16, borderWidth: 1, borderColor: Colors.gray100 },
  clientRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  clientAvatar: { width: 40, height: 40, borderRadius: Radius.full, backgroundColor: Colors.gray100, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  clientInitials: { fontSize: 14, fontWeight: '800', color: Colors.primaryDark },
  clientInfo: { flex: 1 },
  clientName: { fontSize: 14, fontWeight: '700', color: Colors.primaryDark, marginBottom: 2 },
  clientEmail: { fontSize: 12, color: Colors.textLight },
  clientDate: { fontSize: 12, color: Colors.textLight, fontWeight: '500' },
  emptyText: { textAlign: 'center', color: Colors.textLight, padding: 20, fontStyle: 'italic' },
});
