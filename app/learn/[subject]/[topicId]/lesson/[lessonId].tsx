// app/learn/[subject]/[topicId]/lesson/[lessonId].tsx
import React, { useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { ChevronLeft } from "lucide-react-native";
import {
  useRouter,
  useLocalSearchParams,
  RelativePathString,
} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { topicDetails } from "@/constants/topicDetails";
import { images } from "@/constants/images";

export default function LessonContent() {
  const router = useRouter();
  const { subject, topicId, lessonId } = useLocalSearchParams();

  // Convert params to proper format
  const subjectStr = String(subject);
  const topicIdStr = String(topicId);
  const lessonIdNum = Number(lessonId);

  // Create a key to look up topic details
  const topicKey = `${subjectStr}-${topicIdStr}`;

  // Get topic details
  const topic = topicDetails[topicKey];

  // Get lesson details
  const lesson = topic?.outline.find((item) => item.id === lessonIdNum);

  // Mark lesson as current
  useEffect(() => {
    const markAsCurrent = async () => {
      try {
        await AsyncStorage.setItem(
          `current-${topicKey}`,
          JSON.stringify(lessonIdNum)
        );
      } catch (error) {
        console.error("Error saving current lesson:", error);
      }
    };

    if (lesson) {
      markAsCurrent();
    }
  }, [topicKey, lessonIdNum, lesson]);

  // Mark lesson as completed
  const markAsCompleted = async () => {
    try {
      // Get current completed lessons
      const storedLessons = await AsyncStorage.getItem(`completed-${topicKey}`);
      let completedLessons = storedLessons ? JSON.parse(storedLessons) : [];

      // Add current lesson if not already completed
      if (!completedLessons.includes(lessonIdNum)) {
        completedLessons.push(lessonIdNum);
        await AsyncStorage.setItem(
          `completed-${topicKey}`,
          JSON.stringify(completedLessons)
        );
      }

      // Navigate to next lesson or quiz
      if (lessonIdNum < topic.outline.length) {
        router.push(
          `/learn/${subjectStr}/${topicIdStr}/lesson/${
            lessonIdNum + 1
          }` as RelativePathString
        );
      } else {
        // Last lesson, go to quiz
        router.push(`/quiz?subject=${subjectStr}&topic=${topicIdStr}`);
      }
    } catch (error) {
      console.error("Error marking lesson as completed:", error);
    }
  };

  // Handle case where lesson is not found
  if (!lesson || !topic) {
    return (
      <SafeAreaView className='flex-1 justify-center items-center bg-[#f5f7fa]'>
        <Text>Lesson not found</Text>
        <TouchableOpacity
          className='bg-[#2a4b8d] mt-4 p-3 rounded-lg'
          onPress={() => router.back()}
        >
          <Text className='text-white'>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='flex-1 bg-[#f5f7fa]'>
      <StatusBar barStyle='dark-content' backgroundColor='#f5f7fa' />

      <ScrollView className='flex-1 px-4' showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className='pt-4 pb-2'>
          <TouchableOpacity
            className='flex-row items-center'
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color='#000' />
            <Text className='text-gray-700 text-base'>Back</Text>
          </TouchableOpacity>
        </View>

        {/* Lesson Title */}
        <Text className='font-semibold text-black text-xl'>{topic.title}</Text>
        <Text className='mb-4 text-gray-700 text-lg'>{lesson.title}</Text>

        {/* Lesson Content */}
        <Text className='mb-4 text-gray-700 leading-6'>
          {lesson.content.split("\n\n")[0]}
        </Text>

        {/* Lesson Image */}
        <Image
          source={
            lesson.image && typeof lesson.image === "string"
              ? { uri: topic.image }
              : images.adaptiveIcon
          }
          className='mb-4 rounded-lg w-full h-[200px]'
          resizeMode='cover'
        />

        {/* More Content */}
        <Text className='mb-8 text-gray-700 leading-6'>
          {lesson.content.split("\n\n")[1] || ""}
        </Text>

        {/* Next/Quiz Button */}
        <TouchableOpacity
          className='items-center bg-[#2a4b8d] mb-10 py-4 rounded-lg'
          onPress={markAsCompleted}
        >
          <Text className='font-semibold text-white text-base'>
            {lessonIdNum < topic.outline.length ? "Next" : "Take Quiz"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// Help me create this quiz page. In here there is a list of question up to or more than 10 and each question has it's own score point so 10 question will be 100 points on the quiz, And each quiz also has a max exp gain so if the max exp of a quiz is 50 exp and you complete a quiz and score 45% you'll gain 45% of 50 as your exp. When you are done with a quiz you can select submit then a popup will come up and ask if you're sure you want to submit now, if no you can continue but if yes then it submits your answers and goes to a new page to show you your score. Also save the fact that you have done this quiz, and on the quiz select page show last attempt with the score you got and also save the number of quizzess you've attempted along with your pass rate so i can use it in other componets
