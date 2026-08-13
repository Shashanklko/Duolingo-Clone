"use client";

import React from "react";
import { Star, Lock, Check, FastForward, Trophy } from "lucide-react";

interface SkillNodeProps {
  status: "locked" | "current" | "completed";
  position: number; // Offset index for serpentine S-curve (-2, -1, 0, 1, 2)
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
  let offsetClass = "translate-x-0";
  if (position === 1) offsetClass = "translate-x-[48px]";
  else if (position === 2) offsetClass = "translate-x-[85px]";
  else if (position === -1) offsetClass = "-translate-x-[48px]";
  else if (position === -2) offsetClass = "-translate-x-[85px]";

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
        className={`w-[72px] h-[72px] rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
          status === "locked"
            ? "bg-[#202f36] border-b-4 border-[#131f24]"
            : status === "completed"
            ? "bg-[#58cc02] border-b-4 border-[#46a302] active:border-b-0 active:translate-y-[4px] shadow-lg"
            : "bg-[#1cb0f6] border-b-4 border-[#1899d6] active:border-b-0 active:translate-y-[4px] shadow-xl ring-4 ring-[#1cb0f6]/30 animate-bounce"
        }`}
        style={status !== "locked" ? { backgroundColor: color } : {}}
      >
        {renderIcon()}
      </div>
    </div>
  );
}
