"use client";

import React, { useState, useMemo } from "react";
import {
  Question,
  TestConfig,
  TestModeType,
} from "@/lib/types";
import { cleanQuestionPrompt } from "@/lib/questions";
import { SeoDescriptionSection } from "./SeoDescriptionSection";
import {
  Cpu,
  Layers,
  Code,
  Database,
  Terminal,
  Network,
  Binary,
  Bot,
  Globe,
  FileCode,
  BookOpen,
  Sparkles,
  Play,
  Clock,
  CheckCircle2,
  HelpCircle,
  Search,
  Filter,
  BarChart3,
  Calendar,
  Zap,
  ChevronRight,
  ShieldCheck,
  Settings2,
  Award,
} from "lucide-react";

interface DashboardProps {
  questions: Question[];
  onStartTest: (config: TestConfig) => void;
}

// Icon mapper for topics
const getTopicIcon = (topic: string) => {
  switch (topic) {
    case "Digital Electronics & Boolean Algebra":
      return <Binary className="w-5 h-5 text-indigo-500" />;
    case "Computer Architecture & Organization":
      return <Cpu className="w-5 h-5 text-blue-500" />;
    case "Data Structures & Algorithms":
      return <Layers className="w-5 h-5 text-emerald-500" />;
    case "Programming, OOP & Python":
      return <Code className="w-5 h-5 text-violet-500" />;
    case "DBMS & SQL":
      return <Database className="w-5 h-5 text-amber-500" />;
    case "Operating Systems":
      return <Terminal className="w-5 h-5 text-rose-500" />;
    case "Computer Networks & Cybersecurity":
      return <Network className="w-5 h-5 text-cyan-500" />;
    case "Theory of Computation & Automata":
      return <Binary className="w-5 h-5 text-purple-500" />;
    case "Artificial Intelligence, Robotics & Emerging Tech":
      return <Bot className="w-5 h-5 text-teal-500" />;
    case "Web Technologies":
      return <Globe className="w-5 h-5 text-sky-500" />;
    case "Software Engineering":
      return <FileCode className="w-5 h-5 text-emerald-500" />;
    case "Computer Fundamentals & Digital Literacy":
      return <Cpu className="w-5 h-5 text-orange-500" />;
    default:
      return <BookOpen className="w-5 h-5 text-slate-500" />;
  }
};

