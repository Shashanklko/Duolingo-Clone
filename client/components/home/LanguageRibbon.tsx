"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface RibbonItem {
  name: string;
  label: string;
  flagCode?: string;
  icon?: string;
}

export const RIBBON_ITEMS: RibbonItem[] = [
  { name: "ENGLISH", label: "English", flagCode: "us" },
  { name: "CHESS", label: "Chess", icon: "♟️" },
  { name: "MATH", label: "Math", icon: "➕" },
  { name: "SPANISH", label: "Spanish", flagCode: "es" },
  { name: "FRENCH", label: "French", flagCode: "fr" },
  { name: "GERMAN", label: "German", flagCode: "de" },
  { name: "ITALIAN", label: "Italian", flagCode: "it" },
  { name: "PORTUGUESE", label: "Portuguese", flagCode: "br" },
  { name: "JAPANESE", label: "Japanese", flagCode: "jp" },
  { name: "ARABIC", label: "Arabic", flagCode: "sa" },
  { name: "KOREAN", label: "Korean", flagCode: "kr" },
  { name: "RUSSIAN", label: "Russian", flagCode: "ru" },
];

interface LanguageRibbonProps {
  selectedItem?: RibbonItem | null;
  onSelectItem?: (item: RibbonItem) => void;
}

export default function LanguageRibbon({ selectedItem, onSelectItem }: LanguageRibbonProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = direction === "left" ? -240 : 240;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full border-t border-b border-gray-200 bg-white py-3.5 relative overflow-hidden">
      <div className="max-w-[1056px] mx-auto px-10 flex items-center relative">
        {/* Left Scroll Arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 z-10 p-1 text-gray-400 hover:text-gray-600 transition cursor-pointer"
          type="button"
        >
          <ChevronLeft className="w-5 h-5 stroke-[3]" />
        </button>

        {/* Scrollable Ribbon */}
        <div
          ref={scrollRef}
          className="flex items-center gap-x-8 overflow-x-auto scrollbar-none py-1 scroll-smooth w-full px-4"
          style={{ scrollbarWidth: "none" }}
        >
          {RIBBON_ITEMS.map((item) => {
            const isSelected = selectedItem?.name === item.name;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => onSelectItem?.(item)}
                className={`flex items-center gap-x-2.5 flex-shrink-0 transition-all cursor-pointer py-1.5 px-3 rounded-xl ${
                  isSelected
                    ? "bg-[#1cb0f6]/10 text-[#1cb0f6] ring-2 ring-[#1cb0f6]/40"
                    : "hover:bg-gray-100 text-gray-500 hover:text-gray-900"
                }`}
              >
                {item.flagCode ? (
                  <Image
                    src={`https://flagcdn.com/w40/${item.flagCode}.png`}
                    alt={item.name}
                    width={24}
                    height={18}
                    className="rounded-sm object-cover border border-gray-300 flex-shrink-0"
                    onError={(e) => {
                      (e.target as any).src = "https://flagcdn.com/w40/un.png";
                    }}
                  />
                ) : (
                  <span className="text-base leading-none">{item.icon}</span>
                )}
                <span className={`font-black text-[13px] uppercase tracking-wider ${
                  isSelected ? "text-[#1cb0f6]" : "text-gray-500"
                }`}>
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Scroll Arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 z-10 p-1 text-gray-400 hover:text-gray-600 transition cursor-pointer"
          type="button"
        >
          <ChevronRight className="w-5 h-5 stroke-[3]" />
        </button>
      </div>
    </div>
  );
}
