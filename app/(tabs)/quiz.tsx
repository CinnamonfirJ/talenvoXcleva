// app/quiz/index.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Clock } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { quizzes } from "@/constants/quizData";
// import { BarChart } from "react-native-chart-kit";

// Quiz Card Component
const QuizCard = ({
  quiz,
  isUnlocked,
  lastAttempt,
  onPress,
}: {
  quiz: any;
  isUnlocked: boolean;
  lastAttempt: string | null;
  onPress: () => void;
}) => {
  return (
    <View
      className={`bg-white rounded-xl p-5 shadow-sm w-[48%] mb-4 ${
        !isUnlocked ? "opacity-50" : ""
      }`}
    >
      <Text className='text-lg font-semibold text-black'>{quiz.subject}</Text>
      <Text className='text-base text-gray-700 mb-3'>{quiz.topic}</Text>

      <View className='flex-row items-center mb-4'>
        <Clock size={18} color='#ffa000' />
        <Text className='text-[#ffa000] ml-2'>{quiz.duration}</Text>
      </View>

      <Text className='text-gray-600 mb-4'>
        Last attempt: {lastAttempt || "Nil"}
      </Text>

      <TouchableOpacity
        className={`py-3 rounded-lg items-center ${
          lastAttempt ? "border border-[#2a4b8d]" : "bg-[#2a4b8d]"
        }`}
        onPress={onPress}
        disabled={!isUnlocked}
      >
        <Text
          className={`text-base font-medium ${
            lastAttempt ? "text-[#2a4b8d]" : "text-white"
          }`}
        >
          Take Quiz
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Stat Card Component
const StatCard = ({
  value,
  label,
  bgColor,
  textColor,
}: {
  value: string | number;
  label: string;
  bgColor: string;
  textColor: string;
}) => {
  return (
    <View className={`${bgColor} rounded-xl p-5 shadow-sm w-[48%]`}>
      <Text className={`text-4xl font-bold text-center ${textColor} mb-2`}>
        {value}
      </Text>
      <Text className={`text-center ${textColor}`}>{label}</Text>
    </View>
  );
};

// Mock data for the chart
// In a real app, this would come from your quiz history
const chartData = {
  labels: ["Math", "English", "Biology", "Chemistry", "Economics"],
  datasets: [
    {
      data: [90, 95, 95, 90, 90],
      color: (opacity = 1) => `rgba(100, 149, 237, ${opacity})`, // Blue
      label: "1st",
    },
    {
      data: [95, 88, 80, 75, 96],
      color: (opacity = 1) => `rgba(255, 99, 71, ${opacity})`, // Red
      label: "2nd",
    },
  ],
};

export default function QuizPage() {
  const router = useRouter();
  const [quizProgress, setQuizProgress] = useState<Record<string, string>>({});
  const [unlockedQuizzes, setUnlockedQuizzes] = useState<number[]>([]);
  const [quizStats, setQuizStats] = useState({
    attempted: 0,
    passRate: 0,
  });

  const screenWidth = Dimensions.get("window").width - 32; // Full width minus padding

  // Load quiz progress and check which quizzes are unlocked
  useEffect(() => {
    const loadQuizData = async () => {
      try {
        // Load quiz progress (last attempts)
        const storedProgress = await AsyncStorage.getItem("quiz-progress");
        if (storedProgress) {
          const progress = JSON.parse(storedProgress);
          setQuizProgress(progress);

          // Calculate stats
          const attemptedQuizzes = Object.keys(progress).length;

          // Calculate pass rate (assuming passing score is stored with %)
          let passedQuizzes = 0;
          Object.values(progress).forEach((score: any) => {
            const scoreNum = parseInt(score.replace("%", ""), 10);
            if (scoreNum >= 70) {
              // Assuming 70% is passing
              passedQuizzes++;
            }
          });

          const passRate =
            attemptedQuizzes > 0
              ? Math.round((passedQuizzes / attemptedQuizzes) * 100)
              : 0;

          setQuizStats({
            attempted: attemptedQuizzes,
            passRate: passRate,
          });
        }

        // Check which quizzes are unlocked based on completed lessons
        const unlocked: number[] = [];

        for (const quiz of quizzes) {
          const { subject, topicId, totalLessons } = quiz.requiredLessons;
          const key = `completed-${subject}-${topicId}`;

          const completedLessons = await AsyncStorage.getItem(key);
          if (completedLessons) {
            const completed = JSON.parse(completedLessons);
            // Quiz is unlocked if all required lessons are completed
            if (completed.length >= totalLessons) {
              unlocked.push(quiz.id);
            }
          }
        }

        setUnlockedQuizzes(unlocked);
      } catch (error) {
        console.error("Error loading quiz data:", error);
      }
    };

    loadQuizData();
  }, []);

  // Navigate to a specific quiz
  const navigateToQuiz = (quizId: number) => {
    router.push(`/quiz/${quizId}`);
  };

  // Chart configuration
  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
    },
    barPercentage: 0.6,
  };

  return (
    <SafeAreaView className='flex-1 bg-[#f5f7fa]'>
      <StatusBar barStyle='dark-content' backgroundColor='#f5f7fa' />

      <ScrollView className='flex-1 px-4' showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <View className='flex-row justify-between mt-6 mb-6'>
          <StatCard
            value={quizStats.attempted}
            label='Quizzes attempted'
            bgColor='bg-[#2a4b8d]'
            textColor='text-[#ffffff]'
          />
          <StatCard
            value={`${quizStats.passRate}%`}
            label='Pass rate'
            bgColor='bg-[#c7d2fe]'
            textColor='text-[#2a4b8d]'
          />
        </View>

        {/* Quiz Progress Tracker */}
        <Text className='text-xl font-semibold text-black mb-4'>
          Quiz Progress Tracker
        </Text>
        <View className='bg-white rounded-xl p-4 shadow-sm mb-6'>
          {/* <BarChart
            data={chartData}
            width={screenWidth - 16} // Account for padding inside the card
            height={220}
            chartConfig={chartConfig}
            verticalLabelRotation={0}
            showValuesOnTopOfBars={true}
            withInnerLines={true}
            fromZero={true}
            segments={5}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
            yAxisLabel=''
            yAxisSuffix='%'
          /> */}
          <View className='flex-row justify-center mt-2'>
            <View className='flex-row items-center mr-4'>
              <View className='w-3 h-3 rounded-full bg-[#6495ED] mr-1' />
              <Text className='text-xs text-gray-600'>1st</Text>
            </View>
            <View className='flex-row items-center'>
              <View className='w-3 h-3 rounded-full bg-[#FF6347] mr-1' />
              <Text className='text-xs text-gray-600'>2nd</Text>
            </View>
          </View>
        </View>

        {/* Upcoming Quizzes */}
        <Text className='text-xl font-semibold text-black mb-4'>
          Upcoming Quizzes
        </Text>
        <View className='flex-row flex-wrap justify-between'>
          {quizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              isUnlocked={unlockedQuizzes.includes(quiz.id)}
              lastAttempt={quizProgress[quiz.id.toString()] || null}
              onPress={() => navigateToQuiz(quiz.id)}
            />
          ))}
        </View>

        {/* Bottom Spacing */}
        <View className='h-20' />
      </ScrollView>
    </SafeAreaView>
  );
}
