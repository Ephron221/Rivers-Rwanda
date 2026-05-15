import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, 
  Platform, ScrollView, Dimensions 
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { authService } from '../../src/api/auth.service';
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

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email.trim()) {
      Toast.show({ type: 'error', text1: 'Please enter your email address' });
      return;
    }
    setLoading(true);
    try {
      await authService.forgotPassword(email.trim());
      Toast.show({ type: 'success', text1: 'OTP Sent!', text2: 'Check your email for the reset code.' });
      router.push({ pathname: '/(auth)/reset-password', params: { email: email.trim() } });
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Failed', text2: error.response?.data?.message || 'Email not found.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={[Colors.primaryDark, '#1a3a5c']} style={StyleSheet.absoluteFillObject} />
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
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.iconWrap}>
          <Ionicons name="key" size={44} color={Colors.accentOrange} />
        </View>
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>Enter your email and we'll send you a reset code</Text>

        <View style={styles.card}>
          <ThemedInput
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="name@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail-outline"
          />
          <ThemedButton
            title={loading ? 'Sending...' : 'Send Reset Code'}
            onPress={handleSubmit}
            loading={loading}
            size="lg"
          />
          <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.backToLogin}>
            <Text style={styles.backToLoginText}>Back to Sign In</Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { 
    flexGrow: 1, 
    padding: getResponsivePadding(isSmallDevice ? 16 : 24),
    paddingTop: screenHeight < 600 ? 50 : 70,
    alignItems: 'center',
  },
  back: {
    alignSelf: 'flex-start', 
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: Radius.full, 
    padding: getResponsivePadding(8), 
    marginBottom: getResponsivePadding(isSmallDevice ? 20 : 32),
  },
  iconWrap: {
    width: getResponsivePadding(isSmallDevice ? 68 : 88),
    height: getResponsivePadding(isSmallDevice ? 68 : 88),
    borderRadius: Radius.full,
    backgroundColor: 'rgba(249,168,37,0.15)',
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: getResponsivePadding(isSmallDevice ? 16 : 20),
    borderWidth: 2, 
    borderColor: 'rgba(249,168,37,0.3)',
  },
  title: { 
    fontSize: getResponsiveFontSize(isSmallDevice ? 22 : 26), 
    fontWeight: '800', 
    color: Colors.white, 
    marginBottom: getResponsivePadding(isSmallDevice ? 8 : 12),
    textAlign: 'center',
  },
  subtitle: { 
    fontSize: getResponsiveFontSize(isSmallDevice ? 12 : 14), 
    color: 'rgba(255,255,255,0.7)', 
    textAlign: 'center', 
    marginBottom: getResponsivePadding(isSmallDevice ? 20 : 32), 
    fontWeight: '500',
    paddingHorizontal: getResponsivePadding(8),
  },
  card: {
    backgroundColor: Colors.white, 
    borderRadius: Radius.xxl, 
    padding: getResponsivePadding(isSmallDevice ? 20 : 28),
    width: '100%',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 20 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 40, 
    elevation: 20,
    marginHorizontal: isLargeDevice ? 30 : 0,
  },
  backToLogin: { 
    alignItems: 'center', 
    marginTop: getResponsivePadding(isSmallDevice ? 16 : 20),
  },
  backToLoginText: { 
    color: Colors.accentOrange, 
    fontWeight: '700', 
    fontSize: getResponsiveFontSize(isSmallDevice ? 12 : 14),
  },
});
