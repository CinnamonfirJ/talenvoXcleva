// app/learn/[subject].tsx
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
import { Bell, ChevronLeft } from "lucide-react-native";
import {
  useRouter,
  useLocalSearchParams,
  RelativePathString,
} from "expo-router";
import { images } from "@/constants/images";
import { topicDetails } from "@/constants/topicDetails";

interface TopicCardProps {
  title: string;
  description?: string;
  image: any;
  onPress: () => void;
}

interface Topic {
  id: number;
  title: string;
  description: string;
  image: any;
}

// Reusable components
const TopicCard = ({ title, description, image, onPress }: TopicCardProps) => {
  return (
    <TouchableOpacity
      className='bg-white shadow-sm mb-4 rounded-xl w-[48%] overflow-hidden'
      onPress={onPress}
    >
      <Image source={image} className='w-full h-[150px] object-cover' />
      <View className='p-3'>
        <Text className='font-medium text-black text-base'>{title}</Text>
        {description ? (
          <Text className='mt-1 text-gray-600 text-sm line-clamp-2'>
            {description}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

// Mock data for topics by subject
const topicsBySubject: Record<string, Topic[]> = {
  mathematics: [
    {
      id: 1,
      title: "Statistics",
      description: "Learn about data collection, analysis, and interpretation",
      image: images.math,
    },
    {
      id: 2,
      title: "Probability",
      description: "Understand chance and likelihood in mathematical terms",
      image: images.math,
    },
    {
      id: 3,
      title: "Circle Geometry",
      description: "Explore properties of circles and related theorems",
      image: images.math,
    },
    {
      id: 4,
      title: "Algebra",
      description: "Master equations, expressions, and algebraic structures",
      image: images.math,
    },
    {
      id: 5,
      title: "Calculus",
      description: "Study rates of change and accumulation",
      image: images.math,
    },
    {
      id: 6,
      title: "Trigonometry",
      description:
        "Explore relationships between angles and sides of triangles",
      image: images.math,
    },
  ],
  english: [
    {
      id: 1,
      title: "Proper Nouns",
      description: "Master the rules of language structure",
      image: images.english,
    },
    {
      id: 2,
      title: "Literature",
      description: "Explore classic and contemporary works",
      image: images.english,
    },
    {
      id: 3,
      title: "Writing",
      description: "Develop effective communication skills",
      image: images.english,
    },
    {
      id: 4,
      title: "Comprehension",
      description: "Enhance reading and understanding abilities",
      image: images.english,
    },
  ],
  // Add more subjects as needed
};

export default function SubjectTopics() {
  const router = useRouter();
  const { subject } = useLocalSearchParams();

  // Convert subject to string and lowercase for consistency
  const subjectKey = String(subject).toLowerCase();

  // Get topics for the selected subject
  const topics = topicsBySubject[subjectKey] || [];

  // Format subject name for display (capitalize first letter)
  const formattedSubject =
    subjectKey.charAt(0).toUpperCase() + subjectKey.slice(1);

  const navigateToTopic = (topicId: number) => {
    router.push(`/learn/${subjectKey}/${topicId}` as RelativePathString);
  };

  return (
    <SafeAreaView className='flex-1 bg-[#f5f7fa]'>
      <StatusBar barStyle='dark-content' backgroundColor='#f5f7fa' />

      <ScrollView className='flex-1 px-4' showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className='flex-row justify-between items-center mt-4 mb-5'>
          <View className='flex-row items-center'>
            <TouchableOpacity className='mr-2' onPress={() => router.back()}>
              <ChevronLeft size={24} color='#000' />
            </TouchableOpacity>
            <Text className='font-semibold text-black text-2xl'>
              {formattedSubject}
            </Text>
          </View>
          <TouchableOpacity className='p-2'>
            <Bell size={24} color='#000' />
          </TouchableOpacity>
        </View>

        {/* Topics */}
        <Text className='mb-4 font-semibold text-black text-lg'>Topics</Text>
        <View className='flex-row flex-wrap justify-between'>
          {topics.map((topic) => (
            <TopicCard
              key={topic.id}
              title={topic.title}
              description={topic.description}
              image={topic.image}
              onPress={() => navigateToTopic(topic.id)}
            />
          ))}
        </View>

        {/* If no topics are available */}
        {topics.length === 0 && (
          <View className='justify-center items-center py-10'>
            <Text className='text-gray-500'>
              No topics available for this subject.
            </Text>
          </View>
        )}

        <View className='h-20' />
      </ScrollView>
    </SafeAreaView>
  );
}
