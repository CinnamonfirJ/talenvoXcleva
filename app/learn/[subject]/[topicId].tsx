// app/learn/[subject]/[topicId].tsx
import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import {
  ChevronLeft,
  Download,
  GraduationCap,
  Circle,
  Check,
} from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { images } from "@/constants/images";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { topicDetails } from "@/constants/topicDetails";

// Mock data for topic details
// const topicDetails = {
//   "mathematics-1": {
//     id: 1,
//     title: "Statistics",
//     subject: "Mathematics",
//     level: "Senior Secondary",
//     duration: "4 Hours",
//     image:
//       "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Topic%20Information%20-%201-Sguio6Kuf44ickgzAuQKUtMW4Bn6Nj.png",
//     description:
//       "Statistics is the branch of mathematics that deals with the collection, organization, analysis, interpretation, and presentation of numerical data. It helps in understanding patterns, making predictions, and making informed decisions based on data.",
//     outline: [
//       {
//         id: 1,
//         title: "Meaning and Importance of Statistics",
//         content:
//           "Statistics is a branch of mathematics that deals with the collection, organization, analysis, interpretation, and presentation of numerical data. It helps in understanding patterns, making predictions, and making informed decisions based on data.\n\nStatistics is essential in various fields such as business, science, health, and economics. It helps in decision-making, identifying trends, conducting research, and solving real-world problems through data analysis. By organizing and interpreting numerical information, statistics enable professionals to make accurate predictions, optimize processes, and evaluate outcomes effectively. In addition, it provides tools for data visualization and communication of findings.",
//         image:
//           "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Topic%20Ccntent%20-%201-SvkoVBMOsewciOujpxDKY9obckW9jZ.png",
//       },
//       {
//         id: 2,
//         title: "Data Presentation",
//         content:
//           "Data presentation is a crucial aspect of statistics that involves organizing and displaying data in a clear and meaningful way. Effective data presentation helps in understanding patterns, trends, and relationships within the data.\n\nCommon methods of data presentation include tables, charts, graphs, and diagrams. Each method has its advantages and is suitable for different types of data and purposes. Tables are useful for presenting exact values, while graphs and charts provide visual representations that make it easier to identify patterns and trends.",
//         image: images.math,
//       },
//       {
//         id: 3,
//         title: "Measures of Central Tendency",
//         content:
//           "Measures of central tendency are values that represent the center or middle of a data set. They provide a single value that summarizes the entire data set and are essential for statistical analysis.\n\nThe three main measures of central tendency are the mean, median, and mode. The mean is the average of all values in a data set, calculated by summing all values and dividing by the number of values. The median is the middle value when the data is arranged in order. The mode is the value that appears most frequently in the data set.",
//         image: images.math,
//       },
//     ],
//   },
//   // Add more topics as needed
// };

