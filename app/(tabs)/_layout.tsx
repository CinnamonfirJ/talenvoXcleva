import React, { useEffect, useState } from "react";
import { Tabs, useRouter } from "expo-router";
import { Text, View, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Home,
  BookOpen,
  LineChart,
  ClipboardList,
  Settings,
} from "lucide-react-native"; // Import Lucide icons

const TabIcon = ({ focused, title, Icon }: any) => {
  return (
    <View className='justify-center items-center my-3'>
      <Icon size={26} color={focused ? "#E1C46D" : "#A5A5A5"} />
      <Text
        numberOfLines={1}
        ellipsizeMode='clip'
        style={{
          fontSize: 12,
          fontWeight: "600",
          color: focused ? "#E1C46D" : "#A5A5A5",
          marginTop: 4,
          textAlign: "center",
          zIndex: 10,
          minWidth: 70,
        }}
      >
        {title}
      </Text>
    </View>
  );
};

const _layout = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAppState = async () => {
      try {
        const hasSeenOnboarding = await AsyncStorage.getItem(
          "hasSeenOnboarding"
        );
        const token = await AsyncStorage.getItem("userToken");

        if (!hasSeenOnboarding) {
          await AsyncStorage.setItem("hasSeenOnboarding", "true"); // Mark onboarding as seen
          router.replace("/onboarding/OnboardingScreen"); // Redirect to onboarding
        } else if (!token) {
          router.replace("/(auth)/login"); // Redirect if no token
        }
      } catch (error) {
        console.error("Error checking app state:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAppState();
  }, []);

  if (loading) {
    return (
      <View className='flex-1 justify-center items-center bg-white'>
        <ActivityIndicator size='large' color='#E1C46D' />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
          minHeight: 65,
        },
        tabBarStyle: {
          backgroundColor: "#03174B",
          height: 60 + insets.bottom,
          borderTopWidth: 0,
          paddingBottom: insets.bottom + 10,
          paddingTop: 8,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} title='Home' Icon={Home} />
          ),
        }}
      />
      <Tabs.Screen
        name='learn'
        options={{
          headerShown: false,
          title: "Learn",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} title='Learn' Icon={BookOpen} />
          ),
        }}
      />
      <Tabs.Screen
        name='progress'
        options={{
          headerShown: false,
          title: "Progress",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} title='Progress' Icon={LineChart} />
          ),
        }}
      />
      <Tabs.Screen
        name='quiz'
        options={{
          headerShown: false,
          title: "Quiz",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} title='Quiz' Icon={ClipboardList} />
          ),
        }}
      />
      <Tabs.Screen
        name='settings'
        options={{
          headerShown: false,
          title: "Settings",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} title='Settings' Icon={Settings} />
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;
