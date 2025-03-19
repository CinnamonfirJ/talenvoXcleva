import React from "react";
import { Tabs } from "expo-router";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
        ellipsizeMode='clip' // Ensures text is fully visible
        style={{
          fontSize: 12,
          fontWeight: "600",
          color: focused ? "#E1C46D" : "#A5A5A5",
          marginTop: 4,
          textAlign: "center",
          zIndex: 10,
          minWidth: 70, // Ensures text has enough space
        }}
      >
        {title}
      </Text>
    </View>
  );
};

const _layout = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
          minHeight: 65, // Prevents tab bar from cutting off text
        },
        tabBarStyle: {
          backgroundColor: "#03174B",
          height: 60 + insets.bottom, // Increased height
          borderTopWidth: 0,
          paddingBottom: insets.bottom + 10, // Extra padding to avoid cutoff
          paddingTop: 8, // Gives more space for text visibility
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
