// constants/quizData.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { topicDetails } from "./topicDetails";

// Define quiz data structure
export interface QuizQuestion {
  id: number;
  questionText: string;
  options: string[];
  correctAnswer: string;
  points: number;
}

export interface Quiz {
  id: number;
  title: string;
  instruction: string;
  passingScore: number;
  maxScore: number;
  xpReward: number;
  subject?: string; // Added for UI display
  topic?: string; // Added for UI display
  duration?: string; // Added for UI display
  requiredLessons: { subject: string; topicId: string; totalLessons: number };
  questions: QuizQuestion[];
}

// Quiz data
export const quizzes: Quiz[] = [
  {
    id: 1,
    title: "Statistics Fundamentals Quiz",
    instruction:
      "Answer the following questions based on the concepts covered in the Statistics course.",
    passingScore: 70,
    maxScore: 100,
    xpReward: 50,
    subject: "Mathematics", // For UI display
    topic: "Statistics", // For UI display
    duration: "30 minutes", // For UI display
    requiredLessons: { subject: "mathematics", topicId: "1", totalLessons: 3 },
    questions: [
      {
        id: 1,
        questionText:
          "What is the mean of the following data set: 5, 10, 15, 20, 25?",
        options: ["10", "15", "20", "25"],
        correctAnswer: "15",
        points: 25,
      },
      {
        id: 2,
        questionText:
          "Which measure of central tendency is most affected by extreme values?",
        options: ["Mean", "Median", "Mode", "Range"],
        correctAnswer: "Mean",
        points: 25,
      },
      {
        id: 3,
        questionText:
          "What is the median of the following data set: 3, 8, 2, 10, 7?",
        options: ["2", "3", "7", "8"],
        correctAnswer: "7",
        points: 25,
      },
      {
        id: 4,
        questionText: "Which of the following is NOT a measure of dispersion?",
        options: ["Range", "Variance", "Standard Deviation", "Median"],
        correctAnswer: "Median",
        points: 25,
      },
    ],
  },
  {
    id: 2,
    title: "Probability Quiz",
    instruction:
      "Answer the following questions based on the concepts covered in the Probability course.",
    passingScore: 60,
    maxScore: 100,
    xpReward: 40,
    subject: "Mathematics",
    topic: "Probability",
    duration: "30 minutes",
    requiredLessons: { subject: "mathematics", topicId: "2", totalLessons: 3 },
    questions: [
      {
        id: 1,
        questionText:
          "What is the probability of getting a head when flipping a fair coin?",
        options: ["0", "1/4", "1/2", "1"],
        correctAnswer: "1/2",
        points: 20,
      },
      {
        id: 2,
        questionText:
          "A bag contains 4 red balls and 6 blue balls. What is the probability of randomly drawing a red ball?",
        options: ["2/5", "3/5", "4/10", "6/10"],
        correctAnswer: "2/5",
        points: 20,
      },
      {
        id: 3,
        questionText:
          "What is the probability of rolling a 3 on a fair six-sided die?",
        options: ["1/6", "1/3", "1/2", "2/3"],
        correctAnswer: "1/6",
        points: 20,
      },
      {
        id: 4,
        questionText:
          "If two dice are rolled, what is the probability of getting a sum of 7?",
        options: ["1/6", "1/12", "1/36", "1/2"],
        correctAnswer: "1/6",
        points: 20,
      },
      {
        id: 5,
        questionText:
          "A box contains 3 red, 5 green, and 2 blue marbles. If one marble is drawn at random, what is the probability that it is green?",
        options: ["1/5", "1/2", "3/10", "5/10"],
        correctAnswer: "1/2",
        points: 20,
      },
    ],
  },
  {
    id: 3,
    title: "Proper Nouns Quiz",
    instruction:
      "Answer the following questions about proper nouns and their usage.",
    passingScore: 80,
    maxScore: 100,
    xpReward: 45,
    subject: "English", // For UI display
    topic: "Proper Nouns", // For UI display
    duration: "20 minutes", // For UI display
    requiredLessons: { subject: "english", topicId: "1", totalLessons: 2 },
    questions: [
      {
        id: 1,
        questionText: "Which of the following is a proper noun?",
        options: ["city", "Paris", "building", "river"],
        correctAnswer: "Paris",
        points: 25,
      },
      {
        id: 2,
        questionText: "Proper nouns should always be:",
        options: ["Capitalized", "Lowercase", "Italicized", "Underlined"],
        correctAnswer: "Capitalized",
        points: 25,
      },
      {
        id: 3,
        questionText: "Which of the following is NOT a proper noun?",
        options: ["Monday", "January", "Summer", "season"],
        correctAnswer: "season",
        points: 25,
      },
      {
        id: 4,
        questionText:
          "In the phrase 'the Pacific Ocean', which word is NOT a proper noun?",
        options: ["the", "Pacific", "Ocean", "Both 'the' and 'Ocean'"],
        correctAnswer: "the",
        points: 25,
      },
    ],
  },
];

// Helper function to find a quiz by ID
export function findQuiz(quizId: string | number): Quiz | undefined {
  const id = typeof quizId === "string" ? parseInt(quizId, 10) : quizId;
  return quizzes.find((quiz) => quiz.id === id);
}

// Helper function to get questions for a quiz
export function getQuizQuestions(quizId: string | number): QuizQuestion[] {
  const quiz = findQuiz(quizId);
  return quiz?.questions || [];
}

// Helper function to calculate total points in a quiz
export function calculateTotalPoints(quizId: string | number): number {
  const questions = getQuizQuestions(quizId);
  return questions.reduce((total, question) => total + question.points, 0);
}

// Helper function to check if a quiz is unlocked
export async function isQuizUnlocked(
  quizId: string | number
): Promise<boolean> {
  try {
    const quiz = findQuiz(quizId);
    if (!quiz) return false;

    const { subject, topicId, totalLessons } = quiz.requiredLessons;
    const key = `completed-${subject}-${topicId}`;

    const completedLessons = await AsyncStorage.getItem(key);
    if (completedLessons) {
      const completed = JSON.parse(completedLessons);
      return completed.length >= totalLessons;
    }

    return false;
  } catch (error) {
    console.error("Error checking if quiz is unlocked:", error);
    return false;
  }
}
