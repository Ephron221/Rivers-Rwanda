import React, { useState, useRef } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, 
  Platform, ScrollView, TextInput, Dimensions 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
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

export default function ResetPasswordScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const inputs = useRef<TextInput[]>([]);
  const router = useRouter();

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputs.current[index + 1]?.focus();
    if (!value && index > 0) inputs.current[index - 1]?.focus();
  };

  const handleReset = async () => {
    const code = otp.join('');
    if (code.length < 6) { Toast.show({ type: 'error', text1: 'Enter the complete OTP' }); return; }
    if (!newPassword || newPassword !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Passwords do not match' }); return;
    }
    setLoading(true);
    try {
      await authService.resetPassword(email!, code, newPassword);
      Toast.show({ type: 'success', text1: 'Password Reset!', text2: 'You can now sign in with your new password.' });
      router.replace('/(auth)/login');
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Reset Failed', text2: error.response?.data?.message || 'Invalid OTP.' });
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
          <Ionicons name="lock-open" size={40} color={Colors.accentOrange} />
        </View>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Enter the OTP sent to your email and set a new password</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Enter OTP Code</Text>
          <View style={styles.otpRow}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => { if (ref) inputs.current[index] = ref; }}
                style={[styles.otpInput, digit ? styles.otpFilled : null]}
                maxLength={1}
                keyboardType="number-pad"
                value={digit}
                onChangeText={(val) => handleOtpChange(val, index)}
                textAlign="center"
              />
            ))}
          </View>
          <ThemedInput label="New Password" value={newPassword} onChangeText={setNewPassword} placeholder="Min 6 characters" isPassword icon="lock-closed-outline" />
          <ThemedInput label="Confirm New Password" value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Repeat password" isPassword icon="lock-closed-outline" />
          <ThemedButton title={loading ? 'Resetting...' : 'Reset Password'} onPress={handleReset} loading={loading} size="lg" />
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
  label: { 
    fontSize: getResponsiveFontSize(11), 
    fontWeight: '800', 
    color: Colors.primaryDark, 
    textTransform: 'uppercase', 
    letterSpacing: 1, 
    marginBottom: getResponsivePadding(isSmallDevice ? 12 : 16),
    textAlign: 'center',
  },
  otpRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    gap: getResponsivePadding(isSmallDevice ? 4 : 8),
    marginBottom: getResponsivePadding(isSmallDevice ? 18 : 24),
  },
  otpInput: { 
    flex: 1, 
    height: getResponsivePadding(isSmallDevice ? 44 : 54),
    borderRadius: Radius.lg, 
    borderWidth: 2, 
    borderColor: Colors.border, 
    fontSize: getResponsiveFontSize(isSmallDevice ? 18 : 22), 
    fontWeight: '800', 
    color: Colors.primaryDark, 
    backgroundColor: Colors.gray50,
  },
  otpFilled: { 
    borderColor: Colors.accentOrange, 
    backgroundColor: Colors.orange50,
  },
});
