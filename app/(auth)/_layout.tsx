import "react-native-gesture-handler";
import { enableScreens } from "react-native-screens";
enableScreens();

import React from "react";
import { Stack } from "expo-router";
import { View, Image, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AuthLayout() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* App Logo */}
      {/* <View style={styles.logoContainer}>
        <Image
          source={require("@/assets/images/icon.png")}
          style={styles.logo}
          resizeMode='contain'
        />
      </View> */}

      {/* Auth Screens */}
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: styles.contentContainer,
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name='login' />
        <Stack.Screen name='signup' />
        {/* <Stack.Screen name="forgot-password" /> */}
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  logoContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  logo: {
    width: 150,
    height: 60,
  },
  contentContainer: {
    backgroundColor: "#FFFFFF",
    flex: 1,
  },
});
