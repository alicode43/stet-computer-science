"use client";

import React, { useState, useEffect } from "react";
import { Question, TestConfig, TestResult, UserResponse } from "@/lib/types";
import { buildTestQuestions, calculateTestResult } from "@/lib/questions";
import { Navbar } from "./Navbar";
import { Dashboard } from "./Dashboard";
import { TestArena } from "./TestArena";
import { ResultView } from "./ResultView";
import { Footer } from "./Footer";
import { Loader2 } from "lucide-react";

interface TestPortalAppProps {
  initialQuestions: Question[];
}

export const TestPortalApp: React.FC<TestPortalAppProps> = ({ initialQuestions }) => {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [loading, setLoading] = useState(initialQuestions.length === 0);

  // App Navigation View
  const [currentView, setCurrentView] = useState<"dashboard" | "test" | "result">("dashboard");

  // Active Test States
  const [activeConfig, setActiveConfig] = useState<TestConfig | null>(null);
  const [activeTestQuestions, setActiveTestQuestions] = useState<Question[]>([]);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  // Dark Mode
  const [isDark, setIsDark] = useState(false);

  // Initialize theme from system or localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("stet_theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = savedTheme ? savedTheme === "dark" : prefersDark;

    setIsDark(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDark = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("stet_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("stet_theme", "light");
    }
  };

  // If initialQuestions is empty, fetch from /data/stet_questions.json
  useEffect(() => {
    if (questions.length === 0) {
      setLoading(true);
      fetch("/data/stet_questions.json")
        .then((res) => res.json())
        .then((data) => {
          if (data && Array.isArray(data.questions)) {
            setQuestions(data.questions);
          }
        })
        .catch((err) => console.error("Error loading questions:", err))
        .finally(() => setLoading(false));
    }
  }, [questions.length]);

  // Launch a new test
  const handleStartTest = (config: TestConfig) => {
    const testQs = buildTestQuestions(questions, config);
    if (testQs.length === 0) {
      alert("No questions found matching this filter.");
      return;
    }
    setActiveConfig(config);
    setActiveTestQuestions(testQs);
    setCurrentView("test");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Submit test and show results
  const handleSubmitTest = (
    responses: Record<string, UserResponse>,
    totalTimeSpentSeconds: number
  ) => {
    if (!activeConfig) return;
    const result = calculateTestResult(
      activeConfig,
      activeTestQuestions,
      responses,
      totalTimeSpentSeconds
    );
    setTestResult(result);
    setCurrentView("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Retake the same test
  const handleRetake = () => {
    if (!activeConfig) return;
    handleStartTest(activeConfig);
  };

  // Practice only missed questions
  const handlePracticeMissed = (missedQuestions: Question[]) => {
    const config: TestConfig = {
      mode: "quick",
      title: "Targeted Practice: Missed Questions Review",
      questionCount: missedQuestions.length,
      durationMinutes: 0, // Untimed practice
      isPracticeMode: true, // Instant explanations
      randomize: false,
    };
    setActiveConfig(config);
    setActiveTestQuestions(missedQuestions);
    setCurrentView("test");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGoHome = () => {
    if (currentView === "test") {
      const confirmExit = window.confirm(
        "Are you sure you want to exit the current test? Your ongoing progress will be discarded."
      );
      if (!confirmExit) return;
    }
    setCurrentView("dashboard");
    setActiveConfig(null);
    setActiveTestQuestions([]);
    setTestResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        <h2 className="mt-4 font-bold text-lg">Loading Bihar STET Question Bank...</h2>
        <p className="text-xs text-slate-500">Preparing 899 official previous year questions</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar
        currentView={currentView}
        onGoHome={handleGoHome}
        activeTopic={activeConfig?.title}
        isDark={isDark}
        toggleDark={toggleDark}
      />

      <main className="flex-1 flex flex-col">
        {currentView === "dashboard" && (
          <Dashboard questions={questions} onStartTest={handleStartTest} />
        )}

        {currentView === "test" && activeConfig && (
          <TestArena
            config={activeConfig}
            questions={activeTestQuestions}
            onSubmitTest={handleSubmitTest}
            onExitTest={handleGoHome}
          />
        )}

        {currentView === "result" && testResult && (
          <ResultView
            result={testResult}
            onRetake={handleRetake}
            onPracticeMissed={handlePracticeMissed}
            onGoHome={handleGoHome}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigateHome={handleGoHome} currentView={currentView} />
    </div>
  );
};
