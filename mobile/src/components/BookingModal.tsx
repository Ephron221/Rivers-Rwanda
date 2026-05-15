import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';

import { Colors, Radius } from '../constants/Colors';
import ThemedInput from './ThemedInput';
import ThemedButton from './ThemedButton';
import { bookingsService } from '../api/bookings.service';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/helpers';

interface BookingModalProps {
  visible: boolean;
  onClose: () => void;
  item: any;
  itemType: 'house' | 'vehicle' | 'accommodation';
}

const paymentDetails = {
  bank: { name: 'I&M Bank', accountNumber: '20151404001', accountName: 'MVL Group Ltd' },
  momo: { number: '0792659094', name: 'Leandre Mukunzi' },
};

export default function BookingModal({ visible, onClose, item, itemType }: BookingModalProps) {
  const router = useRouter();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)));
  const [numMonths, setNumMonths] = useState('2');
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'mobile_money'>('bank_transfer');
  const [paymentProof, setPaymentProof] = useState<any>(null);

  // Date Picker State
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Derived Values
  const [totalAmount, setTotalAmount] = useState(0);
  const [displayDuration, setDisplayDuration] = useState('');

  const isHouseRent = itemType === 'house' && item.monthly_rent_price;
  const isHousePurchase = itemType === 'house' && item.purchase_price;
  const isVehicleRent = itemType === 'vehicle' && item.purpose !== 'buy';
  const isVehiclePurchase = itemType === 'vehicle' && item.purpose === 'buy';
  const isAccommodation = itemType === 'accommodation';

  useEffect(() => {
    if (visible && user) {
      setFullName(`${user.first_name || ''} ${user.last_name || ''}`.trim());
      setEmail(user.email || '');
      setPhone(user.phone_number || '');
      setSuccess(false);
      setBookingRef('');
      setPaymentProof(null);
    }
  }, [visible, user]);

  useEffect(() => {
    if (!item) return;
    
    let amount = 0;
    let label = '';

    if (isHousePurchase) {
      amount = item.purchase_price;
      label = 'Full Purchase';
    } else if (isHouseRent) {
      const monthlyRate = item.monthly_rent_price;
      const months = parseInt(numMonths) || 2;
      amount = monthlyRate * months;
      label = `${months} Month${months > 1 ? 's' : ''}`;
    } else if (isAccommodation || isVehicleRent) {
      const dailyRate = isAccommodation 
        ? (item.price_per_night || item.price_per_event || 0) 
        : (item.daily_rate || 0);
      
      const diffTime = endDate.getTime() - startDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const units = diffDays > 0 ? diffDays : 1;
      
      amount = dailyRate * units;
      label = `${units} Day${units > 1 ? 's' : ''}`;
    } else if (isVehiclePurchase) {
      amount = item.sale_price;
      label = 'Full Purchase';
    }

    setTotalAmount(Math.round(amount));
    setDisplayDuration(label);
  }, [startDate, endDate, numMonths, item, itemType, isHouseRent, isHousePurchase, isVehicleRent, isVehiclePurchase, isAccommodation]);

  const handlePickProof = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: ['image/*', 'application/pdf'] });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPaymentProof(result.assets[0]);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleBook = async () => {
    if (!paymentProof) {
      Toast.show({ type: 'error', text1: 'Please upload payment proof' });
      return;
    }
    
    setLoading(true);
    try {
      let bookingType = '';
      let payload: any = {
        total_amount: totalAmount,
        payment_method: paymentMethod,
        start_date: startDate.toISOString().split('T')[0],
        paymentProof: {
          uri: paymentProof.uri,
          name: paymentProof.name || 'proof.jpg',
          type: paymentProof.mimeType || 'image/jpeg',
        },
      };

      if (user?.role === 'agent') {
        if (!fullName || !email) {
          Toast.show({ type: 'error', text1: 'Client Name and Email are required' });
          setLoading(false);
          return;
        }
        payload.fullName = fullName;
        payload.email = email;
        payload.phone = phone;
      }

      if (itemType === 'house') {
        bookingType = item.monthly_rent_price ? 'house_rent' : 'house_purchase';
        payload.house_id = item.id;
      } else if (itemType === 'vehicle') {
        bookingType = item.purpose === 'buy' ? 'vehicle_purchase' : 'vehicle_rent';
        payload.vehicle_id = item.id;
      } else {
        bookingType = 'accommodation';
        payload.accommodation_id = item.id;
      }

      if (isHouseRent) {
        const end = new Date(startDate);
        end.setMonth(end.getMonth() + (parseInt(numMonths) || 2));
        payload.end_date = end.toISOString().split('T')[0];
      } else if (isAccommodation || isVehicleRent) {
        payload.end_date = endDate.toISOString().split('T')[0];
      }

      if (item.seller_id) {
        payload.seller_id = item.seller_id;
      }

      payload.booking_type = bookingType;

      const res = await bookingsService.create(payload);
      setBookingRef(res.booking_reference);
      setSuccess(true);
      Toast.show({ type: 'success', text1: 'Booking submitted successfully!' });
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Booking failed', text2: error.response?.data?.message || 'Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date, isStart?: boolean) => {
    if (Platform.OS === 'android') {
      if (isStart) setShowStartPicker(false);
      else setShowEndPicker(false);
    }
    if (selectedDate) {
      if (isStart) setStartDate(selectedDate);
      else setEndDate(selectedDate);
    }
  };

  if (!item) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Confirm Booking</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={Colors.textDark} />
            </TouchableOpacity>
          </View>

          {success ? (
            <View style={styles.successContent}>
              <View style={styles.successIcon}>
                <Ionicons name="checkmark-circle" size={80} color={Colors.success} />
              </View>
              <Text style={styles.successTitle}>Booking Confirmed!</Text>
              <Text style={styles.successDesc}>Your booking has been successfully submitted and is pending verification.</Text>
              <View style={styles.refBox}>
                <Text style={styles.refLabel}>Booking Reference</Text>
                <Text style={styles.refCode}>{bookingRef}</Text>
              </View>
              <ThemedButton 
                title="Go to Bookings" 
                onPress={() => {
                  onClose();
                  router.push('/(tabs)/bookings');
                }} 
              />
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              <View style={styles.priceCard}>
                <Text style={styles.priceLabel}>
                  {isHousePurchase || isVehiclePurchase ? 'Purchase Price' : 'Total Amount'}
                </Text>
                <Text style={styles.priceValue}>{formatCurrency(totalAmount)}</Text>
                <Text style={styles.durationLabel}>Based on {displayDuration}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Client Details</Text>
                <ThemedInput label="Full Name" value={fullName} onChangeText={setFullName} placeholder="John Doe" />
                <ThemedInput label="Email Address" value={email} onChangeText={setEmail} placeholder="client@example.com" keyboardType="email-address" />
                <ThemedInput label="Phone Number" value={phone} onChangeText={setPhone} placeholder="+250 7XX XXX XXX" keyboardType="phone-pad" />
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Scheduling Details</Text>
                
                <View style={styles.dateRow}>
                  <View style={styles.dateCol}>
                    <Text style={styles.inputLabel}>Start Date</Text>
                    <TouchableOpacity style={styles.dateBtn} onPress={() => setShowStartPicker(true)}>
                      <Ionicons name="calendar-outline" size={18} color={Colors.primaryDark} />
                      <Text style={styles.dateBtnText}>{startDate.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                  </View>
                  
                  {isHouseRent ? (
                    <View style={styles.dateCol}>
                      <Text style={styles.inputLabel}>Rental Duration (Months)</Text>
                      <ThemedInput 
                        value={numMonths} 
                        onChangeText={setNumMonths} 
                        keyboardType="numeric" 
                        containerStyle={{ marginTop: -8, marginBottom: 0 }} 
                      />
                    </View>
                  ) : (isAccommodation || isVehicleRent) ? (
                    <View style={styles.dateCol}>
                      <Text style={styles.inputLabel}>End Date</Text>
                      <TouchableOpacity style={styles.dateBtn} onPress={() => setShowEndPicker(true)}>
                        <Ionicons name="calendar-outline" size={18} color={Colors.primaryDark} />
                        <Text style={styles.dateBtnText}>{endDate.toLocaleDateString()}</Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>

                {showStartPicker && (
                  <DateTimePicker
                    value={startDate}
                    mode="date"
                    display="default"
                    minimumDate={new Date()}
                    onChange={(e, d) => onDateChange(e, d, true)}
                  />
                )}
                {showEndPicker && (
                  <DateTimePicker
                    value={endDate}
                    mode="date"
                    display="default"
                    minimumDate={startDate}
                    onChange={(e, d) => onDateChange(e, d, false)}
                  />
                )}
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Payment Method</Text>
                <View style={styles.methodRow}>
                  <TouchableOpacity 
                    style={[styles.methodBtn, paymentMethod === 'bank_transfer' && styles.methodBtnActive]}
                    onPress={() => setPaymentMethod('bank_transfer')}
                  >
                    <Ionicons name="card-outline" size={20} color={paymentMethod === 'bank_transfer' ? Colors.white : Colors.textLight} />
                    <Text style={[styles.methodText, paymentMethod === 'bank_transfer' && styles.methodTextActive]}>Bank Transfer</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.methodBtn, paymentMethod === 'mobile_money' && styles.methodBtnActive]}
                    onPress={() => setPaymentMethod('mobile_money')}
                  >
                    <Ionicons name="phone-portrait-outline" size={20} color={paymentMethod === 'mobile_money' ? Colors.white : Colors.textLight} />
                    <Text style={[styles.methodText, paymentMethod === 'mobile_money' && styles.methodTextActive]}>Mobile Money</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.instructionsBox}>
                  <Text style={styles.instructionsTitle}>Payment Instructions</Text>
                  {paymentMethod === 'bank_transfer' ? (
                    <View>
                      <Text style={styles.instText}><Text style={styles.instLabel}>Bank:</Text> {paymentDetails.bank.name}</Text>
                      <Text style={styles.instText}><Text style={styles.instLabel}>Account:</Text> {paymentDetails.bank.accountNumber}</Text>
                      <Text style={styles.instText}><Text style={styles.instLabel}>Name:</Text> {paymentDetails.bank.accountName}</Text>
                    </View>
                  ) : (
                    <View>
                      <Text style={styles.instText}><Text style={styles.instLabel}>Receiver:</Text> {paymentDetails.momo.name}</Text>
                      <Text style={styles.instText}><Text style={styles.instLabel}>Number:</Text> {paymentDetails.momo.number}</Text>
                      <Text style={styles.instHint}>Please include your name in the transfer reason.</Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Payment Proof</Text>
                <TouchableOpacity style={styles.uploadBox} onPress={handlePickProof}>
                  <Ionicons name="cloud-upload-outline" size={32} color={Colors.accentOrange} />
                  <Text style={styles.uploadText}>{paymentProof ? paymentProof.name : 'Tap to upload receipt (Image or PDF)'}</Text>
                </TouchableOpacity>
              </View>
              
            </ScrollView>
          )}

          {!success && (
            <View style={styles.footer}>
              <ThemedButton 
                title={loading ? "Processing..." : "Submit Booking"} 
                onPress={handleBook} 
                loading={loading}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    height: '90%',
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  title: { fontSize: 20, fontWeight: '800', color: Colors.primaryDark },
  closeBtn: { padding: 4 },
  scrollContent: { padding: 24, paddingBottom: 40 },
  priceCard: {
    backgroundColor: Colors.primaryDark,
    borderRadius: Radius.xl,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  priceLabel: { fontSize: 10, fontWeight: '800', color: Colors.gray400, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  priceValue: { fontSize: 32, fontWeight: '900', color: Colors.accentOrange, marginBottom: 4 },
  durationLabel: { fontSize: 12, fontWeight: '600', color: Colors.white },
  
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: Colors.primaryDark, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 },
  
  dateRow: { flexDirection: 'row', gap: 16 },
  dateCol: { flex: 1 },
  inputLabel: { fontSize: 10, fontWeight: '700', color: Colors.textLight, textTransform: 'uppercase', marginBottom: 8, marginLeft: 4 },
  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray50,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: 14,
    gap: 8,
  },
  dateBtnText: { fontSize: 14, color: Colors.textDark, fontWeight: '500' },
  
  methodRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  methodBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: Radius.lg,
    backgroundColor: Colors.gray50,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  methodBtnActive: { backgroundColor: Colors.primaryDark, borderColor: Colors.primaryDark },
  methodText: { fontSize: 13, fontWeight: '700', color: Colors.textLight },
  methodTextActive: { color: Colors.white },
  
  instructionsBox: {
    backgroundColor: Colors.orange50,
    borderWidth: 1,
    borderColor: 'rgba(249,168,37,0.3)',
    borderStyle: 'dashed',
    borderRadius: Radius.lg,
    padding: 16,
  },
  instructionsTitle: { fontSize: 12, fontWeight: '800', color: Colors.accentOrange, marginBottom: 12 },
  instText: { fontSize: 13, color: Colors.primaryDark, marginBottom: 6 },
  instLabel: { fontWeight: '800' },
  instHint: { fontSize: 11, color: Colors.textLight, marginTop: 8, fontStyle: 'italic' },
  
  uploadBox: {
    backgroundColor: Colors.gray50,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    borderRadius: Radius.lg,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  uploadText: { fontSize: 13, fontWeight: '600', color: Colors.textLight, textAlign: 'center' },
  
  footer: {
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
    backgroundColor: Colors.white,
  },

  successContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  successIcon: { marginBottom: 24 },
  successTitle: { fontSize: 24, fontWeight: '800', color: Colors.primaryDark, marginBottom: 8 },
  successDesc: { fontSize: 14, color: Colors.textLight, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  refBox: { backgroundColor: Colors.gray50, padding: 20, borderRadius: Radius.xl, alignItems: 'center', width: '100%', marginBottom: 32 },
  refLabel: { fontSize: 10, fontWeight: '700', color: Colors.textLight, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  refCode: { fontSize: 28, fontWeight: '900', color: Colors.primaryDark, letterSpacing: 2 },
});
