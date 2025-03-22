import "react-native-gesture-handler";
import { enableScreens } from "react-native-screens";
enableScreens();

import React from "react";
import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function OnboardingLayout() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style='dark' />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: styles.contentContainer,
          animation: "fade",
        }}
      >
        <Stack.Screen name='index' />
        <Stack.Screen name='step-1' />
        <Stack.Screen name='step-2' />
        <Stack.Screen name='step-3' />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contentContainer: {
    backgroundColor: "#FFFFFF",
    flex: 1,
  },
});
