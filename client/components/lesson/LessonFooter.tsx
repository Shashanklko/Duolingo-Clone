"use client";

import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";

interface LessonFooterProps {
  status: "none" | "correct" | "wrong";
  onCheck: () => void;
  onContinue: () => void;
  disabled?: boolean;
  correctAnswer?: string;
}

export function LessonFooter({
  status,
  onCheck,
  onContinue,
  disabled,
  correctAnswer,
}: LessonFooterProps) {
  return (
    <footer
      className={`w-full border-t-2 transition-all duration-200 py-6 px-6 sm:px-12 fixed bottom-0 left-0 right-0 z-40 ${
        status === "none"
          ? "bg-white dark:bg-[#131f24] border-gray-200 dark:border-gray-800"
          : status === "correct"
          ? "bg-[#d7ffb8] dark:bg-[#193809] border-[#b8f28b] text-[#58cc02]"
          : "bg-[#ffdede] dark:bg-[#3b1212] border-[#ffb8b8] text-[#ff4b4b]"
      }`}
    >
      <div className="max-w-[1056px] mx-auto flex items-center justify-between gap-x-4">
        {status === "none" ? (
          <div className="flex-1" />
        ) : status === "correct" ? (
          <div className="flex items-center gap-x-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#58cc02] shadow-sm">
              <CheckCircle2 className="w-8 h-8 stroke-[3]" />
            </div>
            <div className="flex flex-col">
              <h3 className="font-extrabold text-xl text-[#58cc02]">Excellent!</h3>
              <p className="text-sm font-bold text-gray-700 dark:text-gray-200">You got it right</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-x-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#ff4b4b] shadow-sm">
              <XCircle className="w-8 h-8 stroke-[3]" />
            </div>
            <div className="flex flex-col">
              <h3 className="font-extrabold text-xl text-[#ff4b4b]">Correct answer:</h3>
              <p className="text-base font-extrabold text-gray-800 dark:text-gray-100">{correctAnswer}</p>
            </div>
          </div>
        )}

        <button
          onClick={status === "none" ? onCheck : onContinue}
          disabled={status === "none" && disabled}
          className={`px-8 py-3.5 rounded-2xl font-extrabold text-sm uppercase tracking-widest transition-all cursor-pointer ${
            status === "none"
              ? disabled
                ? "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed border-b-4 border-gray-300 dark:border-gray-700"
                : "bg-[#58cc02] hover:bg-[#46a302] text-white border-b-4 border-[#46a302] active:border-b-0 active:translate-y-[2px]"
              : status === "correct"
              ? "bg-[#58cc02] hover:bg-[#46a302] text-white border-b-4 border-[#46a302] active:border-b-0 active:translate-y-[2px]"
              : "bg-[#ff4b4b] hover:bg-[#d93838] text-white border-b-4 border-[#d93838] active:border-b-0 active:translate-y-[2px]"
          }`}
        >
          {status === "none" ? "Check" : "Continue"}
        </button>
      </div>
    </footer>
  );
}
