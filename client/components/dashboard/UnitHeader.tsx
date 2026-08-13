"use client";

import React, { useState } from "react";
import { BookOpen } from "lucide-react";
import GuidebookModal from "@/components/modals/GuidebookModal";

interface UnitHeaderProps {
  title: string;
  description: string;
  color?: string;
}

export function UnitHeader({ title, description, color = "#58cc02" }: UnitHeaderProps) {
  const [isGuidebookOpen, setIsGuidebookOpen] = useState(false);

  return (
    <>
      <div
        className="w-full rounded-2xl p-5 text-white flex items-center justify-between shadow-md relative overflow-hidden transition-all"
        style={{ backgroundColor: color }}
      >
        <div className="flex flex-col gap-y-1 z-10 max-w-[340px]">
          <h2 className="text-2xl font-black tracking-wide uppercase drop-shadow-sm">
            {title}
          </h2>
          <p className="text-sm font-bold opacity-90 drop-shadow-sm leading-snug">
            {description}
          </p>
        </div>

        <button
          onClick={() => setIsGuidebookOpen(true)}
          className="z-10 flex items-center gap-x-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 font-extrabold text-xs uppercase tracking-wider text-white border-2 border-white/40 backdrop-blur-sm transition active:scale-95 cursor-pointer flex-shrink-0"
        >
          <BookOpen className="w-4 h-4 stroke-[3]" />
          <span>Guidebook</span>
        </button>
      </div>

      <GuidebookModal 
        isOpen={isGuidebookOpen} 
        onClose={() => setIsGuidebookOpen(false)} 
        title={title || "Unit Guidebook"}
        description={description || "Key phrases and grammar tips"}
      />
    </>
  );
}
