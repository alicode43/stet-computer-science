"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  TestResult,
  TestConfig,
  Question,
} from "@/lib/types";
import { getEffectiveAnswer } from "@/lib/questions";
import confetti from "canvas-confetti";
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  Target,
  BarChart3,
  RotateCcw,
  Home,
  Check,
  X,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Share2,
} from "lucide-react";

interface ResultViewProps {
  result: TestResult;
  onRetake: () => void;
  onPracticeMissed: (missedQuestions: Question[]) => void;
  onGoHome: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  result,
  onRetake,
  onPracticeMissed,
  onGoHome,
}) => {
  const [reviewFilter, setReviewFilter] = useState<"all" | "correct" | "incorrect" | "unattempted" | "marked">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Trigger celebration confetti on qualified score
  useEffect(() => {
    if (result.isQualified) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Fallback gracefully if canvas-confetti is unavailable
      }
    }
  }, [result.isQualified]);

  const missedQuestions = useMemo(() => {
    return result.questions.filter((q) => {
      const resp = result.responses[q.id];
      const userOpt = resp?.selectedOption?.trim().toUpperCase();
      const eff = getEffectiveAnswer(q);
      return userOpt && userOpt !== eff.option;
    });
  }, [result]);

  const markedCount = useMemo(() => {
    return Object.values(result.responses).filter((r) => r.isMarkedForReview).length;
  }, [result]);

  // Filtered review questions
  const filteredQuestions = useMemo(() => {
    return result.questions.filter((q) => {
      const resp = result.responses[q.id];
      const userOpt = resp?.selectedOption?.trim().toUpperCase();
      const eff = getEffectiveAnswer(q);
      const isCorrect = userOpt && userOpt === eff.option;
      const isIncorrect = userOpt && userOpt !== eff.option;
      const isUnattempted = !userOpt;
      const isMarked = !!resp?.isMarkedForReview;

      if (reviewFilter === "correct") return isCorrect;
      if (reviewFilter === "incorrect") return isIncorrect;
      if (reviewFilter === "unattempted") return isUnattempted;
      if (reviewFilter === "marked") return isMarked;
      return true;
    });
  }, [result, reviewFilter]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      {/* Top Scorecard Hero Banner */}
      <div
        className={`relative overflow-hidden p-8 sm:p-10 rounded-3xl border shadow-xl transition-all ${
          result.isQualified
            ? "bg-gradient-to-br from-emerald-950/90 via-slate-900 to-teal-950/90 border-emerald-500/40 text-white"
            : "bg-gradient-to-br from-slate-900 via-indigo-950/80 to-slate-900 border-indigo-800/40 text-white"
        }`}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Test Report Card</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              {result.config.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  result.isQualified
                    ? "bg-emerald-500 text-slate-950"
                    : "bg-amber-500 text-slate-950"
                }`}
              >
                {result.isQualified ? "🎉 STET QUALIFIED" : "⚠️ QUALIFICATION SHORTFALL"}
              </span>

              <span className="text-xs text-slate-300">
                Official Cutoff: 50% (75/150 for General) • 45.5% (BC) • 40% (SC/ST/Women)
              </span>
            </div>
          </div>

          {/* Big Score Gauge */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md min-w-[200px] text-center">
            <div className="text-xs uppercase font-semibold text-slate-300 tracking-wider">
              Total Score
            </div>
            <div className="text-4xl sm:text-5xl font-black text-white mt-1">
              {result.score}
              <span className="text-xl sm:text-2xl font-bold text-slate-400">/{result.maxScore}</span>
            </div>
            <div className="text-sm font-extrabold text-emerald-400 mt-1">
              {result.percentage}% Marks
            </div>
          </div>
        </div>

        {/* 4 Key Performance Metrics Grid */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span>Accuracy</span>
            </div>
            <div className="text-xl font-bold text-white mt-1">{result.accuracy}%</div>
            <div className="text-[11px] text-slate-400">
              {result.correctCount} of {result.attemptedCount} attempted
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Time Taken</span>
            </div>
            <div className="text-xl font-bold text-white mt-1">
              {formatTime(result.totalTimeSpentSeconds)}
            </div>
            <div className="text-[11px] text-slate-400">Total duration</div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Avg Speed</span>
            </div>
            <div className="text-xl font-bold text-white mt-1">
              {result.averageTimePerQuestion}s
            </div>
            <div className="text-[11px] text-slate-400">Per question</div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Attempt Rate</span>
            </div>
            <div className="text-xl font-bold text-white mt-1">
              {Math.round((result.attemptedCount / result.totalQuestions) * 100)}%
            </div>
            <div className="text-[11px] text-slate-400">
              {result.attemptedCount}/{result.totalQuestions} Questions
            </div>
          </div>
        </div>
      </div>

      {/* Top Actions Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onRetake}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake This Test</span>
          </button>

          {missedQuestions.length > 0 && (
            <button
              onClick={() => onPracticeMissed(missedQuestions)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Practice Missed ({missedQuestions.length})</span>
            </button>
          )}
        </div>

        <button
          onClick={onGoHome}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Back to Portal</span>
        </button>
      </div>

      {/* Topic-Wise Performance Breakdown */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <span>Topic-Wise Strength Analysis</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {Object.keys(result.topicBreakdown).length} Topics
          </span>
        </div>

        <div className="space-y-3">
          {Object.values(result.topicBreakdown).map((topicStat) => {
            const acc = topicStat.accuracy;
            let ratingColor = "bg-emerald-500 text-emerald-700 dark:text-emerald-300";
            let ratingLabel = "Strong";

            if (acc < 50) {
              ratingColor = "bg-rose-500 text-rose-700 dark:text-rose-300";
              ratingLabel = "Needs Focus";
            } else if (acc < 75) {
              ratingColor = "bg-amber-500 text-amber-700 dark:text-amber-300";
              ratingLabel = "Moderate";
            }

            return (
              <div
                key={topicStat.topic}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {topicStat.topic}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500">
                      Score: <strong className="text-slate-900 dark:text-white">{topicStat.correct}/{topicStat.total}</strong>
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {acc}% Acc
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {ratingLabel}
                    </span>
                  </div>
                </div>

                {/* Accuracy Bar */}
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      acc >= 75 ? "bg-emerald-500" : acc >= 50 ? "bg-amber-500" : "bg-rose-500"
                    }`}
                    style={{ width: `${acc}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comprehensive Question Review & Solutions */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Question Review &amp; Solutions
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Detailed explanations of correct answers and why distractors are wrong.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
            <button
              onClick={() => setReviewFilter("all")}
              className={`px-3 py-1.5 rounded-xl transition ${
                reviewFilter === "all"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              All ({result.totalQuestions})
            </button>
            <button
              onClick={() => setReviewFilter("correct")}
              className={`px-3 py-1.5 rounded-xl transition ${
                reviewFilter === "correct"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-emerald-600"
              }`}
            >
              Correct ({result.correctCount})
            </button>
            <button
              onClick={() => setReviewFilter("incorrect")}
              className={`px-3 py-1.5 rounded-xl transition ${
                reviewFilter === "incorrect"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-rose-600"
              }`}
            >
              Incorrect ({result.incorrectCount})
            </button>
            <button
              onClick={() => setReviewFilter("unattempted")}
              className={`px-3 py-1.5 rounded-xl transition ${
                reviewFilter === "unattempted"
                  ? "bg-slate-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Skipped ({result.unattemptedCount})
            </button>
            {markedCount > 0 && (
              <button
                onClick={() => setReviewFilter("marked")}
                className={`px-3 py-1.5 rounded-xl transition ${
                  reviewFilter === "marked"
                    ? "bg-purple-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                Marked ({markedCount})
              </button>
            )}
          </div>
        </div>

        {/* Questions Cards */}
        <div className="space-y-4">
          {filteredQuestions.map((q, idx) => {
            const resp = result.responses[q.id];
            const userOpt = resp?.selectedOption?.trim().toUpperCase();
            const eff = getEffectiveAnswer(q);
            const correctOpt = eff.option;
            const isCorrect = userOpt && userOpt === correctOpt;
            const isIncorrect = userOpt && userOpt !== correctOpt;
            const isUnattempted = !userOpt;
            const isExpanded = expandedId === q.id;

            return (
              <div
                key={q.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                {/* Question Status Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-500">#{idx + 1}</span>
                    <span className="font-semibold px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {q.topic}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">{q.year}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isCorrect && (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Correct (+1.00)</span>
                      </span>
                    )}
                    {isIncorrect && (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300 font-bold">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Incorrect (0.00)</span>
                      </span>
                    )}
                    {isUnattempted && (
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                        Not Attempted
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Prompt */}
                <p className="font-medium text-slate-900 dark:text-slate-100 text-base leading-relaxed whitespace-pre-line">
                  {q.question}
                </p>

                {/* Options Review Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {(["A", "B", "C", "D"] as const).map((opt) => {
                    const optText = q.options[opt];
                    if (!optText && optText !== "") return null;

                    const isThisCorrect = opt === correctOpt;
                    const isUserPick = opt === userOpt;

                    let optBorder = "border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200";
                    let badge = "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300";

                    if (isThisCorrect) {
                      optBorder = "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/30";
                      badge = "bg-emerald-600 text-white";
                    } else if (isUserPick && !isThisCorrect) {
                      optBorder = "bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-950 dark:text-rose-100 ring-2 ring-rose-500/30";
                      badge = "bg-rose-600 text-white";
                    }

                    return (
                      <div
                        key={opt}
                        className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-medium flex items-start gap-3 ${optBorder}`}
                      >
                        <span
                          className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${badge}`}
                        >
                          {opt}
                        </span>
                        <div className="flex-1">
                          <span className="leading-snug">{optText}</span>
                          {isUserPick && (
                            <span className="ml-2 inline-block text-[11px] font-bold text-slate-500 dark:text-slate-400">
                              (Your Choice)
                            </span>
                          )}
                        </div>
                        {isThisCorrect && (
                          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        )}
                        {isUserPick && !isThisCorrect && (
                          <X className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Expand / Collapse */}
                <div className="pt-2">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : q.id)}
                    className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    <span>{isExpanded ? "Hide Full Solution" : "View Detailed Solution & Analysis"}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {isExpanded && (
                    <div className="mt-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3 text-xs sm:text-sm animate-fade-in">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span>Correct Answer: Option {correctOpt}</span>
                        </span>
                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                          {eff.sourceLabel}
                        </span>
                      </div>

                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {q.answer_explanation}
                      </p>

                      {q.option_explanations && (
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 space-y-1.5">
                          <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                            Option Breakdown &amp; Distractor Explanations:
                          </span>
                          {(["A", "B", "C", "D"] as const).map((opt) => {
                            const exp = q.option_explanations?.[opt];
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
