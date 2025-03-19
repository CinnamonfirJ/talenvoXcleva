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
import { useRouter } from "expo-router";
import { loginUser } from "@/services/auth";
import { showToast } from "@/utils/ToastProvider";

export default function LoginScreen() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      await loginUser(form.email, form.password);
      showToast("success", "Login Successful", "Welcome back!");

      router.replace("/(tabs)/index"); // Redirect to home page
    } catch (error: any) {
      showToast(
        "error",
        "Login Failed",
        error.message || "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className='flex-1 bg-white'>
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
        <Text className='text-gray-700'>Email Address</Text>
        <TextInput
          className='border border-gray-300 rounded-md p-3 mt-1'
          placeholder='Email'
          keyboardType='email-address'
          autoCapitalize='none'
          value={form.email}
          onChangeText={(text) => handleChange("email", text)}
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
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color='white' />
          ) : (
            <Text className='text-white text-center font-semibold'>Log In</Text>
          )}
        </TouchableOpacity>

        <Text className='text-center text-gray-600 mt-4'>
          Don't have an account?{" "}
          <Text
            className='text-[#264191]'
            onPress={() => router.push("/signup")}
          >
            Sign Up
          </Text>
        </Text>
      </View>

      <Toast />
    </View>
  );
}
