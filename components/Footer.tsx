"use client";

import React from "react";
import {
  GitPullRequest,
  Bug,
  ExternalLink,
  Award,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Heart,
  Code,
  Layers,
  Clock,
  ShieldCheck,
} from "lucide-react";

interface FooterProps {
  onNavigateHome?: () => void;
  currentView?: "dashboard" | "test" | "result";
}

export const Footer: React.FC<FooterProps> = ({ onNavigateHome, currentView }) => {
  const repoUrl = "https://github.com/alicode43/stet-computer-science";
  const issuesUrl = "https://github.com/alicode43/stet-computer-science/issues";

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
      {/* Community Contribution & Error Reporting Callout Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm">
                <Bug className="w-3.5 h-3.5 text-amber-300" />
                <span>Open Source Question Bank</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold">
                Found an error or typo? Contribute and improve this free test series!
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
                If you find any error in question statements, incorrect answer keys, or calculation mistakes,
                please contribute a fix or open an issue on GitHub to help fellow Bihar STET aspirants.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0">
              <a
                href={issuesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all shadow-sm"
              >
                <Bug className="w-4 h-4 text-amber-300" />
                <span>Report an Error</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>

              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-slate-900 hover:bg-emerald-50 text-xs font-extrabold transition-all shadow-md hover:shadow-lg group"
              >
                {/* GitHub Mark SVG */}
                <svg
                  className="w-4 h-4 fill-current group-hover:scale-110 transition-transform"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
                <span>Contribute on GitHub</span>
                <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-slate-900" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-base text-slate-900 dark:text-white tracking-tight">
                  Bihar STET Computer Science Paper-II
                </h4>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  100% Free Online Mock Test Series &amp; CBT Portal
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
              An open, non-profit community initiative providing free, high-fidelity Computer-Based Test (CBT)
              simulations for Bihar Secondary Teacher Eligibility Test (STET) Paper-II (Senior Secondary / Classes 11–12
              PGT Computer Science). Featuring 899+ authentic BSEB PYQs (2023, 2024, 2025) with detailed explanations,
              realistic 150-mark exam timers, and topic-wise mastery modules.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 font-medium">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> 100% Free Access
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 font-medium">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> No Login or Paywall
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 font-medium">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Authentic BSEB PYQs
              </span>
            </div>
          </div>

          {/* Test Series Features */}
          <div className="space-y-2.5">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Free Test Series Modes
            </h5>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                <Clock className="w-3.5 h-3.5 text-emerald-500" />
                <span>Full 150-Mark CBT Mock (150 Mins)</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                <span>13 Topic-Wise Practice Tests</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                <span>Official Shift Papers (2023–2025)</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Instant Solutions &amp; Explanations</span>
              </li>
            </ul>
          </div>

          {/* Open Source & Repository Link */}
          <div className="space-y-2.5">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Contribute &amp; Source Code
            </h5>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              This repository is open for community contributions. If you spot any question correction or want to add
              new study resources, join us on GitHub:
            </p>
            <div className="pt-1">
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline break-all"
              >
                <Code className="w-3.5 h-3.5 shrink-0" />
                <span>github.com/alicode43/stet-computer-science</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-500">
              MIT License • Maintained for Bihar STET Computer Science Aspirants
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div>
            © {new Date().getFullYear()}{" "}
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 underline underline-offset-2"
            >
              alicode43/stet-computer-science
            </a>{" "}
            • 100% Free Test Series &amp; Study Portal
          </div>
          <div className="flex items-center gap-3">
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              GitHub Repository
            </a>
            <span>•</span>
            <a
              href={issuesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Report Question Issue
            </a>
            <span>•</span>
            <span>Bihar STET Paper-II PGT</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
