import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { RelativePathString, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useOnboarding } from "@/context/OnboardingContext";
import { BookOpen } from "lucide-react-native";

export default function OnboardingStep1() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setOnboardingComplete } = useOnboarding();

  const handleSkip = () => {
    setOnboardingComplete();
    router.replace("login" as RelativePathString);
  };

  const handleNext = () => {
    router.push("step-2" as RelativePathString);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {/* Skip button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Main content */}
      <View style={styles.contentContainer}>
        <View style={styles.iconContainer}>
          <BookOpen size={80} color='#264191' />
        </View>

        <Text style={styles.title}>Personalized Learning</Text>

        <Text style={styles.description}>
          Access a wide range of courses tailored to your learning style and
          pace. Our interactive lessons make learning engaging and effective.
        </Text>
      </View>

      {/* Progress indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressDot} />
        <View style={[styles.progressDot, styles.activeDot]} />
        <View style={styles.progressDot} />
        <View style={styles.progressDot} />
      </View>

      {/* Navigation buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
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
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#F0F4FF",
    justifyContent: "center",
    alignItems: "center",
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "#F0F0F0",
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 12,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  backButtonText: {
    color: "#333333",
    fontSize: 18,
    fontWeight: "600",
  },
  nextButton: {
    backgroundColor: "#264191",
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 12,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
