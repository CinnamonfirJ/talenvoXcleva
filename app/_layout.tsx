import "react-native-gesture-handler";
import { enableScreens } from "react-native-screens";
enableScreens();

import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import "./global.css";

import ToastProvider from "@/utils/ToastProvider";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { OnboardingProvider, useOnboarding } from "@/context/OnboardingContext";
import { ActivityIndicator, View } from "react-native";
import ErrorOverlay from "@/utils/ErrorOverlay";
import { ErrorProvider } from "@/context/ErrorContext";

// Root layout wrapper with all providers
export default function RootLayout() {
  return (
    <AuthProvider>
      <OnboardingProvider>
        <ToastProvider>
          <ErrorProvider>
            <RootLayoutNav />
            <ErrorOverlay />
          </ErrorProvider>
        </ToastProvider>
      </OnboardingProvider>
    </AuthProvider>
  );
}

// Navigation logic based on auth state
function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const { hasCompletedOnboarding } = useOnboarding();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (
      isLoading ||
      isAuthenticated === null ||
      hasCompletedOnboarding === null
    )
      return; // Avoid redirecting too early

    const inAuthGroup = segments[0] === "(auth)";
    const inOnboardingGroup = segments[0] === "(onboarding)";
    const inTabsGroup = segments[0] === "(tabs)";

    if (!isAuthenticated) {
      // Not authenticated
      if (!inAuthGroup && !inOnboardingGroup) {
        // Redirect to onboarding if first time, otherwise to login
        router.replace(
          hasCompletedOnboarding ? "/(auth)/login" : "/(onboarding)"
        );
      }
    } else {
      // User is authenticated
      if (inAuthGroup) {
        // Redirect to home if already authenticated
        router.replace("/(tabs)/home");
      } else if (!hasCompletedOnboarding && !inOnboardingGroup) {
        // If authenticated but hasn't completed onboarding
        router.replace("/(onboarding)");
      }
    }
  }, [isAuthenticated, isLoading, segments, hasCompletedOnboarding]);

  // Show loading indicator while checking authentication
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size='large' color='#0000ff' />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='(onboarding)' />
      <Stack.Screen name='(auth)' />
      {/* <Stack.Screen name='(auth)/signup' /> */}
      <Stack.Screen name='(tabs)' />
      {/* <Stack.Screen name='learn/[subject]' />
      <Stack.Screen name='learn/[subject]/[topicId]' />
      <Stack.Screen name='learn/[subject]/[topicId]/lesson/[lessonId]' />
      <Stack.Screen name='quiz/[quizId]' /> */}
    </Stack>
  );
}
