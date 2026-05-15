import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius } from '../../../src/constants/Colors';
import { sellerService } from '../../../src/api/seller.service';
import EmptyState from '../../../src/components/EmptyState';
import LoadingSkeleton from '../../../src/components/LoadingSkeleton';
import StatusBadge from '../../../src/components/StatusBadge';
import { formatCurrency, getImageUrl, parseImages } from '../../../src/utils/helpers';

export default function SellerProductsScreen() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchProducts = async () => {
    try {
      const res = await sellerService.getProducts();
      setData(res || []);
    } catch (error) {
      console.warn(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const renderItem = ({ item }: { item: any }) => {
    const images = parseImages(item.images);
    const imageUrl = images.length > 0 ? getImageUrl(images[0]) : null;

    return (
      <View style={styles.card}>
        {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}
        <View style={styles.cardInfo}>
          <View style={styles.cardHeader}>
            <View style={styles.typeBadge}><Text style={styles.typeText}>{item.type.toUpperCase()}</Text></View>
            <StatusBadge status={item.status} size="sm" />
          </View>
          <Text style={styles.title} numberOfLines={1}>{item.name || item.title || `${item.make} ${item.model}`}</Text>
          {item.price && <Text style={styles.price}>{formatCurrency(item.price)}</Text>}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Listings</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/(seller)/products/add')}>
          <Ionicons name="add" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={{ padding: 20 }}><LoadingSkeleton type="list" count={5} /></View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchProducts(); }} />}
          ListEmptyComponent={<EmptyState title="No Products" subtitle="You haven't listed anything yet." actionLabel="Add Listing" onAction={() => router.push('/(seller)/products/add')} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.lightGray },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingTop: 60, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: Colors.primaryDark },
  addBtn: { width: 40, height: 40, borderRadius: Radius.full, backgroundColor: Colors.primaryDark, alignItems: 'center', justifyContent: 'center' },
  list: { padding: 20 },
  card: { flexDirection: 'row', backgroundColor: Colors.white, borderRadius: Radius.xl, overflow: 'hidden', marginBottom: 16, borderWidth: 1, borderColor: Colors.border, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  image: { width: 100, height: 100 },
  cardInfo: { flex: 1, padding: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  typeBadge: { backgroundColor: Colors.gray100, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  typeText: { fontSize: 9, fontWeight: '800', color: Colors.textLight },
  title: { fontSize: 15, fontWeight: '800', color: Colors.primaryDark, marginBottom: 4 },
  price: { fontSize: 14, fontWeight: '700', color: Colors.accentOrange },
});
