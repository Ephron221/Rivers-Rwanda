import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Radius } from '../../src/constants/Colors';
import ThemedInput from '../../src/components/ThemedInput';
import BookingModal from '../../src/components/BookingModal';
import { formatCurrency, parseImages } from '../../src/utils/helpers';

import { accommodationsService } from '../../src/api/accommodations.service';
import { housesService } from '../../src/api/houses.service';
import { vehiclesService } from '../../src/api/vehicles.service';

type ItemType = 'accommodation' | 'house' | 'vehicle';

export default function AgentBookScreen() {
  const [activeTab, setActiveTab] = useState<ItemType>('accommodation');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [items, setItems] = useState<any[]>([]);
  
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      let res;
      if (activeTab === 'accommodation') {
        res = await accommodationsService.getAll();
      } else if (activeTab === 'house') {
        res = await housesService.getAll();
      } else {
        res = await vehiclesService.getAll();
      }
      setItems(res || []);
    } catch (error) {
      console.warn('Error fetching items for booking:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const name = item.name || item.title || `${item.make} ${item.model}`;
    return name?.toLowerCase().includes(q);
  });

  const handleSelect = (item: any) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const renderItem = ({ item }: { item: any }) => {
    const images = parseImages(item.images);
    const coverImage = images[0] || 'https://via.placeholder.com/150';
    
    let title = '';
    let price = 0;
    let subtitle = '';

    if (activeTab === 'accommodation') {
      title = item.name;
      price = item.price_per_night || item.price_per_event || item.sale_price;
      subtitle = `${item.district}, ${item.city}`;
    } else if (activeTab === 'house') {
      title = item.title;
      price = item.price;
      subtitle = `${item.district}, ${item.city}`;
    } else {
      title = `${item.make} ${item.model}`;
      price = item.purpose === 'rent' ? item.daily_rate : item.sale_price;
      subtitle = `${item.year} Model`;
    }

    return (
      <TouchableOpacity style={styles.card} onPress={() => handleSelect(item)}>
        <Image source={{ uri: coverImage }} style={styles.cardImg} />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle} numberOfLines={1}>{title}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{activeTab === 'house' ? item.purpose : activeTab === 'vehicle' ? item.purpose : item.type}</Text>
            </View>
          </View>
          <Text style={styles.cardSubtitle}>{subtitle}</Text>
          <View style={styles.cardFooter}>
            <Text style={styles.cardPrice}>{formatCurrency(price)}</Text>
            <TouchableOpacity style={styles.bookBtn} onPress={() => handleSelect(item)}>
              <Text style={styles.bookBtnText}>Book for Client</Text>
              <Ionicons name="arrow-forward" size={14} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>Book for Client</Text>
        <Text style={styles.subtitle}>Select a property to book on behalf of your client</Text>
      </View>

      <View style={styles.tabsContainer}>
        {(['accommodation', 'house', 'vehicle'] as ItemType[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'vehicle' ? 'Cars' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.searchWrap}>
        <ThemedInput 
          icon="search-outline" 
          placeholder={`Search ${activeTab}s...`} 
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerStyle={{ marginBottom: 0 }}
        />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.accentOrange} />
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="search" size={48} color={Colors.gray400} />
              <Text style={styles.emptyText}>No {activeTab}s found.</Text>
            </View>
          }
        />
      )}

      {selectedItem && (
        <BookingModal 
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          item={selectedItem}
          itemType={activeTab}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { padding: 24, paddingBottom: 16 },
  title: { fontSize: 28, fontWeight: '900', color: Colors.primaryDark, marginBottom: 4 },
  subtitle: { fontSize: 14, color: Colors.textLight },
  
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 8,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: Colors.gray50,
    borderRadius: Radius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabBtnActive: {
    backgroundColor: Colors.primaryDark,
    borderColor: Colors.primaryDark,
  },
  tabText: { fontSize: 13, fontWeight: '700', color: Colors.textLight },
  tabTextActive: { color: Colors.white },

  searchWrap: { paddingHorizontal: 24, marginBottom: 16 },
  
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 24, paddingTop: 0, gap: 16 },
  
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardImg: { width: '100%', height: 160 },
  cardContent: { padding: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: Colors.primaryDark, flex: 1, marginRight: 8 },
  badge: { backgroundColor: Colors.orange50, paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.sm },
  badgeText: { fontSize: 10, fontWeight: '800', color: Colors.accentOrange, textTransform: 'uppercase' },
  cardSubtitle: { fontSize: 13, color: Colors.textLight, marginBottom: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: Colors.gray50, paddingTop: 12 },
  cardPrice: { fontSize: 16, fontWeight: '900', color: Colors.primaryDark },
  bookBtn: { backgroundColor: Colors.accentOrange, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.full },
  bookBtnText: { fontSize: 11, fontWeight: '800', color: Colors.white, textTransform: 'uppercase' },

  empty: { padding: 40, alignItems: 'center', gap: 12 },
  emptyText: { color: Colors.textLight, fontSize: 14 },
});
