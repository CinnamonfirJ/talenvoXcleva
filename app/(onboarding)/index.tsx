import React, { useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useOnboarding } from "@/context/OnboardingContext";
import { images } from "@/constants/images";

export default function OnboardingIndex() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setOnboardingComplete } = useOnboarding();

  const handleSkip = async () => {
    await setOnboardingComplete();
    router.replace("/(auth)/login");
  };

  const handleNext = () => {
    router.push("/(onboarding)/step-1");
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {/* Skip button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Main content */}
      <View style={styles.contentContainer}>
        <Image
          source={images.onboarding}
          style={styles.image}
          resizeMode='contain'
        />

        <Text style={styles.title}>Welcome to LearnlyNG</Text>

        <Text style={styles.description}>
          Your journey to knowledge and skills mastery begins here. Let's
          explore what LearnlyNG has to offer.
        </Text>
      </View>

      {/* Progress indicator */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressDot, styles.activeDot]} />
        <View style={styles.progressDot} />
        <View style={styles.progressDot} />
        <View style={styles.progressDot} />
      </View>

      {/* Next button */}
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  skipButton: {
    alignSelf: "flex-end",
    padding: 10,
  },
  skipText: {
    color: "#264191",
    fontSize: 16,
    fontWeight: "600",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  image: {
    width: "100%",
    height: 300,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#03174B",
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#E1C46D",
    width: 20,
  },
  nextButton: {
    backgroundColor: "#264191",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
