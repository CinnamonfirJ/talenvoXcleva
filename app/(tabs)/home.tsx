import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { Bell } from "lucide-react-native";
import { useRouter } from "expo-router";
import { images } from "@/constants/images";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserProfile } from "@/utils/auth";
import { useAuth } from "@/context/AuthContext";

interface subjects {
  title: string;
  subtitle: string;
  image: object;
  onPress: () => void;
}

interface learnings {
  subject: string;
  topic: string;
  progress: number;
  lessonsCompleted: number;
  totalLessons: number;
  onPress: () => void;
}

// Reusable components
const SubjectCard = ({ title, subtitle, image, onPress }: subjects) => {
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

const ProgressBar = ({ progress }: any) => {
  return (
    <View className='bg-gray-200 mt-1 mb-2 rounded-full w-full h-2'>
      <View
        className='bg-yellow-400 rounded-full h-full'
        style={{ width: `${progress}%` }}
      />
    </View>
  );
};

const ContinueLearningCard = ({
  subject,
  topic,
  progress,
  lessonsCompleted,
  totalLessons,
  onPress,
}: learnings) => {
  return (
    <View className='bg-white shadow-sm p-4 rounded-xl w-[48%]'>
      <Text className='font-medium text-black text-base'>{subject}</Text>
      <Text className='text-gray-600 text-sm'>{topic}</Text>
      <Text className='mt-2 text-gray-500 text-xs'>Progress: {progress}%</Text>
      <ProgressBar progress={progress} />
      <Text className='mb-3 text-gray-500 text-xs'>
        Lesson Completed: {lessonsCompleted}/{totalLessons}
      </Text>
      <TouchableOpacity
        className='items-center bg-[#2a4b8d] py-2 rounded-lg'
        onPress={onPress}
      >
        <Text className='font-medium text-white text-sm'>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function Home() {
  const router = useRouter();
  const [isNewUser, setIsNewUser] = useState(true);
  const [userName, setUserName] = useState(""); // This would come from your auth system

  // Use the auth context for authentication
  const { signOut } = useAuth();

  // Load user profile from API
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userData = await getUserProfile();
        const fullName = userData.firstName + " " + userData.lastName;
        setUserName(fullName);
      } catch (error) {
        router.replace("/(auth)/login");
        console.error("Error loading profile:", error);
      }
    };

    loadProfile();
  }, []);

  // Check if user is new or existing
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const userStatus = await AsyncStorage.getItem("userStatus");
        if (userStatus === "existing") {
          setIsNewUser(false);
        } else {
          // For demo purposes, set as existing after first view
          await AsyncStorage.setItem("userStatus", "existing");
        }
      } catch (error) {
        console.error("Error checking user status:", error);
      }
    };

    checkUserStatus();

    // const clearStorage = async () => {
    //   try {
    //     await AsyncStorage.clear();
    //     console.log("AsyncStorage cleared!");
    //   } catch (error) {
    //     console.error("Error clearing AsyncStorage:", error);
    //   }
    // };

    // Call this function to clear storage
    // clearStorage();
  }, []);

  const navigateToSubject = (subject: string) => {
    router.push(`/learn?subject=${subject}`);
  };

  const navigateToQuiz = (quizName: string) => {
    router.push(`/quiz?name=${quizName}`);
  };

  const handleSignOut = () => {
    Alert.alert("Notification", "Signed Out");
    signOut();
  };

  // New User Home Screen
  const NewUserHomeScreen = () => (
    <ScrollView className='flex-1 px-4' showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className='flex-row justify-between items-center mt-4 mb-5'>
        <Text className='font-semibold text-black text-2xl'>
          Welcome, {userName}
        </Text>
        <TouchableOpacity className='p-2' onPress={handleSignOut}>
          <Bell size={24} color='#000' />
        </TouchableOpacity>
      </View>

      {/* Banner */}
      <View className='bg-[#e6e6fa] mb-6 p-4 rounded-xl'>
        <Text className='mb-4 text-gray-700 text-sm text-center leading-5'>
          "Unlock your potential with fun and interactive lessons! Choose a
          subject and start your learning journey today."
        </Text>
        <TouchableOpacity
          className='items-center bg-[#2a4b8d] py-3 rounded-lg'
          onPress={() => router.push("/learn")}
        >
          <Text className='font-semibold text-white text-base'>
            Get started
          </Text>
        </TouchableOpacity>
      </View>

      {/* Topics of the week */}
      <Text className='mb-4 font-semibold text-black text-lg'>
        Topics of the week
      </Text>
      <View className='flex-row justify-between mb-6'>
        <SubjectCard
          title='Indices'
          subtitle='Mathematics'
          image={images.math}
          onPress={() => navigateToSubject("mathematics")}
        />
        <SubjectCard
          title='Proper Nouns'
          subtitle='English'
          image={images.english}
          onPress={() => navigateToSubject("english")}
        />
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

  // Existing User Home Screen
  const ExistingUserHomeScreen = () => (
    <ScrollView className='flex-1 px-4' showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className='flex-row justify-between items-center mt-4 mb-5'>
        <Text className='font-semibold text-black text-2xl'>
          Welcome, {userName}
        </Text>
        <TouchableOpacity className='p-2' onPress={handleSignOut}>
          <Bell size={24} color='#000' />
        </TouchableOpacity>
      </View>

      {/* Upcoming Quiz */}
      <View className='bg-[#ffebe6] mb-6 p-4 rounded-xl'>
        <Text className='mb-1 text-gray-700 text-sm'>Upcoming Quiz:</Text>
        <View className='flex-row justify-between items-center'>
          <Text className='font-semibold text-black text-xl'>
            Algebra Basics
          </Text>
          <TouchableOpacity
            className='bg-[#2a4b8d] px-4 py-2 rounded-lg'
            onPress={() => navigateToQuiz("algebra-basics")}
          >
            <Text className='font-medium text-white text-sm'>Take Quiz</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Continue Learning */}
      <Text className='mb-4 font-semibold text-black text-lg'>
        Continue Learning
      </Text>
      <View className='flex-row justify-between mb-6'>
        <ContinueLearningCard
          subject='Mathematics'
          topic='Angles'
          progress={10}
          lessonsCompleted={2}
          totalLessons={20}
          onPress={() => router.push("/learn?subject=mathematics&topic=angles")}
        />
        <ContinueLearningCard
          subject='Literature'
          topic='Shakespeare'
          progress={50}
          lessonsCompleted={5}
          totalLessons={10}
          onPress={() =>
            router.push("/learn?subject=literature&topic=shakespeare")
          }
        />
      </View>

      {/* Topics of the week */}
      <Text className='mb-4 font-semibold text-black text-lg'>
        Topics of the week
      </Text>
      <View className='flex-row justify-between mb-6'>
        <SubjectCard
          title='Indices'
          subtitle='Mathematics'
          image={images.math}
          onPress={() => navigateToSubject("mathematics")}
        />
        <SubjectCard
          title='Proper Nouns'
          subtitle='English'
          image={images.english}
          onPress={() => navigateToSubject("english")}
        />
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

      {/* Conditionally render the appropriate home screen */}
      {isNewUser ? <NewUserHomeScreen /> : <ExistingUserHomeScreen />}
    </SafeAreaView>
  );
}