export default function TopicDetail() {
  const router = useRouter();
  const { subject, topicId } = useLocalSearchParams();
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [currentLesson, setCurrentLesson] = useState<number | null>(null);

  // Create a key to look up topic details
  const topicKey = `${subject}-${topicId}`;

  // Get topic details
  const topic = topicDetails[topicKey];

  // Load completed lessons from storage
  React.useEffect(() => {
    const loadCompletedLessons = async () => {
      try {
        const storedLessons = await AsyncStorage.getItem(
          `completed-${topicKey}`
        );
        if (storedLessons) {
          setCompletedLessons(JSON.parse(storedLessons));
        }

        const storedCurrentLesson = await AsyncStorage.getItem(
          `current-${topicKey}`
        );
        if (storedCurrentLesson) {
          setCurrentLesson(JSON.parse(storedCurrentLesson));
        }
      } catch (error) {
        console.error("Error loading lesson progress:", error);
      }
    };

    loadCompletedLessons();
  }, [topicKey]);

  // Check if a lesson is accessible
  const isLessonAccessible = (lessonId: number) => {
    // First lesson is always accessible
    if (lessonId === 1) return true;

    // Previous lesson must be completed
    return completedLessons.includes(lessonId - 1);
  };

  // Check if a lesson is completed
  const isLessonCompleted = (lessonId: number) => {
    return completedLessons.includes(lessonId);
  };

  // Start or continue learning
  const startLearning = () => {
    // If there are completed lessons, go to the next uncompleted lesson
    if (completedLessons.length > 0) {
      const nextLessonId = completedLessons.length + 1;
      if (nextLessonId <= topic.outline.length) {
        navigateToLesson(nextLessonId);
      } else {
        // All lessons completed, go to the first one
        navigateToLesson(1);
      }
    } else {
      // No completed lessons, start with the first one
      navigateToLesson(1);
    }
  };

  // Navigate to a specific lesson
  const navigateToLesson = (lessonId: number) => {
    router.push(`/learn/${subject}/${topicId}/lesson/${lessonId}`);
  };

  // Handle case where topic is not found
  if (!topic) {
    return (
      <SafeAreaView className='flex-1 justify-center items-center bg-[#f5f7fa]'>
        <Text>Topic not found</Text>
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

      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        {/* Header with back button */}
        <View className='top-4 left-4 z-10 absolute'>
          <TouchableOpacity
            className='bg-white/80 p-2 rounded-full'
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color='#000' />
          </TouchableOpacity>
        </View>

        {/* Banner Image */}
        <Image
          source={
            topic.image && typeof topic.image === "string"
              ? { uri: topic.image }
              : images.adaptiveIcon
          }
          className='rounded-xl w-full h-[180px]'
          resizeMode='cover'
        />

        {/* Content */}
        <View className='px-4 pt-3'>
          {/* Title and Subject */}
          <Text className='font-semibold text-black text-xl'>
            {topic.title}
          </Text>
          <Text className='mb-4 text-gray-700 text-base'>{topic.subject}</Text>

          {/* Tags and Download Button */}
          <View className='flex-row justify-between items-center mb-6'>
            <View className='flex-row'>
              <View className='bg-[#e6e6fa] mr-2 px-4 py-1 rounded-full'>
                <Text className='text-[#2a4b8d] text-sm'>{topic.level}</Text>
              </View>
              <View className='bg-[#fff8e1] px-4 py-1 rounded-full'>
                <Text className='text-[#ffa000] text-sm'>{topic.duration}</Text>
              </View>
            </View>
            <TouchableOpacity className='bg-[#2a4b8d] p-2 rounded-full'>
              <Download size={20} color='#fff' />
            </TouchableOpacity>
          </View>

          {/* Description */}
          <Text className='mb-2 font-semibold text-black text-lg'>
            Description
          </Text>
          <Text className='mb-6 text-gray-700 leading-5'>
            {topic.description}
          </Text>

          {/* Topic Outline */}
          <Text className='mb-4 font-semibold text-black text-lg'>
            Topic Outline
          </Text>

          {topic.outline.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              className={`flex-row items-center mb-4 ${
                !isLessonAccessible(item.id) ? "opacity-50" : ""
              }`}
              onPress={() =>
                isLessonAccessible(item.id) ? navigateToLesson(item.id) : null
              }
              disabled={!isLessonAccessible(item.id)}
            >
              <View className='bg-[#2a4b8d]/10 mr-3 p-2 rounded-full'>
                <GraduationCap size={20} color='#2a4b8d' />
              </View>
              <Text className='flex-1 text-gray-700'>{item.title}</Text>
              {isLessonCompleted(item.id) ? (
                <View className='bg-green-100 p-1 rounded-full'>
                  <Check size={18} color='green' />
                </View>
              ) : (
                <Circle size={20} color='#e0e0e0' />
              )}
            </TouchableOpacity>
          ))}

          {/* Start Learning Button */}
          <TouchableOpacity
            className='items-center bg-[#2a4b8d] mt-6 mb-10 py-4 rounded-lg'
            onPress={startLearning}
          >
            <Text className='font-semibold text-white text-base'>
              {completedLessons.length > 0
                ? "Continue learning"
                : "Start learning"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
