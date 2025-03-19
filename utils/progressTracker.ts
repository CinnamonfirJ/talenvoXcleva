// utils/progressTracker.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

// User stats interface
export interface UserStats {
  streak: number;
  hoursLearned: number;
  totalXP: number;
  lessonsCompleted: number;
  certificatesEarned: number;
  subjectsCompleted: number;
  longestStreak: number;
  maxLessonsInOneSubject: number;
  isReader: boolean;
  lastLoginDate: string;
  subjectLessons: Record<string, number>; // Tracks lessons completed per subject
}

// Default stats for new users
const defaultStats: UserStats = {
  streak: 0,
  hoursLearned: 0,
  totalXP: 0,
  lessonsCompleted: 0,
  certificatesEarned: 0,
  subjectsCompleted: 0,
  longestStreak: 0,
  maxLessonsInOneSubject: 0,
  isReader: false,
  lastLoginDate: new Date().toISOString().split("T")[0], // Today's date in YYYY-MM-DD
  subjectLessons: {},
};

// Load user stats
export async function loadUserStats(): Promise<UserStats> {
  try {
    const statsJson = await AsyncStorage.getItem("user-stats");
    if (statsJson) {
      return JSON.parse(statsJson);
    }
    return defaultStats;
  } catch (error) {
    console.error("Error loading user stats:", error);
    return defaultStats;
  }
}

// Save user stats
export async function saveUserStats(stats: UserStats): Promise<void> {
  try {
    await AsyncStorage.setItem("user-stats", JSON.stringify(stats));
  } catch (error) {
    console.error("Error saving user stats:", error);
  }
}

// Update streak
export async function updateStreak(): Promise<UserStats> {
  const stats = await loadUserStats();
  const today = new Date().toISOString().split("T")[0];

  // If last login was yesterday, increment streak
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  if (stats.lastLoginDate === yesterdayStr) {
    stats.streak += 1;
    // Update longest streak if current streak is longer
    if (stats.streak > stats.longestStreak) {
      stats.longestStreak = stats.streak;
    }
  } else if (stats.lastLoginDate !== today) {
    // If last login was not yesterday and not today, reset streak
    stats.streak = 1;
  }

  stats.lastLoginDate = today;
  await saveUserStats(stats);
  return stats;
}

// Add XP
export async function addXP(amount: number): Promise<UserStats> {
  const stats = await loadUserStats();
  stats.totalXP += amount;
  await saveUserStats(stats);
  return stats;
}

// Complete a lesson
export async function completeLesson(
  subject: string,
  timeSpentMinutes: number
): Promise<UserStats> {
  const stats = await loadUserStats();

  // Update lessons completed
  stats.lessonsCompleted += 1;

  // Update hours learned
  stats.hoursLearned += timeSpentMinutes / 60;

  // Update subject lessons
  if (!stats.subjectLessons[subject]) {
    stats.subjectLessons[subject] = 0;
  }
  stats.subjectLessons[subject] += 1;

  // Update max lessons in one subject
  if (stats.subjectLessons[subject] > stats.maxLessonsInOneSubject) {
    stats.maxLessonsInOneSubject = stats.subjectLessons[subject];
  }

  // Check if subject is completed (assuming 10 lessons completes a subject)
  if (stats.subjectLessons[subject] === 10) {
    stats.subjectsCompleted += 1;
  }

  // Set reader status if they've completed at least 5 lessons
  if (stats.lessonsCompleted >= 5) {
    stats.isReader = true;
  }

  await saveUserStats(stats);
  return stats;
}

// Earn a certificate
export async function earnCertificate(): Promise<UserStats> {
  const stats = await loadUserStats();
  stats.certificatesEarned += 1;
  await saveUserStats(stats);
  return stats;
}

// Get unlocked milestones
export async function getUnlockedMilestones(): Promise<string[]> {
  const stats = await loadUserStats();

  const milestones = [];
  if (stats.lessonsCompleted >= 1) milestones.push("beginner-explorer");
  if (stats.longestStreak >= 45) milestones.push("consistency-champ");
  if (stats.maxLessonsInOneSubject >= 5) milestones.push("subject-specialist");

  return milestones;
}

// Get unlocked achievements
export async function getUnlockedAchievements(): Promise<string[]> {
  const stats = await loadUserStats();

  const achievements = [];
  if (stats.lessonsCompleted >= 10) achievements.push("knowledge-seeker");
  if (stats.certificatesEarned >= 3) achievements.push("certified-scholar");
  if (stats.subjectsCompleted >= 3) achievements.push("lifelong-learner");

  return achievements;
}
