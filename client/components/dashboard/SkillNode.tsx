"use client";

import React from "react";
import { Star, Lock, Check, FastForward, Trophy } from "lucide-react";

interface SkillNodeProps {
  status: "locked" | "current" | "completed";
  position: number; // Offset index for serpentine S-curve (-1, 0, 1)
  icon?: string;
  color?: string;
}

export function SkillNode({
  status,
  position,
  icon = "star",
  color = "#58cc02",
}: SkillNodeProps) {
  // S-Curve horizontal offset positioning
  const offsets = [
    "translate-x-0",
    "translate-x-[45px]",
    "translate-x-[75px]",
    "translate-x-[45px]",
    "translate-x-0",
    "-translate-x-[45px]",
    "-translate-x-[75px]",
    "-translate-x-[45px]",
  ];
  
  const offsetClass = offsets[Math.abs(position) % offsets.length] || "translate-x-0";

  const renderIcon = () => {
    if (status === "locked") return <Lock className="w-8 h-8 text-gray-400 fill-gray-400" />;
    if (status === "completed") return <Check className="w-8 h-8 text-white stroke-[4]" />;
    if (icon === "fast-forward") return <FastForward className="w-8 h-8 text-white fill-white" />;
    if (icon === "trophy") return <Trophy className="w-8 h-8 text-white fill-white" />;
    return <Star className="w-8 h-8 text-white fill-white" />;
  };

  return (
    <div className={`relative flex items-center justify-center ${offsetClass}`}>
      {/* Outer 3D Button Container */}
      <div
        className={`w-[70px] h-[70px] rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
          status === "locked"
            ? "bg-gray-200 dark:bg-[#202f36] border-b-4 border-gray-300 dark:border-[#131f24]"
            : status === "completed"
            ? "bg-[#58cc02] border-b-4 border-[#46a302] active:border-b-0 active:translate-y-[4px]"
            : "bg-[#1cb0f6] border-b-4 border-[#1899d6] active:border-b-0 active:translate-y-[4px] shadow-lg animate-pulse"
        }`}
        style={status !== "locked" ? { backgroundColor: color } : {}}
      >
        {renderIcon()}
      </div>
    </div>
  );
}
