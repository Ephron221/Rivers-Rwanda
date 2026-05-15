import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius } from '../../src/constants/Colors';
import { accommodationsService } from '../../src/api/accommodations.service';
import ListingCard from '../../src/components/ListingCard';
import EmptyState from '../../src/components/EmptyState';
import LoadingSkeleton from '../../src/components/LoadingSkeleton';

export default function AccommodationsListScreen() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const [filters, setFilters] = useState({ city: '', type: '' });

  const fetchData = async () => {
    try {
      const res = await accommodationsService.getAll(filters);
      setData(res || []);
    } catch (error) {
      console.warn('Error fetching accommodations', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [filters]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.primaryDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Stays</Text>
      </View>

      <View style={styles.filterSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.gray400} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search by city (e.g. Kigali)"
            value={filters.city}
            onChangeText={(city) => setFilters(prev => ({ ...prev, city }))}
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
          {['', 'apartment', 'hotel_room', 'event_hall'].map((t) => (
            <TouchableOpacity 
              key={t}
              style={[styles.chip, filters.type === t && styles.chipActive]}
              onPress={() => setFilters(prev => ({ ...prev, type: t }))}
            >
              <Text style={[styles.chipText, filters.type === t && styles.chipTextActive]}>
                {t ? t.replace('_', ' ').toUpperCase() : 'ALL STAYS'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={{ padding: 20 }}>
          <LoadingSkeleton type="card" count={3} />
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <ListingCard 
              item={item} 
              type="accommodation" 
              onPress={() => router.push(`/accommodations/${item.id}`)} 
            />
          )}
          ListEmptyComponent={
            <EmptyState title="No stays found" subtitle="Try adjusting your filters" />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.lightGray },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16,
    backgroundColor: Colors.white,
  },
  backBtn: { marginRight: 16 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: Colors.primaryDark },
  filterSection: { backgroundColor: Colors.white, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.gray50, marginHorizontal: 20, marginBottom: 16,
    paddingHorizontal: 16, height: 48, borderRadius: Radius.lg,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14, fontWeight: '500', color: Colors.textDark },
  chipsRow: { paddingHorizontal: 20 },
  chip: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: Radius.full, backgroundColor: Colors.gray100, marginRight: 8,
  },
  chipActive: { backgroundColor: Colors.primaryDark },
  chipText: { fontSize: 11, fontWeight: '800', color: Colors.textLight },
  chipTextActive: { color: Colors.white },
  list: { padding: 20 },
});
