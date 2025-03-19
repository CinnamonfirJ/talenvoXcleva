// app/settings/index.tsx
import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import {
  User,
  Monitor,
  Smartphone,
  Headphones,
  Info,
  ChevronRight,
} from "lucide-react-native";

// Menu Item Component
const MenuItem = ({
  icon,
  title,
  onPress,
}: {
  icon: React.ReactNode;
  title: string;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      className='flex-row items-center py-4 px-4 border-b border-gray-200'
      onPress={onPress}
    >
      <View className='mr-3'>{icon}</View>
      <Text className='flex-1 text-gray-800 text-base'>{title}</Text>
      <ChevronRight size={20} color='#6b7280' />
    </TouchableOpacity>
  );
};

export default function SettingsPage() {
  const router = useRouter();

  // Navigation handlers
  const navigateToProfile = () => {
    router.push("/settings/profile");
  };

  const navigateToLearningPreferences = () => {
    console.log("Not available");
    // router.push("/settings/learning-preferences");
  };

  const navigateToAppPreferences = () => {
    console.log("Not available");
    // router.push("/settings/app-preferences");
  };

  const navigateToSupport = () => {
    console.log("Not available");
    // router.push("/settings/support");
  };

  const navigateToAppInfo = () => {
    console.log("Not available");
    // router.push("/settings/app-info");
  };

  return (
    <SafeAreaView className='flex-1 bg-[#f5f7fa]'>
      <StatusBar barStyle='dark-content' backgroundColor='#f5f7fa' />

      <ScrollView className='flex-1'>
        {/* Header */}
        <View className='pt-6 pb-4 px-4'>
          <Text className='text-2xl font-bold text-[#0a3d91]'>Learnly NG</Text>
        </View>

        {/* Settings Menu */}
        <View className='bg-white rounded-lg mx-4 shadow-sm'>
          <MenuItem
            icon={<User size={24} color='#0a3d91' />}
            title='Profile'
            onPress={navigateToProfile}
          />

          <MenuItem
            icon={<Monitor size={24} color='#0a3d91' />}
            title='Learning Preferences'
            onPress={navigateToLearningPreferences}
          />

          <MenuItem
            icon={<Smartphone size={24} color='#0a3d91' />}
            title='App Preferences'
            onPress={navigateToAppPreferences}
          />

          <MenuItem
            icon={<Headphones size={24} color='#0a3d91' />}
            title='Support & Feedback'
            onPress={navigateToSupport}
          />

          <MenuItem
            icon={<Info size={24} color='#0a3d91' />}
            title='App Information'
            onPress={navigateToAppInfo}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
