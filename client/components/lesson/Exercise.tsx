"use client";

import React from "react";
import Image from "next/image";
import WordBankExercise from "@/components/exercises/WordBankExercise";

interface ExerciseProps {
  exercise: any;
  selected: any;
  onSelect: (val: any) => void;
  selectedWords?: string[];
  onSelectWords?: (words: string[]) => void;
}

export function Exercise({
  exercise,
  selected,
  onSelect,
  selectedWords = [],
  onSelectWords = () => {},
}: ExerciseProps) {
  if (!exercise) return null;

  if (exercise.type === "word_bank" || exercise.type === "tile_build") {
    const wordList = Array.isArray(exercise.options)
      ? exercise.options
      : typeof exercise.options === "string"
      ? JSON.parse(exercise.options)
      : [];

    return (
      <WordBankExercise
        question={exercise.question}
        words={wordList}
        selectedWords={selectedWords}
        onSelectWord={(word) => onSelectWords([...selectedWords, word])}
        onRemoveWord={(_, idx) => {
          const updated = [...selectedWords];
          updated.splice(idx, 1);
          onSelectWords(updated);
        }}
      />
    );
  }

  const optionsList = Array.isArray(exercise.options)
    ? exercise.options
    : typeof exercise.options === "string"
    ? JSON.parse(exercise.options)
    : [];

  return (
    <div className="w-full max-w-[600px] flex flex-col items-center gap-y-6">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-left w-full" style={{ color: "var(--text-primary)" }}>
        {exercise.question}
      </h2>

      {exercise.type === "image_choice" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
          {optionsList.map((opt: any, idx: number) => {
            const isSelected = selected === idx;
            const textVal = typeof opt === "string" ? opt : opt.text;
            const imgUrl = typeof opt === "object" ? opt.image : null;

            return (
              <button
                key={idx}
                onClick={() => onSelect(idx)}
                className={`flex flex-col items-center justify-between p-4 rounded-2xl border-2 border-b-4 transition-all cursor-pointer ${
                  isSelected
                    ? "border-[#1cb0f6] bg-[#1cb0f6]/10"
                    : "border-gray-200 dark:border-[#2f434c] bg-white dark:bg-[#131f24] hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {imgUrl && typeof imgUrl === "string" && imgUrl.startsWith("http") ? (
                  <img src={imgUrl} alt={textVal} className="w-[70px] h-[70px] object-contain rounded-md mb-2" />
                ) : (
                  <div className="w-[70px] h-[70px] bg-blue-100 dark:bg-blue-950 rounded-xl flex items-center justify-center text-2xl font-bold mb-2">
                    🖼️
                  </div>
                )}
                <span className="font-extrabold text-sm text-center" style={{ color: "var(--text-primary)" }}>
                  {textVal}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-y-3 w-full">
          {optionsList.map((opt: any, idx: number) => {
            const isSelected = selected === idx;
            const textVal = typeof opt === "string" ? opt : opt.text;

            return (
              <button
                key={idx}
                onClick={() => onSelect(idx)}
                className={`w-full p-4 rounded-2xl border-2 border-b-4 text-left font-extrabold text-base transition-all cursor-pointer ${
                  isSelected
                    ? "border-[#1cb0f6] bg-[#1cb0f6]/10 text-[#1cb0f6]"
                    : "border-gray-200 dark:border-[#2f434c] bg-white dark:bg-[#131f24] hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200"
                }`}
              >
                {textVal}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
