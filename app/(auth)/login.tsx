import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import Toast from "react-native-toast-message";
import { Eye, EyeOff, ArrowLeft } from "lucide-react-native";
import { RelativePathString, useRouter } from "expo-router";
import { showToast } from "@/utils/ToastProvider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const insets = useSafeAreaInsets();

  // Use the auth context for authentication
  const { signIn, isAuthenticated, isLoading: authLoading, user } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace("home" as RelativePathString);
    }
  }, [isAuthenticated, user]);

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    // Basic validation
    if (!form.email || !form.password) {
      showToast(
        "error",
        "Missing fields",
        "Please enter your email and password"
      );
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      showToast("error", "Invalid email", "Please enter a valid email address");
      return;
    }

    setLocalLoading(true);
    try {
      // Use the signIn function from AuthContext
      const result = await signIn(form.email, form.password);
      showToast(
        "success",
        "Login Successful",
        `Welcome back, ${user?.firstName || "User"}!`
      );

      // No need to navigate here - the useEffect will handle redirection
    } catch (error: any) {
      showToast(
        "error",
        "Login Failed",
        error.message || "Invalid credentials"
      );
    } finally {
      setLocalLoading(false);
    }
  };

  // Determine if we're in a loading state
  const loading = localLoading || authLoading;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView className='flex-1 bg-white'>
        <View
          style={{ paddingTop: insets.top }}
          className='relative items-center w-full'
        >
          {/* Back button */}
          <TouchableOpacity
            className='left-4 z-10 absolute'
            style={{ top: insets.top + 10 }}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color='white' />
          </TouchableOpacity>

          {/* Blue Background */}
          <View className='justify-center items-center bg-[#03174B] rounded-b-[150px] w-full h-40'>
            <Text className='font-bold text-white text-4xl'>LearnlyNG</Text>
            <Text className='px-4 text-white text-xs text-center'>
              Empowering Minds, Transforming Education.
            </Text>
          </View>
        </View>

        <View className='mt-8 px-6 pb-8'>
          <Text className='mb-4 font-bold text-[#03174B] text-2xl'>
            Welcome Back
          </Text>

          <Text className='text-gray-700'>Email Address</Text>
          <TextInput
            className='mt-1 p-3 border border-gray-300 rounded-md'
            placeholder='Email'
            keyboardType='email-address'
            autoCapitalize='none'
            value={form.email}
            onChangeText={(text) => handleChange("email", text)}
            editable={!loading}
          />

          <Text className='mt-4 text-gray-700'>Password</Text>
          <View className='flex-row items-center mt-1 border border-gray-300 rounded-md'>
            <TextInput
              className='flex-1 p-3'
              placeholder='Password'
              secureTextEntry={!showPassword}
              value={form.password}
              onChangeText={(text) => handleChange("password", text)}
              editable={!loading}
            />
            <TouchableOpacity
              className='px-3'
              onPress={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              {showPassword ? (
                <Eye size={20} color={loading ? "#ccc" : "#000"} />
              ) : (
                <EyeOff size={20} color={loading ? "#ccc" : "#000"} />
              )}
            </TouchableOpacity>
          </View>

          {/* <TouchableOpacity
            className="self-end mt-2"
            onPress={() => router.push("/(auth)/forgot-password")}
            disabled={loading}
          >
            <Text className={`${loading ? "text-gray-400" : "text-[#264191]"}`}>
              Forgot Password?
            </Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            className={`p-4 rounded-xl mt-6 ${
              loading ? "bg-[#6B82C3]" : "bg-[#264191]"
            }`}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color='white' />
            ) : (
              <Text className='font-semibold text-white text-center'>
                Log In
              </Text>
            )}
          </TouchableOpacity>

          <Text className='mt-4 text-gray-600 text-center'>
            Don't have an account?{" "}
            <Text
              className={`font-semibold ${
                loading ? "text-gray-400" : "text-[#264191]"
              }`}
              onPress={() => !loading && router.push("/(auth)/signup")}
            >
              Sign Up
            </Text>
          </Text>
        </View>
      </ScrollView>
      <Toast />
    </KeyboardAvoidingView>
  );
}
