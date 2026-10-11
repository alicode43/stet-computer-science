"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Award,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  Layers,
  Clock,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Bug,
  Code,
  FileText,
  Zap,
} from "lucide-react";

export const SeoDescriptionSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "Is this Bihar STET Computer Science Paper-II test series completely free?",
      a: "Yes, 100% free! There are no paid tiers, no mandatory logins, and no paywalls. All 899+ questions, official PYQ papers (2023, 2024, 2025), topic-wise tests, and full 150-mark CBT exam simulations are accessible to every candidate free of cost.",
    },
    {
      q: "Does this test series cover the official Bihar STET Paper-II syllabus for Classes 11–12?",
      a: "Yes. The questions strictly align with the Bihar School Examination Board (BSEB) syllabus for Senior Secondary (PGT) Computer Science teachers. It includes 13 core domains such as Data Structures & Algorithms, Programming & Python, DBMS & SQL, Operating Systems, Computer Networks, Computer Architecture, Digital Logic, TOC, and Software Engineering.",
    },
    {
      q: "Is there negative marking in the Bihar STET Computer Science exam?",
      a: "No, there is NO negative marking in the official Bihar STET examination. Each correct answer awards +1 mark, while unattempted or incorrect answers receive 0 marks. Our CBT mock test engine accurately replicates this exact scoring system.",
    },
    {
      q: "Can I take topic-wise practice tests as well as full-length timed mock tests?",
      a: "Yes! You can take full 150-mark mock tests with the official 150-minute timer in Exam Mode, or customize topic-specific drills (e.g. 10 to 50 questions) in Practice Mode with instant answer revelations and comprehensive distractor explanations.",
    },
    {
      q: "How can I report an incorrect answer key or contribute corrections?",
      a: "This test series is an open-source project hosted on GitHub at https://github.com/alicode43/stet-computer-science. If you discover any typo, wrong key, or formula error, simply click the 'Report an Error' button in the footer or submit a Pull Request on GitHub.",
    },
  ];

  return (
    <section className="space-y-8 pt-4">
      {/* Main SEO Header Card */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Free Test Series &amp; CBT Portal</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Bihar STET Computer Science Paper-II: Free Mock Test Series &amp; CBT Portal
          </h2>

          <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
            <p>
              Welcome to the most comprehensive <strong>free online test series</strong> and CBT examination portal for{" "}
              <strong>Bihar Secondary Teacher Eligibility Test (STET) Paper-II (Classes 11–12 / PGT Computer Science)</strong>,
              conducted by the <strong>Bihar School Examination Board (BSEB)</strong>. This platform is built to provide all
              teaching aspirants with authentic exam preparation without paywalls, subscriptions, or restrictive logins.
            </p>
            <p>
              Master Bihar STET Computer Science through <strong>899+ authentic Previous Year Questions (PYQs)</strong> from
              official 2023, 2024, and 2025 examination shifts. Practice in a realistic Computer-Based Test (CBT) environment
              featuring a real-time 150-minute countdown timer, question status palette, instant performance analytics, and
              detailed explanations for every question.
            </p>
          </div>

          {/* Key Advantages Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">100% Free Forever</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                No fee, no hidden subscriptions, and no mandatory signup. Complete access to every mock test, PYQ paper,
                and topic module.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Real CBT Simulation</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Official 150-minute exam timer, candidate response palette (Visited, Answered, Marked for Review), and
                realistic test submission.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">In-Depth Explanations</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Step-by-step solutions explain why the right answer is correct and why other distractors are wrong,
                ensuring deep conceptual clarity.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Exam Pattern & Syllabus Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exam Pattern Card */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Official Bihar STET Paper-II Exam Pattern
            </h3>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 flex justify-between items-center">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Total Questions</span>
              <span className="font-bold text-slate-900 dark:text-white">150 MCQs</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 flex justify-between items-center">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Total Marks</span>
              <span className="font-bold text-slate-900 dark:text-white">150 Marks (1 Mark / Question)</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 flex justify-between items-center">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Exam Duration</span>
              <span className="font-bold text-slate-900 dark:text-white">150 Minutes (2.5 Hours)</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 flex justify-between items-center">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Negative Marking</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">NO Negative Marking (0 mark for wrong)</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 flex justify-between items-center">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Section A (Computer Science)</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">100 Questions (100 Marks)</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 flex justify-between items-center">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Section B (Art of Teaching &amp; Skills)</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">50 Questions (50 Marks)</span>
            </div>
          </div>
        </div>

        {/* Syllabus Coverage Card */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Syllabus Topics Covered in Free Test Series
            </h3>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Our question bank covers every single curriculum area outlined by BSEB for Senior Secondary Computer Science teachers:
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              "Data Structures & Algorithms",
              "Programming & Python / C++",
              "DBMS & SQL Database Systems",
              "Computer Networks & Security",
              "Operating Systems & Linux",
              "Computer Architecture & Org.",
              "Digital Logic & Boolean Algebra",
              "Theory of Computation (TOC)",
              "Web Technologies (HTML/CSS/JS)",
              "Software Engineering & SDLC",
              "Artificial Intelligence & ML",
              "Computer Fundamentals & Literacy",
            ].map((topic) => (
              <div
                key={topic}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="truncate">{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Open Source Contribution Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 border border-emerald-800/40 p-6 sm:p-8 text-white space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
              <Bug className="w-3.5 h-3.5" />
              <span>Community-Powered Open Source Education</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">
              Find an Error? Help Improve This Free Test Series
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              We strive for 100% accuracy in all questions, formulas, and answer keys. If you notice any typo,
              incorrect option, or question discrepancy, please contribute or file an issue on GitHub.
              Every contribution helps thousands of teachers across Bihar!
            </p>
          </div>

          <a
            href="https://github.com/alicode43/stet-computer-science"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg shrink-0"
          >
            <Code className="w-4 h-4" />
            <span>Contribute on GitHub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Frequently Asked Questions (FAQ) Section */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Frequently Asked Questions (FAQ)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Everything you need to know about this free Bihar STET Computer Science Paper-II test series.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      isOpen ? "rotate-180 text-emerald-500" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200/60 dark:border-slate-700/60">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
