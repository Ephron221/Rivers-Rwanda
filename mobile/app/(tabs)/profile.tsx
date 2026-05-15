import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { Colors, Radius } from '../../src/constants/Colors';
import ThemedButton from '../../src/components/ThemedButton';
import Toast from 'react-native-toast-message';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', onPress: logout, style: 'destructive' },
      ]
    );
  };

  const handlePersonalInfo = () => {
    Toast.show({ type: 'info', text1: 'Personal Information', text2: 'Feature coming soon' });
    // router.push('/profile/edit-info');
  };

  const handleSecurity = () => {
    Toast.show({ type: 'info', text1: 'Security Settings', text2: 'Feature coming soon' });
    // router.push('/profile/change-password');
  };

  const handleNotifications = () => {
    Toast.show({ type: 'info', text1: 'Notification Preferences', text2: 'Feature coming soon' });
    // router.push('/profile/notifications');
  };

  const handleHelpCenter = () => {
    Toast.show({ type: 'info', text1: 'Help Center', text2: 'Feature coming soon' });
    // router.push('/profile/help-center');
  };

  const handleTermsPress = () => {
    setShowTermsModal(true);
  };

  const handlePrivacyPress = () => {
    setShowPrivacyModal(true);
  };

  const SettingRow = ({ icon, title, subtitle, onPress, color = Colors.primaryDark, isLast = false }: any) => (
    <TouchableOpacity 
      style={[styles.settingRow, isLast && { borderBottomWidth: 0 }]} 
      onPress={onPress} 
      activeOpacity={0.7}
    >
      <View style={[styles.settingIcon, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.gray300} />
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      scrollIndicatorInsets={{ bottom: 10 }}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatarWrap}>
          <Text style={styles.avatarText}>
            {user?.first_name?.[0] || user?.email?.[0]?.toUpperCase()}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : 'User'}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{user?.role?.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          <SettingRow 
            icon="person-outline" 
            title="Personal Information" 
            subtitle="Update your details"
            onPress={handlePersonalInfo}
          />
          <SettingRow 
            icon="lock-closed-outline" 
            title="Security" 
            subtitle="Password & authentication"
            onPress={handleSecurity}
          />
          <SettingRow 
            icon="notifications-outline" 
            title="Notifications" 
            subtitle="Alert preferences"
            onPress={handleNotifications}
            isLast
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support & Legal</Text>
        <View style={styles.card}>
          <SettingRow 
            icon="help-circle-outline" 
            title="Help Center" 
            subtitle="FAQ & Support"
            onPress={handleHelpCenter}
          />
          <SettingRow 
            icon="document-text-outline" 
            title="Terms of Service"
            onPress={handleTermsPress}
          />
          <SettingRow 
            icon="shield-checkmark-outline" 
            title="Privacy Policy"
            onPress={handlePrivacyPress}
            isLast
          />
        </View>
      </View>

      <View style={styles.logoutWrap}>
        <ThemedButton 
          title="Sign Out" 
          onPress={handleLogout} 
          variant="ghost" 
          icon={<Ionicons name="log-out-outline" size={20} color={Colors.error} />}
          textStyle={{ color: Colors.error }}
          style={{ borderColor: Colors.error }}
        />
      </View>

      {/* Terms of Service Modal */}
      <Modal
        visible={showTermsModal}
        animationType="slide"
        transparent={false}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowTermsModal(false)}>
              <Ionicons name="close" size={28} color={Colors.primaryDark} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Terms of Service</Text>
            <View style={{ width: 28 }} />
          </View>
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.modalSectionTitle}>1. Acceptance of Terms</Text>
            <Text style={styles.modalText}>
              By accessing and using Rivers-Rwanda platform, you accept and agree to be bound by the terms and provision of this agreement.
            </Text>

            <Text style={styles.modalSectionTitle}>2. Use License</Text>
            <Text style={styles.modalText}>
              Permission is granted to temporarily download one copy of the materials (information or software) on Rivers-Rwanda for personal, non-commercial transitory viewing only.
            </Text>

            <Text style={styles.modalSectionTitle}>3. Disclaimer</Text>
            <Text style={styles.modalText}>
              The materials on Rivers-Rwanda platform are provided on an 'as is' basis. Rivers-Rwanda makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </Text>

            <Text style={styles.modalSectionTitle}>4. Limitations</Text>
            <Text style={styles.modalText}>
              In no event shall Rivers-Rwanda or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Rivers-Rwanda platform.
            </Text>

            <Text style={styles.modalSectionTitle}>5. Accuracy of Materials</Text>
            <Text style={styles.modalText}>
              The materials appearing on Rivers-Rwanda could include technical, typographical, or photographic errors. Rivers-Rwanda does not warrant that any of the materials on its platform are accurate, complete, or current.
            </Text>

            <Text style={styles.modalSectionTitle}>6. Links</Text>
            <Text style={styles.modalText}>
              Rivers-Rwanda has not reviewed all of the sites linked to its platform and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Rivers-Rwanda of the site. Use of any such linked website is at the user's own risk.
            </Text>

            <Text style={styles.modalSectionTitle}>7. Modifications</Text>
            <Text style={styles.modalText}>
              Rivers-Rwanda may revise these terms of service for its platform at any time without notice. By using this platform, you are agreeing to be bound by the then current version of these terms of service.
            </Text>

            <Text style={styles.modalSectionTitle}>8. Governing Law</Text>
            <Text style={styles.modalText}>
              These terms and conditions are governed by and construed in accordance with the laws of Rwanda, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </Text>
          </ScrollView>
        </View>
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal
        visible={showPrivacyModal}
        animationType="slide"
        transparent={false}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowPrivacyModal(false)}>
              <Ionicons name="close" size={28} color={Colors.primaryDark} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Privacy Policy</Text>
            <View style={{ width: 28 }} />
          </View>
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.modalSectionTitle}>1. Introduction</Text>
            <Text style={styles.modalText}>
              Rivers-Rwanda ("we" or "us" or "our") operates the Rivers-Rwanda application. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
            </Text>

            <Text style={styles.modalSectionTitle}>2. Information Collection and Use</Text>
            <Text style={styles.modalText}>
              We collect several different types of information for various purposes to provide and improve our Service to you.
            </Text>
            <Text style={styles.modalSubtitle}>Types of Data Collected:</Text>
            <Text style={styles.modalText}>
              • Personal Data: Name, email address, phone number, address, profile information
              {'\n'}• Usage Data: Device information, IP address, browser type, pages visited
              {'\n'}• Cookies and Similar Tracking Technologies
            </Text>

            <Text style={styles.modalSectionTitle}>3. Use of Data</Text>
            <Text style={styles.modalText}>
              Rivers-Rwanda uses the collected data for various purposes:
              {'\n'}• To provide and maintain our Service
              {'\n'}• To notify you about changes to our Service
              {'\n'}• To provide customer care and support
              {'\n'}• To gather analysis or valuable information so that we can improve our Service
              {'\n'}• To monitor the usage of our Service
              {'\n'}• To detect, prevent and address technical issues
            </Text>

            <Text style={styles.modalSectionTitle}>4. Security of Data</Text>
            <Text style={styles.modalText}>
              The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
            </Text>

            <Text style={styles.modalSectionTitle}>5. Changes to This Privacy Policy</Text>
            <Text style={styles.modalText}>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "effective date" at the top of this Privacy Policy.
            </Text>

            <Text style={styles.modalSectionTitle}>6. Contact Us</Text>
            <Text style={styles.modalText}>
              If you have any questions about this Privacy Policy, please contact us at: support@rivers-rwanda.com
            </Text>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
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
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.primaryDark,
    letterSpacing: -0.5,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 24,
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  avatarWrap: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: Colors.accentOrange,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.accentOrange,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.white,
  },
  userInfo: {
    marginLeft: 20,
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primaryDark,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: Colors.textLight,
    marginBottom: 8,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.blue50,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.md,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.info,
    letterSpacing: 1,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.gray400,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingInfo: {
    flex: 1,
    marginLeft: 16,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textDark,
  },
  settingSubtitle: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  },
  logoutWrap: {
    padding: 24,
    paddingBottom: 40,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: 60,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primaryDark,
    letterSpacing: -0.5,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primaryDark,
    marginTop: 20,
    marginBottom: 12,
  },
  modalSubtitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textDark,
    marginVertical: 8,
  },
  modalText: {
    fontSize: 13,
    color: Colors.textLight,
    lineHeight: 20,
    marginBottom: 12,
    fontWeight: '500',
  },
});
