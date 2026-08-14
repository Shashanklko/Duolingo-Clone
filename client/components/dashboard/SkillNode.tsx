"use client";

import React from "react";
import { Star, Check, FastForward, Trophy } from "lucide-react";

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
  if (position === 1) offsetClass = "translate-x-[45px]";
  else if (position === 2) offsetClass = "translate-x-[80px]";
  else if (position === -1) offsetClass = "-translate-x-[45px]";
  else if (position === -2) offsetClass = "-translate-x-[80px]";

  // Render authentic 3D Chest
  if (icon === "chest") {
    return (
      <div className={`relative flex items-center justify-center ${offsetClass}`}>
        <div 
          className={`w-[76px] h-[64px] rounded-2xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer relative ${
            status === "completed"
              ? "bg-[#ffc800] border-b-4 border-[#e5a500] shadow-lg"
              : status === "current"
              ? "bg-[#ffd900] border-b-4 border-[#e5a500] shadow-xl ring-4 ring-[#ffd900]/30 animate-pulse"
              : "bg-[#2b383f] border-2 border-[#37464f] border-b-4 border-b-[#182329]"
          }`}
        >
          {/* Chest Lid & Lock Band */}
          <div className={`w-full h-4 rounded-t-xl border-b-2 ${
            status === "locked" ? "bg-[#37464f] border-[#182329]" : "bg-[#ffe033] border-[#cc9400]"
          }`} />
          <div className="flex-1 flex items-center justify-center">
            {/* Center Lock latch */}
            <div className={`w-4 h-5 rounded-md flex items-center justify-center shadow-inner ${
              status === "locked" ? "bg-[#1f292e] border border-[#37464f]" : "bg-[#e5a500]"
            }`}>
              <div className="w-1.5 h-1.5 rounded-full bg-[#131f24]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderIcon = () => {
    if (status === "completed") {
      return <Check className="w-8 h-8 text-white stroke-[4]" />;
    }

    if (icon === "trophy") {
      return (
        <Trophy 
          className={`w-8 h-8 ${
            status === "locked" ? "text-[#4b5563] fill-[#37464f]" : "text-white fill-white"
          }`} 
        />
      );
    }

    if (icon === "fast-forward") {
      return (
        <FastForward 
          className={`w-8 h-8 ${
            status === "locked" ? "text-[#4b5563] fill-[#37464f]" : "text-white fill-white"
          }`} 
        />
      );
    }

    // Default Star
    return (
      <Star 
        className={`w-8 h-8 ${
          status === "locked" ? "text-[#4b5563] fill-[#37464f]" : "text-white fill-white"
        }`} 
      />
    );
  };

  return (
    <div className={`relative flex items-center justify-center ${offsetClass}`}>
      {/* Outer 3D Button Container */}
      <div
        className={`w-[72px] h-[72px] rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
          status === "locked"
            ? "bg-[#253338] border-b-[6px] border-[#182329]"
            : status === "completed"
            ? "bg-[#58cc02] border-b-[6px] border-[#46a302] active:border-b-0 active:translate-y-[4px] shadow-lg"
            : "bg-[#58cc02] border-b-[6px] border-[#46a302] active:border-b-0 active:translate-y-[4px] shadow-2xl ring-4 ring-[#58cc02]/30 animate-bounce"
        }`}
        style={status === "current" ? { backgroundColor: color, borderColor: `${color}99` } : {}}
      >
        {renderIcon()}
      </div>
    </div>
  );
}
