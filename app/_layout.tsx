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
  const [isMounted, setIsMounted] = useState(false); // To prevent navigation issues

  useEffect(() => {
    setIsMounted(true); // Mark component as mounted

    const checkAuthAndOnboarding = async () => {
      try {
        const [token, hasSeenOnboarding] = await Promise.all([
          AsyncStorage.getItem("userToken"),
          AsyncStorage.getItem("hasSeenOnboarding"),
        ]);

        setFirstLaunch(hasSeenOnboarding === null);

        if (token) {
          setIsLoggedIn(true);
        } else if (isMounted) {
          router.replace("/(auth)/login"); // Redirect only if component is mounted
        }
      } catch (error) {
        console.error("Error checking auth and onboarding:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndOnboarding();

    return () => setIsMounted(false); // Cleanup on unmount
  }, [router]);

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
            <Stack.Screen name='(auth)/signup' />
            <Stack.Screen name='(auth)/login' />
          </>
        )}
      </Stack>
      <ToastProvider />
    </>
  );
}
