import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Toast from "react-native-toast-message";
import { Eye, EyeOff, ArrowLeft } from "lucide-react-native";
import { registerUser } from "@/utils/auth";
import { useRouter } from "expo-router";
import { showToast } from "@/utils/ToastProvider";
import { Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SignupScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("user");
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = Dimensions.get("window");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: { name: role },
  });

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async () => {
    // Basic validation
    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.password ||
      !form.phoneNumber ||
      !form.role
    ) {
      showToast(
        "error",
        "Missing fields",
        "Please fill in all required fields"
      );
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      showToast("error", "Invalid email", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      await registerUser(form);
      showToast("success", "Signup successful!", "Welcome! Please log in.");
      // Fix: Use the correct route path for login
      router.push("/(auth)/login");
    } catch (error: any) {
      showToast(
        "error",
        "Signup failed!",
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

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
            <ArrowLeft
              size={24}
              color={`${role == "user" ? "white" : "#03174B"}`}
            />
          </TouchableOpacity>

          {/* Blue Background */}

          <View
            className={`justify-center items-center ${
              role == "user" ? "bg-[#03174B] text-white" : "bg-[#FEE086]"
            } rounded-b-[150px] w-full h-40`}
          >
            <Text
              className={`font-bold text-4xl ${
                role == "user" ? "text-white" : "text-[#03174B]"
              }`}
            >
              LearnlyNG
            </Text>
            <Text
              className={`px-4 text-xs text-center ${
                role == "user" ? "text-white" : "text-[#03174B]"
              }`}
            >
              Empowering Minds, Transforming Education.
            </Text>
          </View>
        </View>

        {/* Role Change */}
        <View className='flex flex-row justify-end gap-3 px-5'>
          <TouchableOpacity
            className={`bg-[#dae1f8] mt-6 px-5 py-2 ${
              role == "user" ? "border border-[#264191]" : ""
            } rounded-xl`}
            onPress={() => setRole("user")}
            disabled={loading}
          >
            <Text className='text-center'>Student</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`bg-[#dae1f8] mt-6 px-5 py-2 ${
              role != "user" ? "border border-[#264191]" : ""
            } rounded-xl`}
            onPress={() => setRole("teacher")}
            disabled={loading}
          >
            <Text className='text-center'>Teacher</Text>
          </TouchableOpacity>
        </View>

        <View className='mt-8 px-6 pb-8'>
          <Text className='mb-4 font-bold text-[#03174B] text-2xl'>
            Create Account
          </Text>

          <Text className='text-gray-700'>First Name</Text>
          <TextInput
            className='mt-1 p-3 border border-gray-300 rounded-md'
            placeholder='First Name'
            value={form.firstName}
            onChangeText={(text) => handleChange("firstName", text)}
          />

          <Text className='mt-4 text-gray-700'>Last Name</Text>
          <TextInput
            className='mt-1 p-3 border border-gray-300 rounded-md'
            placeholder='Last Name'
            value={form.lastName}
            onChangeText={(text) => handleChange("lastName", text)}
          />

          <Text className='mt-4 text-gray-700'>Email Address</Text>
          <TextInput
            className='mt-1 p-3 border border-gray-300 rounded-md'
            placeholder='Email'
            keyboardType='email-address'
            autoCapitalize='none'
            value={form.email}
            onChangeText={(text) => handleChange("email", text)}
          />

          <Text className='mt-4 text-gray-700'>Phone Number</Text>
          <TextInput
            className='mt-1 p-3 border border-gray-300 rounded-md'
            placeholder='Phone Number'
            keyboardType='phone-pad'
            value={form.phoneNumber}
            onChangeText={(text) => handleChange("phoneNumber", text)}
          />

          <Text className='mt-4 text-gray-700'>Password</Text>
          <View className='flex-row items-center mt-1 border border-gray-300 rounded-md'>
            <TextInput
              className='flex-1 p-3'
              placeholder='Password'
              secureTextEntry={!showPassword}
              value={form.password}
              onChangeText={(text) => handleChange("password", text)}
            />
            <TouchableOpacity
              className='px-3'
              onPress={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <Eye size={20} color={"#000"} />
              ) : (
                <EyeOff size={20} color={"#000"} />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className={`bg-[#264191] mt-6 p-4 rounded-xl  ${
              role == "user" ? "bg-[#03174B]" : "bg-[#EEC200]"
            }`}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color='white' />
            ) : (
              <Text
                className={`text-center ${
                  role == "user" ? " text-white" : "text-[#03174B]"
                }`}
              >
                Sign Up
              </Text>
            )}
          </TouchableOpacity>

          <Text className='mt-4 text-gray-600 text-center'>
            Already have an account?{" "}
            <Text
              className='font-semibold text-[#264191]'
              onPress={() => router.push("/(auth)/login")}
            >
              Sign in
            </Text>
          </Text>
        </View>
      </ScrollView>
      <Toast />
    </KeyboardAvoidingView>
  );
}
