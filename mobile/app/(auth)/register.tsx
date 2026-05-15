import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../src/context/AuthContext';
import ThemedButton from '../../src/components/ThemedButton';
import ThemedInput from '../../src/components/ThemedInput';
import { Colors, Radius } from '../../src/constants/Colors';

// Responsive utilities
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const isSmallDevice = screenWidth < 375;
const isLargeDevice = screenWidth > 430;

const getResponsiveFontSize = (baseSize: number) => {
  return baseSize * (screenWidth / 375);
};

const getResponsivePadding = (basePadding: number) => {
  return basePadding * (screenWidth / 375);
};

type Role = 'client' | 'seller' | 'agent';

export default function RegisterScreen() {
  const [role, setRole] = useState<Role>('client');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    if (!fullName || !email || !password || !phone) {
      Toast.show({ type: 'error', text1: 'Please fill all required fields' });
      return;
    }
    if (password !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Passwords do not match' });
      return;
    }
    if ((role === 'seller' || role === 'agent') && !nationalId) {
      Toast.show({ type: 'error', text1: `National ID is required for ${role}s` });
      return;
    }
    setLoading(true);
    try {
      const result = await register({
        email: email.trim(),
        password,
        role,
        fullName: fullName.trim(),
        phone,
        ...(role === 'seller' || role === 'agent' ? { nationalId } : {}),
      });
      Toast.show({
        type: 'success',
        text1: 'Account Created!',
        text2: 'Please verify your email with the OTP sent.',
      });
      router.push({ pathname: '/(auth)/verify-otp', params: { userId: result.userId } });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: error.response?.data?.message || 'Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={[Colors.primaryDark, '#1a3a5c', Colors.primaryDark]} style={styles.bg} />
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scroll} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={true}
        >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={Colors.white} />
          </TouchableOpacity>
          <View style={styles.logoWrap}>
            <Ionicons name="water" size={30} color={Colors.accentOrange} />
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Rivers Rwanda today</Text>
        </View>

        <View style={styles.card}>
          {/* Role Tabs */}
          <View style={styles.roleTabs}>
            {(['client', 'agent', 'seller'] as Role[]).map((r) => (
              <TouchableOpacity
                key={r}
                style={[styles.roleTab, role === r && styles.roleTabActive]}
                onPress={() => setRole(r)}
              >
                <Ionicons
                  name={r === 'client' ? 'person-outline' : r === 'agent' ? 'briefcase-outline' : 'business-outline'}
                  size={16}
                  color={role === r ? Colors.white : Colors.textLight}
                />
                <Text style={[styles.roleTabText, role === r && styles.roleTabTextActive]}>
                  {r === 'client' ? 'Client' : r === 'agent' ? 'Agent' : 'Seller'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {role === 'seller' && (
            <View style={styles.sellerNotice}>
              <Ionicons name="information-circle" size={16} color={Colors.accentOrange} />
              <Text style={styles.sellerNoticeText}>
                Seller accounts require admin approval before listing properties.
              </Text>
            </View>
          )}

          {role === 'agent' && (
            <View style={styles.sellerNotice}>
              <Ionicons name="information-circle" size={16} color={Colors.accentOrange} />
              <Text style={styles.sellerNoticeText}>
                Agents earn commissions for referring clients. Admin approval required.
              </Text>
            </View>
          )}

          <ThemedInput
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            placeholder="John Doe"
            icon="person-outline"
          />

          <ThemedInput
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="name@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail-outline"
          />

          <ThemedInput
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            placeholder="+250 7XX XXX XXX"
            keyboardType="phone-pad"
            icon="call-outline"
          />

          {(role === 'seller' || role === 'agent') && (
            <ThemedInput
              label="National ID *"
              value={nationalId}
              onChangeText={setNationalId}
              placeholder="Your national ID number"
              icon="card-outline"
            />
          )}

          <ThemedInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Minimum 6 characters"
            isPassword
            icon="lock-closed-outline"
          />

          <ThemedInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Repeat your password"
            isPassword
            icon="lock-closed-outline"
          />

          <ThemedButton
            title={loading ? 'Creating Account...' : 'Create Account'}
            onPress={handleRegister}
            loading={loading}
            style={{ marginTop: 8 }}
            size="lg"
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { ...StyleSheet.absoluteFillObject },
  scroll: { 
    flexGrow: 1, 
    padding: getResponsivePadding(isSmallDevice ? 16 : 24),
    paddingTop: screenHeight < 600 ? 40 : 60,
    paddingBottom: getResponsivePadding(isSmallDevice ? 20 : 40),
  },
  header: { 
    alignItems: 'center', 
    marginBottom: getResponsivePadding(isSmallDevice ? 20 : 28),
  },
  backBtn: {
    position: 'absolute', 
    left: 0, 
    top: 0,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: Radius.full, 
    padding: getResponsivePadding(8),
  },
  logoWrap: {
    width: getResponsivePadding(isSmallDevice ? 48 : 60),
    height: getResponsivePadding(isSmallDevice ? 48 : 60),
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', 
    justifyContent: 'center',
    marginBottom: getResponsivePadding(12), 
    borderWidth: 2, 
    borderColor: 'rgba(249,168,37,0.4)',
  },
  title: { 
    fontSize: getResponsiveFontSize(isSmallDevice ? 20 : 24), 
    fontWeight: '800', 
    color: Colors.white, 
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subtitle: { 
    fontSize: getResponsiveFontSize(isSmallDevice ? 11 : 13), 
    color: 'rgba(255,255,255,0.6)', 
    marginTop: 4, 
    fontWeight: '500',
    textAlign: 'center',
  },
  card: {
    backgroundColor: Colors.white, 
    borderRadius: Radius.xxl, 
    padding: getResponsivePadding(isSmallDevice ? 18 : 24),
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3, 
    shadowRadius: 40, 
    elevation: 20,
    marginHorizontal: isLargeDevice ? 30 : 0,
  },
  roleTabs: { 
    flexDirection: 'row', 
    backgroundColor: Colors.gray100, 
    borderRadius: Radius.xl, 
    padding: getResponsivePadding(4), 
    marginBottom: getResponsivePadding(20),
    gap: isSmallDevice ? 2 : 4,
  },
  roleTab: {
    flex: 1, 
    flexDirection: isSmallDevice ? 'column' : 'row',
    alignItems: 'center', 
    justifyContent: 'center',
    gap: isSmallDevice ? 2 : 6, 
    paddingVertical: getResponsivePadding(isSmallDevice ? 8 : 10),
    borderRadius: Radius.lg,
  },
  roleTabActive: { backgroundColor: Colors.primaryDark },
  roleTabText: { 
    fontSize: getResponsiveFontSize(isSmallDevice ? 10 : 13), 
    fontWeight: '700', 
    color: Colors.textLight,
  },
  roleTabTextActive: { color: Colors.white },
  sellerNotice: {
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    gap: getResponsivePadding(8),
    backgroundColor: Colors.orange50, 
    borderRadius: Radius.lg, 
    padding: getResponsivePadding(isSmallDevice ? 10 : 12),
    marginBottom: getResponsivePadding(16),
  },
  sellerNoticeText: { 
    flex: 1, 
    fontSize: getResponsiveFontSize(isSmallDevice ? 11 : 12), 
    color: Colors.primaryDark, 
    fontWeight: '500', 
    lineHeight: 18,
  },
  nameRow: { flexDirection: 'row' },
  footer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: getResponsivePadding(isSmallDevice ? 16 : 20),
    flexWrap: 'wrap',
  },
  footerText: { 
    color: Colors.textLight, 
    fontSize: getResponsiveFontSize(isSmallDevice ? 12 : 14), 
    fontWeight: '500',
  },
  footerLink: { 
    color: Colors.accentOrange, 
    fontWeight: '800', 
    fontSize: getResponsiveFontSize(isSmallDevice ? 12 : 14),
    textDecorationLine: 'underline',
  },
});
