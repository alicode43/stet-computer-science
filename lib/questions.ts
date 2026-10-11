import { Question, QuestionBankData, TestConfig, TestResult, TopicStat, UserResponse } from "./types";

export function getEffectiveAnswer(q: Question): {
  option: string;
  isOfficial: boolean;
  sourceLabel: string;
} {
  if (q.correct_answer && q.correct_answer.option) {
    return {
      option: q.correct_answer.option.trim().toUpperCase(),
      isOfficial: true,
      sourceLabel: "Official BSEB Key",
    };
  }
  if (q.candidate_selected_option) {
    return {
      option: q.candidate_selected_option.trim().toUpperCase(),
      isOfficial: false,
      sourceLabel: "Candidate Key (2025 Source)",
    };
  }
  return {
    option: "",
    isOfficial: false,
    sourceLabel: "Unassigned",
  };
}

export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function buildTestQuestions(allQuestions: Question[], config: TestConfig): Question[] {
  let filtered = [...allQuestions];

  if (config.mode === "topic" && config.topic) {
    if (config.topic !== "All Topics") {
      filtered = filtered.filter((q) => q.topic === config.topic);
    }
  } else if (config.mode === "paper" && config.paperName) {
    filtered = filtered.filter((q) => {
      const paperKey = `${q.year} - ${q.exam_date || ""} (${q.shift || ""})`.trim();
      return paperKey.includes(config.paperName!) || (q.source_file && q.source_file.includes(config.paperName!));
    });
  } else if (config.mode === "full") {
    // For full mock, if more than requested, balance or take requested count
    filtered = [...allQuestions];
  }

  if (config.randomize) {
    filtered = shuffleArray(filtered);
  }

  if (config.questionCount > 0 && config.questionCount < filtered.length) {
    filtered = filtered.slice(0, config.questionCount);
  }

  return filtered;
}

export function calculateTestResult(
  config: TestConfig,
  questions: Question[],
  responses: Record<string, UserResponse>,
  totalTimeSpentSeconds: number
): TestResult {
  let score = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let unattemptedCount = 0;
  let attemptedCount = 0;

  const topicMap: Record<string, TopicStat> = {};

  questions.forEach((q) => {
    const topic = q.topic || "General Computer Science";
    if (!topicMap[topic]) {
      topicMap[topic] = {
        topic,
        total: 0,
        attempted: 0,
        correct: 0,
        incorrect: 0,
        unattempted: 0,
        accuracy: 0,
      };
    }
    topicMap[topic].total += 1;

    const resp = responses[q.id];
    const userOption = resp?.selectedOption?.trim().toUpperCase();
    const effective = getEffectiveAnswer(q);
    const correctOpt = effective.option;

    if (!userOption) {
      unattemptedCount += 1;
      topicMap[topic].unattempted += 1;
    } else {
      attemptedCount += 1;
      topicMap[topic].attempted += 1;
      if (userOption === correctOpt) {
        score += 1; // 1 mark per question (No negative marking in STET)
        correctCount += 1;
        topicMap[topic].correct += 1;
      } else {
        incorrectCount += 1;
        topicMap[topic].incorrect += 1;
      }
    }
  });

  // Calculate accuracies
  Object.values(topicMap).forEach((st) => {
    st.accuracy = st.attempted > 0 ? Math.round((st.correct / st.attempted) * 100) : 0;
  });

  const totalQuestions = questions.length;
  const maxScore = totalQuestions;
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 1000) / 10 : 0;
  const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 1000) / 10 : 0;
  const isQualified = percentage >= 50.0; // 50% cutoff for general category
  const averageTimePerQuestion = totalQuestions > 0 ? Math.round(totalTimeSpentSeconds / totalQuestions) : 0;

  return {
    config,
    totalQuestions,
    score,
    maxScore,
    percentage,
    isQualified,
    attemptedCount,
    correctCount,
    incorrectCount,
    unattemptedCount,
    accuracy,
    totalTimeSpentSeconds,
    averageTimePerQuestion,
    topicBreakdown: topicMap,
    questions,
    responses,
    completedAt: new Date().toISOString(),
  };
}