export const Dashboard: React.FC<DashboardProps> = ({ questions, onStartTest }) => {
  const [activeTab, setActiveTab] = useState<"topics" | "full" | "browse">("topics");

  // Topic configuration modal state
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [qCount, setQCount] = useState<number>(20);
  const [durationMins, setDurationMins] = useState<number>(20);
  const [isPracticeMode, setIsPracticeMode] = useState<boolean>(false);
  const [randomize, setRandomize] = useState<boolean>(true);

  // Browse tab states
  const [searchQuery, setSearchQuery] = useState("");
  const [browseTopicFilter, setBrowseTopicFilter] = useState("All");
  const [browseYearFilter, setBrowseYearFilter] = useState("All");
  const [expandedQId, setExpandedQId] = useState<string | null>(null);

  // Group questions by topic
  const topicCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    questions.forEach((q) => {
      counts[q.topic] = (counts[q.topic] || 0) + 1;
    });
    return counts;
  }, [questions]);

  // Distinct papers
  const paperGroups = useMemo(() => {
    const papers: Record<string, { year: number; date: string; shift: string; count: number; name: string }> = {};
    questions.forEach((q) => {
      const key = `${q.year} - ${q.exam_date || ""} (${q.shift || ""})`.trim();
      if (!papers[key]) {
        papers[key] = {
          year: q.year,
          date: q.exam_date || "",
          shift: q.shift || "",
          count: 0,
          name: key,
        };
      }
      papers[key].count += 1;
    });
    return Object.values(papers).sort((a, b) => b.year - a.year);
  }, [questions]);

  // Open modal for topic test
  const handleOpenTopicConfig = (topicName: string) => {
    setSelectedTopic(topicName);
    const available = topicCounts[topicName] || 20;
    const defaultCount = Math.min(20, available);
    setQCount(defaultCount);
    setDurationMins(defaultCount); // 1 min per question by default
  };

  const handleLaunchTopicTest = () => {
    if (!selectedTopic) return;
    onStartTest({
      mode: "topic",
      title: `${selectedTopic} Test`,
      topic: selectedTopic,
      questionCount: qCount,
      durationMinutes: durationMins,
      isPracticeMode,
      randomize,
    });
    setSelectedTopic(null);
  };

  const handleLaunchFullPaper = (paperName: string, count: number) => {
    onStartTest({
      mode: "paper",
      title: `Official Paper: ${paperName}`,
      paperName,
      questionCount: count,
      durationMinutes: 150, // official 150 minutes
      isPracticeMode: false,
      randomize: false,
    });
  };

  const handleLaunchFullSimulation = () => {
    onStartTest({
      mode: "full",
      title: "Bihar STET Paper-II Full CBT Mock Test",
      questionCount: 150,
      durationMinutes: 150,
      isPracticeMode: false,
      randomize: true,
    });
  };

  const handleLaunchQuickMock = (count: number, mins: number) => {
    onStartTest({
      mode: "quick",
      title: `Rapid ${count}-Question Mock Test`,
      questionCount: count,
      durationMinutes: mins,
      isPracticeMode: false,
      randomize: true,
    });
  };

  // Filtered questions for browse
  const filteredBrowseQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchesSearch =
        searchQuery === "" ||
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        Object.values(q.options).some((opt) => opt.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesTopic = browseTopicFilter === "All" || q.topic === browseTopicFilter;
      const matchesYear = browseYearFilter === "All" || q.year.toString() === browseYearFilter;
      return matchesSearch && matchesTopic && matchesYear;
    });
  }, [questions, searchQuery, browseTopicFilter, browseYearFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-10 shadow-2xl border border-indigo-900/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Bihar STET Paper-II (Class 11–12) CBT Platform
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Master Bihar STET Computer Science with Authentic PYQs
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Practice <span className="text-emerald-400 font-semibold">{questions.length} questions</span> from official
            papers (2023, 2024 &amp; 2025). Take full 150-mark timed CBT mock tests or focused topic-wise drills with
            in-depth explanations for correct answers and distractors.
          </p>

          {/* Quick Metrics */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white">{questions.length}</div>
              <div className="text-xs text-slate-400">Total PYQs</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-bold text-emerald-400">150 Mins</div>
              <div className="text-xs text-slate-400">Exam Timer (150 Marks)</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-bold text-indigo-400">13 Topics</div>
              <div className="text-xs text-slate-400">Curriculum Areas</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-bold text-amber-400">0 Marks</div>
              <div className="text-xs text-slate-400">No Negative Marking</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-2">
        <button
          onClick={() => setActiveTab("topics")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "topics"
              ? "border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400"
              : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Topic-Wise Tests ({Object.keys(topicCounts).length})</span>
        </button>

        <button
          onClick={() => setActiveTab("full")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "full"
              ? "border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400"
              : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Full Mock Tests &amp; Paper Replay</span>
        </button>

        <button
          onClick={() => setActiveTab("browse")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "browse"
              ? "border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400"
              : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Browse All Questions ({questions.length})</span>
        </button>
      </div>

      {/* TAB 1: TOPIC-WISE TESTS */}
      {activeTab === "topics" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Choose a Topic for Targeted Practice
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Select any syllabus subject to launch a customized test with custom duration and instant feedback.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(topicCounts).map(([topic, count]) => (
              <div
                key={topic}
                onClick={() => handleOpenTopicConfig(topic)}
                className="group relative p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:scale-110 transition-transform">
                      {getTopicIcon(topic)}
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {count} Questions
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {topic}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    Official questions from Bihar STET 2023, 2024 and 2025 examinations.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <span>Configure &amp; Start</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: FULL MOCK TESTS */}
      {activeTab === "full" && (
        <div className="space-y-8">
          {/* Main Full Mock Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-900/90 via-teal-900/80 to-slate-900 border border-emerald-700/40 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                Recommended Full CBT Experience
              </div>
              <h3 className="text-2xl font-extrabold text-white">
                Standard Bihar STET Mock Test (150 Questions)
              </h3>
              <p className="text-slate-200 text-sm">
                Full 150-mark simulation with official 150-minute timer. Tests Computer Science domain (100 Qs), Art of
                Teaching (30 Qs), and General Mental Ability &amp; Aptitude (20 Qs).
              </p>
            </div>

            <button
              onClick={handleLaunchFullSimulation}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition hover:scale-105 shrink-0"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start 150-Q Full Mock</span>
            </button>
          </div>

          {/* Quick Mock Tests */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span>Quick Sprint Mocks</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">50-Question Mini Mock</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">50 Minutes • Balanced Random Mix</p>
                </div>
                <button
                  onClick={() => handleLaunchQuickMock(50, 50)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 text-xs font-bold text-slate-700 dark:text-slate-300 transition"
                >
                  Start 50-Q
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">30-Question Rapid Drill</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">30 Minutes • High-Speed Review</p>
                </div>
                <button
                  onClick={() => handleLaunchQuickMock(30, 30)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 text-xs font-bold text-slate-700 dark:text-slate-300 transition"
                >
                  Start 30-Q
                </button>
              </div>
            </div>
          </div>

          {/* Official Shift Replay Papers */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-500" />
                <span>Official Shift Papers (Actual Exam Replay)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Attempt the exact question papers as administered by the Bihar School Examination Board.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paperGroups.map((p) => (
                <div
                  key={p.name}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        {p.year} Exam
                      </span>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {p.count} Questions
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{p.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Standard CBT duration: 150 Mins • Class 11–12 Paper-II
                    </p>
                  </div>

                  <button
                    onClick={() => handleLaunchFullPaper(p.name, p.count)}
                    className="mt-4 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Attempt Full Paper ({p.count} Qs)</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BROWSE QUESTION BANK */}
      {activeTab === "browse" && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by keywords (e.g. K-map, Paging, Dijkstra, Normalization, DFD)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              {/* Topic Filter */}
              <select
                value={browseTopicFilter}
                onChange={(e) => setBrowseTopicFilter(e.target.value)}
                className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="All">All Topics</option>
                {Object.keys(topicCounts).map((t) => (
                  <option key={t} value={t}>
                    {t} ({topicCounts[t]})
                  </option>
                ))}
              </select>

              {/* Year Filter */}
              <select
                value={browseYearFilter}
                onChange={(e) => setBrowseYearFilter(e.target.value)}
                className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="All">All Years</option>
                <option value="2025">2025 Papers</option>
                <option value="2024">2024 Paper</option>
                <option value="2023">2023 Paper</option>
              </select>
            </div>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Showing {filteredBrowseQuestions.length} of {questions.length} questions
          </div>

          {/* Question List */}
          <div className="space-y-4">
            {filteredBrowseQuestions.slice(0, 50).map((q, idx) => {
              const isExpanded = expandedQId === q.id;
              const hasOfficial = q.correct_answer !== null;
              const effectiveAnswer = hasOfficial
                ? q.correct_answer?.option
                : q.candidate_selected_option || "N/A";

              return (
                <div
                  key={q.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        #{idx + 1}
                      </span>
                      <span className="font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {q.topic}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {q.year} ({q.shift || "Paper-II"})
                      </span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                        hasOfficial
                          ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                          : "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800"
                      }`}
                    >
                      {hasOfficial ? "Official Key" : "Candidate Key"}
                    </span>
                  </div>

                  <p className="font-medium text-slate-900 dark:text-slate-100 text-sm sm:text-base whitespace-pre-line">
                    {cleanQuestionPrompt(q.question)}
                  </p>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {(["A", "B", "C", "D"] as const).map((opt) => {
                      const isCorrect = opt === effectiveAnswer;
                      return (
                        <div
                          key={opt}
                          className={`p-3 rounded-xl border text-xs sm:text-sm font-medium flex items-start gap-2.5 ${
                            isCorrect
                              ? "bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
                              : "bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${
                              isCorrect
                                ? "bg-emerald-600 text-white"
                                : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                            }`}
                          >
                            {opt}
                          </span>
                          <span className="leading-snug">{q.options[opt]}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Toggle Explanation Button */}
                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={() => setExpandedQId(isExpanded ? null : q.id)}
                      className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      {isExpanded ? "Hide Explanation" : "View Detailed Explanation & Distractors"}
                    </button>
                    <span className="text-xs text-slate-400">
                      Answer: <span className="font-bold text-emerald-600 dark:text-emerald-400">{effectiveAnswer}</span>
                    </span>
                  </div>

                  {/* Expanded Explanation */}
                  {isExpanded && (
                    <div className="mt-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs sm:text-sm">
                      <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Explanation:</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {q.answer_explanation}
                      </p>

                      {q.option_explanations && (
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 space-y-1.5">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                            Option Breakdown:
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
              );
            })}

            {filteredBrowseQuestions.length > 50 && (
              <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400">
                Showing top 50 results. Use the search bar to find specific questions.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full Description for SEO - Free Test Series Guide */}
      <SeoDescriptionSection />

      {/* TOPIC TEST CONFIG MODAL */}
      {selectedTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  {getTopicIcon(selectedTopic)}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {selectedTopic}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {topicCounts[selectedTopic]} questions available
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTopic(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Question count selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Number of Questions
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[10, 20, 30, topicCounts[selectedTopic]].map((count) => {
                  const maxAvail = topicCounts[selectedTopic];
                  const actualCount = Math.min(count, maxAvail);
                  const isSelected = qCount === actualCount;
                  return (
                    <button
                      key={count}
                      type="button"
                      onClick={() => {
                        setQCount(actualCount);
                        setDurationMins(actualCount); // 1 min per Q
                      }}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${
                        isSelected
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500"
                      }`}
                    >
                      {count === maxAvail ? `All (${maxAvail})` : count}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Timer setting */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Time Limit (Minutes)
                </label>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {durationMins === 0 ? "Untimed" : `${durationMins} Mins`}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "Standard", mins: qCount },
                  { label: "Relaxed", mins: Math.round(qCount * 1.5) },
                  { label: "Sprint", mins: Math.max(5, Math.round(qCount * 0.75)) },
                  { label: "Untimed", mins: 0 },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setDurationMins(item.mins)}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      durationMins === item.mins
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Test Mode Toggle */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Feedback Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsPracticeMode(false)}
                  className={`p-3 rounded-xl border text-left text-xs transition ${
                    !isPracticeMode
                      ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200"
                      : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <div className="font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Exam Mode</span>
                  </div>
                  <div className="text-[11px] mt-0.5 opacity-80">Results &amp; solutions after submit</div>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPracticeMode(true)}
                  className={`p-3 rounded-xl border text-left text-xs transition ${
                    isPracticeMode
                      ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200"
                      : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <div className="font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Practice Mode</span>
                  </div>
                  <div className="text-[11px] mt-0.5 opacity-80">Instant answer + explanation</div>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedTopic(null)}
                className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLaunchTopicTest}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white shadow-md shadow-emerald-600/30 transition flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Test ({qCount} Qs)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
