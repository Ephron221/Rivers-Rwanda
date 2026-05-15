import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius } from '../../src/constants/Colors';
import { useAuth } from '../../src/context/AuthContext';

export default function AdminMoreScreen() {
  const { logout } = useAuth();
  const router = useRouter();

  const ActionRow = ({ icon, title, onPress, color = Colors.primaryDark }: any) => (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <View style={[styles.iconWrap, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.rowTitle}>{title}</Text>
      <Ionicons name="chevron-forward" size={20} color={Colors.gray300} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>More Options</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Management</Text>
        <View style={styles.card}>
          <ActionRow icon="bed" title="Manage Accommodations" onPress={() => {}} />
          <ActionRow icon="car" title="Manage Vehicles" onPress={() => {}} />
          <ActionRow icon="home" title="Manage Houses" onPress={() => {}} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>System</Text>
        <View style={styles.card}>
          <ActionRow icon="settings" title="Settings" onPress={() => {}} />
          <ActionRow icon="log-out" title="Sign Out" color={Colors.error} onPress={logout} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.lightGray },
  header: { padding: 24, paddingTop: 60, paddingBottom: 20, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: Colors.primaryDark },
  section: { padding: 20, paddingBottom: 0 },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: Colors.gray400, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginLeft: 4 },
  card: { backgroundColor: Colors.white, borderRadius: Radius.xl, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border },
  row: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  iconWrap: { width: 40, height: 40, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  rowTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: Colors.textDark },
});
