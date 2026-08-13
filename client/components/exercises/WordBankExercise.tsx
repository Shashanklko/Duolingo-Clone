"use client";

import React from "react";
import { Volume2 } from "lucide-react";

import { speakText } from "@/lib/sounds";
import { useCourseStore } from "@/lib/store";

interface WordBankExerciseProps {
  question: string;
  promptText?: string;
  words: string[];
  selectedWords: string[];
  onSelectWord: (word: string, index: number) => void;
  onRemoveWord: (word: string, index: number) => void;
  disabled?: boolean;
}

export default function WordBankExercise({
  question,
  promptText,
  words,
  selectedWords,
  onSelectWord,
  onRemoveWord,
  disabled = false,
}: WordBankExerciseProps) {
  const activeCourseId = useCourseStore((s) => s.activeCourseId);

  return (
    <div className="w-full max-w-[600px] flex flex-col items-center gap-y-6">
      {/* Exercise Title */}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-left w-full" style={{ color: "var(--text-primary)" }}>
        {question}
      </h2>

      {/* Speaker + Prompt */}
      {promptText && (
        <div className="flex items-center gap-x-4 w-full my-2">
          <button 
            onClick={() => speakText(promptText, activeCourseId)}
            className="w-12 h-12 rounded-2xl bg-[#1cb0f6] text-white flex items-center justify-center border-b-4 border-[#1899d6] active:border-b-0 active:translate-y-[2px] transition cursor-pointer"
            type="button"
          >
            <Volume2 className="w-6 h-6" />
          </button>
          <div 
            className="px-5 py-3 rounded-2xl font-bold text-lg border-2"
            style={{ 
              backgroundColor: "var(--bg-secondary)", 
              borderColor: "var(--border-color)",
              color: "var(--text-primary)" 
            }}
          >
            {promptText}
          </div>
        </div>
      )}

      {/* Answer Line Container */}
      <div 
        className="w-full min-h-[70px] border-b-2 border-t-2 border-gray-200 dark:border-gray-700 py-3 flex flex-wrap gap-2 items-center"
        style={{ minHeight: "70px" }}
      >
        {selectedWords.map((word, idx) => (
          <button
            key={`selected-${idx}-${word}`}
            disabled={disabled}
            onClick={() => onRemoveWord(word, idx)}
            className="px-4 py-2.5 rounded-xl font-bold text-base bg-white dark:bg-[#1f2e35] border-2 border-b-4 border-gray-200 dark:border-[#2f434c] shadow-sm hover:bg-gray-50 dark:hover:bg-[#283b44] active:translate-y-[2px] active:border-b-2 transition cursor-pointer"
            style={{ color: "var(--text-primary)" }}
          >
            {word}
          </button>
        ))}
      </div>

      {/* Word Pool Bank */}
      <div className="flex flex-wrap justify-center gap-3 w-full mt-6">
        {words.map((word, idx) => {
          // Check if this instance is already selected
          const isSelected = selectedWords.includes(word);

          return (
            <div key={`pool-${idx}-${word}`} className="relative">
              {/* Placeholder when word is selected */}
              {isSelected && (
                <div className="px-4 py-2.5 rounded-xl bg-gray-200 dark:bg-gray-800 text-transparent opacity-30 select-none">
                  {word}
                </div>
              )}

              {/* Selectable Word Token */}
              {!isSelected && (
                <button
                  disabled={disabled}
                  onClick={() => onSelectWord(word, idx)}
                  className="px-4 py-2.5 rounded-xl font-bold text-base bg-white dark:bg-[#1f2e35] border-2 border-b-4 border-gray-200 dark:border-[#2f434c] text-gray-800 dark:text-gray-100 shadow-sm hover:bg-gray-50 dark:hover:bg-[#283b44] active:translate-y-[2px] active:border-b-2 transition cursor-pointer"
                >
                  {word}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
