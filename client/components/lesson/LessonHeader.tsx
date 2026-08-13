"use client";

import React from "react";
import { X, Heart } from "lucide-react";

interface LessonHeaderProps {
  progress: number;
  hearts: number;
  isSuper?: boolean;
  onQuit: () => void;
}

export function LessonHeader({ progress, hearts, isSuper, onQuit }: LessonHeaderProps) {
  return (
    <header className="w-full max-w-[1056px] mx-auto px-6 h-[70px] flex items-center justify-between gap-x-6">
      {/* Quit Button */}
      <button
        onClick={onQuit}
        className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
        type="button"
      >
        <X className="w-6 h-6 stroke-[3]" />
      </button>

      {/* Progress Bar */}
      <div className="flex-1 bg-gray-200 dark:bg-gray-800 h-3.5 rounded-full overflow-hidden relative">
        <div
          className="bg-[#58cc02] h-full rounded-full transition-all duration-300"
          style={{ width: `${Math.max(5, progress)}%` }}
        />
      </div>

      {/* Hearts Counter */}
      <div className="flex items-center gap-x-2 text-[#ff4b4b] font-extrabold text-base">
        <Heart className="w-6 h-6 fill-[#ff4b4b]" />
        <span>{isSuper ? "∞" : hearts}</span>
      </div>
    </header>
  );
}
