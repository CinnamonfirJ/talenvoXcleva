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
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft, Camera } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { getUserProfile } from "@/utils/auth";

const BASE_URL = "https://talenvo-hackaton-be.onrender.com/api/v1";

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
  const [loading, setLoading] = useState(true);

  // Load user profile from API
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userData = await getUserProfile();
        const fullName = userData.firstName + userData.lastName;
        setProfile({
          fullName: fullName || "",
          email: userData.email || "",
          profilePicture: userData.profilePicture || null,
        });

        setLoading(false);
      } catch (error) {
        console.error("Error loading profile:", error);
        Alert.alert("Error", "Failed to load profile");
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Save profile changes to API
  const saveProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) throw new Error("No token found");

      const response = await fetch(`${BASE_URL}/user/update-profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data?.message || "Failed to update profile");

      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Error", "Failed to update profile");
    }
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
      setProfile({ ...profile, profilePicture: result.assets[0].uri });
    }
  };

  // Show loading state
  if (loading) {
    return (
      <SafeAreaView className='flex-1 bg-[#f5f7fa] items-center justify-center'>
        <ActivityIndicator size='large' color='#0a3d91' />
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
              onPress={pickImage}
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
            onChangeText={() => {}}
            editable={false}
          />

          <TouchableOpacity
            className='bg-[#0a3d91] rounded-lg py-3 items-center mt-2'
            onPress={saveProfile}
          >
            <Text className='text-white font-medium'>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
