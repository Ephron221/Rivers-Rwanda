import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { Colors, Radius, Spacing } from '../../src/constants/Colors';
import { accommodationsService } from '../../src/api/accommodations.service';
import { vehiclesService } from '../../src/api/vehicles.service';
import { housesService } from '../../src/api/houses.service';
import ListingCard from '../../src/components/ListingCard';
import LoadingSkeleton from '../../src/components/LoadingSkeleton';

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [featuredAccommodations, setFeaturedAccommodations] = useState<any[]>([]);
  const [featuredCars, setFeaturedCars] = useState<any[]>([]);
  const [featuredHouses, setFeaturedHouses] = useState<any[]>([]);

  const loadData = async () => {
    try {
      const [accs, cars, houses] = await Promise.all([
        accommodationsService.getAll(),
        vehiclesService.getAll(),
        housesService.getAll()
      ]);
      setFeaturedAccommodations(accs.slice(0, 5));
      setFeaturedCars(cars.slice(0, 5));
      setFeaturedHouses(houses.slice(0, 5));
    } catch (error) {
      console.warn('Error loading home data', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const SectionHeader = ({ title, subtitle, onSeeAll }: any) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionSubtitle}>{subtitle}</Text>
      <Text style={styles.sectionTitle}>{title}</Text>
      {onSeeAll && (
        <TouchableOpacity style={styles.seeAllBtn} onPress={onSeeAll}>
          <Text style={styles.seeAllText}>VIEW ALL</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      scrollIndicatorInsets={{ bottom: 10 }}
      contentContainerStyle={{ paddingBottom: 20 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.accentOrange]} />}
    >
      {/* Hero Section */}
      <View style={styles.heroContainer}>
        <ImageBackground 
          source={{ uri: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1000' }}
          style={styles.heroBg}
        >
          <LinearGradient
            colors={['rgba(15,41,77,0.7)', 'rgba(15,41,77,0.9)', Colors.primaryDark]}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.heroContent}>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.greeting}>Hello, {user?.first_name || 'Guest'}</Text>
                <Text style={styles.heroTagline}>Find your perfect stay</Text>
              </View>
              <TouchableOpacity style={styles.avatarWrap} onPress={() => router.push('/(tabs)/profile')}>
                <Ionicons name="person" size={20} color={Colors.white} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.searchBar} 
              onPress={() => router.push('/(tabs)/browse')}
              activeOpacity={0.9}
            >
              <Ionicons name="search" size={20} color={Colors.textLight} style={styles.searchIcon} />
              <Text style={styles.searchText}>Search accommodations, cars...</Text>
              <View style={styles.searchFilterBtn}>
                <Ionicons name="options" size={16} color={Colors.white} />
              </View>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>

      <View style={styles.content}>
        {/* Categories */}
        <View style={styles.categories}>
          {[
            { id: 'acc', title: 'Stays', icon: 'bed', route: '/accommodations', color: Colors.info },
            { id: 'car', title: 'Cars', icon: 'car', route: '/cars', color: Colors.warning },
            { id: 'house', title: 'Houses', icon: 'home', route: '/houses', color: Colors.success },
          ].map(cat => (
            <TouchableOpacity 
              key={cat.id} 
              style={styles.categoryCard}
              onPress={() => router.push(cat.route as any)}
            >
              <View style={[styles.categoryIconWrap, { backgroundColor: `${cat.color}15` }]}>
                <Ionicons name={cat.icon as any} size={24} color={cat.color} />
              </View>
              <Text style={styles.categoryTitle}>{cat.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
            <LoadingSkeleton count={2} />
          </View>
        ) : (
          <>
            {/* Featured Accommodations */}
            {featuredAccommodations.length > 0 && (
              <View style={styles.section}>
                <SectionHeader 
                  title="FEATURED STAYS" 
                  subtitle="TOP RATED" 
                  onSeeAll={() => router.push('/accommodations')} 
                />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
                  {featuredAccommodations.map(item => (
                    <View key={item.id} style={styles.horizontalCardWrap}>
                      <ListingCard 
                        item={item} 
                        type="accommodation" 
                        onPress={() => router.push(`/accommodations/${item.id}`)} 
                      />
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Featured Cars */}
            {featuredCars.length > 0 && (
              <View style={styles.section}>
                <SectionHeader 
                  title="FEATURED VEHICLES" 
                  subtitle="OUR FLEET" 
                  onSeeAll={() => router.push('/cars')} 
                />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
                  {featuredCars.map(item => (
                    <View key={item.id} style={styles.horizontalCardWrap}>
                      <ListingCard 
                        item={item} 
                        type="vehicle" 
                        onPress={() => router.push(`/cars/${item.id}`)} 
                      />
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Featured Houses */}
            {featuredHouses.length > 0 && (
              <View style={styles.section}>
                <SectionHeader 
                  title="FEATURED HOUSES" 
                  subtitle="OUR PROPERTIES" 
                  onSeeAll={() => router.push('/houses')} 
                />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
                  {featuredHouses.map(item => (
                    <View key={item.id} style={styles.horizontalCardWrap}>
                      <ListingCard 
                        item={item} 
                        type="house" 
                        onPress={() => router.push(`/houses/${item.id}`)} 
                      />
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
            {/* Why Choose Us Section */}
            <View style={[styles.section, styles.whyChooseUsSection]}>
              <SectionHeader title="EXPERTISE & TRUST" subtitle="WHY CHOOSE US" />
              <View style={styles.featuresGrid}>
                <View style={styles.featureCard}>
                  <View style={styles.featureIconWrap}>
                    <Ionicons name="shield-checkmark" size={28} color={Colors.accentOrange} />
                  </View>
                  <Text style={styles.featureTitle}>VERIFIED LISTINGS</Text>
                  <Text style={styles.featureDesc}>Every property and vehicle is thoroughly verified to ensure safety, quality, and exactly what you expect.</Text>
                </View>

                <View style={styles.featureCard}>
                  <View style={styles.featureIconWrap}>
                    <Ionicons name="time" size={28} color={Colors.accentOrange} />
                  </View>
                  <Text style={styles.featureTitle}>24/7 SUPPORT</Text>
                  <Text style={styles.featureDesc}>Our dedicated team is always ready to assist you at any time, ensuring a seamless experience.</Text>
                </View>

                <View style={styles.featureCard}>
                  <View style={styles.featureIconWrap}>
                    <Ionicons name="ribbon" size={28} color={Colors.accentOrange} />
                  </View>
                  <Text style={styles.featureTitle}>PREMIUM QUALITY</Text>
                  <Text style={styles.featureDesc}>We handpick the best accommodations, vehicles, and houses that meet our high standards.</Text>
                </View>
              </View>
            </View>

            {/* Stats Section */}
            <View style={styles.statsSection}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>1,200+</Text>
                <Text style={styles.statLabel}>HAPPY CLIENTS</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>850+</Text>
                <Text style={styles.statLabel}>PROPERTIES</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>300+</Text>
                <Text style={styles.statLabel}>VEHICLES</Text>
              </View>
            </View>

            {/* Call to Action Section */}
            <View style={styles.ctaSection}>
              <ImageBackground 
                source={{ uri: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000' }}
                style={styles.ctaBg}
                imageStyle={{ borderRadius: Radius.xxl }}
              >
                <LinearGradient
                  colors={['rgba(15,41,77,0.85)', 'rgba(15,41,77,0.95)']}
                  style={styles.ctaOverlay}
                />
                <View style={styles.ctaContent}>
                  <Text style={styles.ctaTitle}>READY TO FIND{'\n'}<Text style={styles.ctaTitleAccent}>YOUR NEXT EXPERIENCE?</Text></Text>
                  <Text style={styles.ctaDesc}>Join thousands of satisfied clients who have found their perfect properties and vehicles with us.</Text>
                  <View style={styles.ctaButtons}>
                    <TouchableOpacity style={styles.ctaBtnPrimary} onPress={() => router.push('/(auth)/login')}>
                      <Text style={styles.ctaBtnTextPrimary}>GET STARTED</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.ctaBtnSecondary} onPress={() => router.push('/(tabs)/profile')}>
                      <Text style={styles.ctaBtnTextSecondary}>CONTACT US</Text>
                      <Ionicons name="arrow-forward" size={16} color={Colors.white} />
                    </TouchableOpacity>
                  </View>
                </View>
              </ImageBackground>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGray,
  },
  heroContainer: {
    height: 280,
    backgroundColor: Colors.primaryDark,
  },
  heroBg: {
    width: '100%',
    height: '100%',
  },
  heroContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    justifyContent: 'space-between',
    paddingBottom: 30,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.8,
  },
  heroTagline: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: 4,
  },
  avatarWrap: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    height: 56,
    borderRadius: Radius.xl,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchText: {
    flex: 1,
    fontSize: 14,
    color: Colors.gray400,
    fontWeight: '500',
  },
  searchFilterBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.lg,
    backgroundColor: Colors.accentOrange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 40,
  },
  categories: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  categoryCard: {
    alignItems: 'center',
    flex: 1,
  },
  categoryIconWrap: {
    width: 64,
    height: 64,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  section: {
    marginBottom: 32,
  },
  horizontalCardWrap: {
    width: 300,
    paddingHorizontal: 8,
  },
  sectionHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionSubtitle: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.accentOrange,
    letterSpacing: 2,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.primaryDark,
    letterSpacing: -0.5,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  seeAllBtn: {
    marginTop: 16,
    backgroundColor: Colors.primaryDark,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: Radius.lg,
  },
  seeAllText: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: 1.5,
  },
  whyChooseUsSection: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  featuresGrid: {
    paddingHorizontal: 20,
    gap: 16,
  },
  featureCard: {
    backgroundColor: Colors.white,
    padding: 24,
    borderRadius: Radius.xxl,
    alignItems: 'center',
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.gray100,
  },
  featureIconWrap: {
    width: 64,
    height: 64,
    borderRadius: Radius.xl,
    backgroundColor: Colors.orange50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.primaryDark,
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  featureDesc: {
    fontSize: 13,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.gray100,
    marginBottom: 32,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.primaryDark,
    marginBottom: 4,
    letterSpacing: -1,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: Colors.accentOrange,
    letterSpacing: 1.5,
  },
  ctaSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  ctaBg: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: Radius.xxl,
  },
  ctaOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: Radius.xxl,
  },
  ctaContent: {
    padding: 32,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.white,
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 16,
    lineHeight: 32,
  },
  ctaTitleAccent: {
    color: Colors.accentOrange,
    textDecorationLine: 'underline',
  },
  ctaDesc: {
    fontSize: 14,
    color: Colors.gray300,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    fontWeight: '500',
  },
  ctaButtons: {
    width: '100%',
    gap: 12,
  },
  ctaBtnPrimary: {
    backgroundColor: Colors.accentOrange,
    paddingVertical: 16,
    borderRadius: Radius.xl,
    alignItems: 'center',
  },
  ctaBtnTextPrimary: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  ctaBtnSecondary: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 16,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ctaBtnTextSecondary: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
});
