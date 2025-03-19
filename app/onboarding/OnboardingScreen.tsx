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
    <View className='flex-1 items-center justify-center bg-white px-2'>
      <Image
        source={images.onboarding}
        className='w-full h-72 object-cover mb-6'
      />
      <Text className='text-2xl font-bold mb-2 text-gray-800'>
        Welcome to LearnlyNG
      </Text>
      <Text className=' text-gray-500 text-center mb-6'>
        Explore exciting lessons, test your knowledge with quizzes, and earn
        points as you learn. Keep growing, keep achieving!"
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
