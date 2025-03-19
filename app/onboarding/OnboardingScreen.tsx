import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { images } from "@/constants/images";

export default function OnboardingScreen() {
  const router = useRouter();

  const handleGetStarted = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    router.replace("/(auth)/signup"); // Redirect to authentication screen
  };

  return (
    <View className='flex-1 items-center justify-center bg-white px-6'>
      <Image source={images.chemistry} className='w-72 h-72 mb-6' />
      <Text className='text-2xl font-bold mb-2 text-gray-800'>
        Welcome to LearnlyNG
      </Text>
      <Text className='text-lg text-gray-500 text-center mb-6'>
        Empowering Minds, Transforming Education.
      </Text>
      <TouchableOpacity
        className='bg-blue-600 px-6 py-3 rounded-lg'
        onPress={handleGetStarted}
      >
        <Text className='text-white text-lg font-semibold'>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}
