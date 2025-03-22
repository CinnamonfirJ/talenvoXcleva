import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useErrorContext } from "@/context/ErrorContext";

const ErrorOverlay: React.FC = () => {
  const { errors } = useErrorContext();

  if (errors.length === 0) return null;

  return (
    <View style={styles.overlay}>
      {errors.map((error, index) => (
        <Text key={index} style={styles.errorText}>
          {error.message}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 8,
    zIndex: 1000,
  },
  errorText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ErrorOverlay;
