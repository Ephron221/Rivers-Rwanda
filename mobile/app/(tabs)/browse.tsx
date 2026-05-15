import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '../../src/constants/Colors';

export default function BrowseScreen() {
  const router = useRouter();

  const categories = [
    {
      id: 'accommodations',
      title: 'Stays',
      subtitle: 'Hotels, Apartments & Event Halls',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000',
      icon: 'bed',
      route: '/accommodations',
      stats: '50+ Properties'
    },
    {
      id: 'cars',
      title: 'Vehicles',
      subtitle: 'Rentals & Sales',
      image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1000',
      icon: 'car',
      route: '/cars',
      stats: '30+ Vehicles'
    },
    {
      id: 'houses',
      title: 'Real Estate',
      subtitle: 'Buy or Rent Houses',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1000',
      icon: 'home',
      route: '/houses',
      stats: '100+ Listings'
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>EXPLORE</Text>
        <Text style={styles.headerTitle}>Categories</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false} 
        scrollIndicatorInsets={{ bottom: 10 }}
      >
        {categories.map((cat) => (
          <TouchableOpacity 
            key={cat.id} 
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => router.push(cat.route as any)}
          >
            <ImageBackground source={{ uri: cat.image }} style={styles.cardImage}>
              <LinearGradient
                colors={['transparent', 'rgba(15,41,77,0.8)', Colors.primaryDark]}
                style={StyleSheet.absoluteFillObject}
              />
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <View style={styles.iconWrap}>
                    <Ionicons name={cat.icon as any} size={24} color={Colors.white} />
                  </View>
                  <View style={styles.statsBadge}>
                    <Text style={styles.statsText}>{cat.stats}</Text>
                  </View>
                </View>
                <View style={styles.cardFooter}>
                  <View>
                    <Text style={styles.cardTitle}>{cat.title}</Text>
                    <Text style={styles.cardSubtitle}>{cat.subtitle}</Text>
                  </View>
                  <View style={styles.arrowWrap}>
                    <Ionicons name="arrow-forward" size={20} color={Colors.primaryDark} />
                  </View>
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGray,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: Colors.white,
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.accentOrange,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.primaryDark,
    letterSpacing: -0.5,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    gap: 20,
  },
  card: {
    height: 220,
    borderRadius: Radius.xxl,
    overflow: 'hidden',
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  statsBadge: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  statsText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -0.5,
  },
  cardSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
    marginTop: 4,
  },
  arrowWrap: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
