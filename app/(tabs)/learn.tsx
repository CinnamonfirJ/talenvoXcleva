import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Bell } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { images } from "@/constants/images";

// Define the navigation types
type LearnNavigationProps = NativeStackNavigationProp<{
  Subject: { subject: string };
  Quiz: { name: string };
}>;

interface SubjectCardProps {
  title: string;
  subtitle: string;
  image: any; // Changed from object to any for image source
  onPress: () => void;
}

// Reusable components
const SubjectCard = ({ title, subtitle, image, onPress }: SubjectCardProps) => {
  return (
    <TouchableOpacity
      className='bg-white shadow-sm rounded-xl w-[48%] overflow-hidden'
      onPress={onPress}
    >
      <Image
        source={image}
        className='rounded-xl w-full h-[150px] object-cover'
      />
      <View className='p-3'>
        <Text className='font-medium text-black text-base'>{title}</Text>
        {subtitle ? (
          <Text className='mt-1 text-gray-600 text-sm'>{subtitle}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export default function Learn() {
  // Use React Navigation's useNavigation hook
  const navigation = useNavigation<LearnNavigationProps>();

  const navigateToSubject = (subject: string) => {
    // Navigate to the Subject screen with the subject parameter
    navigation.navigate("Subject", { subject });
  };

  const navigateToQuiz = (quizName: string) => {
    // Navigate to the Quiz screen with the name parameter
    navigation.navigate("Quiz", { name: quizName });
  };

  // New User Home Screen
  const NewUserHomeScreen = () => (
    <ScrollView className='flex-1 px-4' showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className='flex-row justify-between items-center mt-4 mb-5'>
        <Text className='font-semibold text-black text-2xl'>Welcome</Text>
        <TouchableOpacity className='p-2'>
          <Bell size={24} color='#000' />
        </TouchableOpacity>
      </View>

      {/* Subjects */}
      <Text className='mb-4 font-semibold text-black text-lg'>Subjects</Text>
      <View className='flex-row justify-between mb-6'>
        <SubjectCard
          title='Mathematics'
          subtitle=''
          image={images.math}
          onPress={() => navigateToSubject("mathematics")}
        />
        <SubjectCard
          title='English'
          subtitle=''
          image={images.english}
          onPress={() => navigateToSubject("english")}
        />
      </View>

      <View className='h-20' />
    </ScrollView>
  );

  return (
    <SafeAreaView className='flex-1 bg-[#f5f7fa]'>
      <StatusBar barStyle='dark-content' backgroundColor='#f5f7fa' />
      <NewUserHomeScreen />
    </SafeAreaView>
  );
}
