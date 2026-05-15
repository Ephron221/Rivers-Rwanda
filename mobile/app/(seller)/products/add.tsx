import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import { Colors, Radius } from '../../../src/constants/Colors';
import { accommodationsService } from '../../../src/api/accommodations.service';
import { vehiclesService } from '../../../src/api/vehicles.service';
import { housesService } from '../../../src/api/houses.service';
import ThemedInput from '../../../src/components/ThemedInput';
import ThemedButton from '../../../src/components/ThemedButton';

type Category = 'accommodation' | 'vehicle' | 'house';

export default function AddProductScreen() {
  const router = useRouter();
  const [category, setCategory] = useState<Category>('accommodation');
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<any[]>([]);

  // ----------------------------------------------------
  // ACCOMMODATION STATE
  // ----------------------------------------------------
  const [acc, setAcc] = useState({
    name: '', description: '', city: '', district: '', type: 'apartment', sub_type: 'whole', purpose: 'rent',
    price_per_night: '', price_per_event: '', sale_price: '', max_guests: '', capacity: '',
    number_of_living_rooms: '', floor_number: '', room_name_number: '', bed_type: 'single',
    wifi: false, parking: false, garden: false, decoration: false, sonolization: false, gym: false,
    kitchen: false, toilet: false, living_room: false, swimming_pool: false, has_elevator: false, is_furnished: false
  });

  // ----------------------------------------------------
  // VEHICLE STATE
  // ----------------------------------------------------
  const [veh, setVeh] = useState({
    make: '', model: '', year: '', purpose: 'rent', vehicle_type: 'SUV', transmission: 'automatic', fuel_type: 'petrol',
    seating_capacity: '', daily_rate: '', sale_price: ''
  });

  // ----------------------------------------------------
  // HOUSE STATE
  // ----------------------------------------------------
  const [house, setHouse] = useState({
    title: '', description: '', province: '', district: '', sector: '', full_address: '', purpose: 'rent',
    size_sqm: '', total_rooms: '', bedrooms: '', bathrooms: '', balconies: '', 
    kitchen_type: 'inside', toilet_type: 'inside', material_used: 'block_sima', ceiling_type: 'plafond',
    has_tiles: false, has_electricity: false, has_water: false, has_parking: false, has_garden: false, has_wifi: false,
    monthly_rent_price: '', purchase_price: ''
  });

  // ----------------------------------------------------
  // HELPERS
  // ----------------------------------------------------
  const handlePickImages = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({ type: 'error', text1: 'Permission Denied', text2: 'Sorry, we need gallery permissions to upload images!' });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        setImages(prev => [...prev, ...result.assets]);
      }
    } catch (error: any) {
      console.warn('Image picking error:', error);
      Toast.show({ type: 'error', text1: 'Error picking images', text2: error.message || 'Unknown error' });
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const OptionPills = ({ label, options, selectedValue, onSelect }: any) => (
    <View style={styles.optionGroup}>
      {label && <Text style={styles.sectionLabel}>{label}</Text>}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsContainer}>
        {options.map((opt: any) => (
          <TouchableOpacity 
            key={opt.value} 
            style={[styles.pill, selectedValue === opt.value && styles.pillActive]}
            onPress={() => onSelect(opt.value)}
          >
            <Text style={[styles.pillText, selectedValue === opt.value && styles.pillTextActive]}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const CheckboxGrid = ({ items, stateObj, setStateFn }: any) => (
    <View style={styles.checkboxGrid}>
      {items.map((item: any) => (
        <TouchableOpacity 
          key={item.key} 
          style={[styles.checkboxItem, stateObj[item.key] && styles.checkboxItemActive]}
          onPress={() => setStateFn({ ...stateObj, [item.key]: !stateObj[item.key] })}
          activeOpacity={0.8}
        >
          <Ionicons name={stateObj[item.key] ? "checkmark-circle" : "ellipse-outline"} size={20} color={stateObj[item.key] ? Colors.accentOrange : Colors.gray400} />
          <Text style={[styles.checkboxText, stateObj[item.key] && styles.checkboxTextActive]}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // ----------------------------------------------------
  // SUBMISSION LOGIC
  // ----------------------------------------------------
  const handleSubmit = async () => {
    if (images.length === 0) {
      Toast.show({ type: 'error', text1: 'Please upload at least one image' });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();

      if (category === 'accommodation') {
        if (!acc.name || !acc.city) throw new Error('Name and City are required');
        Object.entries(acc).forEach(([k, v]) => formData.append(k, String(v)));
      } 
      else if (category === 'vehicle') {
        if (!veh.make || !veh.model || !veh.year) throw new Error('Make, Model, and Year are required');
        Object.entries(veh).forEach(([k, v]) => formData.append(k, String(v)));
      } 
      else if (category === 'house') {
        if (!house.title || !house.district) throw new Error('Title and District are required');
        Object.entries(house).forEach(([k, v]) => formData.append(k, String(v)));
      }

      images.forEach((img, i) => {
        formData.append('images', {
          uri: img.uri,
          name: `image_${i}.jpg`,
          type: 'image/jpeg',
        } as any);
      });

      if (category === 'accommodation') await accommodationsService.create(formData);
      else if (category === 'vehicle') await vehiclesService.create(formData);
      else await housesService.create(formData);

      Toast.show({ type: 'success', text1: 'Listing added successfully!' });
      router.back();
    } catch (error: any) {
      Toast.show({ type: 'error', text1: error.message || 'Failed to add listing', text2: error.response?.data?.message || '' });
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // RENDER SECTIONS
  // ----------------------------------------------------
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Listing</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.tabs}>
          {(['accommodation', 'vehicle', 'house'] as Category[]).map(c => (
            <TouchableOpacity 
              key={c} 
              style={[styles.tab, category === c && styles.tabActive]}
              onPress={() => setCategory(c)}
            >
              <Text style={[styles.tabText, category === c && styles.tabTextActive]}>
                {c.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.form}>
          
          {/* ======================================================== */}
          {/* ACCOMMODATION FORM */}
          {/* ======================================================== */}
          {category === 'accommodation' && (
            <>
              <Text style={styles.groupTitle}>Basic Info</Text>
              <ThemedInput label="Property Name *" value={acc.name} onChangeText={(t) => setAcc({...acc, name: t})} />
              <ThemedInput label="Description" value={acc.description} onChangeText={(t) => setAcc({...acc, description: t})} multiline numberOfLines={4} containerStyle={{ height: 100 }} />
              <View style={styles.row}>
                <ThemedInput label="City *" value={acc.city} onChangeText={(t) => setAcc({...acc, city: t})} containerStyle={{ flex: 1, marginRight: 8 }} />
                <ThemedInput label="District" value={acc.district} onChangeText={(t) => setAcc({...acc, district: t})} containerStyle={{ flex: 1 }} />
              </View>

              <Text style={styles.groupTitle}>Classification</Text>
              <OptionPills label="Type" selectedValue={acc.type} onSelect={(v: any) => setAcc({...acc, type: v})} options={[
                { label: 'Apartment', value: 'apartment' }, { label: 'Hotel Room', value: 'hotel_room' }, { label: 'Event Hall', value: 'event_hall' }
              ]} />
              <OptionPills label="Sub Type" selectedValue={acc.sub_type} onSelect={(v: any) => setAcc({...acc, sub_type: v})} options={[
                { label: 'Whole Place', value: 'whole' }, { label: 'Private Room', value: 'room' }
              ]} />
              <OptionPills label="Purpose" selectedValue={acc.purpose} onSelect={(v: any) => setAcc({...acc, purpose: v})} options={[
                { label: 'Rent', value: 'rent' }, { label: 'Sale', value: 'sale' }, { label: 'Both', value: 'both' }
              ]} />

              <Text style={styles.groupTitle}>Pricing</Text>
              {['rent', 'both'].includes(acc.purpose) && (
                <View style={styles.row}>
                  <ThemedInput label="Price Per Night" value={acc.price_per_night} onChangeText={(t) => setAcc({...acc, price_per_night: t})} keyboardType="numeric" containerStyle={{ flex: 1, marginRight: 8 }} />
                  <ThemedInput label="Price Per Event" value={acc.price_per_event} onChangeText={(t) => setAcc({...acc, price_per_event: t})} keyboardType="numeric" containerStyle={{ flex: 1 }} />
                </View>
              )}
              {['sale', 'both'].includes(acc.purpose) && (
                <ThemedInput label="Sale Price" value={acc.sale_price} onChangeText={(t) => setAcc({...acc, sale_price: t})} keyboardType="numeric" />
              )}

              <Text style={styles.groupTitle}>Details</Text>
              <View style={styles.row}>
                <ThemedInput label="Max Guests" value={acc.max_guests} onChangeText={(t) => setAcc({...acc, max_guests: t})} keyboardType="numeric" containerStyle={{ flex: 1, marginRight: 8 }} />
                <ThemedInput label="Capacity" value={acc.capacity} onChangeText={(t) => setAcc({...acc, capacity: t})} keyboardType="numeric" containerStyle={{ flex: 1 }} />
              </View>
              <View style={styles.row}>
                <ThemedInput label="Floor Number" value={acc.floor_number} onChangeText={(t) => setAcc({...acc, floor_number: t})} keyboardType="numeric" containerStyle={{ flex: 1, marginRight: 8 }} />
                <ThemedInput label="Room Number/Name" value={acc.room_name_number} onChangeText={(t) => setAcc({...acc, room_name_number: t})} containerStyle={{ flex: 1 }} />
              </View>
              <OptionPills label="Bed Type" selectedValue={acc.bed_type} onSelect={(v: any) => setAcc({...acc, bed_type: v})} options={[
                { label: 'Single', value: 'single' }, { label: 'Double', value: 'double' }, { label: 'Triple', value: 'triple' }, { label: 'Other', value: 'other' }
              ]} />

              <Text style={styles.groupTitle}>Amenities</Text>
              <CheckboxGrid stateObj={acc} setStateFn={setAcc} items={[
                { label: 'WiFi', key: 'wifi' }, { label: 'Parking', key: 'parking' },
                { label: 'Garden', key: 'garden' }, { label: 'Decoration', key: 'decoration' },
                { label: 'Sonolization', key: 'sonolization' }, { label: 'Gym', key: 'gym' },
                { label: 'Kitchen', key: 'kitchen' }, { label: 'Toilet', key: 'toilet' },
                { label: 'Living Room', key: 'living_room' }, { label: 'Swimming Pool', key: 'swimming_pool' },
                { label: 'Elevator', key: 'has_elevator' }, { label: 'Furnished', key: 'is_furnished' },
              ]} />
            </>
          )}

          {/* ======================================================== */}
          {/* VEHICLE FORM */}
          {/* ======================================================== */}
          {category === 'vehicle' && (
            <>
              <Text style={styles.groupTitle}>Basic Info</Text>
              <View style={styles.row}>
                <ThemedInput label="Make *" value={veh.make} onChangeText={(t) => setVeh({...veh, make: t})} containerStyle={{ flex: 1, marginRight: 8 }} />
                <ThemedInput label="Model *" value={veh.model} onChangeText={(t) => setVeh({...veh, model: t})} containerStyle={{ flex: 1 }} />
              </View>
              <View style={styles.row}>
                <ThemedInput label="Year *" value={veh.year} onChangeText={(t) => setVeh({...veh, year: t})} keyboardType="numeric" containerStyle={{ flex: 1, marginRight: 8 }} />
                <ThemedInput label="Seats" value={veh.seating_capacity} onChangeText={(t) => setVeh({...veh, seating_capacity: t})} keyboardType="numeric" containerStyle={{ flex: 1 }} />
              </View>

              <Text style={styles.groupTitle}>Classification</Text>
              <OptionPills label="Purpose" selectedValue={veh.purpose} onSelect={(v: any) => setVeh({...veh, purpose: v})} options={[
                { label: 'Rent', value: 'rent' }, { label: 'Buy', value: 'buy' }, { label: 'Both', value: 'both' }
              ]} />
              <OptionPills label="Vehicle Type" selectedValue={veh.vehicle_type} onSelect={(v: any) => setVeh({...veh, vehicle_type: v})} options={[
                { label: 'Sedan', value: 'Sedan' }, { label: 'SUV', value: 'SUV' }, { label: 'Truck', value: 'Truck' }, { label: 'Van', value: 'Van' }, { label: 'Other', value: 'Other' }
              ]} />
              <OptionPills label="Transmission" selectedValue={veh.transmission} onSelect={(v: any) => setVeh({...veh, transmission: v})} options={[
                { label: 'Automatic', value: 'automatic' }, { label: 'Manual', value: 'manual' }
              ]} />
              <OptionPills label="Fuel Type" selectedValue={veh.fuel_type} onSelect={(v: any) => setVeh({...veh, fuel_type: v})} options={[
                { label: 'Petrol', value: 'petrol' }, { label: 'Diesel', value: 'diesel' }, { label: 'Electric', value: 'electric' }, { label: 'Hybrid', value: 'hybrid' }
              ]} />

              <Text style={styles.groupTitle}>Pricing</Text>
              {['rent', 'both'].includes(veh.purpose) && (
                <ThemedInput label="Daily Rate" value={veh.daily_rate} onChangeText={(t) => setVeh({...veh, daily_rate: t})} keyboardType="numeric" />
              )}
              {['buy', 'both'].includes(veh.purpose) && (
                <ThemedInput label="Sale Price" value={veh.sale_price} onChangeText={(t) => setVeh({...veh, sale_price: t})} keyboardType="numeric" />
              )}
            </>
          )}

          {/* ======================================================== */}
          {/* HOUSE FORM */}
          {/* ======================================================== */}
          {category === 'house' && (
            <>
              <Text style={styles.groupTitle}>Basic Info</Text>
              <ThemedInput label="Title *" value={house.title} onChangeText={(t) => setHouse({...house, title: t})} />
              <ThemedInput label="Description" value={house.description} onChangeText={(t) => setHouse({...house, description: t})} multiline numberOfLines={4} containerStyle={{ height: 100 }} />
              
              <View style={styles.row}>
                <ThemedInput label="Province" value={house.province} onChangeText={(t) => setHouse({...house, province: t})} containerStyle={{ flex: 1, marginRight: 8 }} />
                <ThemedInput label="District *" value={house.district} onChangeText={(t) => setHouse({...house, district: t})} containerStyle={{ flex: 1 }} />
              </View>
              <View style={styles.row}>
                <ThemedInput label="Sector" value={house.sector} onChangeText={(t) => setHouse({...house, sector: t})} containerStyle={{ flex: 1, marginRight: 8 }} />
                <ThemedInput label="Full Address" value={house.full_address} onChangeText={(t) => setHouse({...house, full_address: t})} containerStyle={{ flex: 1 }} />
              </View>

              <Text style={styles.groupTitle}>Classification</Text>
              <OptionPills label="Purpose" selectedValue={house.purpose} onSelect={(v: any) => setHouse({...house, purpose: v})} options={[
                { label: 'Rent', value: 'rent' }, { label: 'Sale', value: 'sale' }, { label: 'Both', value: 'both' }
              ]} />

              <Text style={styles.groupTitle}>Dimensions & Rooms</Text>
              <View style={styles.row}>
                <ThemedInput label="Size (sqm)" value={house.size_sqm} onChangeText={(t) => setHouse({...house, size_sqm: t})} keyboardType="numeric" containerStyle={{ flex: 1, marginRight: 8 }} />
                <ThemedInput label="Total Rooms" value={house.total_rooms} onChangeText={(t) => setHouse({...house, total_rooms: t})} keyboardType="numeric" containerStyle={{ flex: 1 }} />
              </View>
              <View style={styles.row}>
                <ThemedInput label="Bedrooms" value={house.bedrooms} onChangeText={(t) => setHouse({...house, bedrooms: t})} keyboardType="numeric" containerStyle={{ flex: 1, marginRight: 8 }} />
                <ThemedInput label="Bathrooms" value={house.bathrooms} onChangeText={(t) => setHouse({...house, bathrooms: t})} keyboardType="numeric" containerStyle={{ flex: 1 }} />
              </View>
              <ThemedInput label="Balconies" value={house.balconies} onChangeText={(t) => setHouse({...house, balconies: t})} keyboardType="numeric" />

              <Text style={styles.groupTitle}>Types & Materials</Text>
              <OptionPills label="Kitchen Type" selectedValue={house.kitchen_type} onSelect={(v: any) => setHouse({...house, kitchen_type: v})} options={[
                { label: 'Inside', value: 'inside' }, { label: 'Outside', value: 'outside' }, { label: 'Both', value: 'both' }
              ]} />
              <OptionPills label="Toilet Type" selectedValue={house.toilet_type} onSelect={(v: any) => setHouse({...house, toilet_type: v})} options={[
                { label: 'Inside', value: 'inside' }, { label: 'Outside', value: 'outside' }, { label: 'Both', value: 'both' }
              ]} />
              <OptionPills label="Material Used" selectedValue={house.material_used} onSelect={(v: any) => setHouse({...house, material_used: v})} options={[
                { label: 'Block Sima', value: 'block_sima' }, { label: 'Ruriba', value: 'ruriba' }, { label: 'Mpunyu', value: 'mpunyu' }, { label: 'Rukarakara', value: 'rukarakara' }, { label: 'Other', value: 'other' }
              ]} />
              <OptionPills label="Ceiling Type" selectedValue={house.ceiling_type} onSelect={(v: any) => setHouse({...house, ceiling_type: v})} options={[
                { label: 'Plafond', value: 'plafond' }, { label: 'Roof', value: 'roof' }, { label: 'None', value: 'none' }
              ]} />

              <Text style={styles.groupTitle}>Amenities</Text>
              <CheckboxGrid stateObj={house} setStateFn={setHouse} items={[
                { label: 'Tiles', key: 'has_tiles' }, { label: 'Electricity', key: 'has_electricity' },
                { label: 'Water', key: 'has_water' }, { label: 'Parking', key: 'has_parking' },
                { label: 'Garden', key: 'has_garden' }, { label: 'WiFi', key: 'has_wifi' },
              ]} />

              <Text style={styles.groupTitle}>Pricing</Text>
              {['rent', 'both'].includes(house.purpose) && (
                <ThemedInput label="Monthly Rent" value={house.monthly_rent_price} onChangeText={(t) => setHouse({...house, monthly_rent_price: t})} keyboardType="numeric" />
              )}
              {['sale', 'both'].includes(house.purpose) && (
                <ThemedInput label="Purchase Price" value={house.purchase_price} onChangeText={(t) => setHouse({...house, purchase_price: t})} keyboardType="numeric" />
              )}
            </>
          )}

          {/* ======================================================== */}
          {/* COMMON MEDIA & SUBMIT */}
          {/* ======================================================== */}
          <Text style={styles.groupTitle}>Media</Text>
          <View style={styles.imageSection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
              <TouchableOpacity style={styles.addImgBtn} onPress={handlePickImages}>
                <Ionicons name="camera" size={28} color={Colors.textLight} />
                <Text style={styles.addImgText}>Add Photos</Text>
              </TouchableOpacity>
              {images.map((img, i) => (
                <View key={i} style={styles.imgWrap}>
                  <Image source={{ uri: img.uri }} style={styles.imgPreview} />
                  <TouchableOpacity style={styles.delImgBtn} onPress={() => removeImage(i)}>
                    <Ionicons name="close-circle" size={24} color={Colors.error} />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>

          <ThemedButton title={loading ? 'Adding...' : 'Submit Listing'} onPress={handleSubmit} loading={loading} style={{ marginTop: 32, marginBottom: 40 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.lightGray },
  header: { flexDirection: 'row', alignItems: 'center', padding: 24, paddingTop: 60, backgroundColor: Colors.primaryDark, paddingBottom: 20 },
  backBtn: { width: 40, height: 40, borderRadius: Radius.full, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: Colors.white, letterSpacing: -0.5 },
  
  content: { flex: 1 },
  
  tabs: { flexDirection: 'row', backgroundColor: Colors.white, margin: 20, marginBottom: 16, borderRadius: Radius.xl, padding: 6, shadowColor: Colors.shadowColor, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: Radius.lg },
  tabActive: { backgroundColor: Colors.primaryDark },
  tabText: { fontSize: 11, fontWeight: '800', color: Colors.textLight, letterSpacing: 0.5 },
  tabTextActive: { color: Colors.white },
  
  form: { paddingHorizontal: 20 },
  row: { flexDirection: 'row' },
  
  groupTitle: { fontSize: 18, fontWeight: '900', color: Colors.primaryDark, marginTop: 24, marginBottom: 16, letterSpacing: -0.5 },
  
  optionGroup: { marginBottom: 16 },
  sectionLabel: { fontSize: 10, fontWeight: '800', color: Colors.gray400, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginLeft: 4 },
  pillsContainer: { gap: 8, paddingRight: 20 },
  pill: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: Radius.full, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.gray200 },
  pillActive: { backgroundColor: Colors.primaryDark, borderColor: Colors.primaryDark },
  pillText: { fontSize: 13, fontWeight: '700', color: Colors.textLight },
  pillTextActive: { color: Colors.white },
  
  checkboxGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 8 },
  checkboxItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, paddingHorizontal: 12, paddingVertical: 10, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.gray200, width: '48%' },
  checkboxItemActive: { borderColor: Colors.orange100, backgroundColor: Colors.orange50 },
  checkboxText: { fontSize: 12, fontWeight: '700', color: Colors.textLight, marginLeft: 8 },
  checkboxTextActive: { color: Colors.accentOrange },
  
  imageSection: { marginTop: 4 },
  imageScroll: { flexDirection: 'row' },
  addImgBtn: { width: 110, height: 110, borderRadius: Radius.xl, borderWidth: 2, borderColor: Colors.gray300, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', marginRight: 12, backgroundColor: Colors.white },
  addImgText: { fontSize: 11, fontWeight: '800', color: Colors.textLight, marginTop: 8 },
  imgWrap: { width: 110, height: 110, borderRadius: Radius.xl, marginRight: 12, position: 'relative' },
  imgPreview: { width: '100%', height: '100%', borderRadius: Radius.xl },
  delImgBtn: { position: 'absolute', top: -6, right: -6, backgroundColor: Colors.white, borderRadius: Radius.full },
});
