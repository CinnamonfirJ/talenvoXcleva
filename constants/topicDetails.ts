// constants/topicData.ts

// Define types for better type safety
export interface LessonOutline {
  id: number;
  title: string;
  content: string;
  image: any; // Can be a string URL or an imported image
}

export interface TopicDetail {
  id: number;
  title: string;
  subject: string;
  level: string;
  duration: string;
  image: any; // Can be a string URL or an imported image
  description: string;
  outline: LessonOutline[];
}

// The main data structure
export const topicDetails: Record<string, TopicDetail> = {
  "mathematics-1": {
    id: 1,
    title: "Statistics",
    subject: "Mathematics",
    level: "Senior Secondary",
    duration: "4 Hours",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Topic%20Information%20-%201-Sguio6Kuf44ickgzAuQKUtMW4Bn6Nj.png", // Banner image URL
    description:
      "Statistics is the branch of mathematics that deals with the collection, organization, analysis, interpretation, and presentation of numerical data. It helps in understanding patterns, making predictions, and making informed decisions based on data.",
    outline: [
      {
        id: 1,
        title: "Meaning and Importance of Statistics",
        content:
          "Statistics is a branch of mathematics that deals with the collection, organization, analysis, interpretation, and presentation of numerical data. It helps in understanding patterns, making predictions, and making informed decisions based on data.\n\nStatistics is essential in various fields such as business, science, health, and economics. It helps in decision-making, identifying trends, conducting research, and solving real-world problems through data analysis. By organizing and interpreting numerical information, statistics enable professionals to make accurate predictions, optimize processes, and evaluate outcomes effectively. In addition, it provides tools for data visualization and communication of findings.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Topic%20Ccntent%20-%201-SvkoVBMOsewciOujpxDKY9obckW9jZ.png", // Lesson content image URL
      },
      {
        id: 2,
        title: "Data Presentation",
        content:
          "Data presentation is a crucial aspect of statistics that involves organizing and displaying data in a clear and meaningful way. Effective data presentation helps in understanding patterns, trends, and relationships within the data.\n\nCommon methods of data presentation include tables, charts, graphs, and diagrams. Each method has its advantages and is suitable for different types of data and purposes. Tables are useful for presenting exact values, while graphs and charts provide visual representations that make it easier to identify patterns and trends.",
        image: require("@/assets/images/Equations.jpg"), // Or use imported image
      },
      {
        id: 3,
        title: "Measures of Central Tendency",
        content:
          "Measures of central tendency are values that represent the center or middle of a data set. They provide a single value that summarizes the entire data set and are essential for statistical analysis.\n\nThe three main measures of central tendency are the mean, median, and mode. The mean is the average of all values in a data set, calculated by summing all values and dividing by the number of values. The median is the middle value when the data is arranged in order. The mode is the value that appears most frequently in the data set.",
        image: require("@/assets/images/circle geometry.jpg"), // Or use imported image
      },
    ],
  },
  "mathematics-2": {
    id: 2,
    title: "Probability",
    subject: "Mathematics",
    level: "Senior Secondary",
    duration: "3 Hours",
    image: require("@/assets/images/probability.jpg"),
    description:
      "Probability is the branch of mathematics that deals with the likelihood of events occurring. It provides a way to quantify uncertainty and make predictions about future events based on available information.",
    outline: [
      {
        id: 1,
        title: "Basic Concepts of Probability",
        content:
          "Probability is a measure of the likelihood that an event will occur. It is quantified as a number between 0 and 1, where 0 indicates impossibility and 1 indicates certainty.\n\nThe basic concepts of probability include sample space, events, and probability assignments. The sample space is the set of all possible outcomes of an experiment. An event is a subset of the sample space. The probability of an event is the ratio of the number of favorable outcomes to the total number of possible outcomes, assuming all outcomes are equally likely.",
        image: require("@/assets/images/probability.jpg"),
      },
      {
        id: 2,
        title: "Probability Distributions",
        content:
          "A probability distribution is a mathematical function that provides the probabilities of occurrence of different possible outcomes for an experiment.\n\nThere are various types of probability distributions, including discrete and continuous distributions. Discrete distributions, such as the binomial and Poisson distributions, deal with countable outcomes. Continuous distributions, such as the normal and exponential distributions, deal with outcomes that can take any value within a range.",
        image: require("@/assets/images/probability.jpg"),
      },
      {
        id: 3,
        title: "Conditional Probability",
        content:
          "Conditional probability is the probability of an event occurring given that another event has already occurred.\n\nThe conditional probability of event A given event B is denoted as P(A|B) and is calculated as the ratio of the probability of the joint event (A and B) to the probability of event B. Conditional probability is a fundamental concept in probability theory and has applications in various fields, including statistics, machine learning, and artificial intelligence.",
        image: require("@/assets/images/probability.jpg"),
      },
    ],
  },
  "english-1": {
    id: 3,
    title: "Proper Nouns",
    subject: "English",
    level: "Junior Secondary",
    duration: "2 Hours",
    image: require("@/assets/images/english.jpg"),
    description:
      "Proper nouns are specific names for people, places, organizations, and other entities. They are always capitalized, regardless of where they appear in a sentence.",
    outline: [
      {
        id: 1,
        title: "Introduction to Proper Nouns",
        content:
          "Proper nouns are specific names for individuals, places, organizations, and other entities. Unlike common nouns, proper nouns are always capitalized, regardless of their position in a sentence.\n\nProper nouns include names of people (John, Mary), places (Paris, Mount Everest), organizations (United Nations, Apple Inc.), days of the week (Monday, Sunday), months (January, December), holidays (Christmas, Eid), and specific events (World War II, Olympic Games).",
        image: require("@/assets/images/chemistry.jpg"),
      },
      {
        id: 2,
        title: "Introduction to Proper Nouns 2",
        content:
          "Proper nouns are specific names for individuals, places, organizations, and other entities. Unlike common nouns, proper nouns are always capitalized, regardless of their position in a sentence.\n\nProper nouns include names of people (John, Mary), places (Paris, Mount Everest), organizations (United Nations, Apple Inc.), days of the week (Monday, Sunday), months (January, December), holidays (Christmas, Eid), and specific events (World War II, Olympic Games).",
        image: require("@/assets/images/chemistry.jpg"),
      },
      // Add more lessons as needed
    ],
  },
  // Add more topics as needed
};

// Export a function to get a specific topic
export function getTopic(
  subject: string,
  topicId: string
): TopicDetail | undefined {
  const key = `${subject}-${topicId}`;
  return topicDetails[key];
}

// Export a function to get a specific lesson
export function getLesson(
  subject: string,
  topicId: string,
  lessonId: number
): LessonOutline | undefined {
  const topic = getTopic(subject, topicId);
  return topic?.outline.find((lesson) => lesson.id === lessonId);
}
