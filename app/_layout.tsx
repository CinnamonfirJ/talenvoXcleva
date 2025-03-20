import { Stack } from "expo-router";
import "./global.css";

import ToastProvider from "@/utils/ToastProvider";

export default function RootLayout() {
  return (
    <ToastProvider>
      <Stack
        screenOptions={{ headerShown: false }}
        initialRouteName='(auth)/login'
      >
        <Stack.Screen name='onboarding/OnboardingScreen' />
        <Stack.Screen name='(auth)/login' />
        <Stack.Screen name='(auth)/signup' />
        <Stack.Screen name='(tabs)' />
        <Stack.Screen name='learn/[subject]' />
        <Stack.Screen name='learn/[subject]/[topicId]' />
        <Stack.Screen name='learn/[subject]/[topicId]/lesson/[lessonId]' />
        <Stack.Screen name='quiz/[quizId]' />
      </Stack>
    </ToastProvider>
  );
}
