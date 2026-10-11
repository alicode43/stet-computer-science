export interface QuestionOptionExplanations {
  A?: string;
  B?: string;
  C?: string;
  D?: string;
}

export interface Question {
  id: string;
  exam: string;
  paper: string;
  year: number;
  exam_date?: string;
  shift?: string;
  topic: string;
  question_number: number;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correct_answer: {
    option: string;
    text: string;
  } | null;
  answer_status: "source_key" | "unverified";
  answer_explanation: string;
  option_explanations?: QuestionOptionExplanations;
  candidate_selected_option?: string | null;
  source_file?: string;
  notes?: string;
}

export interface QuestionBankData {
  title: string;
  description: string;
  coverage: {
    question_count: number;
    years_included: number[];
    papers: string[];
    not_included?: string[];
    answer_key_caveat?: string;
  };
  questions: Question[];
}

export type TestModeType = "topic" | "full" | "paper" | "quick";

export interface TestConfig {
  mode: TestModeType;
  title: string;
  topic?: string;
  paperName?: string;
  questionCount: number;
  durationMinutes: number; // 0 for untimed
  isPracticeMode: boolean; // instant answer & explanation review
  randomize: boolean;
}

export type QuestionStatus = "answered" | "not_answered" | "marked" | "answered_marked" | "not_visited";

export interface UserResponse {
  selectedOption: string | null;
  isMarkedForReview: boolean;
  timeSpentSeconds: number;
  visited: boolean;
}

export interface TopicStat {
  topic: string;
  total: number;
  attempted: number;
  correct: number;
  incorrect: number;
  unattempted: number;
  accuracy: number;
}

export interface TestResult {
  config: TestConfig;
  totalQuestions: number;
  score: number;
  maxScore: number;
  percentage: number;
  isQualified: boolean; // STET cutoff (>=50% general)
  attemptedCount: number;
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  accuracy: number;
  totalTimeSpentSeconds: number;
  averageTimePerQuestion: number;
  topicBreakdown: Record<string, TopicStat>;
  questions: Question[];
  responses: Record<string, UserResponse>;
  completedAt: string;
}
