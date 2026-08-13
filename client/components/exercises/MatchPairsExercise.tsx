"use client";

import React, { useState } from "react";
import { playClickSound, playCorrectSound, playWrongSound } from "@/lib/sounds";

export interface PairItem {
  id: string;
  text: string;
  matchId: string; // Identifier connecting the pair
}

interface MatchPairsExerciseProps {
  question: string;
  pairs: PairItem[];
  onComplete: () => void;
  disabled?: boolean;
}

export default function MatchPairsExercise({
  question,
  pairs,
  onComplete,
  disabled = false,
}: MatchPairsExerciseProps) {
  const [selectedFirst, setSelectedFirst] = useState<PairItem | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [wrongPair, setWrongPair] = useState<[string, string] | null>(null);

  const handleCardClick = (item: PairItem) => {
    if (disabled || matchedIds.includes(item.id)) return;

    playClickSound();

    if (!selectedFirst) {
      // First selection
      setSelectedFirst(item);
      setWrongPair(null);
    } else {
      // Second selection
      if (selectedFirst.id === item.id) {
        // Deselect if clicked same card
        setSelectedFirst(null);
        return;
      }

      if (selectedFirst.matchId === item.matchId) {
        // Correct match!
        playCorrectSound();
        const newMatched = [...matchedIds, selectedFirst.id, item.id];
        setMatchedIds(newMatched);
        setSelectedFirst(null);
        setWrongPair(null);

        // Check if all pairs matched
        if (newMatched.length === pairs.length) {
          onComplete();
        }
      } else {
        // Wrong match
        playWrongSound();
        setWrongPair([selectedFirst.id, item.id]);
        setTimeout(() => {
          setSelectedFirst(null);
          setWrongPair(null);
        }, 800);
      }
    }
  };

  return (
    <div className="w-full max-w-[600px] flex flex-col items-center gap-y-6">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-left w-full" style={{ color: "var(--text-primary)" }}>
        {question}
      </h2>

      <div className="grid grid-cols-2 gap-4 w-full mt-4">
        {pairs.map((item) => {
          const isMatched = matchedIds.includes(item.id);
          const isSelected = selectedFirst?.id === item.id;
          const isWrong = wrongPair?.includes(item.id);

          return (
            <button
              key={item.id}
              disabled={disabled || isMatched}
              onClick={() => handleCardClick(item)}
              className={`p-4 sm:p-5 rounded-2xl font-bold text-lg border-2 border-b-4 transition-all duration-200 cursor-pointer flex items-center justify-center min-h-[70px] ${
                isMatched
                  ? "opacity-30 border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 cursor-default"
                  : isWrong
                  ? "border-[#ff4b4b] bg-red-100 dark:bg-red-950 text-[#ff4b4b] animate-shake"
                  : isSelected
                  ? "border-[#1cb0f6] bg-[#1cb0f6]/10 text-[#1cb0f6]"
                  : "border-gray-200 dark:border-[#2f434c] bg-white dark:bg-[#131f24] hover:bg-gray-50 dark:hover:bg-[#1f2e35]"
              }`}
              style={
                !isMatched && !isSelected && !isWrong
                  ? { color: "var(--text-primary)" }
                  : {}
              }
            >
              {item.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
