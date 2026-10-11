"use client";

import React from "react";
import { BookOpen, Award, CheckCircle2, Moon, Sun, Clock, FileText, Home } from "lucide-react";

interface NavbarProps {
  currentView: "dashboard" | "test" | "result";
  onGoHome: () => void;
  activeTopic?: string;
  isDark: boolean;
  toggleDark: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onGoHome,
  activeTopic,
  isDark,
  toggleDark,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={onGoHome}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                Bihar STET
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                Paper-II
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Computer Science • Class 11-12 CBT Test Portal
            </p>
          </div>
        </div>

        {/* Center Indicator if in Test */}
        {currentView === "test" && activeTopic && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Active Test:</span>
            <span className="text-emerald-600 dark:text-emerald-400 max-w-[200px] truncate">
              {activeTopic}
            </span>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {currentView !== "dashboard" && (
            <button
              onClick={onGoHome}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              title="Return to Home Dashboard"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleDark}
            aria-label="Toggle theme"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
