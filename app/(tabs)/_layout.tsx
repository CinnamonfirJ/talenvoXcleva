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
  LucideIcon,
} from "lucide-react-native";

// Define proper types for the TabIcon component
type TabIconProps = {
  focused: boolean;
  title: string;
  Icon: LucideIcon;
};

const TabIcon = ({ focused, title, Icon }: TabIconProps) => {
  // Define colors as constants for better maintainability
  const ACTIVE_COLOR = "#E1C46D";
  const INACTIVE_COLOR = "#A5A5A5";

  return (
    <View className='justify-center items-center my-3'>
      <Icon size={26} color={focused ? ACTIVE_COLOR : INACTIVE_COLOR} />
      <Text
        numberOfLines={1}
        ellipsizeMode='clip'
        style={{
          fontSize: 12,
          fontWeight: "600",
          color: focused ? ACTIVE_COLOR : INACTIVE_COLOR,
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

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  // Define tab bar style as a constant for better readability
  const tabBarStyle = {
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
  };

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
          minHeight: 65,
        },
        tabBarStyle,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name='home'
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} title='Home' Icon={Home} />
          ),
        }}
      />
      <Tabs.Screen
        name='learn'
        options={{
          title: "Learn",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} title='Learn' Icon={BookOpen} />
          ),
        }}
      />
      <Tabs.Screen
        name='progress'
        options={{
          title: "Progress",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} title='Progress' Icon={LineChart} />
          ),
        }}
      />
      <Tabs.Screen
        name='quiz'
        options={{
          title: "Quiz",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} title='Quiz' Icon={ClipboardList} />
          ),
        }}
      />
      <Tabs.Screen
        name='settings'
        options={{
          title: "Settings",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} title='Settings' Icon={Settings} />
          ),
        }}
      />
    </Tabs>
  );
}
