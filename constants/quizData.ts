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
    title: "Angles and Geometry Quiz",
    instruction:
      "Answer the following questions based on the concepts covered in the Angles course.",
    passingScore: 60,
    maxScore: 100,
    xpReward: 40,
    subject: "Mathematics", // For UI display
    topic: "Angles", // For UI display
    duration: "30 minutes", // For UI display
    requiredLessons: { subject: "mathematics", topicId: "2", totalLessons: 3 },
    questions: [
      {
        id: 1,
        questionText: "What is the sum of angles in a triangle?",
        options: ["90°", "180°", "270°", "360°"],
        correctAnswer: "180°",
        points: 20,
      },
      {
        id: 2,
        questionText:
          "What is the measure of each angle in an equilateral triangle?",
        options: ["30°", "45°", "60°", "90°"],
        correctAnswer: "60°",
        points: 20,
      },
      {
        id: 3,
        questionText: "What is the sum of interior angles in a quadrilateral?",
        options: ["180°", "270°", "360°", "540°"],
        correctAnswer: "360°",
        points: 20,
      },
      {
        id: 4,
        questionText: "Two angles that sum to 90° are called:",
        options: [
          "Complementary angles",
          "Supplementary angles",
          "Vertical angles",
          "Adjacent angles",
        ],
        correctAnswer: "Complementary angles",
        points: 20,
      },
      {
        id: 5,
        questionText:
          "What is the measure of each angle in a regular pentagon?",
        options: ["60°", "72°", "108°", "120°"],
        correctAnswer: "108°",
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
