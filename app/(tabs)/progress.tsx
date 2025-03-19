// app/progress/index.tsx (updated)
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Flame,
  Clock,
  Trophy,
  Star,
  BookOpen,
  GraduationCap,
  Rocket,
  Brain,
} from "lucide-react-native";
import {
  loadUserStats,
  updateStreak,
  getUnlockedMilestones,
  getUnlockedAchievements,
  UserStats,
} from "@/utils/progressTracker";

// Achievement Card Component
const AchievementCard = ({
  icon,
  title,
  description,
  bgColor,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
}) => {
  return (
    <View className={`${bgColor} rounded-xl p-4 shadow-sm w-[48%] mb-4`}>
      <View className='items-center mb-1'>{icon}</View>
      <Text className='text-center font-bold text-gray-800 mb-1'>{title}</Text>
      <Text className='text-center text-xs text-gray-50'>{description}</Text>
    </View>
  );
};

// Milestone Item Component
const MilestoneItem = ({
  icon,
  title,
  isUnlocked,
}: {
  icon: React.ReactNode;
  title: string;
  isUnlocked: boolean;
}) => {
  return (
    <View
      className={`flex-row items-center mb-3 ${isUnlocked ? "" : "opacity-40"}`}
    >
      <View className='mr-2'>{icon}</View>
      <Text className={`text-gray-800 ${isUnlocked ? "font-medium" : ""}`}>
        {title}
      </Text>
    </View>
  );
};

export default function ProgressPage() {
  const router = useRouter();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [unlockedMilestones, setUnlockedMilestones] = useState<string[]>([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  // Load user stats and determine unlocked achievements
  useEffect(() => {
    const loadData = async () => {
      try {
        // Update streak on page load
        const stats = await updateStreak();
        setUserStats(stats);

        // Get unlocked milestones and achievements
        const milestones = await getUnlockedMilestones();
        const achievements = await getUnlockedAchievements();

        setUnlockedMilestones(milestones);
        setUnlockedAchievements(achievements);
        setLoading(false);
      } catch (error) {
        console.error("Error loading progress data:", error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Continue learning
  const continueLearning = () => {
    router.push("/learn");
  };

  // Show loading state
  if (loading || !userStats) {
    return (
      <SafeAreaView className='flex-1 bg-[#f5f7fa] items-center justify-center'>
        <Text>Loading your progress...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='flex-1 bg-[#f5f7fa]'>
      <StatusBar barStyle='dark-content' backgroundColor='#f5f7fa' />

      <ScrollView className='flex-1 px-4' showsVerticalScrollIndicator={false}>
        {/* Achievement Cards */}
        <View className='flex-row flex-wrap justify-between mt-6 mb-2'>
          {/* Only show streak card if streak > 0 */}

          <AchievementCard
            icon={<Flame size={24} color='#E25822' />}
            title={`${userStats.streak}-Day Streak!`}
            description={`${
              7 - userStats.streak
            } more days to unlock 500XP weekly points!`}
            bgColor='bg-[#ffcccb]'
          />

          {/* Only show hours card if hours > 0 */}
          {userStats.hoursLearned > 0 && (
            <AchievementCard
              icon={<Clock size={24} color='#2a4b8d' />}
              title={`${Math.round(userStats.hoursLearned)} hours!`}
              description="You're a great learner, Keep it up!"
              bgColor='bg-[#c7d2fe]'
            />
          )}

          {/* Only show XP card if XP > 0 */}
          {userStats.totalXP > 0 && (
            <AchievementCard
              icon={<Trophy size={24} color='#FFD700' />}
              title={`${userStats.totalXP} XP`}
              description='Progress Master! Keep up the learning'
              bgColor='bg-[#2a4b8d]'
            />
          )}

          {/* Only show reader card if isReader is true */}
          {userStats.isReader && (
            <AchievementCard
              icon={<Star size={24} color='#000' />}
              title='Reader'
              description='Your consistency is paying off! Great Job.'
              bgColor='bg-[#ffcccb]'
            />
          )}
        </View>

        {/* Learning Milestones */}
        <Text className='text-xl font-semibold text-black mt-4 mb-3'>
          Learning Milestones
        </Text>
        <View className='mb-6'>
          <MilestoneItem
            icon={<Trophy size={18} color='#FFD700' />}
            title='Beginner Explorer (First Lesson Completed)'
            isUnlocked={unlockedMilestones.includes("beginner-explorer")}
          />
          <MilestoneItem
            icon={<Flame size={18} color='#E25822' />}
            title='Consistency Champ (45-Day Learning Streak)'
            isUnlocked={unlockedMilestones.includes("consistency-champ")}
          />
          <MilestoneItem
            icon={<BookOpen size={18} color='#2a4b8d' />}
            title='Subject Specialist (Completed 5 Lessons in One Subject)'
            isUnlocked={unlockedMilestones.includes("subject-specialist")}
          />
        </View>

        {/* Achievements */}
        <Text className='text-xl font-semibold text-black mb-3'>
          Achievements
        </Text>
        <View className='mb-6'>
          <MilestoneItem
            icon={<Brain size={18} color='#2a4b8d' />}
            title='Knowledge Seeker (Completed 10 Lessons)'
            isUnlocked={unlockedAchievements.includes("knowledge-seeker")}
          />
          <MilestoneItem
            icon={<GraduationCap size={18} color='#000' />}
            title='Certified Scholar (Earned 3 Certificates)'
            isUnlocked={unlockedAchievements.includes("certified-scholar")}
          />
          <MilestoneItem
            icon={<Rocket size={18} color='#E25822' />}
            title='Lifelong Learner (Completed 3 Full Subjects)'
            isUnlocked={unlockedAchievements.includes("lifelong-learner")}
          />
        </View>

        {/* Continue Learning Button */}
        <TouchableOpacity
          className='bg-[#2a4b8d] rounded-lg py-4 items-center mb-10'
          onPress={continueLearning}
        >
          <Text className='text-white text-base font-semibold'>
            Continue learning
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
