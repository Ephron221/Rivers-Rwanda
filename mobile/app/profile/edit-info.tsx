import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../src/context/AuthContext';
import { userService } from '../../src/api/user.service';
import ThemedButton from '../../src/components/ThemedButton';
import ThemedInput from '../../src/components/ThemedInput';
import { Colors, Radius } from '../../src/constants/Colors';

export default function EditPersonalInfoScreen() {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [phone, setPhone] = useState(user?.phone_number || '');
  const [profileImage, setProfileImage] = useState<string | null>(user?.profile_image || null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({ type: 'error', text1: 'Permission denied', text2: 'Please allow access to your photos' });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.cancelled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error selecting image' });
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({ type: 'error', text1: 'Permission denied', text2: 'Please allow access to your camera' });
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.cancelled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error taking photo' });
    }
  };

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim() || !phone.trim()) {
      Toast.show({ type: 'error', text1: 'Please fill in all fields' });
      return;
    }

    setLoading(true);
    try {
      const updateData: any = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: phone.trim(),
      };

      if (selectedImage) {
        updateData.profileImage = selectedImage;
      }

      const result = await userService.updateProfile(updateData);
      
      // Update auth context
      await updateUser({
        first_name: result.first_name,
        last_name: result.last_name,
        phone_number: result.phone_number,
        profile_image: result.profile_image,
      });

      Toast.show({ type: 'success', text1: 'Profile Updated', text2: 'Your information has been saved' });
      router.back();
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: error.response?.data?.message || 'Please try again',
      });
    } finally {
      setLoading(false);
    }
  };

  const displayImage = selectedImage || profileImage;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.primaryDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal Information</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {/* Profile Image Section */}
        <View style={styles.imageSection}>
          <View style={styles.imageContainer}>
            {displayImage ? (
              <Image source={{ uri: displayImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Ionicons name="person" size={48} color={Colors.gray300} />
              </View>
            )}
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={() => {
                Alert.alert('Change Photo', 'Choose an option', [
                  { text: 'Take Photo', onPress: takePhoto },
                  { text: 'Choose from Library', onPress: pickImage },
                  { text: 'Cancel', style: 'cancel' },
                ]);
              }}
            >
              <Ionicons name="camera" size={16} color={Colors.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.imageHint}>Tap camera icon to change photo</Text>
        </View>

        {/* User Information Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Details</Text>
          <View style={styles.card}>
            <ThemedInput
              label="First Name"
              value={firstName}
              onChangeText={setFirstName}
              placeholder="John"
              icon="person-outline"
            />
            <ThemedInput
              label="Last Name"
              value={lastName}
              onChangeText={setLastName}
              placeholder="Doe"
              icon="person-outline"
              style={{ marginTop: 16 }}
            />
            <ThemedInput
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
              placeholder="+250 7XX XXX XXX"
              keyboardType="phone-pad"
              icon="call-outline"
              style={{ marginTop: 16 }}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <ThemedButton
            title={loading ? 'Saving...' : 'Save Changes'}
            onPress={handleSave}
            loading={loading}
            size="lg"
          />
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => router.back()}
            disabled={loading}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGray,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  content: {
    padding: 20,
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.gray100,
    borderWidth: 4,
    borderColor: Colors.accentOrange,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: Colors.gray200,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accentOrange,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  imageHint: {
    fontSize: 12,
    color: Colors.textLight,
    fontWeight: '500',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.gray400,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.gray100,
  },
  actions: {
    marginBottom: 30,
  },
  cancelBtn: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelText: {
    color: Colors.textLight,
    fontWeight: '700',
    fontSize: 14,
  },
});
