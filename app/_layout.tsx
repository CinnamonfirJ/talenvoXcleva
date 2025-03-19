import { Stack, useRouter } from "expo-router";
import "./global.css";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";
import ToastProvider from "@/utils/ToastProvider";

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firstLaunch, setFirstLaunch] = useState<boolean | null>(null);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Ensure component is mounted

    const checkAuthAndOnboarding = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const hasSeenOnboarding = await AsyncStorage.getItem(
          "hasSeenOnboarding"
        );

        // If hasSeenOnboarding is null, set firstLaunch to true
        setFirstLaunch(hasSeenOnboarding === null);

        if (token) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false); // Explicitly mark as logged out
        }
      } catch (error) {
        console.error("Error checking auth and onboarding:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndOnboarding();

    return () => setIsMounted(false);
  }, []);

  // Redirect only when loading is done and user is not logged in
  useEffect(() => {
    if (!loading && isMounted && !isLoggedIn) {
      router.push("/(auth)/login"); // Ensure navigation happens once
    }
  }, [loading, isLoggedIn, isMounted]);

  if (loading) {
    return (
      <View className='flex-1 items-center justify-center bg-white'>
        <ActivityIndicator size='large' color='#007BFF' />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {firstLaunch ? (
          <Stack.Screen name='onboarding/OnboardingScreen' />
        ) : isLoggedIn ? (
          <>
            <Stack.Screen name='(tabs)' />
            <Stack.Screen name='learn/[subject]' />
            <Stack.Screen name='learn/[subject]/[topicId]' />
            <Stack.Screen name='learn/[subject]/[topicId]/lesson/[lessonId]' />
            <Stack.Screen name='quiz/[quizId]' />
          </>
        ) : (
          <>
            <Stack.Screen name='(auth)/login' />
            <Stack.Screen name='(auth)/signup' />
          </>
        )}
      </Stack>
      <ToastProvider />
    </>
  );
}
