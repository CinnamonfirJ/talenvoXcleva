import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Toast from "react-native-toast-message";
import { Eye, EyeOff } from "lucide-react-native";
import { registerUser } from "@/services/auth";
import { useRouter } from "expo-router";
import { showToast } from "@/utils/ToastProvider";
import { Dimensions } from "react-native";

export default function SignupScreen() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: { name: "user" },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async () => {
    setLoading(true);
    try {
      await registerUser(form);
      showToast("success", "Signup successful!", " Welcome! Please log in.");
      router.push("/(auth)/login");
    } catch (error: any) {
      showToast(
        "error",
        "Signup failed!",
        error.response?.data?.message || "Signup failed!"
      );
    } finally {
      setLoading(false);
    }
  };
  const { width } = Dimensions.get("window"); // Get screen width

  return (
    <View className='flex-1 bg-white '>
      <View className='relative w-full items-center'>
        {/* Blue Background */}
        <View className='bg-[#03174B] w-full h-40 items-center justify-center rounded-b-[150px]'>
          <Text className='text-white text-4xl font-bold'>LearnlyNG</Text>
          <Text className='text-white text-xs text-center px-4'>
            Empowering Minds, Transforming Education.
          </Text>
        </View>
      </View>
      <View className='mt-8 px-6'>
        <Text className='text-gray-700'>First Name</Text>
        <TextInput
          className='border border-gray-300 rounded-md p-3 mt-1'
          placeholder='First Name'
          value={form.firstName}
          onChangeText={(text) => handleChange("firstName", text)}
        />

        <Text className='text-gray-700 mt-4'>Last Name</Text>
        <TextInput
          className='border border-gray-300 rounded-md p-3 mt-1'
          placeholder='Last Name'
          value={form.lastName}
          onChangeText={(text) => handleChange("lastName", text)}
        />

        <Text className='text-gray-700 mt-4'>Email Address</Text>
        <TextInput
          className='border border-gray-300 rounded-md p-3 mt-1'
          placeholder='Email'
          keyboardType='email-address'
          autoCapitalize='none'
          value={form.email}
          onChangeText={(text) => handleChange("email", text)}
        />

        <Text className='text-gray-700 mt-4'>Phone Number</Text>
        <TextInput
          className='border border-gray-300 rounded-md p-3 mt-1'
          placeholder='Phone Number'
          keyboardType='phone-pad'
          value={form.phoneNumber}
          onChangeText={(text) => handleChange("phoneNumber", text)}
        />

        <Text className='text-gray-700 mt-4'>Password</Text>
        <View className='flex-row items-center border border-gray-300 rounded-md p-1 mt-1'>
          <TextInput
            className='flex-1'
            placeholder='Password'
            secureTextEntry={!showPassword}
            value={form.password}
            onChangeText={(text) => handleChange("password", text)}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <Eye size={20} color={"#000"} />
            ) : (
              <EyeOff size={20} color={"#000"} />
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className='bg-[#264191] p-3 rounded-xl mt-6'
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color='white' />
          ) : (
            <Text className='text-white text-center font-semibold'>
              Sign Up
            </Text>
          )}
        </TouchableOpacity>

        <Text className='text-center text-gray-600 mt-4'>
          Already have an account?{" "}
          <Text
            className='text-[#264191]'
            onPress={() => router.push("/(auth)/login")}
          >
            Sign in
          </Text>
        </Text>
      </View>

      <Toast />
    </View>
  );
}
