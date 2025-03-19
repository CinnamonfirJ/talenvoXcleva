// app/quiz/[quizId].tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ChevronLeft, Clock } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { findQuiz, calculateTotalPoints } from "@/constants/quizData"; // Import from shared location
import { addXP, completeLesson } from "@/utils/progressTracker";

export default function QuizDetail() {
  const router = useRouter();
  const { quizId } = useLocalSearchParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const quizIdNum = Number(quizId);
  const quiz = findQuiz(quizIdNum);
  const questions = quiz?.questions || [];

  const currentXP = 0;

  // Timer effect
  useEffect(() => {
    if (quizCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          submitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizCompleted]);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Select an answer
  const selectAnswer = (questionId: number, answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  // Navigate to next question
  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  // Navigate to previous question
  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  // Submit quiz
  const submitQuiz = async () => {
    if (!quiz) return;

    // Calculate score
    let totalPoints = 0;
    questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        totalPoints += question.points;
      }
    });

    const maxPossiblePoints = calculateTotalPoints(quizIdNum);
    const percentage = Math.round((totalPoints / maxPossiblePoints) * 100);
    setScore(percentage);
    setQuizCompleted(true);

    // Save quiz progress
    try {
      const quizProgress =
        (await AsyncStorage.getItem("quiz-progress")) || "{}";
      const progress = JSON.parse(quizProgress);
      progress[quizIdNum.toString()] = `${percentage}%`;
      await AsyncStorage.setItem("quiz-progress", JSON.stringify(progress));

      // Award XP if passed
      if (percentage >= quiz.passingScore) {
        const currentXP = (await AsyncStorage.getItem("user-xp")) || "0";
        const newXP = parseInt(currentXP, 10) + quiz.xpReward;
        await AsyncStorage.setItem("user-xp", newXP.toString());
      }
    } catch (error) {
      console.error("Error saving quiz progress:", error);
    }
  };

  async function onLessonComplete(
    subject: string, // Ensure subject is always a string
    timeSpentMinutes: number
  ) {
    const xpString = await AsyncStorage.getItem("user-xp"); // Get stored XP
    const currentXP = xpString !== null ? Number(xpString) : 0; // Convert to number
    await completeLesson(subject, timeSpentMinutes);
    await addXP(currentXP);
  }

  // Ensure subject is always a string
  onLessonComplete(quiz?.title ?? "Unknown Subject", 30);

  // If quiz not found
  if (!quiz) {
    return (
      <SafeAreaView className='flex-1 bg-[#f5f7fa] items-center justify-center'>
        <Text>Quiz not found</Text>
        <TouchableOpacity
          className='mt-4 p-3 bg-[#2a4b8d] rounded-lg'
          onPress={() => router.back()}
        >
          <Text className='text-white'>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Current question
  const question = questions[currentQuestion];

  return (
    <SafeAreaView className='flex-1 bg-[#f5f7fa]'>
      <StatusBar barStyle='dark-content' backgroundColor='#f5f7fa' />

      {!quizCompleted ? (
        // Quiz in progress
        <View className='flex-1 px-4'>
          {/* Header */}
          <View className='flex-row justify-between items-center py-4'>
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft size={24} color='#000' />
            </TouchableOpacity>
            <Text className='text-lg font-semibold'>{quiz.title}</Text>
            <View className='flex-row items-center'>
              <Clock size={18} color='#ffa000' />
              <Text className='text-[#ffa000] ml-1'>
                {formatTime(timeLeft)}
              </Text>
            </View>
          </View>

          {/* Instructions (only on first question) */}
          {currentQuestion === 0 && (
            <View className='bg-blue-50 p-4 rounded-lg mb-4'>
              <Text className='text-gray-700'>{quiz.instruction}</Text>
            </View>
          )}

          {/* Progress */}
          <View className='mb-6'>
            <View className='h-2 w-full bg-gray-200 rounded-full'>
              <View
                className='h-full bg-[#2a4b8d] rounded-full'
                style={{
                  width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                }}
              />
            </View>
            <Text className='text-right text-gray-600 mt-1'>
              Question {currentQuestion + 1} of {questions.length}
            </Text>
          </View>

          {/* Question */}
          {question && (
            <View className='flex-1'>
              <Text className='text-lg font-medium mb-6'>
                {question.questionText}
              </Text>

              {/* Options */}
              <View className='mb-6'>
                {question.options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    className={`border rounded-lg p-4 mb-3 ${
                      selectedAnswers[question.id] === option
                        ? "bg-[#2a4b8d] border-[#2a4b8d]"
                        : "border-gray-300"
                    }`}
                    onPress={() => selectAnswer(question.id, option)}
                  >
                    <Text
                      className={`${
                        selectedAnswers[question.id] === option
                          ? "text-white"
                          : "text-gray-700"
                      }`}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Points indicator */}
              <Text className='text-gray-500 mb-4'>
                Points: {question.points}
              </Text>

              {/* Navigation Buttons */}
              <View className='flex-row justify-between mb-6'>
                <TouchableOpacity
                  className='bg-gray-200 rounded-lg py-3 px-6'
                  onPress={prevQuestion}
                  disabled={currentQuestion === 0}
                  style={{ opacity: currentQuestion === 0 ? 0.5 : 1 }}
                >
                  <Text className='text-gray-700'>Previous</Text>
                </TouchableOpacity>

                {currentQuestion < questions.length - 1 ? (
                  <TouchableOpacity
                    className='bg-[#2a4b8d] rounded-lg py-3 px-6'
                    onPress={nextQuestion}
                  >
                    <Text className='text-white'>Next</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    className='bg-green-600 rounded-lg py-3 px-6'
                    onPress={submitQuiz}
                  >
                    <Text className='text-white'>Submit</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </View>
      ) : (
        // Quiz completed - show results
        <ScrollView className='flex-1 px-4'>
          <View className='items-center justify-center py-10'>
            <Text className='text-2xl font-bold mb-4'>Quiz Completed!</Text>
            <Text className='text-6xl font-bold text-[#2a4b8d] mb-6'>
              {score}%
            </Text>

            {score >= quiz.passingScore ? (
              <View className='bg-green-100 p-4 rounded-lg mb-6 w-full'>
                <Text className='text-green-800 text-center font-medium'>
                  Congratulations! You passed the quiz and earned{" "}
                  {quiz.xpReward} XP.
                </Text>
              </View>
            ) : (
              <View className='bg-red-100 p-4 rounded-lg mb-6 w-full'>
                <Text className='text-red-800 text-center font-medium'>
                  You didn't reach the passing score of {quiz.passingScore}%.
                  Try again!
                </Text>
              </View>
            )}

            <Text className='text-lg text-center mb-8'>
              You scored {score} out of {quiz.maxScore} points.
            </Text>

            <TouchableOpacity
              className='bg-[#2a4b8d] rounded-lg py-4 px-8 mb-4 w-full'
              onPress={() => router.push("/quiz")}
            >
              <Text className='text-white text-center font-semibold'>
                Back to Quizzes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className='border border-[#2a4b8d] rounded-lg py-4 px-8 w-full'
              onPress={() => {
                setCurrentQuestion(0);
                setSelectedAnswers({});
                setTimeLeft(1800);
                setQuizCompleted(false);
              }}
            >
              <Text className='text-[#2a4b8d] text-center font-semibold'>
                Retake Quiz
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
