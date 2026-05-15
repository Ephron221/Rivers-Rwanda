import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../src/context/AuthContext';
import ThemedButton from '../../src/components/ThemedButton';
import ThemedInput from '../../src/components/ThemedInput';
import { Colors, Radius, Spacing } from '../../src/constants/Colors';

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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Toast.show({ type: 'error', text1: 'Please fill in all fields' });
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
      Toast.show({ type: 'success', text1: 'Welcome back!', text2: 'Logged in successfully' });
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      const needsVerification = error.response?.data?.needsVerification;
      const userId = error.response?.data?.userId;

      if (needsVerification && userId) {
        Toast.show({ type: 'info', text1: 'Verify your email first' });
        router.push({ pathname: '/(auth)/verify-otp', params: { userId } });
      } else {
        Toast.show({ type: 'error', text1: 'Login Failed', text2: msg });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[Colors.primaryDark, '#1a3a5c', Colors.primaryDark]}
        style={styles.gradientBg}
      />
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
        {/* Brand Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="water" size={36} color={Colors.accentOrange} />
          </View>
          <Text style={styles.brandName}>
            <Text style={styles.brandOrange}>Rivers</Text> Rwanda
          </Text>
          <Text style={styles.brandTagline}>Your Gateway to Rwanda's Finest Properties</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sign In</Text>
          <Text style={styles.cardSubtitle}>Access your account to book properties</Text>

          <View style={styles.form}>
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
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Your password"
              isPassword
              icon="lock-closed-outline"
            />

            <TouchableOpacity
              onPress={() => router.push('/(auth)/forgot-password')}
              style={styles.forgotBtn}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <ThemedButton
              title={loading ? 'Signing In...' : 'Sign In'}
              onPress={handleLogin}
              loading={loading}
              style={styles.loginBtn}
              size="lg"
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.footerLink}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Demo accounts hint */}
        <View style={styles.hint}>
          <Ionicons name="information-circle-outline" size={14} color={Colors.white} style={{ opacity: 0.6 }} />
          <Text style={styles.hintText}>Sign in with your registered account</Text>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  gradientBg: {
    ...StyleSheet.absoluteFillObject,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: getResponsivePadding(isSmallDevice ? 16 : 24),
    paddingTop: screenHeight < 600 ? 40 : 80,
    paddingBottom: getResponsivePadding(isSmallDevice ? 20 : 40),
  },
  header: {
    alignItems: 'center',
    marginBottom: getResponsivePadding(isSmallDevice ? 24 : 36),
  },
  logoContainer: {
    width: getResponsivePadding(isSmallDevice ? 56 : 72),
    height: getResponsivePadding(isSmallDevice ? 56 : 72),
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: getResponsivePadding(isSmallDevice ? 12 : 16),
    borderWidth: 2,
    borderColor: 'rgba(249,168,37,0.4)',
  },
  brandName: {
    fontSize: getResponsiveFontSize(isSmallDevice ? 24 : 28),
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -0.5,
  },
  brandOrange: {
    color: Colors.accentOrange,
  },
  brandTagline: {
    fontSize: getResponsiveFontSize(isSmallDevice ? 11 : 12),
    color: 'rgba(255,255,255,0.6)',
    marginTop: getResponsivePadding(isSmallDevice ? 4 : 6),
    textAlign: 'center',
    fontWeight: '500',
    paddingHorizontal: getResponsivePadding(8),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xxl,
    padding: getResponsivePadding(isSmallDevice ? 20 : 28),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
    elevation: 20,
    marginHorizontal: isLargeDevice ? 30 : 0,
  },
  cardTitle: {
    fontSize: getResponsiveFontSize(isSmallDevice ? 22 : 26),
    fontWeight: '800',
    color: Colors.primaryDark,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: getResponsiveFontSize(isSmallDevice ? 12 : 13),
    color: Colors.textLight,
    marginBottom: getResponsivePadding(isSmallDevice ? 20 : 28),
    fontWeight: '500',
  },
  form: {},
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: getResponsivePadding(isSmallDevice ? 16 : 24),
    marginTop: -8,
  },
  forgotText: {
    color: Colors.accentOrange,
    fontWeight: '700',
    fontSize: getResponsiveFontSize(isSmallDevice ? 12 : 13),
  },
  loginBtn: {
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: getResponsivePadding(isSmallDevice ? 16 : 24),
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
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
    marginTop: getResponsivePadding(isSmallDevice ? 12 : 20),
    opacity: 0.7,
    paddingHorizontal: getResponsivePadding(8),
  },
  hintText: {
    color: Colors.white,
    fontSize: getResponsiveFontSize(isSmallDevice ? 11 : 12),
    fontWeight: '500',
    opacity: 0.6,
    textAlign: 'center',
  },
});
