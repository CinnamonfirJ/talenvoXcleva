// app/settings/profile.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  TextInput,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft, Camera, Edit2 } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

// Input Field Component
const InputField = ({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
  editable = true,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  editable?: boolean;
}) => {
  return (
    <View className='mb-4'>
      <Text className='text-gray-700 mb-1'>{label}</Text>
      <TextInput
        className={`border border-gray-300 rounded-lg px-4 py-3 ${
          !editable ? "bg-gray-100" : "bg-white"
        }`}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        editable={editable}
      />
    </View>
  );
};

// User profile interface
interface UserProfile {
  fullName: string;
  email: string;
  profilePicture: string | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>({
    fullName: "",
    email: "",
    profilePicture: null,
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);

  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await AsyncStorage.getItem("user-profile");
        if (profileData) {
          setProfile(JSON.parse(profileData));
        }
        setLoading(false);
      } catch (error) {
        console.error("Error loading profile:", error);
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Save profile changes
  const saveProfile = async () => {
    try {
      await AsyncStorage.setItem("user-profile", JSON.stringify(profile));
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Error", "Failed to update profile");
    }
  };

  // Change password
  const changePassword = () => {
    // In a real app, you would validate the current password
    // and send the new password to your backend

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    // Mock password change
    Alert.alert("Success", "Password changed successfully");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  // Pick image from gallery
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photo library"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfile({
        ...profile,
        profilePicture: result.assets[0].uri,
      });
    }
  };

  // Take photo with camera
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission Required", "Please allow access to your camera");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfile({
        ...profile,
        profilePicture: result.assets[0].uri,
      });
    }
  };

  // Show image picker options
  const showImageOptions = () => {
    Alert.alert("Change Profile Picture", "Choose an option", [
      { text: "Take Photo", onPress: takePhoto },
      { text: "Choose from Gallery", onPress: pickImage },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  // Show loading state
  if (loading) {
    return (
      <SafeAreaView className='flex-1 bg-[#f5f7fa] items-center justify-center'>
        <Text>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='flex-1 bg-[#f5f7fa]'>
      <StatusBar barStyle='dark-content' backgroundColor='#f5f7fa' />

      {/* Header */}
      <View className='flex-row items-center p-4 border-b border-gray-200'>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color='#0a3d91' />
        </TouchableOpacity>
        <Text className='flex-1 text-center text-lg font-semibold text-gray-800 mr-6'>
          Profile
        </Text>
      </View>

      <ScrollView className='flex-1 p-4'>
        {/* Profile Picture */}
        <View className='items-center mb-6'>
          <View className='relative'>
            <Image
              source={
                profile.profilePicture
                  ? { uri: profile.profilePicture }
                  : require("@/assets/default-avatar.png")
              }
              className='w-24 h-24 rounded-full'
            />
            <TouchableOpacity
              className='absolute bottom-0 right-0 bg-[#0a3d91] p-2 rounded-full'
              onPress={showImageOptions}
            >
              <Camera size={16} color='#fff' />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Information */}
        <View className='bg-white rounded-lg p-4 mb-6'>
          <Text className='text-lg font-semibold text-gray-800 mb-4'>
            Personal Information
          </Text>

          <InputField
            label='Full Name'
            value={profile.fullName}
            onChangeText={(text) => setProfile({ ...profile, fullName: text })}
          />

          <InputField
            label='Email'
            value={profile.email}
            onChangeText={(text) => setProfile({ ...profile, email: text })}
          />

          <TouchableOpacity
            className='bg-[#0a3d91] rounded-lg py-3 items-center mt-2'
            onPress={saveProfile}
          >
            <Text className='text-white font-medium'>Save Changes</Text>
          </TouchableOpacity>
        </View>

        {/* Change Password */}
        <View className='bg-white rounded-lg p-4 mb-6'>
          <Text className='text-lg font-semibold text-gray-800 mb-4'>
            Change Password
          </Text>

          <InputField
            label='Current Password'
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
          />

          <InputField
            label='New Password'
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />

          <InputField
            label='Confirm New Password'
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <TouchableOpacity
            className='bg-[#0a3d91] rounded-lg py-3 items-center mt-2'
            onPress={changePassword}
          >
            <Text className='text-white font-medium'>Change Password</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
