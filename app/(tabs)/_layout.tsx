import { icons } from "@/constants/icons";
import { Tabs } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TabIcon = ({ focused, title, icon }: any) => {
  return (
    <View className='w-full justify-center items-center py-2 my-2'>
      <Image
        source={icon}
        tintColor={focused ? "#E1C46D" : "#ffffff"}
        className='w-6 h-6'
      />
      <Text
        numberOfLines={1}
        ellipsizeMode='tail'
        className={`${focused ? "text-[#E1C46D]" : "text-white"} text-center`}
        style={{ fontSize: 10 }}
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
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarStyle: {
          backgroundColor: "#03174B",
          height: 60 + insets.bottom, // Slightly shorter but still comfortable
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          paddingBottom: insets.bottom,
        },
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} title='Home' icon={icons.home} />
          ),
        }}
      />
      <Tabs.Screen
        name='learn'
        options={{
          headerShown: false,
          title: "Learn",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} title='Learn' icon={icons.learn} />
          ),
        }}
      />
      <Tabs.Screen
        name='progress'
        options={{
          headerShown: false,
          title: "Progress",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} title='Progress' icon={icons.progress} />
          ),
        }}
      />
      <Tabs.Screen
        name='quiz'
        options={{
          headerShown: false,
          title: "Quiz",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} title='Quiz' icon={icons.quiz} />
          ),
        }}
      />
      <Tabs.Screen
        name='settings'
        options={{
          headerShown: false,
          title: "Settings",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} title='Settings' icon={icons.settings} />
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;
