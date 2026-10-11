"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Question,
  TestConfig,
  UserResponse,
} from "@/lib/types";
import { getEffectiveAnswer, cleanQuestionPrompt } from "@/lib/questions";
import {
  Clock,
  Pause,
  Play,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Send,
  RotateCcw,
  Sparkles,
  Layers,
  Award,
  Maximize2,
  Minimize2,
} from "lucide-react";

interface TestArenaProps {
  config: TestConfig;
  questions: Question[];
  onSubmitTest: (responses: Record<string, UserResponse>, totalTimeSpentSeconds: number) => void;
  onExitTest: () => void;
}

export const TestArena: React.FC<TestArenaProps> = ({
  config,
  questions,
  onSubmitTest,
  onExitTest,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // User state maps
  const [responses, setResponses] = useState<Record<string, UserResponse>>(() => {
    const initial: Record<string, UserResponse> = {};
    questions.forEach((q, idx) => {
      initial[q.id] = {
        selectedOption: null,
        isMarkedForReview: false,
        timeSpentSeconds: 0,
        visited: idx === 0, // First question is visited by default
      };
    });
    return initial;
  });

  // Timer states
  const isCountdown = config.durationMinutes > 0;
  const initialSeconds = config.durationMinutes * 60;
  const [timeRemaining, setTimeRemaining] = useState(initialSeconds);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Palette filter state
  const [paletteFilter, setPaletteFilter] = useState<"all" | "unanswered" | "marked">("all");

  const currentQ = questions[currentIndex];
  const effectiveAnswer = currentQ ? getEffectiveAnswer(currentQ) : { option: "", isOfficial: false, sourceLabel: "" };

  // Timer interval
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      if (isCountdown) {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // Auto submit on zero
            handleFinalSubmit();
            return 0;
          }
          return prev - 1;
        });
      }
      setElapsedSeconds((prev) => prev + 1);

      // Track time spent on active question
      if (currentQ) {
        setResponses((prev) => ({
          ...prev,
          [currentQ.id]: {
            ...prev[currentQ.id],
            timeSpentSeconds: (prev[currentQ.id]?.timeSpentSeconds || 0) + 1,
          },
        }));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, isCountdown, currentQ]);

  // Format time (HH:MM:SS or MM:SS)
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Keyboard navigation listener (A, B, C, D, Next, Prev)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showSubmitModal || isPaused) return;
      if (["a", "A", "1"].includes(e.key)) handleSelectOption("A");
      if (["b", "B", "2"].includes(e.key)) handleSelectOption("B");
      if (["c", "C", "3"].includes(e.key)) handleSelectOption("C");
      if (["d", "D", "4"].includes(e.key)) handleSelectOption("D");
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, isPaused, showSubmitModal]);

  // Option selection
  const handleSelectOption = (option: string) => {
    if (!currentQ) return;
    setResponses((prev) => ({
      ...prev,
      [currentQ.id]: {
        ...prev[currentQ.id],
        selectedOption: option,
        visited: true,
      },
    }));
  };

  // Clear current response
  const handleClearResponse = () => {
    if (!currentQ) return;
    setResponses((prev) => ({
      ...prev,
      [currentQ.id]: {
        ...prev[currentQ.id],
        selectedOption: null,
      },
    }));
  };

  // Toggle mark for review and next
  const handleToggleMarkAndNext = () => {
    if (!currentQ) return;
    setResponses((prev) => ({
      ...prev,
      [currentQ.id]: {
        ...prev[currentQ.id],
        isMarkedForReview: !prev[currentQ.id]?.isMarkedForReview,
        visited: true,
      },
    }));
    handleNext();
  };

  // Jump to specific question
  const handleJumpToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      const targetQ = questions[index];
      setResponses((prev) => ({
        ...prev,
        [targetQ.id]: {
          ...prev[targetQ.id],
          visited: true,
        },
      }));
      setCurrentIndex(index);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      handleJumpToQuestion(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      handleJumpToQuestion(currentIndex - 1);
    }
  };

  const handleFinalSubmit = useCallback(() => {
    const totalTimeSpent = isCountdown ? initialSeconds - timeRemaining : elapsedSeconds;
    onSubmitTest(responses, totalTimeSpent);
  }, [isCountdown, initialSeconds, timeRemaining, elapsedSeconds, responses, onSubmitTest]);

  // Counts for summary
  const summary = React.useMemo(() => {
    let answered = 0;
    let marked = 0;
    let notAnswered = 0;
    let notVisited = 0;

    questions.forEach((q) => {
      const r = responses[q.id];
      if (r?.selectedOption) {
        answered++;
        if (r.isMarkedForReview) marked++;
      } else if (r?.isMarkedForReview) {
        marked++;
      } else if (r?.visited) {
        notAnswered++;
      } else {
        notVisited++;
      }
    });

    return { answered, marked, notAnswered, notVisited };
  }, [questions, responses]);

  if (!currentQ) return null;

  const currentResp = responses[currentQ.id];
  const userSelected = currentResp?.selectedOption;
  const isMarked = currentResp?.isMarkedForReview;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Test Header Bar */}
      <header className="sticky top-0 z-30 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-1">
              {config.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>Question {currentIndex + 1} of {questions.length}</span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                {config.isPracticeMode ? "Practice Mode (Instant Key)" : "Exam Mode"}
              </span>
            </div>
          </div>
        </div>

        {/* Center / Right: Timer & Actions */}
        <div className="flex items-center gap-3">
          {/* Timer Display */}
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-sm font-mono font-bold transition-all ${
              isCountdown && timeRemaining <= 120
                ? "bg-rose-50 dark:bg-rose-950/60 border-rose-400 text-rose-600 dark:text-rose-400 timer-alert"
                : isCountdown && timeRemaining <= 300
                ? "bg-amber-50 dark:bg-amber-950/60 border-amber-400 text-amber-600 dark:text-amber-400"
                : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
            }`}
          >
            <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{isCountdown ? formatTime(timeRemaining) : formatTime(elapsedSeconds)}</span>
          </div>

          {/* Pause Button */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
            title={isPaused ? "Resume Test" : "Pause Test"}
          >
            {isPaused ? <Play className="w-4 h-4 fill-current text-emerald-500" /> : <Pause className="w-4 h-4" />}
          </button>

          {/* Submit Test Button */}
          <button
            onClick={() => setShowSubmitModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Submit Test</span>
          </button>
        </div>
      </header>

      {/* Main Examination View Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Question & Options (3 Cols on desktop) */}
        <div className="lg:col-span-3 flex flex-col justify-between space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            {/* Question Meta Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold">
                  Q. {currentIndex + 1}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {currentQ.topic}
                </span>
                {currentQ.year && (
                  <span className="hidden sm:inline text-xs text-slate-400">
                    {currentQ.year} • {currentQ.shift || "Paper-II"}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-800">
                  +1.00 Mark
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold">
                  0.00 Neg
                </span>
              </div>
            </div>

            {/* Question Content */}
            <div className="space-y-4">
              <p className="text-base sm:text-lg font-medium text-slate-900 dark:text-slate-100 leading-relaxed whitespace-pre-line select-text">
                {cleanQuestionPrompt(currentQ.question)}
              </p>
            </div>

            {/* Options Grid */}
            <div className="space-y-3 pt-2">
              {(["A", "B", "C", "D"] as const).map((opt) => {
                const optText = currentQ.options[opt];
                if (!optText && optText !== "") return null;

                const isSelected = userSelected === opt;
                const isPractice = config.isPracticeMode;
                const isCorrect = effectiveAnswer.option === opt;

                let cardStyle =
                  "bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 hover:border-emerald-400 dark:hover:border-emerald-500";
                let badgeStyle =
                  "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300";

                if (isPractice && userSelected) {
                  // In practice mode, show correct/wrong feedback immediately
                  if (isCorrect) {
                    cardStyle =
                      "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/30";
                    badgeStyle = "bg-emerald-600 text-white";
                  } else if (isSelected && !isCorrect) {
                    cardStyle =
                      "bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-950 dark:text-rose-100 ring-2 ring-rose-500/30";
                    badgeStyle = "bg-rose-600 text-white";
                  }
                } else if (isSelected) {
                  // Normal exam mode selected state
                  cardStyle =
                    "bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/30";
                  badgeStyle = "bg-emerald-600 text-white";
                }

                return (
                  <div
                    key={opt}
                    onClick={() => handleSelectOption(opt)}
                    className={`p-4 rounded-2xl border text-sm sm:text-base font-medium flex items-start gap-3.5 cursor-pointer transition-all ${cardStyle}`}
                  >
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${badgeStyle}`}
                    >
                      {opt}
                    </span>
                    <span className="flex-1 leading-normal pt-0.5">{optText}</span>
                  </div>
                );
              })}
            </div>

            {/* Practice Mode Instant Explanation Box */}
            {config.isPracticeMode && userSelected && (
              <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-3 animate-fade-in text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Correct Answer: Option {effectiveAnswer.option}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {effectiveAnswer.sourceLabel}
                  </span>
                </div>

                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {currentQ.answer_explanation}
                </p>

                {currentQ.option_explanations && (
                  <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-900/40 space-y-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                      Option Breakdown:
                    </span>
                    {(["A", "B", "C", "D"] as const).map((opt) => {
                      const exp = currentQ.option_explanations?.[opt];
                      if (!exp) return null;
                      return (
                        <div key={opt} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                          <span className="font-bold text-slate-700 dark:text-slate-300">{opt}:</span>
                          <span>{exp}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Action Controls */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2">
              <button
                onClick={handleClearResponse}
                disabled={!userSelected}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear Response</span>
              </button>

              <button
                onClick={handleToggleMarkAndNext}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                  isMarked
                    ? "bg-purple-50 dark:bg-purple-950/60 border-purple-400 text-purple-700 dark:text-purple-300"
                    : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isMarked ? "fill-current" : ""}`} />
                <span>{isMarked ? "Unmark Review" : "Mark for Review & Next"}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold disabled:opacity-40 transition flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={handleNext}
                disabled={currentIndex === questions.length - 1}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition flex items-center gap-1"
              >
                <span>Save &amp; Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Question Palette & CBT Navigator */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
              <span>Question Palette</span>
              <span className="text-xs text-slate-500 font-normal">
                {questions.length} Questions
              </span>
            </h3>

            {/* Legend Status Grid */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                  {summary.answered}
                </span>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                  {summary.notAnswered}
                </span>
                <span>Not Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                  {summary.marked}
                </span>
                <span>Marked</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold flex items-center justify-center shrink-0">
                  {summary.notVisited}
                </span>
                <span>Not Visited</span>
              </div>
            </div>

            {/* Palette Filter */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium">
              {(["all", "unanswered", "marked"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setPaletteFilter(filter)}
                  className={`flex-1 py-1 rounded-lg capitalize transition ${
                    paletteFilter === filter
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-xs"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Question Buttons Number Grid */}
            <div className="max-h-72 overflow-y-auto pr-1 grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const r = responses[q.id];
                const hasSelected = !!r?.selectedOption;
                const isMark = !!r?.isMarkedForReview;
                const isVis = !!r?.visited;
                const isCurrent = idx === currentIndex;

                // Palette color logic per CBT standards
                let btnStyle = "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200";

                if (hasSelected && isMark) {
                  btnStyle = "bg-purple-700 text-white ring-2 ring-emerald-400";
                } else if (hasSelected) {
                  btnStyle = "bg-emerald-600 text-white";
                } else if (isMark) {
                  btnStyle = "bg-purple-600 text-white";
                } else if (isVis) {
                  btnStyle = "bg-rose-600 text-white";
                }

                if (isCurrent) {
                  btnStyle += " ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900";
                }

                // Apply filter
                if (paletteFilter === "unanswered" && hasSelected) return null;
                if (paletteFilter === "marked" && !isMark) return null;

                return (
                  <button
                    key={q.id}
                    onClick={() => handleJumpToQuestion(idx)}
                    className={`h-9 rounded-xl text-xs font-bold transition flex items-center justify-center ${btnStyle}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Quick Action in Sidebar */}
            <button
              onClick={() => setShowSubmitModal(true)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition flex items-center justify-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Submit Examination</span>
            </button>
          </div>
        </div>
      </div>

      {/* PAUSE MODAL OVERLAY */}
      {isPaused && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-sm p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-4 animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center mx-auto">
              <Pause className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
              Test is Paused
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Questions are hidden while paused. The timer will resume as soon as you continue.
            </p>
            <button
              onClick={() => setIsPaused(false)}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Resume Test</span>
            </button>
          </div>
        </div>
      )}

      {/* SUBMIT CONFIRMATION MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Confirm Test Submission
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Are you ready to submit your test? Here is your summary:
                </p>
              </div>
            </div>

            {/* Summary Table */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">Total Questions:</span>
                <span className="font-bold text-slate-900 dark:text-white">{questions.length}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">Answered:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{summary.answered}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">Marked for Review:</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">{summary.marked}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-600 dark:text-slate-400">Unanswered / Unvisited:</span>
                <span className="font-bold text-rose-600 dark:text-rose-400">
                  {questions.length - summary.answered}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                Return to Test
              </button>
              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  handleFinalSubmit();
                }}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white shadow-md shadow-emerald-600/30 transition flex items-center justify-center gap-1"
              >
                <span>Yes, Submit</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
