import React, { useState, useEffect } from "react";
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
import { useRouter } from "expo-router";
import { images } from "@/constants/images";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
      className='w-[48%] rounded-xl overflow-hidden bg-white shadow-sm'
      onPress={onPress}
    >
      <Image source={image} className='w-full h-[150px] object-cover' />
      <View className='p-3'>
        <Text className='text-base font-medium text-black'>{title}</Text>
        {subtitle ? (
          <Text className='text-sm text-gray-600 mt-1'>{subtitle}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const ProgressBar = ({ progress }: any) => {
  return (
    <View className='h-2 w-full bg-gray-200 rounded-full mt-1 mb-2'>
      <View
        className='h-full bg-yellow-400 rounded-full'
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
    <View className='bg-white rounded-xl p-4 shadow-sm w-[48%]'>
      <Text className='text-base font-medium text-black'>{subject}</Text>
      <Text className='text-sm text-gray-600'>{topic}</Text>
      <Text className='text-xs text-gray-500 mt-2'>Progress: {progress}%</Text>
      <ProgressBar progress={progress} />
      <Text className='text-xs text-gray-500 mb-3'>
        Lesson Completed: {lessonsCompleted}/{totalLessons}
      </Text>
      <TouchableOpacity
        className='bg-[#2a4b8d] rounded-lg py-2 items-center'
        onPress={onPress}
      >
        <Text className='text-white text-sm font-medium'>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function Home() {
  const router = useRouter();
  const [isNewUser, setIsNewUser] = useState(true);
  const userName = "Ilerioluwa"; // This would come from your auth system

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

    const clearStorage = async () => {
      try {
        await AsyncStorage.clear();
        console.log("AsyncStorage cleared!");
      } catch (error) {
        console.error("Error clearing AsyncStorage:", error);
      }
    };

    // Call this function to clear storage
    // clearStorage();
  }, []);

  const navigateToSubject = (subject: string) => {
    router.push(`/learn?subject=${subject}`);
  };

  const navigateToQuiz = (quizName: string) => {
    router.push(`/quiz?name=${quizName}`);
  };

  // New User Home Screen
  const NewUserHomeScreen = () => (
    <ScrollView className='flex-1 px-4' showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className='flex-row justify-between items-center mt-4 mb-5'>
        <Text className='text-2xl font-semibold text-black'>
          Welcome, {userName}
        </Text>
        <TouchableOpacity className='p-2'>
          <Bell size={24} color='#000' />
        </TouchableOpacity>
      </View>

      {/* Banner */}
      <View className='bg-[#e6e6fa] rounded-xl p-4 mb-6'>
        <Text className='text-sm text-gray-700 leading-5 mb-4 text-center'>
          "Unlock your potential with fun and interactive lessons! Choose a
          subject and start your learning journey today."
        </Text>
        <TouchableOpacity
          className='bg-[#2a4b8d] rounded-lg py-3 items-center'
          onPress={() => router.push("/learn")}
        >
          <Text className='text-white text-base font-semibold'>
            Get started
          </Text>
        </TouchableOpacity>
      </View>

      {/* Topics of the week */}
      <Text className='text-lg font-semibold mb-4 text-black'>
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
      <Text className='text-lg font-semibold mb-4 text-black'>Subjects</Text>
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
        <Text className='text-2xl font-semibold text-black'>
          Welcome, {userName}
        </Text>
        <TouchableOpacity className='p-2'>
          <Bell size={24} color='#000' />
        </TouchableOpacity>
      </View>

      {/* Upcoming Quiz */}
      <View className='bg-[#ffebe6] rounded-xl p-4 mb-6'>
        <Text className='text-sm text-gray-700 mb-1'>Upcoming Quiz:</Text>
        <View className='flex-row justify-between items-center'>
          <Text className='text-xl font-semibold text-black'>
            Algebra Basics
          </Text>
          <TouchableOpacity
            className='bg-[#2a4b8d] rounded-lg px-4 py-2'
            onPress={() => navigateToQuiz("algebra-basics")}
          >
            <Text className='text-white text-sm font-medium'>Take Quiz</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Continue Learning */}
      <Text className='text-lg font-semibold mb-4 text-black'>
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
      <Text className='text-lg font-semibold mb-4 text-black'>
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
      <Text className='text-lg font-semibold mb-4 text-black'>Subjects</Text>
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
